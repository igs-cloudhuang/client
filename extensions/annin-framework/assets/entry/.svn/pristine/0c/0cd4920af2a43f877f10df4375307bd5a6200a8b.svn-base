import { _decorator, color, Component, director, Node, PhysicsSystem, Settings, settings, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SubGameProjectSettings')
export class SubGameProjectSettings extends Component {

    @property({
        tooltip: '項目有使用到物理引擎才要設定 (暫只支援: 內置物理引擎)'
    })
    physicsConfig_JsonText = '';

    @property({
        tooltip: '項目有使用到骨骼貼圖分布才要設定'
    })
    customTextureLayouts_JsonText = '';

    @property
    skyLightCustom = false;

    @property({
        tooltip: '天空顏色(上半球光照)', 
        visible() { return this.skyLightCustom }
    })
    skyLightingColor = color(0, 0, 0, 255);

    @property({
        tooltip: '光照強度', 
        visible() { return this.skyLightCustom }
    })
    skyIllum = 20000;

    @property({
        tooltip: '地板顏色(下半球光照)', 
        visible() { return this.skyLightCustom }
    })
    groundLightingColor = color(0, 0, 0, 255);

    @property({
        tooltip: 'HDR', 
        visible() { return this.skyLightCustom }
    })
    useHDR = false;

    onLoad() {
        // this.printPhysicsConfig();
        // this.printCustomJointTextureLayouts();

        // 子遊戲覆蓋大廳的設定
        if (!!globalThis.LobbyData) {
            if (this.physicsConfig_JsonText.length > 0 && PhysicsSystem.PHYSICS_BULLET) {
                // example: {"allowSleep":true,"fixedTimeStep":0.02,"maxSubSteps":3,"sleepThreshold":0.1,"autoSimulation":true,"gravity":{"x":0,"y":-1250,"z":0},"defaultMaterial":{"friction":0.1,"rollingFriction":0.1,"spinningFriction":0.1,"restitution":0.1},"collisionMatrix":{"0":1,"1":4,"2":10,"3":4},"collisionGroups":[{"index":1,"name":"WALL"},{"index":2,"name":"BULLET"},{"index":3,"name":"FISH"}]}
                let config = JSON.parse(this.physicsConfig_JsonText);
                PhysicsSystem.instance.resetConfiguration(config);
            }

            if (this.customTextureLayouts_JsonText.length > 0) {
                // example: [{"contents":[{"skeleton":1182343083,"clips":[648323207]}],"textureLength":12},{"contents":[{"skeleton":3321657749,"clips":[1948561282]}],"textureLength":36},{"contents":[{"skeleton":3602450878,"clips":[515620914]}],"textureLength":36},{"contents":[{"skeleton":3602450878,"clips":[1577649382]}],"textureLength":36},{"contents":[{"skeleton":1738374777,"clips":[3950432010]}],"textureLength":72},{"contents":[{"skeleton":655363925,"clips":[537400604]}],"textureLength":48},{"contents":[{"skeleton":290561847,"clips":[57848699]}],"textureLength":60},{"contents":[{"skeleton":2202607360,"clips":[3646747679]}],"textureLength":12},{"contents":[{"skeleton":3079970837,"clips":[771940033]}],"textureLength":12},{"contents":[{"skeleton":1584774571,"clips":[3594105520]}],"textureLength":12},{"contents":[{"skeleton":599621955,"clips":[3886817688]}],"textureLength":48},{"contents":[{"skeleton":2642272897,"clips":[2322192057]}],"textureLength":72},{"contents":[{"skeleton":931746649,"clips":[2939459322]}],"textureLength":72},{"contents":[{"skeleton":1436583808,"clips":[1917137650]}],"textureLength":60},{"contents":[{"skeleton":1395505358,"clips":[2940152450,4064989734,597292355]},{"skeleton":2587444228,"clips":[2940152450,4064989734,597292355]}],"textureLength":84},{"contents":[{"skeleton":967444412,"clips":[3797137051]}],"textureLength":48},{"contents":[{"skeleton":2337504956,"clips":[1162919533,2809352924,3611002006]}],"textureLength":180},{"contents":[{"skeleton":1142266524,"clips":[2855234418,3778543148]},{"skeleton":1930809701,"clips":[2855234418,3778543148]},{"skeleton":3631919604,"clips":[2855234418,3778543148]}],"textureLength":108},{"contents":[{"skeleton":4038967935,"clips":[2484391056,2830726464,830700516]}],"textureLength":36},{"contents":[{"skeleton":464638620,"clips":[3047135320]}],"textureLength":12}]
                let layouts = JSON.parse(this.customTextureLayouts_JsonText);
                director.root.dataPoolManager?.jointTexturePool.registerCustomTextureLayouts(layouts);
            }

            
            let globals = director.getScene().globals;
            globals.skybox.useHDR = this.useHDR;
            globals.ambient.skyLightingColor = this.skyLightingColor;
            globals.ambient.skyIllum = this.skyIllum;
            globals.ambient.groundLightingColor = this.groundLightingColor;
        }
    }

    onDestroy() {
        // 重置大廳的設定
        if (!!globalThis.LobbyData) {
            if (this.customTextureLayouts_JsonText.length > 0) {
                director.root.dataPoolManager?.jointTexturePool.registerCustomTextureLayouts([]);
            }
        }
    }

    private printPhysicsConfig() {
        if (PhysicsSystem.instance.enable) {
            let config = {
                gravity: settings.querySettings(Settings.Category.PHYSICS, 'gravity'),
                allowSleep: settings.querySettings(Settings.Category.PHYSICS, 'allowSleep'),
                maxSubSteps: settings.querySettings(Settings.Category.PHYSICS, 'maxSubSteps'),
                fixedTimeStep: settings.querySettings(Settings.Category.PHYSICS, 'fixedTimeStep'),
                sleepThreshold: settings.querySettings(Settings.Category.PHYSICS, 'sleepThreshold'),
                autoSimulation: settings.querySettings(Settings.Category.PHYSICS, 'autoSimulation'),
                defaultMaterial: settings.querySettings(Settings.Category.PHYSICS, 'defaultMaterial'),
                collisionMatrix: settings.querySettings(Settings.Category.PHYSICS, 'collisionMatrix'),
                collisionGroups: settings.querySettings(Settings.Category.PHYSICS, 'collisionGroups')
            };

            console.log(JSON.stringify(config));
        }
    }

    private printCustomJointTextureLayouts() {
        let layouts = settings.querySettings(Settings.Category.ANIMATION, 'customJointTextureLayouts');
        console.log(JSON.stringify(layouts));
    }

}
