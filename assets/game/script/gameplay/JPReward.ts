import { _decorator, Component, Label, Node } from 'cc';
import { walletManager } from 'db://annin-framework/manager';
import { easeOut, find, playSpine } from 'db://annin-framework/utils';
import { lerpTween } from '../system/ToolBox';
import LeftRewardCircle from './LeftRewardCircle';
import { FishMedal, SceneEvent } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('JPReward')
export class JPReward extends Component {

    @property({
        type: Node,
        tooltip: 'Spine 節點',
    })
    spineNode: Node = null;

    @property({
        type: Label,
        tooltip: '得獎金額',
    })
    coinNumText: Label = null;

    /**
     * 播放 JP 中獎表演 (結束時要主動銷毀節點)
     */
    playJPReward(type: 0 | 1 | 2 | 3, bet: number, coin: number, endFunc: Function) {
        let dur = ([15, 10, 8, 3])[type];
        let coinNumText = this.coinNumText;
        let updateCoinNum = (num: number) => {
            coinNumText.string = walletManager.FormatCoinNum(num, true);
        };
        let numTweenEnd = () => {
            coinNumText.string = walletManager.FormatCoinNum(coin, true);
            this.node.emit('coin-roll-num-end');
        };
        let numTween = lerpTween(coinNumText.node, dur, 0, coin, updateCoinNum, easeOut(2))
            .call(() => {
                this.spineNode.off(Node.EventType.TOUCH_START);
                numTweenEnd();
            })
            .start();

        // 播放得獎動畫
        let clipName = (['Grand', 'Major', 'Minor', 'Mini'])[type];
        playSpine(this.spineNode, `${clipName}_Start`, false, () => {
            numTween.stop();
            numTweenEnd();
        });

        // 點擊直接跳到最後金額
        this.spineNode.once(Node.EventType.TOUCH_START, () => {
            numTween.stop();
            numTweenEnd();
        });

        this.node.once('coin-roll-num-end', () => {
            playSpine(this.spineNode, `${clipName}_End`, false, () => {
                this.smallReward(type, coin);
                endFunc?.();
            });
        });
    }

    /**
     * 靠左小獎圈
     */
    smallReward(type: 0 | 1 | 2 | 3, coin: number) {
        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) return

        let rewardNode = Game.dataMgr.getReward(FishMedal.Medal_2);
        let reward = rewardNode.getComponent(LeftRewardCircle);

        // 調整層級，確保從上往下排序
        let pivot = find(Game.node.rewardLayer, 'Pos_1');
        let list = pivot.children
        list.forEach((L, zi) => {
            L.setSiblingIndex(zi);
        });
        rewardNode.setSiblingIndex(pivot.children.length);
        rewardNode.setParent(pivot);

        let kind = ([18, 19, 20, 21])[type];
        reward.init(kind, coin, false, () => reward.node.destroy());
    }

}
