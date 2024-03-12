
interface Func {
    (arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void
}

/**
 * 共用系統事件  遊戲端無需處理
 */
export enum BusCommonEvent {
    /**
     * 任務更新
     */
    MissionUpdate = 'mission-update',
    /**
     * 任務完成
     */
    MissionCompelete = 'mission-compelete',
    /**
     * 簽到完成
     */
    VipSign = 'vip-sign',
    /**
     * 獲得等級返利(魚機)
     */
    LevelRewardAck = 'level-reward',
    /**
     * 獲得寶箱返利(魚機)
     */
    ChestRewardAck = 'chest-reward',
    /**
     * 獲得週週返利(魚機)
     */
    WeekRewardAck = 'week-reward',
    /**
     * 信件通知獎勵
     */
    RewardMail = 'reward-mail',
    /**
     * 創建遊戲主場
     */
    CreateStage = 'create-Stage',
    /**
     * 聯合彩金同步池子金額
     */
    LinkJPDataSync = 'linkjpdata-sync',
    /**
     * 聯合彩金同步池子金額
     */
    LinkJPListSync = 'linkjplist-sync',
    /**
     * 聯合彩金中獎
     */
    LinkJPGet = 'linkjp-get',
    /**
     * 聯合彩金廣播插卡
     */
    LinkJPBroadcast = 'linkjp-broadcast',
    /**
     * 碎片系統亮紅點
     */
    DerbisRedpoint = 'derbis-redpoint',
    /**
     * 碎片系統交換完成
     */
    DerbisExchange = 'derbis-exchange',
    /**
     * 取得玩家擁有碎片
     */
    DerbisInfo = 'derbis-info',
    /**
     * 從魚機道具卡轉過來第一包資料
     */
    DerbisFromFishCard = 'derbis-from-fishcard',
    /**
     * 開啟碎片介面
     */
    DerbisUIOpen = 'derbis-openui',
    /**
     * 使用共用道具卡(Slot)
     */
    CommonItemUse = 'common-item-use',
    /**
     * 使用共用道具卡(魚機)
     */
    CommonCardUse = 'common-card-use',
    /**
     * 玩家自己發生扣錢
     */
    PlayerBetting = 'player-beting',
}

/**
 * 遊戲全局事件 
 */
export enum BusEvent {
    /**
     * 遊戲畫面大小發生變化
     */
    CanvasResize = 'canvas-resize',
    /**
     * 遊戲畫面可見性 - 可見
     */
    GameDisplay = 'game-display',
    /**
     * 遊戲畫面可見性 - 不可見
     */
    GameHidden = 'game-hidden',
    /**
     * Stage destroyed
     */
    StageDestroyed = 'stage-destroyed',
    /**
     * 金流更新
     */
    UpdateWallet = 'update-wallet',
    /**
     * 玩家斷線且無法再恢復(遊戲停止)
     */
    GameReadyToClose = 'game-end',
    /**
     * 使用Slot道具卡
     */
    ItemUse = 'item-use',
    /**
     * 使用魚機道具卡
     */
    CardUse = 'card-use',
    /**
     * 獲得魚機道具卡
     */
    CardAdd = 'card-add',
    /**
     * 準備獲得魚機道具卡
     */
    CardReadyAdd = 'card-ready-add',
    /**
     * 維修廣播
     */
    MaintainBroadcast = 'maintain-broadcast',
    /**
     * 廠商參數載入
     */
    AgentBroadcast = 'agent-broadcast',
    /**
     * 遊玩特色遊戲試玩
     */
    PlayFeatureGame = 'play-feature-game',
    /**
     * 關閉特色loading頁進入遊戲
     */
    CloseLoadingPage = 'close-loading-page',
    /**
     * 跳出儲值提醒
     */
    ShowDepositMsg = 'show-deposit',
    /**
     * 停止檢查儲值金額時間
     */
    StopDepositTween = 'stop-deposit-tween',

    /**
     * 使用Slot道具卡完成
     */
    ItemUsed = 'item-used',

    /**
     * 低配開關變化
     */
    LowDeviceChange = 'low-device-change',

    /**
     * 開啟幫助頁
     */
    ClickSettingHelp = 'click-setting-help',

    /**
     * 點擊設定頁內的離開按鈕
     */
    ClickSettingExit = 'click-setting-exit',

    /**
     * 點擊設定頁內的返回按鈕
     */
    ClickSettingReturn = 'click-setting-return',

    /**
     * 點擊設定頁內的JP清單按鈕
     */
    ClickSettingJPList = 'click-setting-jplist',

    /**
     * 點擊設定頁內的公平驗證按鈕
     */
    ClickSettingFairness = 'click-setting-fairness',

    /**
     * 點擊設定頁內的自動玩按鈕
     */
    ClickSettingAutoPlay = 'click-setting-autoPlay',

    /**
     * 點擊設定頁內的活動按鈕
     */
    ClickSettingEvent = 'click-setting-event',
}

/**
 * iframe全局事件   左邊命名要與指令完全相同
 */
export enum BusIframeEvent {
    /**
     * 停止自動玩
     */
    stopAutoplay = 'Iframe-stopAutoplay',
    /**
     * 開啟歷程頁
     */
    openGameHistory = 'Iframe-openGameHistory',
}

export interface Bus {
    /**
  * 發送事件
  */
    depart(key: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any)

    /**
     * 訂閱事件
     */
    always(key: string, callback: Func, target?: any)

    /**
     * 取消事件訂閱
     */
    cancel(key: string, callback: Func, target?: any)

    /**
     * 只訂閱事件一次
     */
    onTime(key: string, callback: Func, target?: any)

    /**
     * 刪除指定 target 的所有回調
     */
    discard(target: any)

    /**
     * 是否有該事件回調
     */
    has(key: string): boolean
}

let node: Bus
export function UpdateBus() {
    node = Annin.Bus
}
export { node as Bus }