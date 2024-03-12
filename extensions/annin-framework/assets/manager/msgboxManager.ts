/**
 *  訊息窗管理員
 * 
 *  msgOK() 只有確認可以按
 *  msgboxManager.msgOK(i18nManager.getString(9))
 * 
 *  msgYesNo() 有取消和確認可以按
 *  msgboxManager.msgYesNo(context).then(toggle => {
 *      if (toggle === true) {
 *          this.changeStage(betStr)
 *      }
 *  });
 */
export interface MsgboxManager {
    /**
     * 訊息框 (確認按鈕)
     */
    msgOK(str: string): Promise<boolean>

    /**
     * 訊息框 (確認 & 取消按鈕)
     */
    msgYesNo(str: string): Promise<boolean>

    /**
     * 訊息框 (確認按鈕 & 更高的內文空間)
     */
    msgBigOK(str: string): Promise<boolean>

    /**
     * 訊息框 (淨值版本)
     */
    msgNet(str: string): Promise<boolean>
    
    /**
     * 顯示警告圖示
     */
    showWarnIcon()

    /**
     * 顯示錯誤代碼
     */
    showErrorCode(code: number)

    /**
     * 是否正在顯示訊息框
     */
    isDisplaying(): boolean

    /**
     * 關閉訊息框
     */
    close()

    /**
     * 文字內容
     */
    get content(): string
}

let node: MsgboxManager
export function UpdateMsgbox() {
    node = Annin.Msgbox
}
export { node as msgboxManager }
