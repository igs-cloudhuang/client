import { _decorator, Component, gfx, v4, clamp, clamp01, renderer, UIOpacity, UIRenderer, math, sp } from 'cc';
import { EDITOR } from 'cc/env';

const tmp_v4 = v4();

const { ccclass, property, requireComponent } = _decorator;

/**
 * 透明度和漂色的控制元件
 * UICustomColor 是給 2D 使用的 (3D 請使用 MeshCustomColor)
 */
@ccclass('UICustomColor')
@requireComponent(UIOpacity)
export class UICustomColor extends Component {

    @property({
        tooltip: '放置所需的 UIRenderer\n(材質需要打開混合模式)',
        type: [UIRenderer]
    })
    uiRenderers: UIRenderer[] = [];

    @property({
        tooltip: '不透明程度: 0 - 255'
    })
    get opacity(): number {
        return this._opacity;
    }
    @property
    private _opacity = 255;

    @property({
        tooltip: '漂色程度: 0 - 1'
    })
    get bleach(): number {
        return this._bleach;
    }
    @property
    private _bleach = 0;

    @property({
        tooltip: '是否運行遊戲後自動設定'
    })
    playOnLoad: boolean = false;

    private uiOpa = null as UIOpacity;

    onLoad() {
        this.uiOpa = this.node.getComponent(UIOpacity);
    }

    start() {
        if (this.playOnLoad === true) {
            this.scheduleOnce(() => {
                this.opacity = this._opacity;
                this.bleach = this._bleach;
            });
        }
    }

    /**
     * 不透明程度: 0 - 255
     */
    set opacity(value: number) {
        let opacity = clamp(Math.floor(value), 0, 255);
        if (EDITOR) this.uiOpa = this.node.getComponent(UIOpacity);
        this.uiOpa.opacity = opacity;
        this._opacity = opacity;
    }

    /**
     * 漂色程度: 0 - 1
     */
    set bleach(value: number) {
        let uiRenderers = this.uiRenderers;
        let bleach = clamp01(value);
        this._bleach = bleach;

        // 設定材質 uniform 屬性
        for (let uiRenderer of uiRenderers) {
            let isSpine = uiRenderer instanceof sp.Skeleton;
            if (isSpine === true) {
                // @ts-ignore
                let mtlCache = uiRenderer._materialCache;  // spine 有自己的材質快取
                for (let key in mtlCache) {
                    this.setBleach(mtlCache[key].passes[0], bleach);  // 只有第一個 pass 會使用漂色效果
                }
            }
            else {
                let mtl = uiRenderer.getMaterialInstance(0);  // 2D 只有一個材質
                this.setBleach(mtl.passes[0], bleach);  // 只有第一個 pass 會使用漂色效果
            }
        }

        // 將客制化材質還原成共享材質, 避免 Batch 被打斷
        if (math.equals(bleach, 0) === true) {
            for (let uiRenderer of uiRenderers)
                uiRenderer.customMaterial = uiRenderer.sharedMaterial;
        }
    }

    private setBleach(pass: renderer.Pass, t: number) {
        let handle = pass.getHandle('bleachColor', 0, gfx.Type.FLOAT4);
        if (handle !== 0) {
            let color = pass.getUniform(handle, tmp_v4);
            color.w = t;
            pass.setUniform(handle, color);
        }
    }

}
