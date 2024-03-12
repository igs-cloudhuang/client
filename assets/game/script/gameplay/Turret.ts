import { _decorator, Component, Node, Label, Animation, SkeletalAnimation, Vec3, AnimationClip, v3, Tween } from 'cc';
import { soundManager, walletManager, appManager } from 'db://annin-framework/manager';
import { find, playAnime, trans3DPos } from 'db://annin-framework/utils';
import { Comm } from 'db://annin-framework/system/comm';
import { SceneEvent, AvatarNo, EffectNo, SoundName } from './GameDefine';
import { delay } from '../system/ToolBox';
import Game from '../system/Game';

enum eState {
    NoPlayer,
    MainPlayer,
    OtherPlayer,
}

const { ccclass, property } = _decorator;

@ccclass('Turret')
export default class Turret extends Component {

    uiNo = -1;                                       // 節點編號 (1 2 3)
    pivot = null as Node;                            // 砲管旋轉點

    coinAdd = null as Node;                          // 金額加錢的節點
    betText = null as Label;                         // 押注數字
    coinText = null as Label;                        // 金額數字
    nameText = null as Label;                        // 玩家名稱
    changeAnim = null as Animation;                  // 砲台更換效果
    missileNode = null as Node;                      // 留存砲動畫節點
    cannonAnim = null as Animation;                  // 砲台動畫 (切換砲衣時要重新抓取)
    cannonSKAnim = null as Animation;                // 砲台動畫 (切換砲衣時要重新抓取)
    shootAnimName = '';                              // 射擊動畫名稱 (切換砲衣時要重新抓取)
    isAimAnim = false;                               // 當前射擊動畫是否是鎖定版本的
    muzzle = null as Node;                           // 槍口位置 (切換砲衣時要重新抓取)

    private currAvatarNo = -1;                       // 當前砲衣編號 (Cannon)
    private avatarTable = new Array<number>();       // 砲衣編號表
    private betIndex = -1;                           // 第幾號押注
    private bets = new Array<number>();              // 押注表 (隨各廳館變化)

    private state = eState.MainPlayer;               // 玩家狀態
    private lockFlag = false;                        // 是否禁止射擊
    private lockBetFlag = false;                     // 是否鎖定押注
    private playerUsedFlag = false;                  // 是否玩家有過操作
    private lockTimer = null as Tween<Node>;         // 鎖定射擊的計時器
    private powerStart = [false, false, false];

    onLoad() {
        let no = this.node.name.split('_')[1];
        let ui = Game.node.uiLayer;
        let tu = find(Game.node.playerLayer, 'Turret');

        this.uiNo = parseInt(no);
        this.pivot = find(tu, `Cannon/Cannon_${no}`);

        this.betText = find(ui, `BetNum_${no}/Num`, Label);
        this.coinText = find(ui, `CoinNum_${no}/Num`, Label);
        this.nameText = find(ui, `Name_${no}/Text`, Label);
        this.changeAnim = find(ui, `Fx_${no}`, Animation);

        this.coinAdd = find(Game.node.playerLayer, `CoinAdd/Pos_${no}`);
        this.missileNode = find(this.changeAnim.node, `Missile_EF`);

        this.pivot.destroyAllChildren();
    }

    /**
     * 對指定點開火
     */
    fire(posBL: Vec3, ok: boolean = true) {
        if (!this.playerUsedFlag) {
            this.playerUsedFlag = true;
        }
        this.aimAt(posBL);
        if (ok) { this.playShoot(); }
    }

    /**
     * 砲口對準指定點
     */
    aimAt(posBL: Vec3) {
    }

    /**
     * 播放射擊動畫
     */
    playShoot() {
        this.cannonAnim?.play(this.shootAnimName);

        let st = this.cannonSKAnim?.getState('idle01');
        if (st) {
            this.cannonSKAnim.play('idle01');
            st.wrapMode = AnimationClip.WrapMode.Normal;
            st.speed = 1.0;
        }

        let pos = trans3DPos(Game.node.effectLayer3D, this.muzzle);
        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
            Game.effectMgr?.simplePlayEfk(pos.add3f(2, 0, 0), EffectNo.ShotgunSpark, 1);
        }
        else if (Game.shootMgr.isTorpedo) {
            Game.effectMgr?.simplePlayEfk(pos, EffectNo.CannonSpark, 1);
        }
    }

    /**
     * 廳館相關設定 (押注表/砲衣等)
     */
    setTheme() {
        let apiID = appManager.apiID;
        let subCode = 0; //getSubAgentCode(); todo: server 有給 betlist 這邊就不用

        this.bets = Game.bet.betList;
        this.avatarTable = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];

        // if (apiID == 107) {
        //     this.bets        = [0.5, 1, 2, 3, 5, 8, 10, 20, 30, 50];
        //     this.avatarTable = [0,   0, 0, 0, 0, 1,  1,  1,  1,  1];
        // } else if (apiID == 110) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 50, 100, 200, 300, 500, 800, 1000, 2000];
        //     this.avatarTable = [0, 0, 0, 0, 0,  1,  1,  1,   1,   1,   2,   2,   2,    2,    2];
        // } else if (apiID == 301) {
        //     this.bets        = [10, 15, 30, 60, 90, 150, 250, 350, 500, 750, 1000, 1250, 1500, 2000, 2500];
        //     this.avatarTable = [ 0,  0,  0,  0,  0,   1,   1,   1,   1,   1,    2,    2,    2,    2,    2];
        // } else if (apiID == 621) {
        //     if (subCode == 3) {
        //         this.bets        = [5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     }
        // } else if (apiID == 542) {
        //     if (subCode == 1 || subCode == 2 || subCode == 5 || subCode == 6) {
        //         this.bets        = [5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     } else {
        //         this.bets        = [3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     }
        // } else if (apiID == 503) {
        //     if (subCode == 1) {
        //         this.bets        = [0.5, 1, 2, 3, 5, 8, 10, 20, 30];
        //         this.avatarTable = [0,   0, 0, 0, 0, 1,  1,  1,  1];
        //     }
        // } else if (apiID == 569) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 616) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 688) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 681) {
        //     if (subCode == 3 || subCode == 4 || subCode == 5 || subCode == 6 || subCode == 7 ||
        //         subCode == 16 || subCode == 17 || subCode == 18 || subCode == 19 || subCode == 20 ||
        //         subCode == 21 || subCode == 22 || subCode == 23 || subCode == 24 || subCode == 25 ||
        //         subCode == 26 || subCode == 27 || subCode == 28 || subCode == 29 || subCode == 30 ||
        //         subCode == 31 || subCode == 32 || subCode == 61 || subCode == 62 || subCode == 63 ||
        //         subCode == 64 || subCode == 65 || subCode == 66 || subCode == 67 || subCode == 68 ||
        //         subCode == 69 || subCode == 70 || subCode == 71 || subCode == 72 || subCode == 73 ||
        //         subCode == 74 || subCode == 75 || subCode == 76 || subCode == 77 || subCode == 78 ||
        //         subCode == 79 || subCode == 80 || subCode == 81 || subCode == 82 || subCode == 83 ||
        //         subCode == 84 || subCode == 85 || subCode == 86 || subCode == 119 || subCode == 120 ||
        //         subCode == 121 || subCode == 122 || subCode == 123 || subCode == 126 || subCode == 130 ||
        //         subCode == 135 || subCode == 140 || subCode == 148 || subCode == 149 || subCode == 153 ||
        //         subCode == 154 || subCode == 155 || subCode == 160 || subCode == 161 || subCode == 162 ||
        //         subCode == 163 || subCode == 164 || subCode == 168) {
        //         this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     } else {
        //         this.bets        = [2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     }
        // } else if (apiID == 801) {
        //     if (subCode == 10 || subCode == 67) {
        //         this.bets        = [3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     } else if (subCode == 88) {
        //         this.bets        = [5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //         this.avatarTable = [0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        //     }
        // } else if (apiID == 691) {
        //     this.bets        = [0.5, 1, 2, 3, 5, 8, 10, 20];
        //     this.avatarTable = [0,   0, 0, 0, 0, 1,  1,  1];
        // } else if (apiID == 1051) {
        //     if (subCode == 5 || subCode == 16 || subCode == 21 || subCode == 23 || subCode == 31 || subCode == 40) {
        //         this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500, 1000];
        // 		this.avatarTable = [0, 0, 0, 0, 0,  1,  1,  1,  1,   1,   2,   2,   2,   2,    2];
        //     }
        // } else if (apiID == 1163) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1179) {
        //     this.bets        = [20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [ 1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1238) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1881) {
        //     this.bets        = [2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1867) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1909) {
        //     this.bets        = [10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [ 1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1943) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1957) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1958) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1959) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1960) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1962) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1973) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 1987) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // } else if (apiID == 10150) {
        //     this.bets        = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 200, 300];
        //     this.avatarTable = [0, 0, 0, 0, 1,  1,  1,  1,  1,   2,   2,   2];
        // } else if (apiID == 10175) {
        //     this.bets        = [3, 5, 8, 10, 20, 30, 50, 100, 200, 300];
        //     this.avatarTable = [0, 0, 1,  1,  1,  1,  1,   2,   2,   2];
        // } else if (apiID == 10110) {
        //     this.bets        = [2, 4, 6, 8, 10, 20, 30, 40, 50, 60, 100, 200, 300, 400, 500];
        //     this.avatarTable = [0, 0, 0, 0,  0,  1,  1,  1,  1,  1,   2,   2,   2,   2,   2];
        // }

        // todo: 之後應該要接  betList
        // this.bets = comm.getCoinTypeBet(this.bets);

        this.betIndex = 0;
        // if (apiID == 681 || apiID == 6) {
        //     this.betIndex = 2;
        // }
        this.showBet(this.bets[this.betIndex]);
        this.switchAvatar();
        // this.currencyType.show();
    }

    /**
     * 更換砲衣 
     * 指定no 無條件切換該炮衣
     * 未指定no  優先判斷  水槍>重斧(只有自家會檢查)>運營炮衣(含鎖定)>普通炮衣(含鎖定、依bet)
     * no = game.eAvatarNo.Aim_Lv1 代表鎖定砲台
     */
    switchAvatar(no?: number) {
        no = no || this.avatarTable[this.betIndex];

        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
            no = AvatarNo.Multi;  // 多重砲
        } else {
            if (Game.shootMgr.isTorpedo) {
                no = AvatarNo.Torpedo;  // 重斧
            }
        }

        // 砲衣或鎖定狀態有所改變才需要轉換砲台
        if (this.currAvatarNo != no) {
            this.currAvatarNo = no;
            this.switchCannon(this.currAvatarNo);

            // 重新抓取砲口節點 (Pivot 底下只能有一個 Cannon 節點)
            if (this.pivot.children.length > 0) {
                let node = this.pivot.children[0];
                this.muzzle = find(node, 'RootNode/Muzzle');
                if (node) {
                    this.cannonAnim = node.getComponent(Animation);
                    this.cannonSKAnim = find(node, 'gun', SkeletalAnimation)
                }
            }

            // 播放動畫
            if (this.cannonAnim) {
                let clips = this.cannonAnim.clips;
                let st = this.cannonAnim.getState(clips[0].name)

                this.cannonAnim.play(clips[0].name);  // idle
                st.wrapMode = AnimationClip.WrapMode.Normal;

                this.cannonAnim.play(clips[2].name);  // change
                st.wrapMode = AnimationClip.WrapMode.Normal;

                this.shootAnimName = clips[1].name;

                if (this.state === eState.MainPlayer) {
                    this.changeAnim.play();  // change
                }
            }
        }
    }

    /**
     * 更換砲管
     */
    switchCannon(no: number) {
        for (let i = this.pivot.children.length - 1; i >= 0; --i) {  // 由後往前丟入 Pool
            Game.dataMgr.setTurretCannon(this.pivot.children[i]);
        }
        let node = Game.dataMgr.getTurretCannon(no);
        node.parent = this.pivot;
    }

    /**
     * 要顯示多少 Bet
     */
    showBet(bet: number) {
        Game.uiCtrl.setTorpedoCoin(bet * Game.shootMgr.torpedoHitCount);
        this.betText.string = walletManager.FormatCoinNum(bet);
    }

    /**
     * 強制要顯示多少 Bet
     */
    fakeShowBet(bet: number) {
        this.betText.string = walletManager.FormatCoinNum(bet);
    }

    /**
     * 設定押注
     */
    setBet(bet: number) {
        // 預設值
        let lastIdx = this.betIndex;

        // todo: 新手預設BET?
        // if (bet <= 0 && comm.app.theme <= 3) {
        //     let apiID = GetApiID();
        //     this.betIndex = this.bNoob? 0 : (apiID == 681 || apiID == 6)? 2 : 1;
        this.betIndex = 0;
        // }

        // Server 只會給押注額，找出自己的 betIndex
        let nowBet = this.bets[this.betIndex];
        for (let i = 0, len = this.bets.length; i < len; ++i) {
            if (bet === this.bets[i]) {
                this.betIndex = i;
                nowBet = bet;
                break;
            }
        }

        // 刷新免費核彈的進度條 必須在showBet之前
        Game.retainMgr?.updateByBet(this.getBet());

        // 是否切換砲衣
        if (lastIdx !== this.betIndex) {
            this.switchAvatar();
        }
        this.showBet(nowBet);

        Game.bet.saveUserBet(nowBet);  // 記錄玩家的壓注 Bet  
    }

    /**
     * 用index取得相對應押注
     */
    getBetAtIndex(betIndex: number) {
        if (betIndex < 0) {
            // console.log('getBetAtIndex out of range=', betIndex)
            return this.bets[0];
        }
        else if (betIndex < this.bets.length) {
            return this.bets[betIndex];
        }
        // console.log('getBetAtIndex out of range=', betIndex)
        return this.bets[0];
    }

    /**
     * 取得押注
     */
    getBet(): number {
        return this.bets[this.betIndex];
    }

    /**
     * 禁止射擊 (上鎖後預設 30 秒會自動解鎖)
     */
    lock(toggle: boolean, lockSec: number = 30) {
        if (this.lockTimer) {
            this.lockTimer.stop();
            this.lockTimer = null;
        }
        if (toggle) {
            this.lockTimer = delay(this.node, lockSec, () => {
                this.lockFlag = false;
                this.lockTimer = null;
                // 檢查是否可用道具卡
                Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();
            });
        }
        this.lockFlag = toggle;
        // 檢查是否可用道具卡
        Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();
    }

    /**
     * 是否禁止射擊
     */
    isLocked(): boolean {
        return this.lockFlag;
    }

    /**
     * 鎖定押注
     */
    lockBet(toggle: boolean) {
        this.lockBetFlag = toggle;
    }

    /**
     * 是否鎖定押注
     */
    isBetLocked(): boolean {
        return this.lockBetFlag;
    }

    /**
     * 設定砲台金額
     */
    updateTurretCoin(coin: number) {
        this.coinText.string = walletManager.FormatCoinNum(coin, true);
    }

    /**
     * 回傳砲台角度
     */
    getAngle(): number {
        return this.pivot.angle;
    }

    /**
     * 取得砲管方向 (子彈圖層的座標系)
     */
    getDirection(targetPos: Vec3): Vec3 {
        return v3(targetPos).subtract(this.pivot.position).normalize();
    }

    /**
     * 取得現在砲台使用的子彈編號 (目前一種砲衣對應一種子彈)
     */
    getCurrentBulletNo(): number {
        const avaNo = this.currAvatarNo;
        const bltNo = this.avatarTable[this.betIndex];

        if (avaNo === bltNo) {
            return bltNo;
        }
        else {
            switch (avaNo) {
                // case增加各種skin的子彈對應
                // case game.eAvatarNo.GoldToad: return game.eAvatarNo.GoldToad;
                // case game.eAvatarNo.Honor: return game.eAvatarNo.Honor;
            }
        }
        return avaNo;
    }

    /**
     * 取得現在的砲衣編號
     */
    getCurrentAvatarNo(): number {
        return this.currAvatarNo;
    }

    /**
     * 取得子彈生成點的位置 (子彈圖層的座標系)
     */
    getBulletSpwanPos3D(): Vec3 {
        if (this.muzzle && this.muzzle.isValid) {
            return trans3DPos(Game.node.bulletLayer, this.muzzle);
        }
        if (this.pivot) {
            let node = this.pivot.children[0];
            this.muzzle = find(node, 'RootNode/Muzzle');
        }
        return trans3DPos(Game.node.bulletLayer, this.muzzle || this.pivot);
    }

    /**
     * get bets
     */
    getBets(): number[] {
        return this.bets;
    }

    playPowerEfk(list: number[]) {
        if (this.pivot.children.length > 0) {
            let node = this.pivot.children[0];
            for (let i = 0; i < list.length; ++i) {
                if (!this.powerStart[list[i]]) {
                    this.powerStart[list[i]] = true;
                    let efk = find(node, `Chassis/Gather_gas/Gather_gas_0${list[i]}`);
                    if (efk) { efk.active = true }
                    if (list[i] == 2) {
                        soundManager.playEffect(SoundName.Treasure03, true);
                    } else if (list[i] == 3) {
                        soundManager.playEffect(SoundName.Treasure04, true);
                    }
                }
            }
        }
    }

    stopPowerEfk(list: number[]) {
        if (this.pivot.children.length > 0) {
            let stopSnd = (name: string) => {
                if (!soundManager.stopEffect(name)) {
                    delay(this.node, 0, () => stopSnd(name));
                }
            };
            let node = this.pivot.children[0];
            for (let i = 0; i < list.length; ++i) {
                if (this.powerStart[list[i]]) {
                    this.powerStart[list[i]] = false;
                    let efk = find(node, `Chassis/Gather_gas/Gather_gas_0${list[i]}`);
                    if (efk) { efk.active = false; }
                    if (list[i] == 2) {
                        stopSnd(SoundName.Treasure03);
                    } else if (list[i] == 3) {
                        stopSnd(SoundName.Treasure04);
                    }
                }
            }
        }
    }

    playMissileCharge(): number {
        let st = playAnime(this.missileNode, 'Missile_Charge');
        soundManager.playEffect(SoundName.missile_01);
        return st.duration / st.speed
    }

}
