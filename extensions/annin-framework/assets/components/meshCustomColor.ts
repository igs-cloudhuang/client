import { _decorator, Component, MeshRenderer, gfx, v4, clamp, clamp01, renderer, UIMeshRenderer } from 'cc';

const tmp_v4 = v4();

const { ccclass, property } = _decorator;

/**
 * 透明度和漂色的控制元件
 * 如果材質有使用 USE INSTANCING 功能, 則需要使用客製化的著色器 (3d-unlit-custom, etc), 
 * 並將 MeshCustomColor 元件上的 useInstancing 屬性打勾
 */
@ccclass('MeshCustomColor')
export class MeshCustomColor extends Component {

    @property({
        tooltip: '放置所需的 MeshRenderer\n(材質需要打開混合模式)',
        type: [MeshRenderer]
    })
    meshRenderers: MeshRenderer[] = [];

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
        tooltip: '材質是否勾選 USE INSTANCING (需一致)'
    })
    useInstancing: boolean = false;

    @property({
        tooltip: '是否運行遊戲後自動設定'
    })
    playOnLoad: boolean = false;

    private a_custom_color_ctrl = [0, 0];  // RG32F

    onLoad() {
        // 如果是使用 2D 方式繪製, Instancing 將不生效
        let is2DMode = this.meshRenderers.some(meshRenderer => !!meshRenderer.getComponent(UIMeshRenderer));
        if (is2DMode === true)
            this.useInstancing = false;
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
        let meshRenderers = this.meshRenderers;
        let opacity = clamp(Math.floor(value), 0, 255);
        this._opacity = opacity;

        if (this.useInstancing === true) {
            // 設定材質 instancing 屬性
            this.a_custom_color_ctrl[0] = (255 - opacity) / 255;  // 0 ~ 1
            for (let meshRenderer of meshRenderers)
                meshRenderer.setInstancedAttribute('a_custom_color_ctrl', this.a_custom_color_ctrl);
        }
        else {
            // 設定材質 uniform 屬性
            for (let meshRenderer of meshRenderers) {
                let materials = meshRenderer.materials;
                for (let mtl of materials) {
                    for (let pass of mtl.passes)
                        this.setOpacity(pass, opacity);
                }
            }
        }
    }

    /**
     * 漂色程度: 0 - 1
     */
    set bleach(value: number) {
        let meshRenderers = this.meshRenderers;
        let bleach = clamp01(value);
        this._bleach = bleach;

        if (this.useInstancing === true) {
            // 設定材質 instancing 屬性
            this.a_custom_color_ctrl[1] = bleach;
            for (let meshRenderer of meshRenderers)
                meshRenderer.setInstancedAttribute('a_custom_color_ctrl', this.a_custom_color_ctrl);
        }
        else {
            // 設定材質 uniform 屬性
            for (let meshRenderer of meshRenderers) {
                let materials = meshRenderer.materials;
                for (let mtl of materials)
                    this.setBleach(mtl.passes[0], this._bleach);  // 只有第一個 pass 會使用漂色效果
            }
        }
    }

    private setOpacity(pass: renderer.Pass, opacity: number) {
        let handle = pass.getHandle('mainColor', 0, gfx.Type.FLOAT4);
        if (handle !== 0) {
            let color = pass.getUniform(handle, tmp_v4);
            color.w = opacity / 255;
            pass.setUniform(handle, color);
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
