import { _decorator, Component, Material, sys, UIRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MeltFx')
export default class MeltFx extends Component {

    @property(UIRenderer)
    renderer: UIRenderer = null;

    @property
    mtlIndex: number = 0;

    @property
    value: number = 0;

    private mtl: Material = null;
    private lastValue: number = 0;

    start() {
        if (this.renderer) {
            // this.mtl = this.renderer.getMaterial(this.mtlIndex);
            this.mtl = this.renderer.materials[this.mtlIndex];
        }
        if (this.mtl) {
            this.mtl.setProperty('threshold', this.value, 0);
        }
    }

    lateUpdate() {
        if (this.mtl && this.lastValue !== this.value) {
            this.mtl.setProperty('threshold', this.value, 0);
            this.lastValue = this.value;
        }
    }
}
