import { _decorator, Component, sp, Node, v3, tween, Label } from 'cc';
import { Automata } from 'db://annin-framework/system';
import { soundManager } from 'db://annin-framework/manager';
import { playSpine } from 'db://annin-framework/utils';
import { SoundName } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('WheelControl')
export default class WheelControl extends Component {

    @property(sp.Skeleton)
    wheelSpine: sp.Skeleton = null;

    @property(Node)
    touchLayer: Node = null;

    @property(Node)
    tipNode: Node[] = [];

    @property(Label)
    tipNum: Label = null;

    /**
     * 用來計算用的節點，沒其他用途
     */
    @property(Node)
    emptyNode: Node = null;

    private numAngle: number[] = [1, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 179.9, 205.6, 231.3, 257, 282.7, 308.4, 334.1];    // 各停輪角度

    private maxNum: number = 5.4;             // 倒數秒數最大值
    private currNum: number = 0;            // 倒數剩餘時間

    private odds: number = 0;

    private speedRate: number = 1 / 0.8 * 360;          // 速率上限 1圈1秒: (1 / s) * angle

    private statusCtrl: Automata = null;                    // 流程控制

    private endFunc: Function = null;

    private stopTime: number = 0;

    /**
     * spine表演節點
     */
    private wheelBone: sp.spine.Bone = null;

    start() {
        this.wheelBone = this.wheelSpine.findBone('HP_WHEEL');
    }

    init(odds: number, cb: Function) {
        console.log('wheel odds= ' + odds)
        this.flowInit();

        this.odds = odds;
        this.endFunc = cb;

        playSpine(this.wheelSpine, 'Show', false, () => {
            // playSpine(this.wheelSpine, 'Spin_Sart', false, () => {
                this.setStatus('Idle');
            // })
        });
        soundManager.playEffect(SoundName.Fire_01);
    }

    update(dt: number) {
        this.statusCtrl?.tick(dt);
    }

    click() {
        console.log('click')
        if (this.isStatus('Idle')) {
            this.playReady();
        } else if (this.isStatus('Run')) {
            this.playStop();
        }
    }

    /**
     * 待機
     */
    setIdle() {
        this.tipNode[0].active = true;
        this.tipNode[1].active = true;
        this.tipNum.node.active = true;
        this.currNum = this.maxNum;

        this.tipNum.string = this.currNum.toFixed(0);
    }

    playReady() {
        this.tipNode[0].active = false;
        this.tipNode[1].active = false;

        playSpine(this.wheelSpine, 'Spin_Sart', false, () => {
            this.setStatus('Ready_Run');
            playSpine(this.wheelSpine, 'Spin_Loop');
            this.emptyNode.setPosition(v3(0, 0));
            tween(this.emptyNode)
            .to(1, { position: v3(-360, 0, 0) }, { easing: 'cubicIn' })
            .call(() => {
                this.setStatus('Run');
            })
            .start()
        });

        this.setStatus('BeforeReadyRun');
    }

    /**
     * 停止
     */
    playStop() {
        let r = Game.wheelMgr.getIndex(this.odds);

        let stopAngel = this.numAngle[r] - 360;      // 順時針停輪角度
        
        if (this.wheelBone.rotation > stopAngel) {
            // 在停點的左側，再加一圈即可
            stopAngel -= 360;
        } else if (this.wheelBone.rotation > -360 && this.wheelBone.rotation < (stopAngel - 180)) {
            // 介於原點右側和停點的左側，-360會急停，所以多-360
            stopAngel -= 720;
        } else {
            stopAngel -= 720;
        }

        this.emptyNode.setPosition(v3(stopAngel, 0));
        
        this.setStatus('Stop');
    }

    /**
     * 是否為 status 狀態
     * @param status 
     * @returns 
     */
    isStatus(status: string) {
        let ok = false;
        let fsm = this.statusCtrl;
        if (fsm?.isRunning(fsm.states[status]) && !fsm?.isPopping()) {
            ok = true;
        }

        return ok
    }

    /**
     * 設定狀態為 status
     * @param status 
     */
    setStatus(status: string) {
        console.log('setStatus: ' + status);
        let fsm = this.statusCtrl;
        fsm?.transit(fsm.states[status]);
    }

    /**
     * 流程初始化
     */
    flowInit() {
        this.statusCtrl = new Automata('None', {
            None: (fsm: Automata) => { 
            },
            /** 待機 */
            Idle: (fsm: Automata, dt: number) => {
                if (fsm.isEntering()) {
                    this.setIdle();
                }
                this.updateIdle(dt);
            },
            BeforeReadyRun: (fsm: Automata, dt: number) => {
                if (fsm.isEntering()) {
                    this.setBeforeReadyRun();
                }
            },
            Ready_Run: (fsm: Automata, dt: number) => {
                this.updateReadyRun(dt);
            },
            Run: (fsm: Automata, dt: number) => {
                if (fsm.isEntering()) {
                    this.setRun();
                }
                this.run(dt);
            },
            Stop: (fsm: Automata, dt: number) => {
                this.stop(dt);
            },
            End: (fsm: Automata, dt: number) => {
                if (fsm.isEntering()) {
                    this.setEnd();
                }
            },
        })
    }

    updateIdle(dt: number) {
        if (this.currNum > 0) {
            this.currNum -= dt;
            if (this.currNum <= 0) {
                this.currNum = 0;
                this.click();
            }
            this.tipNum.string = this.currNum.toFixed(0);
        }
    }

    setBeforeReadyRun() {

    }

    updateReadyRun(dt: number) {
        let pos = this.emptyNode.getPosition();
        let angle = Math.abs(pos.x - this.wheelBone.rotation);
        let speed = angle / dt;
        speed = speed > this.speedRate? this.speedRate : speed;
        let rot = speed * dt;
        this.wheelBone.rotation -= rot;
        if (this.wheelBone.rotation < -360) { this.wheelBone.rotation = this.wheelBone.rotation % 360; }
    }

    setRun() {
        this.currNum = this.maxNum;
    }

    run(dt: number) {
        if (this.currNum > 0) {
            this.currNum -= dt;
            if (this.currNum <= 0) {
                this.currNum = 0;
                this.click();
            }
            // this.tipNum.string = this.currNum.toFixed(0);
        }
        this.wheelBone.rotation -= this.speedRate * dt;
        if (this.wheelBone.rotation < -360) { this.wheelBone.rotation = this.wheelBone.rotation % 360; }
    }

    stop(dt: number) {
        let pos = this.emptyNode.getPosition();

        let x = pos.x;
        let r = this.wheelBone.rotation;
        let diff = Math.abs(x - r);
        let rot = diff * 0.02;
        let base = this.speedRate * dt;
        this.wheelBone.rotation -= rot > base? base : rot;

        this.stopTime += dt;

        console.log('STOP diff: ' + diff + ', r= ' + r + ', this.wheelBone.rotation= ' + this.wheelBone.rotation + ', diff= ' + diff + ', rot= ' + rot + ', base= ' + base + ', stopTime= ' + this.stopTime);
        // 旋轉角度過小 or 停輪過久時(防呆)，即旋轉結束
        if (rot <= 0.02 || this.stopTime > 10) {
            this.wheelBone.rotation = x;
            console.log('this.wheelBone.rotation= ' + this.wheelBone.rotation)
            this.setStatus('End')
        }
    }

    setEnd() {
        playSpine(this.wheelSpine, this.odds >= 50? 'Win2' : 'Win', false, () => {
            playSpine(this.wheelSpine, 'End', false, () => {
                this.node.destroy();

                if (this.endFunc) {
                    this.endFunc();
                }
            })
        });
    }
}
