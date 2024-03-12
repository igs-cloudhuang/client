import sprintf from 'sprintf-js';
import { _decorator, Animation, AnimationClip, Component, equals, instantiate, Label, Node, Prefab, RichText, tween, Tween, v3, Vec3 } from 'cc';
import { i18nManager, soundManager, walletManager } from 'db://annin-framework/manager';
import { easeIn, easeInOut, easeOut, find, playAnime, transUIPos } from 'db://annin-framework/utils';
import { Comm } from 'db://annin-framework/system';
import { delay, fadeTween, poll, setOpacity } from '../system/ToolBox';
import { PigCoin2DLook } from './PigCoin2DLook';
import { JPReward } from './JPReward';
import Game from '../system/Game';

const MinShowJPRate = 0.8;
const ShowJPSpeed = 1 / 120;  // 最遲 120 秒滾完分

const { ccclass, property } = _decorator;

@ccclass('JPBoard')
export class JPBoard extends Component {

    //#region Properties
    @property({
        type: Node,
        tooltip: 'JP Pivot',
    })
    pivot: Node = null;

    @property({
        type: Node,
        tooltip: 'Dark Panel',
    })
    darkPanel: Node = null;

    @property({
        type: [Animation],
        tooltip: '各階 JP 面板動畫',
    })
    lstJPPanelAnim: Animation[] = [];

    @property({
        type: [Label],
        tooltip: '各階 JP 金額數字 Label',
    })
    lstCoinNumText: Label[] = [];

    @property({
        type: [RichText],
        tooltip: '各階 JP 解鎖文字',
    })
    lstUnlockText: RichText[] = [];

    @property({
        type: [Node],
        tooltip: '亮光節點',
    })
    lstLightNode: Node[] = [];

    @property({
        type: [Node],
        tooltip: '豬幣節點',
    })
    lstPigCoinNode: Node[] = [];

    @property({
        type: Node,
        tooltip: 'JP 說明按鈕',
    })
    helpBtnNode: Node = null;

    @property({
        type: Animation,
        tooltip: 'JP 提示面板動畫',
    })
    tipsAnim: Animation = null;

    @property({
        type: RichText,
        tooltip: 'JP 提示文字',
    })
    tipsText: RichText = null;

    @property({
        type: Prefab,
        tooltip: 'JP 中獎表演 Prefab',
    })
    jpRewardPrefab: Prefab = null;
    //#endregion

    states = {
        None: 0, Idle: 1, Reward: 2
    };
    state = 0;

    private isJPPanelEnable = [false, false, false, true];     // 該階 JP 是否已開啟
    private pigCoinNum = [0, 0, 0, 0];                         // 各階豬幣的已收集數量
    private betLimits = [5, 2, 1, 0];                          // 各階 JP 開啟最小押注額
    private showCoin = [0, 0, 0, 0];
    private goalCoin = [0, 0, 0, 0];
    private diffCoin = [0, 0, 0, 0];

    private betBeforeLockUp = 0;

    private visible = true;
    get isVisible(): boolean {
        return this.visible;
    }

    onLoad() {
        Game.jpBoard = this;
    }

    onDestroy() {
        Tween.stopAllByTarget(this.node);
        Tween.stopAllByTarget(this.pivot);
        Game.jpBoard = null;
    }

    start() {
        let st = playAnime(this.lstJPPanelAnim[3], 'JP_UI_Unlock');    // Mini JP 全開放
        st.setTime(st.duration);                                       // 移到最後一幀

        this.state = this.states.Idle;
        this.setJPTips();

        this.showTips(5);
        this.showJPMinorMini();
        this.lstJPPanelAnim.forEach(panelAnim => {
            find(panelAnim.node, 'Actor/BG')
                .on(Node.EventType.TOUCH_START, this.showTipsByBtn, this);
        });

        let dt = 1 / 40;
        poll(this.node, dt, () => this.updateCoinText(dt));
    }

    /**
     * 刷新面板金額
     */
    private updateCoinText(dt: number) {
        if (this.state !== this.states.Idle)
            return;

        let showCoin = this.showCoin, goalCoin = this.goalCoin;
        let diffCoin = this.diffCoin, coinNum = this.lstCoinNumText;
        for (let i = 0, len = showCoin.length; i < len; ++i) {
            if (showCoin[i] >= goalCoin[i]) continue;
            showCoin[i] = Math.min(goalCoin[i], showCoin[i] + diffCoin[i] * dt);
            coinNum[i].string = walletManager.FormatCoinNum(showCoin[i], true);
        }
    }

    /**
     * 檢查各階 JP 是否開啟
     */
    checkJPPanelEnable(bet: number) {
        if (this.state !== this.states.Idle)
            return;

        let ratio = walletManager.ratio;
        let lstOpen = this.betLimits.map(betLimit => {
            let limit = betLimit * ratio;
            return bet > limit || equals(bet, limit);
        });

        let lstAnim = this.lstJPPanelAnim;
        let lstEnable = this.isJPPanelEnable;

        // 壓黑
        lstOpen.forEach((_, i) => {
            if (!lstOpen[i] && lstEnable[i]) playAnime(lstAnim[i], 'JP_UI_Lock');
        });

        // 避免重複播放 open 動畫
        let hasNewOpen = false;
        let isShowJPMinorMini = false;
        for (let i of lstOpen.keys()) {
            if (lstOpen[i] && !lstEnable[i]) {
                playAnime(lstAnim[i], 'JP_UI_Unlock');
                if (i === 2 || i === 3) isShowJPMinorMini = true;
                hasNewOpen = true;
            }
        }

        // 音效
        // if (hasNewOpen) {
        //     if (!Comm.state.isNovice) soundManager.playEffect('JP_Unlock', false, true);
        // }

        // 若是壓黑則啟動提示輪播
        lstOpen.forEach((toggle, i) => {
            let darkNode = find(lstAnim[i].node, 'Actor/Dark');
            let lockAll = find(darkNode, 'Lock_All');
            Tween.stopAllByTarget(darkNode);
            setOpacity(darkNode, 255);
            lockAll.active = true;

            if (toggle === false) {
                poll(darkNode, 14, () => {
                    tween(darkNode)
                        .delay(3.5).call(() => {
                            lockAll.active = false;
                            fadeTween(darkNode, .5, -1, 127).start();
                        })
                        .delay(8.5).call(() => {
                            lockAll.active = true;
                            fadeTween(darkNode, .5, -1, 255).start();
                        })
                        .start();
                });
            }
        });

        // 更新 lstEnable 列表
        lstOpen.forEach((toggle, i) => lstEnable[i] = toggle);
    }

    /**
     * 更新當前 JP 金額
     */
    setJPCoin(rawJP: number, bet: number) {
        let showCoin = this.showCoin, goalCoin = this.goalCoin;
        let diffCoin = this.diffCoin;
        let miniJPIdx = showCoin.length - 1;
        for (let i = 0, lastIdx = miniJPIdx - 2; i <= lastIdx; ++i) {
            let type = i + 1;
            goalCoin[i] = Game.gameMgr.jackpotFormula(bet, rawJP, walletManager.rate, type);
            if (showCoin[i] < goalCoin[i] * MinShowJPRate || showCoin[i] > goalCoin[i]) {
                showCoin[i] = goalCoin[i] * MinShowJPRate;
            }
            diffCoin[i] = (goalCoin[i] - showCoin[i]) * ShowJPSpeed;
        }
        // Mini | Minor 不滾數字 (給了一個可以刷新到數字的配置)
        for (let i = miniJPIdx - 1; i <= miniJPIdx; ++i) {
            let type = i + 1;
            goalCoin[i] = Game.gameMgr.jackpotFormula(bet, rawJP, walletManager.rate, type);
            showCoin[i] = goalCoin[i] * .999;
            diffCoin[i] = 1000;
        }
    }

    /**
     * JP 中獎演出
     */
    showJPReward(bet: number, coin: number, type: 0 | 1 | 2 | 3, endFunc: Function) {
        // 另一個 JP 演出中, 則直接加錢
        if (this.state !== this.states.Idle) {
            endFunc?.();
            return;
        }

        // 暫停玩家射擊
        let turret = Game.main.getTurret();
        Game.main.stopShooting(true, 300);
        this.betBeforeLockUp = turret.getBet();
        turret.setBet(bet);
        turret.lockBet(true);

        // 顯示完整 JP 面板
        this.showJPMinorMini(false);
        this.darkPanel.active = true;

        this.state = this.states.Reward;
        this.lstCoinNumText.forEach((coinNum, i) => {
            coinNum.string = walletManager.FormatCoinNum(this.goalCoin[i], true);
            this.showCoin[i] = this.goalCoin[i];
            this.diffCoin[i] = 0;
        });

        // 停止解鎖提示
        this.helpBtnNode.active = false;
        this.lstJPPanelAnim.forEach(jpPanelAnim => {
            let darkNode = find(jpPanelAnim.node, 'Actor/Dark');
            let lockAll = find(darkNode, 'Lock_All');
            Tween.stopAllByTarget(darkNode);
            setOpacity(darkNode, 255);
            lockAll.active = true;
        });

        let enableJPNum = this.isJPPanelEnable.filter(b => b).length;
        tween(this.pivot)
            .to(.3, { scale: v3(1.05, 1.05, 1) }, { easing: easeIn(2) })
            .call(() => {
                switch (enableJPNum) {
                    case 1: this.showJPReward_1(bet, coin, type, endFunc); break;
                    case 2: this.showJPReward_2(bet, coin, type, endFunc); break;
                    case 3: this.showJPReward_3(bet, coin, type, endFunc); break;
                    case 4: this.showJPReward_4(bet, coin, type, endFunc); break;
                    default: {
                        console.warn(`[WARN] enableJPNum is not match. enableJPNum: ${enableJPNum}, bet: ${bet}, coin: ${coin}, type: ${type}.`);
                        this.failToShowJPReward(endFunc);
                    }
                }
            })
            .start();
    }

    /**
     * showJPReward 失敗, 重置回 JP Idle 狀態 (錯誤處理)
     */
    private failToShowJPReward(endFunc?: Function) {
        this.dealWithJPRewardEnd(() => {
            tween(this.pivot)
                .to(.6, { scale: v3(1, 1, 1) }, { easing: easeOut(2) })
                .call(() => {
                    this.resetJPIdleState();
                    this.dealWithJPRewardEnd(endFunc);
                })
                .start();
        });
    }

    /**
     * 重置回 JP Idle 狀態
     */
    private resetJPIdleState() {
        let bet = Game.main.getTurret().getBet();
        this.isJPPanelEnable.forEach((_, i, toggles) => {
            let limit = this.betLimits[i] * walletManager.ratio;
            toggles[i] = bet > limit || equals(bet, limit);
        });
        this.showCoin.forEach((_, i, showCoin) => {
            showCoin[i] = 0;    // 重置狀態
        });

        // 藏寶庫中 JP 要全展開
        if (Game.bgMgr.getBGID() === 0) {
            this.helpBtnNode.active = true;
        }
        this.darkPanel.active = false;

        this.state = this.states.Idle;
        Game.main.updateJPValues();
        Game.main.updateJPLimits();
        Game.gameMgr.U2S_JackpotReq();
    }

    /**
     * JP 中獎演出 (Mini)
     */
    private showJPReward_1(bet: number, coin: number, type: 0 | 1 | 2 | 3, endFunc: Function) {
        if (type === 0 || type === 1 || type === 2) {
            console.log(`[Error] type is wrong. type: ${type}.`);
            this.failToShowJPReward(endFunc);
            return;
        }

        // soundManager.playEffect('JP_Get', false, false);
        // soundManager.playEffect('JP_Stop', false, false);

        // Mini JP 直接閃爍後播表演
        let lstAnim = this.lstJPPanelAnim;
        playAnime(lstAnim[type], 'JP_UI_Win', null, () => {
            let st = playAnime(lstAnim[type], 'JP_UI_Win_Loop', AnimationClip.WrapMode.Default, () => {
                playAnime(lstAnim[type], 'JP_UI_Unlock_Loop');
                this.node.emit('start-jp-reward');
            });
            st.repeatCount = 2;
        });

        this.node.once('start-jp-reward', () => {
            tween(this.pivot)
                .to(.4, { scale: v3(1, 1, 1) }, { easing: easeOut(2) })
                .call(() => this.resetJPIdleState())
                .start();

            let jpReward = instantiate(this.jpRewardPrefab).getComponent(JPReward);
            let pos = Game.gameCtrl.getUICenterPos(v3()).add3f(0, 50, 0);
            jpReward.node.setPosition(pos);
            jpReward.node.setParent(Game.node.rewardLayer);
            jpReward.playJPReward(type, bet, coin, () => {
                this.node.emit('end-jp-reward');
                jpReward.node.destroy();
            });
        });

        this.node.once('end-jp-reward', () => {
            this.dealWithJPRewardEnd(endFunc);
        });
    }

    /**
     * JP 中獎演出 (Minor | Mini)
     */
    private showJPReward_2(bet: number, coin: number, type: 0 | 1 | 2 | 3, endFunc: Function) {
        if (type === 0 || type === 1) {
            console.log(`[Error] type is wrong. type: ${type}.`);
            this.failToShowJPReward(endFunc);
            return;
        }

        // soundManager.playEffect('JP_Get', false, false);
        // soundManager.playEffect('JP_Stop', false, false);

        // JP 跑馬燈
        let moves = 14;
        if (type === 2) moves = 15;
        this.showJPLightRolling([3, 2], moves, () => {
            let lstAnim = this.lstJPPanelAnim;
            playAnime(lstAnim[type], 'JP_UI_Win', null, () => {
                let st = playAnime(lstAnim[type], 'JP_UI_Win_Loop', AnimationClip.WrapMode.Default, () => {
                    playAnime(lstAnim[type], 'JP_UI_Unlock_Loop');
                    this.node.emit('start-jp-reward');
                });
                st.repeatCount = 2;
            });
        });

        this.node.once('start-jp-reward', () => {
            tween(this.pivot)
                .to(.4, { scale: v3(1, 1, 1) }, { easing: easeOut(2) })
                .call(() => this.resetJPIdleState())
                .start();

            let jpReward = instantiate(this.jpRewardPrefab).getComponent(JPReward);
            let pos = Game.gameCtrl.getUICenterPos(v3()).add3f(0, 50, 0);
            jpReward.node.setPosition(pos);
            jpReward.node.setParent(Game.node.rewardLayer);
            jpReward.playJPReward(type, bet, coin, () => {
                this.node.emit('end-jp-reward');
                jpReward.node.destroy();
            });
        });

        this.node.once('end-jp-reward', () => {
            this.dealWithJPRewardEnd(endFunc);
        });
    }

    /**
     * JP 中獎演出 (Major | Minor | Mini)
     */
    private showJPReward_3(bet: number, coin: number, type: 0 | 1 | 2 | 3, endFunc: Function) {
        if (type === 0) {
            console.log(`[Error] type is wrong. type: ${type}.`);
            this.failToShowJPReward(endFunc);
            return;
        }

        // soundManager.playEffect('JP_Get', false, false);
        // soundManager.playEffect('JP_Stop', false, false);

        // JP 跑馬燈
        let moves = 18;
        if (type === 2) moves = 19;
        if (type === 1) moves = 20;
        this.showJPLightRolling([3, 2, 1], moves, () => {
            let lstAnim = this.lstJPPanelAnim;
            playAnime(lstAnim[type], 'JP_UI_Win', null, () => {
                let st = playAnime(lstAnim[type], 'JP_UI_Win_Loop', AnimationClip.WrapMode.Default, () => {
                    playAnime(lstAnim[type], 'JP_UI_Unlock_Loop');
                    this.node.emit('start-jp-reward');
                });
                st.repeatCount = 2;
            });
        });

        this.node.once('start-jp-reward', () => {
            tween(this.pivot)
                .to(.4, { scale: v3(1, 1, 1) }, { easing: easeOut(2) })
                .call(() => this.resetJPIdleState())
                .start();

            let jpReward = instantiate(this.jpRewardPrefab).getComponent(JPReward);
            let pos = Game.gameCtrl.getUICenterPos(v3()).add3f(0, 50, 0);
            jpReward.node.setPosition(pos);
            jpReward.node.setParent(Game.node.rewardLayer);
            jpReward.playJPReward(type, bet, coin, () => {
                this.node.emit('end-jp-reward');
                jpReward.node.destroy();
            });
        });

        this.node.once('end-jp-reward', () => {
            this.dealWithJPRewardEnd(endFunc);
        });
    }

    /**
     * JP 中獎演出 (Grand | Major | Minor | Mini)
     */
    private showJPReward_4(bet: number, coin: number, type: 0 | 1 | 2 | 3, endFunc: Function) {
        // soundManager.playEffect('JP_Get', false, false);
        // soundManager.playEffect('JP_Stop', false, false);

        // JP 跑馬燈
        let moves = 24;
        if (type === 2) moves = 25;
        if (type === 1) moves = 26;
        if (type === 0) moves = 27;
        this.showJPLightRolling([3, 2, 0, 1], moves, () => {
            let lstAnim = this.lstJPPanelAnim;
            playAnime(lstAnim[type], 'JP_UI_Win', null, () => {
                let st = playAnime(lstAnim[type], 'JP_UI_Win_Loop', AnimationClip.WrapMode.Default, () => {
                    playAnime(lstAnim[type], 'JP_UI_Unlock_Loop');
                    this.node.emit('start-jp-reward');
                });
                st.repeatCount = 2;
            });
        });

        this.node.once('start-jp-reward', () => {
            tween(this.pivot)
                .to(.4, { scale: v3(1, 1, 1) }, { easing: easeOut(2) })
                .call(() => this.resetJPIdleState())
                .start();

            let jpReward = instantiate(this.jpRewardPrefab).getComponent(JPReward);
            let pos = Game.gameCtrl.getUICenterPos(v3()).add3f(0, 50, 0);
            jpReward.node.setPosition(pos);
            jpReward.node.setParent(Game.node.rewardLayer);
            jpReward.playJPReward(type, bet, coin, () => {
                this.node.emit('end-jp-reward');
                jpReward.node.destroy();
            });
        });

        this.node.once('end-jp-reward', () => {
            this.dealWithJPRewardEnd(endFunc);
        });
    }

    /**
     * JP 跑馬燈效果
     */
    private showJPLightRolling(indices: number[], moves: number, endFunc: Function) {
        let dt = .2, curr = 0;
        let sequence = tween(this.node);
        for (let i = 0; i < moves; ++i) {
            sequence.call(() => {
                this.lstLightNode.forEach((light, idx) => {
                    let isLight = idx === indices[curr];
                    if (isLight) {
                        light.active = true;
                        fadeTween(light, .1, 0, 255).start();
                    }
                    else {
                        light.active = false;
                        setOpacity(light, 0);
                    }
                });
                curr = (curr + 1) % indices.length;
            })
            sequence.delay(dt);
            dt = Math.max(.14, dt - .01);
        }
        sequence.call(() => {
            this.lstLightNode.forEach(light => {
                light.active = false;
                setOpacity(light, 0);
            });
        });
        sequence.delay(dt).call(() => {
            endFunc?.();
        })
        sequence.start();
    }

    /**
     * 當中獎表演結束時的處理
     */
    private dealWithJPRewardEnd(endFunc: Function) {
        // 恢復玩家射擊
        let turret = Game.main.getTurret();
        // Game.main.stopShooting(false);    // 由呼叫者處理
        turret.setBet(this.betBeforeLockUp);
        turret.lockBet(false);
        this.resetJPMinorMiniStates();
        endFunc?.();
    }

    /**
     * 設定相關 JP 資訊
     */
    setJPTips() {
        let unlockStr = i18nManager.getString(18);
        let ratio = walletManager.ratio;
        let grandBet = sprintf.sprintf(unlockStr, ` ${walletManager.FormatCoinNum(this.betLimits[0] * ratio, true)} `);
        let majorBet = sprintf.sprintf(unlockStr, ` ${walletManager.FormatCoinNum(this.betLimits[1] * ratio, true)} `);
        let minorBet = sprintf.sprintf(unlockStr, ` ${walletManager.FormatCoinNum(this.betLimits[2] * ratio, true)} `);
        let miniBet = sprintf.sprintf(unlockStr, ` ${walletManager.FormatCoinNum(this.betLimits[3] * ratio, true)} `);

        ([grandBet, majorBet, minorBet, miniBet]).forEach((str, i) => {
            this.lstUnlockText[i].string = `<b>${str}</b>`;
        });

        let tips = [
            `<b>`,
            `<img src='JP_GRAND_TXT_L' height=24 />  ${grandBet}\n`,
            `<img src='JP_MAJOR_TXT_L' height=24 />  ${majorBet}\n`,
            `<img src='JP_MINOR_TXT_L' height=24 />  ${minorBet}`,
            `</b>`
        ];
        this.tipsText.string = tips.join('');
    }

    /**
     * 由 Button 觸發
     */
    showTipsByBtn() {
        if (this.tipsAnim.node.children[0].active === true)
            return;

        this.showTips(3);
        this.showJPMinorMini();
    }

    /**
     * 由 Button 觸發
     */
    showJPMinorMiniByBtn() {
        let openIcon = this.helpBtnNode.getChildByName('Open');
        if (openIcon.active === true)
            this.showJPMinorMini();
        else
            this.hideJPMinorMini();
    }

    /**
     * 還原先前 Minor | Mini JP 面板
     */
    resetJPMinorMiniStates() {
        if (Game.bgMgr.getBGID() === 0) {
            let state = Comm.env.get('jp-minor-mini-state') ?? '';
            switch (state) {
                case 'showing': {
                    this.showJPMinorMini();
                    break;
                }
                case 'hidden': {
                    this.hideJPMinorMini();
                    break;
                }
            }
        }
    }

    /**
     * 顯示 Minor | Mini JP 面板
     */
    showJPMinorMini(setState: boolean = true) {
        let minor = this.lstJPPanelAnim[2];
        let mini = this.lstJPPanelAnim[3];
        if (mini.node.active)
            return;

        if (setState) Comm.env.set('jp-minor-mini-state', 'showing');
        this.helpBtnNode.getChildByName('Open').active = false;
        minor.node.active = true;
        mini.node.active = true;

        minor.node.setPosition(-136, -5, 0);
        tween(minor.node)
            .to(.12, { position: v3(-182, -100, 0) }, { easing: easeIn(2) })
            .start();

        mini.node.setPosition(136, -5, 0);
        tween(mini.node)
            .to(.12, { position: v3(182, -100, 0) }, { easing: easeIn(2) })
            .start();
    }

    /**
     * 隱藏 Minor | Mini JP 面板
     */
    hideJPMinorMini(setState: boolean = true) {
        let minor = this.lstJPPanelAnim[2];
        let mini = this.lstJPPanelAnim[3];

        if (setState) Comm.env.set('jp-minor-mini-state', 'hidden');
        this.helpBtnNode.getChildByName('Open').active = true;
        minor.node.active = true;
        mini.node.active = true;

        minor.node.setPosition(-182, -100, 0);
        tween(minor.node)
            .to(.12, { position: v3(-136, -5, 0) }, { easing: easeIn(2) })
            .call(() => minor.node.active = false)
            .start();

        mini.node.setPosition(182, -100, 0);
        tween(mini.node)
            .to(.12, { position: v3(136, -5, 0) }, { easing: easeIn(2) })
            .call(() => mini.node.active = false)
            .start();

        // 隱藏時一起隱藏提示面板
        this.hideTips();
    }

    /**
     * 打開提示面板
     */
    showTips(dur: number) {
        if (this.state !== this.states.Idle)
            return;

        Tween.stopAllByTarget(this.tipsAnim.node);
        playAnime(this.tipsAnim, 'Frame_open', null, () => {
            delay(this.tipsAnim.node, dur, () => {
                playAnime(this.tipsAnim, 'Frame_close');
            });
        });
    }

    /**
     * 隱藏提示面板
     */
    hideTips() {
        if (this.tipsAnim.getState('Frame_close').isPlaying === true)
            return;
        if (this.tipsAnim.node.children[0].active === false)
            return;

        Tween.stopAllByTarget(this.tipsAnim.node);
        playAnime(this.tipsAnim, 'Frame_close');
    }

    /**
     * 取得各 JP 的解鎖押注值
     */
    getBetLimits(): number[] {
        return Array.from(this.betLimits);
    }

    /**
     * JP 面板淡入
     */
    showJPFadeIn() {
        if (this.isVisible === true)
            return;

        this.visible = true;
        tween(this.pivot)
            .to(.2, { position: v3(0, 0, 0) }, { easing: easeIn(2) })
            .start();
    }

    /**
     * JP 面板淡出
     */
    showJPFadeOut() {
        if (this.isVisible === false)
            return;

        this.visible = false;
        tween(this.pivot)
            .to(.2, { position: v3(0, 300, 0) }, { easing: easeIn(2) })
            .start();
    }

    /**
     * 顯示 JP 豬幣 UI
     */
    showPigCoinUI(toggle: boolean, resetCoinUI: boolean = false) {
        if (toggle === true) {
            this.helpBtnNode.active = false;
            this.showJPMinorMini(false);
        }
        else {
            this.helpBtnNode.active = true;
        }

        this.lstPigCoinNode.forEach(node => node.active = toggle);
        if (resetCoinUI === true) {
            this.pigCoinNum.fill(0);
            this.lstPigCoinNode.forEach(node => {
                node.children.forEach(icon => icon.children[0].active = false);
            });
        }
    }

    /**
     * 藏寶庫中 JP 豬幣收集
     */
    dropPigCoin(type: 0 | 1 | 2 | 3, posEL: Vec3, endFunc: Function) {
        let pigCoinNode = this.lstPigCoinNode[type];
        this.pigCoinNum[type] = Math.min(this.pigCoinNum[type] + 1, pigCoinNode.children.length);

        let index = this.pigCoinNum[type] - 1;
        let iconNode = pigCoinNode.children[index].children[0];

        let node = instantiate(Game.dataMgr.properties.pigCoin2D);
        node.setParent(Game.node.rewardLayer);
        node.setPosition(posEL);

        node.getComponent(PigCoin2DLook)
            .setCoinType(type);

        playAnime(node, 'PigCoin2D_In', null, () => {
            delay(node, .5, () => {
                let goal = transUIPos(Game.node.rewardLayer, iconNode);
                tween(node)
                    .to(.3, { position: goal, scale: v3(.2, .2, 1) }, { easing: easeInOut(2) })
                    .call(() => {
                        let fx = instantiate(Game.dataMgr.properties.pigCoinJPFx);
                        fx.setParent(Game.node.rewardLayer);
                        fx.setPosition(goal);

                        let name = (['GRAND', 'MAJOR', 'MINOR', 'MINI'])[type];
                        playAnime(fx, `PigCoin_${name}_Hit`, null, () => fx.destroy());

                        iconNode.active = true;
                        node.destroy();
                        endFunc?.();
                    })
                    .start();
            });
        });
    }

    /**
     * 檢查哪一種 Type 的 PigCoin 滿了 (最多只會有一個滿)
     * 都沒有滿則回傳 -1
     */
    whichPigCoinTypeFull(): number {
        for (let type = 0; type < 4; ++type) {
            if (this.pigCoinNum[type] >= this.lstPigCoinNode[type].children.length)
                return type;
        }
        return -1;
    }

}
