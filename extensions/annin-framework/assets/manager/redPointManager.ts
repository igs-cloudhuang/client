import { Node } from "cc"

export enum RedPointTag {
    None,
    // 贏更多體系
    WinMore,
    Promotion,
    Vip,
    Event,
    // 贏更多魚機客製體系
    FishLevelReward,
    FishWeekReward,
    FishChestReward,
    FishTools,
    // 碎片收集體系
    Collect,
    CollectItemS,
    CollectItemA,
    CollectItemB,
    CollectItemC,
    // 背包體系
    Backpack,
    BackpackMyCard,
    BackpackOtherCard,
    //工具箱體系
    ToolBox,
}


interface RedPointNode {
    node: Node[]
    active: boolean 
    parent: RedPointTag 
    child: RedPointTag[]
}

export interface RedPointMgr {

    clear() 

    get(tag: RedPointTag): RedPointNode 

    registerNode(tag: RedPointTag, parentTag?: RedPointTag, node?: Node) 

    /**
     * 發送事件
     */
    setRedPoint(tag: RedPointTag, active: boolean) 
}


let node: RedPointMgr
export function UpdateRedPoint() {
    node = Annin.RedPoint
}
export { node as redPointManager }

