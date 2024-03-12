
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 品牌LOGO圖替換工具
 * 節點品牌依序是  0:Jili  1:India  2:Tada
 */
 
@ccclass('GreedyBrandSwitch')
export class GreedyBrandSwitch extends Component {

    @property([Node])
    switchNds: Node[] = [];

    onLoad(){
        let brand = globalThis.temp_Brand;
        this.switchNds.forEach((node, i) => {
            if(node) node.active = false;
        })
        if(this.switchNds[brand]) this.switchNds[brand].active = true;
        else if(this.switchNds[0]) this.switchNds[0].active = true;
    }
}