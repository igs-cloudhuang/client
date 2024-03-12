import { AudioClip, Prefab } from "cc"

/**
 *  音效管理員
 * 
 *  * 強制載入模式
 *      遊戲端使用 setGameSndList() 方法置入遊戲端的音效
 *      會在全部讀取完成後，才進入遊戲，確保音效可以無延遲的撥出
 * 
 *  * 預先讀取模式
 *      1. 使用 load() 方法，在網路閒置的時候載入音效
 *      2. 使用 setMusicPath() 方法設定音樂所在資料夾
 *  
 *      音效在載入完成前播放會忽略
 *      音樂在載入完成前播放會等到載入完成後播放
 */
export interface SoundManager {
    /**
     * 初始化遊戲端的音效
     *  @param sndListPrefab 遊戲端有掛載SoundList.ts的prefab音效列表
     */
    setGameSndList(sndListPrefab: Prefab) 
    
    /**
     *  預先讀取音樂檔案
     *  @param bundle bundle 名稱
     *  @param dir 音樂資料夾路徑
     */
    load(bundle: string, dir: string) 

    /**
     *  設定音樂所在資料夾
     *  @param dir 音樂資料夾路徑
     */
    setMusicPath(dir: string) 

    /**
     *  預先讀取音樂檔案
     *  @param dir 音樂資料夾路徑
     *  @deprecated 請改用 load
     */
    preload(dir: string) 

    /**
     * 播放音樂 (同時間只能有一個音樂播放)
     *  @param name 音樂名稱/編號
     *  @param isLoop 是否重複撥放
     */
    playMusic(name: number | string, isLoop?: boolean) 

    /**
     * 停止音樂 (同時間只能有一個音樂播放)
     */
    stopMusic() 

    /**
     * 播放音效
     *  @param name 音效名稱/編號
     *  @param isLoop 是否重複撥放
     *  @param interupt 是否中斷前次撥放
     */
    playEffect(name: number | string, isLoop?: boolean, interupt?: boolean) 

    /**
     * 播放音效
     *  @param clip 音源
     *  @param name 音效名稱/編號
     *  @param isLoop 是否重複撥放
     *  @param interupt 是否中斷前次撥放
     */
    __playEffect(clip: AudioClip, name: string, isLoop?: boolean, interupt?: boolean) 

    /**
     * 停止音效
     *  @param no 音效編號
     *  @param isComm 是否是共用音效
     */
    stopEffect(no: number | string): boolean 

    /**
     *  播放短音效使用
     *  @param name 音效檔名
     */
    playOnShot(name: string) 

    /**
     * 停止全部音效
     */
    stopAllEffects() 

    /**
     * 停止播放全部音樂音效
     */
    stopAll() 
    

    /**
     * 音效撥放完的回調
     *  @param no 音效編號
     *  @param cb 回調
     */
    setEffectFinishCallback(no: number, cb: Function) 

    /**
     * 是否某首音樂播放中
     *  @param name 音效編號/名稱
     */
    checkMusicPlaying(name: number | string): boolean 

    /**
     * 開啟音樂
     *  @param toggle 開關
     */
    enableMusic(toggle: boolean) 

    /**
     * 開啟音效
     *  @param toggle 開關
     */
    enableEffect(toggle: boolean) 

    /**
     * 是否音樂開啟
     */
    isMusicEnabled(): boolean 

    /**
     * 是否音效開啟
     */
    isEffectEnabled(): boolean 

    /**
     * 頁面 | 視窗縮小時靜音
     *  @param toggle 開關
     */
    setMute(toggle: boolean) 

    /**
     * 是否靜音
     */
    IsMute(): boolean

    /**
     * 調整音量平衡
     */
    setBalance(vol: number)

    /**
     * 音樂音量
     *  @param vol 音量(0 ~ 1)
     */
    setMusicVolume(vol: number)

    /**
     * 音樂音量
     *  @param vol 音量(0 ~ 1)
     */
    setEffectVolume(vol: number) 

    /**
     * 取得音樂音量
     */
    getMusicVolume(): number 

    /**
     * 取得音效音量
     */
    getEffectVolume(): number

    /**
     *  預先讀取音樂檔案
     */
    loadClip(clip: AudioClip)
}


let node: SoundManager
export function UpdateSound() {
    node = Annin.Sound
}
export { node as soundManager }