import { _decorator, Component, ParticleSystem2D } from 'cc';

const { ccclass, property, executeInEditMode, disallowMultiple } = _decorator;

@ccclass('PS2DMtlResetor')
@executeInEditMode
@disallowMultiple
export class PS2DMtlResetor extends Component {

    private resetMtlFunc = null as Function;

    onEnable() {
        // 修正粒子材質問題 3.6.2 (每次打開粒子節點都要刷新一次材質)
        this.resetMtlFunc = () => {
            this.resetMtlFunc = null;
            let ps = this.getComponent(ParticleSystem2D);
            let mtl = ps.getMaterial(0);
            ps.setMaterial(mtl, 0);
        };
        this.scheduleOnce(this.resetMtlFunc);
    }

    onDisable() {
        if (this.resetMtlFunc !== null) {
            this.unschedule(this.resetMtlFunc);
            this.resetMtlFunc = null;
        }
    }

}
