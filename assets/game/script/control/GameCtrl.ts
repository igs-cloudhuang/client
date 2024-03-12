import { Component, Node, Tween, _decorator, log, input, Input, profiler, EventKeyboard, KeyCode, lerp, view, Vec3, v3 } from 'cc';
import { DEBUG, PREVIEW } from 'cc/env';
import { i18nManager, walletManager, appManager, TouchMoveType, msgboxManager, toastManager, touchMoveManager } from 'db://annin-framework/manager';
import { cleanNum, find, rItem } from 'db://annin-framework/utils';
import { Bus, BusEvent } from 'db://annin-framework/system';
import { delay, poll, setUISize } from '../system/ToolBox';
import { FishMedal } from '../gameplay/GameDefine';
import RewardCircle from '../gameplay/RewardCircle';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

/**
 * 負責處理遊戲框架相關的事務 (玩家資訊, 金流之類的)
 * 遊戲規則或瑣碎的東西請透過其他元件完成處理
 */
@ccclass('GameCtrl')
export class GameCtrl extends Component {

    /**
     * 初始化，此接口必須保留且內容無需再變更
     */
    onLoad() {
        Game.gameCtrl = this;
        i18nManager.loadGameLangImg('res/langImg/');

        Bus.always(BusEvent.AgentBroadcast, this.betListListener, this);
        Bus.always(BusEvent.UpdateWallet, this.updateWallet, this);           // 金流刷新事件註冊
        Bus.always(BusEvent.CloseLoadingPage, this.gameStart, this);
        Bus.always(BusEvent.GameReadyToClose, this.gameEnd, this);

        // 如果建立 Stage 之前, BusEvent.AgentBroadcast 已觸發的話
        // 需要自己從 appManager 拿 betList
        if (appManager.betList.length !== 0) {
            this.betListListener();
        }

        // for test
        let myUrl = appManager.getUrl();
        let isTestEnv = myUrl.includes('test-wbgame') || myUrl.includes('test-jlgame'); isTestEnv = false;  // 2 測先關掉
        let isMyBuild = myUrl.includes('web-mobile');
        if (PREVIEW || DEBUG || isTestEnv || isMyBuild) {
            input.off(Input.EventType.KEY_UP, this.keyUpTest, this);
            input.on(Input.EventType.KEY_UP, this.keyUpTest, this);
            input.off(Input.EventType.KEY_DOWN, this.keyDownTest, this);
            input.on(Input.EventType.KEY_DOWN, this.keyDownTest, this);
        }
        if (isMyBuild) {
            profiler.showStats();
        }
    }

    /**
     * 釋放處理，此接口必須保留且內容無需再變更
     */
    onDestroy() {
        Bus.cancel(BusEvent.AgentBroadcast, this.betListListener, this);
        Bus.cancel(BusEvent.UpdateWallet, this.updateWallet, this);           // 金流刷新事件註冊
        Bus.cancel(BusEvent.CloseLoadingPage, this.gameStart, this);
        Bus.cancel(BusEvent.GameReadyToClose, this.gameEnd, this);

        Tween.stopAllByTarget(this.node);
        walletManager.clearBuffers();
        Game.bet.betList = [];
        Game.gameCtrl = null;
    }

    /**
     * 初始化，此接口必須保留且內容無需再變更
     */
    start() {
        // 調整 3D 攝影機位置 (3D 砲台要置底)
        Game.node.stage.on(Node.EventType.SIZE_CHANGED, this.updateCam3DPosition, this);
        this.updateCam3DPosition();

        poll(this.node, 5, () => {
            Game.gameMgr.U2S_EnergyReq();
            this.pongListener();
        });
    }

    /**
     * update，此接口必須保留且內容無需再變更
     */
    update(dt: number) {
    }

    /**
     * 內部測試用
     */
    private keyUpTest(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.ARROW_DOWN:
            case KeyCode.SPACE: {
                Game.shootMgr?.touchShoot(false);
                break;
            }
        }
    }

    /**
     * 內部測試用
     */
    private keyDownTest(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.SLASH: {
                Game.uiCtrl?.switchShootState('Torpedo');
                break;
            }
            case KeyCode.ARROW_DOWN:
            case KeyCode.SPACE: {
                Game.shootMgr?.touchShoot(true, true);
                break;
            }
            case KeyCode.ARROW_RIGHT:
            case KeyCode.PERIOD: {
                Game.uiCtrl?.toolEvent(null, 'Giveup', false);
                break;
            }
            case KeyCode.KEY_T: {
                Game.uiCtrl?.features2(false);
                break;
            }
            case KeyCode.KEY_B: {
                if (!!Game.piggyBank) {
                    Game.piggyBank['hitCnt'] = 9999;
                    Game.piggyBank.updateBankState();
                }
                break;
            }
            case KeyCode.KEY_N: {
                Game.piggyBank?.showBankReward(() => {
                    Game.piggyBank?.showGetJPReward(() => {
                        let bet = Game.main?.getTurret()?.getBet();
                        if (!isNaN(bet)) Game.jpBoard?.showJPReward(bet, 50000, 0, () => {
                            Game.main?.stopShooting(false);
                        });
                    });
                });
                break;
            }
            case KeyCode.KEY_M: {
                let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_1);
                let reward = rewardNode.getComponent(RewardCircle);
                reward.node.setParent(Game.node.rewardLayer);
                let baseOdds = 40, bet = 1, mul = rItem([2, 3, 5]);
                reward.showRolling_2(baseOdds * bet, bet, baseOdds * mul, () => {
                    reward.node.destroy();
                });
                break;
            }
            case KeyCode.DIGIT_1: {    // Grand JP
                let bet = Game.main?.getTurret()?.getBet();
                if (!isNaN(bet)) Game.jpBoard?.showJPReward(bet, 50000, 0, () => {
                    Game.main?.stopShooting(false);
                });
                break;
            }
            case KeyCode.DIGIT_2: {    // Major JP
                let bet = Game.main?.getTurret()?.getBet();
                if (!isNaN(bet)) Game.jpBoard?.showJPReward(bet, 5000, 1, () => {
                    Game.main?.stopShooting(false);
                });
                break;
            }
            case KeyCode.DIGIT_3: {    // Minor JP
                let bet = Game.main?.getTurret()?.getBet();
                if (!isNaN(bet)) Game.jpBoard?.showJPReward(bet, 500, 2, () => {
                    Game.main?.stopShooting(false);
                });
                break;
            }
            case KeyCode.DIGIT_4: {    // Mini JP
                let bet = Game.main?.getTurret()?.getBet();
                if (!isNaN(bet)) Game.jpBoard?.showJPReward(bet, 50, 3, () => {
                    Game.main?.stopShooting(false);
                });
                break;
            }
        }
    }

    /**
     * 長螢幕下要調整 3D 攝影機的位置
     */
    private updateCam3DPosition() {
        if (Game.cam3D !== null) {
            let uiSize = setUISize(Game.node.stage, -1, -1);
            let resol = view.getDesignResolutionSize();
            let pivot = Game.cam3D.node.parent;
            let t = Math.max(0, (uiSize.height - resol.height) / (1600 - resol.height));
            pivot.setPosition(0, lerp(0, -132, t));    // 按畫面調出來的數值
        }
    }

    /**
     * 刷新 Wifi 圖示 無須調整，此接口必須保留且內容無需再變更
     * igs todo: 收到回檔後須自己補上內容
     */
    private pongListener = () => {
        let latency = appManager.latency;
        if (latency >= 600) { this.updateWiFi(0); return; }
        if (latency >= 300) { this.updateWiFi(1); return; }
        if (latency >= 150) { this.updateWiFi(2); return; }
        if (latency >= 0) { this.updateWiFi(3); return; }
    };

    /**
     * BetList 監聽
     */
    private betListListener() {
        Game.bet.betList = appManager.betList.slice();
        Game.bet.betList.forEach((bet, i, betList) => {
            betList[i] = cleanNum(bet);
        });
        log(`betList: [${Game.bet.betList.toString()}].`);
    }

    /**
     * 設定遊戲相關資訊 (Server 給的資料)，此接口必須保留且內容可依遊戲需求調整使用
     */
    gameSetup() {
        touchMoveManager.setTouchMove(TouchMoveType.BackToLobby, {
            portrait: { isAbsoluteRight: true, diffRight: 15, isAbsoluteTop: true, diffTop: 15 },
            landscape: { isAbsoluteRight: true, diffRight: 15, isAbsoluteTop: true, diffTop: 15 },
        });

        // 儲值按鈕
        let depositWorldPos = Game.uiCtrl.torpedoBtn.node.worldPosition;
        touchMoveManager.setTouchMove(TouchMoveType.Deposit, {
            portrait: { worldPosX: depositWorldPos.x + 2, worldPosY: depositWorldPos.y + 97 }
        });

        appManager.setButtonLayerParent(Game.node.buttonUpperLayer);
    }

    /**
     * 遊戲進入點，此接口必須保留且內容可依遊戲需求調整使用
     */
    gameStart() {
        log('遊戲主場開始運作');
        Game.gameMgr.U2S_InfoReq();
    }

    /**
     * 遊戲停止處理(但遊戲尚未關閉)，此接口必須保留且內容無需再變更
     */
    gameEnd() {
        Game.main?.stopGame();
        appManager?.setCommand(null);
    }

    /**
     * 取得畫面置中的中心點 (長螢幕下整個場景會被置底, 故 p(0, 0) 不是畫面中心點)
     */
    getUICenterPos(out?: Vec3): Vec3 {
        let pos = out ?? v3();
        pos.set(Game.node.display.position);
        pos.y = -pos.y;
        return pos;
    }

    /**
     * todo: 更新玩家面板上的金額顯示 (事件監聽)，此接口必須保留且內容可依遊戲需求調整使用
     */
    updateWallet(userID: number) {
        let coin = walletManager.getClientRemains(userID);
        let turret = Game.main.getTurret();
        turret?.updateTurretCoin(coin);
    }

    /**
     * 準備關閉遊戲，此接口必須保留且內容可依遊戲需求調整使用
     */
    logoutAndReady2Close(endFunc: Function) {
        log('記得要停止玩家押注');
        if (endFunc) delay(this.node, .5, () => endFunc());
    }

    /**
     * 更新 WiFi 強度顯示 (0 ~ 3)
     */
    updateWiFi(level: number) {
        let wifi = find(Game.node.uiLayer, 'Title/WiFi');
        for (let i = 0; i < 3; ++i)
            wifi.children[i].active = level > i;
    }

    /**
     * 遊戲強制結束
     */
    gameShutDown() {
        appManager.disconnect();
        appManager.shutdownByMsgBox(i18nManager.getCommString(43));
        this.gameEnd();
    }

}
