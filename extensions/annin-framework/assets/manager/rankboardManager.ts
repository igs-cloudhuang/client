import { Label, Node } from "cc";

/**
 *  排行榜管理員
 * 
 *  除非遊戲要客製排行榜按鈕  否則不需要使用
 */

export interface RankboardManager {

    /**
     * 設定排行榜入口節點  
     * 排行榜系統會控制節點開關和剩餘時間Label
     *  @param iconNode 入口節點
     *  @param iconTime 剩餘時間Label
     */
    setIconNode(iconNode: Node, iconTime: Label)


    /**
     * 顯示排行榜
     */
    showRankboard()
}

let node: RankboardManager
export function UpdateRankboard() {
    node = Annin.Rankboard
}
export { node as rankboardManager };
