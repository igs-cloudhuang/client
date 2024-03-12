import { _decorator, director, Component, Asset, Material, Director } from "cc";
import { EFKRender } from "./efk_render";

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('EFKConfig')
@executeInEditMode
export class EFKConfig extends Component {
    @property({ type: [Material], readonly: true })
    spriteMats: Material[] = [null, null, null, null, null, null];

    @property({ type: [Material], readonly: true })
    modelMats: Material[] = [null, null, null, null, null, null];

    @property({ type: Asset, readonly: true })
    wasm: Asset = null;

    // constructor() {
    //     super();
    //     director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
    //         EFKRender.setup(this.spriteMats.concat(this.modelMats), 0.2);
    //     });
    // }

    onLoad() {
        if (EFKRender.isInit() === true)
            return;

        // efk 基礎資源不做釋放
        let wasm = this.wasm;
        let defaultMtls = this.spriteMats.concat(this.modelMats);
        defaultMtls.forEach(mtl => mtl.addRef());
        wasm.addRef();

        EFKRender.setup(defaultMtls, 0.2);
    }
}
