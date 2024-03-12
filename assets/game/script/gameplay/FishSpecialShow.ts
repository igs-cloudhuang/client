import prot from '../network/protocol/protocol.js';
import { _decorator, Component, tween, Node, v3, equals } from 'cc';
import { soundManager, walletManager, bufferType } from 'db://annin-framework/manager';
import { rInt, trans3DPos, find, shake2D, rItem } from 'db://annin-framework/utils';
import { SceneEvent, EffectNo, FishKind, FishMedal, SoundName, MusicName } from './GameDefine';
import { delay } from '../system/ToolBox';
import Fish from './Fish';
import WitchShow from './WitchShow';
import RewardCircle from './RewardCircle';
import ChangeSceneByRunCamera from './ChangeSceneByRunCamera';
import LeftRewardCircle from './LeftRewardCircle';
import WheelControl from './WheelControl';
import FishHitAckData from './FishHitAckData';
import { xorshift32 } from '../utils/Xorshift32';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('FishSpecialShow')
export default class FishSpecialShow extends Component {

    @property
    kind: FishKind = FishKind.None;

    /**
     * 表演準備
     */
    showReady(ack: any) {
    }

    /**
     * 表演開始
     */
    showStart(ack: any, rewardShow: boolean, bUpdateSeat: boolean) {
        if (!rewardShow) {
            this.commonNoShow(ack as prot.protocol.HitAckData, bUpdateSeat);
            return;
        }

        switch (this.kind) {
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.Queen:
            case FishKind.King: {
                // 延遲一個FRAME，如果有第二隻死去先等他死
                delay(this.node, 0, () => {
                    this.commonShow(ack as prot.protocol.HitAckData);
                });
                break;
            }
            case FishKind.WheelChest: {
                // 延遲一個FRAME，如果有第二隻死去先等他死
                delay(this.node, 0, () => {
                    // this.bombGoblinStart(ack as prot.protocol.HitAckData);
                    this.wheelStart(ack as prot.protocol.HitAckData);
                });
                break;
            }
            case FishKind.RedWitch: {
                // 延遲一個FRAME，如果有第二隻死去先等他死
                delay(this.node, 0, () => {
                    this.redWitchStart(ack as prot.protocol.HitAckData);
                });
                break;
            }
            case FishKind.TreasureChest: {
                // 延遲一個FRAME，如果有第二隻死去先等他死
                delay(this.node, 0, () => {
                    this.treasureStart(ack as prot.protocol.HitAckData);
                });
                break;
            }
        }
    }

    /**
     * 表演結束
     */
    showEnd(ack: any) {
    }

    // ----------------------------------------------------------------
    // 表演流程
    // ----------------------------------------------------------------

    /**
     * 非主塔給獎流程
     * @param ack server HitAckData
     * @param bUpdateSeat 是否需更新補位(表示只有1隻死亡)
     */
    commonNoShow(ack: prot.protocol.HitAckData, bUpdateSeat: boolean) {
        let fish = this.node.getComponent(Fish);
        fish.bCoinDrop = true;
        fish.setUsed(false);

        let wait = 0.5;
        let wheelDelay = 0;    // 轉輪整段時間

        // 這邊要存副塔的 jp 資料
        let piggyCoinDelay = 0;
        if (ack.remove[0].jackpot || ack.remove[0].bonus) {
            Game.piggyBank.ackQueue.push(ack);
            if (bUpdateSeat) piggyCoinDelay = 1.5;    // 如果副塔有噴 JP, piggyCoinDelay = 噴豬幣時間長度 + 收豬幣時間長度
        }

        switch (this.kind) {
            case FishKind.TreasureChest: {
                fish.bTowerMostBeDestroy = true;
                wait = 1.6;
                break;
            }
            case FishKind.WheelChest: {
                let ok = Game.wheelMgr.addWheel(ack);
                fish.bTowerMostBeDestroy = true;
                wait = 1.6;
                wheelDelay = ok? wait : 0;
                break;
            }
        }

        delay(Game.main.node, wait, () => {
            if (piggyCoinDelay == 0 && wheelDelay == 0) {
                this.smallReward(ack);
                if (bUpdateSeat) { this.updateSeat(ack, true); }
            } else if (bUpdateSeat) {
                if (piggyCoinDelay > 0) {
                    delay(Game.main.node, piggyCoinDelay, () => {
                        this.checkBankReward();
                    });
                } else if (wheelDelay > 0) {
                    this.checkWheelShow();
                }
            }
        });

        Game.fishMgr.delFish(fish, true, false);
    }

    commonShow(ack: prot.protocol.HitAckData) {
        let fish = this.node.getComponent(Fish);
        fish.bCoinDrop = true;
        fish.setUsed(false);

        Game.uiCtrl.setOddsBoardActive(false);
        [fish.bTowerMostBeDestroy, fish.bUp02Dead] = this.showReward(ack);
        Game.fishMgr.delFish(fish, true, false);
    }

    /**
     * 留存砲擊殺表演
     */
    retainShow() {
        let fish = this.node.getComponent(Fish);
        fish.bTowerMostBeDestroy = true;
        fish.bCoinDrop = true;
        fish.setUsed(false);

        Game.fishMgr.delFish(fish, true, false);
    }

    /**
     * 紅魔女表演
     */
    redWitchStart(ack: prot.protocol.HitAckData) {
        let witch = this.node.getComponent(Fish);
        let posRL = v3(witch.node.position);

        let odd = Math.round(ack.coin / ack.bet);
        if (odd <= witch.getOdds(0)) {
            witch.bCoinDrop = true;
            this.showReward(ack);
        } else {
            let base = this.getBaseOddsByMoreOdds(ack);

            let list: Fish[] = [];
            for (let i = 1; i <= 5; ++i) {
                let fish = Game.fishMgr.getFishTower(i);
                if (fish && fish.isUsed()) {
                    list.push(fish);
                }
            }

            // 挑選要炸飛的魚
            let indices = [] as number[];
            let fishes = this.findFishesByOdds(list, odd);
            for (let i = 0; i < fishes.length; ++i) {
                indices.push(fishes[i].getFishId());
            }
            Game.main.C2S_Giveup(1, indices);

            delay(Game.main.node, 0.25, () => {
                // 給獎表演UI
                let delayT = 0;
                let reward = Game.dataMgr.getReward(FishMedal.RedWitch);
                reward.parent = Game.node.rewardLayer;

                if (reward) {
                    let show = reward.getComponent(WitchShow);
                    if (show) { delayT = show.init(base, ack.coin, fishes, posRL); }
                }

                Game.piggyBank.canDropPigCoin = false;
                delay(Game.main.node, delayT, () => {
                    Game.piggyBank.canDropPigCoin = true;
                    this.smallReward(ack);
                    if (!this.checkBankReward()) {
                        if (!this.checkWheelShow()) {
                            Game.fishMgr.updateSeat(0, () => { Game.main.stopShooting(false); });
                        }
                    }
                })
            })
        }

        Game.uiCtrl.setOddsBoardActive(false);
        witch.bTowerMostBeDestroy = true;
        Game.fishMgr.delFish(witch, true, false);
    }

    /**
     * 轉輪塔表演
     * @param ack 
     */
    wheelStart(ack: prot.protocol.HitAckData) {
        let wheel = this.node.getComponent(Fish);
        let hitAck = this.node.getComponent(FishHitAckData);
        hitAck.ack = ack;

        let bShowWheel = Game.wheelMgr.addWheel(ack);

        // 等待轉輪塔的表演Delay
        delay(Game.main.node, 4.3, () => {
            if (bShowWheel) {
                this.checkWheelShow();
            } else {
                this.smallReward(ack);
                if (!this.checkBankReward()) {
                    if (!this.checkWheelShow()) {
                        this.updateSeat(ack, true);
                    }
                }
            }
        });

        wheel.setUsed(false);
        wheel.bCoinDrop = true;
        Game.main.stopShooting(true, 180);
        Game.uiCtrl.setOddsBoardActive(false);
        Game.fishMgr.delFish(wheel, true, false);
    }

    
    /**
     * 檢查是否有轉輪表演，有就表演
     * 流程: 是否有轉輪 -> 有 -> 表演轉輪 -> 表演結束，檢查是否有轉輪JP -> 有 -> 表演轉輪JP -> 表演結束，檢查是否有豬幣的JP -> 有 -> 表演JP，結束後 -> 回到開始檢查是否有轉輪表演 -> 有 -> Loop
     *                 └> 沒 -> 結束                                └> 沒 -> 表演結束，檢查是否有豬幣的JP ↗             └> 沒                 ↗                          └> 沒 -> 結束並補位
     * @returns 
     */
    checkWheelShow() {
        let wheel = Game.wheelMgr.getWheel();
        if (wheel) {
            let wheelNode = Game.dataMgr.getWheelNode();
            let pos = Game.gameCtrl.getUICenterPos();
            wheelNode.setPosition(pos.add3f(0, 50, 0));
            wheelNode.setParent(Game.node.rewardLayer);
    
            wheelNode.getComponent(WheelControl).init(wheel.more, () => {

                // 如果有轉輪JP
                if (wheel.jp > 0) {
                    let { type } = wheel.ack.remove[0].jackpot;
                    Game.jpBoard.showJPReward(wheel.ack.bet, wheel.jp, (type - 1) as unknown as (0 | 1 | 2 | 3), () => {
                        this.smallReward(wheel.ack);

                        walletManager.buffering(bufferType.Reward, walletManager.myUserID, -wheel.jp)
                        walletManager.updateClientRemains(walletManager.myUserID);

                        if (!this.checkBankReward()) {
                            if (!this.checkWheelShow()) {
                                this.updateSeat(wheel.ack, true);
                            }
                        }

                    });
                } else {
                    this.smallReward(wheel.ack);
                    if (!this.checkBankReward()) {
                        if (!this.checkWheelShow()) {
                            this.updateSeat(wheel.ack, true);
                        }
                    }
                }

            });
        }
        return wheel
    }

    /**
     * 檢查是否有撲滿表演 (檢查副位還有沒有 JP | 藏寶庫 表演)
     */
    checkBankReward(): boolean {
        let ack = Game.piggyBank.ackQueue.shift();
        if (ack) {
            Game.piggyBank.showReward(ack, () => {
                let coin = 0
                if (ack.remove[0]?.jackpot?.coin) { coin = ack.remove[0].jackpot.coin; }
                else if (ack.remove[0]?.bonus?.coin) { coin = ack.remove[0].bonus.coin; }

                walletManager.buffering(bufferType.Reward, walletManager.myUserID, -coin)
                walletManager.updateClientRemains(walletManager.myUserID);

                if (!this.checkBankReward()) {
                    if (!this.checkWheelShow()) {
                        this.updateSeat(ack, true);
                    }
                }
            })
        }
        return !!ack;
    }

    /**
     * 攻城寶箱表演
     */
    treasureStart(ack: prot.protocol.HitAckData) {
        console.log(ack, 'treasureStart')
        let chest = this.node.getComponent(Fish);
        let hitAck = this.node.getComponent(FishHitAckData);
        hitAck.ack = ack;

        Game.main.stopShooting(true);
        Game.uiCtrl.setOddsBoardActive(false);
        Game.uiCtrl.setBetList();
        Game.uiCtrl.setBetBtnInteractable(false);
        Game.uiCtrl.setSummonBtnInteractable(false);
        // if (appManager.isLicense) {
            // Game.uiCtrl.setAutoBtnInteractable(false);
        // }
        Game.uiCtrl.setTorpedoBtnInteractable(false);

        if (!ack.remove[0].meta) {
            delay(Game.main.node, 4.2, () => {
                this.showReward(ack);
            });
            chest.bCoinDrop = true;
            Game.fishMgr.delFish(chest, true, false);
            Game.uiCtrl.setBetBtnInteractable(true);
            Game.uiCtrl.setTorpedoBtnInteractable(true);
            Game.uiCtrl.setAutoBtnInteractable(true);
            Game.uiCtrl.setSummonBtnInteractable(true);
            return;
        }

        // if (appManager.isLicense) {
        //     let list: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        //     Game.shootMgr.checkAutoAndSet(list);
        // }

        Game.bgMgr.switchSceneEvent(SceneEvent.Treasure, true);
        Game.shootMgr.checkStopAutoMatic('free', 0);
        Game.piggyBank.canDropPigCoin = false;
        Game.fishMgr.delFish(chest, true, false);

        delay(Game.main.node, 4.2, () => {
            Game.bgMgr.showKey();
            Game.piggyBank.canDropPigCoin = true;
            soundManager.playEffect(SoundName.tower06_blow3);
        });

        Game.fishMgr.setBreakLevel(-1);
        Game.fishMgr.saveKeepFishScriptData();
        delay(Game.main.node, 4.2 + 1 + 1 + 0.75 + 1.45, () => {
            // 讓出空間
            for (let i = 0; i <= 6; ++i) {
                let fish = Game.fishMgr.getFishTower(i);
                if (fish && fish.isUsed()) {
                    Game.fishMgr.setBreakLevel(fish.getFishId(), fish.getBreakLv());
                    switch (i) {
                        case 0:
                        case 1:
                        case 2:
                        case 5: {
                            tween(fish.node)
                                .by(0.5, { position: v3(-300, 0, 0) })
                                .call(() => {
                                    Game.fishMgr.delFish(fish, false, true);
                                })
                                .start()
                            break;
                        }
                        case 3:
                        case 4:
                        case 6: {
                            tween(fish.node)
                                .by(0.5, { position: v3(300, 0, 0) })
                                .call(() => {
                                    Game.fishMgr.delFish(fish, false, true);
                                })
                                .start()
                            break;
                        }
                    }
                }
            }

            Game.bgMgr.addDoorOpenEfk();
            Game.piggyBank.hideBankUI(true);
            Game.cam3D.getComponent(ChangeSceneByRunCamera).chanegeScene3();

            // 表演開地下室
            Game.bgMgr.openTheDoor(() => {
                // 位置更新
                Game.fishMgr.enterTreasure();
                delay(Game.main.node, 2, () => {
                    Game.fishMgr.clearFishList();
                    Game.treasureMgr.setServerData(prot.protocol.Treasures.decode(ack.remove[0].meta.value), ack.coin, ack.bet, ack.plate, false, () => {
                        if (!this.checkBankReward()) {
                            if (!this.checkWheelShow()) {
                                this.updateSeat(ack, true);
                            }
                        }
                    });
                    // 標題打開才解鎖
                    Game.fishMgr.readyToUpdateSeat(() => {});
                    Game.jpBoard.showPigCoinUI(true, true);
                    // comm.bgMgr.addScoreStoneEfk();
                })

                // 換砲台
                let turret = Game.main.getTurret();
                if (turret) {
                    turret.switchAvatar();
                }

                Game.uiCtrl.setBtnsInTreasure(false);
            });
            soundManager.playEffect(SoundName.Treasure01);
        });
    }

    /**
     * 給獎結算
     * @returns 是否乘倍表演 
     */
    showReward(ack: prot.protocol.HitAckData): [boolean, boolean] {
        let odds = Math.round(ack.coin / ack.bet);
        let base = this.getBaseOddsByMoreOdds(ack);

        let bBreak = false, up02Dead = false;
        let delayUpdateSeat = 0;

        // 如果主塔有噴jp，piggyCoinDelay = 噴豬幣時間長度 + 收豬幣時間長度
        let piggyCoinDelay = 0;
        let hasOtherReward = false;
        if (ack.remove[0].jackpot || ack.remove[0].bonus) {    // ack.remove[0] 必有值
            piggyCoinDelay = 1;
            Game.piggyBank.ackQueue.unshift(ack);    // 如果有JP或藏寶庫，先存起來
        }

        if (base === odds) {
            switch (this.kind) {
                case FishKind.None:
                case FishKind.ArcherGoblin:
                case FishKind.SwordMan:
                case FishKind.Viking:
                case FishKind.ArmorSoldier:
                case FishKind.Knight:
                case FishKind.ArmorFighter:
                case FishKind.GoldenKnight:
                case FishKind.RedWitch: {
                    bBreak =  Math.random() < 0.2;
                    delayUpdateSeat = bBreak? 1.2 : 0.5;
                    break;
                }
                case FishKind.Queen:
                case FishKind.King: {
                    // 是否要失衡摔死
                    up02Dead = (Math.random() < 0.1 && !Game.bgMgr.isEventOfScene(SceneEvent.Treasure));
                    bBreak =  Math.random() < 0.35;

                    if (bBreak) {
                        delayUpdateSeat = 1.2;
                        up02Dead = false;
                    } else {
                        if (up02Dead) {
                            delayUpdateSeat = 1.8;
                        } else {
                            delayUpdateSeat = 0.5;
                        }
                    }
                    break;
                }
                case FishKind.WheelChest:
                case FishKind.TreasureChest: {
                    delayUpdateSeat = 1.8;
                    break;
                }
                case FishKind.WheelChest: {
                    delayUpdateSeat = 0.5;
                    break;
                }
            }
        } else {
            bBreak = true;
        }

        if (base === odds) {
            let de = delayUpdateSeat - 0.5;
            de = de < 0 ? 0 : de;

            delay(Game.main.node, de, () => {
                this.smallReward(ack);
            });
            delay(Game.main.node, 0, () => {
                delay(Game.main.node, delayUpdateSeat, () => {
                    this.updateSeat(ack, piggyCoinDelay == 0 ? true : false);
                });
            });
        } else {
            Game.main.stopShooting(true, 180);

            hasOtherReward = true;

            delay(Game.main.node, 0.9, () => {
                let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_1);
                let reward = rewardNode.getComponent(RewardCircle);
                reward.node.setParent(Game.node.rewardLayer);
                reward.showRolling_2(base * ack.bet, ack.bet, ack.coin, () => {
                    reward.node.destroy();
                    this.smallReward(ack);

                    // 乘倍結束後, 檢查是否還有其他 JP 或 藏寶庫
                    if (!this.checkBankReward()) {
                        if (!this.checkWheelShow()) {
                            this.updateSeat(ack, true);
                        }
                    }
                });
                soundManager.playEffect(SoundName.gem03);
            });
        }

        if (piggyCoinDelay > 0 && !hasOtherReward) {
            delay(Game.main.node, piggyCoinDelay, () => {
                if (!this.checkBankReward()) {
                    if (!this.checkWheelShow()) {
                        this.updateSeat(ack, true);
                    }
                }
            });
        }

        return [bBreak, up02Dead];
    }

    /**
     * 靠左小獎圈
     */
    smallReward(ack: prot.protocol.HitAckData) {
        let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_2);
        let reward = rewardNode.getComponent(LeftRewardCircle);

        // 調整層級，確保從上往下排序
        let node = find(Game.node.rewardLayer, 'Pos_1');
        if (node) {
            let list = node.children;
            list.forEach((L, zi) => L.setSiblingIndex(zi));
            rewardNode.setSiblingIndex(node.children.length);
        }
        reward.node.setParent(find(Game.node.rewardLayer, 'Pos_1'));

        // 配合彈金幣動畫
        delay(Game.main.node, 1, () => {
            Game.effectMgr.playUserCoinNumAnim(ack.coin);
            this.updateCoin(ack);
        });

        reward.init(this.kind, ack.coin, false, () => reward.node.destroy());
    }

    /**
     * 結算表演完更新顯示金額
     */
    updateCoin(ack: prot.protocol.HitAckData) {
        walletManager.buffering(bufferType.Reward, walletManager.myUserID, -ack.coin);
        Game.main.updateTurretCoin();
        Game.broadcast.transMessage(ack.coin);

        // comm.fishMgr.updateSeat(() => { comm.gameCtrl.stopShooting(false); });
    }

    /**
     * 更新位置，須確保在 comm.fishMgr.delFish 之後做事，(第一隻補位)完成後解鎖射擊限制
     * @param ack HitAckData
     * @param bControl 如果還有其他表演，此為 false
     */
    updateSeat(ack: prot.protocol.HitAckData, bControl: boolean) {
        Game.fishMgr.readyToUpdateSeat(() => {
            delay(Game.main.node, Game.fishMgr.moveTime, () => {
                if (bControl) { Game.main.stopShooting(false); }
            });
        });
    }

    /**
     * 算出足夠的倍率表演
     * @param fishes 
     * @param max 
     * @returns 
     */
    findFishesByOdds(fishes: Fish[], max: number) {
        let res: Fish[] = [];
        let temp: Fish[] = [];
        temp.push(...fishes);

        // 先用最大找
        let i = 0;
        while (i < temp.length) {
            if (max > temp[i].getOdds(2)) {
                max -= temp[i].getOdds(2);
                res.push(temp[i]);
                temp.splice(i, 1);
                
            } else {
                ++i;
            }
        }

        // 剩餘的去補差值
        i = 0;
        while (i < temp.length) {
            if (max > temp[i].getOdds(1)) {
                max -= temp[i].getOdds(1);
                res.push(temp[i]);
                temp.splice(i, 1);
            } else {
                ++i;
            }
        }

        // 剩餘的去補差值
        i = 0;
        while (i < temp.length) {
            if (max > temp[i].getOdds(0)) {
                max -= temp[i].getOdds(0);
                res.push(temp[i]);
                temp.splice(i, 1);
            } else {
                ++i;
            }
        }

        return res
    }

    /**
     * 因應乘倍效果，取得要顯示的基本倍率
     */
    getBaseOddsByMoreOdds(ack: prot.protocol.HitAckData) {
        let value = Math.round(ack.coin / ack.bet);    // 倍率
        let fish = this.node.getComponent(Fish);

        switch (this.kind) {
            case FishKind.RedWitch: {
                if (value > fish.getOdds(0)) {
                    // 優先由大到小判斷
                    let list = [2, 3, 5];
                    for (let i = list.length - 1; i >= 0; --i) {
                        if (this.isDivisibleBy(value, list[i])) {
                            value = list[i];
                            break;
                        }
                    }
                }
                break;
            }
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.Queen:
            case FishKind.King: {
                // 先確定是否有乘倍 (X2, X3, X5)
                let list = fish.getListOdds();
                let hasMulNum = list.some(baseOdds => {
                    return baseOdds * 2 === value || baseOdds * 3 === value || baseOdds * 5 === value
                });
                if (!hasMulNum)
                    break;

                // 確定有乘倍的情況下
                // 如果贏分倍率等於某個基礎倍率, 有一定機率不會進寶石充能介面
                // 反之必進寶石充能介面
                let prob = 100;
                let bltID = ack.bulletId;
                let newSeed = xorshift32(bltID);    // 必為整數
                if (list.some(baseOdds => baseOdds === value)) {
                    prob = newSeed % 100;
                }
                if (prob < 30) {
                    let chooseList = list.filter(baseOdds => {
                        return baseOdds * 2 === value || baseOdds * 3 === value || baseOdds * 5 === value;
                    });
                    newSeed = xorshift32(newSeed);
                    value = chooseList[newSeed % chooseList.length];
                }
                break;
            }
        }

        return value;
    }

    isDivisibleBy(num1: number, num2: number): boolean {
        let odds = num1 / num2;
        let diff = Math.round(odds) - odds;
        return equals(diff, 0);
    }

}