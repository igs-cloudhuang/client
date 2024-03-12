import { Animation, Button, Component, Event, Input, Label, Node, Sprite, UIOpacity, _decorator, input, lerp, log, sys, tween, v3, view } from 'cc';
import { SettingConfig, appManager, backpackManager, bufferType, soundManager, toolBoxManager, vipwebManager, walletManager } from 'db://annin-framework/manager';
import { Bus, BusEvent, BusIframeEvent, Comm } from 'db://annin-framework/system';
import { cleanNum, find, transUIPos } from 'db://annin-framework/utils';
import BetChooseList from '../gameplay/BetChooseList';
import ChangeCoinSprite from '../gameplay/ChangeCoinSprite';
import ChangeSceneByRunCamera from '../gameplay/ChangeSceneByRunCamera';
import { FishNo, SceneEvent, SoundName } from '../gameplay/GameDefine';
import prot from '../network/protocol/protocol.js';
import Game, { GameLog } from '../system/Game';
import { delay, setUISize } from '../system/ToolBox';

const { ccclass, property } = _decorator;

@ccclass('UICtrl')
export default class UICtrl extends Component {

    @property(Label)
    totalShootStr: Label = null;

    @property(Node)
    totalShootText: Node = null;

    @property(Label)
    TorpedoCoinStr: Label = null;

    @property(Label)
    sessionStr: Label = null;

    @property(Node)
    TorpedoCoinBg: Node = null;

    @property(Node)
    betList: Node = null;

    @property(Button)
    betBtn: Button = null;

    @property(Button)
    nextBtn: Button = null;

    @property(Button)
    torpedoBtn: Button = null;

    @property(Button)
    autoBtn: Button = null;

    @property(Button)
    summonBtn: Button = null;

    @property(Button)
    startBtn: Button = null;

    @property(Node)
    treasureHideGroup: Node[] = [];

    @property(Node)
    FeaturesHideGroup: Node[] = [];

    @property(Label)
    TopOdds: Label = null;

    @property(Node)
    BonusGameGroupUI: Node[] = [];

    @property(Node)
    BetGroupUI: Node[] = [];

    @property(Node)
    playerCoinNode: Node = null;

    @property(Node)
    featuresNode: Node = null;

    @property([Node])
    featuresBtnNode: Node[] = [];

    @property(Sprite)
    bonusCardSpr: Sprite = null;

    @property(Sprite)
    vipSpr: Sprite = null;

    /** 多幣別轉換顯示 */
    @property(ChangeCoinSprite)
    private coinSprite: ChangeCoinSprite[] = [];

    onLoad() {
        Game.uiCtrl = this;

        Bus.always(BusIframeEvent.stopAutoplay, this.iframeStopAutoPlay, this);
        Bus.always(BusEvent.PlayFeatureGame, this.playFeatureGame, this);

        Game.node.stage.on(Node.EventType.SIZE_CHANGED, this.updateOddsBoardPosition, this);
        this.updateOddsBoardPosition();

        toolBoxManager.setConfig(SettingConfig.LowDevice, true);
    }

    start() {
        vipwebManager.setVipSprUpdate(this.vipSpr);
        this.setFeaturesBtn(false);
    }

    onDestroy() {
        if (!sys.isMobile) {
            input.off(Input.EventType.KEY_DOWN);  // clean up
            input.off(Input.EventType.KEY_UP);  // clean up
        }

        Bus.cancel(BusIframeEvent.stopAutoplay, this.iframeStopAutoPlay, this);
        Bus.cancel(BusEvent.PlayFeatureGame, this.playFeatureGame, this);

        Game.node.stage?.off(Node.EventType.SIZE_CHANGED, this.updateOddsBoardPosition, this);

        vipwebManager?.clearVipSprUpdate(this.vipSpr);
        Game.uiCtrl = null;
    }

    /**
     * 各類按鈕響應
     */
    toolEvent(e: Event, data: string, playSnd: boolean = true) {
        if (playSnd) {
            soundManager.playEffect(SoundName.button01);
        }
        switch (data) {
            case 'Torpedo': {
                this.switchShootState('Torpedo');  // 魚雷按鈕
                break;
            }
            case 'Giveup': {
                this.giveupFish();
                break;
            }
            case 'CallTreasure': {
                this.callTreasure();
                break;
            }
            case 'showBet': {
                this.showBet();
                break;
            }
            case 'AutoMatic': {
                this.switchShootState('AutoMatic');  // 魚雷按鈕
                break;
            }
            // 漏網之魚
            default: {
                log('toolEvent case is not found, ' + `name = ${data}.`);
            }
        }
    }

    /**
     * 切換開關的動畫控制
     * @param type 按鈕 keyword
     * @param toggle flag
     */
    switchChipState(type: string, toggle: boolean) {
        // let text = find('ItemPanel/Label/' + type, comm.node.buttonLayer);
        let node = find(Game.node.buttonLayer, 'RightPanel/Button/' + type);
        let anim = node?.getComponent(Animation);

        // text.scale = toggle ? 1.1 : 1.0;
        // node.scale = toggle ? 1.1 : 1.0;

        if (toggle) {
            let clip = anim.defaultClip;
            if (clip) {
                let state = anim.getState(clip.name);
                if (!state.isPlaying)
                    anim.play(clip.name);
            }
        }
        else {
            anim.stop();
            node.children.forEach(chd => {
                if (chd.name !== 'Touch') chd.active = false;
            });
        }
    }

    switchAutoChipState(toggle: boolean) {
        let node = find(Game.node.buttonUpperLayer, 'BottomPanel/Auto/auto');
        node.active = !toggle;

        let node2 = find(Game.node.buttonUpperLayer, 'BottomPanel/Auto/stop');
        node2.active = toggle;

        // this.setNextBtnInteractable(!toggle);
    }

    /**
     * 切換各種射擊功能的開關
     */
    switchShootState(shootType: string) {
        switch (shootType) {
            case 'Torpedo': {
                if (Game.shootMgr.isTorpedo) {
                    this.switchChipState('Torpedo', false);
                    this.setTorpedoCoin(Game.main.getTurret().getBet() * Game.shootMgr.torpedoHitCount);
                    Game.shootMgr.setButtonSwitch('TorpedoOff');
                }
                else {
                    this.switchChipState('Torpedo', true);
                    this.setTorpedoCoin(Game.main.getTurret().getBet() * Game.shootMgr.torpedoHitCount);
                    Game.shootMgr.setButtonSwitch('TorpedoOn');
                }
                break;
            }
            case 'AutoMatic': {
                if (Game.shootMgr.isAutoMatic) {
                    // this.switchChipState('AutoMatic', false);
                    Game.shootMgr.setButtonSwitch('AutoMaticOff');
                }
                else {
                    Game.shootMgr.setButtonSwitch('AutoMaticOn');
                }
                break;
            }
        }
    }

     /**
     * 顯示魚雷價格
     * @param num 
     */
    setTorpedoCoin(num: number) {
        this.TorpedoCoinStr.string = walletManager.FormatCoinNum(num);
        this.TorpedoCoinStr.node.active = (num > 0);
        this.TorpedoCoinBg.active = (num > 0);
        // this.TorpedoStr.active = (num > 0);
    }

    setSession(str: string) {
        this.sessionStr.string = str;
    }

    giveupFish() {
        let turret = Game.main.getTurret();
        if (!turret || turret.isLocked()) return;

        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) return;

        let fish = Game.fishMgr.getFishTower(0);
        if (fish) {
            Game.main.C2S_Giveup(0, [fish.getFishId()]);
            Game.effectMgr.playGiveup(fish);
            Game.fishMgr.delFish(fish, false, true);
            soundManager.playEffect(SoundName.flash);
            appManager.sendButton(GameLog.Giveup);
        }
    }

    callTreasure() {
        let turret = Game.main.getTurret();
        if (!turret || turret.isLocked()) return;

        if (Game.shootMgr.isAutoMatic) return;
        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure)) return;

        let fish = Game.fishMgr.getFishTower(0);
        if (!fish || fish.getFishNo() === FishNo.TreasureChest) return;

        let rmFishes = Game.fishMgr.getAllFishes().filter(fish => {
            return fish && fish.getFishNo() === FishNo.TreasureChest;
        });
        rmFishes.unshift(fish);

        let rmIDs = rmFishes.map(fish => fish.getFishId());
        Game.main.C2S_Giveup(0, rmIDs, true);

        rmFishes.forEach(fish => {
            Game.effectMgr.playGiveup(fish);
            Game.fishMgr.delFish(fish, false, true);
        });

        soundManager.playEffect(SoundName.flash);
        appManager.sendButton(GameLog.CallTreasure);
    }

    showBet() {
        let bets = Game.main.getTurret().getBets();

        let list = this.betList.getComponent(BetChooseList);
        if (list) {
            list.init(bets);
            list.setActive();
        }
    }

    setBetList() {
        let list = this.betList.getComponent(BetChooseList);
        if (list) {
            list.setActiveFalse();
        }
    }

    setTopOdd(str: string) {
        if (Game.bgMgr.isEventOfScene(SceneEvent.Treasure) == false) {
            Game.uiCtrl.setOddsBoardActive(true);
        }
        this.TopOdds.string = str;
    }

    setOddsBoardActive(ok: boolean) {
        this.TopOdds.node.parent.active = ok;
    }

    updateOddsBoardPosition() {
        let uiSize = setUISize(Game.node.stage, -1, -1);
        let resol = view.getDesignResolutionSize();
        let pivot = this.TopOdds.node.parent;
        let t = Math.max(0, (uiSize.height - resol.height) / (1600 - resol.height));
        pivot.setPosition(110, lerp(45, 135, t));    // 按畫面調出來的數值
    }

    setBonusGameCountActive(ok: boolean, icon: number = 0) {
        this.BonusGameGroupUI.forEach(node => {
            node.active = ok;
        })

        // 離開時如果道具卡亮著，就關掉
        if (!ok) {
            if (this.bonusCardSpr.node.active) {
                backpackManager.showUsingItemEnd(true);
                backpackManager.getItemInfo();
            }
        }

        this.bonusCardSpr.node.active = false;

        if (ok && icon > 0) {
            this.bonusCardSpr.node.active = true;
        }
    }

    getBonusGameCountPos() {
        return this.BonusGameGroupUI[0]? transUIPos(Game.node.uiLayer, this.BonusGameGroupUI[0]) : v3(0, 0);
    }

    setBetGroupActive(ok: boolean) {
        if (this.BetGroupUI[0]) { this.BetGroupUI[0].active = ok; }
        for (let i = 1; i < this.BetGroupUI.length; ++i) {
            if (this.BetGroupUI[i]) { this.BetGroupUI[i].active = !ok; }
        }
    }
    
    /**
     * 顯示剩餘射擊次數
     */
    setShootCount(num: number) {
        this.totalShootStr.string = num.toString();
        this.totalShootStr.node.active = (num > 0);
        let pos = this.totalShootStr.node.active ? v3(-2, 23.5, 0) : v3(-1.5, 13.5, 0);
        this.totalShootText.setPosition(pos);
    }

    /**
     * 設定BET切換狀態
     * @param ok 
     */
    setBetBtnInteractable(ok: boolean) {
        // this.betBtn.enableAutoGrayEffect = true;
        this.betBtn.getComponent(Sprite).grayscale = !ok;
        this.betBtn.interactable = ok;
    }

    /**
     * 設定下一個切換狀態
     * @param ok 
     */
    setNextBtnInteractable(ok: boolean) {
        // if (ok) {
        //     ok = !comm.shootMgr.isAutoMatic;
        // }
        // this.nextBtn.enableAutoGrayEffect = true;
        // this.nextBtn.getComponent(Sprite).grayscale = !ok;
        this.nextBtn.interactable = ok;
    }

    /**
     * 設定torpedo切換狀態
     * @param ok 
     */
    setTorpedoBtnInteractable(ok: boolean) {
        // this.torpedoBtn.enableAutoGrayEffect = true;
        // this.torpedoBtn.getComponent(Sprite).grayscale = !ok;
        this.torpedoBtn.interactable = ok;
    }

    /**
     * 設定start切換狀態
     * @param ok 
     */
    setStartBtnInteractable(ok: boolean) {
        // this.startBtn.enableAutoGrayEffect = true;
        this.startBtn.getComponent(Sprite).grayscale = !ok;
        this.startBtn.interactable = ok;
    }

    setAutoBtnInteractable(ok: boolean) {
        this.autoBtn.getComponent(Sprite).grayscale = !ok;
        this.autoBtn.interactable = ok;
    }

    setSummonBtnInteractable(ok: boolean) {
        this.summonBtn.getComponent(Sprite).grayscale = !ok;
        this.summonBtn.interactable = ok;
    }

    /**
     * 寶藏庫要隱藏的按鈕
     * @param ok 
     */
    setBtnsInTreasure(ok: boolean) {
        this.treasureHideGroup.forEach(node => {
            node.active = ok;
        })
        this.nextBtn.node.active = ok;

        let turret = Game.main.getTurret();
        if (turret) {
            if (ok) {
                if (Game.shootMgr.isTorpedo) {
                    Game.uiCtrl.setTorpedoCoin(turret.getBet() * Game.shootMgr.torpedoHitCount);
                }
            } else {
                Game.uiCtrl.setTorpedoCoin(0);
            }
        }
    }

    /**
     * 特色模式要隱藏的按鈕
     * @param ok 
     */
    setBtnsInFeatures(ok: boolean) {
        Game.uiCtrl.setBetBtnInteractable(ok);
        this.FeaturesHideGroup.forEach(node => {
            if (!node) return;
            let name = node.name;
            if (name == 'WinMore' || name == 'DailyMission') {
                node.active = ok;
            } else {
                node.getComponent(UIOpacity).opacity = ok ? 255 : 0;
                let btn = node.getComponent(Button);
                if (btn) { btn.interactable = ok; }
            }
        });
        this.nextBtn.node.active = ok;

        let turret = Game.main.getTurret();
        if (turret) {
            if (ok) {
                if (Game.shootMgr.isTorpedo) {
                    Game.uiCtrl.setTorpedoCoin(turret.getBet() * Game.shootMgr.torpedoHitCount);
                }
            } else {
                Game.uiCtrl.setTorpedoCoin(0);
            }
        }

        // this.autoBtn.enableAutoGrayEffect = true;
        // this.autoBtn.interactable = ok;
        this.setAutoBtnInteractable(ok);
        this.setSummonBtnInteractable(ok);
        this.playerCoinNode.active = ok;
        this.featuresNode.active = !ok;
        this.setFeaturesBtn(ok)
    }

    setFeaturesBtn(ok: boolean){
        if(appManager.isTaDaVersion){
            this.featuresBtnNode.forEach(node => node.active = false);
        }
        else{
            this.featuresBtnNode.forEach(node => node.active = ok);
        }
    }

    playFeatureGame(value: number) {
        switch (value) {
            case 1: {
                // 藏寶庫特色模式
                this.features2();
                break;
            }
            case 2: {
                break;
            }
        }

        Comm.node.buttonLayer.active = false;
    }

    /**
     * 藏寶庫特色模式
     */
    features2(isAutoPlay: boolean = true) {
        Game.main.stopShooting(true);
        let plate: prot.protocol.Fish[] = [];
        for (let i = 0; i <= 6; ++i) {
            let fish = Game.fishMgr.getFishTower(i);
            if (fish) {
                let f = new prot.protocol.Fish();
                f.index = fish.getFishId();
                f.no = fish.getFishNo();
                plate.push(f);
            }
        }

        // Game.bgMgr.showKey();
        Game.fishMgr.setBreakLevel(-1);
        // 讓出空間
        for (let i = 0; i <= 6; ++i) {
            let fish = Game.fishMgr.getFishTower(i);
            if (fish && fish.isUsed()) {
                Game.fishMgr.setBreakLevel(fish.getFishId(), fish.getBreakLv());
                switch (i) {
                    case 0:
                    case 1:
                    case 2:
                    case 5: {
                        tween(fish.node)
                        .by(0.5, { position: v3(-100, 0, 0) })
                        .call(() => {
                            Game.fishMgr.delFish(fish, false, true);
                        })
                        .start()
                        break;
                    }
                    case 3:
                    case 4:
                    case 6: {
                        tween(fish.node)
                        .by(0.5, { position: v3(100, 0, 0) })
                        .call(() => {
                            Game.fishMgr.delFish(fish, false, true);
                        })
                        .start()
                        break;
                    }
                }
            }
        }

        if (isAutoPlay) {
            let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
            Game.shootMgr.setAutoFishIDList(list);
        }

        Game.uiCtrl.setBetList();
        Game.uiCtrl.setTorpedoBtnInteractable(false);
        Game.uiCtrl.setOddsBoardActive(false);
        Game.uiCtrl.setBtnsInFeatures(false);
        Game.uiCtrl.setBetBtnInteractable(false);
        Game.uiCtrl.setSummonBtnInteractable(false);
        Game.bgMgr.addDoorOpenEfk();
        Game.piggyBank.hideBankUI(true);
        Game.cam3D.getComponent(ChangeSceneByRunCamera).chanegeScene3();

        // 表演開地下室
        Game.bgMgr.openTheDoor(() => {
            // 位置更新
            Game.fishMgr.enterTreasure();
            Game.bgMgr.switchSceneEvent(SceneEvent.Treasure, true);
            delay(this.node, 2, () => {
                Game.fishMgr.clearFishList();
                Game.treasureMgr.setData(40 * walletManager.ratio, 1 * walletManager.ratio, plate, true);
                // 標題打開才解鎖
                Game.fishMgr.readyToUpdateSeat(() => {});
                Game.jpBoard.showPigCoinUI(true, true);
            });

            // 換砲台
            let turret = Game.main.getTurret();
            if (turret) {
                turret.switchAvatar();
                turret.fakeShowBet(1 * walletManager.ratio);
            }

            Game.uiCtrl.setBtnsInTreasure(false);
        })
    }

    /**
     * JP 進藏寶庫流程
     */
    features3(ack: prot.protocol.HitAckData, leaveCB: Function) {
        console.log(ack, 'treasureStart')

        Game.main.stopShooting(true);
        Game.uiCtrl.setOddsBoardActive(false);
        Game.uiCtrl.setBetList();
        Game.uiCtrl.setBetBtnInteractable(false);
        Game.uiCtrl.setSummonBtnInteractable(false);
        Game.uiCtrl.setTorpedoBtnInteractable(false);

        Game.bgMgr.switchSceneEvent(SceneEvent.Treasure, true);
        Game.shootMgr.checkStopAutoMatic('free', 0);

        Game.fishMgr.setBreakLevel(-1);
        Game.fishMgr.saveKeepFishScriptData();

        // 讓出空間
        for (let i = 0; i <= 6; ++i) {
            let fish = Game.fishMgr.getFishTower(i);
            if (fish && fish.isUsed()) {
                Game.fishMgr.setBreakLevel(fish.getFishId(), fish.getBreakLv());
                switch (i) {
                    case 0:
                    case 1:
                    case 2:
                    case 5: {
                        tween(fish.node)
                            .by(0.5, { position: v3(-300, 0, 0) })
                            .call(() => {
                                Game.fishMgr.delFish(fish, false, true);
                            })
                            .start()
                        break;
                    }
                    case 3:
                    case 4:
                    case 6: {
                        tween(fish.node)
                            .by(0.5, { position: v3(300, 0, 0) })
                            .call(() => {
                                Game.fishMgr.delFish(fish, false, true);
                            })
                            .start()
                        break;
                    }
                }
            }
        }

        Game.bgMgr.addDoorOpenEfk();
        Game.piggyBank.hideBankUI(true);
        Game.cam3D.getComponent(ChangeSceneByRunCamera).chanegeScene3();

        // 表演開地下室
        Game.bgMgr.openTheDoor(() => {
            // 位置更新
            Game.fishMgr.enterTreasure();
            delay(Game.main.node, 2, () => {
                Game.fishMgr.clearFishList();

                let t = new prot.protocol.Treasures();
                t.list = ack.remove[0].bonus.treasures.list;
                t.round = ack.remove[0].bonus.treasures.round;

                let coin = ack.remove[0].bonus.coin;

                Game.treasureMgr.setServerData(t, coin, ack.bet, ack.plate, false, leaveCB);
                // 標題打開才解鎖
                Game.fishMgr.readyToUpdateSeat(() => { });
                Game.jpBoard.showPigCoinUI(true, true);
                // comm.bgMgr.addScoreStoneEfk();
            })

            // 換砲台
            let turret = Game.main.getTurret();
            if (turret) {
                turret.switchAvatar();
            }

            Game.uiCtrl.setBtnsInTreasure(false);
        });
        soundManager.playEffect(SoundName.Treasure01);
    }

    /**
     * 判斷是否可使用道具
     * @returns 
     */
    checkUseItem() {
        let turret = Game.main.getTurret();
        if (!turret) return false;

        let tower = Game.fishMgr.getFishTower(0);
        let isOK = (
            tower &&
            !turret.isLocked() &&
            !Game.shootMgr.isAutoMatic &&
            !Game.bgMgr.isEventOfScene(SceneEvent.Treasure)
        );

        // console.log('判斷是否可使用道具: ' + ok)
        // console.log('冰龍: ' + !Game.bgMgr.isEventOfScene(SceneEvent.Frost))
        // console.log('藏寶庫: ' + !Game.bgMgr.isEventOfScene(SceneEvent.Treasure))
        // console.log('第一座塔: ' + tower)
        // console.log('鎖定: ' + !turret.isLocked())
        // console.log('智能捕魚: ' + !Game.shootMgr.isAutoMatic)

        // 公版要 false 才表示可用
        return !isOK
    }

    /**
     * 切換多幣別顯示
     */
    setCoinSprite() {
        this.coinSprite.forEach(s => {
            s.show();
        })
    }

    iframeStopAutoPlay = () => {
        if (Game.shootMgr.isAutoMatic) {
            this.toolEvent(null, 'AutoMatic');
        }
    }
}
