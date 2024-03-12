import { _decorator, assetManager, Component, Label } from 'cc';

/**
 * 多國字串置換工具
 */

const { ccclass, property } = _decorator;

@ccclass('GreedyLangTxt')
export class GreedyLangTxt extends Component {

    @property
    zh_cn: string = "";

    @property
    zh_tw: string = "";

    @property
    en_us: string = "";

    @property
    th_th: string = "";

    @property
    id_id: string = "";

    @property
    vi_vn: string = "";

    @property
    my_mm: string = "";

    @property
    ja_jp: string = "";

    @property
    ta_in: string = "";

    @property
    hi_in: string = "";

    @property
    ms_my: string = "";

    @property
    ko_kr: string = "";

    @property
    bn_in: string = "";

    @property
    es_ar: string = "";

    @property
    pt_br: string = "";

    @property
    it_it: string = "";

    @property
    sv_se: string = "";

    @property
    de_de: string = "";

    @property
    da_dk: string = "";

    @property
    ro_ro: string = "";

    @property
    nl_nl: string = "";

    @property
    tr_tr: string = "";

    @property
    ru_ru: string = "";

    @property
    langNo: number = 0;

    private defalut: string = this.en_us;

    start() {
        if(!!this.langNo){
            if(!!globalThis.temp_LangTable) this.loadString();
        }
        else{
            this.changeString();
        }
    }

    /**
     * 更換字串
     */
    changeString() {
        let label = this.node.getComponent(Label);
        if(!label) return;
        let lang =  globalThis.temp_Lang;
        this.defalut = this.en_us;
        switch(lang){
            case 'zh-CN': label.string = this.zh_cn; break;
            case 'zh-TW': label.string = this.zh_tw; break;
            case 'en-US': label.string = this.en_us; break;
            case 'th-TH': label.string = this.th_th; break;
            case 'id-ID': label.string = this.id_id; break;
            case 'vi-VN': label.string = this.vi_vn; break;
            case 'my-MM': label.string = this.my_mm; break;
            case 'ja-JP': label.string = this.ja_jp; break;
            // case 'ta-IN': label.string = this.ta_in; break;
            case 'ta-IN': label.string = this.en_us; break;  // 目前強制讀英文
            case 'hi-IN': label.string = this.hi_in; break;
            case 'ms-MY': label.string = this.ms_my; break;
            case 'ko-KR': label.string = this.ko_kr; break;
            case 'bn-IN': label.string = this.bn_in; break;
            case 'es-AR': label.string = this.es_ar; break;
            case 'pt-BR': label.string = this.pt_br; break;
            case 'it-IT': label.string = this.it_it; break;
            case 'sv-SE': label.string = this.en_us; break;
            case 'de-DE': label.string = this.en_us; break;
            case 'da-DK': label.string = this.en_us; break;
            case 'ro-RO': label.string = this.en_us; break;
            case 'nl-NL': label.string = this.en_us; break;
            case 'tr-TR': label.string = this.tr_tr; break;
            case 'ru-RU': label.string = this.ru_ru; break;
            default: label.string = this.defalut;
        }

        if(label.string == "") label.string = this.defalut;
    }
    
    /**
     * 讀取第一包共用Bundle內的字串表
     */
    loadString(){
        let label = this.node.getComponent(Label);
        if(!this.langNo || !label || !!!globalThis.temp_LangTable){
            return;
        }
        let stringTable = globalThis.temp_LangTable[this.langNo];
        if(stringTable) label.string = stringTable[globalThis.temp_Lang] ?? stringTable["en-US"];
        
    }

}
