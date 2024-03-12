import { _decorator, Component, MeshRenderer, Vec2, v2, math } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MagicPower')
export default class MagicPower extends Component {

    @property(MeshRenderer)
    meshRenderer: MeshRenderer = null;

    @property
    materialIndex: number = 0;

    @property
    minValue: number = 0;

    @property
    maxValue: number = 1;

    @property
    ratio: number = 0;

    private tempRatio: number = 0;
    private uvOffset: Vec2 = v2(0, 0);

    start() {
        this.uvOffset.x = math.lerp(this.minValue, this.maxValue, this.ratio);
        this.tempRatio = this.ratio;
        this.setMainOffset();
    }

    setMainOffset() {
        // let material = this.meshRenderer.getMaterial(this.materialIndex);
        // if (material) {
        //     material.setProperty('mainOffset', this.uvOffset, 0);
        //     console.log(this.uvOffset, 'setMainOffset bb')
        // }
        this.meshRenderer.materials[1]?.setProperty('mainOffset', this.uvOffset, 0);
    }

    lateUpdate() {
        if (this.tempRatio !== this.ratio) {
            this.uvOffset.x = math.lerp(this.minValue, this.maxValue, this.ratio);
            this.tempRatio = this.ratio;
            this.setMainOffset();
        }
    }
}
