import { Component, Node, Size, SpriteFrame } from "cc"
import { levelProto } from 'db://lobby_ingame_ui/proto/levelProto/levelservice'

/**
 * 請看 README-TW.md
 */

// 大廳端需要實做這個interface
export interface LobbyCommonType {
    getCommonGameLayout?: () => LobbyIngameUiDefine.CommonGameLayout | null;
    readonly CommonGameLayout: LobbyIngameUiDefine.CommonGameLayout;
    readonly Bridge: Node;
    LocaleString: LobbyIngameUiDefine.LocaleString;
    /**LobbyBridge事件的定義 */
    BridgeEvent: BridgeEventType;
    RewardType: RewardType;
}

export let AppLobby: LobbyCommonType;

export interface LobbyDataType {
    /** 遊戲網址,與web版的解析方式相同 */
    url?: string,
    /** CDN網址*/
    cdnHost?: string,
    /** 遊戲bundle的網址,供遊戲自行loadBundle用 */
    bundleDomin?: string,
    /** 遊戲bundle的版本號,供遊戲自行loadBundle用 */
    versionJson?: object,
    /** 大廳的ID */
    lobbyID?: number,
    /** 是否為靜音 */
    mute?: boolean,
    /** 背包系統相關設定 */
    backpack?: {
        /** 使用道具卡ID */
        itemindex?: number
        /** 印度棋牌道具卡ID*/
        itemindexPoker?: number
        /** buff道具卡ID*/
        itemindexBuff?: Long
    },
    /** 是否開啟免費贈金 */
    freeWin?: boolean;
    /** 是否從PWA開啟的 */
    pwa?: boolean,
    /** 頭像編號 */
    avatarNo?: number,
    /** 是否隱藏會員等敏感資訊 */
    isHideMember?: boolean,
    /** 返回大廳要跳轉的網址(僅限webview版遊戲) */
    backUrl?: string,
    /** 是否為新手 */
    newBie?: boolean,
    /** slot:跳過特色導覽&play按鈕,直接表演開頭 */
    skipFeature?: boolean,
    /**要開啟的教學 */
    teachType?: string,
    /** 是否開啟highRoller */
    highRoller?: boolean,
}

interface BridgeEventType {
    /** 遊戲通知大廳直橫轉換 */
    GAME_ROTATION: string
    /** 遊戲通知大廳離開遊戲 */
    GAME_CLOSE_SELF: string
    /** 遊戲通知大廳載入完成,可以移除常駐loading頁 */
    GAME_LOADING_COMPLETE: string
    /** 遊戲通知大廳返回按鈕是否顯示/隱藏 */
    GAME_SET_BACKBTN_VISIBLE: string
    /** 遊戲通知大廳完成新手押注(Jili City) */
    GAME_SET_NOVICE: string
    /** 遊戲通知大廳顯示專用跑馬燈(Jili City) */
    GAME_MARQUEE: string
    /** 遊戲通知大廳天bar加錢(Mini Game專用) */
    GAME_ADD_COIN: string
    /** 遊戲通知大廳打開歷程頁(Mini Game專用) */
    GAME_OPEN_HISTORY: string
    /** 遊戲通知大廳請求共用天bar(Tada Casino) */
    GAME_GET_COMMON_LAYOUT: string
    /** 大廳通知遊戲即將關閉遊戲 */
    LOBBY_CLOSE_GAME: string
    /** 遊戲通知大廳關閉準備完成,可以返回大廳了 */
    GAME_CLOSE_END: string
}

export interface BuffData {
    id?: Long,
    idx?: Long,
    gameId?: number,
    buffName?: string,          // 1.卡片名稱
    gameName?: string,          // 2.系統or遊戲名稱
    desc1?: string,             // 3.條件或參數顯示
    desc2?: string,             // 3.條件或參數顯示
    usageTimeDesc?: string      // 4.可用時間字串
    info?: string,              // 5.完整描述
    expiredTime?: number,       // 過期時間戳記
    startTime?: number,         // 可使用開始時間戳記
    jumpToGameID?: number,      // 不為0的情形需要跳轉遊戲
    updateUsable?: Function,    // 刷新可否使用資料
    usable?: boolean,           // 當前可否使用
    reason?: string,            // 當前不可使用的原因
    amount?: number,            // 數量
}

interface RewardType {
    Coin: number,
    Rubby: number,
    /**要從背包找卡時使用,使用時value必須是背包的itemindex,一般是購買結果使用 */
    BackPackItem: number,
    /**value為 itemId */
    SlotItem: number,
    /**value為 itemId */
    FishItem: number,
    FishSkin: number,
    VipPoint: number,
    /**主題任務票 */
    EventPoint: number,
    /**主題任務能量 */
    EventEnergy: number,
    /**收集卡片 */
    AlbumCard: number,
    /**收集卡冊完成獎勵 */
    AlbumReward: number,
    /**收集完成獎勵 */
    BookReward: number,
    /**挑戰任務點數 */
    ChallengePoint: number,
    /**Buff */
    Buff: number,
    /**轉蛋券 */
    GachaTicket,
};

export function init() {
    AppLobby = globalThis.LobbyCommon;
}

export namespace LobbyIngameUiDefine {
    export interface LocaleString {
        getString(no: string, ...args): string;
    }
    /**
     * 主要顯示UI
     */
    export interface CommonGameLayout extends Component {
        /**事件定義 */
        EventType: {
            /**天bar開始打開 */
            TOP_BAR_SHOW_START: string
            /**天bar打開完畢 */
            TOP_BAR_SHOW_END: string,
            /**儲值完成 */
            IAP_CONSUME_COMPLETE: string,
        }

        /**
         * 直橫轉換,此UI會自行判斷
         * @param gameSize 遊戲真正顯示的畫面大小
         */
        onResize(gameSize?: Size): void

        /**
         * 顯示整體in game的UI
         */
        show(): void

        /**
         * 隱藏整體in game的UI
         */
        hide(): void

        /**
         * 回傳VIP等級
         */
        getVipLv(): number | undefined;

        /**
         * 展開天bar
         * @param sec 自動展開秒數,0為不收起,不填入則是大廳自訂自動收起時間(5秒)
         */
        shopTopBar(sec?: number): void;

        /**
         * 大廳表演主流程
         * 所有大廳相關的表演都會集中在這裡
         * 遊戲端需要在Idle期間不斷呼叫此方法，沒表演會立即釋放，有表演會卡住
         */
        showLobbyPerformance(): Promise<any>;

        /**
         * 回報需要給大廳知道的資料,也許以後會更多,先用物件做參數
         * @param data 資料
         * @param data.coin - 目前財產
         * @param data.exp - 押注所獲得的經驗量(原值,讓大廳自行計算buff加乘)
         * @param data.canIAP - 是否能夠開啟天bar儲值/禮包介面(設定立刻生效)
         * @param data.bet - 設定的押注額
         */
        reportData(data: { coin?: number, exp?: number, canIAP?: boolean, bet?: number }): void;

        /**
         * 設定取得玩家等級請求的連線方法
         * @param func 
         */
        setGetLevelDataFunc(func: () => Promise<levelProto.LevelServiceResp>): void;

        /**
         * Queue住獲得獎勵資料  等showLobbyPerformance時才表演
         * @param data 獎勵資料(多筆)
         * @param subTitle 獎勵表演的副標題文字
         * @param endCb 表演完回調
         */
        setReward(dataList: { data: { type: number, amount: number, value?: number, value2?: number, value3?: number, value4?: Long } }[], subTitle?: string, endCb?: Function): void;


        //  ------------Buff相關API----------------

        /**
         * 初始化Buff系統
         * @param gameId 遊戲ID
         * @param subGameGetUnUseBuffFunc 子遊戲取得未使用BUFF清單連線方法  須回傳結果
         * @param subGameGetUseBuffFunc 子遊戲取得已使用BUFF清單連線方法  須回傳結果
         * @param subGameUseBuffFunc 子遊戲使用BUFF清單連線方法  須回傳結果
         * @param subGameGetBuffInfoFunc 子遊戲取得特定BUFF資料連線方法  須回傳結果
         */
        initBuffSystem(
            gameId: number,
            subGameGetUnUseBuffFunc: () => Promise<any>,
            subGameGetUseBuffFunc: () => Promise<any>,
            subGameUseBuffFunc: (id: Long, idx: Long) => Promise<any>,
            subGameGetBuffInfoFunc: (buffIDList: Long[]) => Promise<any>): void;

        /**
         * 取得Buff卡  會回傳道具卡形式資料
         */
        getAllBuffCardData(): BuffData[];

        /**
         * 取得buff卡片顯示節點 
         * @param cardId  Buff ID
         * @param cnt  數量
         */
        getBuffCardNode(cardId: Long, cnt?: number): Node

        /**
         * 使用Buff
         * @param id Buff ID
         * @param idx Buff IDX
         */
        useBuff(id: Long, idx: Long): void;

        /**
         * 強制結束buff
         * @param idx Buff IDX
         */
        forceBuffEnd(idx: Long)
    }
}