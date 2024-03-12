import { color, Component, Label, sp, Sprite, UIOpacity, _decorator } from "cc";

const {ccclass, property, menu} = _decorator;

enum ComponentType {
    None,
    Sprite,
    Label,
    UIOpacity,
}

@ccclass
export default class SkeletonColorFollow extends Component {

    @property(sp.Skeleton)
    Skeleton: sp.Skeleton = null;

    @property
    boneName: string = "";

    private type: ComponentType = ComponentType.None;

    onLoad(){
        if(this.node.getComponent(Sprite)){
            this.type = ComponentType.Sprite;
        }
        else if(this.node.getComponent(Label)){
            this.type = ComponentType.Label;
        }
        else if(this.node.getComponent(UIOpacity)){
            this.type = ComponentType.UIOpacity;
        }
    }

    update() {
        if (!this.Skeleton || !this.type) return;
        let slot = this.Skeleton.findSlot(this.boneName);
        if (!slot) return;

        switch(this.type){
            case ComponentType.Sprite: {
                let preColor = this.node.getComponent(Sprite).color;
                let slotColor = color(slot.color.r * 255, slot.color.g * 255, slot.color.b * 255, slot.color.a * 255);
                if (slotColor.r != preColor.r || 
                    slotColor.g != preColor.g || 
                    slotColor.b != preColor.b || 
                    slotColor.a != preColor.a ) {
                    this.node.getComponent(Sprite).color = color(slotColor.r, slotColor.g, slotColor.b, slotColor.a);
                }
                break;
            }
            case ComponentType.Label: {
                let preColor = this.node.getComponent(Label).color;
                let slotColor = color(slot.color.r * 255, slot.color.g * 255, slot.color.b * 255, slot.color.a * 255);
                if (slotColor.r != preColor.r || 
                    slotColor.g != preColor.g || 
                    slotColor.b != preColor.b || 
                    slotColor.a != preColor.a ) {
                    this.node.getComponent(Label).color = color(slotColor.r, slotColor.g, slotColor.b, slotColor.a);
                }
                break;
            }
            case ComponentType.UIOpacity: {
                let preOpacity = this.node.getComponent(UIOpacity).opacity;
                let slotOpacity = slot.color.a * 255;
                if (slotOpacity != preOpacity) {
                    this.node.getComponent(UIOpacity).opacity = slotOpacity;
                }
                break;
            }
        }
    }
}
