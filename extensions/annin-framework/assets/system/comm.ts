import { AssetManager, Node } from "cc"
import { Entry } from "../entry/Entry"

interface bundle {
    common: AssetManager.Bundle
    game: AssetManager.Bundle
}

interface nodes {
    entry: Entry
    root: Node
    stage: Node
    buttonLayerRoot: Node
    buttonLayer: Node
    gameLayer: Node
    effectLayer: Node
    uiLayer: Node
    mask: Node
    loading: Node
    timer: Node
    blackBG: Node
}

interface state {
    /**
     * 是否為 demo 站
     */
    isDemo: boolean
    /**
     * 是否為 test 站
     */
    isTest: boolean
    /**
     * 是否為 送審 test 站
     */
    isLicenseTest: boolean
    /**
     * 是否是以H5模式開啟
     */
    isH5Mode: boolean
    /**
     * 是否為新手
     */
    isNovice: boolean
    /**
     * 是否登入成功
     */
    isLogin: boolean
    /**
     * 登入成功的時戳
     */
    loginTime: number
    /**
     * 進入遊戲畫面的時戳
     */
    inGameTime: number
    /**
     * 是否網路斷線 (徹底斷線)
     */
    isTotallyDisconnected: boolean
    /**
     * 是否網路斷線 (可斷線重連)
     */
    isDisconnection: boolean
    /**
     * 是否準備斷線了(跳出只能關閉遊戲的斷線視窗)
     */
    isReadyToClose: boolean
    /**
     * 連線 ping pong 時戳
     */
    pingPongTimestamp: number
    /**
     * 斷線秒數倒數
     */
    lostCountdown: number
    /**
     * 平台重連次數
     */
    retryGapCount: number
    /**
     * 遊戲包是否初始化完成
     */
    isGameReady: boolean
    /**
     * 直橫版狀態
     */
    isLandscape: boolean
    /**
     * 視窗是否顯示中(或是縮小在背景執行)
     */
    isPageVisible: boolean
    /**
     * 是否正因為遊戲中而鎖住特定功能不給玩家使用
     */
    isMainGameLock: boolean
    /**
     * 低配模式
     */
    isLowLevelDevice: boolean
    /**
     * fps
     */
    fps: number
}

interface config {
    project: string
    screenLongSideRate: number
    screenShortSideRate: number
    screenShortSideSize: number
    screenLongSideSize: number
    screenScale: number
}

interface Config {
    favorite?: boolean
    promotion?: boolean
    vip?: boolean
    top50?: boolean
    item?: boolean
    mission?: boolean
    mail?: boolean
    card?: boolean
    agent?: boolean
    rankboard?: boolean
    debris?: boolean
    backToLobbyBtn?: boolean
    serverPrefix?: number
}

class settingConfig {
    system?: boolean
    setting?: boolean
    backToLobby?: boolean
    help?: boolean
    report?: boolean
    sound?: boolean
    lowDevice?: boolean
    exit?: boolean
    return?: boolean
    jpList?: boolean
    youtube?: boolean
    fairness?: boolean
    autoPlay?: boolean
    event?: boolean
}

export interface Comm {

    /**
     * 常用節點
     */
    node: nodes

    /**
     * 遊戲全局狀態
     */
    state: state

    /**
     * server設定參數
     */
    serverConfig: Config

    /**
     * 專案參數
     */
    config: config

    /**
     * Bundle
     */
    bundle: bundle

    /**
     * 簡寫 sys.localStorage
     */
    storage: Storage

    /**
     * 用來存放全局變量 (方便統一管理)
     */
    env: Map<string, any>

    /**
     * 清除資料
     */
    clear: Function;
}

let node: Comm
export function UpdateComm() {
    node = Annin.Comm
}
export { node as Comm }