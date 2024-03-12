import { _decorator, Component, Node, Toggle, Label, Button, sys, CCInteger } from 'cc';
import { appManager, i18nManager, msgboxManager, soundManager, walletManager } from 'db://annin-framework/manager';
import { toDecimalX } from 'db://annin-framework/utils';
import { SceneEvent, SoundName } from './GameDefine';
import Game, { GameLog } from '../system/Game';

const {ccclass, property} = _decorator;

@ccclass('FishNoOdds')
export class FishNoWeight {
    @property(CCInteger)
    No: number = 0;         // no

    @property(CCInteger)
    weight: number = 0;     // 權重
}

@ccclass
export default class AutoMatic extends Component {

    // 選擇自動補魚介面
    @property(Node)
    autoFishNode: Node = null;

    // 總局數
    @property(Node)
    checkRoundNode: Node = null;

    // 單次贏分超過
    @property(Node)
    checkScoreNode: Node = null;

    // 小於目標金額
    @property(Node)
    checkLessNode: Node = null;

    // 大於目標金額
    @property(Node)
    checkMoreNode: Node = null;

    // 進入免費遊戲停止
    @property(Node)
    checkFreeNode: Node = null;

    // 進入金豬停止
    @property(Node)
    checkPigNode: Node = null;

    // 只攻擊選擇的柱怪
    @property(Node)
    checkChooseNode: Node = null;

    // 進入冰龍停止
    @property(Node)
    freezeFragonNode: Node = null;

    @property(Node)
    backgroundColor: Node[] = [];

    // 選取的魚種
    @property(Toggle)
    selectNodeList: Toggle[] = [];

    // 選取魚種的ID
    @property(FishNoWeight)
    selectFishIDList: FishNoWeight[] = [];

    // 射擊總數顯示
    @property(Label)
    totalShotStr: Label = null;

    @property(Label)
    overScoreStr: Label = null;

    @property(Label)
    lessCoinStr: Label = null;

    @property(Label)
    moreCoinStr: Label = null;

    @property(Button)
    subButton: Button[] = [];

    @property(Button)
    addButton: Button[] = [];

    private pressSubButton: boolean[] = [false, false, false, false];   // 減少發射次數按鈕
    private pressDelta: number[] = [0, 0, 0, 0];            // 發射按鈕長壓的變化量
    private pressAddButton: boolean[] = [false, false, false, false];   // 增加發射次數按鈕

    private defaultShootCount: number = 100;          // 發射次數的値
    private autoShootCount: number = this.defaultShootCount;          // 發射次數的値
    private overScoreCount: number = 10;             // 發射次數的値
    private lessCoinCount: number = 40000;             // 發射次數的値
    private moreCoinCount: number = 150000;             // 發射次數的値

    private bInit: boolean = false;         // 是否初始化
    private bNextStop: boolean = false;

    setBetNum: number = 0;

    onLoad () {
        Game.automatic = this;
    }

    start () {
        for (let i = 0; i < this.pressSubButton.length; ++i) {
            this.subButton[i].node.on(Node.EventType.TOUCH_START, function() {
                this.touchSubButton(i, 1);
                soundManager.playEffect(SoundName.button01);
            }, this)
    
            this.subButton[i].node.on(Node.EventType.TOUCH_END, function() { this.touchSubButton(i, 0) }, this)
            this.subButton[i].node.on(Node.EventType.TOUCH_CANCEL, function() { this.touchSubButton(i, 0) }, this)

            this.addButton[i].node.on(Node.EventType.TOUCH_START, function() {
                this.touchAddButton(i, 1);
                soundManager.playEffect(SoundName.button01);
            }, this)

            this.addButton[i].node.on(Node.EventType.TOUCH_END, function() { this.touchAddButton(i, 0) }, this)
            this.addButton[i].node.on(Node.EventType.TOUCH_CANCEL, function() { this.touchAddButton(i, 0) }, this)
        }
    }

    onDestroy() {
        Game.automatic = null;
    }

    update (dt) {
        for (let i = 0; i < this.pressSubButton.length; ++i) {
            if (this.pressAddButton[i]) {
                this.pressDelta[i] = 1.01 * this.pressDelta[i];
                if (this.pressDelta[i] > 1.5) {
                    switch (i) {
                        case 0: { this.updateButton_Shoot(this.pressDelta[i]); break; }
                        case 1: { this.updateButton_Score(this.pressDelta[i]); break; }
                        case 2: { this.updateButton_less(this.pressDelta[i]); break; }
                        case 3: { this.updateButton_more(this.pressDelta[i]); break; }
                    }
                }
            }

            if (this.pressSubButton[i]) {
                this.pressDelta[i] = 1.01 * this.pressDelta[i];
                if (this.pressDelta[i] > 1.5) {
                    switch (i) {
                        case 0: { this.updateButton_Shoot(-this.pressDelta[i]); break; }
                        case 1: { this.updateButton_Score(-this.pressDelta[i]); break; }
                        case 2: { this.updateButton_less(-this.pressDelta[i]); break; }
                        case 3: { this.updateButton_more(-this.pressDelta[i]); break; }
                    }
                }
            }
        }
    }

    // 設定記憶點選狀態
    init(): void {
        this.updateButton_Shoot(0);
        this.updateButton_Score(0);
        this.updateButton_less(0);
        this.updateButton_more(0);

        this.loadSetting();
    }

    show() {
        if (!this.bInit) {
            this.init();
            this.bInit = true;

            let turret = Game.main.getTurret();
            if (turret) {
                this.setBetNum = turret.getBet();
            }
        }

        this.setValue();
        this.autoFishNode.active = true;
        soundManager.playEffect(SoundName.button01);
    }

    close() {
        this.autoFishNode.active = false;
    }

    toolEvent(event, data) {
        switch (data) {
            case 'close': {
                this.close();
                break;
            }
            case 'finished': {
                this.setFinished();
                this.close();
                break;
            }
            case 'r50': {
                this.defaultShootCount = 50;
                this.autoShootCount = this.defaultShootCount;
                this.updateButton_Shoot(0);
                this.checkRoundNode.active = true;
                this.backgroundColor[0].active = this.checkRoundNode.active;
                break;
            }
            case 'r100': {
                this.defaultShootCount = 100;
                this.autoShootCount = this.defaultShootCount;
                this.updateButton_Shoot(0);
                this.checkRoundNode.active = true;
                this.backgroundColor[0].active = this.checkRoundNode.active;
                break;
            }
            case 'r200': {
                this.defaultShootCount = 200;
                this.autoShootCount = this.defaultShootCount;
                this.updateButton_Shoot(0);
                this.checkRoundNode.active = true;
                this.backgroundColor[0].active = this.checkRoundNode.active;
                break;
            }
            case 'r500': {
                this.defaultShootCount = 500;
                this.autoShootCount = this.defaultShootCount;
                this.updateButton_Shoot(0);
                this.checkRoundNode.active = true;
                this.backgroundColor[0].active = this.checkRoundNode.active;
                break;
            }
            case 'r999': {
                this.defaultShootCount = 999;
                this.autoShootCount = this.defaultShootCount;
                this.updateButton_Shoot(0);
                this.checkRoundNode.active = true;
                this.backgroundColor[0].active = this.checkRoundNode.active;
                break;
            }
            case 'round': {
                this.checkRoundNode.active = !this.checkRoundNode.active;
                this.backgroundColor[0].active = this.checkRoundNode.active;
                break;
            }
            case 'over': {
                this.checkScoreNode.active = !this.checkScoreNode.active;
                this.backgroundColor[1].active = this.checkScoreNode.active;
                break;
            }
            case 'less': {
                this.checkLessNode.active = !this.checkLessNode.active;
                this.backgroundColor[2].active = this.checkLessNode.active;
                break;
            }
            case 'more': {
                this.checkMoreNode.active = !this.checkMoreNode.active;
                this.backgroundColor[3].active = this.checkMoreNode.active;
                break;
            }
            case 'free': {
                this.checkFreeNode.active = !this.checkFreeNode.active;
                this.backgroundColor[4].active = this.checkFreeNode.active;
                break;
            }
            case 'pig': {
                this.checkPigNode.active = !this.checkPigNode.active;
                this.backgroundColor[5].active = this.checkPigNode.active;
                break;
            }
            case 'choose': {
                this.checkChooseNode.active = !this.checkChooseNode.active;
                this.backgroundColor[6].active = this.checkChooseNode.active;
                break;
            }
            case 'freeze': {
                this.freezeFragonNode.active = !this.freezeFragonNode.active;
                this.backgroundColor[7].active = this.freezeFragonNode.active;
                break;
            }
            case 'chooseAll': {
                for (let i in this.selectNodeList) {
                    this.selectNodeList[i].isChecked = true;
                }
                break;
            }
            case 'resetAll': {
                for (let i in this.selectNodeList) {
                    this.selectNodeList[i].isChecked = false;
                }
                break;
            }
        }
    }

    setFinished() {
        this.bNextStop = false;

        if (this.checkRoundNode.active) { appManager.sendButton(GameLog.Auto_TotalRound, this.autoShootCount.toString()); }
        if (this.checkScoreNode.active) { appManager.sendButton(GameLog.Auto_SingleWinOver, this.overScoreCount.toString()); }
        if (this.checkLessNode.active) { appManager.sendButton(GameLog.Auto_LessCoinStop, this.lessCoinCount.toString()); }
        if (this.checkMoreNode.active) { appManager.sendButton(GameLog.Auto_OverCoinStop, this.moreCoinCount.toString()); }
        if (this.checkFreeNode.active) { appManager.sendButton(GameLog.Auto_FeaturesStop1); }
        if (this.checkPigNode.active) { appManager.sendButton(GameLog.Auto_FeaturesStop3); }
        if (this.freezeFragonNode.active) { appManager.sendButton(GameLog.Auto_FeaturesStop2); }

        if (!this.checkChooseNode.active) {
            appManager.sendButton(GameLog.Auto_Start, 'all');
            
            let list: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24];
            Game.shootMgr.setAutoFishIDList(list);

            this.saveSetting();
            return;
        }
        
        let listStr: string = '';

        let chooseFishIDList: FishNoWeight[] = [];
        for (let i in this.selectNodeList) {
            if (this.selectNodeList[i].isChecked) {
                listStr += this.selectFishIDList[i].No.toString() + ',';
                chooseFishIDList.push(this.selectFishIDList[i]);
                if (this.selectFishIDList[i].No == 8) {
                    let info = new FishNoWeight();
                    info.No = 20;
                    chooseFishIDList.push(info);
                } else if (this.selectFishIDList[i].No == 9) {
                    let info = new FishNoWeight();
                    info.No = 21;
                    chooseFishIDList.push(info);
                } else if (this.selectFishIDList[i].No == 10) {
                    let info = new FishNoWeight();
                    info.No = 22;
                    chooseFishIDList.push(info);

                    let info2 = new FishNoWeight();
                    info2.No = 25;
                    chooseFishIDList.push(info2);
                } else if (this.selectFishIDList[i].No == 11) {
                    let info = new FishNoWeight();
                    info.No = 23;
                    chooseFishIDList.push(info);
                } else if (this.selectFishIDList[i].No == 12) {
                    let info = new FishNoWeight();
                    info.No = 24;
                    chooseFishIDList.push(info);
                }
            }
        }

        if (chooseFishIDList.length > 0) {
            let list: number[] = [];

            appManager.sendButton(GameLog.Auto_Start, listStr);

            for (let i = 0; i < chooseFishIDList.length; ++i) {
                list.push(chooseFishIDList[i].No);
            }
            Game.shootMgr.setAutoFishIDList(list);

            this.saveSetting();

            if (!this.checkChooseNode.active) {
                this.toolEvent(null, 'choose');
            }
        } else {
            // 沒選擇任何魚種
            msgboxManager.msgYesNo(i18nManager.getString(102)).then(toggle => {
                if (toggle === true) {
                    this.close();
                }
            });
        }

        if (this.checkRoundNode.active) {
            Game.uiCtrl.setShootCount(this.autoShootCount);
        }
    }

    saveSetting() {
        let gameid = appManager.gameID;

        for (let i = 0; i < this.selectNodeList.length; ++i) {
            let save = (this.selectNodeList[i].isChecked)? '1' : '0';
            sys.localStorage.setItem('AutoMatic_' + gameid + i.toString(), save);
        }

        sys.localStorage.setItem('checkChoose' + gameid, this.checkChooseNode.active? '1' : '0');
        sys.localStorage.setItem('checkRound' + gameid, this.checkRoundNode.active? '1' : '0');
        sys.localStorage.setItem('checkScore' + gameid, this.checkScoreNode.active? '1' : '0');
        sys.localStorage.setItem('checkLess' + gameid, this.checkLessNode.active? '1' : '0');
        sys.localStorage.setItem('checkMore' + gameid, this.checkMoreNode.active? '1' : '0');
        sys.localStorage.setItem('checkFree' + gameid, this.checkFreeNode.active? '1' : '0');
        sys.localStorage.setItem('checkPig' + gameid, this.checkPigNode.active? '1' : '0');
        sys.localStorage.setItem('freezeFragon' + gameid, this.freezeFragonNode.active? '1' : '0');
    }

    loadSetting() {
        let gameid = appManager.gameID;

        for (let i = 0; i < this.selectNodeList.length; ++i) {
            let save = sys.localStorage.getItem('AutoMatic_' + gameid + i.toString());
            if (save) {
                this.selectNodeList[i].isChecked = !(save == '0');
            }
        }

        let sa = sys.localStorage.getItem('checkRound' + gameid);
        if (sa && sa != '0') {
            this.checkRoundNode.active = true;
            this.backgroundColor[0].active = this.checkRoundNode.active;
        }

        let sb = sys.localStorage.getItem('checkScore' + gameid);
        if (sb && sb != '0') {
            this.checkScoreNode.active = true;
            this.backgroundColor[1].active = this.checkScoreNode.active;
        }

        let sc = sys.localStorage.getItem('checkLess' + gameid);
        if (sc && sc != '0') {
            this.checkLessNode.active = true;
            this.backgroundColor[2].active = this.checkLessNode.active;
        }

        let sd = sys.localStorage.getItem('checkMore' + gameid);
        if (sd && sd != '0') {
            this.checkMoreNode.active = true;
            this.backgroundColor[3].active = this.checkMoreNode.active;
        }

        let se = sys.localStorage.getItem('checkFree' + gameid);
        if (se && se != '0') {
            this.checkFreeNode.active = true;
            this.backgroundColor[4].active = this.checkFreeNode.active;
        }

        let sf = sys.localStorage.getItem('checkPig' + gameid);
        if (sf && sf != '0') {
            this.checkPigNode.active = true;
            this.backgroundColor[5].active = this.checkPigNode.active;
        }

        let sg = sys.localStorage.getItem('checkChoose' + gameid);
        if (sg && sg != '0') {
            this.checkChooseNode.active = true;
            this.backgroundColor[6].active = this.checkChooseNode.active;
        }

        let sh = sys.localStorage.getItem('freezeFragon' + gameid);
        if (sh && sh != '0') {
            this.freezeFragonNode.active = true;
            this.backgroundColor[7].active = this.freezeFragonNode.active;
        }
    }

    setValue() {
        if (this.setBetNum > 0) {
            this.overScoreCount = this.setBetNum * 10;
            this.setBetNum = 0;
        }

        this.lessCoinCount = walletManager.getClientRemains(walletManager.myUserID) * 0.4;
        this.moreCoinCount = walletManager.getClientRemains(walletManager.myUserID) * 1.5;

        this.updateButton_Score(0);
        this.updateButton_less(0);
        this.updateButton_more(0);
    }

    // 減少發射次數按鈕
    touchSubButton(kind: number, num: number): void {
        this.pressSubButton[kind] = false;
        this.pressAddButton[kind] = false;
        this.pressDelta[kind] = 0;
        if (num > 0) {
            this.pressSubButton[kind] = true;
            this.pressDelta[kind] = 1;
            switch (kind) {
                case 0: { this.updateButton_Shoot(-10); break; }
                case 1: { this.updateButton_Score(-10); break; }
                case 2: { this.updateButton_less(-10); break; }
                case 3: { this.updateButton_more(-10); break; }
            }
        }
    }

    // 增加發射次數按鈕
    touchAddButton(kind: number, num: number): void {
        this.pressSubButton[kind] = false;
        this.pressAddButton[kind] = false;
        this.pressDelta[kind] = 0;
        if (num > 0) {
            this.pressAddButton[kind] = true;
            this.pressDelta[kind] = 1;
            switch (kind) {
                case 0: { this.updateButton_Shoot(10); break; }
                case 1: { this.updateButton_Score(10); break; }
                case 2: { this.updateButton_less(10); break; }
                case 3: { this.updateButton_more(10); break; }
            }
        }
    }

    // 發射按鈕長壓的變化量
    updateButton_Shoot(num): void {
        this.autoShootCount = this.autoShootCount + num;
        this.autoShootCount = (this.autoShootCount < 1)? 1 : (this.autoShootCount > 99999)? 99999 : Math.floor(this.autoShootCount);
        this.totalShotStr.string = toDecimalX(this.autoShootCount, 0).toString();
        this.defaultShootCount = this.autoShootCount;
    }

    // 發射按鈕長壓的變化量
    updateButton_Score(num): void {
        this.overScoreCount = this.overScoreCount + num;
        this.overScoreCount = (this.overScoreCount < 1)? 1 : (this.overScoreCount > 99999999)? 99999999 : Math.floor(this.overScoreCount);
        this.overScoreStr.string = toDecimalX(this.overScoreCount, 0).toString();
    }

    // 發射按鈕長壓的變化量
    updateButton_less(num): void {
        this.lessCoinCount = this.lessCoinCount + num;
        this.lessCoinCount = (this.lessCoinCount < 1)? 1 : (this.lessCoinCount > 99999999)? 99999999 : Math.floor(this.lessCoinCount);
        this.lessCoinStr.string = toDecimalX(this.lessCoinCount, 0).toString();
    }

    // 發射按鈕長壓的變化量
    updateButton_more(num): void {
        this.moreCoinCount = this.moreCoinCount + num;
        this.moreCoinCount = (this.moreCoinCount < 1)? 1 : (this.moreCoinCount > 99999999)? 99999999 : Math.floor(this.moreCoinCount);
        this.moreCoinStr.string = toDecimalX(this.moreCoinCount, 0).toString();
    }

    /**
     * 消耗射擊次數
     */
    decreaseAutoShootCount() {
        let num = -1;

        if (this.bNextStop) {
            this.autoShootCount = this.defaultShootCount;
            this.totalShotStr.string = this.autoShootCount.toString();
            return num
        }

        if (this.checkRoundNode.active) {
            if (this.autoShootCount > 0) {
                if (!Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) this.autoShootCount -= 1;
                num = this.autoShootCount;
            } else {
                this.autoShootCount = this.defaultShootCount;
            }
            this.totalShotStr.string = this.autoShootCount.toString();
        } else {
            num = 0;
        }

        return num;
    }

    checkStop(kind: string, value: number) {
        switch (kind) {
            case 'score': {
                if (this.checkScoreNode.active) {
                    if (value >= this.overScoreCount) {
                        this.bNextStop = true;
                    }
                }
                break;
            }
            case 'less': {
                if (this.checkLessNode.active) {
                    if (value < this.lessCoinCount) {
                        this.bNextStop = true;
                    }
                }
                break;
            }
            case 'more': {
                if (this.checkMoreNode.active) {
                    if (value >= this.moreCoinCount) {
                        this.bNextStop = true;
                    }
                }
                break;
            }
            case 'free': {
                this.bNextStop = this.checkFreeNode.active;
                break;
            }
            case 'pig': {
                this.bNextStop = this.checkPigNode.active;
                break;
            }
            case 'freeze': {
                this.bNextStop = this.freezeFragonNode.active;
                break;
            }
        }
    }
}
