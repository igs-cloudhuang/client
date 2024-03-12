import { Component, Node, _decorator, director } from 'cc';
import { find } from 'db://annin-framework/utils';
import { Bus, BusEvent, Comm } from 'db://annin-framework/system';
import PlantSwing from '../gameplay/PlantSwing';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('LowLevelSetting')
export default class LowLevelSetting extends Component {

    @property(Node)
    skyLight2DNode: Node = null;

    @property(Node)
    plantNode: Node = null;

    onLoad() {
        Bus.always(BusEvent.LowDeviceChange, this.updateLowLevelSetting, this);
    }

    start() {
        let offIcon = find(Game.node.buttonLayer, 'Tools/Effect/EffectOff');
        if (offIcon) {
            offIcon.active = Comm.state.isLowLevelDevice;  // 是否特效關閉
        }

        if (!!globalThis.LobbyData) {
            // 大廳子遊戲要重新設定場景配置
            this.updateLowLevelSetting(false);
            Game.node.stage.once(Node.EventType.NODE_DESTROYED, () => {
                let globals = director.getScene().globals;
                globals.shadows.enabled = false;
            });
        }
        if (Comm.state.isLowLevelDevice) {
            this.updateLowLevelSetting(true);  // 上次的低配記錄
        }
    }

    onDestroy() {
        Bus.cancel(BusEvent.LowDeviceChange, this.updateLowLevelSetting, this);
    }

    updateLowLevelSetting(lowLevel?: boolean) {
        lowLevel = lowLevel ?? Comm.state.isLowLevelDevice;

        this.skyLight2DNode.active = !lowLevel;
        this.plantNode.getComponents(PlantSwing)
            .forEach(comp => comp.enabled = !lowLevel);

        let globals = director.getScene().globals;
        globals.shadows.enabled = !lowLevel;

        // EFKRender.setGlobalEnable(!this._isOn);
        // TODO efk 開啟
    }

}
