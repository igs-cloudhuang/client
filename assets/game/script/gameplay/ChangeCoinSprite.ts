import { _decorator, Component, SpriteFrame, Node, Label } from 'cc';
import { walletManager } from 'db://annin-framework/manager';

const { ccclass, property } = _decorator;

@ccclass('ChangeCoinSprite')
export default class ChangeCoinSprite extends Component {

    @property(SpriteFrame)
    list: SpriteFrame[] = [];

    @property(Node)
    coin: Node = null;

    @property(Node)
    coinS: Node = null;

    @property(Node)
    coinType: Node = null;

    start() {

    }

    show() {
        let str = walletManager.coinTypeStr
        if (walletManager.currency == 43) {
            this.coin.active = false;
            this.coinS.active = true;
            this.coinType.active = false;
        } else if (str && str.length > 0) {
            this.coin.active = false;
            this.coinS.active = false;
            this.coinType.active = true;
            this.coinType.getComponent(Label).string = str;
        } else {
            this.coin.active = true;
            this.coinS.active = false;
            this.coinType.active = false;
        }
    }
}
