import { SpriteFrame } from "cc"

/**
 *  多國語系管理員
 * 
 *  遊戲端需要設定
 *  1. loadGameLangImg()  設定多國字圖，設定後遊戲端需要有相對應bundle否則會報錯
 *  2. setGameLangJson()  設定多國字串表，需要代入json資料
 * 
 *  使用getString() 和 getCommString()方法取得字串
 * 
 *  編輯器內使用LangTxt.ts掛上label元件，輸入字串編號參數即可自動讀取多國語系字串
 * 
 *  編輯器內使用LangImg.ts掛上sprite元件，輸入字圖索引參數即可自動讀取多國語系字圖
 */
export interface I18nManager {

    /**
     * 初始化遊戲端的多國語系字圖  遊戲包需有多國字圖的bundle
     *  @param langCode 語系編號
     */
    loadGameLangImg(root: string, langCode?: string)

    /**
     * 設定遊戲端字串表json檔
     *  @param jsonData json物件
     */
    setGameLangJson(jsonData: object)

    /**
     * 取得遊戲端多國語系字串
     *  @param no 字串編號
     */
    getString(no: number): string

    /**
     * 取得共用端多國語系字串
     *  @param no 字串編號
     */
    getCommString(no: number): string

    /**
     * 取得多國語系字圖
     *  @param name 字圖名稱
     */
    getLangSpriteFrame(name: string): SpriteFrame

    /**
     * 取得多國語系字圖 (共用)
     */
    getCommLangSpriteFrame(name: string): SpriteFrame

    /**
     * 取得當前語系編碼
     */
    getLangCode(): string

    /**
     * 取得字型檔
     */
    getFont(): any 

    /**
     * 取得SLOT公版遊戲名稱字串
     */
    getGameName(gameId: number): string

    /**
     * 取得語系宣告
     */
    get LangCode()

    /**
     * 取得遊戲多國語系路徑
     */
    get gameLangImgPath(): string

    /**
     * 遊戲字圖合圖是否載入完成?
     */
    isLangAtlasLoaded(): boolean

    /**
     * 共用字圖合圖是否載入完成?
     */
    isLangAtlasForCommonLoaded(): boolean

    /**
     * 遊戲字串是否載入完成?
     */
    isLangJsonLoaded(): boolean

    /**
     *  取得顯示語系編碼
     */
    getShowLangCode(): string
}

let node: I18nManager
export function Updatei18n() {
    node = Annin.i18n
}
export { node as i18nManager }