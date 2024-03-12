import { _decorator, Component, Node, Vec3, log } from 'cc';
import { soundManager } from 'db://annin-framework/manager';
import { Comm } from 'db://annin-framework/system/comm';
import { SceneEvent, SoundName } from './GameDefine';
import Game from '../system/Game';

/**
 * 射擊冷卻時間 (射擊間隔)
 */
const CoolDown = {
    normal: 0.33
};

const { ccclass, property } = _decorator;

@ccclass('ShootMgr')
export default class ShootMgr extends Component {

    // @property([Prefab])
    // aimNodes: Prefab[] = [];                            // 自動/鎖定的凖心

    isTorpedo: boolean = false;                            // 是否開啟魚雷功能
    isAutoMatic: boolean = false;                          // 是否開啟智能捕魚功能
    isAlreadyAutoMatic: boolean = false;                   // 是否已開啟智能捕魚功能

    torpedoHitCount: number = 3;                           // 魚雷的hit/bet數

    private shootPosFL: Vec3 = Vec3.ZERO;            // 瞄準位置(魚層)
    private shootCircle: number = CoolDown.normal;         // 累積時間
    private isPressed: boolean = false;                    // 是否點擊
    private isHoldOff: boolean = false;                    // 是否放開

    private lockFishNode: Node = null;                  // 鎖定的魚
    private bulletId: number = 0;                          // 子彈的流水號

    // private lockAnim: Animation = null;                 // 鎖定動畫
    // private lockNode: Node = null;                      // 鎖定節點
    // private touchNode: Node = null;                     // 觸碰節點
    // private aimUINode: Node = null;                     // 鎖定圖示的圖層

    private speedDiff: number = 0;                         // 射擊加速

    private autoMaticFishIDList: number[] = [];            // 智能捕魚的fish ID

    private pressTime: number = 0;

    onLoad() {
        Game.shootMgr = this;
    }

    start() {
        // this.aimUINode = find('AimUI', Game.node.playerLayer);
        // this.touchNode = instantiate(this.aimNodes[0]);
        // this.touchNode.parent = this.aimUINode;
        // this.touchNode.active = false;

        // this.lockNode = instantiate(this.aimNodes[1]);
        // this.lockNode.parent = this.aimUINode;
        // this.lockNode.active = false;

        // this.lockAnim = this.lockNode.getComponent(Animation);
        // this.lockAnim.defaultClip = this.lockAnim.clips[0];
        // this.lockAnim.on(Animation.EventType.FINISHED, () => {
        //     let clips = this.lockAnim.clips;
        //     this.lockAnim.play(clips[1].name);
        // });
    }

    onDestroy() {
        Game.shootMgr = null;
    }

    update(dt: number) {
        // 更新射擊的間隔時間
        this.shootCircle -= dt;

        // 更新鎖定圖示的位置 (需要先檢查鎖定魚的節點是否存在)
        // if (this.lockFishNode) {
        //     if (this.lockFishNode.parent) {
        //         this.lockNode.setPosition(this.getAimPosition(this.lockFishNode));
        //     }
        //     else {
        //         this.lockNode.active = false;
        //         this.lockFishNode = null;
        //     }
        // }

        let turret = Game.main.getTurret();
        if(!turret) return;

        if (this.shootCircle > 0 || turret.isLocked()) {
            Game.uiCtrl.setStartBtnInteractable(false);
        } else {
            Game.uiCtrl.setStartBtnInteractable(true);
        }

        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
            if (this.isPressed && this.shootCircle <= 0.0 && !turret.isLocked()) {
                this.pressTime += dt;
            } else {
                this.pressTime = 0;
            }

            if (this.shootCircle <= 0.0 && !turret.isLocked()) {
                turret.playPowerEfk([1]);
                if (this.pressTime > 0) {
                    turret.playPowerEfk([2]);
                    if (this.pressTime >= 1) {
                        turret.playPowerEfk([3]);
                    }
                }
                if (this.pressTime >= 2 || this.isAutoMatic) {
                    this.isHoldOff = true;
                    this.pressTime = 0;
                }
                if (this.isHoldOff) {
                    this.isHoldOff = false;
                    this.readyToShoot();
                }
            } else {
                this.isHoldOff = false;
                turret.stopPowerEfk([1, 2, 3]);
            }
        } else {
            // 子彈射擊
            if (this.shootCircle <= 0.0 && !turret.isLocked()) {
                // 智能捕魚
                if (this.autoMaticFishIDList.length > 0) {
                    if (this.searchLockFish_automatic()) {  // 連續鎖定下一隻
                        this.shootPosFL = this.getLockPosition();
                        this.readyToShoot();
                    }
                }
                // 點擊射擊
                else {
                    if (this.isPressed) {
                        this.readyToShoot();
                    }
                }
            }
        }
    }

    /**
     * 準備發射子彈
     */
    readyToShoot() {
        if (this.checkRange(this.shootPosFL)) {
            let time = CoolDown.normal;
            let turret = Game.main.getTurret();
            if (turret && !turret.isLocked()) {
                Game.main.readyToShoot(this.createBulletId(), this.shootPosFL);
            }
            this.shootCircle = this.adjustShootCircle(time);
        }
    }

    /**
     * 活動砲衣可以改變射速
     */
    adjustShootCircle(oldCircle: number): number {
        let turret = Game.main.getTurret();
        if (turret) {
            switch(turret.getCurrentAvatarNo()){
                // 以下case增加各種會增加射速的skin
                // case game.eAvatarNo.Honor:
                // case game.eAvatarNo.GoldToad:{
                //     return oldCircle * 0.9;
                // }
            }
        }
        // oldCircle -= this.speedDiff;
        return oldCircle;
    }

    /**
     * 是否點擊畫面發射
     */
    touchShoot(pressed: boolean, aimFirstTower: boolean = false) {
        let turret = Game.main.getTurret();
        if (!turret) return;

        if (this.isPressed && this.isPressed !== pressed) {
            this.isHoldOff = true;
        }
        this.isPressed = pressed;  // 是否鬆開

        if (aimFirstTower) {
            let fish = Game.fishMgr.getFishTower(0);
            if (fish) {
                this.shootPosFL = this.getLockPosition(fish.node);
                this.shootPosFL.x = 0;
            }
        }
    }

    /**
     * 檢查有無超出場景邊界
     */
    checkRange(posFL: Vec3): boolean {
        // let lowerLeft = this.border.lowerLeft;
        // if (lowerLeft.y > posFL.y || this.border.upperLeft.y < posFL.y) {
        //     return false;
        // }
        // let xdiff = (posFL.y - lowerLeft.y) * this.border.ratio;
        // return ((lowerLeft.x - xdiff) <= posFL.x && (this.border.lowerRight.x + xdiff) >= posFL.x);
        return true
    }

    /**
     * 自動/鎖定/魚雷的按鈕控制
     */
    setButtonSwitch(op: string) {
        switch (op) {
            case 'TorpedoOn': {  // 開啟魚雷
                this.isTorpedo = true;
                let turret = Game.main.getTurret();
                if (turret) turret.switchAvatar();
                break;
            }
            case 'TorpedoOff': {  // 關閉魚雷
                this.closeShootState('Torpedo');
                let turret = Game.main.getTurret();
                if (turret) turret.switchAvatar();
                break;
            }
            case 'AutoMaticOn': {  // 開啟智能捕魚
                Game.automatic.show();
                break;
            }
            case 'AutoMaticOff': {  // 關閉智能捕魚
                this.closeShootState('AutoMatic');
                Game.automatic.close();
                break;
            }
        }
    }

    /**
     * 關閉按鈕狀態
     */
    closeShootState(type?: string) {
        if (this.isTorpedo && (type == null || type == 'Torpedo')) {  // 關閉魚雷
            this.isTorpedo = false;
        }
        if (this.isAutoMatic && (type == null || type == 'AutoMatic')) {
            this.isAutoMatic = false;
            // this.lockNode.active = false;
            this.autoMaticFishIDList = [];
            this.lockFishNode = null;
            // this.lockNode.active = false;
            Game.uiCtrl.setShootCount(0);
            Game.uiCtrl.switchAutoChipState(false);
            // 檢查是否可用道具卡
            Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();

            if (this.isAlreadyAutoMatic) {
                Game.automatic.setFinished();
                this.isAlreadyAutoMatic = false;
            }
        }
    }

    /**
     * 計算鎖定點位置，顯示鎖定框
     */
    // getAimPosition(fishNode: Node) {
    //     let fishPos = v3(fishNode.position);

    //     let fish = fishNode.getComponent(Fish);
    //     let pointList = fish.getLockNode();
    //     for (let i = 0; i < pointList.length; ++i) {
    //         let newPos3D = trans3DPos(Game.node.fishLayer, pointList[i]);
    //         if (this.checkRange(v2(newPos3D.x, newPos3D.y))) {
    //             fishPos = trans3DPos(Game.fishMgr.getSpawnNode(), pointList[i]);
    //             break;
    //         }
    //     }

    //     return get3Dto2DPos(Game.cam3D, Game.camUI, fishPos);
    // }

    /**
     * 計算取得鎖定的位置 Boss 另外算，回傳魚的座標，預設取得當前鎖定魚
     */
    getLockPosition(fishNode?: Node): Vec3 {
        if (!fishNode) {
            fishNode = this.lockFishNode;
        }
        if (!fishNode) {
            log('fishNode is null.');
            return Vec3.ZERO;
        }

        // check the center of fish
        // let fishPos = comm.transPos(comm.node.fishLayer, fishNode);
        let fishPos = fishNode.position


        return fishPos;
    }
    
    /**
     * 智能補魚鎖定魚
     */
    searchLockFish_automatic() {
        let ok = false;
        let turret = Game.main.getTurret();
        if (turret) {
            if (!turret.isLocked()) {
                if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
                    let fish = Game.fishMgr.getFishTower(0);
                    if (fish) {
                        this.lockFishNode = fish.node;
                    }
                    ok = true;
                } else {
                    let fish = Game.fishMgr.getFishTower(0);
                    if (fish) {
                        let num = this.autoMaticFishIDList.findIndex(value => value == fish.getFishNo());
                        if (num == -1) {
                            Game.main.C2S_Giveup(0, [fish.getFishId()]);
                            soundManager.playEffect(SoundName.flash);
                            Game.effectMgr.playGiveup(fish);
                            Game.fishMgr.delFish(fish, false, true);
                        } else {
                            this.lockFishNode = fish.node;
                            ok = true;
                        }
                    }
                }         
            }
        }
        return ok;
    }

    /**
     * 檢查是否已經有智能捕魚，有的話先記錄起來
     * @param list 
     */
    checkAutoAndSet(list: number[]) {
        if (this.isAutoMatic) {
            this.isAlreadyAutoMatic = true;
        }
        this.setAutoFishIDList(list);
    }
    /**
     * 設定智能補魚編號列表
     * @param list 
     */
    setAutoFishIDList(list: number[]) {
        this.isAutoMatic = true;
        this.isPressed = false;
        if (list.length > 0) {
            this.autoMaticFishIDList = list;
        }
        Game.uiCtrl.switchAutoChipState(true);
        // 檢查是否可用道具卡
        Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();
    }

    /**
     * 產生新的子彈編號
     */
    createBulletId(): number {
        this.bulletId += 1;
        return this.bulletId;
    }

    /**
     * 射擊加速
     * @param value 
     */
    setSpeedDiff(value: number) {
        if (value) {
            this.speedDiff += 1 / 20 * value;
            this.speedDiff = this.speedDiff > value? value : this.speedDiff;
        } else {
            this.speedDiff = 0;
        }
    }

    /**
     * 檢查是否有足夠的射擊次數
     */
    checkShootCount(): boolean {
        let ok: boolean = false
        if (this.isAutoMatic == false) {
            ok = true
        } else {
            let num = Game.automatic.decreaseAutoShootCount();
            Game.uiCtrl.setShootCount(num);
            if (num >= 0) {
                ok = true
            } else {
                this.closeShootState('AutoMatic');
                Game.uiCtrl.switchAutoChipState(false);
            }
        }
        return ok
    }

    checkStopAutoMatic(kind: string, value: number) {
        if (this.isAutoMatic == false) {
            return
        }

        Game.automatic.checkStop(kind, value);
    }
}
