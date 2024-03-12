import { Component, UITransform, Vec2, _decorator, v2 } from "cc";

const { ccclass, property, executeInEditMode, executionOrder } = _decorator;

@ccclass
export class SwitchLogo extends Component {

    @property({
        tooltip: "對齊錨點"
    })
    anchor: Vec2 = v2(0.5, 0.5);

    start() {
        let logo = Annin.App.getLogoNode();
        logo.getComponent(UITransform).setAnchorPoint(this.anchor);
        logo.parent = this.node;
    }
    
}


