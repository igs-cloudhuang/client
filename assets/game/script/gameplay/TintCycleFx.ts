import { _decorator, Component, MeshRenderer, Color, Material, Vec4, color } from 'cc';

const tmp_color = color();

const { ccclass, property } = _decorator;

@ccclass('TintCycleFx')
export default class TintCycleFx extends Component {

    @property(MeshRenderer)
    meshRenderer: MeshRenderer = null;

    @property
    materialIdx: number = 0;

    @property
    brightness: number = 1.8;

    @property
    cycleSec: number = 3;

    @property([Color])
    colorTable: Color[] = [];

    private material: Material = null;
    private color: Vec4 = null;
    private time: number = 0;

    onLoad() {
        if (this.colorTable.length === 0) {
            this.color = new Vec4(1, 1, 1, this.brightness);
        }
        else {
            let first = this.colorTable[0];
            this.color = new Vec4(
                first.r / 255,
                first.g / 255,
                first.b / 255,
                this.brightness
            );
        }
    }

    start() {
        if (this.meshRenderer) {
            this.material = this.meshRenderer.materials[this.materialIdx];
        }
        if (this.material) {
            this.material.setProperty('tintColor', this.color, 0);
        }
    }

    update(dt: number) {
        let time = this.time;
        let cycleSec = this.cycleSec;

        // lerp color
        if (this.material) {
            let colors = this.colorTable;
            if (colors.length >= 2) {
                let interval = cycleSec / (colors.length - 1);
                let threshold = 0;
                let index = 0;

                for (let i = 0; time > threshold; ++i) {
                    threshold += interval;
                    index = i;
                }

                let t = 1 - ((threshold - time) / interval);
                tmp_color.set(colors[index]);
                let rgb = tmp_color.lerp(colors[index + 1], t);
                let myColor = this.color;

                myColor.x = rgb.r / 255;
                myColor.y = rgb.g / 255;
                myColor.z = rgb.b / 255;
            }
            this.material.setProperty('tintColor', this.color, 0);
        }

        time += dt;
        while (time > cycleSec) time -= cycleSec;

        this.time = time;
    }

    setBrightness(num: number) {
        this.brightness = num;
        this.color.w = num;
    }

}
