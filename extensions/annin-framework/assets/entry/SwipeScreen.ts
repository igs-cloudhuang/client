import { Component, sys, _decorator, Node, UITransform, Button, Size, screen as AA } from "cc";
import { BUILD } from "cc/env";

const { ccclass, property } = _decorator;

class iOSDevice
{
    constructor(
        public name: string,
        public height: number,
        public width: number,
        public ratio: number,
        public statusHeight: number,
        public homeHeight: number
    ) { }
}

const deviceList: iOSDevice[] = [
    new iOSDevice( "iPhone 6.5-inch", 896, 414, 3, 44, 34 ),
    new iOSDevice( "iPhone 6.1-inch", 896, 414, 2, 44, 34 ),
    new iOSDevice( "iPhone 5.8-inch", 812, 375, 3, 44, 34 ),
    new iOSDevice( "iPhone 5.5-inch", 736, 414, 3, 18, 0 ),
    new iOSDevice( "iPhone 4.7-inch", 667, 375, 2, 20, 0 ),
    new iOSDevice( "iPhone 4-inch", 568, 320, 2, 20, 0 ),
    new iOSDevice( "iPhone 3.5-inch", 480, 320, 2, 20, 0 ),
    new iOSDevice( "iPhone(Legacy) & iPod Touch", 480, 320, 1, 20, 0 ),
    new iOSDevice( "iPad Pro 12.9-inch", 1366, 1024, 2, 20, 0 ),
    new iOSDevice( "iPad Pro 10.5-inch", 1112, 834, 2, 20, 0 ),
    new iOSDevice( "iPad 9.7-inch Retina", 1024, 768, 2, 20, 0 ),
    new iOSDevice( "iPad", 1024, 768, 1, 20, 0 ),
    new iOSDevice( "iPad Mini Retina", 1024, 768, 2, 20, 0 ),
    new iOSDevice( "iPad Mini", 1024, 768, 1, 20, 0 ),
]

const HtmlId = {
    BackGround: "mask",
    CloseTip: "mask_close_tip",
    Close: "mask_close",
    Bar: "bar",
}

const CloseContent = {
    tw: [ '滑動無效時, 請點擊此處進入遊戲. ❎', '請解除豎排方向鎖定, 並將手機水平放置.' ],
    cn: [ '滑动无效时, 请点击此处进入游戏. ❎', '请解除竖排方向锁定, 并将手机水平放置.' ],
    th: [ 'เมื่อสไลด์ไม่ถูกต้อง กรุณาคลิกที่นี่เพื่อเข้าสู่เกม ❎', 'โปรดทำการปลดล็อกรูปแบบทิศทาง เพื่อสามารถเปลี่ยนรูปแบบทิศทางตามระดับโทรศัพท์ได้' ],
    vn: [ 'Nếu không thể lthao tác, hãy chạm vào đây để vào game. ❎', 'Hãy mở khóa xoay hướng, đồng thời xoay ngang màn hình.' ],
    id: [ 'Klik di sini untuk masuk ke permainan, ketika tidak bisa di scroll. ❎', 'Silakan buka kunci posisi vertikal, dan letakkan telepon seluler secara horizontal.' ],
    mm: [ 'When the slide is invalid, please click here. ❎', 'Please unlock the vertical direction and place the phone horizontally.' ],
    jp: [ 'スライドで入れない場合は、ここをタップしてください。 ❎', '垂直固定を解除し、端末を水平方向に置いてください。' ],
    en: [ 'If swiping does not work, please tap here. ❎', 'Please unlock screen rotation and hold the phone horizontally.' ],
}

const Lang = {
    tw: [ "tw", "zh-TW" ],
    cn: [ "cn", "zh-CN" ],
    en: [ "en", "en-US" ],
    th: [ "th", "th-TH" ],
    vn: [ "vn", "vi-VN" ],
    id: [ "id", "id-ID" ],
    hi: [ "hi", "hi-IN" ],
    ta: [ "ta", "ta-IN" ],
    mm: [ "mm", "my-MM" ],
    jp: [ "jp", "ja-JP" ]
};

declare let LobbyData: {
    url?: string,
    bundleDomin?: string,
    versionJson?: object,
    lobbyID?: number,
    mute?: boolean,
    pwa?: boolean
};

const apiId: number[] = [
    1131
]

@ccclass
export default class SwipeScreen extends Component
{
    /**
     * 是否為鎖定橫版
     */
    private isLandscape: boolean = false;

    /**
     * 是否為鎖定直版
     */
    private isPortrait: boolean = false;

    /**
     * IOS是否開啟滑動功能
     */
    private isIOS: boolean = true;

    /**
     * 安卓是否開啟功能
     */
    private isAndroid: boolean = true;

    private android_Apiid: number[] = [];

    private m_mask: Node = null;
    private m_isScrolling: boolean = false;
    private isblock: boolean = false;
    private m_scrollInterval: number;
    private m_scrollTimeOut: number;
    private m_backGround: HTMLDivElement = null;
    private m_isLandscape: boolean = true;

    GetDeviceName(): string
    {
        if ( sys.os === sys.OS.IOS )
        {
            let device = this.GetiOSDevice();
            if ( device )
            {
                return device.name;
            }
        }
        else if ( sys.os === sys.OS.ANDROID )
        {
            const regex = /Mozilla\/5.0\s*\([^\(\)]*?(Android[^\(\)]*?);\s*([^\(\)]*?)\)/g;
            let m = regex.exec( navigator.userAgent );
            if ( m )
            {
                if ( m.length > 2 )
                {
                    return m[ 2 ].split( ' Build' )[ 0 ];
                }
            }
        }
        return 'unknown';
    }

    private CreateHtmlTag()
    {
        if ( this.m_backGround )
        {
            return;
        }
        this.node.active = true;
        let body = document.body;
        body.style.overflow = "visible";  //body不啟用(內容會被修剪，但不會顯示捲軸，當超出元素的範圍時隱藏內容)。

        /**
         * container(內容會被修剪，但不會顯示捲軸，當超出元素的範圍時隱藏內容)
         * container(將cocos容器改為固定元素)
         */
        let container = document.getElementById( "Cocos3dGameContainer" );
        container.style.overflow = "hidden";
        container.style.position = "fixed";

        let bar = document.createElement( "div" );
        bar.id = HtmlId.Bar;
        bar.style.position = "absolute";
        bar.style.height = "100vh";

        let backGround = document.createElement( "div" );
        backGround.id = HtmlId.BackGround;
        // backGround.className = "mask";
        backGround.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        backGround.style.height = "150vh";
        backGround.style.width = "100vw";
        backGround.style.zIndex = "99";
        backGround.style.display = "none";
        backGround.style.position = "absolute";
        backGround.style.top = "0%";
        backGround.style.left = "0%";
        this.m_backGround = backGround;

        let closeTip = document.createElement( "div" );
        closeTip.id = HtmlId.CloseTip;
        closeTip.style.width = "70vw";
        closeTip.style.top = "28vh";
        closeTip.style.left = "50vw";
        closeTip.style.transform = "translate(-50%, -50%)";
        closeTip.style.fontSize = "18px";
        closeTip.style.fontWeight = "bold";
        closeTip.style.color = "#FFFFFF";
        closeTip.style.position = "fixed";

        let divStyle1 = document.createElement( "div" );
        divStyle1.style.top = "16vh";
        divStyle1.style.left = "50vw";
        divStyle1.style.transform = "translate(-50%, -50%)";
        divStyle1.style.position = "fixed";

        let close = document.createElement( "div" );
        close.id = HtmlId.Close;
        close.style.width = "90vw";
        close.style.fontSize = "24px";
        close.style.fontWeight = "bold";
        close.style.color = "#EEE8AA";
        close.style.wordWrap = "break-word";

        let divStyle2 = document.createElement( "div" );
        divStyle2.style.fontSize = "48px";
        divStyle2.style.fontWeight = "bold";
        divStyle2.style.color = "#EEE8AA";

        let svg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
        svg.style.width = "150px";
        svg.style.height = "150px";
        svg.style.position = "fixed";
        svg.style.top = "75vh";
        svg.style.left = "50vw";
        svg.style.transform = "translate(-50%, -50%)";
        svg.style.animationDuration = "2s";
        svg.style.animationName = "fullscreen-swipe";
        svg.style.animationIterationCount = "infinite";

        let cssAnimation = document.createElement( 'style' );
        let rules = document.createTextNode( '@keyframes fullscreen-swipe {' + 'from { top:80% }' + 'to { top:50% }' + '}' )
        cssAnimation.appendChild( rules );
        svg.appendChild( cssAnimation );

        svg.setAttribute( "viewBox", "0 0 547.371 547.371" );
        let path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
        path.setAttribute( "fill", "#FFFFFF" );
        path.setAttribute( "d", "M136.623,52.13v164.027l-23.875,23.877c-54.503,54.479-54.503,143.151,0,197.627l57.317,57.292c33.806,33.808,78.743,52.416,126.521,52.416c98.658,0,178.912-80.254,178.912-178.911V208.522c0-28.752-23.381-52.131-52.156-52.131c-10.713,0-20.695,3.258-28.984,8.836c-7.143-20.308-26.51-34.902-49.211-34.902c-10.713,0-20.695,3.26-28.984,8.838c-7.141-20.307-26.509-34.901-49.21-34.901c-9.487,0-18.402,2.555-26.065,7.012V52.132c0-28.75-23.38-52.131-52.131-52.131C160.003,0.001,136.623,23.38,136.623,52.13z M214.845,52.13v169.425c0,7.192,5.839,13.032,13.033,13.032s13.033-5.84,13.033-13.032v-65.162c0-14.39,11.703-26.066,26.064-26.066c14.362,0,26.063,11.678,26.063,26.066v39.098c0,7.193,5.84,13.033,13.033,13.033s13.033-5.84,13.033-13.033v-13.033c0-14.389,11.703-26.063,26.064-26.063c14.363,0,26.064,11.676,26.064,26.063v26.064c0,7.192,5.84,13.033,13.033,13.033s13.033-5.841,13.033-13.033c0-14.39,11.703-26.064,26.064-26.064c14.359,0,26.064,11.676,26.064,26.064v159.938c0,84.27-68.578,152.848-152.848,152.848c-40.819,0-79.188-15.899-108.066-44.78l-57.317-57.292c-22.155-22.183-33.233-51.271-33.233-80.385c0-29.115,11.078-58.203,33.233-80.387l5.448-5.446v72.8c0,7.192,5.839,13.033,13.032,13.033c7.194,0,13.033-5.841,13.033-13.033V52.13c0-14.389,11.704-26.065,26.065-26.065C203.141,26.063,214.845,37.743,214.845,52.13z" );

        body.appendChild( backGround );
        backGround.appendChild( closeTip );
        backGround.appendChild( divStyle1 );
        svg.appendChild( path );
        backGround.appendChild( svg );
        divStyle1.appendChild( close );
        divStyle1.appendChild( divStyle2 );
        body.appendChild( bar );
    }

    /**
     * 取得網址列參數
     * @param isLandscape 是否鎖定橫版
     * @param isPortrait 是否鎖定直版
     */
    Init(isLandscape: boolean, isPortrait: boolean)
    {
        if ( sys.isNative ) { return; }
        this.isLandscape = isLandscape;
        this.isPortrait = isPortrait;

        let pwa = false;
        if ( typeof LobbyData !== 'undefined' )
        {
            pwa = LobbyData.pwa;
        }
        // if ( sys.os == sys.OS.IOS && /iPhone OS 15/.test( window.navigator.userAgent ) )
        // {
        //     this.isIOS = false;
        // }
        let apiid = Math.floor( Number( this.GetLinkParameterByName( 'apiId' ) ) );
        if ( this.isPortrait )
        {
            // 強制直版遊戲，根據不同廠商，決定是否開啟安卓全螢幕、IOS滑動功能
            this.isblock = apiId.indexOf( apiid ) >= 0;
        }
        else if ( this.isAndroid && this.android_Apiid.length > 0 )
        {
            if ( this.android_Apiid.indexOf( apiid ) >= 0 )
            {
                this.isAndroid = false;
            }
        }
        // this.m_testLabel.node.zIndex = 9999;
        // this.m_testLabel.string = String( this.IsIOS15Version( 0 ) );

        if ( BUILD && !pwa && !this.isblock )
        {
            this.AddGameViewMask();
            if ( ( sys.os == sys.OS.IOS ) && this.IsWebview() == false && this.isIOS && false )
            {
                this.CreateHtmlTag();
                // if ( this.IsIOS15() )
                // {
                //     this.m_backGround.style.visibility = "hidden";
                // }
                this.SetCloseContent();
                this.m_backGround.style.display = "inline";


                this.SetShowMask();
                if ( this.IsChrome() == true )
                {
                    let device = this.GetiOSDevice();
                    if ( device != null )
                    {
                        const portraitHeight = ( screen.height - device.statusHeight - device.homeHeight - 20 ) * 0.99;
                        const landscapeHeight = ( screen.width - device.statusHeight - 20 ) * 0.99;

                        document.body.onresize = () =>
                        {
                            let height: number = 0;
                            if ( window.innerHeight >= window.innerWidth )
                            {
                                height = portraitHeight;
                            } else
                            {
                                height = landscapeHeight;
                            }

                            if ( height <= window.innerHeight )
                            {
                                this.HideMask();
                            } else
                            {
                                this.ShowMask();
                            }
                        }

                        // iOS 上滑全屏後, 點擊位置偏移
                        window.addEventListener( 'scroll', ( e => this.m_isScrolling = true ), { capture: false, passive: true } );
                        this.m_backGround.addEventListener( 'touchend', () => this.ScrollReset() );
                    }
                    else
                    {
                        this.HideMask();
                    }
                }
                else
                {
                    let onResize = document.body.onresize;
                    document.body.onresize = (ev) =>
                    {
                        onResize && onResize(null, null);
                        const pageWidth = document.documentElement.scrollWidth;
                        const pageHeight = document.documentElement.scrollHeight;
                        let isLandscape = pageWidth > pageHeight;
                        if ( document.getElementById( HtmlId.Bar ).clientHeight == window.innerHeight )
                        {
                            this.HideMask();
                        }
                        else
                        {
                            this.SetShowMask( isLandscape );
                        }

                        // iOS 上滑全屏後, 點擊位置偏移
                        window.addEventListener( 'scroll', ( e => this.m_isScrolling = true ), { capture: false, passive: true } );
                        this.m_backGround.addEventListener( 'touchend', () => this.ScrollReset() );
                        this.m_isLandscape = pageWidth > pageHeight;
                    }
                }
            }
            else if ( sys.os == sys.OS.ANDROID && this.IsWebview() == false && this.isAndroid )
            {
                if ( sys.browserType == sys.BrowserType.MOBILE_QQ ||
                    sys.browserType == sys.BrowserType.UC )
                {
                }
                else
                {
                    const onresize_for_android = () =>
                    {
                        if ( this.HasFullscreen() && !this.IsFullscreen() )
                        {
                            this.m_mask.active = true;
                        }
                    }
                    document.body.onresize = onresize_for_android;
                    onresize_for_android();
                }
            }
        }
    }

    private SetShowMask( isLandscape: boolean = undefined )
    {
        if ( !this.IsIOS15() )
        {
            this.ShowMask();
        }
        else
        {
            //iOS 15
            if ( isLandscape === undefined )
            {
                //一開始先初始化設定
                const pageWidth = document.documentElement.scrollWidth;
                const pageHeight = document.documentElement.scrollHeight;
                this.m_isLandscape = pageWidth > pageHeight;

                if ( this.m_isLandscape )
                {
                    //橫版
                    if ( !this.IsIOS15Version( 0 ) && !this.IsIOS15Version( 1 ) &&
                        !this.IsIOS15Version( 2 ) && !this.IsIOS15Version( 3 ) )
                    {
                        //iOS 15.4以上
                        this.m_backGround.style.visibility = "visible";
                        this.m_mask.active = true;
                    }
                    else
                    {
                        this.m_backGround.style.visibility = "hidden";
                        this.m_mask.active = false;
                    }
                }
                else
                {
                    //直版
                    if ( this.IsIOS15Version( 0 ) || this.IsIOS15Version( 1 ) ||
                        this.IsIOS15Version( 2 ) || this.IsIOS15Version( 3 ) )
                    {
                        this.m_backGround.style.visibility = "visible";
                        this.m_mask.active = true;
                    }
                    else
                    {
                        this.m_backGround.style.visibility = "hidden";
                        this.m_mask.active = false;
                    }
                }
            }
            else
            {
                document.getElementById( HtmlId.Bar ).clientHeight + " " + window.innerHeight;
                if ( isLandscape !== this.m_isLandscape || document.getElementById( HtmlId.Bar ).clientHeight !== window.innerHeight )
                {
                    //直橫改變
                    if ( isLandscape )
                    {
                        //橫版
                        if ( !this.IsIOS15Version( 0 ) && !this.IsIOS15Version( 1 ) &&
                            !this.IsIOS15Version( 2 ) && !this.IsIOS15Version( 3 ) )
                        {
                            //iOS 15.4以上
                            this.m_backGround.style.visibility = "visible";
                            this.m_mask.active = true;
                        }
                        else
                        {
                            this.m_backGround.style.visibility = "hidden";
                            this.m_mask.active = false;
                        }
                    }
                    else
                    {
                        //直版
                        if ( this.IsIOS15Version( 0 ) || this.IsIOS15Version( 1 ) ||
                            this.IsIOS15Version( 2 ) || this.IsIOS15Version( 3 ) )
                        {
                            this.m_backGround.style.visibility = "visible";
                            this.m_mask.active = true;
                        }
                        else
                        {
                            this.m_backGround.style.visibility = "hidden";
                            this.m_mask.active = false;
                        }
                    }
                }
            }
        }
    }

    private SetCloseContent()
    {
        let lang: string = this.GetLang( 'lang' );
        lang = this.ChangeLang( lang );
        const mask_close = document.getElementById( HtmlId.Close );
        const mask_close_tip = this.isLandscape ? document.getElementById( HtmlId.CloseTip ) : null;
        if ( CloseContent[ lang ] )
        {
            mask_close.textContent = CloseContent[ lang ][ 0 ];
            mask_close_tip && ( mask_close_tip.textContent = CloseContent[ lang ][ 1 ] );
        }
        else
        {
            mask_close.textContent = CloseContent[ Lang.en[ 0 ] ][ 0 ];
            mask_close_tip && ( mask_close_tip.textContent = CloseContent[ Lang.en[ 0 ] ][ 1 ] );
        }

        if ( !mask_close.onclick )
        {
            mask_close.onclick = () =>
            {
                this.HideMask();
            };
        }
    }

    private GetLang( name: string ): string
    {
        let url: string = sys.localStorage.getItem( 'LobbyLanguage' );
        if ( !url || url == '' )
        {
            if ( typeof LobbyData !== 'undefined' )
            {
                url = LobbyData.url;
            }
            else
            {
                url = window.location.href;
            }
            if ( url.indexOf( '?' ) != -1 )
            {
                let ary = url.split( '?' )[ 1 ].split( '&' );
                for ( let index = 0; index < ary.length; index++ )
                {
                    if ( ary[ index ].split( '=' )[ 0 ] == name )
                    {
                        return ary[ index ].split( '=' )[ 1 ];
                    }
                }
            }
            return Lang.en[ 0 ];
        }
        return url;
    }

    private ChangeLang( lang: string ): string
    {
        switch ( lang )
        {
            case Lang.tw[ 1 ]:
                return Lang.tw[ 0 ];
            case Lang.cn[ 1 ]:
                return Lang.cn[ 0 ];
            case Lang.th[ 1 ]:
                return Lang.th[ 0 ];
            case Lang.vn[ 1 ]:
                return Lang.vn[ 0 ];
            case Lang.id[ 1 ]:
                return Lang.id[ 0 ];
            case Lang.hi[ 1 ]:
                return Lang.hi[ 0 ];
            case Lang.ta[ 1 ]:
                return Lang.ta[ 0 ];
            case Lang.mm[ 1 ]:
                return Lang.mm[ 0 ];
            case Lang.jp[ 1 ]:
                return Lang.jp[ 0 ];
            default:
                return Lang.en[ 0 ];
        }
    }

    private ShowMask()
    {
        let container = document.getElementById( "Cocos3dGameContainer" );
        let div = container.getElementsByTagName( "div" );
        let index = 0;
        for ( let i = 0; i < div.length; i++ )
        {
            let iframe = div[ i ].getElementsByTagName( "iframe" );
            if ( iframe && iframe.length > 0 )
            {
                index = i;
                break;
            }
        }
        let iframe = div[ index ]
        if ( iframe && iframe.style.visibility !== "hidden" )
        {
            return;
        }

        this.m_backGround.style.visibility = "visible";
        if ( this.m_mask )
        {
            this.m_mask.active = true;
        }
        window.scrollTo( 0, -200 );

        if ( this.m_scrollInterval )
        {
            clearInterval( this.m_scrollInterval );
        }
        this.m_scrollInterval = setInterval( () =>
        {
            if ( this.m_isScrolling )
            {
                this.m_isScrolling = false;
                this.ScrollReset();
            }
        }, 250 );
    }

    private ScrollReset()
    {
        window.scrollTo( 0, -200 );
        if ( this.m_scrollTimeOut )
        {
            clearTimeout( this.m_scrollTimeOut );
        }
        this.m_scrollTimeOut = setTimeout( () =>
        {
            window.scrollTo( 0, -200 );
            clearInterval( this.m_scrollInterval );
            this.m_scrollInterval = null;
        }, 250 );
    }

    private HideMask()
    {
        window.scrollTo( 0, -200 );
        if ( this.m_backGround )
        {
            this.m_backGround.style.visibility = "hidden";
        }
        this.scheduleOnce( () =>
        {
            if ( this.m_mask )
            {
                AA.windowSize = new Size(window.innerWidth, window.innerHeight)
                this.m_mask.active = false;
            }
        }, 0.0 );
    }

    private AddGameViewMask()
    {
        let scene = this.node.parent;
        if ( this.m_mask || scene.getChildByName( "ScrollForMask" ) )
        {
            if ( !this.m_mask && scene.getChildByName( "ScrollForMask" ) )
            {
                this.m_mask = <any>scene.getChildByName( "ScrollForMask" );
            }
            return;
        }
        this.m_mask = new Node("ScrollForMask");
        this.m_mask.addComponent(UITransform).setContentSize( new Size( 2000, 2000 ) );
        this.m_mask.addComponent( Button );
        this.m_mask.active = false;
        this.m_mask.parent = scene;

        //擋全螢幕後會觸發到其他元件的touch事件
        this.m_mask.on( Node.EventType.TOUCH_END, ( event ) =>
        {
            if ( ( sys.os == sys.OS.IOS ) && this.IsWebview() == false )
            {
                let mask = this.m_backGround;
                if ( mask && mask.style.visibility == "hidden" )
                {
                    this.m_mask.active = false;
                }
            }
            else if ( sys.os == sys.OS.ANDROID && this.IsWebview() == false )
            {
                this.Fullscreen();
            }
        } );
    }

    private IsWebview(): boolean
    {
        let useragent = navigator.userAgent;
        let rules = [ 'WebView', '(iPhone|iPod|iPad)(?!.*Safari\/)', 'Android.*(wv)' ];
        let regex = new RegExp( `(${rules.join( '|' )})`, 'ig' );
        return Boolean( useragent.match( regex ) );
    }

    private IsChrome(): boolean
    {
        return /CriOS/.test( navigator.userAgent );
    }

    private GetiOSDevice(): iOSDevice
    {
        for ( let device of deviceList )
        {
            if ( screen.height === device.height && screen.width === device.width && window.devicePixelRatio === device.ratio )
            {
                return device;
            }
        }
        return null
    }

    private HasFullscreen(): boolean
    {
        let fullscreenEnabled =
            document[ 'fullscreenEnabled' ] ||
            document[ 'mozFullScreenEnabled' ] ||
            document[ 'webkitFullscreenEnabled' ] ||
            document[ 'msFullscreenEnabled' ];
        return fullscreenEnabled != null;
    }

    private IsFullscreen(): boolean
    {
        let fullscreenElement =
            document[ 'fullscreenElement' ] ||
            document[ 'webkitFullscreenElement' ] ||
            document[ 'mozFullScreenElement' ] ||
            document[ 'msFullscreenElement' ];
        return fullscreenElement != null;
    }

    private Fullscreen()
    {
        let launchFullScreen =
            document.documentElement.requestFullscreen ||
            document.documentElement[ 'webkitRequestFullscreen' ] || /* Chrome, Safari and Opera */
            document.documentElement[ 'mozRequestFullScreen' ] || /* Firefox */
            document.documentElement[ 'msRequestFullscreen' ]; /* IE/Edge */
        let exitFullScreen =
            document.exitFullscreen ||
            document[ 'webkitExitFullscreen' ] ||
            document[ 'mozCancelFullScreen' ] ||
            document[ 'msExitFullscreen' ];

        if ( this.HasFullscreen() )
        {
            if ( this.IsFullscreen() )
            {
                exitFullScreen.call( document );
            }
            else
            {
                launchFullScreen.call( document.documentElement );
            }
        }
        else
        {
            console.log( 'not support fullscreen.' )
        }
        this.m_mask.active = false;
    }

    private GetLinkParameterByName( name: string )
    {
        let url = window.location.href;
        name = name.replace( /[\[\]]/g, '\\$&' );
        let regex = new RegExp( '[?&]' + name + '(=([^&#]*)|&|#|$)' ),
            results = regex.exec( url );
        if ( !results ) return null;
        if ( !results[ 2 ] ) return '';
        return decodeURIComponent( results[ 2 ].replace( /\+/g, ' ' ) );
    }

    private IsIOS15(): boolean
    {
        return sys.os == sys.OS.IOS && /iPhone OS 15/.test( window.navigator.userAgent );
    }

    private IsIOS15Version( version: number ): boolean
    {
        return sys.os == sys.OS.IOS && window.navigator.userAgent.search( `iPhone OS 15_${version}` ) !== -1;
    }
}
