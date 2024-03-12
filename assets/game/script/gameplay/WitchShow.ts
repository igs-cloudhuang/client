import { _decorator, Component, Label, Node, Vec3, UITransform, v3, tween, instantiate } from 'cc';
import { cleanNum, playAnime, rItem, find, trans3DPos, shake2D, toDecimalX } from 'db://annin-framework/utils';
import { walletManager, soundManager } from 'db://annin-framework/manager';
import { EffectNo, SoundName } from './GameDefine';
import { delay } from '../system/ToolBox';
import Fish from './Fish';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('WitchShow')
export default class WitchShow extends Component {

    @property(Label)
    oddLabel: Label = null;

    @property(Label)
    coinLabel: Label = null;

    @property(Node)
    coinNode: Node = null;

    @property(Node)
    redBall: Node = null;

    private coin: number = 0;
    private odds: number = 0;
    private value: number = 0;
    private pointCnt: number = 0;
    private tempCoin: number = 0;
    private center: Vec3 = v3(0, 0);
    private keepOdds: number = 0;

    private fishes: Fish[] = [];
    private oddsList: number[] = [];
    private soulList: Node[] = [];
    private soulFishIndex: number[] = [];

    // onLoad () {}

    start () {

    }

    update (dt) {
        this.updateValue(dt);
    }

    init(odds: number, coin: number, fishes: Fish[], center: Vec3) {
        this.odds = odds;
        this.tempCoin = cleanNum(coin / this.odds);
        this.coin = cleanNum(coin);
        this.fishes = fishes;
        this.center = center;

        this.pointCnt = this.tempCoin.toString().split('.')[1]? this.tempCoin.toString().split('.')[1].length : 0;

        // 確認倍率變化
        // let start = 1;
        this.oddsList.push(1);
        // for (let i = 1; i < this.fishes.length - 1; ++i) {
        //     start = comm.rInt(start, this.odds == 5? 3 : this.odds);
        //     this.oddsList.push(start);
        // }
        if (this.odds > 2) { this.oddsList.push(2); }
        if (this.odds > 3) { this.oddsList.push(3); }
        this.oddsList.push(this.odds);

        // 確認魂的數量
        let fishIndexList: number[] = [];
        for (let i = 0; i < this.fishes.length; ++i) {
            fishIndexList.push(this.fishes[i].getFishId());
        }

        let oddsCnt = this.odds == 5? 4 : this.odds;
        if (oddsCnt > this.fishes.length) {
            this.soulFishIndex.push(...fishIndexList);
        } else {
            while (this.soulFishIndex.length < oddsCnt) {
                let index = rItem(fishIndexList);
                this.soulFishIndex.push(index);
                let num = fishIndexList.findIndex(value => value == index);
                if (num >= 0) {
                    fishIndexList.splice(num, 1);
                } else {
                    break;
                }
            }
        }

        // RewardWitch_Start(1.35) ~ 1.2 + 0.3 + 0.2 + 1.5 + 0.95 * this.fishes.length + 0.2 + RewardWitch_Get2.7 + 0.5

        // 實際跑起來是這樣??
        let delayTime = 1.35 + 1.2 + 0.3 + 0.2 + 1.5 + 0.95 * this.soulFishIndex.length + 0.2 + 2.7 + 0.5
        // 我算的是這樣..
        //let delayTime = 1.35 + 1.9 + 1.5 + 0.95 * this.soulFishIndex.length + 0.2 + 0.7 + 2.7 + 0.5

        // console.log(this.oddsList, 'this.oddsList size= ' + this.oddsList.length + ', this.fishes size= ' + this.fishes.length)

        this.playStart();

        return delayTime
    }

    playStart() {
        playAnime(this.node, 'RewardWitch_Start');
        soundManager.playEffect(SoundName.Fire_01);
    }

    /**
     * 動畫事件控制，隕石撥放
     */
    showMeteorite() {
        Game.bgMgr.setRedSkyEffect(true);

        let pos = trans3DPos(Game.node.effectLayer3D, Game.fishMgr.getSpawnNode(), v3(this.center.x, this.center.y));

        // 隕石
        Game.effectMgr.playMeteorite(pos.add(v3(0, 25)));

        delay(this.node, 0.3, () => {
            this.meteoriteHit([1, 3]);
        });
        delay(this.node, 1.3, () => {
            this.meteoriteHit([4, 5]);
        });
        delay(this.node, 1.6, () => {
            this.coinNode.active = true;
            this.meteoriteHit([2]);
        });

        delay(this.node, 1.9, () => {
            this.soulAction();
        });
    }

    /**
     * 多顆隕石受擊(在死亡筆記本上100%死亡)
     * @param idx 
     */
    meteoriteHit(idx: number[]) {
        let count: number = 0;
        for (let i = 0; i <= idx.length; ++i) {
            let f = Game.fishMgr.getFishTower(idx[i]);
            if (f && f.isUsed()) {
                let ok = false;
                for (let i = 0; i < this.fishes.length; ++i) {
                    if (this.fishes[i] == f) {
                        ok = true;
                        let num = this.soulFishIndex.findIndex(value => value == f.getFishId())
                        if (num >= 0) {
                            this.createSoul(count, trans3DPos(Game.node.effectLayer3D, f.node));
                            Game.effectMgr.hitFishFly(v3(this.center.x, this.center.y), [], [f], () => {});
                        } else {
                            Game.effectMgr.hitFishFly(v3(this.center.x, this.center.y), [f], [], () => {});
                        }
                        count += 1;
                        break;
                    }
                }
                if (!ok) {
                    f.hitMustBeBreak();
                    f.showHurt();
                    f.damageTint(true);
                }
            }
        }

        shake2D(Game.cam3D.node, 0.8, 25, 6);
    }

    /**
     * 結算魂晶乘倍加入
     */
    playGet() {
        this.oddLabel.string = `x${this.odds}`;

        if (this.coinLabel) { this.coinLabel.string = walletManager.FormatCoinNum(this.tempCoin, this.pointCnt > 0); }

        let contsize = this.coinLabel.node.getComponent(UITransform).contentSize;

        let node = find(Game.node.rewardLayer, 'Pos_1');
        let pos = v3(-320, 0, 0);
        if (node) {
            pos.set(node.position).add3f(76, 140, 0).add3f(contsize.width * 0.38 / 2, 0, 0);
        }

        let st = playAnime(this.node, 'RewardWitch_Get')
        delay(this.node, st.duration / st.speed, () => {
            tween(this.node)
            .to(0.5, { position: v3(pos), scale: v3(0.38, 0.38, 0.38) })
            .call(() => {
                this.node.destroy();
            })
            .start()
        })
        Game.bgMgr.setRedSkyEffect(false);
    }

    showCoin() {
        if (this.coinLabel) { this.coinLabel.string = walletManager.FormatCoinNum(this.coin, this.pointCnt > 0); }
    }

    updateValue(dt) {
        if (this.value < this.tempCoin && this.coinNode.active) {
            this.value += this.tempCoin * dt * 1;
            if (this.value >= this.tempCoin) {
                this.value = this.tempCoin;
            }

            let value = toDecimalX(this.value, this.pointCnt);
            this.coinLabel.string = walletManager.FormatCoinNum(value, this.pointCnt > 0);
        }
    }

    /**
     * 建立魂球
     * @param cnt 
     * @param pos 
     */
    createSoul(cnt: number, pos: Vec3) {
        delay(this.node, 0.2, () => {
            let node = instantiate(Game.dataMgr.getEffectPf(EffectNo.FireSoul));
            if (node) {
                node.setPosition(pos.add(v3(0, 0, 70)));
                node.parent = Game.node.effectLayer3D;
    
                // let efk = node.getComponent(EffekseerComponent);
                // if (efk) { efk.playEffek(0); }

                playAnime(node, 'FireSoul_R');

                this.soulList.push(node);
                // if (this.soulList.length == this.soulFishIndex.length) {
                //     this.soulAction();
                // }
            }
            soundManager.playEffect(SoundName.Fire_06);
        })
    }

    /**
     * 魂球開始加入
     * @returns 
     */
    soulAction() {
        // FPS過低時，有機會因為數量對不上而造成卡住
        if (this.soulList.length != this.soulFishIndex.length) {
            delay(this.node, 0.05, () => {
                this.soulAction();
            })
            return;
        }

        for (let i = 0; i < this.soulList.length; ++i) {
            tween(this.soulList[i])
            .delay(1.5 + i * 0.95)
            .call(() => { soundManager.playEffect(SoundName.Fire_04); })
            .to(0.2, { position: v3(0, 300, 0) }, { easing: 'sineIn' })
            .call(() => {
                let odds = this.oddsList[i]? this.oddsList[i] : this.keepOdds;
                if (i == this.soulFishIndex.length - 1) {
                    delay(this.node, 0.7, () => {
                        this.playGet();
                    })
                    odds = this.odds;
                }

                this.oddLabel.string = `x${odds}`;
                this.catchScale(odds);

                this.soulList[i].destroy();
            })
            .start()
        }
    }

    // 魂晶受擊抖動
    catchScale(value: number) {
        if (this.keepOdds != value) {
            let scale = this.redBall.getScale();
            this.redBall.setScale(v3(scale.x * 1.1, scale.y * 1.1, scale.y * 1.1));
            playAnime(this.node, 'RewardWitch_Scale')
        } else {
            playAnime(this.node, 'RewardWitch_NoScale')
        }

        this.keepOdds = value;

        shake2D(Game.cam3D.node, 0.3, 25, 3.2);
    }

    // 動畫事件觸發音效
    scaleMusic() {
        soundManager.playEffect(SoundName.Fire_05);
    }
}
