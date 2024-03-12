import { _decorator, Component, Node, Vec2 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ButtonMovement')
export class ButtonMovement extends Component {

    @property([Node])
    moveNodes: Node[] = [];

    @property([Vec2])
    offsets: Vec2[] = [];

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.pressed, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.released, this);
        this.node.on(Node.EventType.TOUCH_END, this.released, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.pressed, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.released, this);
        this.node.off(Node.EventType.TOUCH_END, this.released, this);
    }

    pressed() {
        let offsets = this.offsets;
        this.moveNodes.forEach((node, i) => {
            let o = offsets[i];
            let p = node.position;
            node.setPosition(p.x + o.x, p.y + o.y);
        });
    }

    released() {
        let offsets = this.offsets;
        this.moveNodes.forEach((node, i) => {
            let o = offsets[i];
            let p = node.position;
            node.setPosition(p.x - o.x, p.y - o.y);
        });
    }

}
