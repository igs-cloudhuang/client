import prot from '../network/protocol/protocol.js';
import { _decorator, clamp, Component, instantiate, Node, sp, tween, v3, Vec3 } from 'cc';
import { appManager, soundManager } from 'db://annin-framework/manager';
import { easeIn, easeInOut, easeOut, find, playAnime, playSpine, rInt, shake2D, transUIPos } from 'db://annin-framework/utils';
import { Comm } from 'db://annin-framework/system';
import { count, delay, fadeTween, setOpacity, setUISize } from '../system/ToolBox';
import { SoundName } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('PiggyBank')
export class PiggyBank extends Component {

    @property(Node)
    bank2DNode: Node = null;

    @property(Node)
    spineNode: Node = null;

    states = {
        Idle: 0, Upgrade: 1, Reward: 2
    };
    state = 0;

    /**
     * 用來擋某些主場表演不給掉豬幣
     */
    canDropPigCoin = true;

    /**
     * 用來放多餘的撲滿表演 ack
     */
    ackQueue = new Array<prot.protocol.HitAckData>();

    private bankLevel = 1;
    private maxBankLevel = 6;
    private keyBankLevel = '';

    private hitCnt = 0;
    private upgradeTable = new Map<number, number>();    // <level, thresholdHits>
    private bankUIPosEL = v3();

    onLoad() {
        Game.piggyBank = this;
        Game.node.stage.on(Node.EventType.SIZE_CHANGED, this.updateBankUIPosEL, this);
        this.updateBankUIPosEL();
    }

    start() {
        this.keyBankLevel = `${appManager.gameID}-piggy-bank-level`;
        this.state = this.states.Idle;
        this.initUpgradeTable();
        this.initBankLevel();
    }

    onDestroy() {
        Game.node.stage?.off(Node.EventType.SIZE_CHANGED, this.updateBankUIPosEL, this);
        Game.piggyBank = null;
    }

    private updateBankUIPosEL() {
        delay(this.node, .1, () => {    // 更新順序問題, 晚一點才能抓取正確值
            let posEL = this.bankUIPosEL;
            let pivot = this.bank2DNode;
            let screenPos = Game.cam3D.worldToScreen(pivot.worldPosition, posEL);
            let worldPos = Game.camUI.screenToWorld(screenPos, posEL);
            Game.camUI.convertToUINode(worldPos, Game.node.effectLayer, posEL);
            posEL.add3f(10, 15, 0);
            posEL.z = 0;
        });
    }

    private initUpgradeTable() {
        const getHits = (num: number) => (    // num +- 20%
            num + rInt(0, Math.round(num * .2)) * (Math.random() > .5 ? 1 : -1)
        );
        this.upgradeTable.set(1, getHits(50));
        this.upgradeTable.set(2, getHits(150));
        this.upgradeTable.set(3, getHits(250));
        this.upgradeTable.set(4, getHits(500));
        this.upgradeTable.set(5, getHits(800));
    }

    private initBankLevel() {
        let level = parseInt(Comm.storage.getItem(this.keyBankLevel));
        if (isNaN(level)) level = 1;
        level = clamp(level, 1, this.maxBankLevel);

        let lvStr = level.toFixed(0);
        Comm.storage.setItem(this.keyBankLevel, lvStr);
        this.bankLevel = level;

        this.spineNode.getComponent(sp.Skeleton).setSkin(`Lv${lvStr}`);
        playSpine(this.spineNode, 'Idle', true);
    }

    /**
     * 收集豬幣時刷新撲滿狀態
     */
    updateBankState() {
        this.hitCnt += 1;

        if (this.state === this.states.Upgrade)
            return;
        if (this.state === this.states.Reward)
            return;

        // 播放刷新的情況
        let thresholdHits = this.upgradeTable.get(this.bankLevel) ?? -1;
        if (this.hitCnt < thresholdHits || this.bankLevel >= this.maxBankLevel) {
            playSpine(this.spineNode, 'Update', false, () => {
                if (Math.random() < .99) {
                    playSpine(this.spineNode, 'Idle', true);
                }
                else {
                    // 1% 機率播放 NearWin
                    playSpine(this.spineNode, 'Action_No', false, () => {
                        playSpine(this.spineNode, 'Idle', true);
                    });
                }
            });
            return;
        }

        // 播放升級的情況
        if (this.bankLevel < this.maxBankLevel && this.hitCnt >= thresholdHits) {
            this.bankLevel += 1;
            this.hitCnt = 0;

            let lvStr = this.bankLevel.toFixed(0);
            Comm.storage.setItem(this.keyBankLevel, lvStr);

            playSpine(this.spineNode, 'Upgrade', false, () => {
                playSpine(this.spineNode, 'Idle', true);
                this.state = this.states.Idle;
            });
            delay(this.node, .56, () => {
                this.spineNode.getComponent(sp.Skeleton).setSkin(`Lv${lvStr}`);
            });
            this.state = this.states.Upgrade;
            return;
        }
    }

    /**
     * 撲滿爆炸得獎
     */
    showBankReward(endFunc: Function) {
        this.initUpgradeTable();    // 升級表重置 (有隨機值)
        this.bankLevel = 1;
        this.hitCnt = 0;

        let lvStr = this.bankLevel.toFixed(0);
        Comm.storage.setItem(this.keyBankLevel, lvStr);

        this.state = this.states.Reward;
        playSpine(this.spineNode, 'Update', false, () => {
            playSpine(this.spineNode, 'Action_Yes', false, () => {
                playSpine(this.spineNode, 'Win', false, () => {
                    this.hideBankUI(true);
                    delay(this.node, .8, () => {
                        this.spineNode.getComponent(sp.Skeleton).setSkin(`Lv${lvStr}`);
                        this.hideBankUI(false);
                        playSpine(this.spineNode, 'Idle', true);
                        this.state = this.states.Idle;
                    });
                });

                // 撲滿破碎的時候執行回調
                delay(this.node, 1, () => {
                    endFunc?.();
                });
            });
        });
    }

    /**
     * 主場豬幣收集
     */
    dropPigCoin(posEL: Vec3, endFunc: Function) {
        let node = instantiate(Game.dataMgr.properties.pigCoin2D);
        node.setParent(Game.node.effectLayer);
        node.setPosition(posEL);

        playAnime(node, 'PigCoin2D_In', null, () => {
            delay(node, .5, () => {
                tween(node)
                    .to(.3, { position: this.bankUIPosEL, scale: v3(.5, .5, 1) }, { easing: easeInOut(2) })
                    .call(() => {
                        node.destroy();
                        endFunc?.();
                    })
                    .start();
            });
        });
    }

    /**
     * 顯示開出豬幣飛到 JP 位置
     */
    showGetJPReward(endFunc: Function) {
        let node = instantiate(Game.dataMgr.properties.pigCoinSymbol);
        node.setParent(Game.node.rewardLayer);
        node.setPosition(this.bankUIPosEL);

        // 畫面要震動 & 角色要播放失衡動作
        shake2D(Game.cam3D.node, .5, 25, 4);
        delay(node, .25, () => {
            count(0, 6, i => {
                let fish = Game.fishMgr.getFishTower(i);    // 有可能為空值
                fish?.getFishSetting()?.fakeDead();
            });
        });

        tween(node)
            .by(.8, { position: v3(-80, 0, 0) }, { easing: easeOut(3) })
            .start();

        delay(node, 1, () => {
            let coinPivot = find(node, 'Node/CoinPivot');
            let goal = transUIPos(coinPivot, Game.jpBoard.pivot).add3f(0, 120, 0);    // 畫面外
            let coinNodes = coinPivot.children;
            let lastIndex = coinNodes.length - 1;
            let flyTime = .3;

            coinNodes.forEach((node, i) => {
                tween(node)
                    .delay(i * .15).to(flyTime, { position: goal, scale: v3(.5, .5, 1) }, { easing: easeIn(2) })
                    .call(() => {
                        if (i >= 1 && i <= 3) this.showPigCoinHits(i);
                        if (i === lastIndex) endFunc?.();
                        node.destroy();
                    })
                    .start();
            });
        });
    }

    /**
     * 顯示豬幣飛到 JP 位置後播放撞擊特效
     */
    showPigCoinHits(level: number) {
        let size = setUISize(Game.node.stage, -1, -1).contentSize;
        let center = Game.gameCtrl.getUICenterPos();
        let posY = center.y + (size.height / 2 + 32);
        let hitFx = instantiate(Game.dataMgr.properties.pigCoinSymbolHit);
        hitFx.setParent(Game.node.rewardLayer);
        hitFx.setPosition(0, posY);
        hitFx.setSiblingIndex(0);
        playAnime(hitFx, `Clip_PigCoin_Multiply_${clamp(level, 1, 3)}`, null, () => {
            hitFx.destroy();
        });
    }

    /**
     * 顯示開出鑰匙飛到寶藏庫門的位置
     */
    showGetTreasureReward(endFunc: Function) {
        let node = Game.dataMgr.getTreasureKeyNode();
        let pos = v3(this.bankUIPosEL).add3f(0, 50, 0);
        node.setParent(Game.node.effectLayer);
        node.setPosition(pos);

        // 畫面要震動 & 角色要播放失衡動作
        shake2D(Game.cam3D.node, .5, 25, 4);
        delay(node, .2, () => {
            count(0, 6, i => {
                let fish = Game.fishMgr.getFishTower(i);    // 有可能為空值
                fish?.getFishSetting()?.fakeDead();
            });
        });

        // 撲滿開出的鑰匙特效調弱一些
        let keyFx = find(node, 'active/New_fega_03hit');
        keyFx.setScale(.4, .4, 1);
        setOpacity(keyFx, 156);

        let hole = Game.bgMgr.getBG(0).getChildByName('KeyHole');
        let goal = Game.cam3D.convertToUINode(hole.worldPosition, Game.node.effectLayer.parent);
        goal.add3f(0, 120, 0);

        delay(node, .8, () => {
            tween(node)
                .to(.4, { position: goal }, { easing: easeInOut(3) })
                .start();
        });

        soundManager.playEffect(SoundName.tower06_blow3);
        playAnime(node, 'Key_In', null, () => {
            node.destroy();
            endFunc?.();
        });
    }

    /**
     * 是否隱藏金豬撲滿
     */
    hideBankUI(toggle: boolean) {
        if (toggle === true) {
            fadeTween(this.bank2DNode, .2, -1, 0)
                .call(() => this.bank2DNode.active = false)
                .start();
        }
        else {
            this.bank2DNode.active = true;
            fadeTween(this.bank2DNode, .2, -1, 255)
                .start();
        }
    }

    /**
     * 表演主塔是中 JP 或 藏寶庫 (兩種只會有一種)
     */
    showReward(ack: prot.protocol.HitAckData, endFunc: Function) {
        if (!ack.remove[0])
            return;

        if (ack.remove[0].jackpot) {
            let bet = ack.bet;
            let { type, coin } = ack.remove[0].jackpot;
            Game.piggyBank.showGetJPReward(() => {
                Game.jpBoard.showJPReward(bet, coin, (type - 1) as unknown as (0 | 1 | 2 | 3), () => endFunc?.());
            });
        }
        else if (ack.remove[0].bonus) {
            Game.piggyBank.showGetTreasureReward(() => {
                Game.uiCtrl.features3(ack, () => endFunc?.());
            });
        }
    }

}
