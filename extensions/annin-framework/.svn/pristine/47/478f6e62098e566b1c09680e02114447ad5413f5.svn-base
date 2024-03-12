import { Component, EventTouch, Node, UITransform, v2, v3, Vec2, _decorator, UIOpacity, view } from "cc";
import { transUIPos } from "../utils";
import { WidgetData, WidgetInfo } from "../manager";

const { ccclass, property } = _decorator;

@ccclass("TouchMove")
export default class TouchMove extends Component {

    @property({
        type: Node,
        tooltip: "要移動的節點"
    })
    bodyNode: Node = null;

    @property({
        type: Node,
        tooltip: "接收事件的節點"
    })
    eaterNode: Node = null;

    @property({
        type: UITransform,
        tooltip: "範圍節點"
    })
    rectNode: UITransform = null;

    @property({
        type: [UITransform],
        tooltip: "縮放需要調整size的元件"
    })
    scaleContentSize: UITransform[] = [];

    @property({
        type: [Node],
        tooltip: "縮放需要調整scale的元件"
    })
    scaleNode: Node[] = [];

    private isSetup: boolean = false;
    private myWidgeInfo: WidgetInfo = null;

    private startTime: number = 0;
    private localPos: Vec2 = v2(0, 0);
    private touchPos: Vec2 = v2(0, 0);
    private localScale: number = 1;

    onLoad() {
        view.on('canvas-resize', this.onResize, this);
        this.localPos = v2(this.bodyNode.position.x, this.bodyNode.position.y);
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, (e: EventTouch) => {  // 點擊事件
            this.bodyNode.setSiblingIndex(99);
            this.startTime = Date.now();
            this.touchPos = v2(e.getUILocation().x, e.getUILocation().y);
            this.localPos = v2(this.bodyNode.position.x, this.bodyNode.position.y);
        });

        this.node.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {  // 按壓事件
            let touch = v2(e.getUILocation().x, e.getUILocation().y);
            let diff = v2(touch.x, touch.y).subtract(this.touchPos);

            this.localPos.add(diff);
            this.updatePosition();
            this.touchPos = touch;
        });
        this.node.on(Node.EventType.TOUCH_END, (e: EventTouch) => {  // 鬆開事件
            if (this.eaterNode.active === true) {
                let duration = (Date.now() - this.startTime) / 1000;
                if (duration < 0.24) {
                    this.eaterNode.emit(Node.EventType.TOUCH_END, e);
                }
            }

            this.bodyNode.setSiblingIndex(1);
            this.touchPos = v2(0, 0);
        });
        this.node.on(Node.EventType.TOUCH_CANCEL, (e: EventTouch) => {  // 鬆開事件
            this.touchPos = v2(0, 0);
        });
    }

    onDestroy() {
        view.off('canvas-resize', this.onResize, this);
    }


    private updatePosition() {
        let bl = transUIPos(this.bodyNode.parent, this.rectNode);
        let left = bl.x - this.rectNode.width * (this.rectNode.anchorPoint.x), right = bl.x + this.rectNode.width * (1 - this.rectNode.anchorPoint.x);
        let bottom = bl.y - this.rectNode.height * (this.rectNode.anchorPoint.y), top = bl.y + this.rectNode.height * (1 - this.rectNode.anchorPoint.y);

        let pos = this.localPos;
        let uiTrans = this.bodyNode.getComponent(UITransform);
        let btnHW = uiTrans.width;
        let btnHH = uiTrans.height;
        let btnAX = uiTrans.anchorPoint.x;
        let btnAY = uiTrans.anchorPoint.y;

        if (pos.x - btnHW * btnAX < left) pos.x = left + btnHW * btnAX;
        if (pos.x + btnHW * (1 - btnAX) > right) pos.x = right - btnHW * (1 - btnAX);
        if (pos.y - btnHH * btnAY < bottom) pos.y = bottom + btnHH * btnAY;
        if (pos.y + btnHH * (1 - btnAY) > top) pos.y = top - btnHH * (1 - btnAY);

        this.bodyNode.setPosition(pos.x, pos.y);
    }


    /**
     * 設定按鈕的大小和widget位置
     */
    setTouchMove(widgetInfo: WidgetInfo){
        this.setWidgetInfo(widgetInfo);
    }

    // 設定直橫版的按鈕適配資訊
    setWidgetInfo(widgetInfo: WidgetInfo) {
        this.myWidgeInfo = widgetInfo;
        // 重跑一次widget
        this.onResize();
    }

    private onResize() {
        if (this.myWidgeInfo) {
            // scale 重設
            let scale = 1;
            let isLandscape = Annin.Comm.state.isLandscape
            if (this.myWidgeInfo.landscape?.scale && isLandscape) scale = this.myWidgeInfo.landscape.scale;
            else if (this.myWidgeInfo.portrait?.scale && !isLandscape) scale = this.myWidgeInfo.portrait.scale;
            this.setScale(scale);

            // widgetData 只有初次直/橫版需要重設
            let widgetData: WidgetData = null;
            if (isLandscape) {
                widgetData = this.myWidgeInfo.landscape;
                if(this.bodyNode.getComponent(UIOpacity)) this.bodyNode.getComponent(UIOpacity).opacity = widgetData.hidden? 0 : 255
                if (widgetData) {
                    this.setWidget(widgetData);
                }
                this.localPos = v2(this.bodyNode.position.x, this.bodyNode.position.y);
            }
            else if (!isLandscape) {
                widgetData = this.myWidgeInfo.portrait;
                if(this.bodyNode.getComponent(UIOpacity)) this.bodyNode.getComponent(UIOpacity).opacity = widgetData.hidden? 0 : 255
                if (widgetData) {
                    this.setWidget(widgetData);
                }
                this.localPos = v2(this.bodyNode.position.x, this.bodyNode.position.y);
            }
        }
        this.updatePosition();
    }

    // 移動按鈕相關需要配合調整Scale的元件  同步放大縮小
    private setScale(scale: number) {
        // 先復原ContentSize
        this.scaleContentSize.forEach(content => {
            let size = content.contentSize.clone();
            content.setContentSize(size.width / this.localScale, size.height / this.localScale);
        })
        this.localScale = scale;
        // 再把ContentSize乘上去
        this.scaleContentSize.forEach(content => {
            let size = content.contentSize.clone();
            content.setContentSize(size.width * this.localScale, size.height * this.localScale);
        })

        // 單純調整scale的元件
        this.scaleNode.forEach(node => {
            node.setScale(this.localScale, this.localScale, this.localScale);
        })
    }

    // 調整預設位置的Widget
    private setWidget(widgetData: WidgetData) {
        // 手算座標
        let a = this.bodyNode;
        let b = this.rectNode.node;
        let at = a.getComponent(UITransform);
        let bt = this.rectNode;
        if (widgetData.isAbsoluteTop) {
            let y = transUIPos(a.parent, b, v3(0, bt.contentSize.height * (1 - bt.anchorPoint.y) - at.height * (1 - at.anchorPoint.y))).y;
            a.setPosition(a.position.x, y - widgetData.diffTop);
        }
        if (widgetData.isAbsoluteBottom) {
            let y = transUIPos(a.parent, b, v3(0, -(bt.contentSize.height * (bt.anchorPoint.y) - at.height * (at.anchorPoint.y)))).y;
            a.setPosition(a.position.x, y + widgetData.diffBottom);
        }
        if(!widgetData.isAbsoluteTop && !widgetData.isAbsoluteBottom){
            a.setWorldPosition(v3(a.worldPosition.x, widgetData.worldPosY));
        }
        if (widgetData.isAbsoluteRight) {
            let x = transUIPos(a.parent, b, v3(bt.contentSize.width * (1 - bt.anchorPoint.x) - at.width * (1 - at.anchorPoint.x), 0)).x;
            a.setPosition(x - widgetData.diffRight, a.position.y);
        }
        if (widgetData.isAbsoluteLeft) {
            let x = transUIPos(a.parent, b, v3(-(bt.contentSize.width * (bt.anchorPoint.x) - at.width * (at.anchorPoint.x)), 0)).x;
            a.setPosition(x + widgetData.diffLeft, a.position.y);
        }
        if(!widgetData.isAbsoluteRight && !widgetData.isAbsoluteLeft){
            a.setWorldPosition(v3(widgetData.worldPosX, a.worldPosition.y));
        }

    }
}

