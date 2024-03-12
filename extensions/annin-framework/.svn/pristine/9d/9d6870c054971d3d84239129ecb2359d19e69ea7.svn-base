import { Button, color, Color, Component, Enum, Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { EDITOR } from "cc/env";
import { LangImg } from "./langImg";
import { BrandType } from "../manager";

const { ccclass, property, executeInEditMode, requireComponent, executionOrder } = _decorator;

@ccclass
@executeInEditMode(true)
@executionOrder(-1)
export default class SwitchImage extends Component {

    /**
     * 讓其它 LoadBrandImg 元件共享相同的 Brand
     */
    private static sharedBrand: BrandType = BrandType.JILI;

    @property({ group: { name: 'Image' }, type: SpriteFrame })
    normalImage: SpriteFrame[] = [];

    @property({ group: { name: 'Image' }, type: SpriteFrame })
    switchImage_india: SpriteFrame[] = [];

    @property({ group: { name: 'Image' }, type: SpriteFrame })
    switchImage_TaDa: SpriteFrame[] = [];

    @property({ group: { name: 'Image' }, type: SpriteFrame })
    switchImage_TaDaCasino: SpriteFrame[] = [];

    @property({ group: { name: 'Image' }, type: SpriteFrame })
    switchImage_JiliStar: SpriteFrame[] = [];

    @property({ group: { name: 'Node' }, type: [Node] })
    normalNode: Node[] = [];

    @property({ group: { name: 'Node' }, type: [Node] })
    switchNode_india: Node[] = [];

    @property({ group: { name: 'Node' }, type: [Node] })
    switchNode_TaDa: Node[] = [];

    @property({ group: { name: 'Node' }, type: [Node] })
    switchNode_TaDaCasino: Node[] = [];

    @property({ group: { name: 'Node' }, type: [Node] })
    switchNode_JiliStar: Node[] = [];

    @property({ group: { name: 'Color' } })
    switchColor: boolean = false;

    @property({ group: { name: 'Color' } })
    normalColor: Color = color(255, 255, 255, 255);

    @property({ group: { name: 'Color' } })
    switchColor_india: Color = color(255, 255, 255, 255);

    @property({ group: { name: 'Color' } })
    switchColor_TaDa: Color = color(255, 255, 255, 255)

    @property({ group: { name: 'Color' } })
    switchColor_JiliStar: Color = color(255, 255, 255, 255);

    @property({ group: { name: 'LangImg' } })
    normalLangImg: string = "";

    @property({ group: { name: 'LangImg' } })
    switchLangImg_india: string = "";

    @property({ group: { name: 'LangImg' } })
    switchLangImg_TaDa: string = "";

    @property({ group: { name: 'LangImg' } })
    switchLangImg_JiliStar: string = "";


    @property({
        tooltip: '預覽品牌 (編輯器模式)',
        type: Enum(BrandType),
    })
    set previewBrand(b) {
        this._previewBrand = b;
        if (EDITOR) {
            SwitchImage.sharedBrand = b;
            this.setting();
        }
    }
    get previewBrand() {
        return this._previewBrand;
    }
    _previewBrand: BrandType = BrandType.JILI;

    start() {
        //console.log(this.node.name, 'SWITCHIMG');
        if (EDITOR) {
            if (this.getComponent(Sprite) && !this.normalImage[0] && this.getComponent(Sprite).spriteFrame) {
                this.normalImage[0] = this.getComponent(Sprite).spriteFrame;
            }
        }
        else {
            this.previewBrand = Annin.App.getBrandType();
        }

        this.setting();
    }

    lateUpdate() {
        if (EDITOR) {
            // 編輯器模式下同步所有品牌切換
            if (this.previewBrand != SwitchImage.sharedBrand) {
                this.previewBrand = SwitchImage.sharedBrand;
                this.setting();
            }
        }
    }

    setting() {
        this.normalNode.forEach(node => node.active = false);
        this.switchNode_india.forEach(node => node.active = false);
        this.switchNode_TaDa.forEach(node => node.active = false);
        this.switchNode_JiliStar.forEach(node => node.active = false);
        this.switchNode_TaDaCasino.forEach(node => node.active = false);

        let resImage: SpriteFrame[];
        switch (this.previewBrand) {
            case BrandType.UFA:
            case BrandType.JILI: {
                resImage = this.normalImage;
                this.normalNode.forEach(node => node.active = true);
                this.setColor(this.normalColor);
                this.setLangImg(this.normalLangImg);
                break;
            }
            case BrandType.INDIA: {
                resImage = this.switchImage_india;
                this.switchNode_india.forEach(node => node.active = true);
                this.setColor(this.switchColor_india);
                this.setLangImg(this.switchLangImg_india);
                break;
            }
            case BrandType.TADA: {
                resImage = this.switchImage_TaDa;
                this.switchNode_TaDa.forEach(node => node.active = true);
                this.setColor(this.switchColor_TaDa);
                this.setLangImg(this.switchLangImg_TaDa);
                break;
            }
            case BrandType.JILISTAR: {
                resImage = this.switchImage_JiliStar;
                this.switchNode_JiliStar.forEach(node => node.active = true);
                this.setColor(this.switchColor_JiliStar);
                this.setLangImg(this.switchLangImg_JiliStar);
                break;
            }
            case BrandType.TADA_CASINO: {
                // 一般都吃Tada設定    Node切換如果有設定Casino版就使用Casino版
                if (this.switchImage_TaDaCasino.length > 0) resImage = this.switchImage_TaDaCasino;
                else resImage = this.switchImage_TaDa;
                if (this.switchNode_TaDaCasino.length > 0) this.switchNode_TaDaCasino.forEach(node => node.active = true);
                else this.switchNode_TaDa.forEach(node => node.active = true);
                this.setColor(this.switchColor_TaDa);
                this.setLangImg(this.switchLangImg_TaDa);
                break;
            }
            case BrandType.NONE: {
                return;
            }
        }
        if (!resImage[0]) resImage = this.normalImage;

        let spr = this.node.getComponent(Sprite);
        if (spr && resImage[0]) {
            spr.spriteFrame = resImage[0];
        }

        let btn = this.node.getComponent(Button);
        if (btn && btn.transition == Button.Transition.SPRITE) {
            btn.normalSprite = resImage[0];
            btn.pressedSprite = resImage[1];
            btn.hoverSprite = resImage[2];
            btn.disabledSprite = resImage[3];
        }
        //console.log(this.node.name, 'SWITCHIMG end');
    }

    setColor(color: Color) {
        if (!this.switchColor) return;

        if (this.getComponent(Sprite)) this.getComponent(Sprite).color = color;
        if (this.getComponent(Label)) this.getComponent(Label).color = color;
    }

    setLangImg(langKey: string) {
        if (!this.getComponent(LangImg)) return;
        if (langKey != "") {
            this.getComponent(LangImg).changeSpriteFrame(langKey);
        }
        else if (this.normalLangImg != "") {
            this.getComponent(LangImg).changeSpriteFrame(this.normalLangImg);
        }
    }

    // update (dt) {}
}
