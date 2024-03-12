import { _decorator, Node, Vec3, v3, Component, Prefab, NodePool, Tween, tween, instantiate, game } from 'cc';
import { Automata } from 'db://annin-framework/system';
import { delay, perFrame } from '../system/ToolBox';
import Game from '../system/Game';

const create_point = (node: Node, p: Vec3, v: Vec3) => {
    return { node: node, p: v3(p), v: v3(v) };
};

const create_plane = (n: Vec3, d: number) => {
    return { n: v3(n), d: d };
}

const distance_plane_point = (plane: any, point: any) => {
    return (plane.n.dot(point.p) + plane.d) as number;
};

const reflect = (n: Vec3, v: Vec3) => {
    const d = v.dot(n);
    return v3(
        v.x - (2. * d * n.x),
        v.y - (2. * d * n.y),
        v.z - (2. * d * n.z)
    );
};

const { ccclass, property } = _decorator;

@ccclass('CoinDrops')
export default class CoinDrops extends Component {

    @property(Prefab)
    smallCoin3D: Prefab = null;

    private smallCoinPool = new NodePool();

    onLoad() {
        Game.coinDrops = this;
    }

    onDestroy() {
        this.smallCoinPool.clear();
        Game.coinDrops = null;
    }

    dropSmallCoin3D(posFL: Vec3, goalFL: Vec3, forces: Vec3[], onFinished?: Function) {
        let physics = {
            simulator: null as Tween<Node>,
            particles: null as any[],
            gravity: null as Vec3,
            plane: null as any,
            k: null as number
        };

        let automata = new Automata('init', {
            init: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    physics.particles = [];
                    physics.gravity = v3(0, 0, -2500);
                    physics.plane = create_plane(v3(0, 0, 1), 0);
                    physics.k = 0.4;

                    let particles = physics.particles;
                    forces.forEach(v => {
                        let coin = this.addSmallCoin2Scene(posFL);
                        particles.push(create_point(coin, posFL, v));
                        this.spinCoin3D(coin, 60);
                    });

                    // 啟動物理模擬的 timer
                    physics.simulator = perFrame(this.node, () => {
                        if (fsm.isRunning(fsm.states.simulate) === false) {
                            physics.simulator.stop();
                            physics.simulator = null;
                            return;
                        }
                        fsm.tick(game.deltaTime);
                    });

                    // N 秒後收回到炮台
                    delay(this.node, 0.57, () => {
                        fsm.transit(fsm.states.collect);
                        fsm.tick();
                    });

                    // 切換到 simulate
                    fsm.transit(fsm.states.simulate);
                    fsm.tick(1e-4);
                }
            },
            simulate: (fsm: Automata, dt: number) => {
                const gravity = physics.gravity;
                const plane = physics.plane;
                const k = physics.k;

                for (let p of physics.particles) {
                    // 看噴金幣調整位移速度
                    const gra = gravity;
                    p.v.add3f(gra.x * dt, gra.y * dt, gra.z * dt);

                    const vel = p.v;
                    p.p.add3f(vel.x * dt, vel.y * dt, vel.z * dt);

                    let d = distance_plane_point(plane, p);
                    if (d <= 10) {
                        const nor = plane.n;
                        d = Math.abs(d);
                        p.p.add3f(nor.x * d, nor.y * d, nor.z * d);    // 移到碰撞水平面以上
                        p.v = reflect(plane.n, p.v);
                        p.v.multiplyScalar(k);
                    }
                    p.node.setPosition(p.p);
                }
            },
            collect: (fsm: Automata) => {
                if (fsm.isEntering() === true) {
                    const num = physics.particles.length;
                    const interv = 0.2 / num;

                    let i = 0;
                    for (let p of physics.particles) {
                        let pos = p.node.position;
                        p.node.setPosition(pos.x, pos.y, pos.z);

                        let fly = tween(p.node);
                        fly.delay(i * interv);
                        fly.to(0.4, { position: goalFL, scale: v3(0.4, 0.4, 0.4) }, { easing: t => t ** 2 });

                        if (i === num - 1) fly.call(() => onFinished?.());
                        fly.call(() => this.putSmallCoin3D(p.node))
                        fly.start();
                        i += 1;
                    }
                }
            }
        });

        automata.tick();
    }

    getConeForces_Z(num: number, first_v: Vec3, moreRandomPower: number = 0): Vec3[] {
        let o = Vec3.ZERO;
        let a = (2 * Math.PI / num);
        let forces = [] as Vec3[];

        let random = Math.random;
        for (let i = 0; i < num; ++i) {
            let v = Vec3.rotateZ(v3(), first_v, o, i * a);
            let ran = 1 + random() * moreRandomPower;
            v.multiplyScalar(ran);
            forces.push(v);
        }
        return forces;
    }

    getTurretPivotFL3D(): Vec3 {
        let pivot = Game.main.getTurret().pivot;
        let base = Game.node.effectLayer3D;
        let pos = base.inverseTransformPoint(v3(), pivot.worldPosition);
        return pos.add3f(0, 5, 0);
    }

    private addSmallCoin2Scene(posFL: Vec3): Node {
        let node = this.getSmallCoin3D();
        node.setParent(Game.node.effectLayer3D);
        node.setPosition(posFL);
        return node;
    }

    private spinCoin3D(node: Node, rpm: number): Tween<Node> {
        return tween(node)
            .to(rpm / 60, { eulerAngles: v3(0, 0, 360) })
            .repeatForever()
            .start();
    }

    private getSmallCoin3D(): Node {
        let node = this.smallCoinPool.get();
        if (node) {
            node.setRotationFromEuler(0, 0, 0);
            node.setScale(1, 1, 1);
            return node;
        }
        return instantiate(this.smallCoin3D);
    }

    private putSmallCoin3D(node: Node) {
        Tween.stopAllByTarget(node);
        this.smallCoinPool.put(node);
    }

}
