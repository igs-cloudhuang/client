
/**
 * 金額緩衝區名稱
 */
export enum bufferType {
    Reward = 'Reward',           // 獲獎，這裡進出的值會列入淨值計算
    RewardTemp = 'RewardTemp',   // 獲獎，不列入淨值計算
    Bet = 'Bet',                 // 下注，這裡進出的值會列入淨值計算
    BetTemp = 'BetTemp',         // 下注，不列入淨值計算
    Item = 'Item',               // 隨便用
    Bullet = 'Bullet',           // 隨便用
    Hit = 'Hit',                 // 隨便用
}

/**
 *  金流管理員，用來管理籌碼相關運算

    // 錢包分為client端和server端
    // server端的錢包是當前金流正確的狀況
    // client端的錢包有buffer，會將server端的錢扣掉buffer的錢，才是用戶看到顯示的錢

    // 情境範例
    // 玩家擁有1000元，玩家押注10元，server回傳押注結果，押注成功並贏得100元，最後財產1090元

    private uid = 1234  // 玩家ID
    // 財產同步(初始財產共用層已放入錢包)
    getWallet(remain: number = 1000){   // 初始財產1000
        // server錢包是真實財產
        walletManager.setServerRemains(this.uid, remain);     
    }

    // 玩家押注
    spin(){
        let bet = 10;
        // 發送押注請求
        this.sendShootReq() 
        // 押注額扣在緩衝區內，意思等同於client錢包會扣錢
        walletManager.buffering(walletManager.bufferType.Bet, this.uid, bet);   
        // 呼叫此方法會觸發Bus.event.UpdateWallet事件，遊戲端可以藉此刷新財產顯示
        walletManager.updateClientRemains(this.uid);   // 遊戲顯示玩家剩1000-10=990元
    }

    // 收到server押注回傳
    spinAck(bet: number = 10, reward: number = 100, remain: number = 1090){
        // 同步server錢包
        walletManager.setServerRemains(this.uid, remain);    
        // 刪除先前緩衝區內的押注額
        walletManager.buffering(walletManager.bufferType.Bet, this.uid, -bet);
        // 緩衝區內放入獲獎金額   
        walletManager.buffering(walletManager.bufferType.Reward, this.uid, reward);  
        // 刷新財產顯示  目前是server錢包1090元  緩衝區100元 
        walletManager.updateClientRemains(this.uid);   // 遊戲顯示玩家剩1090-100=990元 
    }

    // 表演結束獲得獎金
    showRewardEnd(reward: number = 100){
        // 刪除先前緩衝區內的獲獎金額
        walletManager.buffering(walletManager.bufferType.Reward, this.uid, -reward);  
        // 刷新財產顯示 
        walletManager.updateClientRemains(this.uid);   // 最終顯示玩家1090元 
    }


    
    // 其他
    // getClientRemains()	取得玩家現在顯示財產
    // getServerRemains()	取得玩家真實財產
    // clearBuffers()		清空玩家錢包緩衝區

    // addServerRemains()	直接加錢
    // 有時候server沒帶remain下來，但玩家有獲得錢，就需要直接對server錢包加錢
    // 例如: 使用道具卡、平台補幣
    // 但這種做法不推薦，用多了容易金流錯誤
 */
export interface WalletManager {

    myUserID: number

    net: number

    /**
     * 初始化
     */
    init(userID: number, wallet: any) 

    /**
     * 往金額緩衝區放錢
     * 玩家顯示金額為 Server 金額 - 緩衝區金額
     */
    buffering(bufferType: string, userID: number, coin: number)

    /**
     * 每次 server 同步金額時要設定一次
     */
    setServerRemains(userID: number, coin: number)

    /**
     * 平台補幣時調用 | 特殊流程時調用
     */
    addServerRemains(userID: number, coin: number)

    /**
     * 更新 client 當前剩餘金額
     */
    updateClientRemains(userID: number)

    /**
     * 取得 client 當前顯示金額
     */
    getClientRemains(userID: number): number

    /**
     * 取得 server 當前金額
     */
    getServerRemains(userID: number): number

    /**
     * 清除 client 當前金額的資料 (userID: -1 表示清除全部 client 當前金額的資料)
     */
    clearClientRemains(userID?: number)

    /**
     * 清除 server 當前金額的資料 (userID: -1 表示清除全部 server 當前金額的資料)
     */
    clearServerRemains(userID?: number)

    /**
     * 清除金額緩衝區 (userID: -1 表示清除全部 user 的金額緩衝區)
     */
    clearBuffers(userID?: number)

    /**
     * 清除指定金額緩衝區 (userID: -1 表示清除全部 user 的指定金額緩衝區)
     */
    clearBuffer(bufferType: string, userID?: number)

    /**
     *  設定顯示是否要多小數點幾位
     *  @param num 多幾位小數點  正常為0
     */
    SetExtraShowDot(num: number)

    
    /**
     *  取得整體數值放大倍率
     */
    get ratio(): number

    /**
     *  取得籌碼匯率
     */
    get rate(): number

    /**
     *  取得當前貨幣數
     */
    get coin(): number

    /**
     *  設定當前貨幣數
     */
    set coin(c: number)

    /**
     *  取得籌碼符號
     */
    get coinTypeStr(): string

    /**
     *  取得籌碼類型
     */
    get currency(): number

    /**
     *  數字依照幣種顯示標準化 
     */
    FormatCoinNum(num: number, forceShowDot?: boolean, forceDotCnt?: number): string

    /**
     * 將數字自動轉換成 M | K 位顯示(不足1k則無變化)  123 -> 123    1230 -> 1.23K
     * 數字部分照原多幣別小數點規則顯示
     */
    FormatCoinNum_MK(num: number, forceShowDot?: boolean): string
}

let node: WalletManager
export function UpdateWallet() {
    node = Annin.Wallet
}
export { node as walletManager }