import prot from '../network/protocol/protocol.js';
import { _decorator, Node, Component, JsonAsset, Label, Vec3, instantiate, tween, sp } from 'cc';
import { cleanNum, find, get3Dto2DPos, playAnime, playSpine } from 'db://annin-framework/utils';
import { appManager, bufferType, soundManager, walletManager } from 'db://annin-framework/manager';
import { Comm } from 'db://annin-framework/system';
import { SceneEvent, FishMedal, OtherNo, SoundName, MusicName, FishKind } from './GameDefine';
import { delay } from '../system/ToolBox';
import ChangeSceneByRunCamera from './ChangeSceneByRunCamera';
import BonusWinRewardCircle from './BonusWinRewardCircle';
import LeftRewardCircle from './LeftRewardCircle';
import RewardCircle from './RewardCircle';
import Fish from './Fish';
import Game, { GameLog } from '../system/Game';

const { ccclass, property } = _decorator;

class jpInfo {
    /** Fish index */
    index: number = 0;
    coin: number = 0;
    coinType: number = 0;
}

export class treasureFish {

    /** Fish no */
    no: number = 0;

    /** Fish index */
    index: number = 0;

    odds: number = 0;

    blood: number = 0;

    mult: number = 1;
}

export class treasureData {

    /** Data plate */
    plate: treasureFish[] = [];

    /** Data remove */
    remove: number[] = [];

    /** Data coin */
    coin: number = 0;

    /** Data odds */
    odds: number = 0;

    add: number[] = [];

    jpInfo: jpInfo[] = [];

    mult: number = 1;
}

export class treasureBox {

    /** Box list. */
    public list: treasureData[] = [];

    public jp: jpInfo = new jpInfo();

    /** Box coin. */
    public coin: number = 0;

    /** Box odds. */
    public odds: number = 0;
}

export class serverTreasure {

    /** fish index */
    public index: number = 0;

    /** fish blood */
    public blood: number = 0;

    /** server fish data */
    public treasure: prot.protocol.Treasures.ITreasure = null;
}

class soulData {
    bAdd: boolean = false;
    soulNode: Node = null;
}

@ccclass('TreasureManager')
export default class TreasureManager extends Component {

    @property(Node)
    scoreStone: Node = null;

    @property(JsonAsset)
    oddsJson: JsonAsset = null;         // 倍率表

    @property(JsonAsset)
    roundJson: JsonAsset = null;        // 局數機率表

    @property(JsonAsset)
    baseJson: JsonAsset = null;         // 基本表

    @property(JsonAsset)
    leftJson: JsonAsset = null;         // 殘局表

    @property(JsonAsset)
    listJson: JsonAsset = null;         // 魚種表
    
    @property(Node)
    BonusGamCounterUI: Node = null;

    @property(Label)
    BonusGameFirstCount: Label = null;

    @property(Label)
    BonusGameLastCount: Label = null;

    

    private bet: number = 0;
    private data: treasureBox = null;
    private plate: prot.protocol.IFish[] = [];

    private baseRound: number = 5;
    private round: number = 0;
    private bFeatures: boolean = false;

    private oddsCount: number = 0;
    private oddsLabel: Label = null;
    private multSpine: sp.Skeleton = null;

    private rewardList: LeftRewardCircle[] = [];

    private whenLeaveCB: Function = null;

    onLoad () {
        Game.treasureMgr = this;
    }

    start () {
        this.oddsLabel = find(this.scoreStone, 'BonusTowerEf_Bet_Num/Bet', Label);
        this.multSpine = find(this.scoreStone, 'BonusTowerEf_Bet_Num/TowerMtl/MultiplierBall', sp.Skeleton);
    }

    onDestroy() {
        Game.treasureMgr = null;
    }

    update (dt) {}

    /**
     * client 拿金額自己產假盤面(特色、道具卡)
     */
    setData(coin: number, bet: number, plate: prot.protocol.IFish[], bFeatures: boolean) {
        this.round = 0;
        this.bet = bet;
        this.bFeatures = bFeatures;
        
        this.plate = plate;
        this.rewardList = [];
        this.oddsCount = 1;
        this.setOddsStr('x' + this.oddsCount)

        let jp = 407.5969;
        this.createPlate(jp);
        this.data.coin = coin;

        this.updateBonusGameCount(this.round);
        this.saveRoundPlate();
    }

    /**
     * 拿 server 的盤面轉成 client 需要的格式(一般進入)
     * @param ack server藏寶庫盤面
     * @param coin 獲得金錢
     * @param bet 玩家bet
     * @param plate 一般主場盤面
     * @param leaveCB 離開藏寶庫後的callback，如果需要此callback，必須要決定離開之後何時補位 Game.fishMgr.updateSeat(0, () => { Game.main.stopShooting(false); });
     */
    setServerData(ack: prot.protocol.Treasures, coin: number, bet: number, plate: prot.protocol.IFish[], bFeatures: boolean, leaveCB: Function = null) {
        this.round = 0;
        this.bet = bet;
        this.bFeatures = false;
        
        this.plate = plate;
        this.rewardList = [];
        this.oddsCount = 1;
        this.whenLeaveCB = leaveCB;
        this.setOddsStr('x' + this.oddsCount)

        this.createServerPlate(ack);
        this.data.coin = coin;
        if (ack.jackpot) {
            this.data.coin += ack.jackpot.coin;
        }

        this.updateBonusGameCount(this.round);
        this.saveRoundPlate();
    }

    saveRoundPlate() {
        Game.main.Plate = this.data.list[this.round].plate;
        Game.fishMgr.saveFishList();
    }

    hitFish(fish: Fish) {
        if (!this.data) return;
        if (!this.data.list[this.round]) return;

        let ok = false;
        let hit = this.data.list[this.round].remove;
        let add = this.data.list[this.round].add;
        let jpInfo = this.data.list[this.round].jpInfo;

        for (let i = 0; i < hit.length; ++i) {
            if (hit[i] == fish.getFishId()) {
                fish.bCoinDrop = true;
                ok = true;
                break;
            }
        }

        for (let i = 0; i < add.length; ++i) {
            if (add[i] == fish.getFishId()) {
                // 噴+局
                // let fishPos = fish.node.convertToWorldSpaceAR(Vec3.ZERO);
                // this.createRound(comm.get3Dto2DPos(fishPos));
                this.createRound(get3Dto2DPos(Game.cam3D, Game.camUI, fish.node.worldPosition, Game.node.rewardLayer))
                break;
            }
        }

        for (let i = 0; i < jpInfo.length; ++i) {
            if (jpInfo[i].index == fish.getFishId()) {
                Game.jpBoard.dropPigCoin(jpInfo[i].coinType as any, get3Dto2DPos(Game.cam3D, Game.camUI, fish.node.worldPosition, Game.node.rewardLayer), () => {});
                break;
            }
        }

        return ok
    }

    /**
     * 射擊後更新局數
     */
    preNextRound() {
        let diff = 0;
        for (let i = 0; i < this.round; ++i) {
            diff += this.data.list[i].add.length;
        }
        this.setBonusGameCount(this.baseRound + diff - (this.round + 1), (this.baseRound + diff).toString());
    }

    /**
     * 加局後更新局數
     */
    updateBonusGameCount(round: number) {
        let diff = 0;
        for (let i = 0; i < round; ++i) {
            diff += this.data.list[i].add.length;
        }
        this.setBonusGameCount(this.baseRound + diff - round, (this.baseRound + diff).toString());

        playAnime(find(this.BonusGamCounterUI, 'BonusGameTimeGet'), 'Bonus_TimeGet');
    }

    /**
     * preNextRound 後1秒
     */
    nextRound() {
        this.showReward(() => {
            this.showJP(() => {
                if (this.round < this.data.list.length) {
                    this.saveRoundPlate();
                    Game.fishMgr.updateSeat(0, () => {
                        Game.main.stopShooting(false);
                        if (!this.multSpine.node.active) {
                            this.multSpine.node.active = true;
                            let te1 = playSpine(this.multSpine, 'Return');
                            delay(this.node, te1.animation.duration, () => {
                                playSpine(this.multSpine, 'Idle', true);
                            })
                        }
                    });
                } else {
                    this.keepRewardDel();
                    this.showResoult(() => {
                        this.revert2Scene();
                        this.updateCoin();
                    });
                }
            })
        });
        this.round += 1;
    }

    /**
     * 給獎結算
     * @param ack 
     * @returns 是否乘倍表演 
     */
    showReward(endCB: Function) {
        let round = this.round;
        if (!this.data || !this.data.list[round]) {
            appManager.sendButton(GameLog.Error_MustLogou, 'TreasureManager showReward, this.round= ' + round);
            Game.gameCtrl.gameShutDown();
        }

        let coin = this.data.list[round].coin;
        if (coin) {
            // 此局是否有乘倍
            if (this.data.list[round].mult > 1) {
                let total = coin * this.data.list[round].mult;
                console.log('coin= ' + coin + ', mult= ' + this.data.list[round].mult + ', showReward total= ' + total + ', ')
                let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_1);
                let reward = rewardNode.getComponent(RewardCircle);
        
                reward.node.setParent(Game.node.rewardLayer);
                let t = reward.showRolling_4(this.bet, coin, this.data.list[round].mult, () => {
                    this.smallReward(total);
                    reward.node.destroy();
                    if (endCB) { endCB(); }
                });

                console.log('t= ' + t);
                delay(this.node, t, () => {
                    this.multSpine.node.active = false;
                })
            } else {
                let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_1);
                let reward = rewardNode.getComponent(RewardCircle);
        
                reward.node.setParent(Game.node.rewardLayer);
        
                reward.showRolling_1(this.bet, coin, () => {
                    this.smallReward(coin);
                    reward.node.destroy();
                    if (endCB) { endCB(); }
                });
            }
        } else {
            delay(this.node, 0, () => {
                if (endCB) { endCB(); }
            });
        }
    }

    showJP(endCB: Function) {
        let jpType = Game.jpBoard.whichPigCoinTypeFull();
        if (jpType >= 0 && this.data.jp.coin > 0) {
            Game.jpBoard.showJPReward(this.bet, this.data.jp.coin, this.data.jp.coinType as any, () => {
                let kind = ([18, 19, 20, 21])[this.data.jp.coinType];
                this.smallReward(this.data.jp.coin, kind);
                this.data.jp.coin = 0;
                if (endCB) { endCB(); }
            })
        } else {
            delay(this.node, 0, () => {
                if (endCB) { endCB(); }
            });
        }
    }

    /**
     * 顯示結算畫面
     * @param endCB 
     */
    showResoult(endCB: Function) {
        let coin = this.data.coin;

        let rewardNode = Game.dataMgr.getReward(FishMedal.Bonus);
        let reward = rewardNode.getComponent(BonusWinRewardCircle);

        reward.node.setParent(find(Game.node.rewardLayer,'FGReward'));

        reward.init(this.oddsCount, this.bet, coin, this.round, () => {
            delay(rewardNode, 0.3, () => {
                soundManager.stopEffect(SoundName.Treasure12);
                reward.node.destroy();
            })
            if (endCB) { endCB(); }
            if (this.bFeatures) {
                Game.shootMgr.closeShootState('AutoMatic');
                Game.uiCtrl.switchAutoChipState(false);
                Game.uiCtrl.setNextBtnInteractable(true);
                Game.uiCtrl.setBtnsInFeatures(true);
                let turret = Game.main.getTurret();
                if (turret) {
                    turret.showBet(turret.getBet());
                }
                Comm.node.buttonLayer.active = true;
            }
        });
    }

    /**
     * 離開藏寶庫
     */
    revert2Scene() {
        Game.bgMgr.switchSceneEvent(SceneEvent.Treasure, false);
        Game.fishMgr.pathReset();

        // 換砲台
        let turret = Game.main.getTurret();
        turret?.switchAvatar();

        Game.bgMgr.setBG(0);
        Game.bgMgr.closeTheDoor();
        Game.piggyBank.hideBankUI(false);
        Game.jpBoard.showPigCoinUI(false);
        Game.jpBoard.resetJPMinorMiniStates();
        Game.cam3D.getComponent(ChangeSceneByRunCamera).chanegeScene1();
        soundManager.playMusic(MusicName.bgm1);
        Game.fishMgr.reset();
        // comm.uiCtrl.setOddsBoardActive(true);
        Game.uiCtrl.setBonusGameCountActive(false);
        this.setBonusGameCount(5, '5');
        Game.fishMgr.loadkeepFishScriptData();
        Game.main.Plate = this.plate;
        Game.fishMgr.saveFishList();

        if (this.whenLeaveCB) {
            this.whenLeaveCB();
        }

        // 讓下次近來保留預設值
        playAnime(this.scoreStone, 'BonusTowerEf_Init');
        this.multSpine.node.active = true;
    }

    updateCoin() {
        Game.uiCtrl.setTorpedoBtnInteractable(true);
        Game.uiCtrl.setBtnsInTreasure(true);
        Game.uiCtrl.setBetBtnInteractable(true);
        Game.uiCtrl.setAutoBtnInteractable(true);
        Game.uiCtrl.setSummonBtnInteractable(true);
        Game.effectMgr.playUserCoinNumAnim(this.data.coin);
        walletManager.buffering(bufferType.Reward, walletManager.myUserID, -this.data.coin);
        // comm.bankSys.addCoin('reward', -this.data.coin);
        Game.main.updateTurretCoin();
        Game.broadcast.transMessage(this.data.coin);
        if (!this.whenLeaveCB) {
            Game.fishMgr.updateSeat(0, () => { Game.main.stopShooting(false); });
        }
    }

    /**
     * 靠左小獎圈
     */
    smallReward(coin: number, kind: number = FishKind.TreasureChest) {
        let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_2);
        let reward = rewardNode.getComponent(LeftRewardCircle);

        // 調整層級，確保從上往下排序
        let node = find(Game.node.rewardLayer, 'Pos_1');
        if (node) {
            let list = node.children
            list.forEach((L, zi) => {
                L.setSiblingIndex(zi);
            });
            rewardNode.setSiblingIndex(node.children.length);
        }
        reward.node.setParent(find(Game.node.rewardLayer, 'Pos_1'));

        reward.showKeep(kind, coin);
        this.rewardList.push(reward);
    }

    keepRewardDel() {
        for (let i = 0; i < this.rewardList.length; ++i) {
            delay(this.rewardList[i].node, i * 0.2, () => {
                this.rewardList[i].closeKeep();
            })
        }
    }

    /**
     * 表演乘倍
     */
    runMult(round: number) {

    }

    createRound(pos: Vec3) {
        let round = this.round + 1;
        let node = instantiate(Game.dataMgr.getOtherPf(OtherNo.BonusEnergy));
        if (node) {
            node.setPosition(pos);
            node.parent = Game.node.uiLayer;

            let st = playAnime(node, 'BonusEnergy_In');
            delay(node, st.duration / st.speed + 0.5, () => {
                playAnime(node, 'BonusEnergy');

                tween(node)
                .to(0.5, { position: Game.uiCtrl.getBonusGameCountPos() }, { easing: 'cubicIn' } )
                .call(() => {
                    this.updateBonusGameCount(round);
                    node.destroy();
                    soundManager.playEffect(SoundName.Treasure07);
                })
                .start()
            })
        }
        soundManager.playEffect(SoundName.Treasure06);
    }

    setOddsStr(str: string) {
        if (this.oddsLabel) {
            this.oddsLabel.string = str;
        }
    }

    createPlate(jp: number) {
        let ack = new prot.protocol.Treasures();
        let createTreasure = (id: number, odds: number, point: number, multiply: number, jpCoin: number = -1, addRound: boolean) => {
            let t = new prot.protocol.Treasures.Treasure();
            t.id = id;
            t.odds = odds;
            t.point = point;
            t.multiply = multiply;
            t.addRound = addRound;
            t.jackpot = jpCoin;
            return t
        }
        ack.list.push(createTreasure(5, 8, 9, 1, 3, false));
        ack.list.push(createTreasure(4, 4, 2, 1, 3, false));
        ack.list.push(createTreasure(6, 3, 15, 1, 3, false));
        ack.list.push(createTreasure(4, 4, 8, 1, 0, false));
        ack.list.push(createTreasure(3, 2, 17, 1, 0, false));
        ack.list.push(createTreasure(4, 4, 10, 2, 1, false));
        ack.list.push(createTreasure(3, 4, 4, 1, 0, false));
        ack.list.push(createTreasure(3, 4, 24, 1, 0, false));
        ack.list.push(createTreasure(1, 3, 23, 1, 0, false));
        ack.list.push(createTreasure(14, 0, 25, 0, 0, false));
        ack.list.push(createTreasure(12, 0, 26, 0, 0, false));
        ack.list.push(createTreasure(12, 0, 27, 0, 0, false));
        ack.list.push(createTreasure(11, 0, 28, 0, 0, false));
        ack.list.push(createTreasure(11, 0, 29, 0, 0, false));
        ack.round = 5;

        ack.jackpot = new prot.protocol.Jackpot();
        ack.jackpot.coin = jp;
        ack.jackpot.type = 3;

        this.createServerPlate(ack);
    }

    setBonusGameCount(value: number, str2: string) {
        let num = value < 0? 0 : value
        this.BonusGameFirstCount.string = num.toString();
        this.BonusGameLastCount.string = `/${str2}`;
    }

    
    /**
     * 建立Server給的盤面
     * @param ack 
     */
    createServerPlate(ack: prot.protocol.Treasures) {
        console.log(ack, 'createServerPlate')
        let box = new treasureBox();
        let columnLast: serverTreasure[] = [];
        let treasureList: serverTreasure[] = [];

        // 建立盤面
        for (let i = 0; i < ack.round; ++i) {
            box.list[i] = new treasureData();
        }

        if (ack.jackpot) {
            box.jp.coin = ack.jackpot.coin;
            box.jp.coinType = ack.jackpot.type - 1;
        }

        // 展開成一維arr
        ack.list.forEach((t, index) => {
            let s = new serverTreasure();
            s.index = index;
            s.treasure = t;
            treasureList[t.point] = s;
        })

        // 從最後開始塞
        for (let i = treasureList.length - 1; i >= 0; --i) {
            let row = Math.floor(cleanNum(i / 5));
            let column = i % 5;

            // 更新最後站位是誰
            if (treasureList[i]) {
                columnLast[column] = treasureList[i];
                columnLast[column].blood = columnLast[column].treasure.odds == 0? 999 : 0;
            }

            if (box.list[row]) {
                ++columnLast[column].blood;

                let fish = new treasureFish();
                fish.index = columnLast[column].index;
                fish.no = columnLast[column].treasure.id;
                fish.odds = columnLast[column].treasure.odds;
                fish.blood = columnLast[column].blood;

                box.list[row].plate[column] = fish;
            }

            // server 這格有資料且在盤面內
            if (treasureList[i] && box.list[row]) {
                box.list[row].coin += columnLast[column].treasure.odds * this.bet;
                box.list[row].remove.push(columnLast[column].index);
                if (columnLast[column].treasure.addRound) { box.list[row].add.push(columnLast[column].index); }
                if (columnLast[column].treasure.multiply > 1) { box.list[row].mult = columnLast[column].treasure.multiply; }
                if (columnLast[column].treasure.jackpot > 0) {
                    let info = new jpInfo();
                    info.index = columnLast[column].index;
                    info.coinType = columnLast[column].treasure.jackpot - 1;
                    box.list[row].jpInfo.push(info);
                }
            }
        }
        this.data = box;
        console.log(this.data, 'server 藏寶庫盤面')
    }
}