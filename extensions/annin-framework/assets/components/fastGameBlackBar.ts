import { Component, Label, _decorator, Node, tween } from 'cc';
import { SwitchOffKeyDefine } from 'db://annin-framework/license/LicenseSetting';
import { Bus, BusEvent, Comm, Forever, Timer } from 'db://annin-framework/system';
const { ccclass, property } = _decorator;

@ccclass('fastGameBlackBar')
export class fastGameBlackBar extends Component {

    @property([Node])
    netNds: Node[] = [];

    @property([Node])
    playTimeNds: Node[] = [];

    @property([Node])
    nowTimeNds: Node[] = [];

    @property([Node])
    versionNode: Node[] = [];

    @property(Label)
    netStr: Label = null;

    @property(Label)
    nowTimeStr: Label = null;

    @property(Label)
    durationTimeStr: Label = null;

    @property(Label)
    roundTxt: Label = null;

    @property([Node])
    wifiNds: Node[] = [];

    onLoad() {
        Bus.always(BusEvent.UpdateWallet, this.updateNet, this);       // 金流刷新事件註冊
    }

    start() {
        this.initLayer();
        this.initLicenseUI();
        this.updateNet(Annin.Wallet.myUserID);
        Timer.repeat_dt(Forever, 1, ()=>{
            this.pongListener();
        })
    }

    /**
     * 自適應上層UI的Layer
     */
    initLayer(){
        this.node.layer = this.node.parent.layer;
        this.node.walk(node => node.layer = this.node.layer);
    }

    /**
     * 送審相關介面初始化
     */
    initLicenseUI(){
        // 以下開關的值都是顛倒的   false = 有啟用
        let showNetWin = !Annin.App.checkSwitchOn(SwitchOffKeyDefine.ShowNetWin);
        let showPlayTime = !Annin.App.checkSwitchOn(SwitchOffKeyDefine.ShowPlayTime);
        let showNowTime = !Annin.App.checkSwitchOn(SwitchOffKeyDefine.ShowTime);
        let showVersion = !Annin.App.checkSwitchOn(SwitchOffKeyDefine.ShowPlateformVer);

        this.netNds.forEach(node => node.active = showNetWin);
        this.playTimeNds.forEach(node => node.active = showPlayTime);
        this.nowTimeNds.forEach(node => node.active = showNowTime);
        this.versionNode.forEach(node => node.active = showVersion);
        
        if(showPlayTime || showNowTime){
            // 時間
            tween(this.node)
                .call(()=>{
                    let nowD = new Date()
                    let h = nowD.getHours();
                    let m = nowD.getMinutes();
                    let nowStr = ((h < 10)? "0" + h : h) + ":" + ((m < 10)? "0" + m : m);
                    let dur = (nowD.getTime() - Comm.state.inGameTime) / 1000;
                    if(!dur) dur = 0;
                    h = Math.floor(dur / 3600);
                    m = Math.floor(dur / 60);
                    let s = Math.floor(dur % 60);
                    let durStr = ((h < 10)? "0" + h : h) + ":" + ((m < 10)? "0" + m : m) + ":" + ((s < 10)? "0" + s : s);

                    if(showNowTime) this.nowTimeStr.string = nowStr;
                    if(showPlayTime) this.durationTimeStr.string = durStr;
                })
                .delay(1)
                .union()
                .repeatForever()
                .start();
        }
    }

    // 刷新淨值顯示
    updateNet(userID: number){
        if(userID == Annin.Wallet.myUserID && this.netStr) this.netStr.string = Annin.Wallet.coinTypeStr + Annin.Wallet.FormatCoinNum(Annin.Wallet.net);
    }

    /**
     * 設定局號
     */
    setRoundIndex(idxStr: string) {
        this.roundTxt.string = idxStr;
    }

    /**
     * 刷新 Wifi 圖示
     */
    private pongListener = () => {
        let latency = Annin.App.latency;
        let wifiLv = 0;
        if (latency >= 600) wifiLv = 0; 
        if (latency >= 300) wifiLv = 1;
        if (latency >= 150) wifiLv = 2; 
        if (latency >= 0) wifiLv = 3;

        for (let l = 0; l <= 2; ++l) {
            this.wifiNds[l].active = (wifiLv > l);
        }
    };
}


