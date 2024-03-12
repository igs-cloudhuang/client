import { Prefab } from "cc"

export interface WinmoreManager {
    /**
     *  顯示介面
     */
    openMenu()
    /**
     *  關閉介面
     */
    closeMenu()

    /**
     *  切換分頁
     */
    switchPage(_: any, pageName: string)
    
    /**
     *  嵌入更多功能分頁
     */
    createPage(pageName: string, pageOffLangImg: string, pageOnLangImg: string, pagePrefab: Prefab, redPointTag?: number, index?: number, useGameLang?: boolean)
}

let node: WinmoreManager
export function UpdateWinMore() {
    node = Annin.WinMore
}
export { node as winmoreManager }