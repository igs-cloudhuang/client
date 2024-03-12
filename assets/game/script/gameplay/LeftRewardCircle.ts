import { _decorator, Component, SpriteAtlas, Sprite, Label, Node, SpriteFrame } from 'cc';
import { playAnime } from 'db://annin-framework/utils';
import { walletManager } from 'db://annin-framework/manager';
import { delay } from '../system/ToolBox';

const rewardSprName = [
/* kind:  1~ */ 'D_01', 'D_02', 'D_03', 'D_04', 'D_05', 'D_06', 'D_07', 'D_08', 'D_09', 'D_10', 'D_11', 'D_12', '', '', 'D_21', '', '',
/* kind: 18~ */ 'D_101', 'D_102', 'D_103', 'D_104',
];

const { ccclass, property } = _decorator;

@ccclass('LeftRewardCircle')
export default class LeftRewardCircle extends Component {

    @property({ type: SpriteAtlas })
    imageList: SpriteAtlas = null;

    @property(Sprite)
    icon: Sprite = null;

    @property(Label)
    coin: Label = null;

    @property(Node)
    bucket: Node = null;

    init(kind: number, coin: number, bBucketCoin: boolean, endCB: Function) {
        if (this.coin) { this.coin.string = walletManager.FormatCoinNum(coin); }
        this.bucket.active = bBucketCoin;
        this.setSprFrame(kind - 1);

        this.play(endCB);
    }

    setSprFrame(idx: number) {
        idx = idx < 0 ? 0 : idx;
        let sprName = rewardSprName;
        let img: SpriteFrame = this.imageList ? this.imageList.getSpriteFrame(sprName[idx]) : null;

        if (this.icon && img) { this.icon.spriteFrame = img; }
    }

    play(endCB: Function) {
        let st = playAnime(this.node, 'Score_in');
        delay(this.node, st.duration / st.speed + 2, () => {
            let st2 = playAnime(this.node, 'Score_out');
            delay(this.node, st2.duration / st2.speed, () => {
                if (endCB) endCB();
            });
        });
    }

    showKeep(kind: number, coin: number, endCB: Function = null) {
        if (this.coin) { this.coin.string = walletManager.FormatCoinNum(coin); }
        this.setSprFrame(kind - 1);
        this.bucket.active = false;

        let st = playAnime(this.node, 'Score_in');
        delay(this.node, st.duration / st.speed + 2, () => {
            if (endCB) endCB();
        });
    }

    closeKeep() {
        let st = playAnime(this.node, 'Score_out');
        delay(this.node, st.duration / st.speed, () => {
            this.node.destroy();
        });
    }

}
