import { _decorator, Component, CCInteger, SkeletalAnimation, Node, AnimationState, Color, find, v3, tween, AnimationClip, Animation, Vec3, Tween } from 'cc';
import { easeOut, getComponentByName } from 'db://annin-framework/utils';
import { MeshCustomColor } from 'db://annin-framework/components/meshCustomColor';
import { FishNo } from './GameDefine';
import { delay } from '../system/ToolBox';
import FishSpecialShow from './FishSpecialShow';
import LeftRewardCircle from './LeftRewardCircle';
import FishSetting from './FishSetting';
import Game from '../system/Game';

type BleachValue = { bleach: number; }

const { ccclass, property } = _decorator;

@ccclass('Fish')
export default class Fish extends Component {

    @property([CCInteger])
    odds: number[] = [];                        // 倍率

    @property
    scale: number = 1;                          // 縮放

    @property([SkeletalAnimation])
    fishAnims: SkeletalAnimation[] = [];        // 骨骼動畫 (可以是多個子節點集合)

    @property(Node)
    lockNode: Node[] = [];                      // 鎖定點用

    // collider: BoxCollider = null;            // 碰撞框(todo?)
    // speedAction: Action = null;              // speed 設定動畫播放速度

    private id: number = -1;                    // 魚的流水號
    private no: number = -1;                    // 魚的編號
    private used: boolean = false;              // 使用中

    private fishSS: FishSpecialShow = null;     // 特殊魚表演
    private fishSetting: FishSetting = null;    // 設定
    protected meshCustomColor: MeshCustomColor = null;         // for 3D object opacity
    protected damagetween: Tween<BleachValue> = null;
    protected tintBase = 0;

    rewardList: LeftRewardCircle[] = [];
    fishNode: Node = null;                      // 魚本體節點

    bTowerMostBeDestroy: boolean = false;       // 
    bUp02Dead: boolean = false;                 // 是否要失衡後摔死
    bTowerFire: boolean = false;                // 塔是否要被燃燒
    bCoinDrop: boolean = false;                 // 是否要噴金幣

    bFakeDragon: boolean = false;               // 是否假冰龍
    fakeBlood: number = 0;                      // 假血量

    onLoad() {
        this.fishSS   = this.node.getComponent(FishSpecialShow);
        // this.collider = this.node.getComponent(BoxCollider);
        this.fishSetting = this.node.getComponent(FishSetting);
        this.fishNode = find('Root/FishNode', this.node);
        this.meshCustomColor = getComponentByName(this.node, MeshCustomColor) as MeshCustomColor;
    }

    /**
     * 初始化
     */
    init(id: number, no: number, lv: number) {
        this.id = id;  // 流水號
        this.no = no;  // 魚種編號
        this.enabled = true;

        // 設置狀態
        this.damageTint(false);
        // this.enableBoxCollider(true);
        // if (this.node.getNumberOfRunningActions() > 0) {
        //     this.node.stopAllActions();
        // }

        Tween.stopAllByTarget(this.node);

        this.used = true;
        this.node.angle = 0.0;
        this.node.setScale(v3(this.node.scale.x, this.node.scale.y, this.node.scale.z));

        this.postInit(lv);
    }

    /**
     * 後處理 (和魚種編號相關的設定可以寫在這)
     */
    private postInit(lv: number) {
        // 魚種相關初始化
        this.fishSetting.init(lv);

        this.node.getComponent(MeshCustomColor).opacity = 0;
        tween(this.node.getComponent(MeshCustomColor))
            .to(0.2, { opacity: 255 }, { easing: t => t * t })
            .start();
    }

    // 播放骨骼動畫
    playSkeketonAnim(no: number | string, loop: boolean = true, endCb?: Function): AnimationState {
        let st = null;
        for (let anim of this.fishAnims) {
            let clips = anim.clips;
            if (clips) {
                let name = typeof no === 'number' ? clips[no].name : no
                if (anim.getState(name)) {  // 預設第一個是游動動畫
                    st = anim.getState(name)
                    anim.play(name);
                    st.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
                    st.speed = 1.0;

                    anim.off(Animation.EventType.FINISHED);
                    if (endCb) {
                        anim.once(Animation.EventType.FINISHED, () => {
                            endCb();
                        });
                    }
                    break;
                }
            }
        }
        return st;
    }

    setSkeketonAnimSpeed(no: number | string, speed: number) {
        for (let anim of this.fishAnims) {
            let clips = anim.clips;
            if (clips) {
                let name = typeof no === 'number' ? clips[no].name : no
                if (anim.getState(name)) {  // 預設第一個是游動動畫
                    console.log('加速: ' + speed)
                    anim.getState(name).speed = speed
                    break;
                }
            }
        }
    }

    /**
     * 取得魚編號
     */
    getFishNo(): number {
        return this.no;
    }

    /**
     * 取得流水號
     */
    getFishId(): number {
        return this.id;
    }

    /**
     * 設定是否使用中
     */
    setUsed(toggle: boolean) {
        this.used = toggle;
    }

    /**
     * 是否在使用中
     */
    isUsed(): boolean {
        return this.used;
    }

    /**
     * 取得魚的倍率
     */
    getOdds(no: number): number {
        return this.odds[no];
    }

    /**
     * 取得魚的倍率
     */
     getListOdds(): number[] {
        return this.odds;
    }

    /**
     * 移除魚
     */
    destroyFish(showDeath: boolean, immediately: boolean) {
        this.damageTint(false);
        this.setRimLight(0);
        // this.enableBoxCollider(false);
        Tween.stopAllByTarget(this.node);
        this.used = false;

        // 恢復尺寸
        this.node.setScale(v3(this.scale, this.scale, this.scale));

        // 是否直接移除?
        if (immediately) {
            this.pushToPool();
            return;
        }
        // 不顯示死亡動畫 (快速淡出)
        if (!showDeath) {
            tween(this.node.getComponent(MeshCustomColor))
                .to(0.1, { opacity: 0 }, { easing: t => t * t })
                .call(() => this.pushToPool())
                .start();
        }
        // 顯示死亡動畫
        else {
            this.fishAnims.forEach(anim => anim.off(Animation.EventType.FINISHED));
            this.fishSetting.showDead();
        }
    }

    /**
     * 回收再利用
     */
    pushToPool() {
        this.used = false;
        // this.speedAction = null;
        this.node.getComponent(MeshCustomColor).opacity = 255;

        this.rewardList.length = 0;
        this.bTowerMostBeDestroy = false;
        this.bUp02Dead = false;
        this.bTowerFire = false;
        this.bCoinDrop = false;
        this.bFakeDragon = false;
        this.fakeBlood = 0;
        this.fishNode.setPosition(Vec3.ZERO);

        Game.fishMgr.removeFishFromCache(this.id);  // remove from fishMgr's cache
        Game.dataMgr.setFish(this.node);            // push to pool
    }

    /**
     * 受擊效果
     */
    damageTint(toggle: boolean, time: number = 0.25) {
        let color = this.meshCustomColor;    // 2D or 3D?
        if (color) {
            let bleachRate = 1;
            if (toggle === false) {
                this.damagetween?.stop();
                this.damagetween = null;
                color.bleach = this.tintBase;
            }
            else if (toggle === true && this.damagetween === null) {
                this.damagetween = tween(color)
                    .to(time, { bleach: bleachRate }, { easing: easeOut(2) })
                    .set({ bleach: this.tintBase })
                    .call(() => {
                        this.damagetween = null;
                        color.bleach = this.tintBase;
                    })
                    .start();
            }
        }
    }

    /**
     * 取得特殊魚表演
     */
    getSpecialShow(): FishSpecialShow {
        return this.fishSS;
    }

    /**
     * 特殊魚表演前置
     */
    specialShowReady(ack: any) {
        if (this.fishSS) {
            this.fishSS.showReady(ack);
        }
    }

    /**
     * 特殊魚表演
     */
    specialShowStart(ack: any, bOther: boolean, bUpdateSeat: boolean) {
        if (this.fishSS) {
            this.fishSS.showStart(ack, bOther, bUpdateSeat);
        }
    }

    /**
     * 特殊魚表演結束
     */
    specialShowEnd(ack: any) {
        if (this.fishSS) {
            this.fishSS.showEnd(ack);
        }
    }

    /**
     * 設置碰撞框
     */
    // setBoxCollider(offset:Vec2,size:Size) {
    //     let box = this.node.getComponent(BoxCollider);
    //     if (box) {
    //         box.offset = offset;
    //         box.size = size;
    //     }
    // }

    /**
     * 取得所有鎖定點
     */
    getLockNode() {
        return this.lockNode;
    }

    /**
     * 設定碰撞框開關
     * @param ok 
     */
    // enableBoxCollider(ok: boolean) {
    //     this.collider.enabled = ok;
    // }

    showHurt() {
        this.fishSetting.showHurt();
    }

    showFire() {
        this.fishSetting.showFire();
    }

    addIdleChoose() {
        this.fishSetting.addIdleChoose();
    }

    showPreDead() {
        this.fishSetting.showPreDead();
    }

    fogDepth(value: number) {
        this.fishSetting.fogDepth(value);
    }

    fogColor(color: Color) {
        this.fishSetting.fogColor(color);
    }

    playMoveSmoke() {
        this.fishSetting.playMoveSmoke();
    }

    setRimLight(value: number, color?: Color) {
        this.fishSetting.setRimLight(0, value, color);
    }

    hitShakeFish(times: number) {
        this.fishSetting.hitShakeFish(times);
    }

    hitMustBeBreak() {
        this.fishSetting.hitMustBeBreak();
    }

    setTowerToMaxCrack() {
        this.fishSetting.setTowerToMaxCrack();
    }

    getBreakLv() {
        return this.fishSetting.getBreakLv();
    }

    setRewardList(rwd: LeftRewardCircle) {
        this.rewardList.push(rwd);
    }

    keepRewardDel() {
        this.rewardList.forEach((reward, i) => {
            delay(reward.node, i * 0.2, () => {
                reward.closeKeep();
            });
        });
    }

    dropCoin() {
        this.fishSetting.showCoinDrops_8();
    }

    getFishSetting(): FishSetting {
        return this.fishSetting;
    }

}