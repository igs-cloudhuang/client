import prot from '../network/protocol/protocol.js';
import { _decorator, Vec3, v3, Component, Animation, Vec2, Node, tween, macro, Tween, v2 } from 'cc';
import { bezier3DTo, rInt, shake2D, trans3DPos } from 'db://annin-framework/utils';
import { walletManager, bufferType } from 'db://annin-framework/manager';
import { SceneEvent, EffectNo } from './GameDefine';
import { delay } from '../system/ToolBox';
import { jumpTo } from '../utils/JumpTo';
import Game from '../system/Game';

/**
 * 子彈設定
 */
const BulletSetting = {
    // speed: 170,
    speed: 1000,
    lifeTime: 120,
    destroyTime: 0,
};

export class HitData {
    bltId: number = 0;
    fishId: number[] = [];
    coin: number = 0;
    type: number = 0;
    seat: number = 0;
    bet: number = 0;
    HitPos: Vec3 = v3(0, 0, 0);
}

const { ccclass, property } = _decorator;

@ccclass('Bullet')
export default class Bullet extends Component {

    // collider: BoxCollider = null;
    anim: Animation = null;

    private isMe: boolean = false;
    private used: boolean = false;
    private owner: number = 0;
    private type: number = 0;                     // 子彈類型 0: 一般 1: 鎖定 
    private bet: number = 0;
    private no: number = -1;
    private id: number = 0;

    private speed: number = 0;
    private lifetime: number = 0;
    private startPos: Vec3 = Vec3.ZERO;
    private endPos: Vec3 = Vec3.ZERO;
    private worldEndPos: Vec3 = Vec3.ZERO;
    private vel: Vec3 = Vec3.ZERO;
    private dir: Vec3 = Vec3.ZERO;

    private jumpNode: Node = null;             // 拋物線子彈的空node點
    private horizontalNode: Node = null;       // 水平線子彈的空node點
    private hitFishId: number[] = [];             // 碰撞的魚
    private delayDestroyTime: number = 0;
    private nextBulletCB: Function = null;

    onLoad() {
        this.jumpNode = new Node();
        this.jumpNode.parent = this.node;
        this.horizontalNode = new Node();
        this.horizontalNode.parent = this.node;
        // this.collider = this.getComponent(BoxCollider);
    }

    update (dt: number) {
        if (this.used) {
            this.lifetime -= dt;

            switch (this.type) {
                case 996:
                case 997:
                case 998:
                case 999:
                case 1000:
                case 1001:
                case prot.protocol.BulletType.Normal: {
                    this.updatePos(dt);
                    if (this.lifetime <= 0) {
                        this.destroyBullet();
                        walletManager.buffering(bufferType.Bullet, walletManager.myUserID, -this.bet);
                        Game.main.updateTurretCoin();  // 時間到卻沒擊中魚, 要補錢
                    }
                    break;
                }
                case prot.protocol.BulletType.Cannon: {
                    this.updatePos(dt);
                    if (this.lifetime <= 0) {
                        this.destroyBullet();
                        walletManager.buffering(bufferType.Bullet, walletManager.myUserID, -this.bet * Game.shootMgr.torpedoHitCount);
                        Game.main.updateTurretCoin();  // 時間到卻沒擊中魚, 要補錢
                    }
                    break;
                }
            }
        }
    }

    /**
     * 初始化
     */
    init(no: number, isMe: boolean, seat: number, startPosBL: Vec3, touchPosBL: Vec3, dir: Vec3, bltId: number, bltType: number, fishId: number[], bet: number, nextBulletCB: Function) {
        this.no = no;
        this.isMe = isMe;
        this.owner = seat;
        this.startPos = startPosBL;
        this.endPos = touchPosBL;
        this.dir = dir;
        this.id = bltId;
        this.type = bltType;
        this.hitFishId = fishId;
        this.bet = bet;
        this.nextBulletCB = nextBulletCB;

        this.worldEndPos = this.endPos;
        let fish = Game.fishMgr.getFishById(this.hitFishId[0]);
        if (fish) {
            this.worldEndPos = fish.node.worldPosition;
        }

        let a = this.endPos, b = this.startPos;
        let v = v2().set(a.x - b.x, a.y - b.y);
        if (v.lengthSqr() > 0) {
            let r = Vec2.UNIT_Y.signAngle(v) * macro.DEG;
            this.node.setWorldRotationFromEuler(0, 0, r);
        }

        this.node.setPosition(startPosBL);
        this.setUsed(true);
        this.setup();
    }

    /**
     * 初始化後設定
     */
    setup() {
        switch (this.type) {
            case prot.protocol.BulletType.Cannon: {
                this.lifetime = BulletSetting.lifeTime;
                this.speed = BulletSetting.speed;
                this.delayDestroyTime = BulletSetting.destroyTime;
                this.anim = this.getComponent(Animation);
                this.anim.play(this.anim.getComponent(Animation).clips[1].name);  // degg idle

                shake2D(Game.cam3D.node, 0.25, 25, 1);
                break;
            }
            default: {
                this.lifetime = BulletSetting.lifeTime;
                this.speed = BulletSetting.speed;
                this.delayDestroyTime = BulletSetting.destroyTime;
                this.anim = this.getComponent(Animation);
                this.anim.play(this.anim.getComponent(Animation).clips[0].name);  // idle
                break;
            }
        }

        switch (this.type) {
            case prot.protocol.BulletType.Cannon: {
                Game.effectMgr?.playFireBall02(trans3DPos(Game.node.effectLayer3D, this.node), 0.8, this.node);
                break;
            }
            case 997: {
                Game.effectMgr?.playMissileFire(trans3DPos(Game.node.effectLayer3D, this.node), 0.4 + 0.3, this.node);
                break;
            }
            case 998: {
                Game.effectMgr?.playMissileFire(trans3DPos(Game.node.effectLayer3D, this.node), 0.5 + 0.3, this.node);
                break;
            }
            case 999: {
                Game.effectMgr?.playMissileFire(trans3DPos(Game.node.effectLayer3D, this.node), 0.6 + 0.3, this.node);
                break;
            }
            case 1000: {
                Game.effectMgr?.playMissileFire(trans3DPos(Game.node.effectLayer3D, this.node), 0.5 + 0.3, this.node);
                break;
            }
            case 1001: {
                Game.effectMgr?.playMissileFire(trans3DPos(Game.node.effectLayer3D, this.node), 0.6 + 0.3, this.node);
                break;
            }
        }

        this.aiming()
    }

    /**
     * 鎖定子彈
     */
    aiming() {
        let lockTime = this.type == 996? 0.74: 0.1;
        lockTime = Game.bgMgr.isEventOfScene(SceneEvent.Treasure)? 0.2 : lockTime;

        if (this.type == 996) {
            let dir = this.id % 2 == 0? 1 : -1;
            let rand = rInt(20, 30) * dir;
            let jumpHeight = rInt(360, 400);
            // +0.05秒看起來比較像槌到豬 todo: 確認金豬效果，研四版本沒做
            // let jump = jumpBy(lockTime + 0.05, v2(0, 20), comm.iRand(30, 40), 1);
            // tween(this.jumpNode)
            //     .then(jump)
            //     .start();

            let jumpStartPos = v3(0, this.node.position.z, 0);
            let jumpEndPos = jumpStartPos;
            jumpTo(this.jumpNode, lockTime + 0.05, jumpStartPos, jumpEndPos, jumpHeight).start();

            tween(this.horizontalNode)
                .by(lockTime / 2, { position: v3(-rand, 0, 0) }, { easing: 'cubicOut' })
                .by(lockTime / 2, { position: v3(rand, 0, 0) }, { easing: 'cubicIn' })
                .start();

            // this.node.setRotation(quat().fromEuler(v3(0, 0, -rand)))
            this.node.setRotationFromEuler(v3(0, 0, -rand));
        } else if (this.type >= 997 && this.type <= 1001) {
            this.endPos = this.endPos.clone().add(v3(0, -20));
            

            this.jumpNode.setPosition(this.startPos);

            let p1: number = 0;
            let p2: number = 0;
            switch (this.type) {
                case 997: {
                    lockTime = 0.4;
                    // 外: bezierTo(lockTime, v2(this.startPos.x + 10, 0), v2(this.endPos.x + -10, 0), v2(this.endPos.x, 0))
                    // 內: bezierTo(lockTime, v2(this.startPos.x + -10, 0), v2(this.endPos.x + 10, 0), v2(this.endPos.x, 0))
                    // 10x + y = -10
                    // -10x + y = 10;
                    // x = -1, y = 0
                    p1 = rInt(0, 20) - 10;
                    p2 = p1 * -1;

                    tween(this.jumpNode)
                        .by(lockTime, { position: v3(0, this.endPos.y, 0) }, { easing: 'backIn' })
                        .start();
                    break;
                }
                case 998: {
                    lockTime = 0.5;
                    // 外: bezierTo(lockTime, v2(this.startPos.x + -50, 0), v2(this.endPos.x + 30, 0), v2(this.endPos.x, 0))
                    // 內: bezierTo(lockTime, v2(this.startPos.x + 20, 0), v2(this.endPos.x + -10, 0), v2(this.endPos.x, 0))
                    // -50x + y = 30;
                    // 20x + y = -10;
                    // x = -4/7, y = 10/7
                    p1 = rInt(0, 70) - 50;
                    p2 = p1 * -0.57 + 1.43;

                    tween(this.jumpNode)
                        .by(lockTime, { position: v3(0, this.endPos.y, 0) }, { easing: 'backIn' })
                        .start();
                    break;
                }
                case 999: {
                    lockTime = 0.6;
                    // 外: bezierTo(lockTime, v2(this.startPos.x + -20, 0), v2(this.endPos.x + 20, 0), v2(this.endPos.x, 0))
                    // 內: bezierTo(lockTime, v2(this.startPos.x + 20, 0), v2(this.endPos.x + 0, 0), v2(this.endPos.x, 0))
                    // -20x + y = 20
                    // 20x + y = 0;
                    // x = -0.5, y = 10
                    p1 = rInt(0, 40) - 20;
                    p2 = p1 * -0.5 + 10;

                    tween(this.jumpNode)
                        .by(lockTime, { position: v3(0, this.endPos.y, 0) }, { easing: 'backIn' })
                        .start();
                    break;
                }
                case 1000: {
                    lockTime = 0.5;
                    // 外: bezierTo(lockTime, v2(this.startPos.x + 50, 0), v2(this.endPos.x + -30, 0), v2(this.endPos.x, 0))
                    // 內: bezierTo(lockTime, v2(this.startPos.x + -20, 0), v2(this.endPos.x + 10, 0), v2(this.endPos.x, 0))
                    // 50x + y = -30;
                    // -20x + y = 10;
                    // x = -4/7, y = -10/7
                    p1 = rInt(0, 70) - 20;
                    p2 = p1 * -0.57 - 1.43;

                    tween(this.jumpNode)
                        .by(lockTime, { position: v3(0, this.endPos.y, 0) }, { easing: 'backIn' })
                        .start();
                    break;
                }
                case 1001: {
                    lockTime = 0.6;
                    // 外: bezierTo(lockTime, v2(this.startPos.x + 20, 0), v2(this.endPos.x + -20, 0), v2(this.endPos.x, 0))
                    // 內: bezierTo(lockTime, v2(this.startPos.x + -20, 0), v2(this.endPos.x + 0, 0), v2(this.endPos.x, 0))
                    // 20x + y = -20
                    // -20x + y = 0;
                    // x = -0.5, y = -10
                    p1 = rInt(0, 40) - 20;
                    p2 = p1 * -0.5 - 10;

                    tween(this.jumpNode)
                        .by(lockTime, { position: v3(0, this.endPos.y, 0) }, { easing: 'backIn' })
                        .start();
                    break;
                }
            }

            // todo: 不確定軌跡是否正確
            tween(this.horizontalNode)
                .then(bezier3DTo(lockTime, v3(this.startPos.x + p1, 0), v3(this.endPos.x + p2, 0), v3(this.endPos.x, 0)))
                .start();

        }

        let d = Vec3.distance(this.endPos, this.startPos);
        this.speed = d / lockTime;
        this.vel = this.dir.multiply(v3(this.speed, this.speed, this.speed));

        delay(this.node, lockTime, () => {
            this.aimFinish();
        });
    }

    aimFinish() {
        if (this.used) {
            this.sendBulletHit(this.hitFishId);
            this.destroyBullet();
            let fish = Game.fishMgr.getFishById(this.hitFishId[0]);
            if (fish) {
                Game.fishMgr.showHurt(fish);
                fish.damageTint(true);
            }
        }
    }

    /**
     * 子彈摧毀
     */
    destroyBullet() {
        Tween.stopAllByTarget(this.node);
        this.createHitEffect();
        this.setUsed(false);
    }

    /**
     * 命中處理
     */
    createHitEffect() {
        switch (this.type) {
            default: {
                this.anim.stop();
                let pos = this.worldEndPos;
                if (this.type === 996) {
                    pos = this.endPos.clone().add(v3(0, 30));
                } else if (this.type >= 997 && this.type <= 1001) {
                    pos = this.endPos.clone().add(v3(0, 20));
                }
                this.node.parent.emit('HitEffect', pos, this.no);
            }
        }

        tween(this.node)
            .delay(this.delayDestroyTime)
            .call(() => this.pushToPool())
            .start();
    }

    /**
     * 資源回收
     */
    pushToPool() {
        this.hitFishId.length = 0;
        this.nextBulletCB = null;

        if (this.no <= -1) {
            this.node.destroy();
            return;
        }
        Game.dataMgr.setBullet(this.node);
    }

    /**
     * 更新座標 
     */
    updatePos(dt: number) {
        let v = this.vel;
        let p = this.node.position;
        this.node.setPosition(p.x + v.x * dt, p.y + v.y * dt);

        // console.log('updatePos x: ' + this.node.position.x + ', y: ' + this.node.position.y + ', z: ' + this.node.position.z)


        // todo: 擴散子彈的軌跡
        if (this.type == 996) {
            // console.log(this.jumpNode.position, 'this.jumpNode');
            this.node.setPosition(this.horizontalNode.position.x, this.node.position.y, this.jumpNode.position.y);
            // this.node.z = this.jumpNode.y;
            // this.node.x = this.horizontalNode.x;
        } else if (this.type >= 997 && this.type <= 1001) {
            // this.node.x = this.horizontalNode.x;
            // this.node.y = this.jumpNode.y;
            this.node.setPosition(this.horizontalNode.position.x, this.jumpNode.position.y, this.node.position.z);

            // let v = this.endPos.subtract(this.node.position);
            // this.node.angle = misc.radiansToDegrees(Vec2.UNIT_Y.signAngle(v));   // todo: 旋轉角度
            // this.node.setWorldRotationFromEuler(0, 0, Vec2.UNIT_Y.signAngle(v) * macro.DEG);

            // switch (this.type) {
            //     case 997: {
            //         this.node.angle = this.node.angle > 10? 10 : this.node.angle;
            //         this.node.angle = this.node.angle < -10? -10 : this.node.angle;
            //         break;
            //     }
            //     case 998:
            //     case 1000: {
            //         this.node.angle = this.node.angle > 20? 20 : this.node.angle;
            //         this.node.angle = this.node.angle < -20? -20 : this.node.angle;
            //         break;
            //     }
            //     case 999:
            //     case 1001: {
            //         this.node.angle = this.node.angle > 15? 15 : this.node.angle;
            //         this.node.angle = this.node.angle < -15? -15 : this.node.angle;
            //         break;
            //     }
            // }

            let a = this.endPos, b = this.node.position;
            let v = v2().set(a.x - b.x, a.y - b.y);
            if (v.lengthSqr() > 0) {
                let r = Vec2.UNIT_Y.signAngle(v) * macro.DEG;
                this.node.setWorldRotationFromEuler(0, 0, r);
            }
        }
    }

    /**
     * 送出子彈命中
     * @param fishId 命中魚編號
     * @param coin 子彈價值
     */
    sendBulletHit(fishId: number[]) {
        if (this.isMe) {
            let data = new HitData();
            data.type = this.type;
            data.seat = this.owner;
            data.fishId = fishId;
            data.coin = this.type == prot.protocol.BulletType.Cannon? this.bet * Game.shootMgr.torpedoHitCount : this.bet;
            data.bltId = this.id;
            data.bet = this.bet;
            data.HitPos = trans3DPos(Game.fishMgr.getSpawnNode(), Game.node.bulletLayer, v3(this.node.position.x, this.node.position.y, this.node.position.z));
            Game.node.bulletLayer.emit('BulletHit', data);
        }

        if (this.nextBulletCB) {
            this.nextBulletCB();
        }
    }

    /**
     * 是否使用中
     */
    setUsed(toggle: boolean) {
        this.used = toggle;
        // if (this.collider) {
        //     this.collider.enabled = toggle;
        // }
    }

    /**
     * 取得子彈是誰的
     */
    getOwner(): number {
        return this.owner;
    }

    /**
     * 取得子彈編號
     */
    getBulletId(): number {
        return this.id;
    }

}
