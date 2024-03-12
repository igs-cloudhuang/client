import { Component, Label, Node, UITransform, _decorator, clamp, v3 } from 'cc';
import { DEBUG, EDITOR } from 'cc/env';
import { cancelLateUpdate } from '../utils';

const { ccclass, property, disallowMultiple, executeInEditMode } = _decorator;

/**
 * 當遇到使用 Label 自帶的 Shrink 也對不準長度的情況
 * 可以試試看這個元件
 */
@ccclass('LabelShrink')
@disallowMultiple
@executeInEditMode
export class LabelShrink extends Component {

    @property
    textLength = 40;

    @property({
        tooltip: '勾選後可以預覽縮放但預覽完建議關閉, 否則會誤存錯誤的 Scale',
    })
    preview = false;

    private myScale = null;
    private myUITrans = null as UITransform;

    onLoad() {
        this.myScale = v3(this.node.scale);
        this.myUITrans = this.node.getComponent(UITransform);

        if (DEBUG && (this.myScale.x === 0 || this.myScale.y === 0)) {
            console.warn(`[Warn] Label scale should be greater than zero.`);
        }

        // 要隔一幀才能正確關閉 lateUpdate
        if (!EDITOR) {
            this.scheduleOnce(() => cancelLateUpdate(this));
        }
    }

    onEnable() {
        // 防呆檢查 (如果是 Label, RichText 沒有 Overflow 設定)
        let lab = this.node.getComponent(Label);
        if (lab && lab.overflow !== Label.Overflow.NONE) {
            console.warn(`[Warn] Label overflow should be 'None' type.`);
        }

        this.node.on(Node.EventType.SIZE_CHANGED, this.updateTextLength, this);
        this.updateTextLength();
    }

    lateUpdate(dt: number) {
        if (EDITOR && this.preview) {
            this.updateTextLength();
        }
    }

    onDisable() {
        this.node.off(Node.EventType.SIZE_CHANGED, this.updateTextLength, this);
    }

    updateTextLength() {
        if (EDITOR && !this.preview) return;
        let uiTrans = this.myUITrans;
        if (uiTrans.width <= 0)
            return;

        let ts = clamp(this.textLength / uiTrans.width, 0.01, 1);
        this.node.setScale(
            this.myScale.x * ts,
            this.myScale.y * ts,
            this.myScale.z
        );
    }

}
