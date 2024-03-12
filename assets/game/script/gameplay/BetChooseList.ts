import { _decorator, Node, Label, Component, Event, UIOpacity } from 'cc';
import { appManager, soundManager, walletManager } from 'db://annin-framework/manager';
import { SoundName } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('SelectedInfo')
export class SelectedInfo {
    @property(Node)
    betbutton: Node = null;

    @property(Node)
    selectedNode: Node = null;

    @property(Label)
    betLabel: Label = null;

    bet: number = 0;
}

@ccclass
export default class BetChooseList extends Component {

    @property(Node)
    root: Node = null;

    @property(SelectedInfo)
    betbuttons: SelectedInfo[] = [];

    @property(Node)
    hideGroup: Node[] = [];

    @property(Node)
    hideMiniGroup: Node[] = [];

    @property(Node)
    bg: Node = null;

    private betIdx: number = 0;
    private lastIdx: number = 0;    // 最後一個押注值

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    init(bets: number[]) {
        let bet = 0;
        let turret = Game.main.getTurret();
        if (turret) {
            bet = turret.getBet();
        }

        this.showChoose(false);
        for (let i = 0; i < this.betbuttons.length; ++i) {
            if (bets[i]) {
                this.betbuttons[i].betLabel.string = walletManager.FormatCoinNum(bets[i]);
                this.betbuttons[i].bet = bets[i];
                if (bet == bets[i]) {
                    this.betIdx = i;
                }
            } else {
                if (this.lastIdx == 0) {
                    this.lastIdx = i - 1;
                }
                this.betbuttons[i].betbutton.getComponent(UIOpacity).opacity = 0;
                this.betbuttons[i].betLabel.string = '';
                this.bg.active = false;
            }
            
        }
        this.showChoose(true);
    }

    setActive() {
        this.root.active = !this.root.active;
    }

    setActiveFalse() {
        this.root.active = false;
    }

    toolEvent(e: Event, data: string) {
        let idx = parseInt(data);

        if (this.betbuttons[idx].betbutton.getComponent(UIOpacity).opacity == 0) {
            idx = this.lastIdx;
        }

        if (this.betbuttons[idx]) {
            let bet = this.betbuttons[idx].bet;
            let turret = Game.main.getTurret();
            if (turret) {
                turret.setBet(bet);
                soundManager.playEffect(SoundName.button01);
                Game.automatic.setBetNum = bet;
            }
            Game.main.updateJPValues();
            Game.main.updateJPLimits();
            this.setActive();
        }
        this.showChoose(false);
        this.betIdx = idx;
        this.showChoose(true);
    }

    showChoose(ok: boolean) {
        if (this.betbuttons[this.betIdx]) {
            this.betbuttons[this.betIdx].selectedNode.active = ok;
        }
    }
}
