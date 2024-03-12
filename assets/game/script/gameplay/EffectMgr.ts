import { _decorator, Component, Node, NodePool, Vec3, Animation, v3, tween, Label, instantiate, Tween, game } from 'cc';
import { soundManager, walletManager } from 'db://annin-framework/manager';
import { get3Dto2DPos, playAnime, rInt, trans3DPos, find } from 'db://annin-framework/utils';
import { EFKComponent } from 'db://effekseer/framework/efk_component';
import { SceneEvent, CoinAddNo, EffectNo, SoundName } from './GameDefine';
import { delay, perFrame } from '../system/ToolBox';
import Fish from './Fish';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('EffectMgr')
export default class EffectMgr extends Component {

    private coinAddList: Node[] = [];
    private coinAddTime: number = 0;

    private efkPools = new Map<number, NodePool>();
    private bltHitFxPools = new Map<number, NodePool>();

    onLoad() {
        Game.effectMgr = this;
    }

    update(dt: number) {
        this.coinAddUpdate(dt);
    }

    onDestroy() {
        this.coinAddList.forEach(node => node.destroy());
        this.coinAddList.length = 0;
        this.efkPools.forEach(pool => pool.clear());
        this.efkPools.clear();
        this.bltHitFxPools.forEach(pool => pool.clear());
        this.bltHitFxPools.clear();
        Game.effectMgr = null;
    }

    /**
     * 加錢佇列更新
     * @param dt 
     */
    coinAddUpdate(dt: number) {
        this.coinAddTime -= dt;
        if (this.coinAddTime > 0) return;

        for (let i = 0; i < this.coinAddList.length; ++i) {
            let anim = this.coinAddList[i].getComponent(Animation);
            if (anim) {
                anim.play();
                anim.once(Animation.EventType.FINISHED, () => {
                    // 回收的會變黑字..
                    // comm.dataMgr.setCoinAddNum(anim.node);
                    anim.node.destroy();
                });
                this.coinAddList.splice(i, 1);
                this.coinAddTime = 0.4;
                break;
            }
        }
    }

    /**
     * 擊殺魚時砲台金額的加錢效果 (ex. +150 文字上飄)
     */
    playUserCoinNumAnim(coin: number) {
        if (coin > 0) {
            let turret = Game.main.getTurret();
            if (turret) {
                let coinAdd = Game.dataMgr.getCoinAddNum(CoinAddNo.Normal);  // 3 人砲台都在下方
                if (coinAdd) {
                    coinAdd.getComponent(Label).string = '+' + walletManager.FormatCoinNum(coin);
                    coinAdd.parent = turret.coinAdd;
                    coinAdd.position = Vec3.ZERO;
                    this.coinAddList.push(coinAdd);
                }
            }
        }
    }

    /**
     * 子彈的2D命中效果
     */
    bulletHitEffect(pos: Vec3, no: number) {
        let hitFxPool = this.bltHitFxPools.get(no);
        if (hitFxPool === undefined) {
            hitFxPool = new NodePool();
            this.bltHitFxPools.set(no, hitFxPool);
        }

        let node = hitFxPool.get() ?? Game.dataMgr.getBulletHitEffect(no);
        if (node) {
            let newPos = get3Dto2DPos(Game.cam3D, Game.camUI, pos, Game.node.effectLayer);
            node.setPosition(newPos.add3f(0, 50, 10));
            node.parent = Game.node.effectLayer;

            let root = find(node, 'Node');
            if (root) {
                let anim = root.getComponent(Animation);
                if (anim) {
                    anim.once(Animation.EventType.FINISHED, () => {
                        hitFxPool.put(node);
                    });
                    anim.play();
                }
            }
            else {
                delay(node, 1, () => {
                    hitFxPool.put(node);
                });
            }
        }
    }

    /**
     * 子彈的2D命中效果
     */
    MissileHitEffect(fish: Fish, no: number) {
        if (fish && fish.isUsed()) {
            let idx = fish.getFishId();
            let missileHit = find(Game.node.effectLayer, 'MissileHit' + idx);
            if (!missileHit) {
                let node = Game.dataMgr.getBulletHitEffect(no);
                if (node) {
                    node.parent = Game.node.effectLayer;
                    node.name = 'MissileHit' + idx;

                    let root = find(node, 'Node');
                    if (root) {
                        let following = perFrame(node, () => {
                            if (fish.isUsed()) {
                                let pos = get3Dto2DPos(Game.cam3D, Game.camUI, fish.node.position, Game.node.effectLayer);
                                // pos = v3(pos).add(v3(0, 0, 4));
                                node.setPosition(pos);
                            } else {
                                following.stop();
                                node.destroy();
                            }
                        });
                    }
                    else {
                        tween(node)
                            .delay(1)
                            .call(() => node.destroy())
                            .start();
                    }
                }
            }
        }
    }

    playRollCoin() {
        playAnime(find(Game.node.effectLayer, 'FX_Multiply/FX_Multiply'), 'Clip_FX_Multiply_3');
        soundManager.playEffect(SoundName.coin_02);
    }

    hitFishFly(center: Vec3, list: Fish[], breakList: Fish[], endCB: Function, bCoin: boolean = true) {
        let totalTime = 1;
        let g = -2000;   // 重力

        list.forEach(fish => {
            let dir2D = fish.node.position.subtract(v3(center.x, center.y));
            dir2D = dir2D.normalize().multiply(v3(dir2D.y >= 0 ? 250 : 300, dir2D.y >= 0 ? 250 : 300, dir2D.y >= 0 ? 250 : 300));
            let dir = v3(dir2D.x, dir2D.y, dir2D.y >= 0 ? 250 : 450);  // 彈飛方向
            let rotate = v3(rInt(-60, 60), rInt(-60, 60), rInt(-60, 60)); // 空中自體旋轉方向

            if (bCoin) { fish.dropCoin(); }

            let fakeFish = instantiate(fish.node);
            fakeFish.parent = fish.node.parent;
            fakeFish.setPosition(trans3DPos(fish.node.parent, fish.fishNode))
            fakeFish.setScale(fish.node.scale);

            fish.setUsed(false);
            fish.node.setPosition(v3(9999, 9999));

            let fakeFishAnimNode = find(fakeFish, 'Root/FishNode/RootNode/RootNode');
            if (fakeFishAnimNode) {
                let st = playAnime(fakeFishAnimNode, 'up02');
                if (!st) {
                    Game.fishMgr.delFish(fish, false, true);
                    fakeFish.destroy();
                    return;
                }

                let rotating = perFrame(fakeFish, () => {
                    let dt = game.deltaTime;
                    let pos = fakeFish.position;
                    let rot = fakeFish.eulerAngles;
                    fakeFish.setPosition(pos.x + dir.x * dt * 0.6, pos.y + dir.y * dt * 0.6, pos.z + dir.z * dt * 0.6);
                    fakeFish.setRotationFromEuler(rot.x + rotate.x * dt, rot.y + rotate.y * dt, rot.z + rotate.z * dt);
                    dir.z += g * dt;
                });

                delay(fakeFish, totalTime, () => {
                    rotating.stop();
                    Game.fishMgr.delFish(fish, false, true);
                    fakeFish.destroy();
                });
            }
        });

        breakList.forEach(fish => {
            fish.dropCoin();
            fish.bTowerMostBeDestroy = true;
            Game.fishMgr.delFish(fish, true, false);
        })

        delay(this.node, totalTime, () => {
            if (endCB) { endCB(); }
        });
    }

    getEfkEffect(no: number, pos: Vec3) {
        if (this.efkPools.has(no) === false) {
            this.efkPools.set(no, new NodePool());
        }

        let pool = this.efkPools.get(no)
        let node = pool.get() || instantiate(Game.dataMgr.getEffectPf(no));

        node.setPosition(pos);
        node.parent = Game.node.effectLayer3D;

        return node;
    }

    setEfkEffect(no: number, node: Node) {
        if (this.efkPools.has(no) === false) {
            node.destroy();
            return;
        }

        let pool = this.efkPools.get(no);
        if (pool.size() >= 5) {
            node.destroy();
            return;
        }

        node.active = false;
        // let efk = node.getComponent(EffekseerComponent);
        // if (efk) {
        //     efk.stopEffek();
        // }

        // node.cleanup();
        Tween.stopAllByTarget(node);
        pool.put(node);
    }

    playFall(fish: Fish) {
        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) { return }

        if (fish) {
            this.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, fish.node).add(v3(0, 20, 8)), EffectNo.Fall, 1);
        }
    }

    playCallTower(fish: Fish) {
        if (!fish) return;
        let pos = trans3DPos(Game.node.effectLayer3D, fish.node);
        this.simplePlayEfk(pos.add3f(0, -10, 0), EffectNo.CallTowerLight, 1);
    }

    playGiveup(fish: Fish) {
        if (!fish) return;
        this.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, fish.node), EffectNo.ChangeLight, 1);
    }

    playMeteorite(pos: Vec3) {
        let node = this.getEfkEffect(EffectNo.Meteorite, pos);
        if (node) {
            // node.setScale(v3(0.12, 0.12, 0.12)); todo: 不需要了吧?
            // playAnime(node, 'fish_9_Meteorite');
            delay(node, 4, () => node.destroy());  // 這個不復用
            let efkNode = find(node, 'efk');
            if (efkNode) {
                let efk = efkNode.getComponent(EFKComponent);
                if (efk) {
                    efkNode.active = true;
                    efk.play();
                }
            }
        }
    }

    playTreasureIn(pos: Vec3) {
        this.simplePlayEfk(pos, EffectNo.TreasureIn, 2.5);
    }

    playTowerShattered_HitFire(fish: Fish) {
        if (fish) {
            this.simplePlayEfk(trans3DPos(Game.node.effectLayer3D, fish.node), EffectNo.HitFire, 2);
        }
    }

    playFireBall02(pos: Vec3, lifetime: number, bulletNode: Node) {
        let node = this.getEfkEffect(EffectNo.FireBall02, pos);
        if (node) {
            let efk = node.getComponent(EFKComponent);
            if (efk) {
                node.active = true;
                efk.play();
            }

            let following = perFrame(node, () => {
                if (bulletNode && bulletNode.isValid) {
                    node.setPosition(trans3DPos(Game.node.effectLayer3D, bulletNode));
                }
            });
            delay(node, lifetime, () => {
                following.stop();
                this.setEfkEffect(EffectNo.FireBall02, node);
            });
        }
    }

    playMissileFire(pos: Vec3, lifetime: number, bulletNode: Node) {
        let node = this.getEfkEffect(EffectNo.MissileFire, pos);
        if (node) {
            let efk = node.getComponent(EFKComponent);
            if (efk) {
                node.active = true;
                efk.play();
            }

            let following = perFrame(node, () => {
                if (bulletNode && bulletNode.isValid) {
                    node.setPosition(trans3DPos(Game.node.effectLayer3D, bulletNode));
                }
            });
            delay(node, lifetime, () => {
                node.active = false;
                following.stop();
                this.setEfkEffect(EffectNo.MissileFire, node);
            });
        }
    }

    simplePlayEfk(pos: Vec3, no: EffectNo, dur: number) {
        let node = this.getEfkEffect(no, pos);
        if (node) {
            let efk = node.getComponent(EFKComponent);
            if (efk) {
                node.active = true;
                efk.play();
            }

            delay(node, dur, () => {
                this.setEfkEffect(no, node);
            });
        }
    }
}
