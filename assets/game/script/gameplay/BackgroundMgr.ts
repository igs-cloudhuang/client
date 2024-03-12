import { _decorator, Component, Node, SkeletalAnimation, SpriteFrame, color, Color, AnimationClip, instantiate, v3 } from 'cc';
import { soundManager } from 'db://annin-framework/manager';
import { find, playAnime, trans3DPos } from 'db://annin-framework/utils';
import { Comm } from 'db://annin-framework/system/comm';
import { SceneEvent, OtherNo, SoundName } from './GameDefine';
import { delay } from '../system/ToolBox';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('BackgroundMgr')
export default class BackgroundMgr extends Component {

    @property(Node)
    bgList: Node[] = [];

    @property(Node)
    scene2DList: Node[] = [];

    @property(Node)
    scoreStone: Node = null;

    @property(SkeletalAnimation)
    doorAnim: SkeletalAnimation = null;

    @property(SpriteFrame)
    treasureKey: SpriteFrame = null;

    // 場景上的事件 game.SceneMode
    private bEventOfScene = new Map<number, boolean>();
    private ambientColor = color(255, 255, 255);
    private fogColor = color(25, 25, 25);
    private bgID = 0;

    onLoad() {
        Game.bgMgr = this;
    }

    start() {
        this.setBG(0);
    }

    onDestroy() {
        Game.bgMgr = null;
    }

    /**
     * 設定背景
     */
    setBG(id: number) {
        this.bgList.forEach((node, i) => {
            node.active = (i === id);
        });

        this.scene2DList.forEach((node, i) => {
            node.active = (i === id);
        });

        switch (id) {
            case 0: this.ambientColor = color(100, 200, 137); break;
            case 1: this.ambientColor = color(0, 195, 255); break;
            case 2: this.ambientColor = color(60, 60, 200); break;
        }

        switch (id) {
            case 0: this.fogColor = color(56, 48, 24); break;
            case 1: this.fogColor = color(24, 24, 48); break;
            case 2: this.fogColor = color(24, 24, 48); break;
        }

        this.bgID = id;
    }

    setRedSkyEffect(ok: boolean) {
        this.scene2DList.forEach(node => {
            let sky = find(node, 'SkyLight');
            if (sky) { sky.active = !ok; }
            let red = find(node, 'RedSky');
            if (red) { red.active = ok; }
        });
    }

    getBG(id: number): Node {
        return this.bgList[id];
    }

    getBGID(): number {
        return this.bgID;
    }

    switchSceneEvent(no: SceneEvent, ok: boolean) {
        this.bEventOfScene.set(no, ok);
        // 檢查是否可用道具卡
        Comm.state.isMainGameLock = Game.uiCtrl.checkUseItem();
    }

    isEventOfScene(no: SceneEvent): boolean {
        if (this.bEventOfScene.has(no) === true) {
            return this.bEventOfScene.get(no);
        }
        return false;
    }

    addDoorOpenEfk() {
        let pos = trans3DPos(Game.node.effectLayer3D, this.doorAnim.node).add(v3(-8.5, 62, 0));
        Game.effectMgr.playTreasureIn(pos);
    }

    openTheDoor(endCB: Function) {
        let name = 'idle01';
        let state = this.doorAnim.getState(name);
        if (state) {
            state.speed = 1.0;
            state.wrapMode = AnimationClip.WrapMode.Normal;
            this.doorAnim.play(name);
        }

        if (endCB) {
            delay(this.doorAnim.node, 1.5, () => endCB());
        }
    }

    closeTheDoor() {
        let name = 'idle02';
        let state = this.doorAnim.getState(name);
        if (state) {
            state.speed = 4.0;
            state.wrapMode = AnimationClip.WrapMode.Normal;
            this.doorAnim.play(name);
        }
    }

    getFogColor(): Color {
        return this.fogColor;
    }

    getAmbientColor(): Color {
        return this.ambientColor;
    }

    showKey() {
        let hole = Game.bgMgr.getBG(0).getChildByName('KeyHole');
        let pos = Game.cam3D.convertToUINode(hole.worldPosition, Game.node.effectLayer.parent);
        let key = Game.dataMgr.getTreasureKeyNode();
        key.setPosition(pos.add3f(0, 120, 0));
        key.parent = Game.node.effectLayer;
        playAnime(key, 'Key_In', AnimationClip.WrapMode.Normal, () => {
            key.destroy();
        });
    }

    getStoneNode() {
        return this.scoreStone;
    }

    showTreasureTitle() {
        let node = instantiate(Game.dataMgr.getOtherPf(OtherNo.BonusTitle));
        if (node) {
            node.parent = Game.node.buttonUpperLayer;

            let st = playAnime(node, 'BonusTitle');
            delay(node, st.duration / st.speed, () => node.destroy());

            delay(this.scoreStone, 3, () => {
                let st2 = playAnime(this.scoreStone, 'BonusTowerEf_Ingame');
                delay(this.scoreStone, st2.duration / st2.speed, () => {
                    Game.main.stopShooting(false);
                    playAnime(this.scoreStone, 'BonusTowerEf_loop');
                });
                soundManager.playEffect(SoundName.Treasure02);
            });
        }
    }

    showGoldPigTitle() {
    }

}
