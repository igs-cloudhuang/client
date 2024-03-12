import prot from '../network/protocol/protocol.js';
import { _decorator, Component, log } from 'cc';
import { appManager, walletManager } from 'db://annin-framework/manager';
import { Comm } from 'db://annin-framework/system';
import { perFrame } from '../system/ToolBox';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

/**
 * 負責處理和 Server 溝通的事務 (請求 | 接受)
 * 接受到 Server 資料, 簡單處理後轉傳給其它元件接手
 * 這裡盡量不涉及到複雜操作
 */
@ccclass('GameMgr')
export class GameMgr extends Component {

    /**
     * 初始化，此接口必須保留且內容無需再變更
     * igs todo: setCommand 調整
     */
    onLoad() {
        Game.gameMgr = this;
        appManager.setCommand(this.onCommand.bind(this));
    }

    /**
     * 釋放處理，此接口必須保留且內容無需再變更，此接口必須保留且內容無需再變更
     * igs todo: setCommand 調整
     */
    onDestroy() {
        appManager?.setCommand(null);
        Game.gameMgr = null;
    }

    /**
     * 初始化，判斷是否可開始遊戲，此接口必須保留且內容可依遊戲需求調整使用
     * igs todo: 補 log
     */
    start() {
        let isDone = () =>
            Game.bet.betList.length !== 0 &&
            Comm.state.loginTime > 0;

        // 檢查判斷載入是否完成
        perFrame(this.node, task => {
            if (!isDone())
                return;

            this.gameInit();

            appManager.readyToCloseLoading();
            task.stop();
        });
    }

    /**
     * 遊戲資料初始化，此接口必須保留且內容可依遊戲需求調整使用
     */
    private gameInit() {
        Game.gameCtrl.gameSetup();
        Comm.state.isGameReady = true;
    }

    /**
     * Server to Client，此接口必須保留且內容可依遊戲需求調整使用
     */
    private onCommand(type: prot.protocol.ServerToUser, data: Uint8Array) {
        const prot_S2U = prot.protocol.ServerToUser;
        switch (type) {
            case prot_S2U.S2U_INFO_ACK: {
                let ack = prot.protocol.InfoAck.decode(data);
                log(ack, 'S2U_INFO_ACK');
                Game.main.tableSetting(ack);
                this.setMeteoriteValue(ack.energy);
                break;
            }
            case prot_S2U.S2U_HIT_ACK: {
                let ack = prot.protocol.HitAckData.decode(data);
                log(ack, 'S2U_HIT_ACK');
                Game.main.addHitFishAck(ack);
                this.setMeteoriteValue_Client(ack); // 刷新免費彈頭進度條
                break;
            }
            case prot_S2U.S2U_GIVEUP_ACK: {
                let ack = prot.protocol.GiveUpAck.decode(data);
                log(ack, 'S2U_GIVEUP_ACK');
                Game.main.S2C_Giveup(ack);
                break;
            }
            case prot_S2U.S2U_ENERGY_ACK: {
                let ack = prot.protocol.EnergyAck.decode(data);
                this.setMeteoriteValue(ack.energy); // 刷新免費彈頭進度條
                break;
            }
            case prot_S2U.S2U_JACKPOT_ACK: {
                let ack = prot.protocol.JackpotAck.decode(data);
                Game.main.setRawJP(ack.coin);
                break;
            }
            case prot_S2U.S2U_BROADCAST: {
                let ack = prot.protocol.BroadcastData.decode(data);
                log(ack, 'S2U_BROADCAST');

                // 大砲不顯示跑馬燈
                if (ack.currency != walletManager.currency || ack.fish == 102) break;
                Game.main.showBroadcast(type, ack.theme, ack.name, ack.coin, ack.fish, ack.odds);
                break;
            }
        }
    }

    /**
     * 設定免費核彈的累計值 by server
     */
    private setMeteoriteValue(energy: number) {
        if (Game.retainMgr?.isInit()) {
            Game.retainMgr.setMeteor((Game.retainMgr.getMeteor() == 0) ? energy : Game.retainMgr.getMeteor());  // 設定初始值
            Game.retainMgr.setMeteorS(energy);
            if (Game.main.getTurret()) {
                Game.retainMgr.updateByBet(Game.main.getTurret().getBet());
            }
        }
    }

    /**
     * 設定留存武器的累計值
     */
    private setMeteoriteValue_Client(ack: prot.protocol.HitAckData) {
        if (ack.result != null) {
            // ps. failed 表示擊中但魚未死 (打假魚 server 會額外處理)
            if (ack.result === prot.protocol.HitResult.HR_FAILED || ack.result === prot.protocol.HitResult.HR_SUCCESS) {
                if (ack.type === prot.protocol.BulletType.Cannon) {
                    Game.retainMgr.setMeteor(Game.retainMgr.getMeteor() + ack.bet * 0.01 * Game.shootMgr.torpedoHitCount);
                }
                else {
                    Game.retainMgr.setMeteor(Game.retainMgr.getMeteor() + ack.bet * 0.01);
                }
                Game.retainMgr.updateByBet(Game.main.getTurret().getBet());
            }
        }
    }

    // ----------------------------------------------------------------
    // 發送 REQ 相關
    // ----------------------------------------------------------------

    U2S_HitReq(data: prot.protocol.HitReqData) {
        let bin = prot.protocol.HitReqData.encode(data).finish();
        appManager.send(prot.protocol.UserToServer.U2S_HIT_REQ, bin);
    }

    U2S_InfoReq() {
        appManager.send(prot.protocol.UserToServer.U2S_INFO_REQ, null);
    }

    U2S_EnergyReq() {
        if (!Comm.state.isGameReady) return;
        appManager.send(prot.protocol.UserToServer.U2S_ENERGY_REQ, null);
    }

    U2S_GiveupReq(data: prot.protocol.GiveUpReq) {
        let bin = prot.protocol.GiveUpReq.encode(data).finish();
        appManager.send(prot.protocol.UserToServer.U2S_GIVEUP_REQ, bin);
    }

    /**
     * 通知 Server 要 JP 資訊
     */
    U2S_JackpotReq() {
        appManager.send(prot.protocol.UserToServer.U2S_JACKPOT_REQ, null);
    }

    // ----------------------------------------------------------------
    // JP 轉換
    // ----------------------------------------------------------------

    /**
     * 總額 JP 轉換成某一級 JP
     */
    jackpotFormula(userBet: number, jpRawCoin: number, coinRate: number, type: number = 1): number {
        // 保底 (遊戲幣值) + JP池 (遊戲幣值) * 可拿取的比例 (遊戲幣值換算成基礎幣值後計算比例)
        let betScalar = 0, jpFactor = 0;
        switch (type) {
            case 4: { betScalar = 10; jpFactor = 0; break; }       // Mini
            case 3: { betScalar = 25; jpFactor = 0; break; }       // Minor
            case 2: { betScalar = 500; jpFactor = .5; break; }     // Major
            case 1: { betScalar = 1000; jpFactor = .5; break; }    // Grand
        }
        if (jpFactor <= 0) return (userBet * betScalar);
        return (userBet * betScalar) + ((jpRawCoin * jpFactor) / coinRate) * Math.min(1, (userBet * coinRate) * .1);
    }

    /**
     * 某一級 JP 轉換成總額 JP
     */
    jackpotInvFormula(userBet: number, jpCoin: number, coinRate: number, type: number = 1): number {
        // 保底 (遊戲幣值) + JP池 (遊戲幣值) * 可拿取的比例 (遊戲幣值換算成基礎幣值後計算比例)
        let betScalar = 0, jpFactor = 0;
        switch (type) {
            case 4: { betScalar = 10; jpFactor = 0; break; }      // Mini
            case 3: { betScalar = 25; jpFactor = 0; break; }      // Minor
            case 2: { betScalar = 500; jpFactor = .5; break; }     // Major
            case 1: { betScalar = 1000; jpFactor = .5; break; }    // Grand
        }
        if (jpFactor <= 0) return 0;
        return (jpCoin - (userBet * betScalar)) / (Math.min(1, (userBet * coinRate) * .1)) * coinRate / jpFactor;
    }

}
