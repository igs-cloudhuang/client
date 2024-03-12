import { _decorator, Component, Vec2, v2, Material, sys, MeshRenderer, game } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GlowFx')
export default class GlowFx extends Component {

    @property(MeshRenderer)
    meshRenderer: MeshRenderer = null;

    @property
    materialIdx: number = 0;

    @property
    glowValue: number = 0;

    @property(Vec2)
    moving: Vec2 = v2(0, 0);

    @property(Vec2)
    offset: Vec2 = v2(0, 0);

    @property
    tiling: number = 1;

    private lastGlowValue: number = 0;
    private material: Material = null;
    private uv: Vec2 = null;

    start() {
        if (this.meshRenderer) {
            // this.material = this.meshRenderer.getMaterial(this.materialIdx);
            this.material = this.meshRenderer.materials[this.materialIdx];
        }
        if (this.material) {
            this.material.setProperty('offset', this.offset, 0);
            this.material.setProperty('tiling', this.tiling, 0);
            this.uv = v2(this.offset);
        }
    }

    lateUpdate() {
        if (this.material && this.lastGlowValue !== this.glowValue) {
            this.material.setProperty('glowing', this.glowValue, 0);
            this.lastGlowValue = this.glowValue;
        }
        if (this.moving.x !== 0.0 || this.moving.y !== 0.0) {  // 預設為 0 且未改動過不會有精度問題, 若改動過則表示啟用 uv 流動的效果
            if (this.material && this.uv) {
                let dt = game.deltaTime;
                this.uv.x = (this.uv.x + this.moving.x * dt) % 1;
                this.uv.y = (this.uv.y + this.moving.y * dt) % 1;
                this.material.setProperty('offset', this.uv, 0);
            }
        }
    }
}
