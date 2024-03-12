import Long from 'long';
import protobuf from 'protobufjs';
import { _decorator, Component, Node, Tween, instantiate, Prefab, JsonAsset, Camera, NodePool, log, director, Director } from 'cc';
import { find } from 'db://annin-framework/utils';
import { Bus, Comm, BusEvent, AnninInit } from 'db://annin-framework/system';
import { i18nManager, soundManager } from 'db://annin-framework/manager';
import { PropertyData } from './PropertyData';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('DataMgr')
export class DataMgr extends Component {

    @property({
        tooltip: '遊戲中掛載的資源',
        type: PropertyData,
    })
    properties: PropertyData = null;

    @property({
        tooltip: '遊戲字表',
        type: JsonAsset,
    })
    langJson: JsonAsset = null;

    private fishPools = new Map<number, NodePool>();
    private turretPools = new Map<number, NodePool>();
    private bulletPools = new Map<number, NodePool>();

    onLoad() {
        protobuf.util.Long = Long;
        protobuf.configure();
        AnninInit();

        Game.dataMgr = this;

        i18nManager.setGameLangJson(this.langJson.json);
        soundManager.load('game', 'res/mp3')
        soundManager.setMusicPath('res/mp3')

        let stage = Comm.node.stage;
        Game.cam3D = find(stage, '3D Camera Pivot/3D Camera', Camera);
        Game.camUI = find(stage, 'UI Camera Pivot/UI Camera', Camera);

        Game.node.stage = stage;
        Game.node.display = find(stage, 'Display');
        Game.node.playerLayer = find(stage, 'Display/PlayerLayer');
        Game.node.fishLayer = find(stage, 'Display/FishLayer');
        Game.node.bulletLayer = find(stage, 'Display/BulletLayer');
        Game.node.effectLayer = find(stage, 'Display/EffectLayer2D');
        Game.node.effectLayer3D = find(stage, 'Display/EffectLayer3D');
        Game.node.rewardLayer = find(stage, 'Display/RewardLayer');
        Game.node.uiLayer = find(stage, 'Display/UILayer');
        Game.node.buttonLayer = find(stage, 'Display/ButtonLayer');
        Game.node.buttonUpperLayer = find(stage, 'Display/ButtonUpperLayer');
    }

    onDestroy() {
        // 自己的變量可以先清
        this.fishPools.forEach(pool => pool.clear());
        this.turretPools.forEach(pool => pool.clear());
        this.bulletPools.forEach(pool => pool.clear());

        this.fishPools.clear();
        this.turretPools.clear();
        this.bulletPools.clear();

        Bus.depart(BusEvent.StageDestroyed);

        // 全局變量要最後清
        director.once(Director.EVENT_END_FRAME, () => {
            Game.dataMgr = null;
            Game.cam3D = null;
            Game.camUI = null;
            Game.node.display = null;
            Game.node.playerLayer = null;
            Game.node.fishLayer = null;
            Game.node.bulletLayer = null;
            Game.node.effectLayer = null;
            Game.node.effectLayer3D = null;
            Game.node.rewardLayer = null;
            Game.node.uiLayer = null;
            Game.node.buttonLayer = null;
            Game.node.buttonUpperLayer = null;
        });
    }

    // ----------------------------------------------------------------
    // 其它類型
    // ----------------------------------------------------------------

    // #region Prefab 節點生成
    /**
     * 取得 fish pool
     */
    private getFishPool(no: number): NodePool {
        let pool = this.fishPools.get(no);
        if (pool === undefined) {
            pool = new NodePool();
            this.fishPools.set(no, pool);
        }
        return pool;
    }

    /**
     * 生成一隻魚的節點
     */
    private createFish(no: number): Node {
        let prefab = this.properties.fishes[no];
        if (prefab === undefined) {
            log(`fish prefab is not found. no: ${no}`);
            return null;
        }
        let node = instantiate(prefab);
        node.attr({ __no: no });
        return node;
    }

    /**
     * 取得魚的節點
     */
    getFish(no: number): Node {
        let pool = this.getFishPool(no);
        return pool.get() ?? this.createFish(no);
    }

    /**
     * 塞回 fish pool
     */
    setFish(node: Node) {
        let no = (<any>node).__no;  // 對應到魚編號 (魚編號從 1 開始)
        if (no === undefined) {
            log('no is not exits. name = ' + node.name + '.');
            node.destroy();
            return;
        }
        let pool = this.getFishPool(no);    // 必定有 pool
        Tween.stopAllByTarget(node);
        pool.put(node);
    }

    /**
     * 取得 turretCannon pool
     */
    private getTurretCannonPool(no: number): NodePool {
        let pool = this.turretPools.get(no);
        if (pool === undefined) {
            pool = new NodePool();
            this.turretPools.set(no, pool);
        }
        return pool;
    }

    /**
     * 生成砲管的節點
     */
    private createTurretCannon(no: number): Node {
        let prefab = this.properties.cannons[no] ?? this.properties.cannons[0];
        let node = instantiate(prefab);
        node.attr({ __no: no });
        return node;
    }

    /**
     * 取得砲管的節點
     */
    getTurretCannon(no: number): Node {
        let pool = this.getTurretCannonPool(no);
        return pool.get() ?? this.createTurretCannon(no);
    }

    /**
     * 塞回 turretCannon pool
     */
    setTurretCannon(node: Node) {
        let no = (<any>node).__no;
        if (no === undefined) {
            log('no is not exits. name = ' + node.name + '.');
            node.destroy();
            return;
        }
        let pool = this.getTurretCannonPool(no);    // 必定有 pool
        Tween.stopAllByTarget(node);
        pool.put(node);
    }

    /**
     * 取得子彈池
     */
    private getbulletPool(no: number): NodePool {
        let pool = this.bulletPools.get(no);
        if (pool === undefined) {
            pool = new NodePool();
            this.bulletPools.set(no, pool);
        }
        return pool;
    }

    /**
     * 建立子彈
     */
    private createBullet(no: number): Node {
        let prefab = this.properties.bullets[no] ?? this.properties.bullets[0];
        let node = instantiate(prefab);
        node.attr({ __no: no });
        return node;
    }

    /**
     * 取得子彈
     */
    getBullet(no: number): Node {
        let pool = this.getbulletPool(no);
        return pool.get() ?? this.createBullet(no);
    }


    /**
     * 設定子彈
     */
    setBullet(node: Node) {
        let no = (<any>node).__no;
        if (no === undefined) {
            log('no is not exits. name = ' + node.name + '.');
            node.destroy();
            return;
        }
        let pool = this.getbulletPool(no);    // 必定有 pool
        Tween.stopAllByTarget(node);
        pool.put(node);
    }

    /**
     * 取得受擊效果
     */
    getBulletHitEffect(no: number): Node {
        let prefab = this.properties.hitEffect[no] ?? this.properties.hitEffect[0];
        return instantiate(prefab);
    }

    /**
     * 取得特效 Prefab
     */
    getEffectPf(no: number): Prefab {
        return this.properties.effects[no] || null;
    }

    /**
     * 取得其它 Prefab
     */
    getOtherPf(no: number): Prefab {
        return this.properties.others[no] || null;
    }

    /**
     * 取得獎圈特效
     */
    getReward(no: number): Node {
        let prefab = this.properties.rewards[no] ?? this.properties.rewards[0];
        return instantiate(prefab);
    }

    /**
    * 取得砲台加錢效果
    */
    getCoinAddNum(no: number): Node {
        let prefab = this.properties.goldNum[no] ?? this.properties.goldNum[0];
        return instantiate(prefab);
    }

    /**
     * 大砲流彈
     */
    getJumpBulletNode(): Node {
        return instantiate(this.properties.cannonJumpBullet);
    }

    /**
     * 寶箱鑰匙
     */
    getTreasureKeyNode(): Node {
        return instantiate(this.properties.treasureKey);
    }

    /**
     * 轉輪表演
     */
    getWheelNode(): Node {
        return instantiate(this.properties.wheelPrefab);
    }
    // #endregion

}
