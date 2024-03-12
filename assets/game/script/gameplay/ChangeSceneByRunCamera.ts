import { _decorator, Component, tween, v3 } from 'cc';
import { soundManager } from 'db://annin-framework/manager';
import { easeIn, find } from 'db://annin-framework/utils';
import { delay, fadeTween, setOpacity } from '../system/ToolBox';
import { MusicName } from './GameDefine';
import Game from '../system/Game';

const { ccclass, property } = _decorator;

@ccclass('ChangeSceneByRunCamera')
export default class ChangeSceneByRunCamera extends Component {

    private camRunningFlag = false;

    get isCamRunning(): boolean {
        return this.camRunningFlag;
    }

    set isCamRunning(ok: boolean) {
        this.camRunningFlag = ok;
    }

    chanegeScene1() {
        Game.main.getTurret().pivot.setPosition(0, 166, 0);
        Game.cam3D.node.setPosition(0, -296, 398);
    }
    
    chanegeScene3(itemIcon: number = 0) {
        this.isCamRunning = true;

        tween(this.node)
            .to(1.5, { position: v3(0, 400, 80) }, { easing: easeIn(4) })
            .call(() => {
                let whiteScene = find(Game.node.effectLayer, 'WhiteScene');
                setOpacity(whiteScene, 255);
                whiteScene.active = true;

                tween(whiteScene)
                    .call(() => {
                        Game.bgMgr.setBG(2);
                        Game.uiCtrl.setBonusGameCountActive(true, itemIcon);
                        Game.main.getTurret().pivot.setPosition(0, 76, 0);
                        Game.cam3D.node.setPosition(0, -392, 398);
                        soundManager.playMusic(MusicName.bgm2);
                    })
                    .delay(.5).call(() => {
                        let fadeOut = fadeTween(whiteScene, .5, -1, 0)
                            .call(() => {
                                whiteScene.active = false;
                                fadeOut.stop();
                            })
                            .start();
                    })
                    .delay(1).call(() => {
                        this.isCamRunning = false;
                    })
                    .start();

                delay(this.node, .5, () => {
                    Game.bgMgr.showTreasureTitle();
                });
            })
            .start();
    }

}
