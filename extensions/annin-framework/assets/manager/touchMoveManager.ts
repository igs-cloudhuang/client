
/**
 *  可移動按鈕管理員
 * 
 *  有贏更多、背包、排行榜、每日任務四顆可移動按鈕
 *  遊戲端可設置直橫版個別的Widget資訊，來設定遊戲希望個按鈕的初始位置
 *  
 */
export interface TouchMoveManager {
    onLoad(type: TouchMoveType, btn: ITouchMove)

    onDestroy(type: TouchMoveType)

    /**
     *  設定可移動按鈕的適配資訊
     *  @param type 按鈕種類
     *  @param widgetInfo 適配資訊
     */
    setTouchMove(type: TouchMoveType, widgetInfo: WidgetInfo)
}

interface ITouchMove {
    setTouchMove(widgetInfo: WidgetInfo): void
}

export interface WidgetData {
    isAbsoluteTop?: boolean
    diffTop?: number
    isAbsoluteBottom?: boolean
    diffBottom?: number
    isAbsoluteLeft?: boolean
    diffLeft?: number
    isAbsoluteRight?: boolean
    diffRight?: number
    isAbsoluteHorizontalCenter?: boolean
    diffHorizontalCenter?: number
    isAbsoluteVerticalCenter?: boolean
    diffVerticalCenter?: number
    worldPosX?: number
    worldPosY?: number
    scale?: number
    hidden?: boolean
}

export interface WidgetInfo {
    landscape?: WidgetData
    portrait?: WidgetData
}

export enum TouchMoveType {
    WinMore,
    Backpack,
    RankBoard,
    DailyMission,
    BackToLobby,
    Collect,
    ToolBox,
    Deposit,
}

let node: TouchMoveManager
export function UpdateTouchMove() {
    node = Annin.TouchMove
}
export { node as touchMoveManager }
