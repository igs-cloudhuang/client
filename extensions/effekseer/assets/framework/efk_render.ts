
import { Node, Asset, Camera, Material, ModelRenderer, Texture2D, renderer, director, BufferAsset, Director, EffectAsset, Gradient, log, math, game } from 'cc';
import { EFKModel } from './efk_model';
import { EDITOR, NATIVE } from 'cc/env';
import { EFKMaterial } from './efk_material';

const FORCE_NATIVE = NATIVE && true;

export interface IEFKComponent {
    efk: Asset;
    efkModels: Asset[];
    efkMats: Asset[];
    efkTextures: Texture2D[];
    efkEffect: number;
    efkHandle: number;
    uuid: string;
    node: Node;
    _materials: Material[];
    _addModel: (model: renderer.scene.Model) => void;
    onRemovingCallback: () => void;
}

let g_isUnloadImmediately = EDITOR || false;
let g_isInit: boolean = false;
let g_isClearMask: boolean = false;
let g_stepmode: boolean = false;
let g_cameras: renderer.scene.Camera[] = [];
let g_effects: Record<number, IEFKComponent> = {};
let g_textures: Record<number, Texture2D> = {};
let g_textures_refs: Record<number, number> = {};
let g_materials: Record<number, Material[]> = {};
let g_materials_refs: Record<number, number> = {};
let g_effects_loader: Record<string, number> = {};
let g_effects_refs: Record<number, number> = {};
let g_models_refs: Record<number, number> = {};

let g_tex_slot = -1;
let g_material_slot = -1;
let g_model_slot = -1;
let g_component: IEFKComponent = null!;
let g_magnification = 1.0;

let tmp_arr16_1 = new Float32Array(16);
let tmp_arr16_2 = new Float32Array(16);
let tmp_mat4 = math.mat4();

function mat4ToF32Arr(out: Float32Array, mat: math.Mat4): Float32Array {
    out[0] = mat.m00; out[1] = mat.m01; out[2] = mat.m02; out[3] = mat.m03;
    out[4] = mat.m04; out[5] = mat.m05; out[6] = mat.m06; out[7] = mat.m07;
    out[8] = mat.m08; out[9] = mat.m09; out[10] = mat.m10; out[11] = mat.m11;
    out[12] = mat.m12; out[13] = mat.m13; out[14] = mat.m14; out[15] = mat.m15;
    return out;
}

function hash(str: string) {
    if (Array.prototype.reduce) {
        return Math.abs(str.split("").reduce(function (a, b) { a = (a << 5) - a + b.charCodeAt(0); return a & a }, 0));
    }
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function prepare(com: IEFKComponent) {
    g_tex_slot = -1;
    g_material_slot = -1;
    g_model_slot = -1;
    g_component = com;
}

function setSpeed(com: ModelRenderer | IEFKComponent, v: number) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }
    // console.log("efk ==> speed ", v);
    com = com as IEFKComponent;
    efk.effekseer.setSpeed(com.efkHandle, v);
}

function setPause(com: ModelRenderer | IEFKComponent, b: boolean) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }

    com = com as IEFKComponent;
    efk.effekseer.setPaused(com.efkHandle, b);
}

function setFrame(com: ModelRenderer | IEFKComponent, n: number) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }

    g_stepmode = true;
    com = com as IEFKComponent;
    efk.effekseer.updateHandleToMoveToFrame(com.efkHandle, n);
}

function setWorldMatrix(com: ModelRenderer | IEFKComponent) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }

    com = com as IEFKComponent;
    let modelM = mat4ToF32Arr(tmp_arr16_1, com.node.worldMatrix);
    efk.effekseer.setMatrix(com.efkHandle, modelM);
}

function stop(com: ModelRenderer | IEFKComponent) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }

    com = com as IEFKComponent;
    delete g_effects[hash(com.uuid)];

    if (com.efkHandle !== undefined) {
        // console.log("efk ==> stop ", com.efkHandle);
        efk.effekseer.stopEffect(com.efkHandle);
        com.efkHandle = undefined;
    }
}

function unload(src: string) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }

    let effect = g_effects_loader[src];
    if (effect === undefined) {
        return;
    }

    g_effects_refs[effect] -= 1;
    log(`U ${src} ${g_effects_refs[effect]}`);

    if (g_effects_refs[effect] == 0 && g_isUnloadImmediately) {
        delete g_effects_loader[src];
        efk.effekseer.unloadResources(effect);
    }
}

function load(com: ModelRenderer | IEFKComponent) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }
    g_stepmode = false;

    com = com as IEFKComponent;
    if (!com.efk) {
        return;
    }
    stop(com);

    // 预先加载状态
    prepare(com);

    // 编辑器不使用缓存，这样重新导入 efk, 资源就会刷新
    if (EDITOR) {
        // console.log("efk ==> load ", com.efk.name);
        com.efkEffect = efk.effekseer.loadEffectOnMemory(com.efk._nativeAsset as ArrayBuffer, com.efk.name, g_magnification);
        return;
    }

    // 加载特效
    if (g_effects_loader[com.efk.name]) {
        com.efkEffect = g_effects_loader[com.efk.name];
    }
    else {
        g_effects_loader[com.efk.name] = com.efkEffect = efk.effekseer.loadEffectOnMemory(com.efk._nativeAsset as ArrayBuffer, com.efk.name, g_magnification);
        g_effects_refs[com.efkEffect] = 0;
    }

    // 引用计数
    g_effects_refs[com.efkEffect] += 1;
    log(`A ${com.efk.name} ${g_effects_refs[com.efkEffect]}`);
}

function play(com: ModelRenderer | IEFKComponent) {
    if (!g_isInit) {
        // console.assert(false, 'effekseer not init!');
        return;
    }
    g_stepmode = false;

    com = com as IEFKComponent;
    if (!com.efk) {
        return;
    }

    if (com.efkHandle !== undefined) {
        efk.effekseer.setRemovingCallback(com.efkHandle, function () { });
        stop(com);
    }

    // 计算 hash 值，用于特效对象匹配
    const hash_key = hash(com.uuid);
    g_effects[hash_key] = com;

    com.efkHandle = efk.effekseer.playEffect(com.efkEffect, com.node.position.x, com.node.position.y, com.node.position.z);
    efk.effekseer.setUserData(com.efkHandle, hash_key);
    efk.effekseer.setScale(com.efkHandle, 1, 1, 1);

    // console.log("efk ==> play ", com.efkHandle);

    // 获取位偏移
    const renderid = (com.node.layer).toString(2).indexOf("1");
    efk.effekseer.setLayer(com.efkHandle, renderid);

    efk.effekseer.setRemovingCallback(com.efkHandle, (comPtr: number) => {
        const comp: IEFKComponent = g_effects[comPtr];
        if (comp) {
            // console.log("Remove: ", hash_key, (com as IEFKComponent).efk.name)
            comp.onRemovingCallback();
        }
    });

    return efk.effekseer.getFrameCount(com.efkEffect);
}

function drawSprite(param: efk.RenderParameter, infoBuffer: Float32Array, cam: renderer.scene.Camera, renderid: number) {
    const comp: IEFKComponent = g_effects[param.ComPtr];
    const uniforms = new Float32Array(infoBuffer.buffer, infoBuffer.byteOffset + param.UniformBufferOffset);
    let material = EFKMaterial.check(param, uniforms, null, cam, renderid, 0);
    let model = EFKModel.drawSprite(param.VertexBufferStride, param.VertexBufferOffset, param.ElementCount, material, material.parent.hash /* param.MaterialPtr */);
    comp._addModel(model);
}


function drawModel(param: efk.RenderParameter, infoBuffer: Float32Array, cam: renderer.scene.Camera, renderid: number) {
    const comp: IEFKComponent = g_effects[param.ComPtr];
    const uniforms = new Float32Array(infoBuffer.buffer, infoBuffer.byteOffset + param.UniformBufferOffset);
    const count = param.ElementCount;

    for (let element = 0; element < count; ++element) {
        // 参数为 29 个浮点数, 查看 c++ 代码定义 ModelParameter1
        const model_params_float_count = 29;
        const model_params_offset = element * (Float32Array.BYTES_PER_ELEMENT * model_params_float_count);
        const models = new Float32Array(infoBuffer.buffer, infoBuffer.byteOffset + param.VertexBufferOffset + model_params_offset);

        // 执行绘制渲染
        let material = EFKMaterial.check(param, uniforms, models, cam, renderid, element);
        let model = EFKModel.drawModel(param.ModelPtr, models[24], material, param.MaterialPtr);
        comp._addModel(model);
    }
}

function enableExternalTexture(render_id: number, backgroud: Camera) {
    let depthTex = efk.effekseer.enableDepthTexture(render_id);
    let bgTex = efk.effekseer.enableBackGroundTexture(render_id);
    g_textures[bgTex] = backgroud.targetTexture as any;
    console.warn("no support");
}

function updateCamera(render_id: number, icam: renderer.scene.Camera) {
    if (!g_isInit) {
        return;
    }

    // 更新渲染组
    let projM = mat4ToF32Arr(tmp_arr16_1, icam.matProj);
    efk.effekseer.setProjectionMatrix(render_id, projM);

    let camM = mat4ToF32Arr(tmp_arr16_2, tmp_mat4.set(icam.matView).invert());
    efk.effekseer.setCameraMatrix(render_id, camM);
}

function renderCamera(renderid: number, cam: renderer.scene.Camera) {
    // 更新粒子 (步进计算)
    efk.effekseer.render(renderid);

    // 填充粒子几何数据

    let model_count = efk.effekseer.renderStrideBufferCount();
    for (let ii = 0; ii < model_count; ++ii) {
        let stride = efk.effekseer.renderStrideBufferParameter(ii);
        EFKModel.updateMesh(stride.Stride, stride.Ptr);
    }

    // 绘制粒子

    let count = efk.effekseer.renderParameterCount();
    if (0 >= count) return;

    // 材质属性更新

    let nbuf = efk.effekseer.renderInfoBuffer();
    let infoBuffer = new Float32Array(nbuf.buffer, nbuf.byteOffset);

    // 开始绘制

    for (let i = 0; i < count; ++i) {
        // if (i != 2) continue;
        const param: efk.RenderParameter = efk.effekseer.renderParameter(i);
        if (param.RenderMode !== 0) {
            drawModel(param, infoBuffer, cam, renderid);
        }
        else {
            drawSprite(param, infoBuffer, cam, renderid);
        }
    }
}

function render() {
    if (FORCE_NATIVE) {
        // @ts-ignore
        const batchs: Record<number, renderer.scene.Model[]> = efk.EFKRenderN.render(g_cameras, g_stepmode);

        for (let comPtr in batchs) {
            const models = batchs[comPtr];
            const comp: IEFKComponent = g_effects[comPtr];
            models.forEach(model => {
                comp._addModel(model);
            });
        }
        return;
    }

    // 重置模型
    EFKModel.reset();

    // 清除材质
    EFKMaterial.reset();

    // 更新帧时间 (这个不影响粒子播放时长)

    if (g_stepmode) {
        // 进入单步模式
        efk.effekseer.update(0);
    }
    else {
        // 正常刷新
        let step = game.deltaTime * 60;    // 預設為 60 FPS (IGS 修正高刷屏)
        efk.effekseer.updateTime(step);
        efk.effekseer.update(step);
    }

    let editor_camera = null;
    if (EDITOR) {
        let cameraList = director.getScene()?.renderScene?.cameras;
        editor_camera = cameraList.filter(cam => { return (cam.name == 'Editor Camera'); })[0];
    }

    // 遍历所有分组
    for (let renderid = 0; renderid < g_cameras.length; ++renderid) {
        if (!g_cameras[renderid]) continue;

        if (EDITOR) {
            // 更新渲染组
            let projM = mat4ToF32Arr(tmp_arr16_1, editor_camera.matProj);
            efk.effekseer.setProjectionMatrix(renderid, projM);

            let camM = mat4ToF32Arr(tmp_arr16_2, tmp_mat4.set(editor_camera.matView).invert());
            efk.effekseer.setCameraMatrix(renderid, camM);

            renderCamera(renderid, editor_camera);
        }
        else {
            renderCamera(renderid, g_cameras[renderid]);
        }
    }
}

function setup(defaultMats: Material[], magnification: number) {
    if (g_isInit) {
        return;
    }

    g_isInit = true;
    g_magnification = magnification;

    if (FORCE_NATIVE) {
        // @ts-ignore
        efk.EFKMaterialN.setInternals(defaultMats);
    }
    else {
        // 材质数据
        EFKMaterial.config(g_textures, g_materials, defaultMats);
    }

    // 初始化 efk 库
    efk.effekseer.init(8192, 8192, 1, 0, 1, 1);

    // 加载纹理
    efk.effekseer.setTextureLoaderEvent((key: number, src: string) => {
        g_tex_slot++;
        if (null == g_textures[key]) {
            g_textures[key] = g_component.efkTextures[g_tex_slot];
            g_textures_refs[key] = 0;
        }
        g_textures_refs[key] += 1;

        if (FORCE_NATIVE) {
            // @ts-ignore
            efk.EFKMaterialN.setTexture(key, g_textures[key], false);
        }

        // console.log('IMG: ', src, g_tex_slot, key);
    }, (id: number, key) => {
        log('DEL: ', id);
        g_textures_refs[key] -= 1;

        if (g_textures_refs[key] > 0) {
            return;
        }
        delete g_textures_refs[key];

        if (FORCE_NATIVE) {
            // @ts-ignore
            efk.EFKMaterialN.setTexture(key, g_textures[key], true);
        }
        delete g_textures[key];
    });

    // 加载材质
    efk.effekseer.setMaterialLoaderEvent((key: number, src: string) => {
        g_material_slot++;

        if (null == g_materials[key]) {
            g_materials[key] = [];
            g_materials_refs[key] = 0;
        }
        g_materials_refs[key] += 1;

        let origin = g_component._materials[g_material_slot];

        let matSprite = new Material();
        matSprite.initialize({
            effectAsset: origin.effectAsset,
            effectName: origin.effectName,
            technique: efk.RendererMode.Sprite
        });
        g_materials[key][efk.RendererMode.Sprite] = matSprite;

        let matModel = new Material();
        matModel.initialize({
            effectAsset: origin.effectAsset,
            effectName: origin.effectName,
            technique: efk.RendererMode.Model
        });

        if (FORCE_NATIVE) {
            // @ts-ignore
            efk.EFKMaterialN.setCumstom(key, [matSprite, matModel], false);
        }
        else {
            g_materials[key][efk.RendererMode.Model] = matModel;
        }

        log('MAT: ', src, g_material_slot, key);
        return g_component.efkMats[g_material_slot]._nativeAsset;
    }, (src: string, key: number) => {
        g_materials_refs[key] -= 1;

        if (g_materials_refs[key] > 0) {
            return;
        }
        delete g_materials_refs[key];
        
        if (FORCE_NATIVE) {
            // @ts-ignore
            efk.EFKMaterialN.setCumstom(key, g_materials[key], true);
        }
        else {
            g_materials[key].forEach((mat) => {
                mat.destroy();
            });
            delete g_materials[key];
        }
        log('DEL: ', src);
    }, (key: number, shader: any, type: number) => {
    });

    // 加载模型
    efk.effekseer.setModelLoaderEvent((key: number, src: string) => {
        g_model_slot++;

        if (null == g_models_refs[key]) {
            g_models_refs[key] = 0;
        }
        g_models_refs[key] += 1;

        log('MOD: ', src, g_model_slot, key);
        return g_component.efkModels[g_model_slot]._nativeAsset;
    }, (key: number, model: any) => {
        for (let i = 0; i < model.getFrameCount(); ++i) {
            if (FORCE_NATIVE) {
                // @ts-ignore
                efk.EFKModelN.addModel(key, model.getVertecies(i), model.getFaces(i), i);
            }
            else {
                EFKModel.addModel(key, model.getVertecies(i), model.getFaces(i), i);
            }
        }
    }, (key: number, src: string) => {
        g_models_refs[key] -= 1;

        if (g_models_refs[key] > 0) {
            return;
        }
        delete g_models_refs[key];

        if (FORCE_NATIVE) {
            // @ts-ignore
            efk.EFKModelN.removeModel(key);
        }
        else {
            EFKModel.removeModel(key);
        }
        log('DEL: ', src);
    });

    // 注册帧更新事件
    if (null != globalThis.efk_render_call) {
        director.off(Director.EVENT_AFTER_UPDATE, globalThis.efk_render_call);
        director.off(Director.EVENT_BEFORE_UPDATE, globalThis.efk_render_clean);
        director.off('efk-clear-cache', globalThis.efk_clear_cache);
    }
    globalThis.efk_render_call = () => {
        render();
    };
    director.on(Director.EVENT_AFTER_UPDATE, globalThis.efk_render_call);

    globalThis.efk_render_clean = () => {
        clearCacheImmediately();
    };
    director.on(Director.EVENT_BEFORE_UPDATE, globalThis.efk_render_clean);

    globalThis.efk_clear_cache = () => {
        clearCache();
    };
    director.on('efk-clear-cache', globalThis.efk_clear_cache);
}

function resume() {
    g_stepmode = false;
}

function clearCacheImmediately() {
    if (!g_isClearMask) {
        return;
    }    
    g_isClearMask = false;

    for (let src in g_effects_loader) {
        let effect = g_effects_loader[src];
        if (g_effects_refs[effect] <= 0) {
            efk.effekseer.unloadResources(effect);
            delete g_effects_loader[src];
        }
    }

    if (FORCE_NATIVE) {
        // @ts-ignore
        efk.EFKMaterialN.clearCache();
    }
    else {
        EFKMaterial.clearCache();
    }
}

function clearCache() {
    g_isClearMask = true;
}

function isInit(): boolean {
    return g_isInit;
}

export const EFKRender = {
    // for render status control
    setup,
    resume,
    load,
    unload,
    updateCamera,
    enableExternalTexture,
    clearCache,
    isInit,
    // for play effect
    play,
    stop,
    setFrame,
    setSpeed,
    setPause,
    setWorldMatrix,
    cameras: g_cameras
}