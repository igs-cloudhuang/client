import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { find } from 'db://annin-framework/utils';

const { ccclass, property } = _decorator;

@ccclass('JPLook')
export class JPLook extends Component {

    @property(Node)
    rootNode: Node = null;

    @property(SpriteFrame)
    frameBGImg: SpriteFrame = null;

    @property(SpriteFrame)
    titleImg: SpriteFrame = null;

    @property(SpriteFrame)
    coinImg: SpriteFrame = null;

    @property
    coinNum: number = 3;

    onLoad() {
        const actor = find(this.rootNode, 'Actor');
        find(actor, 'BG', Sprite).spriteFrame = this.frameBGImg;
        find(actor, 'Dark/BG', Sprite).spriteFrame = this.frameBGImg;
        find(actor, 'TEXT1', Sprite).spriteFrame = this.titleImg;
        find(actor, 'Dark/TEXT1', Sprite).spriteFrame = this.titleImg;
        find(actor, 'Light/TEXT1', Sprite).spriteFrame = this.titleImg;

        // 限制豬幣數量
        let coinRoot = find(actor, 'PigCoin');
        while (coinRoot.children.length > this.coinNum) {
            let last = coinRoot.children[coinRoot.children.length - 1];
            last.removeFromParent();
            last.destroy();
        }

        // 更換豬幣圖
        coinRoot.children.forEach(node => {
            find(node, 'COIN', Sprite).spriteFrame = this.coinImg;
        });
    }

}
