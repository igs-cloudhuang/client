import { _decorator, Component, Enum, Prefab } from 'cc';

const { ccclass, property } = _decorator;

enum ResDataType {
    Fish, Bullet, Turret, Coin,
    Effect, Reward, Other
}

function visible_Fish() { return this.uiType === ResDataType.Fish }
function visible_Bullet() { return this.uiType === ResDataType.Bullet }
function visible_Turret() { return this.uiType === ResDataType.Turret }
function visible_Coin() { return this.uiType === ResDataType.Coin }
function visible_Effect() { return this.uiType === ResDataType.Effect }
function visible_Reward() { return this.uiType === ResDataType.Reward }
function visible_Other() { return this.uiType === ResDataType.Other }

@ccclass('PropertyData')
export class PropertyData extends Component {

    @property({ type: Enum(ResDataType) })
    uiType = ResDataType.Fish;

    @property({ type: [Prefab], visible: visible_Fish })
    fishes: Prefab[] = [];

    @property({ type: [Prefab], visible: visible_Bullet })
    bullets: Prefab[] = [];

    @property({ type: Prefab, visible: visible_Bullet })
    hitEffect: Prefab[] = [];

    @property({ type: [Prefab], visible: visible_Turret })
    cannons: Prefab[] = [];

    @property({ type: [Prefab], visible: visible_Coin })
    goldNum: Prefab[] = [];

    @property({ type: Prefab, visible: visible_Coin })
    pigCoin2D: Prefab = null;

    @property({ type: Prefab, visible: visible_Coin })
    pigCoinJPFx: Prefab = null;

    @property({ type: Prefab, visible: visible_Coin })
    pigCoinSymbol: Prefab = null;

    @property({ type: Prefab, visible: visible_Coin })
    pigCoinSymbolHit: Prefab = null;

    @property({ type: [Prefab], visible: visible_Effect })
    effects: Prefab[] = [];

    @property({ type: [Prefab], visible: visible_Reward })
    rewards: Prefab[] = [];

    @property({ type: [Prefab], visible: visible_Other })
    others: Prefab[] = [];

    @property({ type: Prefab, visible: visible_Other })
    treasureKey: Prefab = null;

    @property({ type: Prefab, visible: visible_Other })
    cannonJumpBullet: Prefab = null;

    @property({ type: Prefab, visible: visible_Other })
    wheelPrefab: Prefab = null;

}
