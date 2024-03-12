import prot from '../network/protocol/protocol.js';
import { _decorator, Component, Vec3 } from 'cc';
import { appManager, walletManager, bufferType } from 'db://annin-framework/manager';
import Bullet, { HitData } from './Bullet';
import Game, { GameLog } from '../system/Game';

const { ccclass, property } = _decorator;

/**
 * 擊發子彈的資訊
 */
export class BulletData {
    bltId: number = 0;
    seat: number = 0;
    type: number = 0;
    time: number = 60;
    bet: number = 0;
}

@ccclass('BulletMgr')
export default class BulletMgr extends Component {

    private shootList: BulletData[] = [];          // 擊發列表

    onLoad() {
        Game.bulletMgr = this;
        Game.node.bulletLayer.on('BulletHit', this.c2sBulletHit, this);
        Game.node.bulletLayer.on('HitEffect', this.hitEffect, this);
    }

    onDestroy() {
        Game.node.bulletLayer.off('BulletHit', this.c2sBulletHit, this);
        Game.node.bulletLayer.off('HitEffect', this.hitEffect, this);
        Game.bulletMgr = null;
    }

    update(dt: number) {
        let i = 0;
        while (i < this.shootList.length) {
            this.shootList[i].time -= dt;
            if (this.shootList[i].time <= 0) {
                appManager.sendButton(GameLog.Bullet_CoinBack, this.shootList[i].bet.toString());
                walletManager.buffering(bufferType.Hit, walletManager.myUserID, -this.shootList[i].bet);
                Game.main.updateTurretCoin();
                this.shootList.splice(i, 1);
            }
            else {
                i += 1;
            }
        }
    }

    /**
     * 建立子彈
     * @param no 模型編號
     * @param isMe 是否為自己
     * @param seat 座位編號
     * @param startPosBL 起始點
     * @param touchPosBL 結束點
     * @param direction 方向
     * @param bltId 子彈編號
     * @param bltType 子彈類型
     * @param fishId 鎖定魚的編號
     * @param bet 子彈bet
     */
    createBullet(no: number, isMe: boolean, seat: number, startPosBL: Vec3, touchPosBL: Vec3, direction: Vec3, bltId: number, bltType: number, fishId: number[], bet: number, nextBulletCB: Function) {
        let node = Game.dataMgr.getBullet(no);
        node.parent = Game.node.bulletLayer;

        let bullet = node.getComponent(Bullet);
        bullet.init(no, isMe, seat, startPosBL, touchPosBL, direction, bltId, bltType, fishId, bet, nextBulletCB);

        // 銀行控管金流
        let coin = bltType == prot.protocol.BulletType.Cannon? bet * Game.shootMgr.torpedoHitCount : bet;
        walletManager.buffering(bufferType.Bullet, walletManager.myUserID, coin);
        Game.main.updateTurretCoin();
    }

    createFakeBullet(no: number, isMe: boolean, seat: number, startPosBL: Vec3, touchPosBL: Vec3, direction: Vec3, bltId: number, bltType: number, fishId: number[], bet: number) {
        let node = Game.dataMgr.getBullet(no);
        node.parent = Game.node.bulletLayer;

        let bullet = node.getComponent(Bullet);
        bullet.init(-1, isMe, seat, startPosBL, touchPosBL, direction, bltId, bltType, fishId, bet, null);
    }

    createMissileBullet(no: number, isMe: boolean, seat: number, startPosBL: Vec3, touchPosBL: Vec3, direction: Vec3, bltId: number, bltType: number, fishId: number[], bet: number, cb: Function) {
        let node = Game.dataMgr.getBullet(no);
        node.parent = Game.node.bulletLayer;

        let bullet = node.getComponent(Bullet);
        bullet.init(-1, isMe, seat, startPosBL, touchPosBL, direction, bltId, bltType, fishId, bet, cb);
    }

    /**
     * 命中處理
     */
    c2sBulletHit(hit: HitData) {
        let fishId = hit.fishId;
        for (let i = 0; i < fishId.length; ++i) {
            let fish = Game.fishMgr.getFishById(fishId[i]);
            if (fish) {
                // 如果是打特色模式的冰龍就不送命中通知
                if (fish.bFakeDragon) {
                    walletManager.buffering(bufferType.Bullet, walletManager.myUserID, -hit.coin);
                    return
                }
            }
        }

        let data = new prot.protocol.HitReqData;
        data.bet = hit.bet;
        data.index = fishId;//this.exception(fishId);
        data.bulletId = hit.bltId;
        data.type = hit.type;
        Game.gameMgr.U2S_HitReq(data);
        this.addBulletData(hit.bltId, hit.coin, hit.type, hit.seat);
        walletManager.buffering(bufferType.Bullet, walletManager.myUserID, -hit.coin);
        walletManager.buffering(bufferType.Hit, walletManager.myUserID, hit.coin);
    }

    exception(no: number[]) {

        let temp: number[] = [no[0]];
        // 冰龍、國王、皇后、黃金騎士、寶箱、紅魔女為第一隻，不會有第二隻

        // 第二隻為國王、皇后、黃金騎士、寶箱、紅魔女、炸彈哥不林時不談射

        return temp;
    }

    /**
     * 播放命中特效
     * @param pos 位置
     * @param no 模型編號
     */
    hitEffect(pos: Vec3, no: number) {
        Game.effectMgr?.bulletHitEffect(pos, no);
    }

    /**
     * 加入射擊列表
     */
    addBulletData(bltId: number, bet: number, type: number, seat: number) {
        if (bet > 0) {
            let temp = new BulletData();
            temp.bltId = bltId;
            temp.type = type;
            temp.seat = seat;
            temp.bet = bet;
            this.shootList.push(temp);
        }
    }

    /**
     * 回報射擊命中
     */
    delBulletData(bltId: number) {
        let i = 0;
        while (i < this.shootList.length) {
            if (this.shootList[i].bltId === bltId) {
                walletManager.buffering(bufferType.Hit, walletManager.myUserID, -this.shootList[i].bet);
                this.shootList.splice(i, 1);
                break;
            }
            i++;
        }
    }

    /**
     * 搜尋場上所有子彈
     */
    getAllBullets(): Bullet[] {
        return Game.node.bulletLayer.getComponentsInChildren(Bullet);
    }

}
