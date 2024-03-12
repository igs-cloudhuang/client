import { Component, Node, sys, tween, WebView, _decorator } from "cc";
import { find } from "../utils";

const { ccclass, property } = _decorator;

enum WebType{
    None,
    Report,
    Intro,
    VIP,
    Event
}

const AvoidApiid = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];


@ccclass
export default class WebPage extends Component {

    @property(Node)
    pageNode: Node = null;

    @property(WebView)
    webView: WebView = null;

    isInitialized = false;

    private messageListener = null as (this: Window, ev: MessageEvent<any>) => any;
    private showType: WebType = WebType.None;

    onLoad() {
        // 做方法轉接
        this.node.on("showReport", this.showReport, this)
        this.node.on("showIntro", this.showIntro, this)
        this.node.on("close", this.close, this)
    }

    onDestroy() {
        if (this.messageListener !== null) {
            window.removeEventListener('message', this.messageListener, false);
            this.messageListener = null;
        }
    }

    update(dt: number) {
        if (this.pageNode.active && this.showType != WebType.Report && Annin.Msgbox.isDisplaying() === true) {
            this.close();
            return;
        }
        
        // 防止web蓋在特色loading上
        let webViewNode = this.webView.node;
        if(Annin.Comm.node.loading.children[0]?.active && webViewNode.position.y < 5000){
            webViewNode.setPosition(webViewNode.position.x, webViewNode.position.y + 10000);
        }
        else if(!Annin.Comm.node.loading.children[0]?.active && webViewNode.position.y > 5000){
            webViewNode.setPosition(webViewNode.position.x, webViewNode.position.y - 10000);
        }
    }

    show() {
        let webViewNode = this.webView.node;
        if(webViewNode.position.y < 5000){
            webViewNode.setPosition(webViewNode.position.x, webViewNode.position.y + 10000);
        }
        this.pageNode.active = true;

        if (this.isInitialized === false) {
            if (sys.isNative) {
                this.webView.setJavascriptInterfaceScheme('wv2g');
                this.webView.setOnJSCallback((target?, url?) => {
                    let str = url.replace('wv2g' + '://', '');
                    if (str === 'CloseWebView') {
                        this.close();
                    }
                });
            }
            else {
                let myWebPage = this;
                this.messageListener = function (event) {
                    if (event.data === 'CloseWebView') {
                        let web = Annin.App.getWeb();
                        if (event.origin === web || Annin.Comm.state.isDemo) {
                            myWebPage.close();
                        }
                    }
                }
                window.addEventListener('message', this.messageListener, false);
            }
            this.isInitialized = true;
        }

        // 如果有返回APP大廳按鈕要隱藏/恢復
        let exitNode = find('LobbyPersistCanvas/LobbyBridge');
        if (exitNode) exitNode.emit('onSubGameSetBackBtnVisible', false);
    }

    close() {
        let webViewNode = this.webView.node;
        if(webViewNode.position.y < 5000){
            webViewNode.setPosition(webViewNode.position.x, webViewNode.position.y + 10000);
        }
        tween(this.node)
            .delay(0.1)
            .call(() => this.pageNode.active = false)
            .start();

        // 如果有返回APP大廳按鈕要隱藏/恢復
        let exitNode = find('LobbyPersistCanvas/LobbyBridge');
        if (exitNode) exitNode.emit('onSubGameSetBackBtnVisible', true);
    }

    isShow(): boolean {
        return this.pageNode.active;
    }

    setUrl(str: string) {
        if (this.webView) {
            this.webView.url = str;
        }
    }

    redirect() {
        this.webView.nativeWebView.contentWindow.postMessage('{"cmd": "refresh", "options": { "stayLatestPage": true } }', Annin.App.getWeb());
    }

    // 製作一個html層的X離開按鈕壓在WebView上
    createCancelButton() {
        let cancel = document.createElement('a');
        const root = document.getElementById('Cocos3dGameContainer')

        cancel.innerText = "X"
        cancel.style.position = 'absolute';
        cancel.style.right = '10px';
        cancel.style.top = '10px'
        cancel.style.fontSize = '1.5em'

        cancel.onclick = () => {
            this.close();
            root.removeChild(cancel);
        }

        root.appendChild(cancel)
    }

    // ----------------------------------------------------------------
    // 封裝好的特定網頁
    // ----------------------------------------------------------------

    // 報表
    showReport(){
        if (Annin.Comm.state.isDemo) {
            Annin.Msgbox.msgOK(Annin.i18n.getCommString(41)).then(() => {});
        } else {
            if(!this.isInitialized || this.showType != WebType.Report) {
                let url = Annin.App.getOfficialUrl();
                if (!url.match('%s')) {
                    this.setUrl(url);
                    this.show();
                }
            }
            else {
                this.show();
                this.redirect();
            }
        }
        this.showType = WebType.Report;
    }

    // 報表  而且是預設直接進入自己的遊戲
    showMyReport(gameName: string){
        if (Annin.Comm.state.isDemo) {
            Annin.Msgbox.msgOK(Annin.i18n.getCommString(41)).then(() => {});
        } else {
            let url = Annin.App.getOfficialUrl();
            if (!url.match('%s')) {
                url = url.replace("ingame/?", "ingame/gamehistory/" + gameName + "?");
                this.setUrl(url);
                this.show();
            }
        }
        this.showType = WebType.Report;
    }


    // 說明頁
    showIntro(extra: string = ""){
        let url = Annin.App.getIntrolUrl();
        url = url.replace('{gameName}', Annin.Comm.config.project);
        if(extra.length > 0) url = url + extra;
        this.setUrl(url);
        this.show();
        this.showType = WebType.Intro;
    }

    // vip
    showVIP(){
        let url = Annin.App.getVipWebUrl();
        if (!url.match('%s') && !url.match('undefined')) {
            this.setUrl(url);
            this.show();
        }
        this.showType = WebType.VIP;
    }

    // event
    showEvent(){
        let url = Annin.App.getWinMoreEventWebUrl();
        if (!url.match('%s') && !url.match('undefined')) {
            this.setUrl(url);
            this.show();
        }
        this.showType = WebType.Event;
    }

}
