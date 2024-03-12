import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property, disallowMultiple, requireComponent } = _decorator;

@ccclass('IndieImgLoader')
@disallowMultiple
@requireComponent(Sprite)
export class IndieImgLoader extends Component {

    @property
    imgPath: string = '';

    @property({
        tooltip: '圖片是否在共用Bundle?',
    })
    useCommon: boolean = false;

    onEnable() {
        let spr = this.node.getComponent(Sprite);
        if (spr.spriteFrame || !this.imgPath)
            return;

        let bundle = this.useCommon ? Annin.Comm.bundle.common : Annin.Comm.bundle.game;
        let url = `${this.imgPath}/spriteFrame`;
        bundle.load<SpriteFrame>(url, (err, sprFrame) => {
            // 下載回來有時間差, 要擋各種情況
            if (err || !this.node || !this.node.activeInHierarchy || !spr) {
                sprFrame?.decRef();
                return;
            }
            if (spr.spriteFrame)
                return;

            sprFrame.packable = false;
            spr.spriteFrame = sprFrame;
            sprFrame.addRef();
        });
    }

    onDisable() {
        let spr = this.node.getComponent(Sprite);
        if (spr.spriteFrame) {
            spr.spriteFrame.decRef();
            spr.spriteFrame = null;
        }
    }

}
