import prot from '../network/protocol/protocol.js';
import { _decorator, Component, find, log, Node, Vec2, v2, Vec3, v3, tween, clamp01, AnimationClip } from 'cc';
import { appManager, soundManager } from 'db://annin-framework/manager';
import { lastItem, rInt, shake2D, trans3DPos } from 'db://annin-framework/utils';
import { Comm } from 'db://annin-framework/system/comm';
import { SceneEvent, EffectNo, FishNo, SoundName } from './GameDefine';
import { delay } from '../system/ToolBox';
import FishSpecialShow from './FishSpecialShow';
import Fish from './Fish';
import Game, { GameLog } from '../system/Game';

const { ccclass, property } = _decorator;

export class FishScript {
    fish: Fish = null;
    fishNo: number = 0;
    fishID: number = 0;
    moveList: Vec3[] = [];
}

export class bundleAnim {
    clip: AnimationClip[] = [];
}

@ccclass('FishMgr')
export default class FishMgr extends Component {

    private spawnNode: Node = null;                     // 所有魚會放在該節點底下
    private fishes: Map<number, Fish> = new Map();      // 當前場景上魚群

    private fishScriptData: FishScript[] = [];
    private keepFishScriptData: FishScript[] = [];

    private bossPosList: Vec3[] = [v3(0, 520)];

    /**
     *     站位
     *      6
     *      5
     *  2       4
     *  1       3
     *      0
     */
    private monsterPosList: Vec3[] = [
        v3(0, 392),
        v3(-86, 490), v3(-64, 640),
        v3(86, 490), v3(64, 640),
        v3(0, 700), v3(0, 850)
    ];

    /**
     *    3   4
     *  1       2
     *      0
     */
    private treasurePosList: Vec3[] = [
        v3(0, 265),
        v3(-87.5, 368), v3(87.5, 368),
        v3(-70, 540), v3(70, 540)
    ];

    // 各點連接路徑(這邊一定要最後一個點為重生點)
    private monsterPathList: Vec2[] = [v2(6, 5), v2(5, 2), v2(2, 1), v2(1, 0), v2(5, 4), v2(4, 3), v2(3, 0)];

    // 攻城寶箱路徑(這邊一定要最後一個點為重生點)
    private treasurePathList: Vec2[] = [v2(4, 0), v2(3, 1), v2(4, 3), v2(4, 2), v2(1, 0), v2(2, 0), v2(3, 0)];

    private currPosList: Vec3[] = this.monsterPosList;      // 目前使用的座標點
    private currPathList: Vec2[] = this.monsterPathList;    // 目前使用的路徑

    private searchTime: number = 0.13;
    moveTime: number = 0.3;

    private fishIDChecker: Set<number> = new Set<number>();
    private keepFishList: prot.protocol.IFish[] = [];

    private bUpdateSeating: boolean = false;    // 是否正在更新位置
    private updateSeatCB: Function[] = [];      // 更新位置注列
    private saveBreakLvList: number[] = [];

    private fishBundleClip: bundleAnim[] = [];

    onLoad() {
        Game.fishMgr = this;
        this.spawnNode = find('SpawnNode', Game.node.fishLayer);
    }

    start() {
        this.init();
    }

    onDestroy() {
        Game.fishMgr = null;
    }

    init() {
        // this.updateSeat();
    }

    update(dt: number) {
        if (!this.bUpdateSeating && this.updateSeatCB.length > 0) {
            if (!this.checkBossComingBeforeUpdateSeat()) {
                this.updateSeat(0);
            }
            this.updateSeatCB[0]();
            this.updateSeatCB.shift();
        }
    }

    lateUpdate() {
        // a: 最近站位 b: 最遠站位
        const a = 392, b = 850;
        const l = b - a;

        this.fishScriptData.forEach(data => {
            if (!data || !data.fish) {
                return;
            }
            let fish = data.fish;
            if (fish && fish.node) {
                fish.fogColor(Game.bgMgr.getFogColor());
                fish.fogDepth(clamp01(0.66 * Math.abs((fish.node.position.y - a) / l)));
            }
        });
    }

    /**
     * 更新位置注列， 使用時間: 每次補位單獨看，主位位移完成就執行CALLBACK
     * @param endCB 
     */
    readyToUpdateSeat(endCB: Function) {
        this.updateSeatCB.push(endCB);
    }

    /**
     * 檢查這次補位前是否有BOSS
     * @param endCB 
     * @returns 
     */
    checkBossComingBeforeUpdateSeat(endCB?: Function) {
        // let ok = Game.bgMgr.isEventOfScene(SceneEvent.Frost) || Game.bgMgr.isEventOfScene(SceneEvent.FakeFrost);
        // let fishData = this.fishScriptData;

        // // 是否 Boss 來襲
        // if (ok) {
        //     for (let fish of this.keepFishList) {
        //         if (this.isFrostDragon(fish.no)) {
        //             this.keepFishList = [fish];
        //             break;
        //         }
        //     }

        //     let header = fishData[0];
        //     if (!header || !this.isFrostDragon(header.fishNo)) {
        //         this.bossComing(endCB);
        //     }
        // }

        return false;
    }

    /**
     * 更新位置至場內全部位移完成, 單獨呼叫時機: 須等到場內全部位移完成時，執行CALLBACK
     */
    updateSeat(idx: number, endCB?: Function) {
        this.bUpdateSeating = true;
        let fishData = this.fishScriptData;

        let posIdx = -1;
        for (let i = idx, len = this.currPosList.length; i < len; ++i) {
            if (fishData[i])
                continue;

            // 找到空位
            Game.bgMgr.isEventOfScene(SceneEvent.Treasure) ? this.createTreasurerPath(i) : this.createPath(i);
            posIdx = i;
            break;
        }

        // 是否補怪結束
        if (posIdx === -1) {
            if (endCB) endCB();
            this.updateSeatFinish();
            this.bUpdateSeating = false;
            return;
        }

        // 開始補怪
        this.runPath(posIdx);

        // 檢查下一個補怪
        delay(this.node, this.searchTime, () => this.updateSeat(posIdx + 1, endCB));

        // 檢查是否可用道具卡
        Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();
    }

    /**
     * 補怪結束
     */
    updateSeatFinish() {
        let fishData = this.fishScriptData;
        if (fishData.length === 0)
            return;

        // 最前頭角色才會做其他動作
        if (fishData[0]) {
            let header = this.fishScriptData[0].fish;
            header.addIdleChoose();
            // todo:
            // header.node.zIndex = 2;
            Game.uiCtrl.setTopOdd(this.getUIOddRange(header.getFishNo()));
        }

        // 邊緣光
        let addRimLight = (fish: Fish) => {
            if (!(fish && fish.node.isValid)) {
                return;
            }
            fish.setRimLight(0.6, Game.bgMgr.getAmbientColor());
        };

        if (Game.bgMgr.getBGID() === 2) {
            delay(this.node, 0.1, () => {
                fishData.forEach(data => {
                    if (data) addRimLight(data.fish);
                });
            });
        }
        else {
            delay(this.node, 0.1, () => {
                if (fishData[0]) addRimLight(fishData[0].fish);
            });
        }

        // 檢查是否可用道具卡
        Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();
    }

    /**
     * 建立要走的路徑
     * @param idx 
     */
     createTreasurerPath(idx: number) {
        let d = new FishScript();
        d.fish = this.addFish();
        d.fishNo = d.fish.getFishNo();
        d.fishID = d.fish.getFishId();
        this.fishScriptData[idx] = d;

        d.fish.node.setPosition(this.currPosList[idx].clone().add(v3(0, 10)));
        
        this.fishScriptData[idx].moveList.push(this.currPosList[idx]);
    }

    /**
     * 建立要走的路徑
     * @param idx 
     */
    createPath(idx: number) {
        if (idx == (this.currPosList.length - 1)) {
            let d = new FishScript();
            d.fish = this.addFish(true);
            d.fishNo = d.fish.getFishNo();
            d.fishID = d.fish.getFishId();
            this.fishScriptData[idx] = d;
        } else {
            let list: number[] = [];
            for (let i = 0; i < this.currPathList.length; ++i) {
                let target = this.currPathList[i].x;
                // 找哪裡可以走到這個點
                if (this.currPathList[i].y == idx) {
                    list.push(target);
                }
            }

            let target = list[rInt(0, list.length - 1)]

            // 此點沒建立就建一隻
            if (!this.fishScriptData[target]) {
                this.createPath(target);
            }
            this.fishScriptData[target].moveList.push(this.currPosList[idx]);
            this.fishScriptData[idx] = this.fishScriptData[target];
            this.fishScriptData[target] = null;
        }
    }

    /**
     * 開始移動
     * @param idx
     */
    runPath(idx: number) {
        if (this.fishScriptData[idx]) {
            if (this.fishScriptData[idx].moveList.length > 0) {
                let pos = v3(this.fishScriptData[idx].moveList[0].x, this.fishScriptData[idx].moveList[0].y);

                // 只能動一步 || 最後一步的時候用 ease 漸停效果
                if (this.fishScriptData[idx].moveList.length == 1) {
                    tween(this.fishScriptData[idx].fish.node)
                        .to(this.moveTime, { position: pos }, { easing: t => 1 - (1 - t) ** 2 })
                        .call(() => {
                            this.runPath(idx);
                        })
                        .start();
                } else {
                    tween(this.fishScriptData[idx].fish.node)
                        .to(this.searchTime, { position: pos })
                        .call(() => {
                            this.runPath(idx);
                        })
                        .start();
                }

                this.fishScriptData[idx].fish.playMoveSmoke();
                this.fishScriptData[idx].moveList.shift();
            }
        }
    }

    /**
     * 新增魚
     */
    private addFish(checkBreakLv: boolean = false): Fish {
        let fish = null as Fish;
        let no = 0;
        let id = 0;
        let lv = 0;

        let fishData = this.keepFishList.shift();
        if (fishData) {
            no = fishData.no;
            id = fishData.index;
            lv = checkBreakLv? this.getBreakLevel(id) : 0;
        } else {
            appManager.sendButton(GameLog.Error_CreateFishFail);
            Game.gameCtrl.gameShutDown();
        }

        fish = Game.dataMgr.getFish(no).getComponent(Fish);
        fish.node.setPosition(lastItem(this.currPosList));
        // fish.node.zIndex = 1;// todo:

        // 編導說藏寶庫的怪要小一點
        find('Root', fish.node)?.setScale(Game.bgMgr.isEventOfScene(SceneEvent.Treasure)? v3(0.9, 0.9, 0.9) : v3(1, 1, 1));

        // 加入場景
        // todo:
        // this.spawnNode.addChild(fish.node, 0, 'Fish_' + id);
        fish.node.name = 'Fish_' + id;
        this.spawnNode.addChild(fish.node);
        this.fishes.set(id, fish);

        let fishKind = fish.getComponent(FishSpecialShow)?.kind;
        if (fishKind !== undefined) this.loadFbxAnim(fishKind);
        fish.init(id, no, lv);

        return fish;
    }

    /**
     * 取得魚的父節點
     */
    getSpawnNode(): Node {
        return this.spawnNode;
    }

    /**
     * 顯示魚受擊效果
     */
    showDamage(fishOrId: number | Fish, time?: number) {
        let fish = typeof fishOrId === 'number' ? this.getFishById(fishOrId) : fishOrId;
        if (fish) {
            fish.damageTint(true, time);
        }
    }

    /**
     * 顯示魚抖動效果
     */
    showHurt(fishOrId: number | Fish, times: number = 2) {
        let fish = typeof fishOrId === 'number' ? this.getFishById(fishOrId) : fishOrId;
        if (fish && fish.isUsed()) {
            fish.hitShakeFish(times);
            fish.showHurt();
        }
    }

    /**
     * 取得魚的元件
     */
    getFishById(fishId: number): Fish {
        return this.fishes.get(fishId);
    }

    /**
     * 移除魚
     */
    delFish(fishOrId: number | Fish, showDeath: boolean, immediately: boolean) {
        let fish = typeof fishOrId === 'number' ? this.getFishById(fishOrId) : fishOrId;
        if (fish && fish.node && fish.node.parent) {
            fish.destroyFish(showDeath, immediately);
        }

        for (let i = 0; i < this.fishScriptData.length; ++i) {
            if (this.fishScriptData[i]) {
                if (this.fishScriptData[i].fish === fish) {
                    this.fishScriptData[i] = null;
                }
            }
        }
    }

    /**
     * 從清單上移除魚 (ps.只給 Fish 元件呼叫用的)
     */
    removeFishFromCache(fishId: number) {
        this.fishes.delete(fishId);
    }

    /**
     * 離桌時清空魚群
     */
    leaveTable() {
        this.reset();
    }

    /**
     * 清空當前腳本 (所有魚群)
     */
    reset() {
        for (let i = 0; i < this.fishScriptData.length; ++i) {
            if (this.fishScriptData[i]) {
                let fish = this.fishScriptData[i].fish;
                if (fish) {
                    this.delFish(fish, false, true);
                }
            }
        }
    }

    /**
     * 取得所有的魚
     */
    getAllFishes(): Fish[] {
        let list = [] as Fish[];
        this.fishes.forEach(fish => {
            if (fish && fish.node) {
                list.push(fish);
            }
        });
        return list;
    }

    /**
     *     站位
     *      6
     *      5
     *  2       4
     *  1       3
     *      0
     * @param no 
     */
    getFishTower(no: number): Fish {
        if (this.fishScriptData[no]) {
            return this.fishScriptData[no].fish;
        }
        return null;
    }

    /**
     * 是否為一般魚
     */
    isCommonFish(fishOrId: number | Fish): boolean {
        let fish = typeof fishOrId === 'number' ? this.getFishById(fishOrId) : fishOrId;
        if (fish) {
            let spec = fish.getSpecialShow();
            if (!spec) return true;
        }
        return false;
    }

    /**
     * 預先標記魚死亡 (永生魚除外)
     */
    setFishPredead(fishOrId: number | Fish) {
        let fish = typeof fishOrId === 'number' ? this.getFishById(fishOrId) : fishOrId;
        if (fish && !this.isImmortalFish(fish)) {
            fish.setUsed(false);
        }
    }

    /**
     * 是否為永生魚
     */
    isImmortalFish(fishOrId: number | Fish): boolean {
        return false;
    }

    /**
     * bossComing 
     */
    bossComing(endCB?: Function) {
    }

    /**
     * 還原主場路徑
     */
    pathReset() {
        this.currPosList = this.monsterPosList;
        this.currPathList = this.monsterPathList;
    }

    /**
     * 製造角色塔 (佔第一個位子)
     */
    callFishTower(fishData: prot.protocol.IFish) {
        this.keepFishList.unshift(fishData);

        let fish = this.addFish();
        fish.node.setPosition(5000, 5000, 0);
        delay(fish.node, .2, () => {
            fish.node.setPosition(this.currPosList[0]);
            soundManager.playEffect(SoundName.flash);
            Game.effectMgr.playCallTower(fish);
        });

        let oldFish = this.fishScriptData[0]?.fish;
        if (oldFish) {
            soundManager.playEffect(SoundName.flash);
            Game.effectMgr.playGiveup(oldFish);
            this.delFish(oldFish, false, true);
        }

        let d = new FishScript();
        d.fishNo = fish.getFishNo();
        d.fish = fish;
        this.fishScriptData[0] = d;
    }

    /**
     * 調整為藏寶庫路徑
     */
    enterTreasure() {
        this.currPosList = this.treasurePosList;
        this.currPathList = this.treasurePathList;
    }

    /**
     * 儲存準備要出的魚
     */
    saveFishList() {
        let plate = Game.main.Plate;
        if (plate.length === 0)
            return;

        let keepIDs = this.fishIDChecker;
        if (keepIDs.size > 0)
            keepIDs.clear();

        let keepFishes = this.keepFishList;
        for (let fish of keepFishes) {
            keepIDs.add(fish.index)
        }

        // 新增 keepFishList 中沒有的角色
        for (let fish of plate) {
            let fishID = fish.index;
            if (!keepIDs.has(fishID) && !this.getFishById(fishID))
                keepFishes.push(fish);
        }

        keepIDs.clear();
    }

    clearFishList() {
        this.keepFishList = [];
    }

    /**
     * 顯示魚種倍率
     * @param no 
     * @returns 
     */
    getUIOddRange(no: number) {
        let str = '';
        switch (no) {
            case FishNo.ArcherGoblin: {
                str = 'x1-x18'
                break;
            }
            case FishNo.SwordMan: {
                str = 'x1-x20'
                break;
            }
            case FishNo.Viking: {
                str = 'x2-x20'
                break;
            }
            case FishNo.ArmorSoldier: {
                str = 'x2-x30'
                break;
            }
            case FishNo.Knight: {
                str = 'x3-x40'
                break;
            }
            case FishNo.ArmorFighter: {
                str = 'x3-x60'
                break;
            }
            case FishNo.GoldenKnight: {
                str = 'x5-x100'
                break;
            }
            case FishNo.RedWitch:
            case FishNo.RedWitchEz: {
                str = 'x10-x150'
                break;
            }
            case FishNo.TreasureChest:
            case FishNo.TreasureChestEz:
            case FishNo.TreasureChestEz2: {
                str = 'x5-x2000'
                break;
            }
            case FishNo.Queen:
            case FishNo.QueenEz: {
                str = 'x10-x150'
                break;
            }
            case FishNo.King:
            case FishNo.KingEz: {
                str = 'x20-x200'
                break;
            }
            case FishNo.WheelChest: {
                str = 'x5-x1000'
                break;
            }
        }

        return str
    }

    /**
     * 儲存裂塔狀態
     * @param idx 
     * @param lv 
     */
    setBreakLevel(idx: number, lv: number = 0) {
        if (idx == -1) {
            this.saveBreakLvList = [];
        } else {
            this.saveBreakLvList[idx] = lv;
        }
    }

    /**
     * 取得塔裂狀態
     * @param idx 
     * @returns 
     */
    getBreakLevel(idx: number) {
        return this.saveBreakLvList[idx]? this.saveBreakLvList[idx] : 0;
    }

    /**
     * 創假冰龍
     */
    makeFakeDragon() {

    }

    /**
     * 保留主場排列陣行
     */
    saveKeepFishScriptData() {
        this.keepFishScriptData = [];
        for (let i = 0; i < 7; ++i) {
            if (this.fishScriptData[i]) {
                let data = new FishScript();
                data.fishID = this.fishScriptData[i].fishID;
                data.fishNo = this.fishScriptData[i].fishNo;
                this.keepFishScriptData[i] = data;
            }
        }
    }

    /**
     * 還原主場陣行
     */
    loadkeepFishScriptData() {
        let addFish = (idx, id, no) => {
            let fish = Game.dataMgr.getFish(no).getComponent(Fish);
            fish.node.setPosition(this.currPosList[idx]);
            // todo:
            // fish.node.zIndex = 1;

            // 加入場景
            // todo:
            // this.spawnNode.addChild(fish.node, 0, 'Fish_' + id);
            this.spawnNode.addChild(fish.node);
            this.fishes.set(id, fish);
            fish.init(id, no, this.getBreakLevel(id));

            return fish;
        }

        for (let i = 0; i < 7; ++i) {
            if (this.keepFishScriptData[i]) {
                let d = new FishScript();
                d.fishID = this.keepFishScriptData[i].fishID;
                d.fishNo = this.keepFishScriptData[i].fishNo;
                d.fish = addFish(i, d.fishID, d.fishNo);

                this.fishScriptData[i] = d;
            }
        }

        this.keepFishScriptData = [];
    }

    /**
     * 測試額外動態下載 fbx 的 clip，解決初始包體 cconb 過多問題
     * @param fishKind 
     */
    loadFbxAnim(fishKind: number) {
        if (this.fishBundleClip[fishKind] == null) {
            let path = '';
            switch (fishKind) {
                case FishNo.ArcherGoblin:
                case FishNo.SwordMan: {
                    path = 'wood_break';
                    break;
                }
                case FishNo.Viking:
                case FishNo.ArmorSoldier: {
                    path = 'rock_break';
                    break;
                }
                case FishNo.Knight:
                case FishNo.ArmorFighter: {
                    path = 'brick_break';
                    break;
                }
                case FishNo.GoldenKnight: {
                    path = 'obsidian_break';
                    break;
                }
            }
            log('loadFbxAnim, fishKind= ' + fishKind + ', path= ' + path)
            if (path.length > 0) {
                this.fishBundleClip[fishKind] = new bundleAnim();
                Comm.bundle.game.loadDir(`res/fbx/floor_combination/${path}`, AnimationClip, (err, assets) => {
                    if (err) { return }
                    assets.forEach(clip => {
                        this.fishBundleClip[fishKind].clip.push(clip);
                    })
                })
            }
        }
    }

    getFbxAnim(fishKind: number) {
        return this.fishBundleClip[fishKind]? this.fishBundleClip[fishKind].clip : []
    }
}