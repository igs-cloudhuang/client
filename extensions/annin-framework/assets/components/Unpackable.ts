import { _decorator, Component, Sprite, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Unpackable')
export class Unpackable extends Component {

    start() {
        let spr = this.node.getComponent(Sprite);
        if(spr && spr.spriteFrame) spr.spriteFrame.packable = false;
    }

}
