import { _decorator, Component, MeshRenderer, Tween, tween, Node, CCInteger } from 'cc';

const DEFAULT_FORCE = 0.03;

const { ccclass, property } = _decorator;

@ccclass('PlantSwing')
export default class PlantSwing extends Component {

    @property([MeshRenderer])
    renderers: MeshRenderer[] = [];

    @property([CCInteger])
    indices: number[] = [];

    private spd: number = 1;
    private time: number = 0;
    private oldForces: number[] = [];
    private stormTweener: Tween<object> = null;
    private natureWindTweener: Tween<Node> = null;

    private loaded: boolean = false;

    onEnable() {
        if (this.loaded === false && this.oldForces.length === 0) {
            this.init();
            this.winding();
        }
    }

    onDisable() {
        this.natureWindTweener?.stop();
        this.natureWindTweener = null;
        this.stormTweener?.stop();
        this.stormTweener = null;
    }

    update(dt: number) {
        if (!this.loaded)
            return;

        for (let i of this.indices) {
            for (let renderer of this.renderers) {
                renderer.materials[i]?.setProperty('time', this.time, 0);
            }
        }

        if (this.time >= 86400) {
            this.time -= 86400;
        }
        this.time += dt * this.spd;
    }

    winding() {
        this.natureWindTweener?.stop();
        this.natureWindTweener = tween(this.node)
            .delay(8).call(() => {
                if (Math.random() < 0.4)
                    this.storming(3, 1, 2, 1);
            })
            .union().repeatForever()
            .start();
    }

    storming(maxSpd: number, t1: number, t2: number, t3: number) {
        let tw = { spd: 1, power: 1 };
        let updater = () => {
            this.spd = tw.spd;
            this.updateForces(tw.power);
        };

        this.stormTweener?.stop();
        this.stormTweener = tween(tw)
            .to(t1, { spd: maxSpd, power: 1.3 }, { onUpdate: updater })
            .to(t2, { spd: maxSpd, power: 1.3 }, { onUpdate: updater })
            .to(t3, { spd: 1, power: 1 }, { onUpdate: updater })
            .call(() => this.stormTweener = null)
            .start();
    }

    private init() {
        this.loaded = true;
        let len = this.renderers.length;
        for (let i = 0; i < len; ++i) {
            this.oldForces[i] = DEFAULT_FORCE;
        }
    }

    private updateForces(power: number) {
        if (!this.loaded)
            return;

        for (let i of this.indices) {
            this.renderers.forEach((renderer, j) => {
                renderer.materials[i]?.setProperty('force', this.oldForces[j] * power, 0);
            });
        }
    }

}
