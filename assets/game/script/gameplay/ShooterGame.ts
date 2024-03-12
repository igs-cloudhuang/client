import prot from '../network/protocol/protocol.js';
import { _decorator, Component, EventTouch, log, Node, v3, Vec3, Button, Tween } from 'cc';
import { i18nManager, msgboxManager, soundManager, walletManager, appManager, bufferType } from 'db://annin-framework/manager';
import { find, get3Dto2DPos, rInt, shake2D, trans3DPos } from 'db://annin-framework/utils';
import { SceneEvent, AvatarNo, FishKind, FishMedal, SoundName, MusicName, FishNo } from './GameDefine';
import { delay, poll } from '../system/ToolBox';
import Fish from './Fish';
import Turret from './Turret';
import RewardCircle from './RewardCircle';
import LeftRewardCircle from './LeftRewardCircle';
import { ButtonMovement } from './ButtonMovement';
import Game, { GameLog } from '../system/Game';
import WheelControl from './WheelControl';

const { ccclass, property } = _decorator;

@ccclass('ShooterGame')
export class ShooterGame extends Component {

    @property(Turret)
    turret: Turret = null;                                       // 砲台的元件

    isPageVisible: boolean = true;                               // 當前頁面是否可見

    private currIdleTime: number = 0;                            // 記錄閒置時間 (玩家有動作後才會清零)
    private maxIdleTime: number = 550;                           // 超過閒置時間斷線 (9.5 分鐘)
    private maxShootCount: number = 15;                          // 射擊的子彈最多 keep N 發, 如果 server 都沒回應就不給發射
    private shootCount: number = 0;                              // 射擊的子彈最多 keep N 發, 如果 server 都沒回應就不給發射
    private hitFishAckList: prot.protocol.HitAckData[] = [];     // hit fish array

    private hitFailCnt: number = 0;
    private checkDepositTask: Tween<Node> = null;                // 儲值跳出的檢查計時器

    private plate: prot.protocol.IFish[] = [];
    private rawJP: number = 0;                                   // 總彩金(DB 值非顯示值)

    onLoad() {
        Game.main = this;
    }

    start() {
        soundManager.playMusic(MusicName.bgm1);
        this.initPlayerTouch();
    }

    update(dt: number) {
        // 一次處理一個事件
        if (this.hitFishAckList.length > 0) {
            let turret = this.getTurret();
            if (turret) {
                if (!turret.isLocked()) {
                    this.hitFishAck(this.hitFishAckList[0]);
                    this.hitFishAckList.splice(0, 1);
                }
            }
        }
    }

    onDestroy() {
        Tween.stopAllByTarget(this.node);
        Game.main = null;
    }

    set Plate(fishes: prot.protocol.IFish[]) {
        this.plate = fishes;
    }
    get Plate(): prot.protocol.IFish[] {
        return this.plate ?? [];
    }

    /**
     * 設定玩家點擊事件
     */
    private initPlayerTouch() {
        let touch = find(Game.node.buttonUpperLayer, 'BottomPanel/sooting_ui_02');
        let touchBtn = touch.getComponent(Button);
        let touchBtnMov = touch.getComponent(ButtonMovement);
        let normalSpr = touchBtn.normalSprite;
        let pressSpr = touchBtn.pressedSprite;

        touch.on(Node.EventType.TOUCH_START, (e: EventTouch) => {  // 點擊事件
            touchBtn.normalSprite = pressSpr;
            Game.shootMgr?.touchShoot(true, true);
            e.propagationStopped = false;
        });
        touch.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {  // 按壓事件
            touchBtn.normalSprite = pressSpr;
            Game.shootMgr?.touchShoot(true);
            e.propagationStopped = false;
        });
        touch.on(Node.EventType.TOUCH_END, (e: EventTouch) => {  // 鬆開事件
            touchBtn.normalSprite = normalSpr;
            Game.shootMgr?.touchShoot(false);
            e.propagationStopped = false;
        });
        touch.on(Node.EventType.TOUCH_CANCEL, (e: EventTouch) => {  // 鬆開事件
            touchBtn.normalSprite = normalSpr;
            Game.shootMgr?.touchShoot(false);
            e.propagationStopped = false;
        });

        touch = find(Game.node.buttonLayer, 'TouchPanel');
        touch.on(Node.EventType.TOUCH_START, (e: EventTouch) => {  // 點擊事件
            touchBtnMov.pressed();
            touchBtn.normalSprite = pressSpr;
            if (Game.shootMgr) {
                Game.shootMgr.touchShoot(true, true);
            }
            e.propagationStopped = false;
        });
        touch.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {  // 按壓事件
            touchBtn.normalSprite = pressSpr;
            if (Game.shootMgr) {
                Game.shootMgr.touchShoot(true, true);
            }
            e.propagationStopped = false;
        });
        touch.on(Node.EventType.TOUCH_END, (e: EventTouch) => {  // 鬆開事件
            touchBtnMov.released();
            touchBtn.normalSprite = normalSpr;
            if (Game.shootMgr) {
                Game.shootMgr.touchShoot(false);
            }
            e.propagationStopped = false;
        });
        touch.on(Node.EventType.TOUCH_CANCEL, (e: EventTouch) => {  // 鬆開事件
            touchBtnMov.released();
            touchBtn.normalSprite = normalSpr;
            if (Game.shootMgr) {
                Game.shootMgr.touchShoot(false);
            }
            e.propagationStopped = false;
        });
    }

    /**
     * 桌資料設置
     */
    tableSetting(ack: prot.protocol.InfoAck) {
        log('Player got the table info.');

        Game.retainMgr.init();
        Game.uiCtrl.setSession(ack.wagers.toString());

        this.setPlayerStates(ack);
        this.stopShooting(true, 1);
    }

    /**
     * 設定桌內玩家資訊
     */
    setPlayerStates(ack: prot.protocol.InfoAck) {
        Game.uiCtrl.setCoinSprite();

        let turret = this.getTurret();
        turret.setTheme();
        turret.nameText.string = appManager.playerName;

        // 取得記錄玩家的押注
        let bet = Game.bet.getPreviousBet();
        turret.setBet(bet);

        // 先給個較小的 rawJP 值避免顯示 0 (待 Server 同步)
        this.rawJP = rInt(100, 200);
        this.updateJPValues();
        this.updateJPLimits();

        // 啟動 JP 輪詢
        poll(this.node, 30, () => {
            Game.gameMgr.U2S_JackpotReq();
        });

        Game.shootMgr.touchShoot(false, true);
        turret.updateTurretCoin(walletManager.getClientRemains(walletManager.myUserID));

        Game.main.Plate = ack.plate;
        Game.fishMgr.saveFishList();
        Game.fishMgr.readyToUpdateSeat(() => {
        });
    }

    /**
    * 取得砲台
    */
    getTurret(): Turret {
        return this.turret;
    }

    C2S_Giveup(type: number, num: number[], callTreasure: boolean = false) {
        let data = new prot.protocol.GiveUpReq();
        data.type = type;
        data.index = num;
        data.treasure = callTreasure;
        Game.gameMgr.U2S_GiveupReq(data);

        this.stopShooting(true);
    }

    S2C_Giveup(ack: prot.protocol.GiveUpAck) {
        this.clearHitFishAck();
        this.hitFailCnt = 0;

        // 如果有召喚寶箱, 要先補位在第一個位子
        if (ack.treasure === true) {
            let treasure = ack.plate.find(fish => fish.no === FishNo.TreasureChest);
            Game.fishMgr.callFishTower(treasure);
        }

        // 檢查哪些是準備要出的魚
        Game.main.Plate = ack.plate;
        Game.fishMgr.saveFishList();

        switch (ack.type) {
            case 1: {
                // 火法師之類的, 有演出的不自動補位
                break;
            }
            default: {
                // 一般放棄後, ack 回來自動補位
                Game.uiCtrl.setOddsBoardActive(false);
                Game.fishMgr.readyToUpdateSeat(() => {
                    delay(this.node, Game.fishMgr.moveTime, () => {
                        this.stopShooting(false);
                    });
                });
            }
        }
    }

    /**
     * 留存砲發射
     * @param ack 
     * @param bltId 
     * @param bet 
     * @param fishIdx 擊殺列表
     */
    multiTorpedo(ack: prot.protocol.HitAckData, bltId: number, bet: number, fishIdx: number[], bRetry: boolean = false) {
        let turret = this.getTurret();

        this.stopShooting(true);

        // 不能使用 if (comm.bgMgr.isEventOfScene(game.SceneEvent.Frost))
        let fish = Game.fishMgr.getFishTower(0);
        if (fish && fish.isUsed()) {
            let cnt = 0;
            let updateDelay = 0.2;
            let num: number[] = [1, 3, 4, 2, 0];

            // 先掃過死掉的魚種，決定出更新延遲時間..
            for (let i = 0; i < num.length; ++i) {
                let fish = Game.fishMgr.getFishTower(num[i]);
                if (fish && fish.isUsed()) {
                    let bDead = fishIdx.indexOf(fish.getFishId()) >= 0;
                    if (bDead) {
                        let fishSS = fish.getSpecialShow();
                        if (fishSS.kind == FishKind.TreasureChest || fishSS.kind == FishKind.WheelChest) {
                            updateDelay = 1.6;
                        }
                    }
                    ++cnt;
                }
            }

            // 檢查場上是否有足夠的數量
            if (cnt >= num.length) {
                let chargeDelay = turret.playMissileCharge();
                delay(this.node, chargeDelay, () => {
                    for (let i = 0; i < num.length; ++i) {
                        let fish = Game.fishMgr.getFishTower(num[i]);
                        if (fish && fish.isUsed()) {
                            fish.hitMustBeBreak();
                            fish.setTowerToMaxCrack();
                            delay(this.node, i * 0.2, () => {
                                let touchPosFL = Game.shootMgr.getLockPosition(fish.node);
                                let touchPosBL = trans3DPos(Game.node.bulletLayer, Game.node.fishLayer, touchPosFL);
                                if (turret) { turret.fire(touchPosBL); }
                                // 子彈資訊
                                let bp3 = turret.getBulletSpwanPos3D();
                                let dir = turret.getDirection(touchPosFL);

                                Game.bulletMgr.createMissileBullet(AvatarNo.Missile, false, 0, bp3, touchPosBL, dir, bltId, 997 + num[i], [fish.getFishId()], bet, () => {
                                    if (fishIdx.indexOf(fish.getFishId()) >= 0) {
                                        fish.getSpecialShow()?.retainShow();
                                    } else {
                                        let fishSS = fish.getSpecialShow();
                                        if (fishSS.kind != FishKind.TreasureChest && fishSS.kind != FishKind.WheelChest) {
                                            Game.effectMgr.MissileHitEffect(fish, AvatarNo.Missile);
                                        }
                                    }
                                });
                                soundManager.playEffect(SoundName.missile_02);
                            })
                        }
                    }
                })


                delay(this.node, chargeDelay + num.length * 0.2 + 0.5, () => {
                    if (ack.coin > 0) {
                        let wait = 0.2;

                        delay(this.node, updateDelay, () => {
                            let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_1);
                            let reward = rewardNode.getComponent(RewardCircle);

                            reward.node.setParent(Game.node.rewardLayer);

                            reward.showRolling_1(ack.bet, ack.coin, () => {
                                Game.effectMgr.playUserCoinNumAnim(ack.coin);
                                walletManager.buffering(bufferType.Reward, walletManager.myUserID, -ack.coin)
                                // comm.bankSys.addCoin('reward', -ack.coin);
                                // comm.gameCtrl.updateTurretCoin();
                                walletManager.updateClientRemains(walletManager.myUserID);
                                Game.broadcast.transMessage(ack.coin);

                                reward.node.destroy();
                                delay(this.node, wait, () => {
                                    Game.fishMgr.readyToUpdateSeat(() => {
                                        delay(this.node, Game.fishMgr.moveTime, () => {
                                            if (!this.checkBankReward()) {
                                                if (!this.checkWheelShow()) {
                                                    Game.main.stopShooting(false);
                                                }
                                            }
                                        })
                                    })
                                })
                                let leftRewardNode = Game.dataMgr.getReward(FishMedal.Medal_2);
                                let rewardCircle = leftRewardNode.getComponent(LeftRewardCircle);

                                // 調整層級，確保從上往下排序
                                let node = find(Game.node.rewardLayer, 'Pos_1');
                                if (node) {
                                    let list = node.children
                                    list.forEach(L => {
                                        L.setSiblingIndex(0);
                                    })
                                    leftRewardNode.setSiblingIndex(-node.children.length);
                                }
                                rewardCircle.node.setParent(find(Game.node.rewardLayer, 'Pos_1'));
                                rewardCircle.init(15, ack.coin, false, () => { rewardCircle.node.destroy(); });
                            });
                            soundManager.playEffect(SoundName.gem03);
                        })
                    } else {
                        Game.main.stopShooting(false);
                    }
                })
            } else {
                if (!bRetry) {
                    // 延遲後再嘗試一次
                    delay(this.node, 2, () => {
                        this.multiTorpedo(ack, bltId, bet, fishIdx, true);
                    })
                } else {
                    // 場上不足5隻，表演出問題，強制GG 
                    appManager.sendButton(GameLog.Error_MustLogou, 'multiTorpedo cnt < 5');
                    Game.gameCtrl.gameShutDown();
                }
            }
        }
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
                        Game.main.stopShooting(false);
                    }
                }
            })
        }
        return !!ack;
    }

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
                        walletManager.buffering(bufferType.Reward, walletManager.myUserID, -wheel.jp)
                        walletManager.updateClientRemains(walletManager.myUserID);
                        if (!this.checkWheelShow()) {
                            Game.main.stopShooting(false);
                        }
                    });
                }
            });
        }
        return wheel
    }

    multiShoot(bltId: number, bet: number) {
        let turret = this.getTurret();

        this.stopShooting(true);
        let num: number[] = [1, 3, 4, 2, 0];
        for (let i = 0; i < num.length; ++i) {
            let fish = Game.fishMgr.getFishTower(num[i]);
            if (fish && fish.isUsed()) {
                // delay(this.node, i * 0.25, () => {
                fish.hitMustBeBreak();
                let touchPosFL = Game.shootMgr.getLockPosition(fish.node);
                let touchPosBL = trans3DPos(Game.node.bulletLayer, Game.node.fishLayer, touchPosFL);
                if (turret) { turret.fire(touchPosBL, i == 0); }
                // 子彈資訊
                let bp3 = turret.getBulletSpwanPos3D();
                let dir = turret.getDirection(touchPosFL);
                Game.bulletMgr.createFakeBullet(turret.getCurrentBulletNo(), false, 0, bp3, touchPosBL, dir, bltId, prot.protocol.BulletType.Normal, [fish.getFishId()], bet);

                delay(this.node, 0.1, () => {
                    if (Game.treasureMgr.hitFish(fish)) {
                        Game.fishMgr.delFish(fish, true, false);
                    }
                    shake2D(Game.cam3D.node, 0.8, 25, 3.2);
                })
            }
        }

        Game.treasureMgr.preNextRound();

        delay(this.node, 1, () => {
            // 讓砲台回正
            if (turret) { turret.aimAt(v3(0, 50)); }
            // let t = Game.treasureMgr.runSoul();
            // delay(this.node, t, () => {
            Game.treasureMgr.nextRound();
            // })
        })

        soundManager.playEffect(SoundName.Treasure05);
    }

    /**
     * 本地端發射子彈
     */
    shoot(touchPosFL: Vec3, bltId: number, bltType: number, fishId: number[], bet: number): boolean {
        if (fishId.length === 0) {
            return false;
        }

        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
            this.multiShoot(bltId, bet);
            return;
        }

        let turret = this.getTurret();
        if (turret) {
            // 切換分頁時, 不接收子彈創建
            if (!this.isPageVisible) {
                return false;
            }

            // 射擊資訊
            let sndNo = 2;
            let touchPosBL = trans3DPos(Game.node.bulletLayer, Game.node.fishLayer, touchPosFL)
            let isMe = true;

            // 旋轉砲台
            switch (bltType) {
                default: {
                    turret.fire(touchPosBL);
                }
            }

            // 子彈資訊
            let bp3 = turret.getBulletSpwanPos3D();
            let dir = turret.getDirection(touchPosBL);

            turret.switchAvatar();

            // 子彈種類
            switch (bltType) {
                case prot.protocol.BulletType.Cannon: {
                    // 子彈編號和砲衣是對應的 (需要先同步砲衣)
                    Game.bulletMgr.createBullet(turret.getCurrentBulletNo(), isMe, 0, bp3, touchPosBL, dir, bltId, bltType, fishId, bet, () => {

                        // 彈跳子彈打複數
                        if (fishId.length > 1) {

                            let worldPos: Vec3 = Vec3.ZERO;
                            let fish0: Fish = Game.fishMgr.getFishById(fishId[0]);
                            if (fish0) worldPos = fish0.node.worldPosition;

                            let fish: Fish = Game.fishMgr.getFishById(fishId[1]);
                            let endPos = touchPosBL;
                            if (fish) {
                                endPos = Game.shootMgr.getLockPosition(fish.node);
                            }

                            let bulletNode = Game.dataMgr.getJumpBulletNode();
                            if (bulletNode) {
                                bulletNode.setScale(v3(endPos.x > touchPosBL.x ? -1 : 1, 1, 1));
                                bulletNode.setPosition(get3Dto2DPos(Game.cam3D, Game.camUI, worldPos, Game.node.effectLayer));
                                bulletNode.parent = Game.node.effectLayer;

                                delay(this.node, 0.1, () => {
                                    fish.bTowerFire = true;
                                    fish.hitMustBeBreak();
                                    Game.fishMgr.showHurt(fish);
                                    fish.damageTint(true);
                                })

                                delay(this.node, 1, () => {
                                    bulletNode.destroy();
                                })
                            }
                        }
                    });
                    break;
                }
                default: {
                    // 子彈編號和砲衣是對應的 (需要先同步砲衣)
                    Game.bulletMgr.createBullet(turret.getCurrentBulletNo(), isMe, 0, bp3, touchPosBL, dir, bltId, bltType, fishId, bet, null);
                    break;
                }
            }

            if (isMe) {
                // comm.snd.playEffect(sndNo, false, false);  // 射擊音效
            }
            return true;
        }
        return false;
    }

    /**
     * 射擊前置判斷
     */
    readyToShoot(bltId: number, posFL: Vec3) {
        let turret = this.getTurret();
        if (turret.isLocked()) {
            return;
        }

        let fishId: number[] = [];
        let bet = turret.getBet();
        let spend = bet;  // 要花費的金額
        let bulletType = prot.protocol.BulletType.Normal;
        let pushID = (no: number) => {
            let fish: Fish = Game.fishMgr.getFishTower(no);
            if (fish) {
                fishId.push(fish.getFishId());
            }
        }
        // pushID(0);

        if (Game.shootMgr.isTorpedo) {
            bulletType = prot.protocol.BulletType.Cannon;
            spend = bet * Game.shootMgr.torpedoHitCount;

            // let rand = rInt(1, 100);
            // if (rand >= 70 && rand < 85) {
                pushID(1);
            // } else if (rand >= 85 && rand < 100) {
            //     pushID(3);
            // }
        }

        let coin = walletManager.getClientRemains(walletManager.myUserID);
        Game.shootMgr.checkStopAutoMatic('less', walletManager.getServerRemains(walletManager.myUserID));
        Game.shootMgr.checkStopAutoMatic('more', walletManager.getServerRemains(walletManager.myUserID));

        let fish: Fish = Game.fishMgr.getFishTower(0);
        if (fish?.bFakeDragon || Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
            this.clearShootCnt();
        }

        if (coin - spend >= 0.0 || Math.abs(coin - spend) < 0.0001) {
            if (this.shootCount < this.maxShootCount) {
                if (this.currIdleTime < this.maxIdleTime && Game.shootMgr.checkShootCount()) {
                    this.shootCount += 1;

                    if (this.shoot(posFL, bltId, bulletType, fishId, bet)) {  // 發射成功才要扣錢
                        this.updateTurretCoin();
                        Game.shootMgr.setSpeedDiff(0.13);
                        // comm.app.checkAppLobbyNoviceEvent();    // todo: 有效射擊時檢查app大廳的新手旗標事件 不確定新的公版怎接
                        if (this.checkDepositTask) this.checkDepositTask.stop();
                        this.checkDepositTask = delay(this.node, 5, () => {
                            // Game.uiCtrl.depositBtn?.checkWalletBroken();
                            this.checkDepositTask = null;
                        })
                    }
                }
            } else {
                appManager.sendButton(GameLog.Error_MustLogou, `shootCount: ${this.shootCount}/${this.maxShootCount}`);
                Game.gameCtrl.gameShutDown();
            }
        }
        else {
            if (fish?.bFakeDragon || Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
                if (this.currIdleTime < this.maxIdleTime && this.shootCount < this.maxShootCount && Game.shootMgr.checkShootCount()) {

                    if (this.shoot(posFL, bltId, bulletType, fishId, bet)) {  // 發射成功才要扣錢
                        this.updateTurretCoin();
                        Game.shootMgr.setSpeedDiff(0.13);
                        if (this.checkDepositTask) this.checkDepositTask.stop();
                        this.checkDepositTask = delay(this.node, 5, () => {
                            // Game.uiCtrl.depositBtn?.checkWalletBroken();
                            this.checkDepositTask = null;
                        })
                    }
                }
            } else {
                // 沒錢了要關閉自動/鎖定/魚雷
                if (Game.shootMgr.isTorpedo) {
                    Game.uiCtrl.toolEvent(null, 'Torpedo');
                }
                if (Game.shootMgr.isAutoMatic) {
                    Game.uiCtrl.toolEvent(null, 'AutoMatic');
                }
                msgboxManager.msgOK(i18nManager.getString(9));
                // Game.uiCtrl.depositBtn?.checkWalletBroken();
                if (this.checkDepositTask) {
                    this.checkDepositTask.stop();
                    this.checkDepositTask = null;
                }
            }
        }
    }

    /**
    * 清空 ShootCount
    */
    clearShootCnt() {
        this.shootCount = 0;
    }

    /**
     * 阻擋射擊開關 (上鎖後預設 30 秒會自動解鎖)
     */
    stopShooting(toggle: boolean, lockSec?: number) {
        this.getTurret().lock(toggle, lockSec);
    }

    /**
     * 金額變化
     */
    updateTurretCoin() {
        walletManager.updateClientRemains(walletManager.myUserID);
        // let turret = this.getTurret();
        // if (turret) {
        //     turret.updateTurretCoin(walletManager.getClientRemains(walletManager.myUserID));
        // }
    }

    /**
     * 加入 hit list array
     * @param ack 
     */
    addHitFishAck(ack: prot.protocol.HitAckData) {
        this.hitFishAckList.push(ack);
    }

    /**
     * 清除暫存的命中訊息，只在GIVE UP後清除，避免下一隻的 plate 跟 hitAck 的 plate 衝突
     * (初步為了解決冰龍命中後飛走、回主場又使用到hit的plate，導致重複進冰龍的bug)
     */
    clearHitFishAck() {
        this.hitFishAckList.forEach(ack => {
            walletManager.setServerRemains(walletManager.myUserID, ack.remain);
            Game.main.updateTurretCoin();
        })
        this.hitFishAckList = [];
    }

    /**
     * hit fish ack 處理
     */
    hitFishAck(ack: prot.protocol.HitAckData) {
        walletManager.setServerRemains(walletManager.myUserID, ack.remain);
        Game.bulletMgr.delBulletData(ack.bulletId);  // 移除子彈資訊

        if (ack.result === prot.protocol.HitResult.HR_FAILED) {
        }
        else if (ack.result === prot.protocol.HitResult.HR_SUCCESS) {
            this.hitFish(ack);
            this.hitFailCnt = 0;
        }
        else if (ack.result === prot.protocol.HitResult.HR_FISH_ALREADY_DEAD) {
            // server 好像再也不會給假魚回應
            this.hitFailCnt += 1;
            if (this.hitFailCnt >= 10) {
                appManager.sendButton(GameLog.Error_MustLogou, 'hitFailCnt >= 10');
                Game.gameCtrl.gameShutDown();
            }
        }
        this.clearShootCnt();  // 只要有收到自己的子彈回應就清零
        this.updateTurretCoin();
    }

    /**
     * 一般子彈擊殺魚處理
     */
    hitFish(ack: prot.protocol.HitAckData) {
        walletManager.buffering(bufferType.Reward, walletManager.myUserID, ack.coin);

        let fish = Game.fishMgr.getFishTower(0);

        Game.main.Plate = ack.plate;
        Game.fishMgr.saveFishList();

        // for (let i = 0; i < ack.remove.length; ++i) {
        //     ack.remove[i].jackpot = new prot.protocol.Jackpot();
        //     ack.remove[i].jackpot.coin = 50000;
        //     ack.remove[i].jackpot.type = 1;
        // }

        if (ack.type == prot.protocol.BulletType.Energy) {
            let fishIdx: number[] = [];
            
            let tempAck = new prot.protocol.HitAckData();
            tempAck.type = ack.type;
            tempAck.bet = ack.bet;
            tempAck.bulletId = ack.bulletId
            // tempAck.gold = ack.gold
            tempAck.plate = ack.plate
            tempAck.remain = ack.remain
            tempAck.coin = ack.coin;

            for (let i = 0; i < ack.remove.length; ++i) {
                if (ack.remove[i]?.bonus?.coin) {
                    walletManager.buffering(bufferType.Reward, walletManager.myUserID, ack.remove[i].bonus.coin);

                    tempAck.remove[0] = ack.remove[i];
                    Game.piggyBank.ackQueue.unshift(tempAck);    // 如果有藏寶庫，先存起來
                }
                if (ack.remove[i]?.jackpot?.coin) {
                    walletManager.buffering(bufferType.Reward, walletManager.myUserID, ack.remove[i].jackpot.coin);

                    tempAck.remove[0] = ack.remove[i];

                    let removeFish = Game.fishMgr.getFishById(ack.remove[i].idx);
                    let fishSS = removeFish?.getSpecialShow();
                    if (fishSS?.kind == FishKind.WheelChest) {
                        Game.wheelMgr.addWheel(ack);
                    } else {
                        Game.piggyBank.ackQueue.unshift(tempAck);    // 如果有JP，先存起來
                    }
                }
                fishIdx.push(ack.remove[i].idx)
            }

            this.multiTorpedo(tempAck, ack.bulletId, ack.bet, fishIdx);
        } else {
            for (let i = 0; i < ack.remove.length; ++i) {
                let removeFish = Game.fishMgr.getFishById(ack.remove[i].idx);

                if (removeFish) {
                    if (ack.remove[i]?.bonus?.coin) { walletManager.buffering(bufferType.Reward, walletManager.myUserID, ack.remove[i].bonus.coin); }
                    if (ack.remove[i]?.jackpot?.coin) { walletManager.buffering(bufferType.Reward, walletManager.myUserID, ack.remove[i].jackpot.coin); }

                    let tempAck = new prot.protocol.HitAckData();
                    tempAck.type = ack.type;
                    tempAck.bet = ack.bet;
                    tempAck.bulletId = ack.bulletId
                    // tempAck.gold = ack.gold
                    tempAck.plate = ack.plate
                    tempAck.remain = ack.remain
                    tempAck.coin = ack.remove[i].coin;
                    tempAck.remove[0] = ack.remove[i];

                    this.specialShowStart(removeFish, tempAck, removeFish == fish, ack.remove.length == 1);
                    Game.shootMgr.setSpeedDiff(0);
                } else {
                    walletManager.buffering(bufferType.Reward, walletManager.myUserID, -ack.remove[i].coin);
                    this.updateTurretCoin();
                    Game.broadcast.transMessage(-ack.remove[i].coin);
                }
            }
        }

        // 錯誤檢查
        if (!fish) {
            // if (ack.gold > 0) {
            //     walletManager.buffering(bufferType.Reward, walletManager.myUserID, -ack.gold);
            // }
            this.updateTurretCoin();
            return;
        }
    }

    specialShowStart(fish: Fish, ack: prot.protocol.HitAckData, bOther: boolean, bUpdateSeat: boolean) {
        Game.shootMgr.checkStopAutoMatic('score', ack.coin);
        this.stopShooting(true);
        fish.specialShowStart(ack, bOther, bUpdateSeat);
    }

    /**
     * 顯示跑馬燈
     */
    showBroadcast(type: number, theme: number, name: string, coin: number, fish: number, odds: number, from?: number) {
        // 道具卡不顯示
        if (fish > 10000) return;

        let turret = this.getTurret();
        let nickName = turret ? turret.nameText.string : '';

        if (nickName == name) {
            Game.broadcast.readyMessage(name, coin, fish, odds, '', prot.protocol.ServerToUser.S2U_BROADCAST, from);
        } else {
            // Boss 廣播延遲 60 秒
            let delayTime = 10;
            if (fish === FishKind.TreasureChest || fish === FishKind.WheelChest) {
                delayTime = 60;
            }
            let kind = 0;
            delay(Game.broadcast.node, delayTime, () => {
                Game.broadcast.setMessage(name, coin, fish, odds, '', kind, from);
            });
        }
    }

    stopGame() {
        log('todo: 遊戲結束')
        this.stopShooting(true, 86400);
    }

    /**
     * 發射留存武器
     */
    readyToShootRetain() {
        let turret = this.getTurret();
        if (turret.isLocked()) {
            return;
        }

        let bltId = Game.shootMgr.createBulletId();
        let fishId: number[] = [];
        let bet = turret.getBet();

        for (let i = 0; i < 5; ++i) {
            let fish: Fish = Game.fishMgr.getFishTower(i);
            if (fish) {
                fishId.push(fish.getFishId());
            }
        }

        let data = new prot.protocol.HitReqData;
        data.bet = bet;
        data.index = fishId;
        data.bulletId = bltId;
        data.type = prot.protocol.BulletType.Energy;

        Game.gameMgr.U2S_HitReq(data);

        Game.retainMgr.cleanProgress();
    }

    /**
     * 遊戲本體JP相關
     */
    setRawJP(rawJP: number) {
        this.rawJP = rawJP;
        this.updateJPValues();
    }

    /**
     * 以現在的 rawJP 值更新 JP 面板數值
     */
    updateJPValues() {
        let bet = this.getTurret()?.getBet();
        if (!isNaN(bet)) Game.jpBoard?.setJPCoin(this.rawJP, bet);
    }

    /**
     * 更新各階 JP 是否開啟
     */
    updateJPLimits() {
        let bet = this.getTurret()?.getBet();
        if (!isNaN(bet)) Game.jpBoard?.checkJPPanelEnable(bet);
    }

}
