import { Node } from 'cc';

/**
 *  邊bar管理員
 */
export interface ToolBoxManager {
    /**
     * 設定功能開關
     *  @param needFlash 如果不是初始化設定，需要主動刷新開關，需要帶true
     */
    setConfig(configCode: SettingConfig, toggle: boolean, needFlash?: boolean)
    
    /**
     * 設定YT連結
     *  @param url YT連結
     */
    setYoutubeURL(url: string)
    
    /**
     * 設定幫助網頁需要傳入的參數
     * 會不斷PostMessage自己刷新顯示資料
     *  @param parms 網頁組需要的字串資料
     */
    setHelpParms(...parms: string[])

    /**
     * 打開周邊系統介面
     *  @param endCB 動畫結束回調
     */
    openSystemBox(endCB?: Function)

    /**
     * 打開設定介面
     *  @param endCB 動畫結束回調
     */
    openSettingBox(endCB?: Function)

    /**
     * 關閉介面
     *  @param endCB 動畫結束回調
     */
    closeBox(endCB?: Function)

    /**
     * 取得碎片/道具卡收回目標節點
     * 懶得寫了  type=1是背包  type=2是碎片
     */
    getFlyItemTargetNode(type: number): Node
}

/**
 *  功能編號
 */
export enum SettingConfig {
    System,
    Setting,
    BackToLobby,
    Help,
    Report,
    Sound,
    LowDevice,
    Exit,
    Return,
    JpList,
    Youtube,
    Fairness,
    AutoPlay,
    Event,
}

let node: ToolBoxManager
export function UpdateToolBox() {
    node = Annin.ToolBox
}
export { node as toolBoxManager };

