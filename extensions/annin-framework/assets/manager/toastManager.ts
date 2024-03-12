
/**
 *  快顯訊息管理員
 * 
 *  toastManager.showText(str)  // 秀3秒短訊
 * 
 */
export interface ToastManager {
    /**
     *  短時間顯示短訊
     *  @param str 要顯示的文字
     */
    showText(str: string)

    /**
     *  立刻消失短訊
     */
    hide()
}

let node: ToastManager
export function UpdateToast() {
    node = Annin.Toast
}
export { node as toastManager }
