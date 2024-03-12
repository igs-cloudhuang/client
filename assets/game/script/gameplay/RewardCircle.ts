import { _decorator, Component, Label, lerp, UITransform, Animation, v3, tween, Vec3, game, sp } from 'cc';
import { soundManager, walletManager } from 'db://annin-framework/manager';
import { cleanNum, easeIn, find, getPointCnt, playAnime, playSpine, toDecimalX } from 'db://annin-framework/utils';
import { Automata } from 'db://annin-framework/system';
import { FishMedal, SoundName } from './GameDefine';
import { delay, fadeTween, perFrame, setOpacity } from '../system/ToolBox';
import { ChargeGemsUI } from './ChargeGemsUI';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('RewardCircle')
export default class RewardCircle extends Component {

    @property(Label)
    coin: Label = null;

    @property(sp.Skeleton)
    multSpine: sp.Skeleton = null;

    /**
     * 滾分效果
     */
    showRolling_1(bet: number, coin: number, onFinished?: Function) {
        let odds = Math.round(coin / bet);
        let goalNum = cleanNum(coin);
        let pointCnt = bet > 10 ? getPointCnt(goalNum) : 2;

        let wait = 0.5;
        let startRolling = false;

        delay(this.node, wait, () => {
            startRolling = true;
        });

        let t = 0;
        let dur = odds < 5 ? 0 : odds < 45 ? 1.5 : 2;
        let action = new Automata();
        let updater = perFrame(this.node, () => {
            if (startRolling === true) {
                let coinValue = dur == 0 ? goalNum : lerp(0, goalNum, t);

                let value = toDecimalX(coinValue, pointCnt);
                this.coin.string = walletManager.FormatCoinNum(value, pointCnt > 0);

                t = t + (game.deltaTime / dur);
                t = Math.min(1, t);

                action.tick(game.deltaTime);
            }
        });

        action.init({
            start: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    let st = playAnime(this.node, 'BG_Multiple_Start01');
                    delay(this.node, st.duration / st.speed, () => {
                        action.transit(action.states.loop);
                    });
                }
            },
            loop: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    playAnime(this.node, 'BG_Multiple_Loop');
                }
                if (t >= 1) {
                    action.transit(action.states.end);
                }
            },
            end: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    if (updater) {
                        updater.stop();
                        updater = null;
                    }

                    let st = playAnime(this.node, 'BG_Multiple_End');
                    delay(this.node, st.duration / st.speed, () => {
                        if (onFinished) onFinished();
                    });
                }
            }
        });

        action.setEntry('start');
    }

    /**
     * 水晶乘倍效果
     */
    showRolling_2(baseCoin: number, bet: number, goalCoin: number, onFinished?: Function) {
        let odds = Math.round(baseCoin / bet);
        let baseNum = cleanNum(baseCoin);
        let pointCnt = bet > 10 ? getPointCnt(baseNum) : 2;
        let mulNum = Math.round(goalCoin / baseCoin);

        let uiNode = Game.dataMgr.getReward(FishMedal.MoreOdds);
        let chargeGemsUI = uiNode.getComponent(ChargeGemsUI);
        uiNode.setParent(Game.node.rewardLayer);
        setOpacity(uiNode, 0);

        this.node.setParent(chargeGemsUI.coinPivot);   // 滾錢金額移動到寶石充能介面上
        this.node.setPosition(0, -115);

        let action = new Automata();
        let startRolling = false;

        fadeTween(uiNode, .3, 0, 255, easeIn(2))
            .call(() => {
                playAnime(uiNode, 'Start', null, () => {
                    startRolling = true;
                    action.tick();
                });
            })
            .start();

        let t = 0;
        let rollTime = odds < 5 ? .1 : odds < 30 ? .7 : odds < 45 ? 1.4 : 2.1;
        let rollTween = perFrame(this.node, () => {
            if (startRolling === true) {
                let value = toDecimalX(lerp(0, baseNum, t), pointCnt);
                this.coin.string = walletManager.FormatCoinNum(value, pointCnt > 0);
                t = t + (game.deltaTime / rollTime);
                t = Math.min(1, t);
            }
        });

        chargeGemsUI.init(.5, mulNum, () => {
            action.transit(action.states.end);
            action.tick();
        });

        action.init({
            start: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    playAnime(this.node, 'BG_Multiple_Start01', null, () => {
                        action.transit(action.states.loop);
                        action.tick();
                    });
                }
            },
            loop: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    playAnime(this.node, 'BG_Multiple_Loop');
                }
            },
            end: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    rollTween?.stop();
                    rollTween = null;

                    let goalNum = cleanNum(goalCoin);
                    let pointCnt = bet > 10 ? getPointCnt(goalNum) : 2;

                    let value = toDecimalX(goalNum, pointCnt);
                    this.coin.string = walletManager.FormatCoinNum(value, pointCnt > 0);

                    let contsize = this.coin.node.getComponent(UITransform).contentSize;
                    let node = find(Game.node.rewardLayer, 'Pos_1');
                    let goal = v3(node.position).add3f(20, 20, 0).add3f(contsize.width * .38 / 2, 0, 0);

                    playAnime(this.node, 'BG_Multiple_Start02', null, () => {
                        let p = Game.node.rewardLayer.inverseTransformPoint(v3(), this.node.worldPosition);
                        this.node.setParent(Game.node.rewardLayer);
                        this.node.setPosition(p.x, p.y);

                        fadeTween(uiNode, .3, -1, 0, easeIn(2))
                            .call(() => uiNode.destroy())
                            .start();

                        tween(this.node)
                            .to(.5, { position: goal, scale: v3(.38, .38, .38) })
                            .call(() => onFinished?.())
                            .start();
                    });
                }
            }
        });

        action.setEntry('start');
    }

    /**
     * 藏寶庫乘倍滾分效果
     */
    showRolling_4(bet: number, coin: number, mult: number, onFinished?: Function) {
        let odds = Math.round(coin / bet);
        let from = 0;
        let goalNum = cleanNum(coin);
        let pointCnt = bet > 10 ? getPointCnt(goalNum) : 2;

        let wait = 0.5;
        let startRolling = false;

        delay(this.node, wait, () => {
            startRolling = true;
        });

        let delta = 0
        let t = 0;
        let dur = odds < 5 ? 0 : odds < 45 ? 1.5 : 2;
        let action = new Automata();
        let updater = perFrame(this.node, () => {
            if (startRolling === true) {
                let coinValue = dur == 0 ? goalNum : lerp(from, goalNum, t);

                let value = toDecimalX(coinValue, pointCnt);
                this.coin.string = walletManager.FormatCoinNum(value, pointCnt > 0);

                t = t + (game.deltaTime / dur);
                t = Math.min(1, t);

                action.tick(game.deltaTime);
                delta += game.deltaTime;;
            }
        });

        action.init({
            start: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    let st = playAnime(this.node, 'BG_Multiple_Start01');
                    delay(this.node, st.duration / st.speed, () => {
                        action.transit(action.states.loop);
                    });
                }
            },
            loop: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    playAnime(this.node, 'BG_Multiple_Loop');
                }
                if (t >= 1) {
                    action.transit(action.states.readyMult);
                }
            },
            readyMult: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    this.multSpine.node.active = true;
                    this.multSpine.setSkin(`X${mult}`);
                    let diff = mult >= 10? 0.3 : 0.6;
                    let te1 = playSpine(this.multSpine, mult >= 10? 'Hit_2' : 'Hit_1')
                    delay(this.node, te1.animation.duration - diff, () => {
                        action.transit(action.states.mult);
                    })
                }
            },
            mult: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    t = 0;
                    dur = 0;
                    from = goalNum;
                    goalNum = cleanNum(coin * mult);

                    let st = playAnime(this.node, 'BG_Multiple_Start02');
                    delay(this.node, st.duration / st.speed, () => {
                        action.transit(action.states.end);
                    });
                }
            },
            end: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    if (updater) {
                        updater.stop();
                        updater = null;
                    }

                    let st = playAnime(this.node, 'BG_Multiple_End');
                    delay(this.node, st.duration / st.speed, () => {
                        if (onFinished) onFinished();
                    });
                }
            }
        });

        action.setEntry('start');

        return (dur == 0? 0.42 : dur) + wait
    }
}
