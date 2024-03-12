import { _decorator, Vec3, Component, Node, MeshRenderer, Material, Tween, tween, color, Color, instantiate, SkeletalAnimation, AnimationClip, Animation, v3, game } from 'cc';
import { soundManager } from 'db://annin-framework/manager';
import { find, playAnime, rInt, shake2D, trans3DPos } from 'db://annin-framework/utils';
import { MeshCustomColor } from 'db://annin-framework/components/meshCustomColor';
import { EFKComponent } from 'db://effekseer/framework/efk_component';
import { SceneEvent, EffectNo, FishKind, SoundName } from './GameDefine';
import { delay, perFrame } from '../system/ToolBox';
import Fish from './Fish';
import FishHitAckData from './FishHitAckData';
import MagicPower from './MagicPower';
import { jumpTo } from '../utils/JumpTo';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

const coinForceMap = new Map<number, Vec3[]>();

/**
 * 動作權重值，小不能蓋大
 */
enum ActionWeigth {
    None = 0,
    Hit = 1,
    Up = 2,
    Nervous = 3,
}

@ccclass('FishSetting')
export default class FishSetting extends Component {

    @property
    kind: FishKind = FishKind.None;

    /**
     * 塔的節點 碎塔1，2，3階用[1]換材質，爆塔用[0]撥動畫
     */
    @property(Node)
    towerNode: Node[] = [];

    @property([MeshRenderer])
    meshRenderers: MeshRenderer[] = [];

    @property([Material])
    towerMaterials: Material[] = [];

    /**
     * fish prefab 的 根節點
     */
    private fish: Fish = null;

    /**
     * 不含塔，只有本體的Node
     */
    private fishNode: Node = null;

    /**
     * 當前塔的碎裂等級
     */
    private towerCrackLevel: number = 0;

    /**
     * 待機時可做的動作列表
     */
    private idleAnimName: string[] = ['idle01'];

    private actionWeigth: ActionWeigth = ActionWeigth.None;

    /**
     * 碎塔命中保底記數
     */
    private hitCount: number = 0;

    /**
     * 最高碎塔階級
     */
    private maxCrack: number = 0;

    /**
     * 是否一定要彈跳
     */
    private mustBeJump: boolean = false;

    /**
     * 死亡淡出時間
     */
    private opacityTime: number = 0.2;

    /**
     * 假裝失衡狀態中
     */
    private fakeDeadAction: boolean = false;

    /**
     * 部分需要血量表演
     */
    private bloodValue: number = 0;
    private bBloodAction: boolean = false;
    private bloodTask: Tween<Node> = null;

    private towerBreak: Node = null;      // 碎塔時表演用的
    private hitShakeTween: Tween<Node> = null;  // 擊中抖動 tween(this.node)

    private hitSpeed: number = 1;           // 被打加速
    private hitSpeedRevertTween = null as Tween<Node>;  // 加速恢復


    onLoad() {
        if (this.towerNode[0]) {
            this.towerBreak = instantiate(this.towerNode[0]);
            this.towerBreak.active = true;
        }
    }

    onDisable() {
        if (this.hitShakeTween) {
            this.hitShakeTween.stop();
            this.hitShakeTween = null;
        }

        if (this.hitSpeedRevertTween) {
            this.hitSpeedRevertTween.stop();
            this.hitSpeedRevertTween = null;
        }
    }

    onDestroy() {
        if (this.towerBreak) {
            this.towerBreak.destroy();
            this.towerBreak = null;
        }
    }

    update(dt: number) {
        switch (this.kind) {
            case FishKind.RedWitch: {
                if (this.fish && this.fish.isUsed()) {
                    let floor = find(this.towerNode[0], 'Dummy005/Top');
                    if (floor) {
                        let pos = trans3DPos(this.fishNode, floor);
                        let rootNode = find(this.fishNode, 'RootNode');
                        if (rootNode) {
                            rootNode.setPosition(0, 0, pos.z + 2);
                        }
                    }
                }
                break;
            }
        }
    }

    init(lv: number) {
        this.fish = this.node.getComponent(Fish);
        this.fishNode = find(this.node, 'Root/FishNode');

        this.node.getComponent(MeshCustomColor).opacity = 255;
        this.hitCount = 0;
        this.towerCrackLevel = lv;
        this.mustBeJump = false;
        this.bloodValue = 0;
        this.hitSpeed = 1;

        this.loadFbxAnim(this.kind);
        
        switch (this.kind) {
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier: {
                this.maxCrack = 3;
                break;
            }
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.RedWitch:
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                this.maxCrack = 4;
                break;
            }
            case FishKind.Queen:
            case FishKind.King: {
                this.maxCrack = 5;
                break;
            }
        }

        this.actionWeigth = this.towerCrackLevel == this.maxCrack? ActionWeigth.Nervous : ActionWeigth.None;

        if (this.towerNode[0]) {
            playAnime(this.towerNode[0], 'idle00', AnimationClip.WrapMode.Normal);
            this.towerNode[0].active = !this.towerNode[1];
        }
        if (this.towerNode[1]) {
            let meshRenderer = this.towerNode[1].getComponentInChildren(MeshRenderer);
            if (meshRenderer) {
                let mtl = meshRenderer.materials[0];
                if (mtl) {
                    meshRenderer.setMaterial(this.towerMaterials[0], 0);
                    this._fogDepth = -1;
                    this._fogColor = -1;
                }
            }

            // 皇后國王的盾牌
            switch (this.kind) {
                case FishKind.Queen:
                case FishKind.King: {
                    let Shield = find(this.towerNode[1], 'RootNode');
                    if (Shield) {
                        playAnime(Shield, 'idle00', AnimationClip.WrapMode.Normal);
                    }
                    break;
                }
            }
            this.towerNode[1].active = true;
        }

        // 更新到正確的裂塔狀態
        if (this.towerCrackLevel > 0) {
            this.hitCount = 999;
            this.towerCrackLevel -= 1;
            this.crackChance();
        }
        if (this.towerCrackLevel == this.maxCrack) {
            if (this.towerNode[0]) { this.towerNode[0].active = true; }
            if (this.towerNode[1]) { this.towerNode[1].active = false; }

            if (this.towerNode[0]) {
                let str = 'idle0' + this.towerCrackLevel;
                switch (this.kind) {
                    case FishKind.RedWitch: {
                        let st2 = playAnime(this.towerNode[0], str + '_01', AnimationClip.WrapMode.Normal);
                        if (st2) {
                            if (str == 'idle04') {
                                st2.wrapMode = AnimationClip.WrapMode.Loop;
                                this.playMagicShine(2);
                            }
                        }
                        break;
                    }
                    default: {
                        playAnime(this.towerNode[0], str + '_01', AnimationClip.WrapMode.Normal);
                    }
                } 
            }
        }

        switch (this.kind) {
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                this.idleAnimName = ['idle'];
                let power = this.fish.getComponent(MagicPower);
                if (power) { power.ratio = this.bloodValue; }
                break;
            }
            default: {
                if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
                    switch (this.kind) {
                        case FishKind.SwordMan:
                        case FishKind.ArmorFighter:
                        case FishKind.Queen: {
                            this.idleAnimName = ['idle03'];
                            break;
                        }
                        case FishKind.ArcherGoblin:
                        case FishKind.Viking:
                        case FishKind.ArmorSoldier:
                        case FishKind.Knight:
                        case FishKind.GoldenKnight:
                        case FishKind.King: {
                            this.idleAnimName = ['idle02'];
                            break;
                        }
                    }
                    delay(this.node, 0, () => {
                        this.addIdleChoose();
                    });
                } else {
                    this.idleAnimName = ['idle01'];
                }
                break;
            }
        }

        this.showIdle();
    }

    // 待機動畫
    showIdle() {
        switch (this.kind) {
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.Queen:
            case FishKind.King: {
                let node = find(this.fish.node, 'Root');
                if (node) {
                    let anim = node.getComponent(Animation);
                    if (anim) {
                        anim.play('CommonIdle')
                    }
                }

                this.idleAction();
                break;
            }
            case FishKind.RedWitch: {
                let node = find(this.fish.node, 'Root');
                if (node) {
                    let anim = node.getComponent(Animation);
                    if (anim) {
                        anim.play('CommonIdle')
                    }
                }
                this.idleAction();
                this.playMagicShine(1);

                let efk = find(this.fish.node, 'RootNode/RootNode/Bip001/Bip001 Prop1/Bone_FirePoint/Witch_fire');
                if (efk) {
                    efk.active = true;
                    efk.getComponent(EFKComponent).play();
                }
                break;
            }
            case FishKind.WheelChest: {
                let node = find(this.fish.node, 'Root');
                if (node) {
                    let anim = node.getComponent(Animation);
                    if (anim) {
                        anim.play('CommonIdle')
                    }
                }
                this.idleAction();
                let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                if (efkNode) {
                    let stopefk = (node: Node) => {
                        if (node) {
                            // todo: 確認是否撥放有問題?
                            // let efk = node.getComponent(EffekseerComponent);
                            // if (efk) { efk.stopEffek(0); }
                            node.active = false;
                        }
                    }

                    stopefk(find(efkNode, 'Magic_hit'));
                    stopefk(find(efkNode, 'Magic_power_01'));
                    stopefk(find(efkNode, 'Magic_power_02'));
                    stopefk(find(efkNode, 'Magic_power_03'));
                    stopefk(find(efkNode, 'Magic_power_point'));
                    stopefk(find(efkNode, 'Magic_bowm'));
                    stopefk(find(efkNode, 'Magic_star'));
                    stopefk(find(efkNode, 'Magic_box_bown'));
                    stopefk(find(efkNode, 'Magic_hit_S'));
                }

                find(this.node, 'Root/FloorNode/wheel_idle').active = true;
                find(this.node, 'Root/FloorNode/wheel_dead').active = false;
                break
            }
            case FishKind.TreasureChest: {
                let node = find(this.fish.node, 'Root');
                if (node) {
                    let anim = node.getComponent(Animation);
                    if (anim) {
                        anim.play('CommonIdle')
                    }
                }

                this.idleAction();
                let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                if (efkNode) {
                    let stopefk = (node: Node) => {
                        if (node) {
                            // todo: 確認是否撥放有問題?
                            // let efk = node.getComponent(EffekseerComponent);
                            // if (efk) { efk.stopEffek(0); }
                            node.active = false;
                        }
                    }

                    stopefk(find(efkNode, 'Magic_hit'));
                    stopefk(find(efkNode, 'Magic_power_01'));
                    stopefk(find(efkNode, 'Magic_power_02'));
                    stopefk(find(efkNode, 'Magic_power_03'));
                    stopefk(find(efkNode, 'Magic_power_point'));
                    stopefk(find(efkNode, 'Magic_bowm'));
                    stopefk(find(efkNode, 'Magic_star'));
                    stopefk(find(efkNode, 'Magic_box_bown'));
                    stopefk(find(efkNode, 'Magic_hit_S'));
                }
                break;
            }
        }

        
    }

    // 受傷動畫
    showHurt() {
        this.crackChance();

        if (this.fish.bTowerFire) {
            Game.effectMgr?.playTowerShattered_HitFire(this.fish);
            this.fish.bTowerFire = false;
        }

        let fr = 0;
        switch (this.kind) {
            // case eFishKind.BombGoblin: {
            //     fr = 0.007;
            //     break;
            // }
            // case eFishKind.RedWitch: {
            //     fr = 0.004;
            //     break;
            // }
            case FishKind.Queen: {
                fr = 0.015;
                break;
            }
            case FishKind.King: {
                fr = 0.01;
                break;
            }
        }

        switch (this.kind) {
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.RedWitch:
            case FishKind.Queen:
            case FishKind.King: {
                if (!this.fakeDeadAction) {
                    let r = this.mustBeJump? 0 : Math.random();
                    if (r < 0.3) {
                        let jumpStartPos = v3(this.fishNode.position);
                        let jumpEndPos = v3(rInt(-2, 2), rInt(-2, 2), jumpStartPos.z);
                        jumpTo(this.fishNode, 0.1, jumpStartPos, jumpEndPos, 15).start();
        
                        let state = this.fish.playSkeketonAnim('up_hit', false, () => {
                            let state = this.fish.playSkeketonAnim('up02', false, () => {
                                let state = this.fish.playSkeketonAnim('up_close', false, () => {
                                    this.actionWeigth = this.towerCrackLevel == this.maxCrack? ActionWeigth.Nervous : ActionWeigth.None;
                                    this.idleAction();
                                });
                                if (state) { state.speed = 2; }
                            });
                            if (state) { state.speed = 2; }
                        });
                        if (state) { state.speed = 2; }
                        this.actionWeigth = ActionWeigth.Up;
    
                        let fire = find(this.node, 'Root/FloorNode/3fire');
                        // if (fire) { fire.stopEffek(0); }
                        if (fire) { fire.active = false; }

                        let randSnd = Math.random();
                        switch (this.kind) {
                            case FishKind.ArcherGoblin:
                            case FishKind.SwordMan: {
                                if (randSnd < 0.9) { this.playeffectMusic(2); }
                                break;
                            }
                            case FishKind.Viking:
                            case FishKind.ArmorSoldier:
                            case FishKind.Knight:
                            case FishKind.ArmorFighter:
                            case FishKind.GoldenKnight:
                            case FishKind.King: {
                                if (randSnd < 0.8) { this.playeffectMusic(2); }
                                break;
                            }
                            case FishKind.RedWitch:
                            case FishKind.Queen: {
                                if (randSnd < 0.7) { this.playeffectMusic(2); }
                                break;
                            }
                        }
                    } else if (r >= 0.3 && r < 0.3 + fr && !Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) {
                        this.fakeDead();
    
                        let fire = find(this.node, 'Root/FloorNode/3fire');
                        if (fire) { fire.active = false; }
                    } else {
                        if (this.actionWeigth < ActionWeigth.Up) {
                            this.fish.playSkeketonAnim('hit', false, () => {
                                this.actionWeigth = this.towerCrackLevel == this.maxCrack? ActionWeigth.Nervous : ActionWeigth.None;
                                this.idleAction();
                            });
                            this.actionWeigth = ActionWeigth.Hit;
                            
                            let fire = find(this.node, 'Root/FloorNode/3fire');
                            if (fire) { fire.active = false; }
                        }
                    }
                }
                this.playeffectMusic(0);
                this.mustBeJump = false;
                break;
            }
            case FishKind.TreasureChest: {
                let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                if (efkNode) {
                    let playefk = (node: Node) => {
                        if (node) {
                            node.active = true;
                            let efk = node.getComponent(EFKComponent);
                            if (efk) { efk.play(); }
                        }
                    }
                    if (this.towerCrackLevel < 3) {
                        playefk(find(efkNode, 'Magic_hit_S'));
                    } else {
                        playefk(find(efkNode, 'Magic_hit'));

                        if (this.towerCrackLevel > 3) {
                            let node = find(this.fishNode, 'RootNode/RootNode')
                            tween(node)
                            .call(() => {
                                node.setScale(v3(0.0035 * 1.2, 0.0035 * 1.2, 0.0035 * 1.2));
                            })
                            .delay(0.08)
                            .call(() => {
                                node.setScale(v3(0.0035, 0.0035, 0.0035));
                            })
                            .start()
                        }
                    }
                }
                // let str = `hit0${this.towerCrackLevel + 1}`;
                // this.fish.playSkeketonAnim(str, false, () => {
                //     this.idleAction();
                // });

                let power = this.fish.getComponent(MagicPower);

                // 1表示打死
                if (power && power.ratio < 1) {
                    let value = 0;
                    if (this.bloodValue <= 0.2) {
                        // 血量0 ~ 20%每次浮動0 ~ 0.005
                        value = Math.random() * 0.005 * 13
                    } else if (this.bloodValue > 0.2 && this.bloodValue <= 0.4) {
                        // 血量20 ~ 40%每次浮動0 ~ 0.004
                        value = Math.random() * 0.004 * 11;
                    } else if (this.bloodValue > 0.4 && this.bloodValue <= 0.6) {
                        // 血量40 ~ 60%每次浮動0 ~ 0.003
                        value = Math.random() * 0.003 * 9;
                    } else if (this.bloodValue > 0.6 && this.bloodValue <= 0.8){
                        // 血量60 ~ 80%每次浮動0 ~ 0.002
                        value = Math.random() * 0.002 * 8;
                    } else {
                        // 血量80 ~ 95%每次浮動0 ~ 0.001
                        value = Math.random() * 0.001 * 3;
                    }

                    this.bloodValue += value;
                    this.bloodValue = (this.bloodValue > 0.9)? 0.9 : this.bloodValue;
                    if (!this.bBloodAction) { power.ratio = this.bloodValue; }
                }

                // this.runFakeBlood(0.95);

                if (this.towerCrackLevel > 1) {
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, 200, 0)), EffectNo.OpenGem, 1.5);
                    this.playeffectMusic(2);
                }
                this.playeffectMusic(0);
                break;
            }
            case FishKind.WheelChest: {
                let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                if (efkNode) {
                    let playefk = (node: Node) => {
                        if (node) {
                            node.active = true;
                            let efk = node.getComponent(EFKComponent);
                            if (efk) { efk.play(); }
                        }
                    }
                    if (this.towerCrackLevel < 3) {
                        playefk(find(efkNode, 'Magic_hit_S'));
                    } else {
                        playefk(find(efkNode, 'Magic_hit'));

                        if (this.towerCrackLevel > 3) {
                            let node = find(this.fishNode, 'RootNode/RootNode')
                            tween(node)
                            .call(() => {
                                node.setScale(v3(1 * 1.2, 1 * 1.2, 1 * 1.2));
                            })
                            .delay(0.08)
                            .call(() => {
                                node.setScale(v3(1, 1, 1));
                            })
                            .start()
                        }
                    }
                }
                // let str = `hit0${this.towerCrackLevel + 1}`;
                // this.fish.playSkeketonAnim('hit', false, () => {
                //     this.idleAction();
                // });
                if (this.hitSpeedRevertTween) {
                    this.hitSpeedRevertTween.stop();
                    this.hitSpeedRevertTween = null;
                }

                let tweenStop = () => {
                    if (this.hitSpeed > 1) {
                        this.hitSpeedRevertTween = delay(this.node, 0.5, () => {
                            this.hitSpeed -= 1;
                            tweenStop();
                        })
                    }
                    this.fish.setSkeketonAnimSpeed('idle', this.hitSpeed);
                }

                // 轉輪被打最高40倍速
                this.hitSpeed += this.hitSpeed < 40? 1 : 0;
                tweenStop();

                let power = this.fish.getComponent(MagicPower);

                // 1表示打死
                if (power && power.ratio < 1) {
                    let value = 0;
                    if (this.bloodValue <= 0.2) {
                        // 血量0 ~ 20%每次浮動0 ~ 0.005
                        value = Math.random() * 0.005 * 13
                    } else if (this.bloodValue > 0.2 && this.bloodValue <= 0.4) {
                        // 血量20 ~ 40%每次浮動0 ~ 0.004
                        value = Math.random() * 0.004 * 11;
                    } else if (this.bloodValue > 0.4 && this.bloodValue <= 0.6) {
                        // 血量40 ~ 60%每次浮動0 ~ 0.003
                        value = Math.random() * 0.003 * 9;
                    } else if (this.bloodValue > 0.6 && this.bloodValue <= 0.8){
                        // 血量60 ~ 80%每次浮動0 ~ 0.002
                        value = Math.random() * 0.002 * 8;
                    } else {
                        // 血量80 ~ 95%每次浮動0 ~ 0.001
                        value = Math.random() * 0.001 * 3;
                    }

                    this.bloodValue += value;
                    this.bloodValue = (this.bloodValue > 0.9)? 0.9 : this.bloodValue;
                    if (!this.bBloodAction) { power.ratio = this.bloodValue; }
                }

                // this.runFakeBlood(0.95);

                // if (this.towerCrackLevel > 1) {
                //     Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, 200, 0)), EffectNo.OpenGem, 1.5);
                //     this.playeffectMusic(2);
                // }
                this.playeffectMusic(0);
                break;
            }
        }

        let efkPos = trans3DPos(Game.node.effectLayer3D, this.fish.node);
        switch (this.kind) {
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan: {
                Game.effectMgr?.simplePlayEfk(efkPos.add(v3(0, 13, 0)), Math.random() < 0.2 ? EffectNo.BrokenWoodXL : EffectNo.BrokenWoodS, 0.6);
                break;
            }
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter: {
                Game.effectMgr?.simplePlayEfk(efkPos.add(v3(0, 13, 0)), Math.random() < 0.2 ? EffectNo.BrokenRockXL : EffectNo.BrokenRockS, 0.6);
                break;
            }
            case FishKind.GoldenKnight: {
                Game.effectMgr?.simplePlayEfk(efkPos.add(v3(0, 13, 0)), Math.random() < 0.2 ? EffectNo.BrokenBlackGoldenXL : EffectNo.BrokenBlackGoldenS, 0.6);
                break;
            }
            case FishKind.RedWitch: {
                Game.effectMgr?.simplePlayEfk(efkPos.add(v3(0, 13, 0)), Math.random() < 0.2 ? EffectNo.BrokenMagicRXL : EffectNo.BrokenMagicRS, 1.7);
                break;
            }
            case FishKind.Queen:
            case FishKind.King: {
                Game.effectMgr?.simplePlayEfk(efkPos.add(v3(0, 13, 0)), Math.random() < 0.2 ? EffectNo.BrokenGoldenXL : EffectNo.BrokenGoldenS, 0.8);
                break;
            }
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                break;
            }
        }
    }

    showFire() {
        
    }

    /**
     * 死亡前表演(後續不接死亡)
     */
    showPreDead() {

    }

    /**
     * 假裝要死
     */
    fakeDead() {
        switch (this.kind) {
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.Queen:
            case FishKind.King: {
                this.fakeDeadAction = true;
                // comm.gameCtrl.stopShooting(true);
                this.fish.playSkeketonAnim('up_hit', false, () => {
                    let state = this.fish.playSkeketonAnim('up02', false, () => {
                        let state = this.fish.playSkeketonAnim('up02', false, () => {
                            let state = this.fish.playSkeketonAnim('up02', false, () => {
                                this.fish.playSkeketonAnim('up_close', false, () => {
                                    this.actionWeigth = this.towerCrackLevel == this.maxCrack? ActionWeigth.Nervous : ActionWeigth.None;
                                    this.idleAction();
                                    this.fakeDeadAction = false;
                                    // comm.gameCtrl.stopShooting(false);
                                });
                            });
                            state.speed = 6;
                        })
                        state.speed = 5;
                    });
                    state.speed = 3.5;
                });
                break;
            }
        }
    }
    /**
     * 死亡表演
     */
    showDead() {
        // console.log('showDead this.fish.bUp02Dead= ' + this.fish.bUp02Dead)
        switch (this.kind) {
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.RedWitch:                
            case FishKind.Queen:
            case FishKind.King: {
                if (this.fish.bUp02Dead) {
                    this.fish.playSkeketonAnim('up_hit', false, () => {
                        let state = this.fish.playSkeketonAnim('up02', false, () => {
                            let state = this.fish.playSkeketonAnim('up02', false, () => {
                                let state = this.fish.playSkeketonAnim('up02', false, () => {
                                    let st = playAnime(find(this.fish.node, 'Root'), 'CommonDown');
                                    if (st) {
                                        delay(this.node, st.duration / st.speed, () => {
                                            tween(this.node.getComponent(MeshCustomColor))
                                                .to(this.opacityTime, { opacity: 0 })
                                                .call(() => this.fish.pushToPool())
                                                .start();
    
                                            Game.effectMgr.playFall(this.fish);
                                        });
                                    }
                                    this.playeffectMusic(2);
                                    this.showCoinDrops_8();
                                    this.showBankPigCoin();
                                });
                                state.speed = 6;
                            })
                            state.speed = 5;
                        });
                        state.speed = 3.5;
                    });
                } else {
                    let lv = this.towerCrackLevel;
                    if (this.fish.bTowerMostBeDestroy) {
                        lv = this.maxCrack + 1;
                    }
                    if (lv !== this.towerCrackLevel) {
                        this.towerCrackLevel = lv;
                        this.playTowerAnim();
                        this.playTowerShattered();
                        shake2D(Game.cam3D.node, 0.3, 25, 3.2);
                        this.playeffectMusic(1);
                    }
                    this.playeffectMusic(2);
                    let st = playAnime(find(this.fish.node, 'Root'), 'CommonDown');
                    if (st) {
                        delay(this.node, st.duration / st.speed, () => {
                            tween(this.node.getComponent(MeshCustomColor))
                                .to(this.opacityTime, { opacity: 0 })
                                .call(() => this.fish.pushToPool())
                                .start();

                            Game.effectMgr.playFall(this.fish);
                        })
                    }

                    if (this.fish.bCoinDrop) {
                        this.showCoinDrops_8();
                    }
                    this.showBankPigCoin();
                }
                break;
            }
            case FishKind.TreasureChest: {
                this.towerCrackLevel = this.maxCrack + 1;
                this.playTowerAnim();
                this.playTowerShattered();

                this.shutdownBloodTask();
                this.runFakeBlood(1);

                let hitAck = this.node.getComponent(FishHitAckData);
                let ack = hitAck.ack;
                hitAck.ack = null;

                // 被火炮流彈打到才會進來
                if (this.fish.bTowerMostBeDestroy) {
                    this.fish.playSkeketonAnim('super_get', false, () => {
                        tween(this.node.getComponent(MeshCustomColor))
                            .to(this.opacityTime, { opacity: 0 })
                            .call(() => this.fish.pushToPool())
                            .start();
                    });

                    let bCoinDrop = this.fish.bCoinDrop;
                    delay(Game.main.node, 1.39, () => {
                        if (bCoinDrop) this.showCoinDrops_8();
                        this.showBankPigCoin();
                    });
                } else {
                    let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                    if (efkNode) {
                        let playefk = (node: Node) => {
                            if (node) {
                                node.active = true;
                                node.getComponent(EFKComponent)?.play();
                            }
                        }

                        let stopefk = (node: Node) => {
                            if (node) {
                                node.active = false;
                            }
                        }

                        playefk(find(efkNode, 'Magic_power_point'));

                        delay(efkNode, 2, () => {
                            playefk(find(efkNode, 'Magic_bowm'));
                            stopefk(find(efkNode, 'Magic_power_point'));
                            playefk(find(efkNode, 'Magic_star'));

                            playAnime(efkNode, 'StarPath');

                            stopefk(find(efkNode, 'Magic_power_01'));
                            stopefk(find(efkNode, 'Magic_power_02'));
                            stopefk(find(efkNode, 'Magic_power_03'));

                            let power = this.fish.getComponent(MagicPower);
                            if (power) { power.ratio = 0; }
                        })

                        delay(this.towerNode[0], 2.1, () => {
                            playAnime(this.towerNode[0], 'idle04', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.2, () => {
                            playAnime(this.towerNode[0], 'idle03', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.3, () => {
                            playAnime(this.towerNode[0], 'idle02', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.4, () => {
                            playAnime(this.towerNode[0], 'idle01', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.5, () => {
                            playAnime(this.towerNode[0], 'idle00', AnimationClip.WrapMode.Normal);
                        })

                        delay(efkNode, 2 + 0.7, () => {
                            playefk(find(efkNode, 'Magic_box_bown'));
                            stopefk(find(efkNode, 'Magic_star'));

                            this.fish.playSkeketonAnim('super_get', false, () => {
                                tween(this.node.getComponent(MeshCustomColor))
                                    .to(this.opacityTime, { opacity: 0 })
                                    .call(() => this.fish.pushToPool())
                                    .start();
                            });

                            let bCoinDrop = this.fish.bCoinDrop;
                            let highOdds = (ack && Math.round(ack.coin / ack.bet) >= 30);
                            delay(Game.main.node, 1.39, () => {
                                if (bCoinDrop) {
                                    if (highOdds) this.showCoinDrops_8_6();
                                    else this.showCoinDrops_8();
                                }
                                this.showBankPigCoin();
                            });
                        });

                        this.playeffectMusic(1);
                    }
                }
                break;
            }
            case FishKind.WheelChest: {
                this.towerCrackLevel = this.maxCrack + 1;
                this.playTowerAnim();
                this.playTowerShattered();

                this.shutdownBloodTask();
                this.runFakeBlood(1);

                let hitAck = this.node.getComponent(FishHitAckData);
                let ack = hitAck.ack;
                hitAck.ack = null;

                // 被火炮流彈打到才會進來
                if (this.fish.bTowerMostBeDestroy) {
                    // Dead 0.5秒
                    this.fish.playSkeketonAnim('Dead', false, () => {
                        this.fish.playSkeketonAnim('Dead', false, () => {
                            this.fish.playSkeketonAnim('Dead', false, () => {
                                tween(this.node.getComponent(MeshCustomColor))
                                    .to(this.opacityTime, { opacity: 0 })
                                    .call(() => this.fish.pushToPool())
                                    .start();
                            });
                        })
                    })
                    find(this.node, 'Root/FloorNode/wheel_idle').active = false;
                    find(this.node, 'Root/FloorNode/wheel_dead').active = true;
                    let bCoinDrop = this.fish.bCoinDrop;
                    delay(Game.main.node, 1.39, () => {
                        if (bCoinDrop) this.showCoinDrops_8();
                    });
                } else {
                    let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                    if (efkNode) {
                        let playefk = (node: Node) => {
                            if (node) {
                                node.active = true;
                                node.getComponent(EFKComponent)?.play();
                            }
                        }

                        let stopefk = (node: Node) => {
                            if (node) {
                                node.active = false;
                            }
                        }

                        playefk(find(efkNode, 'Magic_power_point'));

                        delay(efkNode, 2, () => {
                            playefk(find(efkNode, 'Magic_bowm'));
                            stopefk(find(efkNode, 'Magic_power_point'));
                            playefk(find(efkNode, 'Magic_star'));

                            playAnime(efkNode, 'StarPath2');

                            stopefk(find(efkNode, 'Magic_power_01'));
                            stopefk(find(efkNode, 'Magic_power_02'));
                            stopefk(find(efkNode, 'Magic_power_03'));

                            let power = this.fish.getComponent(MagicPower);
                            if (power) { power.ratio = 0; }
                        })

                        delay(this.towerNode[0], 2.1, () => {
                            playAnime(this.towerNode[0], 'idle04', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.2, () => {
                            playAnime(this.towerNode[0], 'idle03', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.3, () => {
                            playAnime(this.towerNode[0], 'idle02', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.4, () => {
                            playAnime(this.towerNode[0], 'idle01', AnimationClip.WrapMode.Normal);
                        })

                        delay(this.towerNode[0], 2.5, () => {
                            playAnime(this.towerNode[0], 'idle00', AnimationClip.WrapMode.Normal);
                        })

                        delay(efkNode, 2 + 0.7, () => {
                            playefk(find(efkNode, 'Magic_box_bown'));
                            stopefk(find(efkNode, 'Magic_star'));

                            if (this.fish.bCoinDrop) {
                                this.showCoinDrops_8();
                            }

                            // Dead 0.5秒
                            this.fish.playSkeketonAnim('Dead', false, () => {
                                this.fish.playSkeketonAnim('Dead', false, () => {
                                    this.fish.playSkeketonAnim('Dead', false, () => {
                                        tween(this.node.getComponent(MeshCustomColor))
                                            .to(this.opacityTime, { opacity: 0 })
                                            .call(() => this.fish.pushToPool())
                                            .start();
                                    });
                                })
                            })
                            find(this.node, 'Root/FloorNode/wheel_idle').active = false;
                            find(this.node, 'Root/FloorNode/wheel_dead').active = true;

                            let node = find(this.fishNode, 'RootNode/RootNode')
                            tween(node)
                            .call(() => {
                                node.setScale(v3(1 * 1.2, 1 * 1.2, 1 * 1.2));
                            })
                            .delay(0.08)
                            .call(() => {
                                node.setScale(v3(1, 1, 1));
                            })
                            .start()
                        });

                        this.playeffectMusic(1);
                    }
                }
                break;
            }
        }
    }

    /**
     * 主場豬幣收集
     */
    showBankPigCoin() {
        if (Game.bgMgr.getBGID() !== 0)
            return;
        if (Game.piggyBank.canDropPigCoin === false)
            return;

        let tmp = v3();
        let feet = find(this.fishNode, 'RootNode');
        let screenPos = Game.cam3D.worldToScreen(feet.worldPosition, tmp);
        let worldPos = Game.camUI.screenToWorld(screenPos, tmp);
        let posEL = Game.camUI.convertToUINode(worldPos, Game.node.effectLayer, tmp).add3f(0, 20, 0);
        Game.piggyBank.dropPigCoin(posEL, () => {
            Game.piggyBank.updateBankState();
        });
    }

    /**
     * 從中心往上噴金幣落
     */
    showCoinDrops(num: number) {
        let feet = find(this.fishNode, 'RootNode');
        let posFL = trans3DPos(Game.fishMgr.getSpawnNode(), feet);
        let goalFL = Game.coinDrops.getTurretPivotFL3D();

        if (coinForceMap.has(num) === false) {
            coinForceMap.set(num, Game.coinDrops.getConeForces_Z(num, v3(100, 0, 400), 0));
        }

        let random = Math.random;
        let template = coinForceMap.get(num);
        let randomlyForces: Vec3[] = [];
        for (let v of template) {
            let force = v3(v).multiply3f(
                1 + random() * 0.1,
                1 + random() * 0.1,
                1 + random() * 0.1
            );
            randomlyForces.push(force);
        }

        Game.coinDrops.dropSmallCoin3D(posFL, goalFL, randomlyForces);
        delay(Game.main.node, 1, () => {
            Game.effectMgr.playRollCoin();
        });

        // todo: 同一frame只能撥放一次
        // soundManager.playEffect('13', false, false, true);
        soundManager.playEffect(SoundName.tower06_blow2);
    }

    showCoinDrops_8() {
        this.showCoinDrops(8);
    }

    showCoinDrops_8_6() {
        this.showCoinDrops(8);
        delay(Game.main.node, 0.07, () => this.showCoinDrops(6));
    }

    idleAction() {
        switch (this.kind) {
            case FishKind.None:
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier:
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.Queen:
            case FishKind.King: {
                let r = Math.random();
                let n = r < 0.5? 0 : r < 0.8? 1: 2;
                n = n < this.idleAnimName.length? n : 0;
                let name = this.actionWeigth == ActionWeigth.Nervous? 'nervous' : this.idleAnimName[n];

                this.fish.playSkeketonAnim(name, false, () => {
                    this.idleAction();
                });
                break;
            }
            case FishKind.RedWitch: {
                let r = Math.random();
                let n = r < 0.5? 0 : r < 0.8? 1: 2;
                n = n < this.idleAnimName.length? n : 0;
                let name = this.actionWeigth == ActionWeigth.Nervous? 'nervous' : this.idleAnimName[n];

                this.fish.playSkeketonAnim(name, false, () => {
                    this.idleAction();
                });

                if (name == 'idle02') {
                    let fire = find(this.node, 'Root/FloorNode/3fire');
                    if (fire) {
                        fire.active = true;
                        fire.getComponent(EFKComponent)?.play();
                    }
                }
                break;
            }
            case FishKind.TreasureChest: {
                let name = this.idleAnimName[0];
                this.fish.playSkeketonAnim(name, false, () => {
                    this.idleAction();
                });
                break;
            }
            case FishKind.WheelChest: {
                let name = this.idleAnimName[0];
                this.fish.playSkeketonAnim(name, true);
                break;
            }
        }
    }

    /**
     * 碎塔表演
     */
    playTowerAnim() {
        if (this.towerNode[0]) {

            let str = 'idle0' + this.towerCrackLevel;

            switch (this.kind) {
                case FishKind.WheelChest:
                case FishKind.TreasureChest: {
                    playAnime(this.towerNode[0], str, AnimationClip.WrapMode.Normal);

                    let efkNode = find(this.node, 'Root/FloorNode/Magic_Box_open');
                    if (efkNode) {
                        let playefk = (node: Node) => {
                            if (node) {
                                node.active = true;
                                node.getComponent(EFKComponent)?.play();
                            }
                        }
    
                        if (this.towerCrackLevel == 1) {
                            playefk(find(efkNode, 'Magic_power_01'));
                        } else if (this.towerCrackLevel == 3) {
                            playefk(find(efkNode, 'Magic_power_02'));
                        } else if (this.towerCrackLevel == this.maxCrack + 1) {
                            playefk(find(efkNode, 'Magic_power_01'));
                            playefk(find(efkNode, 'Magic_power_02'));
                            playefk(find(efkNode, 'Magic_power_03'));
                        }
                    }

                    break;
                }
                default: {
                    let baseShow = () => {
                        // 另外建一個塔去表演
                        if (this.towerNode[0]) { this.towerNode[0].active = true; }
                        if (this.towerNode[1]) { this.towerNode[1].active = false; }

                        if (this.node.parent && this.towerBreak) {
                            let tower = this.towerBreak;
                            tower.parent = this.node.parent;
                            tower.setPosition(trans3DPos(this.node.parent, this.fishNode));
                            tower.setRotationFromEuler(v3(90, 0, 0));
                            tower.setScale(this.node.scale);

                            let st = playAnime(tower, str, AnimationClip.WrapMode.Normal);
                            if (st) {
                                delay(tower, st.duration / st.speed, () => {
                                    tower.parent = null;  // tower.destroy();
                                });
                            }
                            else {
                                tower.parent = null;  // tower.destroy();
                            }
                        }

                        switch (this.kind) {
                            case FishKind.RedWitch: {
                                let st2 = playAnime(this.towerNode[0], str + '_01');
                                if (st2) {
                                    if (str == 'idle04') {
                                        st2.wrapMode = AnimationClip.WrapMode.Loop;
                                        this.playMagicShine(2);
                                    } else {
                                        st2.wrapMode = AnimationClip.WrapMode.Normal;
                                    }
                                }
                                break;
                            }
                            default: {
                                playAnime(this.towerNode[0], str + '_01', AnimationClip.WrapMode.Normal);
                            }
                        } 
                    }
                    if (this.towerCrackLevel < this.maxCrack) {
                        if (this.towerNode[1]) {
                            let meshRenderer = this.towerNode[1].getComponentInChildren(MeshRenderer);
                            if (meshRenderer) {
                                let mtl = meshRenderer.materials[0];
                                if (mtl) {
                                    meshRenderer.setMaterial(this.towerMaterials[this.towerCrackLevel], 0);
                                    this._fogDepth = -1;
                                    this._fogColor = -1;
                                }
                            }
                            // 皇后國王的盾牌
                            switch (this.kind) {
                                case FishKind.Queen:
                                case FishKind.King: {
                                    let Shield = find(this.towerNode[1], 'RootNode');
                                    if (Shield) {
                                        // 不管啦!寫死
                                        let str2 = str == 'idle02'? 'idle02_01' : str;
                                        playAnime(Shield, str2, AnimationClip.WrapMode.Normal);
                                    }
                                    break;
                                }
                            } 
                        } else {
                            baseShow();
                        }
                    } else {
                        baseShow();
                    }
                    break;
                }
            }
        }
    }

    /**
     * 增加待機動作選擇性
     */
    addIdleChoose() {
        switch (this.kind) {
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                break;
            }
            default: {
                this.idleAnimName = [];
                this.idleAnimName.push('idle01');
                this.idleAnimName.push('idle02');
                this.idleAnimName.push('idle03');                
                break;
            }
        }
    }

    /**
     * 碎塔機率
     */
    crackChance() {
        this.hitCount += 1;

        let maxHit: number = 5;
        let chance: number = 0.25;

        switch (this.kind) {
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan:
            case FishKind.Viking:
            case FishKind.ArmorSoldier: {
                maxHit = 5;
                chance = this.towerCrackLevel == 0? 0.35 : 0.25;
                break;
            }
            case FishKind.Knight:
            case FishKind.ArmorFighter:
            case FishKind.GoldenKnight:
            case FishKind.RedWitch: {
                maxHit = 10;
                chance = this.towerCrackLevel == 0? 0.45 : 0.65;
                break;
            }
            case FishKind.Queen:
            case FishKind.King: {
                maxHit = 20;
                chance = this.towerCrackLevel == 0? 0.70 : 0.80;
                break;
            }
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                maxHit = 20;
                chance = this.towerCrackLevel == 0? 0.80 : 0.85;
                break;
            }
            default: {
                maxHit = 999;
                chance = 2;
                break;
            }
        }

        if (this.hitCount >= maxHit) {
            // 保底
            if (this.towerCrackLevel < this.maxCrack) {
                this.towerCrackLevel += 1;
                this.playTowerAnim();
                this.playTowerShattered();

                if (this.towerCrackLevel == this.maxCrack) {
                    this.actionWeigth = this.actionWeigth <= ActionWeigth.Nervous? ActionWeigth.Nervous : this.actionWeigth;
                }
            }
            this.hitCount = 0;
        } else {
            if (this.towerCrackLevel < this.maxCrack) {
                let rand = Math.random();
                if (rand > chance) {
                    this.towerCrackLevel += 1;
                    this.playTowerAnim();
                    this.playTowerShattered();

                    if (this.towerCrackLevel == this.maxCrack) {
                        this.actionWeigth = this.actionWeigth <= ActionWeigth.Nervous? ActionWeigth.Nervous : this.actionWeigth;
                    }
                    this.hitCount = 0;
                }
            }
        }
    }

    /**
     * 碎裂特效
     */
    playTowerShattered() {
        switch (this.kind) {
            case FishKind.ArcherGoblin:
            case FishKind.SwordMan: {
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered_Wood, 2)
                } else if (this.towerCrackLevel > 1) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered_Wood2, 2)
                } else {
                    break;
                }
                // console.log('playTowerShattered level= ' + level)
                // Game.effectMgr?.playTowerShattered_Wood(this.fish, level);
                break;
            }
            case FishKind.Viking:
            case FishKind.ArmorSoldier: {
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered, 1)
                } else if (this.towerCrackLevel > 1) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered2, 1)
                } else {
                    break;
                }
                // Game.effectMgr?.playTowerShattered(this.fish, level);
                break;
            }
            case FishKind.Knight:
            case FishKind.ArmorFighter: {
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered, 1)
                } else if (this.towerCrackLevel > 2) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered2, 1)
                } else {
                    break;
                }
                // Game.effectMgr?.playTowerShattered(this.fish, level);
                break;
            }
            case FishKind.GoldenKnight: {
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered, 1)
                } else if (this.towerCrackLevel > 2) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerShattered2, 1)
                } else {
                    break;
                }
                // Game.effectMgr?.playTowerShattered(this.fish, level);
                break;
            }
            case FishKind.RedWitch: {
                
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerBlastMagicR, 2)
                } else if (this.towerCrackLevel > 2) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerBlastMagicR2, 2)
                } else {
                    break;
                }
                // Game.effectMgr?.playTowerShattered_MagicR(this.fish, level);
                break;
            }
            case FishKind.Queen:
            case FishKind.King: {
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerBlastGolden, 2);
                } else if (this.towerCrackLevel > 2) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                    Game.effectMgr?.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, this.fish.node).add(v3(0, -20, 8)), EffectNo.TowerBlastGolden2, 2);
                } else {
                    break;
                }
                // Game.effectMgr?.playTowerShattered_Golden(this.fish, level);
                break;
            }
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                let level: number = 0;
                if (this.towerCrackLevel > this.maxCrack) {
                    level = 0;
                } else if (this.towerCrackLevel > 2) {
                    level = 1;
                    if (this.fish.bTowerFire) {
                        Game.effectMgr?.playTowerShattered_HitFire(this.fish);
                        this.fish.bTowerFire = false;
                    }
                } else {
                    break;
                }
                break;
            }
        }
    }

    private _fogDepth = -1;
    fogDepth(value: number) {
        if (this._fogDepth === value) {
            return;
        }

        this._fogDepth = value;
        this.meshRenderers.forEach(meshRenderer => {
            meshRenderer?.materials.forEach(material => {
                material?.setProperty('fogDepth', value, 0);
            });
        });
    }

    private _fogColor = color(0.1, 0.1, 0.1).toRGBValue();
    fogColor(color: Color) {
        if (this._fogColor === color.toRGBValue()) {
            return;
        }

        this._fogColor = color.toRGBValue();
        this.meshRenderers.forEach(meshRenderer => {
            meshRenderer?.materials.forEach(material => {
                material?.setProperty('fogColor', color, 0);
            });
        });
    }

    playMoveSmoke() {
        let node = find(this.node, 'Root/FloorNode/Move_Smoke');
        if (node) {
            node.active = true;
            let efk = node.getComponent(EFKComponent);
            if (efk) { efk.play(); }
        }
    }

    /**
     * 漂浮塔的閃亮效果 1: 常駐 2: 破裂只剩漂浮部分
     * @param id 
     */
    playMagicShine(id: number) {
        let str = '';
        switch (this.kind) {
            case FishKind.RedWitch: {
                str = 'R'
                break;
            }
        }

        let always = find(this.node, 'Root/FloorNode/Tower_Magic_' + str + '/Always');
        let broken = find(this.node, 'Root/FloorNode/Tower_Magic_' + str + '/Magic_Broken_' + str);
        switch (id) {
            case 1: {
                if (always) { always.active = true; }
                if (broken) { broken.active = false; }
                break;
            }
            case 2: {
                if (always) { always.active = false; }
                if (broken) { broken.active = true; }
                break;
            }
        }
    }

    setRimLight(index: number, value: number, color?: Color) {
        let meshRenderer = this.meshRenderers[index];
        if (meshRenderer) {
            meshRenderer.materials.forEach(material => {
                // todo: 這裡可能有抱錯??
                // if (!material)
                //     return;
                // if (!material.getProperty('diffuseColor', 0))
                //     return;
                // if (isNaN(material.getProperty('rimStrength', 0)) === true)
                //     return;

                // if (color) {
                //     material.setProperty('diffuseColor', color, 0);
                // }
                // material.setProperty('rimStrength', value, 0);

                material?.setProperty('rimStrength', value, 0);
            });
        }
    }

    hitShakeFish(times: number) {
        let fishNode = this.node;
        let scale = v3(fishNode.scale.x, fishNode.scale.y, fishNode.scale.z);

        if (this.hitShakeTween) {
            return;
        }

        this.hitShakeTween = tween(fishNode)
            .call(() => {
                fishNode.setScale(v3(fishNode.scale.x * 1.04, fishNode.scale.y * 1.04, fishNode.scale.z * 1.04));
            })
            .delay(0.06)
            .call(() => {
                fishNode.setScale(v3(fishNode.scale.x >= 0 ? scale.x : -scale.x, scale.y, scale.z));
            })
            .delay(0.04)
            .union()
            .repeat(times)
            .call(() => {
                this.hitShakeTween = null;
            })
            .start();
    }

    hitMustBeBreak() {
        this.hitCount += 999;
        this.mustBeJump = true;
    }

    setTowerToMaxCrack() {
        // 後續流程會+1，才可正常接上碎塔
        this.towerCrackLevel = this.maxCrack - 1;
    }

    getBreakLv() {
        return this.towerCrackLevel;
    }

    /**
     * 假裝跑滿條
     * @param max 如為1則為真跑
     * @returns 
     */
    runFakeBlood(max: number) {
        if (this.bBloodAction)
            return;

        if (max < 1 && Math.random() > 0.04)
            return;

        let power = this.fish.getComponent(MagicPower);
        // 1表示打死
        if (power && power.ratio < 1) {
            this.bBloodAction = true;
            let bAdd: boolean = true;
            this.bloodTask = perFrame(power.node, () => {
                let r = power.ratio;
                if (r >= 1) {
                    this.shutdownBloodTask();
                } else {
                    if (bAdd) {
                        r = r + game.deltaTime * 5;
                        if (r >= max) {
                            bAdd = false;
                            r = max;
                        }
                        power.ratio = r;
                    } else {
                        r = r - game.deltaTime * 2;
                        if (r <= this.bloodValue) {
                            r = this.bloodValue;
                            power.ratio = r;
                            this.shutdownBloodTask();
                        }
                        power.ratio = r;
                    }
                }
            });
        }
    }

    /**
     * 刪除血條更新
     */
    shutdownBloodTask() {
        this.bBloodAction = false;
        if (this.bloodTask) {
            this.bloodTask.stop();
            this.bloodTask = null;
        }
    }

    /* type: 音效類型 0: 受擊 1: 爆塔 2: 失衡 */
    playeffectMusic(type: number) {
        switch (this.kind) {
            case FishKind.ArcherGoblin: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower1_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower1_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_01); break; }
                }
                break;
            }
            case FishKind.SwordMan: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower1_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower1_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_02); break; }
                }
                break;
            }
            case FishKind.Viking: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower2_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower2_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_03); break; }
                }
                break;
            }
            case FishKind.ArmorSoldier: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower2_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower2_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_04); break; }
                }
                break;
            }
            case FishKind.Knight: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower3_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower3_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_05); break; }
                }
                break;
            }
            case FishKind.ArmorFighter: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower3_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower3_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_06); break; }
                }
                break;
            }
            case FishKind.GoldenKnight: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower3_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower3_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_07); break; }
                }
                break;
            }
            case FishKind.RedWitch: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower4_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower4_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_09); break; }
                }
                break;
            }
            case FishKind.WheelChest:
            case FishKind.TreasureChest: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower06_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower06_blow1); break; }
                    case 2: { soundManager.playEffect(SoundName.M_10); break; }
                }
                break;
            }
            case FishKind.Queen: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower3_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower5_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_11); break; }
                }
                break;
            }
            case FishKind.King: {
                switch (type) {
                    case 0: { soundManager.playEffect(SoundName.tower3_hit); break; }
                    case 1: { soundManager.playEffect(SoundName.tower5_blow); break; }
                    case 2: { soundManager.playEffect(SoundName.M_12); break; }
                }
                break;
            }
        }
    }

    loadFbxAnim(fishKind: number) {
        let fbxClip = Game.fishMgr.getFbxAnim(fishKind);
        if (fbxClip.length > 0) {
            if (this.towerBreak && this.towerNode[0]) {

                let add: AnimationClip[] = [];
                fbxClip.forEach(clip => {
                    let ok = true;
                    this.towerBreak.getComponent(SkeletalAnimation).clips.forEach(clip2 => {
                        if (clip == clip2) {
                            ok = false;
                        }
                    })
                    if (ok) { add.push(clip) }
                })

                add.forEach(clip => {
                    this.towerNode[0].getComponent(SkeletalAnimation).addClip(clip);
                    this.towerBreak.getComponent(SkeletalAnimation).addClip(clip);
                })
            }
        }
    }
}
