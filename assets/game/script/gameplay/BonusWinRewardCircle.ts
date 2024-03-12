import { _decorator, Component, Label, Node, tween, v3 } from 'cc';
import { cleanNum, playAnime, find, toDecimalX } from 'db://annin-framework/utils';
import { soundManager, walletManager } from 'db://annin-framework/manager';
import { SoundName, MusicName } from './GameDefine';
import { delay } from '../system/ToolBox';

const { ccclass, property } = _decorator;

@ccclass('BonusWinRewardCircle')
export default class BonusWinRewardCircle extends Component {

    @property(Label)
    coin: Label = null;

    @property(Node)
    scoreNode: Node = null;

    @property(Node)
    blueCircle: Node = null;

    @property(Label)
    roundLab: Label = null;

    private odds: number = 1;
    private value: number = 0;
    private base: number = 0;
    private max: number = 0;
    private scoreTime: number = 1;
    private endCB: Function = null;
    private pointCnt: number = 0;
    private round: number = 0;

    private bSkip: boolean = false;

    private oddsLabel: Label = null;

    /**
     * 初始化獎圈
     * @param isMe 是否是自己獎圈
     * @param medal 獎圈編號
     * @param seat 座位編號
     * @param money coin錢
     * @param time 節點產生時間
     * @param weight 權重 0~6:一般
     * @param bet 押注額
     */
    init(odds: number, bet: number, coin: number, round: number, endCB: Function) {
        this.odds = odds;
        this.max = cleanNum(coin);
        this.base = cleanNum(this.max / this.odds);
        this.round = round;
        this.endCB = endCB;
        this.pointCnt = this.base.toString().split('.')[1]? this.base.toString().split('.')[1].length : 0;
        this.pointCnt = bet > 10? this.pointCnt : 2;

        this.scoreTime = 0.142;//this.odds >= 60? 0.167 : this.odds >= 45? 0.25 : 0.5;

        this.oddsLabel = find(this.blueCircle, 'Bet', Label);
        this.oddsLabel.string = `x${this.odds}`;
        this.play();
        soundManager.playEffect(SoundName.Treasure11, true);
        soundManager.playEffect(SoundName.Treasure12, true);
        soundManager.playMusic(MusicName.bgm5);
    }

    play() {
        this.roundLab.string = this.round.toString();
        // this.blueCircle.active = this.odds > 1;
        // this.blueCircle.active = true;

        // tween(this.blueCircle)
        //     .delay(0.2)
        //     .by(0.5, { position: v3(0, -100, 0) }, { easing: 'cubicIn' })
        //     .start();

        playAnime(this.scoreNode, '02MegaWin');
        let st = playAnime(this.node, 'FG_Compliment2_Start');
        delay(this.node, st.duration / st.speed, () => {
            this.loop();
        });
    }

    loop() {
        if (!this.bSkip) {
            playAnime(this.node, 'FG_Compliment2_Loop');
        }
    }

    end() {
        soundManager.playMusic(MusicName.bgm5_1, false);
        this.bSkip = true;
        // let st2 = playAnime(this.blueCircle, 'RewardBetNum_Up');
        if (this.blueCircle.active) {
            delay(this.node, 1, () => {
                tween(this.blueCircle)
                .to(0.2, { position: v3(0, 200, 0) }, { easing: 'sineIn' })
                .call(() => {
                    this.blueCircle.active = false;
                    this.coin.string = walletManager.FormatCoinNum(this.max, this.pointCnt > 0);
                    // playAnime(this.blueCircle, 'RewardBetNum_In');
                    let st = playAnime(this.node, 'FG_Compliment2_Counting');
                    delay(this.node, st.duration / st.speed, () => {
                        let st2 = playAnime(this.node, 'FG_Compliment2_End');
                        // delay(this.node, st2.duration / st2.speed, () => {
                        //     if (this.endCB) { this.endCB(); }
                        // })
                    })
                        
                    // this.node.parent = comm.node.buttonUpperLayer;
                    soundManager.playEffect(SoundName.Treasure13);
                })
                .start()
            })
        } else {
            this.coin.string = walletManager.FormatCoinNum(this.max, this.pointCnt > 0);
            delay(this.node, 1, () => {
                this.callEndCB();
            })
        }

        let stopSnd = () => {
            if (!soundManager.stopEffect(SoundName.Treasure11)) {
                delay(this.node, 0, () => {
                    stopSnd();
                });
            }
        }
        stopSnd();
    }

    update(dt: number) {
        this.updateValue(dt);
    }

    updateValue(dt) {
        if (this.value < this.base) {
            this.value += this.base * dt * this.scoreTime;
            if (this.value >= this.base) {
                this.value = this.base;
                this.end();
            }

            let value = toDecimalX(this.value, this.pointCnt);
            this.coin.string = walletManager.FormatCoinNum(value, this.pointCnt > 0);
        }
    }

    skip() {
        if (this.bSkip) { return; }

        this.end();

        this.value = this.base;
        this.coin.string = walletManager.FormatCoinNum(this.value, this.pointCnt > 0);
    }

    callEndCB() {
        if (this.endCB) { this.endCB(); this.endCB = null; }
    }

}
