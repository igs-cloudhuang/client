import { _decorator, Component, Node, ProgressBar, Animation, Button, Label, UITransform, clamp01, UIOpacity, tween, equals } from 'cc';
import { i18nManager, toastManager } from 'db://annin-framework/manager';
import { SceneEvent } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

const autoCastTime = 180;

@ccclass('RetainMgr')
export default class RetainMgr extends Component {

    @property(Node)
    barNode: Node = null;

    public meteorS: number = 0;                             // server 給的累積值
    public meteor: number = 0;                              // client 計算的累積值
    public currValue: number = 0;                           // mapping 到 0 ~ 1 的累積值
    private progressBar: ProgressBar = null;             // progressBar
    private progressBarAnim: Animation = null;           // progressBar
    private shootBtn: Button = null;                     // 發射按鈕
    private efNode1: Node = null;                        // 特效1
    private addEfNode: Node = null;                      // 增加計量的特效
    private addEfDiffY: number = 0                          // 增加計量的特效的寬度預乘值
    private countdownText: Label = null;                 // 倒數文字
    private refreshLock: boolean = false;                   // 是否鎖住updateByBet的入口
    private countdown: number = autoCastTime;               // CD
    private fingerNode: Node = null;                     // 手指提示

    private animStatus: number = 0;                         // 0: idle, 1: full
    private bInit: boolean = false;


    
    onLoad () {
        Game.retainMgr = this;
    }

    onDestroy() {
        Game.retainMgr = null;
    }

    /**
     * 免費彈頭初始化
     * @param type 2=黃金彈 3=核彈
     * @param meteor 累積值
     */
    init(meteor: number = 0){
        this.bInit = true;
        this.meteor = meteor;
        this.progressBar = this.barNode.getChildByName('EnergyBarNew_02').getComponent(ProgressBar);
        this.progressBarAnim = this.barNode.getComponent(Animation);
        this.shootBtn = this.barNode.getChildByName('ShootBtn').getComponent(Button);
        // this.efNode1 = this.barNode.getChildByName('EnergyBarNew_01').getChildByName('Dot_1').getChildByName('1316-3');
        this.addEfNode = this.barNode.getChildByName('Slider');
        this.addEfDiffY = this.progressBar.node.getChildByName('EnergyBarNew_03').getComponent(UITransform).contentSize.height;
        this.countdownText = this.barNode.getChildByName('CD_label').getComponent(Label);
        this.fingerNode = this.barNode.getChildByName('Finger');

        this.progressBarAnim.play('EnergyIcon_Idle');
        this.animStatus = 0;
        // this.updateByBet(comm.gameCtrl.getTurret()?.getBet());
        // this.addEfNode.getComponent(Animation).play();
    }

    /**
     * 更新進度條
     * @param p 0~1的進度值
     */
    setProgress(p: number) {
        this.currValue = clamp01(p);
        this.refreshUI();
    }

    // 更新進度條和相關介面
    refreshUI() {
        if (!this.bInit) return

        let o_currValue = (this.compare(this.progressBar.progress, 0))? 0:(this.compare(this.progressBar.progress, 1))? 1:(this.progressBar.progress-0.01)/0.98;
        if (this.meteorS >= Game.main.getTurret()?.getBet() * 30) {  // this.currValue >= 1.0
            this.progressBar.progress = 1;
            this.addEfNode.angle = 0;
            if (this.animStatus != 1) {
                this.progressBarAnim.stop()
                this.progressBarAnim.play('EnergyIcon_Full');
                this.animStatus = 1;
            }
            this.fingerNode.active = true;
        }
        else{
            this.progressBar.progress = (this.compare(this.currValue, 0))? 0:(this.currValue*0.98)+0.01;
            this.addEfNode.angle = -360 * this.progressBar.progress;
            // 防止奇怪的bug導致該停的動畫沒停
            if (this.animStatus != 0) {
                this.progressBarAnim.stop()
                this.progressBarAnim.play('EnergyIcon_Idle');
                this.animStatus = 0;
            }
            // this.shootBtn.node.active = false;
            this.fingerNode.active = false;
            // 增加進度條的短暫特效
            if(o_currValue!=this.currValue || this.currValue>=1){
                // this.addEfNode.stopAllActions();
                this.addEfNode.getComponent(UIOpacity).opacity = 150;
                tween(this.addEfNode.getComponent(UIOpacity))
                .to(0.5, { opacity: 0 })
                .start()
            }
        }
    }

    update(dt: number){
        if(this.meteor == 0) return;
        if (this.meteorS >= Game.main.getTurret()?.getBet() * 30) {
            // 顯示倒數時間
            if (this.countdown > 0 && this.countdown <= 60.9) {
                this.countdownText.node.active = true;
                this.countdownText.string = (this.countdown | 0).toString();
            }
            if (this.countdown <= 0.0) {
                this.shoot()
            }
            this.countdown -= dt;
        }
        else {
            this.countdownText.node.active = false;
            this.countdown = autoCastTime;
        }
    }

    /**
     * 發射免費彈頭
     */
    shoot(){
        let turret = Game.main.getTurret();
        if (!turret) {
            return
        }

        if (turret.isLocked()) {
            return
        }

        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
            return
        }
        
        if (this.meteorS < Game.main.getTurret()?.getBet() * 30) {  // this.currValue < 1.0
            toastManager.showText(`${i18nManager.getString(331)}`);
            return;
        }
        Game.main.readyToShootRetain();
    }

    getProgress(): number {
        return this.currValue;
    }

    isFull(){
        return this.compare(this.getProgress(), 1);
    }
    
    // 按 bet 刷新當前的進度條
    updateByBet(bet: number, meteor?: number) {
        if(this.refreshLock) return;
        if(meteor) this.setMeteor(meteor);
        let p = Math.min(this.calcProgressByBet(bet), 1.0);
        this.setProgress(p);
    }

    // 計算各 bet 的進度值
    calcProgressByBet(bet: number): number {
        let k = 0.9032210234;
        let x = (this.meteor / bet) / 30;  // (累積值 / bet) / hits count
        return k * Math.atan(2 * x);
    }

    /**
     * 設定免費彈頭UI隱藏
     * @param toggle 是否隱藏
     */
    hide(toggle: boolean){
        // comm.uiCtrl.freeBombNode.opacity = toggle? 0 : 255;
    }

    compare(a: number, b: number): boolean{
        return equals(a, b);
    }

    cleanProgress(){
        let cleanUp = (dt) => {
            let p = clamp01(this.currValue - dt);
            this.setProgress(p ** 1.1);

            if (this.currValue <= 0) {
                this.unschedule(cleanUp);
                this.refreshLock = false;
            }
        }

        // 倒退撸
        this.setMeteor(0);
        this.meteorS = 0;   // 清空 server 的進度值
        this.refreshLock = true;
        this.schedule(cleanUp, 0);
    }

    setMeteor(num: number){
        this.meteor = num;
        // comm.app.getPlayer().dragon = num;
    }

    getMeteor() {
        return this.meteor;
    }

    setMeteorS(num: number){
        this.meteorS = num;
        // comm.app.getPlayer().dragon = num;
    }

    isInit() {
        return this.bInit;
    }
}
