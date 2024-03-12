import { _decorator, color, Component, Label, Node, sp, tween, Tween, v3, Vec3 } from 'cc';
import { easeIn, easeInOut, find, lastItem, playSpine, rInt, rItem, shuffleSelf } from 'db://annin-framework/utils';
import { soundManager } from 'db://annin-framework/manager';
import { count, delay, poll } from '../system/ToolBox';
import { SoundName } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('ChargeGemsUI')
export class ChargeGemsUI extends Component {

    @property(Node)
    coinPivot: Node = null;

    @property(Node)
    gemPivot: Node = null;

    @property(Label)
    timeText: Label = null;

    private gemHintTween = null as Tween<Node>;
    private gemNodes = null as Node[];
    private endFunc = null as Function;
    private timeleft = 15;
    private mulNum = 1;

    init(wait: number, mulNum: number, endFunc: Function) {
        let pos = Game.gameCtrl.getUICenterPos();
        let gemPivot = this.gemPivot;
        let coinPivot = this.coinPivot;
        let hintNode = find(this.node, 'Root/Hint');

        let len_1 = Vec3.distance(gemPivot.position, coinPivot.position);
        gemPivot.setPosition(v3(gemPivot.position).add(pos));
        hintNode.setPosition(v3(hintNode.position).add(pos));

        let len_2 = Vec3.distance(gemPivot.position, coinPivot.position);
        let s = len_2 / len_1;
        hintNode.setPosition(v3(hintNode.position).multiplyScalar(s));

        this.gemNodes = Array.from(this.gemPivot.children);
        this.endFunc = endFunc;
        this.mulNum = mulNum;

        this.gemPivot.active = false;
        this.timeText.string = this.timeleft.toFixed(0);
        delay(this.node, wait, () => {
            this.gemPivot.active = true;
            this.gameStart();
        });
    }

    private gameStart() {
        this.startCounting();

        delay(this.node, .5, () => {
            this.gemNodes.forEach(node => {
                find(node, 'Touch').once(Node.EventType.TOUCH_START, () => this.pickUp(node));
            });
        });

        // 3 秒後播放寶石刷光提示
        this.gemHintTween = delay(this.node, 3, () => {
            this.gemHintTween = poll(this.node, 3, () => {
                this.gemNodes.forEach(node => {
                    playSpine(node, 'Loop2', false, () => {
                        playSpine(node, 'Loop', true);
                    });
                });
            });
        });
    }

    private pickUp(gemNode: Node) {
        let root = find(this.node, 'Root');
        let pos = root.inverseTransformPoint(v3(), gemNode.worldPosition);
        gemNode.setPosition(pos);
        gemNode.setParent(root);

        Tween.stopAllByTarget(this.timeText.node);
        this.gemNodes.forEach(node => {
            find(node, 'Touch').off(Node.EventType.TOUCH_START);
        });

        this.gemHintTween?.stop();
        this.gemHintTween = null;
        this.gemNodes.forEach(node => {
            if (node !== gemNode)
                playSpine(node, 'Loop_Dark', true);
        });

        find(root, 'Hint').active = false;

        let otherGemNodes = this.gemNodes.filter(node => node !== gemNode);
        let otherMulNumbers = otherGemNodes.map(() => rInt(2, 3));
        if (this.mulNum !== 5) {       // 如果自己不是 5 倍, 則其他顆寶石要出現 5 倍
            otherMulNumbers[0] = 5;
        }
        shuffleSelf(otherMulNumbers);

        // 監聽事件切換顏色
        let skin = -1;
        let skel = gemNode.getComponent(sp.Skeleton);
        skel.setEventListener((_, e) => {
            if (!(e instanceof sp.spine.Event)) {
                return;
            }
            if (e.stringValue === 'Random') {
                let last = skin;
                while (skin === last) skin = rInt(2, 5);
                this.setGemSkin(gemNode, skin);
            }
            if (e.stringValue === 'Open') {
                this.setGemSkin(gemNode, this.mulNum);
            }
        });

        // 選中的寶石開獎
        let openName = this.mulNum < 5 ? 'Open' : 'Open5X';
        playSpine(gemNode, openName, false, () => {
            // 自己開完進 Idle
            playSpine(gemNode, 'Open_Loop', true);
            soundManager.playEffect(SoundName.gem01);
            // 換其他寶石開獎
            otherGemNodes.forEach((node, i) => {
                this.setGemSkin(node, otherMulNumbers[i]);
                playSpine(node, 'Show', false, () => {
                    playSpine(node, 'Show_Loop', true);
                });
            });
            // 其他寶石開獎完等待一段時間後淡出, 進 OpenEnd 狀態
            delay(this.node, .3, () => {
                delay(this.node, .5, () => this.openEnd(gemNode));
            });
            delay(this.node, .8, () => {
                count(0, otherGemNodes.length - 2, i => {
                    playSpine(otherGemNodes[i], 'Show_End', false);
                });
                playSpine(lastItem(otherGemNodes), 'Show_End', false, () => {
                    this.gemPivot.active = false;
                });
            });
        });
    }

    private openEnd(gemNode: Node) {
        let standbyPos = v3(this.gemPivot.position);
        tween(gemNode)
            .to(.6, { position: standbyPos }, { easing: easeInOut(3) })
            .delay(.5).call(() => {
                playSpine(gemNode, 'Open_Comp', false, () => {
                    this.endFunc?.();
                });

                let goal = v3(this.coinPivot.position).add3f(0, 30, 0);
                tween(gemNode)
                    .delay(.3).to(.36, { position: goal, scale: v3(.2, .2, 1) }, { easing: easeIn(5) })
                    .call(() => soundManager.playEffect(SoundName.gem02))
                    .start();
            })
            .start();
    }

    private startCounting() {
        const prop_scale_12 = { scale: v3(1.2, 1.2, 1) };
        const prop_scale_1 = { scale: v3(1, 1, 1) };
        const warn_color = color('#FF0069');

        poll(this.timeText.node, 1, () => {
            if (this.timeleft < 0) {
                Tween.stopAllByTarget(this.timeText.node);
                this.pickUp(rItem(this.gemNodes));
                return;
            }

            this.timeText.string = this.timeleft.toFixed(0);
            this.timeleft -= 1;

            if (this.timeleft < 5) {
                this.timeText.color = warn_color;
                tween(this.timeText.node)
                    .to(.15, prop_scale_12)
                    .to(.5, prop_scale_1)
                    .start();
            }
        });
    }

    private setGemSkin(node: Node, mul: number) {
        let skel = node.getComponent(sp.Skeleton);
        if (mul >= 2 && mul <= 5) {
            let num = (mul - 1).toFixed(0);
            skel.setSkin(`Gem_${num}`);
        }
    }

}
