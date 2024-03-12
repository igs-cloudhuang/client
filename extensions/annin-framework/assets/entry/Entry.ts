import { assetManager, AssetManager, Component, Enum, instantiate, Node, Prefab, SpriteFrame, _decorator, sys, input, Rect, screen, Vec2, JsonAsset, VERSION, BufferAsset } from 'cc';
import SwipeScreen from './SwipeScreen';
import { BUILD } from 'cc/env';
import { GreedyLangImg } from './GreedyLangImg';
import { GreedyLangTxt } from './GreedyLangTxt';

const { ccclass, property } = _decorator;

export enum Orientation {
    Auto,
    Landscape,
    Portrait,
}

export enum ServerPrefix {
    Fish,
    Bingo,
    Poker,
    Real,  // 給外包連線用
}

@ccclass('Entry')
export class Entry extends Component {

    // ----------------------------------------------------------------
    // 專案資訊
    // ----------------------------------------------------------------

    // 專案名稱與網頁組說明頁命名掛勾
    @property({
        tooltip: "專案名稱"
    })
    project: string = '';

    @property({
        tooltip: "遊戲編號"
    })
    gameID: number = 0;

    // 若不知道請詢問server人員
    @property({
        tooltip: "serverPath"
    })
    serverPath: string = '';

    @property({
        tooltip: "伺服器路徑前綴",
        type: Enum(ServerPrefix)
    })
    serverPrefix: ServerPrefix = ServerPrefix.Fish;

    // ----------------------------------------------------------------
    // 功能開關
    // ----------------------------------------------------------------

    @property({
        tooltip: "(開關)我的最愛"
    })
    favorite: boolean = false;

    @property({
        tooltip: "(開關)VIP"
    })
    vip: boolean = false;

    @property({
        tooltip: "(開關)推薦"
    })
    promotion: boolean = false;

    @property({
        tooltip: "(開關)Top50"
    })
    top50: boolean = false;

    @property({
        tooltip: "(開關)Slot道具卡"
    })
    item: boolean = false;

    @property({
        tooltip: "(開關)每日任務"
    })
    mission: boolean = false;

    @property({
        tooltip: "(開關)競賽通知"
    })
    mail: boolean = false;

    @property({
        tooltip: "(開關)魚機道具卡"
    })
    card: boolean = false;

    @property({
        tooltip: "(開關)廠商客製參數"
    })
    agent: boolean = false;

    @property({
        tooltip: "(開關)排行榜"
    })
    rankboard: boolean = false;

    @property({
        tooltip: "(開關)Slot收集碎片活動"
    })
    debris: boolean = false;

    @property({
        tooltip: "(開關)Tada等級系統"
    })
    level: boolean = false;

    @property({
        tooltip: "(開關)返回大廳按鈕顯示"
    })
    backToLobbyBtn: boolean = true;

    // 請選直版、橫版、或可直橫版自由切換(auto尚有bug)
    @property({
        tooltip: "遊戲適配方向",
        type: Enum(Orientation)
    })
    orientation: Orientation = Orientation.Portrait;

    // 例如21:9輸入21/9    16:9輸入16/9
    @property({
        tooltip: "遊戲最高長短邊比"
    })
    screenLongSideRate: number = 21 / 9;

    // 例如16:9輸入9/16    例如16:10輸入10/16
    @property({
        tooltip: "遊戲最高短長邊比"
    })
    screenShortSideRate: number = 9 / 16;

    // 遊戲場景預設短邊長度
    @property({
        tooltip: "遊戲場景短邊長度"
    })
    screenShortSideSize: number = 640;

    // 遊戲場景預設長邊長度
    @property({
        tooltip: "遊戲場景長邊長度"
    })
    screenLongSideSize: number = 1136;


    // ----------------------------------------------------------------
    // 共用包和遊戲包   皆以bundle的方式讀取
    // ----------------------------------------------------------------

    @property({
        tooltip: "共用Bundle名稱"
    })
    commonBundleName: string = "common";

    @property({
        tooltip: "遊戲包Bundle名稱"
    })
    gameBundleName: string = "";

    @property({
        tooltip: "遊戲Prefab路徑"
    })
    gamePrefabPath: string = "";


    // ----------------------------------------------------------------
    // loading頁要顯示的東西
    // ----------------------------------------------------------------

    @property({
        type: Prefab,
        tooltip: "特色loading頁Prefab(Jili)"
    })
    featureLoadingPrefab_Jili: Prefab = null;

    @property({
        type: Prefab,
        tooltip: "特色頁第一頁Prefab"
    })
    featurePage1Prefab: Prefab = null;

    @property({
        type: Prefab,
        tooltip: "特色頁第二頁Prefab"
    })
    featurePage2Prefab: Prefab = null;

    @property({
        type: Prefab,
        tooltip: "遊戲主Icon的Prefab"
    })
    iconPrefab: Prefab = null;

    @property({
        type: SpriteFrame,
        tooltip: "特色loading頁背景圖"
    })
    bgSpr: SpriteFrame = null;

    @property({
        tooltip: "辣椒度"
    })
    hardNums: number = 0;

    @property({
        tooltip: "有幾種特色遊戲可以試玩"
    })
    hasFeatureCnt: number = 0;

    @property({
        tooltip: "使用遠程公版(實驗性功能)"
    })
    remote: boolean = false;

    loading: Node = null;
    private loadingProgressF_comm = 0;
    private loadingProgressT_comm = 0;
    private loadingProgressF_game = 0;
    private loadingProgressT_game = 0;
    private isLoadingEnd = false;
    private isPreLoadingTimerEnd = true;
    private isPreLoadingImgLoaded = false;

    commonBundle: AssetManager.Bundle = null;
    gameBundle: AssetManager.Bundle = null;
    commonPrfab: Prefab = null;
    gamePrefab: Prefab = null;

    onLoad() {
        this.send96Log();
        // 偷偷存起來用
        globalThis.temp_Lang = this.getQuery('lang') || (BUILD? 'en-US' : 'zh-CN');
        globalThis.temp_Brand = this.getBrandType();
        globalThis.temp_GameBundleName = this.gameBundleName;

        // 特色loading頁初始化
        this.loading = instantiate(this.featureLoadingPrefab_Jili);
        this.loading.parent = this.node.parent;
        this.loading.emit("init", this);

        // ios全螢幕滑動設置
        // this.initSwipeScreen();

        // 開始搂幫斗
        this.loadBundle();

        // 畫布產生旋轉或逆向的時後  事件座標改寫  for 3.6.2
        if (this.isH5Mode()) {
            input["_touchInput"]["_getLocation"] = (touch: globalThis.Touch, canvasRect: Rect) => {
                let isFrameRevert = document.getElementById('Cocos3dGameContainer').style.transform == 'rotate(180deg)'
                let isFrameRotated = document.getElementById('GameDiv').style.transform == 'rotate(90deg)'
                let x = touch.clientX - canvasRect.x;
                let y = canvasRect.y + canvasRect.height - touch.clientY;
                if (isFrameRotated) {
                    if (isFrameRevert) {
                        const tmp = x;
                        x = y;
                        y = canvasRect.width - tmp;
                    }
                    else{
                        const tmp = x;
                        x = canvasRect.height - y;
                        y = tmp;
                    }
                }
                const dpr = screen.devicePixelRatio;
                x *= dpr;
                y *= dpr;
                return new Vec2(x, y);
            }
        }

        // 禁止出現網頁滾動條
        document.body.style.overflow = "hidden";

        // 檢查 LOGO 關閉時間
        if (BUILD && !sys.isNative) {
            this.isPreLoadingTimerEnd = false;
            let t1 = window['logoTimer'] ?? 0;
            let t2 = Math.max(2500 - (Date.now() - t1), 0);
            setTimeout(() => {
                this.isPreLoadingTimerEnd = true;
                this.closePreLoading();
            }, t2);
        }
    }

    onDestroy() {
        globalThis.temp_Lang = null;
        globalThis.temp_Brand = null;
        globalThis.temp_GameBundleName = null;
    }

    update() {
        if (this.isLoadingEnd) {
            // noting
        }
        else if (this.commonPrfab && this.gamePrefab) {
            // 讀取prefab完成  固定95%
            if (this.loading) this.loading.emit("setLoadingProgress", 95);
            this.loadPrefabEnd();
            this.isLoadingEnd = true;
        }
        else {
            let f = (this.loadingProgressF_comm + this.loadingProgressF_game);
            let t = Math.max((this.loadingProgressT_comm + this.loadingProgressT_game), 1);
            let targetPercent = 100 * f / t * 0.9;
            if (this.loading) this.loading.emit("setLoadingProgress", targetPercent);
        }
    }

    // 關閉Jili或TaDa黑色Loading頁
    private closePreLoading(){
        if(this.isPreLoadingImgLoaded && this.isPreLoadingTimerEnd){
            let page = document.getElementById('LogoPage');
            if (page) page.style.display = 'none';
        }
    }

    // 開始讀取bundle  包含共用包和遊戲包
    async loadBundle() {
        let lobbyData = globalThis.LobbyData;

        // 共用 bundle 資訊
        let bundleName = this.commonBundleName;
        let version = "";
        if (lobbyData) {
            version = lobbyData.versionJson[bundleName];
            bundleName = lobbyData.bundleDomin + bundleName;
        }

        if (this.remote) {
            const versionRegex = /(\d+)\.(\d+)/
            const matches = VERSION.match(versionRegex)
            const version = `${matches[1]}.${matches[2]}`

            let host = `https://${window.location.host}/`
            let project = 'annin'
            let env = 'web-mobile'

            if (sys.isNative) {
                env = 'android'
            }

            if (lobbyData) {
                host = lobbyData.cdnHost
            }

            let ipFirst = /^http(s)?:\/\/([0-9]{1,3}\.){3}[0-9]{1,3}(:[0-9]+)?\/.*?$/
            if (host.indexOf('localhost') != -1 || ipFirst.test(host) == true) {
                host = 'https://test-wbgame.jlfafafa3.com/'
                project = 'annind'
            }
            if (this.serverPrefix == ServerPrefix.Real){
                host = 'https://test-wbgame.jlfafafa3.com/'
                project = 'annind'
            }

            // 嘗試取得公版資訊
            assetManager.loadRemote(`${host}${project}/${version}/${env}/assets/versions.json?${(Date.now() / 600).toFixed(0)}`, { reload: true, cacheAsset: false, cacheEnabled: false }, async (err, assert: JsonAsset) => {
                if (sys.isNative) {
                    assetManager.downloader.downloadScript(`${host}${project}/${version}/${env}/src/chunks/bundle.${assert.json["bundle.js"]}.js`, { systemJs: true }, (error, res) => {
                        if(error) {
                            console.log("load bundle error", error)
                        } else {
                            assetManager.loadBundle(`${host}${project}/${version}/${env}/assets/annin`, { version: assert.json["annin"] }, (err, bundle) => {
                                this.commonBundle = bundle
                                this.loadGameBundle()
                            })
                        }
                    })
                } else {
                    // @ts-ignore
                    await System.import(`${host}${project}/${version}/${env}/src/chunks/bundle.${assert.json["bundle.js"]}.js`)

                    // 讀取遠端公版
                    assetManager.loadBundle(`${host}${project}/${version}/${env}/assets/annin`, { version: assert.json["annin"] }, (err, bundle) => {
                        this.commonBundle = bundle
                        this.loadGameBundle()
                    })
                }
            })
        } else {
            // 讀取共用 bundle
            assetManager.loadBundle(bundleName, { version: version }, (err, bundle) => {
                if (err) { console.warn(err); return; }
                this.commonBundle = bundle;

                this.loadGameBundle()
            });
        }
    }

    loadGameBundle() {
        // 遊戲 bundle 資訊
        let bundleName = this.gameBundleName;
        let version = "";
        let lobbyData = globalThis.LobbyData;
        if (lobbyData) {
            version = lobbyData.versionJson[bundleName];
            bundleName = lobbyData.bundleDomin + bundleName;
        }

        // 讀取遊戲 bundle
        assetManager.loadBundle(bundleName, { version: version }, (err, bundle) => {
            if (err) { console.warn(err); return; }
            this.gameBundle = bundle;

            // loading頁的動態下載圖片和字串表要優先載完  才開始載其他資源
            let langComps = this.node.parent.getComponentsInChildren(GreedyLangImg);
            let langImgCnt = 1 + langComps.length;
            langComps.forEach(langImg => {
                langImg.loadSpriteFrame(()=>{
                    langImgCnt --;
                    if(langImgCnt <= 0){
                        this.loadPrefab();
                    }
                })
            });
            this.loadLoadingLangTxt(this.gameID, ()=>{
                langImgCnt --;
                if(langImgCnt <= 0){
                    this.loadPrefab();
                }
            })
        });
    }

    loadLoadingLangTxt(gameID: number, endCB: Function){
        let fileName = gameID ? gameID.toString() : "Common";
        assetManager.loadAny({ dir: "lang/loadingLangs/" + fileName, bundle: this.commonBundle.name }, { priority: 9 }, (err, jsonAssets: BufferAsset) => {
            if (err || !jsonAssets || !jsonAssets.buffer) {
                if(gameID == 0){
                    // 讀不到字串表了直接放給他過
                    endCB();
                }
                else{
                    // 改讀預設字串表
                    this.loadLoadingLangTxt(0, endCB);
                }
                return; 
            }
            
            globalThis.temp_LangTable = JSON.parse(new TextDecoder().decode(jsonAssets.buffer()));
            this.node.parent.getComponentsInChildren(GreedyLangTxt).forEach(g => g.loadString());
            endCB();
        })

    }

    loadPrefab(){
        this.isPreLoadingImgLoaded = true;
        this.closePreLoading();

        // 開始讀取共用資源
        this.commonBundle.load("prefeb/main/Common", Prefab, (finished: number, total: number) => {
            this.loadingProgressF_comm = finished;
            this.loadingProgressT_comm = total;
        }, (err, prefab) => {
            if (err) { console.warn(err); return; }
            this.commonPrfab = prefab;
        });

        // 開始讀取遊戲資源
        this.gameBundle.load(this.gamePrefabPath, Prefab, (finished: number, total: number) => {
            this.loadingProgressF_game = finished;
            this.loadingProgressT_game = total;
        }, (err, prefab) => {
            if (err) { console.warn(err); return; }
            this.gamePrefab = prefab;
        });
    }

    // 共用和遊戲資源讀取完成  放上場景且自動觸發登入流程
    loadPrefabEnd() {
        let appNode = instantiate(this.commonPrfab);
        appNode.parent = this.node.parent;
        appNode.emit("Init", this);
    }

    /**
     * 確認版本
     */
    getBrandType() {
        let id = 0;
        let idStr = this.getQuery('apiId');
        let gs = this.getQuery('domain_gs');
        let tadaSkinStr = this.getQuery('tadaSkin');
        if (idStr != '') {
            id = Number(idStr);
        }

        let skin = this.getQuery('skin');
        if (skin && skin != "") {
            // 新流程全吃平台參數
            return Number(skin);
        }
        else {
            // 舊流程
            if (id >= 200 && id < 300) {
                if (id == 202) return 3;
                else return 2;
            }
            else if (id == 301) {
                return 4
            }
            else if (id == 3 || gs.toLowerCase().indexOf('adat') >= 0 || tadaSkinStr == "1") {
                // tada
                return 1
            }
            else {
                // jili
                return 0
            }
        }
    }

    /**
     * 取得網址
     */
    getUrl(): string {
        if (!!globalThis.LobbyData === true) {
            return globalThis.LobbyData.url ?? '';
        }
        return location.href ?? '';
    }

    /**
     * 取得網址列參數
     * @param url 完整網址
     * @param key 要搜尋的參數關鍵字
     */
    getQuery(key: string): string {
        let url = this.getUrl();
        if (url.indexOf('?') === -1)
            return ''

        let tok = url.split('?')[1].split('&')
        for (let i = 0, len = tok.length; i < len; ++i) {
            if (tok[i].split('=')[0] === key)
                return tok[i].split('=')[1]
        }
        return ''
    }

    /**
     * ios全螢幕滑動初始化
     */
    initSwipeScreen() {
        let ss = this.node.addComponent(SwipeScreen);
        ss.Init(this.orientation == Orientation.Landscape, this.orientation == Orientation.Portrait);
    }

    /**
     * 發送96號log
     */
    send96Log() {
        if (!!globalThis.URLSearchParams === false)    // native 不支援
            return;

        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get("domain_platform")) return;
        let report = "https://" + urlParams.get("domain_platform").split("").reverse().join("") + "/webservice/event/trigger";
        let params = "?EventID=96&GameVersion=-1&EventStatus=0&BrowserSystem=-1&DeviceSystem=-1&AccountID=-1&ApiId=" + urlParams.get('apiId') + "&SSOKey=" + urlParams.get('ssoKey') + "&GameID=" + this.gameID + "&CreateTime=" + new Date()
        if (urlParams.get('demo') != "true") {
            let xhr = new XMLHttpRequest();
            xhr.open('get', report + params);
            xhr.send();
        }
    }

    /**
     * 是否是H5模式
     */
    isH5Mode() {
        return !sys.isNative;
    }
    
    /**
     * 是否是另開的webview
     */
    isWebView(){
        if (!navigator)
            return false;
    
        let useragent = navigator.userAgent;
        let rules = ['WebView', '(iPhone|iPod|iPad)(?!.*Safari\/)', 'Android.*(wv|\.0\.0\.0)'];
        let regex = new RegExp(`(${rules.join('|')})`, 'ig');
        return Boolean(useragent.match(regex)).valueOf();
    }

}