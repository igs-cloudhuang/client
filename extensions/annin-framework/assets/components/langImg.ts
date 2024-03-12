import { _decorator, Component, Sprite, SpriteAtlas, tween } from 'cc';
import { EDITOR } from 'cc/env';
import { cancelLateUpdate } from '../utils';

const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent } = _decorator;

@ccclass('LangImg')
@disallowMultiple
@executeInEditMode
@requireComponent(Sprite)
export class LangImg extends Component {

    /**
     * 讓其它 LangImg 元件共享相同的 PreviewAtlas (編輯器模式)
     */
    private static sharedPreviewAtlas = null as SpriteAtlas;

    @property({
        tooltip: '預覽用的合圖 (編輯器模式)',
        type: SpriteAtlas,
    })
    previewAtlas: SpriteAtlas = null;

    @property
    spriteName: string = '';

    @property({
        tooltip: '是否使用共用字圖?',
    })
    useCommon: boolean = false;

    /**
     * 上次共享的合圖 (編輯器模式)
     */
    private lastSharedPreviewAtlas = null as SpriteAtlas;

    onLoad(): void {
        this.node.on("changeSpriteFrame", this.changeSpriteFrame, this);
    }

    start() {
        this.prepareForPreviewInEditor();

        if (!EDITOR) {
            this.init();
        }
    }

    private init() {
        let isAtlasLoaded = this.useCommon === false ? Annin.i18n.isLangAtlasLoaded : Annin.i18n.isLangAtlasForCommonLoaded;
        if (isAtlasLoaded() === true) {
            this.changeSpriteFrame(this.spriteName);
            return;
        }

        // 如果合圖加載中, 則等待載入完成
        let waiting = tween(this.node)
            .call(() => {
                if (isAtlasLoaded() === true) {
                    this.changeSpriteFrame(this.spriteName);
                    waiting.stop();
                    waiting = null;
                }
            })
            .delay(0.1)
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 更換圖片
     */
    changeSpriteFrame(name: string) {
        let isAtlasLoaded = this.useCommon === false ? Annin.i18n.isLangAtlasLoaded : Annin.i18n.isLangAtlasForCommonLoaded;
        if (isAtlasLoaded() === false) {
            // 尚未讀取好圖片之前，只替換圖片名稱等讀取好自動changeSpriteFrame一次
            this.spriteName = name;
            return;
        }

        this.spriteName = name;
        let sprite = this.getComponent(Sprite);
        let frame = this.useCommon === false ? Annin.i18n.getLangSpriteFrame(name) : Annin.i18n.getCommLangSpriteFrame(name);
        if (sprite && frame) {
            sprite.spriteFrame = frame;
        }
    }

    // ----------------------------------------------------------------
    // 編輯器用的函式
    // ----------------------------------------------------------------

    prepareForPreviewInEditor() {
        if (EDITOR) {
            this.adjustComponentOrdering();
        }

        if (EDITOR) {
            (<any>LangImg).prototype._onBeforeSerialize = function (props: any) {
                this.onBeforeSerialize();
                return false;
            }
        }

        // 要隔一幀才能正確關閉 lateUpdate
        if (!EDITOR) {
            this.scheduleOnce(() => cancelLateUpdate(this));
        }
    }

    adjustComponentOrdering() {
        if (EDITOR) {
            let sprite = this.getComponent(Sprite);
            if (!sprite) return;

            // 調整自己的順序到 Sprite 元件之前
            let components = (<any>this).node._components as any[];
            let i = -1, j = -1;

            components.forEach((comp, index) => {
                if (comp === this) i = index;
                if (comp === sprite) j = index;
            });

            if (i > j) {
                components.splice(i, 1);
                components.splice(j, 0, this);
            }
        }
    }

    onBeforeSerialize() {
        if (EDITOR) {
            LangImg.sharedPreviewAtlas = null;
            this.previewAtlas = null;

            let sprite = this.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = null;
            }
        }
    }

    lateUpdate() {
        if (EDITOR) {
            if (this.lastSharedPreviewAtlas !== LangImg.sharedPreviewAtlas) {
                this.previewAtlas = LangImg.sharedPreviewAtlas;
            }

            if (this.previewAtlas) {
                if (LangImg.sharedPreviewAtlas !== this.previewAtlas) {
                    LangImg.sharedPreviewAtlas = this.previewAtlas;
                }
            }
            else if (LangImg.sharedPreviewAtlas) {
                this.previewAtlas = LangImg.sharedPreviewAtlas;
            }

            if (this.lastSharedPreviewAtlas !== LangImg.sharedPreviewAtlas) {
                let sprite = this.getComponent(Sprite);
                if (sprite && LangImg.sharedPreviewAtlas) {
                    sprite.spriteFrame = LangImg.sharedPreviewAtlas.getSpriteFrame(this.spriteName);;
                }
                this.lastSharedPreviewAtlas = LangImg.sharedPreviewAtlas;
            }
        }
    }

}
