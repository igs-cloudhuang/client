import { Component, Layout, Node, rect, Rect, Tween, tween, UIOpacity, UITransform, v2, _decorator, v3, size } from 'cc';

const tmp_rect = rect();

const { ccclass, property } = _decorator;

@ccclass('ListCulling')
export class ListCulling extends Component {

    @property(Node)
    content: Node = null;

    @property
    affected_by_item_scale: boolean = false;

    private viewBox = null as Rect;
    private cullingTween = null as Tween<Node>;
    private lastPosition = v2(-9999, -9999);
    private itemCount: number = 0;

    onDestroy() {
        if (this.cullingTween) {
            this.cullingTween.stop();
            this.cullingTween = null;
        }
    }

    start() {
        this.startCulling();
    }

    private startCulling() {
        if (this.cullingTween) {
            this.cullingTween.stop();
            this.cullingTween = null;
        }
        this.cullingTween = tween(this.node)
            .delay(0.02)
            .call(() => {
                if (this.content && this.content.activeInHierarchy === true) {
                    let dx = this.content.position.x - this.lastPosition.x;
                    let dy = this.content.position.y - this.lastPosition.y;
                    if (dx * dx + dy * dy > 1) {
                        this.viewBox = this.content.parent.getComponent(UITransform).getBoundingBox();
                        this.checkItemVisibility();
                        this.updateLastPosition();
                    }
                    this.updateContentSize();
                }
            })
            .union()
            .repeatForever()
            .start();
    }

    private checkItemVisibility() {
        let content = this.content;
        let viewBox = this.viewBox;
        let ox = viewBox.x;
        let oy = viewBox.y;

        viewBox.x -= (content.parent.position.x + content.position.x);  // 轉換到 content 下的座標系
        viewBox.y -= (content.parent.position.y + content.position.y);  // 轉換到 content 下的座標系

        const items = content.children;
        const contentScale = content.getScale();

        // 可見性檢查
        for (let i = 0, l = items.length; i < l; ++i) {
            let item = items[i];
            let itemUI = item.getComponent(UITransform);
            let itemOpa = item.getComponent(UIOpacity);
            let itemPos = item.position;

            tmp_rect.x = (itemPos.x - (itemUI.anchorPoint.x * itemUI.width)) * contentScale.x;
            tmp_rect.y = (itemPos.y - (itemUI.anchorPoint.y * itemUI.height)) * contentScale.y;
            tmp_rect.width = itemUI.width * contentScale.x;
            tmp_rect.height = itemUI.height * contentScale.y;

            let visible = viewBox.intersects(tmp_rect);
            itemOpa.opacity = visible ? 255 : 0;
        }

        viewBox.x = ox;  // 還原可見範圍的座標
        viewBox.y = oy;  // 還原可見範圍的座標
    }

    private updateLastPosition() {
        let contentPosition = this.content.position;
        this.lastPosition.x = contentPosition.x;
        this.lastPosition.y = contentPosition.y;
    }

    private updateContentSize() {
        let itemCount = this.content.children.length;
        if (this.itemCount === itemCount)
            return;

        let ltype = Layout.Type;
        let lAxisDir = Layout.AxisDirection;
        let layout = this.content.getComponent(Layout);
        let isHorizontal = layout.type === ltype.HORIZONTAL || (layout.type === ltype.GRID && layout.startAxis === lAxisDir.VERTICAL);
        if (layout.type === ltype.NONE)
            return;

        if (layout.resizeMode !== Layout.ResizeMode.NONE)
            layout.resizeMode = Layout.ResizeMode.NONE;    // 強制layout = none

        let contentUI = this.content.getComponent(UITransform);
        let contentScale = this.content.getScale();

        this.itemCount = itemCount;
        if (this.itemCount === 0) {
            // 沒有子節點, 直接設 0
            if (isHorizontal) contentUI.setContentSize(0, contentUI.height);
            else contentUI.setContentSize(contentUI.width, 0);
            return;
        }

        let len = 0, div = 1;
        let itemSize = this.content.children[0].getComponent(UITransform).contentSize;
        const itemScale = this.affected_by_item_scale ? this.content.children[0].getScale() : v3(1, 1, 1);
        itemSize = size(itemSize.width * itemScale.x, itemSize.height * itemScale.y)
        // 檢查一排有幾個
        if (itemCount > 0) {
            if (isHorizontal)
                div = Math.max(1, Math.ceil((contentUI.height - layout.paddingBottom - layout.paddingTop - itemSize.height) / (itemSize.height + layout.spacingY)));
            else
                div = Math.max(1, Math.ceil((contentUI.width - layout.paddingLeft - layout.paddingRight - itemSize.width) / (itemSize.width + layout.spacingX)));
        }
        // 開始計算
        if (isHorizontal) {
            len += layout.paddingLeft + layout.paddingRight;
            len += itemSize.width * Math.ceil(itemCount / div);
            len += layout.spacingX * (Math.ceil(itemCount / div) - 1);
            contentUI.setContentSize(len * contentScale.x, contentUI.height);
        }
        else {
            len += layout.paddingBottom + layout.paddingTop;
            len += itemSize.height * Math.ceil(itemCount / div);
            len += layout.spacingY * (Math.ceil(itemCount / div) - 1);
            contentUI.setContentSize(contentUI.width, len * contentScale.y);
        }
    }

}
