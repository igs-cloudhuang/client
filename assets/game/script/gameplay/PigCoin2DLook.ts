import { _decorator, Component, Material, MeshRenderer, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PigCoin2DLook')
export class PigCoin2DLook extends Component {

    @property(MeshRenderer)
    meshRenderer: MeshRenderer = null;

    @property([Material])
    lstMtl: Material[] = [];

    /**
     * 0: Grand, 1: Major, 2: Minor, 3: Mini, 4: Rainbow
     */
    setCoinType(type: number) {
        this.meshRenderer.setMaterial(this.lstMtl[type], 0);
    }

}
