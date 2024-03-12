import { Node, Sprite } from "cc"
import { SwitchOffKeyDefine } from "../license/LicenseSetting"

/**
 *  遊戲系統管理員
 * 
 *  一些必用的重要功能
 * 
 * 
    1.setCommand(function);
    遊戲端可以用這方法把共用建立的連線事件往下傳遞，寫法參考如下
    onLoad() {
        appManager.setCommand(this.onCommand.bind(this));   // 元件創建時註冊事件傳遞
    }
    onDestroy() {
        appManager.setCommand(null);   // 元件刪除時取消事件傳遞
    } 
    private onCommand(type: prot.protocol.ServerToUser, data: Uint8Array) {
        const prot_S2U = prot.protocol.ServerToUser;
        switch (type) {
            // 珠子落地
            case prot_S2U.S2U_CHANGE_ACK: {
                let ack = prot.protocol.ChangeAck.decode(data);
                this.gameDataInit();
                break;
            }
        }
    }

    2. send(reqEnum, data)
    遊戲端可以用這方法發送指令給server，寫法參考如下
    let req = new prot.protocol.ChangeReq({ bet: Game.bet.getUserBet() });
    let data = prot.protocol.ChangeReq.encode(req).finish();
    appManager.send(prot.protocol.UserToServer.U2S_CHANGE_REQ, data);

    3. logout();  登出
    
    4. shutdownByMsgBox(string);  跳一個只有確認的說明視窗(字串帶入)，點擊後關閉遊戲
    
    5. createStage(); 重新創建遊戲場景

    6. closeLogoPage()
    若沒呼叫這行，html層的loading頁預設是不會關閉的，必須在遊戲確定讀取完成後呼叫
 */


export interface Banner {
    /**
     *  顯示的圖
     */
    image: string

    /**
     *  顯示的圖(預設)
     */
    image_default: string

    /**
     *  開始時間
     */
    start: Date

    /**
     *  結束時間
     */
    end: Date
}

export interface AppManager {

    /**
     * 遊戲讀取完畢狀態，可讓玩家關閉讀取頁進入遊戲
     * @deprecated readyToCloseLoading
     */
    closeLogoPage() 

    /**
     * 遊戲讀取完畢狀態，可讓玩家關閉讀取頁進入遊戲
     */
    readyToCloseLoading() 

    /**
     * 創建或刪除重建主場
     */
    createStage() 

    /**
     * 跳轉遊戲請求
     *  @param id 欲跳轉的遊戲編號
     */
    transferRequest(id: number) 

    /**
     * 顯示 MsgBox 後關閉應用
     *  @param strOrIdx: string | number 顯示訊息文字或共用字串編號
     */
    shutdownByMsgBox(strOrIdx: string | number, canCancel?: boolean) 

    /**
     * 返回大廳
     */
    backToLobby() 

    /**
     * 設定WebSocket串接的方法
     *  @param f 回調方法
     */
    setCommand(f: (type: number, data: Uint8Array) => void) 

    /**
     * 傳送請求給 server
     *  @param type 發送要求編號
     *  @param data 附加資料
     */
    send(type: number, data: Uint8Array) 

    /**
     * 通知 server 登出
     */
    logout() 

    /**
     * 斷線
     */
    disconnect()

    // 集合一些零散的API

    /**
     * 取得網路延遲豪秒數
     */
    get latency(): number 

    /**
     * 取得遊戲ID
     */
    get gameID(): number 

    /**
     * 取得玩家名稱
     */
    get playerName(): string 

    /**
     * 取得玩家UID
     */
    get playerUID(): number 

    /**
     * 取得APIID
     */
    get apiID(): number 

    /**
     * 取得token
     */
    get token(): string

    /**
     * 取得siteID
     */
    get siteID(): number

    /**
     *  取得下注金額清單
     */
    get betList(): number[] 

    /**
     *  檢查是否是Tada品牌
     */
    get isTaDaVersion(): boolean 

    /**
     *  檢查是否顯示返回大廳按鈕
     */
    get isHomeButtonOpen(): boolean

    /**
     *  是否開啟連線彩金
     */
    get isJackpotLink(): boolean 

    /**
     *  留存log
     */
    get login_Event()

    /**
     *  操作log
     */
    get button_Log()

    /**
     *  檢查是否顯示返回大廳按鈕
     */
    get hasDebrisActivity(): boolean 

    /**
     *  檢查是否顯示返回大廳按鈕
     */
    get hasPromotionData(): boolean 

    /**
     *  是否是GLI版本
     */
    get isGLI(): boolean 

    /**
     *  是否是GA版本
     */
    get isGA(): boolean 

    /**
     *  是否是送審版本
     */
    get isLicense(): boolean 

    /**
     * 取得棋牌推薦位置
     */
    get pokerRecommand(): string

    get Host(): string

    /**
     *  發送留存log
     */
    sendEvent(e: number, es?: number) 

    /**
     *  發送操作log
     */
    sendButton(e: number, es?: string, ei?: number)

    /**
     *  檢查功能開關
     *  需要非常注意開關的正反意義  有些定義是相反的
     *  例如: CloseBackpack 關閉背包 若checkSwitchOn()回傳true代表背包功能有開啟
     *  例如: ShowPlateformVer 顯示平台版本號 若checkSwitchOn()回傳true代表不顯示
     *  若有疑慮請詢問開發人員
     */
    checkSwitchOn(code: SwitchOffKeyDefine): boolean

    /**
     *  是否啟用報表
     * @deprecated 改用checkSwitchOn(SwitchOffKeyDefine)
     */
    checkReportOpen(): boolean

    /**
     *  是否啟用背包
     * @deprecated 改用checkSwitchOn(SwitchOffKeyDefine)
     */
    checkBackpackOpen(): boolean

    /**
     *  是否啟用自動玩
     * @deprecated 改用checkSwitchOn(SwitchOffKeyDefine)
     */
    checkAutoPlayOpen(): boolean 

    /**
     *  是否啟用快停
     * @deprecated 改用checkSwitchOn(SwitchOffKeyDefine)
     */
    checkSpeedUpOpen(): boolean 

    /**
     *  是否啟用假贏表演
     * @deprecated 改用checkSwitchOn(SwitchOffKeyDefine)
     */
    checkFakeWinOpen(): boolean 
    
    /**
     * 取得網址
     */
    getUrl(): string

    /**
     *  取得當前使用語系
     */
    getLang(): string

    /*
     *  取得官網位置
     */ 
    getOfficialUrl(): string

    /*
     *  取得報表位置
     */ 
    getWeb(): string

    /*
     *  取得說明位置
     */
    getIntrolUrl(extraKey?: string): string

    /*
     *  取得 VIP 網頁位置
     */
    getVipWebUrl(): string 

    /*
    *  取得贏更多活動網頁位置
    */    
    getWinMoreEventWebUrl(): string

    /**
     * 取得大廳 GameID (from LobbyData)
     */
    getLobbyID(): number

    /**
     * 是否隱藏會員
     */
    getLobbyHM(): boolean

    /**
     * 把BetList計算多幣別
     */
    getCoinTypeBet(betlist: number[]): number[]

    /**
     * Banner資料
     */
    getBanner(): Banner[]

    /**
     *  取得 RTP 字串
     */
    getRTPString(): string

    /**
     *  取得執照類型
     */
    getLicense(): number

    /**
     * 是否禁止小數點第三位(禁用4.14代龍蛋、6代加乘效果)
     */
    isDisableDecimal3(): boolean

    /**
     * 取得品牌
     */
    getBrandType(): BrandType 

    /**
     * 取得品牌節點
     */
    getLogoNode(): Node

    /**
     *  取得預設下注等級
     */
    getBetLevel(): number 

    /**
     * 載入CDN的玩家頭像  想不到要放哪先放這
     * @param sprite 圖片元件
     * @param idx 頭像編號
     */
    setPlayerIconImg(sprite: Sprite, idx: number, packable?: boolean)

    /**
     * 顯示YT影片   url只帶後綴
     * 例如: https://www.youtube.com/embed/NuWr25nxoWI  只需要傳入"NuWr25nxoWI"
     */
    showYouTube(url: string): void 

    /**
     * TaDa 回報資料
     */
    appLobbyReportData(data: { coin?: number, exp?: number, canIAP?: boolean, bet?: number })

    /**
     * TaDa 主系統表演
     */
    appLobbyPerformance(): Promise<void>

    /**
     * Tada App
     */
    hasAppLobby(): boolean

    /**
     * 轉換共用的按鈕層級  可以轉換到遊戲層的節點裡
     * 如果帶null就是恢復預設
     * 注意：如果stage需要銷毀，遊戲一定得將此恢復預設，否則一定壞去
     */
    setButtonLayerParent(parentNd?: Node)

    /**
     * 開啟低配偵測
     */
    initLowDeviceMode(): void

    /**
     * 重置閒置時間
     */
    resetIdleTimer(): void

    /**
     * 設定閒置斷線時間
     */
    setIdleTime(sec: number): void

}

export enum BrandType {
    JILI,
    TADA,
    INDIA,
    JILISTAR,
    TADA_CASINO,
    NONE,
    UFA,
}

let node: AppManager
export function UpdateApp() {
    node = Annin.App
}
export { node as appManager }