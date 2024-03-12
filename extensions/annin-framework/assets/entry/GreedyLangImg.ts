import { AssetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D, Tween, _decorator, assetManager, tween } from 'cc';
import { BUILD } from 'cc/env';

/**
 * 多國字圖置換工具
 * 
 *  警告: 因為圖檔直接關聯到場景內會導致該圖檔在遊戲啟動時就被下載
 *        若圖檔被包成合圖，該合圖都會被下載
 *  警告: 絕對不要直接關聯大量的合圖，會導致整張合圖都被下載下來，尤其是多國語系字圖
 */

const { ccclass, property } = _decorator;

@ccclass('GreedyLangImg')
export class GreedyLangImg extends Component {

    @property(SpriteFrame)
    zh_cn: SpriteFrame = null;

    @property(SpriteFrame)
    zh_tw: SpriteFrame = null;

    @property(SpriteFrame)
    en_us: SpriteFrame = null;

    @property(SpriteFrame)
    th_th: SpriteFrame = null;

    @property(SpriteFrame)
    id_id: SpriteFrame = null;

    @property(SpriteFrame)
    vi_vn: SpriteFrame = null;

    @property(SpriteFrame)
    my_mm: SpriteFrame = null;

    @property(SpriteFrame)
    ja_jp: SpriteFrame = null;

    @property(SpriteFrame)
    ta_in: SpriteFrame = null;

    @property(SpriteFrame)
    hi_in: SpriteFrame = null;

    @property(SpriteFrame)
    ms_my: SpriteFrame = null;

    @property(SpriteFrame)
    ko_kr: SpriteFrame = null;

    @property(SpriteFrame)
    bn_in: SpriteFrame = null;

    @property(SpriteFrame)
    es_ar: SpriteFrame = null;

    @property(SpriteFrame)
    pt_br: SpriteFrame = null;

    @property(SpriteFrame)
    it_it: SpriteFrame = null;

    @property(SpriteFrame)
    sv_se: SpriteFrame = null;

    @property(SpriteFrame)
    de_de: SpriteFrame = null;

    @property(SpriteFrame)
    da_dk: SpriteFrame = null;

    @property(SpriteFrame)
    ro_ro: SpriteFrame = null;

    @property(SpriteFrame)
    nl_nl: SpriteFrame = null;

    @property(SpriteFrame)
    tr_tr: SpriteFrame = null;

    @property(SpriteFrame)
    ru_ru: SpriteFrame = null;

    @property
    spriteName: string = "";

    @property
    path: string = "langImg";

    private defalut: SpriteFrame = null;

    start() {
        if(!!this.spriteName && !!globalThis.temp_GameBundleName){
            if(assetManager.getBundle(globalThis.temp_GameBundleName)){
                this.loadSpriteFrame();
            }
        }
        else{
            this.changeSpriteFrame();
        }
    }

    /**
     * 更換圖片(舊方法準備捨棄)
     */
    changeSpriteFrame() {
        let spr = this.node.getComponent(Sprite);
        if(!spr) return;
        let lang =  globalThis.temp_Lang;
        this.defalut = this.en_us;
        switch(lang){
            case 'zh-CN': spr.spriteFrame = this.zh_cn ?? this.defalut; break;
            case 'zh-TW': spr.spriteFrame = this.zh_tw ?? this.defalut; break;
            case 'en-US': spr.spriteFrame = this.en_us ?? this.defalut; break;
            case 'th-TH': spr.spriteFrame = this.th_th ?? this.defalut; break;
            case 'id-ID': spr.spriteFrame = this.id_id ?? this.defalut; break;
            case 'vi-VN': spr.spriteFrame = this.vi_vn ?? this.defalut; break;
            case 'my-MM': spr.spriteFrame = this.my_mm ?? this.defalut; break;
            case 'ja-JP': spr.spriteFrame = this.ja_jp ?? this.defalut; break;
            // case 'ta-IN': spr.spriteFrame = this.ta_in ?? this.defalut; break;
            case 'ta-IN': spr.spriteFrame = this.en_us ?? this.defalut; break;  // 目前強制讀英文
            case 'hi-IN': spr.spriteFrame = this.hi_in ?? this.defalut; break;
            case 'ms-MY': spr.spriteFrame = this.ms_my ?? this.defalut; break;
            case 'ko-KR': spr.spriteFrame = this.ko_kr ?? this.defalut; break;
            case 'bn-IN': spr.spriteFrame = this.bn_in ?? this.defalut; break;
            case 'es-AR': spr.spriteFrame = this.es_ar ?? this.defalut; break;
            case 'pt-BR': spr.spriteFrame = this.pt_br ?? this.defalut; break;
            case 'it-IT': spr.spriteFrame = this.it_it ?? this.defalut; break;
            case 'sv-SE': spr.spriteFrame = this.sv_se ?? this.defalut; break;
            case 'de-DE': spr.spriteFrame = this.de_de ?? this.defalut; break;
            case 'da-DK': spr.spriteFrame = this.da_dk ?? this.defalut; break;
            case 'ro-RO': spr.spriteFrame = this.ro_ro ?? this.defalut; break;
            case 'nl-NL': spr.spriteFrame = this.nl_nl ?? this.defalut; break;
            case 'tr-TR': spr.spriteFrame = this.tr_tr ?? this.defalut; break;
            case 'ru-RU': spr.spriteFrame = this.ru_ru ?? this.defalut; break;
            default: spr.spriteFrame = this.defalut;
        }
    }
    
    /**
     * 讀取遊戲Bundle內的圖片
     */
    loadSpriteFrame(endCB?: Function){
        if(!this.spriteName){
            if(endCB) endCB();
            return;
        }
        let path = this.path + "/" + globalThis.temp_Lang + "/" + this.spriteName;
        assetManager.loadAny({ dir: path, bundle: globalThis.temp_GameBundleName }, { priority: 9 }, (err, pngDatas: any[]) => {
            let imageAsset: ImageAsset = pngDatas[0];
            if (imageAsset && !err) {
                let spr = new SpriteFrame();
                let texture = new Texture2D();
                texture.image = imageAsset;
                spr.packable = false;
                spr.texture = texture;
                this.getComponent(Sprite).spriteFrame = spr;
                if(endCB) endCB();
            }
            else{
                // 讀失敗去讀英文
                let defaultLang = "/en-US/";
                let path = this.path + defaultLang + this.spriteName;
                assetManager.loadAny({ dir: path, bundle: globalThis.temp_GameBundleName }, { priority: 9 }, (err, pngDatas: any[]) => {
                    let imageAsset: ImageAsset = pngDatas[0];
                    if (imageAsset && !err) {
                        let spr = new SpriteFrame();
                        let texture = new Texture2D();
                        texture.image = imageAsset;
                        spr.packable = false;
                        spr.texture = texture;
                        this.getComponent(Sprite).spriteFrame = spr;
                    }
                    if(endCB) endCB();  // 無論失敗與否都要往下走
                })
            }
        })
    }
}