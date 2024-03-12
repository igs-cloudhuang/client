import sprintf from 'sprintf-js';
import { _decorator, Component, RichText, Node, Label, Sprite, SpriteFrame, Animation, tween, v3, UITransform, UIOpacity } from 'cc';
import { i18nManager, msgboxManager, walletManager } from 'db://annin-framework/manager';
import { Bus, BusEvent } from 'db://annin-framework/system';
import { delay } from '../system/ToolBox';
import Game from '../system/Game';

const {ccclass, property} = _decorator;

@ccclass('Broadcast')
export default class Broadcast extends Component {

    @property(RichText)
    lineRichText: RichText = null;

    @property(Node)
    lineNode: Node = null;

    @property(Node)
    cardNode: Node = null;

    @property(Label)
    cardLabel: Label = null;

    @property(Label)
    cardCoin: Label = null;

    @property(Label)
    cardOdds: Label = null;

    @property(Node)
    cardJpTipNode: Node = null;

    @property(Label)
    cardDarkOdds: Label = null;

    @property(Node)
    cardFishSpr: Node = null;

    @property(Node)
    nameList: Node[] = [];

    @property(Node)
    gratzList: Node[] = [];

    @property(Node)
    headList: Node[] = [];

    @property(Node)
    jpLinkCardNode: Node = null;

    @property(Label)
    jpLinkCardCoin: Label = null;

    @property(Label)
    jpLinkCardText: Label = null;

    @property(Sprite)
    jpLinkCardTitle: Sprite = null;

    @property(SpriteFrame)
    jpLinkCardTitleList: SpriteFrame[] = [];

    private broadList: broadcastData[] = [];    // 跑馬燈住列
    private readyList: broadcastData[] = [];    // 跑馬燈住列
    private bShow: boolean = false;             // 是否顯示中
    private bGameEnd: boolean = false;             // 是否顯示中

    // 維修倒數
    private lastTime: number = 0;
    private broadTime: number[] = [30, 10];
    private broadShow: boolean[] = [false, false];

    onLoad () {
        Game.broadcast = this;
        // Bus.always(BusEvent.MaintainBroadcast, this.maintain, this);
        Bus.always(BusEvent.GameReadyToClose, this.gameEnd, this);
    }

    onDestroy() {
        Game.broadcast = null;
        // Bus.cancel(BusEvent.MaintainBroadcast, this.maintain, this);
        Bus.always(BusEvent.GameReadyToClose, this.gameEnd, this);
    }

    update(dt: number) {
        if (this.bShow == false && !this.bGameEnd) {
            for (let i = 0; i < this.broadList.length; ++i) {
                this.bShow = true;
                this.showMessage(this.broadList[i]);
                this.broadList.splice(i, 1);
                break;
            }
        }

        if (this.lastTime > 0) {
            this.lastTime = this.lastTime - dt;
            for (let i in this.broadTime) {
                if ((this.lastTime <= this.broadTime[i]) && !this.broadShow[i]) {
                    this.broadShow[i] = true;
                    this.priorityMessage_sec(this.broadTime[i]);
                }
            }
        }
    }

    /**
     * 跑馬燈參數
     * @param name 玩家姓名
     * @param coin 金額
     * @param fishID 魚種編號
     * @param odds 倍率
     * @param theme 廳館名稱
     * @param kind 跑馬燈類型
     * @param from 從哪隻魚獲得(JP)
     */
    setMessage(name: string, coin: number, fishID: number, odds: number, theme: string, kind: number, from: number = 0): void {

        let passName: string = '';
        let start = name.length-3;
        let end = name.length;

        for (let i = 0; i < start; ++i)
            passName += '*';

        passName += name.substring(start, end);

        let data = new broadcastData();
        data.name = passName;
        data.coin = coin;
        data.fishID = fishID;
        data.odds = odds;
        data.theme = theme;
        data.from = from;
        data.kind = kind;

        if (this.broadList.length < 20)
            this.broadList.push(data);
    }

    /**
     * 跑馬燈參數
     * @param name 玩家姓名
     * @param coin 金額
     * @param fishID 魚種編號
     * @param odds 倍率
     * @param theme 廳館名稱
     * @param kind 跑馬燈類型
     * @param from 從哪隻魚獲得(JP)
    */
    readyMessage(name: string, coin: number, fishID: number, odds: number, theme: string, kind: number, from: number = 0): void {

        let passName: string = '';
        let start = name.length-3;
        let end = name.length;

        for (let i = 0; i < start; ++i)
            passName += '*';

        passName += name.substring(start, end);

        let data = new broadcastData();
        data.name = passName;
        data.coin = coin;
        data.fishID = fishID;
        data.odds = odds;
        data.theme = theme;
        data.from = from;
        data.kind = kind;

        this.readyList.push(data);
    }

    /**
     * 確定已結束，轉換至待撥放
     * @param coin 
     */
    transMessage(coin: number) {
        for (let i = 0; i < this.readyList.length; ++i) {
            if (this.readyList[i].coin == coin) {
                this.broadList.push(this.readyList[i]);
                this.readyList.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 關機訊息
     * @param num 倒數分鐘
     */
        
    priorityMessage_min(num: number) {
        this.lastTime = num*60;
        this.bShow = true;
        this.lineRichText.maxWidth = 0;
        this.lineRichText.string = sprintf.sprintf(i18nManager.getString(125), num);
        this.lineNode.active = true;
        this.lineNode.getComponent(Animation).play();
    }

    priorityMessage_sec(num: number) {
        this.lastTime = num;
        this.bShow = true;
        this.lineRichText.maxWidth = 0;
        this.lineRichText.string = sprintf.sprintf(i18nManager.getString(135), num);
        this.lineNode.active = true;
        this.lineNode.getComponent(Animation).play();
    }

    priorityMessage_date(type: number, start: number, end: number) {
        let msg = '';
        if (type == 0) msg = i18nManager.getCommString(53)
        else if (type == 1) msg = i18nManager.getCommString(54)

        msg = sprintf.sprintf(msg, new Date(start).toLocaleString(), new Date(end).toLocaleString());

        msgboxManager.msgOK(msg);
    }

    /**
     * 顯示跑馬燈
     * @param data 
     */
    showMessage(data: broadcastData): void {
        let fishSprName1 = ['50X50_06', '50X50_07', '50X50_08', '50X50_09', '50X50_10', '50X50_11', '50X50_12'];
        let fishSprName2 = [        '',         '',         '',         '',         '',         '',         ''];

        let strA = i18nManager.getString(126);
        // 道具卡
        // if (data.fishID > 10000) {
        //     strA = LanguageList.getString(139);
        // }
        // if (data.fishID == 13 || data.fishID == 14 || data.fishID == 15 || data.fishID == 16 || data.fishID == 17 || data.fishID == 18) {
        //     strA = i18nManager.getString(127);
        // }
        if (data.fishID == 10 || data.fishID == 22 || data.fishID == 25) {
            strA = i18nManager.getString(128);
        }
        // else if (data.fishID == 19) {
        //     strA = i18nManager.getString(129);
        // }
        // else if (data.fishID == 101) {
        //     strA = i18nManager.getString(130);
        // }

        let fishIdx = 0;
        if (data.fishID == 6) fishIdx = 0;
        else if (data.fishID == 7)  fishIdx = 1;
        else if (data.fishID == 8)  fishIdx = 2;
        else if (data.fishID == 9 || data.fishID == 21)  fishIdx = 3;
        else if (data.fishID == 10 || data.fishID == 22 || data.fishID == 25)  fishIdx = 4;
        else if (data.fishID == 11 || data.fishID == 23)  fishIdx = 5;
        else if (data.fishID == 12 || data.fishID == 24)  fishIdx = 6;
        // else if (data.fishID == 19)  fishIdx = 8;
        // else if (data.fishID == 101)  fishIdx = 9;

        this.lineNode.active = true;
        this.lineRichText.maxWidth = 0;
        this.lineRichText.string = sprintf.sprintf(strA, data.name, '', walletManager.FormatCoinNum(data.odds), walletManager.FormatCoinNum(data.coin), fishSprName1[fishIdx], fishSprName2[fishIdx]);

        delay(this.node, 0, () => {
            let size = this.lineRichText.node.getComponent(UITransform).contentSize;

            this.lineRichText.node.setPosition(v3(this.lineNode.getComponent(UITransform).width / 2, 0))
            let goalX = this.lineNode.getComponent(UITransform).width + size.width;

            tween(this.lineNode.getComponent(UIOpacity))
            .to(0.5, { opacity: 255 })
            .call(() => {

                tween(this.lineRichText.node.getComponent(UIOpacity))
                .by(goalX / 150, { opacity: 0})
                .start();

                tween(this.lineRichText.node)
                .by(goalX / 150, { position: v3(-goalX, 0) })
                .call(() => {
                    tween(this.lineNode.getComponent(UIOpacity))
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        this.bShow = false;
                        this.lineNode.active = false;
                    })
                    .start();
                })
                .start();
            })
            .start();
        })
    }

    /**
     *  維修通知 todo: 看獵龍也註解了? 不支援?
     */
    // maintain = (data: pb.pb.MaintainData) => {
    //     Game.broadcast.priorityMessage_min(data.next)
    //     if (data.next == 10 || data.next == 7 || data.next == 4 || data.next == 1) {
    //         Game.broadcast.priorityMessage_date(data.type, data.start.toNumber() * 1000, data.end.toNumber() * 1000);
    //     }
    // }

    gameEnd = () => {
        this.bGameEnd = true;
    }
}

export class broadcastData {
    name: string = '';
    coin: number = 0;
    fishID: number = 0;
    odds: number = 0;
    theme: string = '';
    kind: number = 0;
    from: number = 0;
}
