// ----------------------------------------------------------------
// 說明
// ----------------------------------------------------------------

// 由於此架構並沒有第二段loading，所以並沒有真的loading任何東西

// 1.透過init()帶入各項參數，可以在遊戲初始階段進入特色loading頁
// 2.注意特色遊戲需要使用相同的存檔命名`Features_S${i}_${gameid}`   i最小為1

// ----------------------------------------------------------------
// 說明結束
// ----------------------------------------------------------------

import { Animation, Camera, Component, instantiate, Label, Layout, Node, PageView, ProgressBar, ResolutionPolicy, screen, size, Sprite, sys, Toggle, UITransform, view, Widget, _decorator } from "cc";
import { BUILD } from "cc/env";
import { Entry, Orientation } from "./Entry";

const { ccclass, property } = _decorator;

@ccclass
export default class LoadingPage extends Component {

    @property(Camera)
    camera: Camera = null;

    @property(Node)
    rootNd: Node = null;

    @property(ProgressBar)
    hardBar: ProgressBar = null;

    @property(Toggle)
    checkToggle: Toggle = null;

    @property(PageView)
    pageView: PageView = null;

    @property([Node])
    pageNds: Node[] = [];

    @property(Node)
    featureBtn: Node = null;

    @property(Node)
    featurePageRBtn: Node = null;

    @property(Node)
    featurePageLBtn: Node = null;

    @property(Sprite)
    bgSpr: Sprite = null;

    @property(Node)
    iconNd: Node = null;

    @property(ProgressBar)
    loadingBar: ProgressBar = null;

    @property(Label)
    loadingRateTxt: Label = null;

    private isLandscape: boolean = null;    // 直橫版
    private entry: Entry = null;
    

    onLoad() {
        view.on('canvas-resize', this.onRotate, this);
        this.node.on("init", this.init, this);
        this.node.on("setLoadingProgress", this.setLoadingProgress, this);
        this.node.on("transToCommon", this.transToCommon, this);
        this.node.on("loadComplete", this.loadComplete, this);

        // 解析度縮放
        let designSize = view.getDesignResolutionSize();
        let scale = 1;
        let maxLine = Math.max(designSize.width , designSize.height);
        let minLine = Math.min(designSize.width , designSize.height);
        let rate = 16 / 9;
        if(maxLine / minLine > rate){
            // 畫面比較長  以短邊為標準縮放
            scale = minLine / 640;
        }
        else{
            // 畫面比較短  以長邊為標準縮放
            scale = maxLine / 1136;
        }
        this.rootNd.setScale(scale, scale);
    }

    start() {
        this.onRotate();
    }

    onDestroy() {
        view.off('canvas-resize', this.onRotate, this);
    }

    update(dt: number) {
        if (this.entry.featurePage2Prefab && this.featurePageRBtn) {
            this.featurePageRBtn.active = this.pageView.getCurrentPageIndex() == 0;
            this.featurePageLBtn.active = this.pageView.getCurrentPageIndex() == 1;
        }

        if (this.targetProgress > this.loadingBar.progress) {
            if (this.targetProgress >= 1) {
                this.loadingBar.progress = 1
            } else {
                let diff = this.targetProgress - this.loadingBar.progress
                if (diff > 0.005) {
                    diff = (diff - 0.005) * 0.05 + 0.005
                }
                this.loadingBar.progress += diff
            }
            this.loadingRateTxt.string = Math.ceil(this.loadingBar.progress * 100) + "%";
        }
    }

    /**
     * 建立特色loading
     * @param entry 入口元件
     */
    init(entry: Entry) {
        this.entry = entry;

        // 特色遊戲入口
        this.featureBtn.active = false;

        // 套入各項資源
        if (this.entry.featurePage1Prefab) {
            instantiate(this.entry.featurePage1Prefab).parent = this.pageNds[0];   // 第一頁特色說明
            this.pageNds[0].walk(node => node.layer = this.pageNds[0].layer) // 特色說明的prefab做層級防呆

        }
        if (this.entry.featurePage2Prefab) {
            instantiate(this.entry.featurePage2Prefab).parent = this.pageNds[1];   // 第二頁特色說明
            this.pageNds[1].walk(node => node.layer = this.pageNds[1].layer) // 特色說明的prefab做層級防呆
        }
        else {
            // 沒有第二頁的情形  不顯示切換箭頭  取消滑動
            this.featurePageRBtn.active = false;
            this.featurePageLBtn.active = false;
            this.pageView.enabled = false;
        }

        if (this.entry.bgSpr)
            this.bgSpr.spriteFrame = this.entry.bgSpr;
        (this.entry.hardNums > 0) ? (this.hardBar.progress = (this.entry.hardNums / 5)) : (this.hardBar.node.parent.active = false);
        if (this.entry.iconPrefab)
            instantiate(this.entry.iconPrefab).parent = this.iconNd;   // icon節點
        this.iconNd.walk(node => node.layer = this.iconNd.layer) // 特色說明的prefab做層級防呆
        this.node.getComponents(Animation)[0].play("Loading");

    }

    // 切換特色分頁
    onPageBtnClick(_, data: string) {
        if (!this.featurePageRBtn) return;
        if (data == "right") {
            this.pageView.scrollToPage(1, 0.8);
            this.featurePageRBtn.active = false;
            this.featurePageLBtn.active = true;
        }
        else {
            this.pageView.scrollToPage(0, 0.8);
            this.featurePageRBtn.active = true;
            this.featurePageLBtn.active = false;
        }
    }

    private targetProgress: number = 0;
    // 設定讀取%數
    setLoadingProgress(p: number) {
        this.targetProgress = p / 100;
    }

    // 共用的資源已經讀上場景   此loading節點要轉移到共用層內
    transToCommon(targetNode: Node) {
        this.node.setRotationFromEuler(0, 0, 0);
        this.node.parent = targetNode;
        targetNode.walk(node => node.layer = targetNode.layer)
        this.camera.node.active = false;
    }

    // 全部讀取完成
    loadComplete() {
        if (!this.node.active) return;
        // 已勾選過不再顯示
        let save = sys.localStorage.getItem("Loading_Dont_Show_" + this.entry.gameID);
        if (save) {
            this.close();
            return;
        }
        this.node.getComponents(Animation)[0].play("LoadEnd");
    }

    // 點擊確認
    onConfirmClick() {
        if (this.checkToggle.isChecked) {
            sys.localStorage.setItem("Loading_Dont_Show_" + this.entry.gameID, "true");
        }
        else {
            sys.localStorage.removeItem("Loading_Dont_Show_" + this.entry.gameID);
        }
        this.close();
    }

    // 進入特色模式
    onFeatureClick() {
        this.node.emit("PlayFeatureGame");
        this.close();
    }

    // 關閉特色loading頁
    close() {
        this.node.emit("CloseLoadingPage");
        this.node.destroy();
    }

    isShowing() {
        return this.node.active;
    }

    // 直橫版切換
    onRotate() {
        if (!this.entry) return
        let design_size = view.getDesignResolutionSize();  // 設計尺寸
        let frame_size = size(   // 視窗像素尺寸
            screen.windowSize.width / screen.devicePixelRatio,
            screen.windowSize.height / screen.devicePixelRatio
        );
        let isLandscape = this.entry.orientation == Orientation.Landscape || (this.entry.orientation == Orientation.Auto && (frame_size.width > frame_size.height));

        if (this.isLandscape != isLandscape) {
            this.isLandscape = isLandscape;
            if (isLandscape) view.setDesignResolutionSize(Math.max(design_size.width, design_size.height), Math.min(design_size.width, design_size.height), ResolutionPolicy.SHOW_ALL);
            else view.setDesignResolutionSize(Math.min(design_size.width, design_size.height), Math.max(design_size.width, design_size.height), ResolutionPolicy.SHOW_ALL);
            design_size = view.getDesignResolutionSize();  // 設計尺寸重取

            this.node.getComponents(Animation)[1].play(this.isLandscape ? "LandscapeRotate" : "PortraitRotate");
            this.node.getComponents(Animation)[1].once(Animation.EventType.FINISHED, ()=>{
                // 因為有改scale  這裡有奇怪的bug必須這樣切換一次才會顯示正確
                this.pageView.content.getComponent(Layout).affectedByScale = false;
                this.pageView.content.getComponent(Layout).affectedByScale = true;
                this.pageView.content.getComponent(Layout).updateLayout();
            })
        }

        let ratio_frame = frame_size.width / frame_size.height;
        let ratio_design = design_size.width / design_size.height;

        // 真正要顯示的size
        let newSize = design_size.clone();
        // Native的情形修正場景大小和實際遊戲設計解析度的落差
        let screenScale = 1;
        if(sys.isNative){
            screenScale = Math.max(this.entry.screenShortSideSize / Math.min(newSize.width, newSize.height), this.entry.screenLongSideSize / Math.max(newSize.width, newSize.height))
            newSize.width *= screenScale;
            newSize.height *= screenScale;
        }

        let isOverLeftRight = (ratio_frame > ratio_design); // 不包含相等
        let isOverTopBottom = (ratio_frame < ratio_design); // 不包含相等

        // 左右超出 DesignResolution 範圍
        if (isOverLeftRight === true) {
            let max_ratio = (isLandscape === true) ? this.entry.screenLongSideRate : this.entry.screenShortSideRate;
            let now_ratio = ratio_frame;
            let max_width = design_size.height * max_ratio;
            let now_width = design_size.height * now_ratio;

            newSize.height = design_size.height;
            newSize.width = Math.floor(Math.min(now_width, max_width));
        }

        // 上下超出 DesignResolution 範圍
        if (isOverTopBottom === true) {
            let max_ratio = (isLandscape === true) ? this.entry.screenShortSideRate : this.entry.screenLongSideRate;
            let now_ratio = (1 / ratio_frame);
            let max_height = design_size.width * max_ratio;
            let now_height = design_size.width * now_ratio;

            newSize.height = Math.floor(Math.min(now_height, max_height));
            newSize.width = design_size.width;
        }
        this.node.getComponent(UITransform).setContentSize(newSize);
        this.node.getComponentsInChildren(Widget).forEach(w => w.updateAlignment());
            
        /**
         * 修正遊戲畫面顛倒
         * 1.鎖定直版時   手機往左倒
         * 2.鎖定橫版時   手機左右倒
         * 以上兩種情形遊戲畫面會顛倒   特別做引擎層畫面旋轉
         */
        if (this.isH5Mode()){
            let isFrameRotated = 
               (this.entry.orientation == Orientation.Portrait && document.getElementById('GameDiv').style.transform == 'rotate(90deg)' && window.orientation != -90) ||
               (this.entry.orientation == Orientation.Landscape && document.getElementById('GameDiv').style.transform == 'rotate(90deg)' && (window.orientation == 90 || window.orientation == -90))
            if (isFrameRotated) {
                document.getElementById('Cocos3dGameContainer').style['-webkit-transform'] = 'rotate(180deg)';
                document.getElementById('Cocos3dGameContainer').style.transform = 'rotate(180deg)';
            }
            else {
                document.getElementById('Cocos3dGameContainer').style['-webkit-transform'] = 'rotate(0deg)';
                document.getElementById('Cocos3dGameContainer').style.transform = 'rotate(0deg)';
            }
        }

        // 攝影機適配
        let camera = this.camera;
        let winSize = screen.windowSize;
        camera.orthoHeight = winSize.height * screenScale / view.getScaleY() / 2;

    }

    /**
     * 是否是H5模式
     */
    isH5Mode() {
        return !sys.isNative || this.isWebView();
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