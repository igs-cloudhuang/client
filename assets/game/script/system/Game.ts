import { Camera, Node } from 'cc';
import { appManager } from 'db://annin-framework/manager';
import { Comm } from 'db://annin-framework/system';
import { DataMgr } from '../control/DataMgr';
import { GameCtrl } from '../control/GameCtrl';
import { GameMgr } from '../control/GameMgr';
import UICtrl from '../control/UICtrl';
import { ShooterGame } from '../gameplay/ShooterGame';
import FishMgr from '../gameplay/FishMgr';
import BackgroundMgr from '../gameplay/BackgroundMgr';
import ShootMgr from '../gameplay/ShootMgr';
import BulletMgr from '../gameplay/BulletMgr';
import EffectMgr from '../gameplay/EffectMgr';
import CoinDrops from '../gameplay/CoinDrops';
import Broadcast from '../gameplay/Broadcast';
import TreasureManager from '../gameplay/TreasureManager';
import AutoMatic from '../gameplay/AutoMatic';
import RetainMgr from '../gameplay/RetainMgr';
import { PiggyBank } from '../gameplay/PiggyBank';
import { JPBoard } from '../gameplay/JPBoard';
import WheelMgr from '../gameplay/WheelMgr';

export default class Game {

    // 常用元件
    static cam3D = null as Camera;
    static camUI = null as Camera;
    static dataMgr = null as DataMgr;
    static gameMgr = null as GameMgr;
    static gameCtrl = null as GameCtrl;
    static main = null as ShooterGame;
    static uiCtrl = null as UICtrl;
    static fishMgr = null as FishMgr;
    static bgMgr = null as BackgroundMgr;
    static shootMgr = null as ShootMgr;
    static bulletMgr = null as BulletMgr;
    static effectMgr = null as EffectMgr;
    static coinDrops = null as CoinDrops;
    static broadcast = null as Broadcast;
    static treasureMgr = null as TreasureManager;
    static automatic = null as AutoMatic;
    static retainMgr = null as RetainMgr;
    static piggyBank = null as PiggyBank;
    static jpBoard = null as JPBoard;
    static wheelMgr = null as WheelMgr;

    /**
     * 常用節點
     */
    static readonly node = {
        stage: null as Node,
        display: null as Node,
        fishLayer: null as Node,
        bulletLayer: null as Node,
        effectLayer: null as Node,
        effectLayer3D: null as Node,
        playerLayer: null as Node,
        buttonLayer: null as Node,
        buttonUpperLayer: null as Node,
        rewardLayer: null as Node,
        noticeLayer: null as Node,
        uiLayer: null as Node
    };

    /**
     * 押注管理
     */
    static readonly bet = {
        betList: new Array<number>(),

        getPreviousBet: () => {
            let lstBet = Game.bet.betList;
            let bet = parseFloat(Comm.storage.getItem(`${appManager.gameID}-user-bet`));
            if (!isNaN(bet) && lstBet.indexOf(bet) !== -1) return bet;
            return lstBet[1];
        },
        saveUserBet: (bet: number) => {
            Comm.storage.setItem(`${appManager.gameID}-user-bet`, bet.toString());
        }
    };

}

export enum GameLog {
    Giveup = 100,
    CallTreasure = 101,

    Auto_Start = 200,
    Auto_TotalRound = 201,
    Auto_SingleWinOver = 202,
    Auto_LessCoinStop = 203,
    Auto_OverCoinStop = 204,
    Auto_FeaturesStop1 = 205,
    Auto_FeaturesStop2 = 206,
    Auto_FeaturesStop3 = 207,

    Bullet_CoinBack = 301,

    Error_CreateFishFail = 401,
    Error_MustLogou = 402,
}
