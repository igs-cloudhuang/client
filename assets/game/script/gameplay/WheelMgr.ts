import { _decorator, Component } from 'cc';
import { rItem } from 'db://annin-framework/utils';
import Game from '../system/Game';
import prot from '../network/protocol/protocol.js';

const { ccclass, property } = _decorator;

export class oddsList {
    odds: number = 0;         // odds
    localPos: number[] = [];     // 位置
}

class wheelOdds {
    base: number = 0;
    more: number = 0;
    jp: number = 0;
    ack: prot.protocol.HitAckData = null;
}

@ccclass('WheelMgr')
export default class WheelMgr extends Component {

    private list: oddsList[] = [];          //  一般轉輪的 odds & 停輪格子

    private wheelList: wheelOdds[] = [];

    jpOdds: number = 99999;             //  JP的 odds

    onLoad () {
        Game.wheelMgr = this;
    }

    start() {
        let add = (list: oddsList[], no: number, a: number[]) => {
            let info = new oddsList();
            info.odds = no;
            info.localPos = a;
            list.push(info);
        }

        // 規則從大到小，方便 for迴圈 找
        add(this.list, this.jpOdds, [9]);
        add(this.list, 100, [0]);
        add(this.list, 75, [4]);
        add(this.list, 60, [2]);
        add(this.list, 50, [11]);
        add(this.list, 30, [7]);
        add(this.list, 20, [13]);
        add(this.list, 15, [6]);
        add(this.list, 10, [1, 10]);
        add(this.list, 8, [5, 12]);
        add(this.list, 5, [3, 8]);
    }

    onDestroy() {
        Game.wheelMgr = null;
    }

    addWheel(ack: prot.protocol.HitAckData) {
        let ok = false;

        if (ack.remove[0]?.jackpot?.coin > 0) {
            ok = true;
            let info = new wheelOdds();
            info.base = 0;
            info.more = this.jpOdds;
            info.ack = ack;
            info.jp = ack.remove[0].jackpot.coin;
            this.wheelList.push(info);
            console.log(info, 'jp 加入轉輪列表')
        } else {
            let odds = Math.round(ack.coin / ack.bet);

            for (let i = 0; i < this.list.length; ++i) {
                let base: number = 0;
                // 基本5倍或10倍，找出可整除的數
                if (this.list[i].odds * 5 == odds) { base = 5; }
                else if (this.list[i].odds * 10 == odds) { base = 10; }
    
                if (base > 0) {
                    ok = true;
                    let info = new wheelOdds();
                    info.base = base;
                    info.more = this.list[i].odds;
                    info.ack = ack;
                    info.jp = 0;
                    this.wheelList.push(info);
                    console.log(info, '加入轉輪列表')
                    break;
                }
            }
        }

        return ok
    }

    getWheel() {
        return this.wheelList.shift();
    }

    /**
     * 取得格子停在哪
     */
    getIndex(odds: number) {
        for (let i = 0; i < this.list.length; ++i) {
            if (odds >= this.list[i].odds) {
                return rItem(this.list[i].localPos)
            }
        }

        return 0;
    }
}
