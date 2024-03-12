import { Sprite, SpriteFrame, Vec3, Node } from "cc";

interface itemCache {
    gameId?: number
    icon?: number
    star?: number
}

/**
 *  背包管理員
 * 
 *  基本上遊戲端只需要串 show() 
 *  遊戲端表演道具卡期間可以選用isMainGameLock旗標來鎖住MainGame
 *  
 *  遊戲端還另外需要用Bus接收道具卡使用成功事件，來接續道具卡的表演流程
 *  Bus.always(Bus.event.ItemUse, this.showEffect, this);
 */

export interface BackpackManager {

    /**
     *  讀取CDN上的道具卡圖  設上spriteNd
     *  @param spriteNd 圖片元件
     *  @param gameID 道具的遊戲ID
     *  @param iconID 道具的圖ID
     *  @param itemID 道具卡ID(魚機使用)
     */
    setItemCardImg(spriteNd: Sprite, gameID: number, iconID: number, itemID?: number)
    /**
     *  使用道具卡ID讀取CDN上的道具卡圖
     *  @param sprite 圖片元件
     *  @param itmeId 道具ID
     */

    setItemCardImgById(sprite: Sprite, itemId: number)

    /**
     *  使用道具卡ID讀取快取的道具卡資料
     *  曾經存在過的道具卡就會有資料  若無回傳null
     *  @param itmeId 道具ID
     */
    getItemCardData(itemId: number): itemCache
    /**
     *  取得預設品牌道具卡圖
     */
    getItemCardDefaultImg(): SpriteFrame

    /**
     *  讀取CDN上的碎片圖  設上spriteNd
     *  @param spriteNd 圖片元件
     *  @param chipID 道具卡ID(魚機使用)
     */
    setChipImg(spriteNd: Sprite, chipID: number)

    /**
     *  開啟背包介面
     */
    show()

    /**
     * 重新跟server要一次資料
     */
    getItemInfo()

    /**
     * 使用道具卡前置動畫
     * @param endPosNd 道具卡圖最終移動到的位置節點
     * @param endScale 道具卡圖最終縮小多少
     * @param endCb 回調
     * @param extraFxNd 額外撥放閃光特效的位置節點
     */
    showUsingItem(endPosNd: Node, endScale: number, endCb: Function, extraFxPosNd?: Node)

    /**
     * 使用道具卡前置動畫消失
     * @param playFx 是否要撥放閃光特效再刪除 
     */
    showUsingItemEnd(playFx: boolean)

    /**
     * 魚機打魚後掉落道具卡前端表演
     * @param posEL 發生的共用特效曾座標 
     */
    checkDropCard(posEL: Vec3, target: Node)

    /**
     * 取得魚機道具卡說明(給其他系統使用)
     */
    getFishCardDescription(cardID: number)

    /**
     * 魚機卡片方法  取得特定類型卡片的數量
     */
    getFishCardCountByType(type: number): number

    /**
     * 魚機卡片方法  取得一張特定類型最接近使用期限的卡片Idx
     */
    getFishCardIdxByType(type: number): number

    /**
     * 取得魚機該代留存泡名稱字串
     */
    getFishRetainName(gameID: number): string 

    /**
     * 使用卡片  使用此方法會缺少卡片使用扣款金流   限用在無扣錢的卡片類型
     */
    useItemCard(idx: number, id: number): boolean

    /**
     * 顯示靜態獲得道具卡視窗
     */
    showGetTipUI(gameID?: number, iconID?: number, itemID?: number)

    /**
     * 顯示動態獲得道具卡表演飛到背包按鈕上
     */
    showGetTipAnim(gameID?: number, iconID?: number, itemID?: number) 

    /**
     * 是否鎖住主要遊戲流程
     */
    get isMainGameLock(): boolean 

    /**
     * 是否鎖住主要遊戲流程
     */
    set isMainGameLock(b: boolean) 

    /**
     * 傳入魚機道具卡json表
     */
    set itemJson(data: object) 

    /**
     * 魚機道具卡json表
     */
    get itemJson(): object

    /**
     * 傳入魚機的背包按鈕位置
     */
    set backpackBtn(node: Node) 
}

let node: BackpackManager
export function UpdateBackpack() {
    node = Annin.Backpack
}
export { node as backpackManager }