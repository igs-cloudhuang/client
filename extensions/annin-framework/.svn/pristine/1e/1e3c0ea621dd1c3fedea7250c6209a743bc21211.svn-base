import { _decorator, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from 'cc';

const { ccclass, property, disallowMultiple, requireComponent } = _decorator;

@ccclass('LangIndieImg')
@disallowMultiple
@requireComponent(Sprite)
export class LangIndieImg extends Component {

    @property
    spriteName: string = '';

    @property({
        tooltip: '是否使用共用字圖?',
    })
    useCommon: boolean = false;

    private langCode = "";
    private default = "en-US";

    onEnable() {
        if(!this.langCode) this.langCode = Annin.i18n.getLangCode();
        this.changeSpriteFrame();
    }

    changeSpriteFrame(){
        if(!this.spriteName) return;
        let spr = this.node.getComponent(Sprite);
        if (spr.spriteFrame)
            return;

        let bundle = this.useCommon ? Annin.Comm.bundle.common : Annin.Comm.bundle.game;
        let url = `${!this.useCommon ? Annin.i18n.gameLangImgPath : 'langImg/'}${this.langCode}/${this.spriteName}`;
        bundle.load<ImageAsset>(url, (err, imageAsset) => {
            // 沒有這語系  去讀預設英文
            if (!imageAsset && this.langCode != this.default) {
                this.langCode = this.default;
                this.changeSpriteFrame();
                return;
            }
            // 下載回來有時間差, 要擋各種情況
            if (err || !this.node || !this.node.activeInHierarchy || !spr) {
                imageAsset?.decRef();
                return;
            }
            if (spr.spriteFrame)
                return;

            let newSpr = new SpriteFrame();
            let texture = new Texture2D();
            texture.image = imageAsset;
            newSpr.texture = texture;
            newSpr.packable = false;
            spr.spriteFrame = newSpr;
            imageAsset.addRef();
        });

    }

    onDisable() {
        let spr = this.node.getComponent(Sprite);
        if (spr.spriteFrame) {
            spr.spriteFrame.texture.decRef();
            spr.spriteFrame = null;
        }
    }

}
