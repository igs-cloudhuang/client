import { Sprite } from "cc"

/**
 *  VIP管理員
 * 
 *  如果遊戲端有顯示玩家的VIP等級圖示
 *  可以使用setVipSprUpdate()來註冊刷新VIP等級的圖片，刪除時clearVipSprUpdate()
 */
export interface VipwebManager {
    /**
     *  註冊刷新VIP等級圖片
     *  @param spr 要刷新的圖片元件
     */
    setVipSprUpdate(spr: Sprite)

    /**
     *  註銷刷新VIP等級圖片
     *  @param spr 有註冊刷新的圖片元件
     */
    clearVipSprUpdate(spr: Sprite)

    /**
     *  開啟VIP網頁
     */
    openVipWeb()
}

let node: VipwebManager
export function UpdateVipWeb() {
    node = Annin.VipWeb
}
export { node as vipwebManager }
