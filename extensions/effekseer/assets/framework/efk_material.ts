import { ImageAsset, Mat4, Material, Texture2D, Vec4, director, gfx, renderer } from "cc";

let g_materialCache: Record<string, renderer.MaterialInstance> = {};
let g_materialKeys: Record<number, number> = {};
let g_textures: Record<number, Texture2D> = {};
let g_materials: Record<number, Material[]> = {};
let g_defaultMats: Material[] = [];
let g_defaultWhite: Texture2D = null!;
let g_defaultNormal: Texture2D = null!;

function string_hash(str: string) {
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

function material_hash(param: efk.RenderParameter) {
    let hash_str = "";
    for (let id = 0; id < param.TextureCount; ++id) {
        hash_str += param.TexturePtrs[id].toString();
        hash_str += param.TextureFilterTypes[id].toString();
    }
    let key = string_hash(`${param.MaterialPtr}${param.Blend}${param.ZTest}${param.ZWrite}${param.VertexBufferStride}` + hash_str);

    if (!g_materialKeys[key]) g_materialKeys[key] = 0;
    g_materialKeys[key] = g_materialKeys[key] + 1;

    return `${key}_${g_materialKeys[key]}`;
}

function reset() {
    g_materialKeys = {};
}

function clearCache() {
    for (let key in g_materialCache) {
        g_materialCache[key].destroy();
    }
    g_materialCache = {};
}

function uniforms_gradient(material: renderer.MaterialInstance, param: efk.RenderParameter, uniforms: Float32Array) {
    let hasGradient = param.MaterialType == efk.RendererShaderType.Material;

    if (!hasGradient) {
        return;
    }

    let uniformOffset: number = 0;
    let blocks = material.passes[0].shaderInfo.blocks;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.name != 'EFK_UNIFORM_GRADIENT') continue;
        let members = block.members;
        for (let u = 0; u < members.length; u++) {
            material.setProperty(members[u].name,
                new Vec4(
                    uniforms[uniformOffset + 0],
                    uniforms[uniformOffset + 1],
                    uniforms[uniformOffset + 2],
                    uniforms[uniformOffset + 3]
                )
            );
            uniformOffset += 4;
        }
    }
}

function uniforms_light(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    let hasLight = param.MaterialType == efk.RendererShaderType.Material ||
        param.MaterialType == efk.RendererShaderType.Lit ||
        param.MaterialType == efk.RendererShaderType.AdvancedLit;

    if (!hasLight) {
        return;
    }

    material.setProperty("fLightColor", new Vec4(1.0, 1.0, 1.0, 1.0));
    material.setProperty("fLightAmbient", new Vec4(0.15, 0.15, 0.15, 1));
    material.setProperty("fLightDirection", new Vec4(1.0, 1.0, 1.0, 1.0));
}

function uniforms_advanced(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    let hasAdvanced = param.MaterialType == efk.RendererShaderType.AdvancedBackDistortion ||
        param.MaterialType == efk.RendererShaderType.AdvancedLit ||
        param.MaterialType == efk.RendererShaderType.AdvancedUnlit;

    if (!hasAdvanced) {
        return;
    }

    const FlipbookParams = param.getFlipbookParams();
    const FalloffParam = param.getFalloffParam();
    const EdgeParams = param.getEdgeParams();
    material.setProperty("fFlipbookParameter", new Vec4(FlipbookParams.Enable, FlipbookParams.LoopType, FlipbookParams.DivideX, FlipbookParams.DivideY));
    //material.setProperty("flipbookParameter2", new Vec4(FlipbookParams.OneSizeX, FlipbookParams.OneSizeY, FlipbookParams.OffsetX, FlipbookParams.OffsetY));
    material.setProperty("fUVDistortionParameter", new Vec4(param.UVDistortionIntensity, param.BlendUVDistortionIntensity, 1.0, 0.0));
    material.setProperty("fBlendTextureParameter", new Vec4(param.TextureBlendType, 0.0, 0.0, 0.0));
    material.setProperty("fFalloffParameter", new Vec4(param.EnableFalloff, FalloffParam.ColorBlendType, FalloffParam.Pow, 0.0));
    material.setProperty("fFalloffBeginColor", FalloffParam.BeginColor);
    material.setProperty("fFalloffEndColor", FalloffParam.EndColor);
    material.setProperty("fEdgeColor", EdgeParams.Color);
    material.setProperty("fEdgeParameter", new Vec4(EdgeParams.Threshold, EdgeParams.ColorScaling, 0.0, 0.0));
}

function uniforms_uv_inversed(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    if (param.MaterialType == efk.RendererShaderType.Material) {
        material.setProperty("mUVInversedBack", new Vec4(0.0, 1.0, 0.0, 1.0));
        material.setProperty("mUVInversed", new Vec4(1.0, 1.0, 0.0, 0.0));
    }
    else {
        if (param.MaterialType == efk.RendererShaderType.BackDistortion ||
            param.MaterialType == efk.RendererShaderType.AdvancedBackDistortion) {
            material.setProperty("mUVInversedBack", new Vec4(0.0, 1.0, 0.0, 1.0));
        }

        if (param.RenderMode == efk.RendererMode.Model) {
            material.setProperty("mUVInversed", new Vec4(0.0, 1.0, 0.0, 0.0));
        }
        else {
            material.setProperty("mUVInversed", new Vec4(1.0, 1.0, 0.0, 0.0));
        }
    }
}

function uniforms_scale(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    if (param.MaterialType == efk.RendererShaderType.Material) {
        return;
    }

    if (param.MaterialType == efk.RendererShaderType.BackDistortion ||
        param.MaterialType == efk.RendererShaderType.AdvancedBackDistortion) {
        material.setProperty("g_scale", new Vec4(param.DistortionIntensity, 0.0, 0.0, 0.0));
    }
    else {
        material.setProperty("miscFlags", new Vec4(0.0, 0.0, 0.0, 0.0));
        material.setProperty("fEmissiveScaling", new Vec4(param.EmissiveScaling, 0.0, 0.0, 0.0));
    }
}

function uniforms_predefined(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    if (param.MaterialType != efk.RendererShaderType.Material) {
        return;
    }

    material.setProperty("predefined_uniform", new Vec4(param.PredefinedUniform[0], param.PredefinedUniform[1], param.PredefinedUniform[2], param.PredefinedUniform[3]));
}

function uniforms_reconstruction(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    if (param.MaterialType != efk.RendererShaderType.Material) {
        return;
    }

    material.setProperty("reconstructionParam1", new Vec4(param.ReconstrcutionParam1[0], param.ReconstrcutionParam1[1], param.ReconstrcutionParam1[2], param.ReconstrcutionParam1[3]));
    material.setProperty("reconstructionParam2", new Vec4(param.ReconstrcutionParam2[0], param.ReconstrcutionParam2[1], param.ReconstrcutionParam2[2], param.ReconstrcutionParam2[3]));
}

function uniforms_model(material: renderer.MaterialInstance, param: efk.RenderParameter, models: Float32Array) {
    if (param.RenderMode != efk.RendererMode.Model) {
        return;
    }

    material.setProperty("mModel", new Mat4(//
        models[0], models[1], models[2], models[3], //
        models[4], models[5], models[6], models[7], //
        models[8], models[9], models[10], models[11], //
        models[12], models[13], models[14], models[15]));
    material.setProperty("fUV", new Vec4(models[16], models[17], models[18], models[19]));
    material.setProperty("fModelColor", new Vec4(models[20], models[21], models[22], models[23]));

    if (param.MaterialType == efk.RendererShaderType.Material && param.CustomData1BufferOffset > 0) {
        material.setProperty("customData1", new Vec4(models[25], models[26], models[27], models[28]));
    }
}

function uniforms_textures(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    const pass = material.passes[0];
    const samples = pass.shaderInfo.samplerTextures;

    // 填充纹理
    for (let id = 0; id < param.TextureCount; ++id) {
        const hashkey = param.TexturePtrs[id];

        const sample = samples[id];
        if (null == sample) continue;

        const texture = g_textures[hashkey];
        material.setProperty(sample.name, texture);

        const filter = param.TextureFilterTypes[id] as number;
        let info = new gfx.SamplerInfo((efk.TextureFilterType.Linear == filter ? gfx.Filter.LINEAR : gfx.Filter.POINT), (efk.TextureFilterType.Linear == filter ? gfx.Filter.LINEAR : gfx.Filter.POINT));
        material.passes[0].bindSampler(sample.binding, director.root.device.getSampler(info));
    }
}

function pipeline_states(material: renderer.MaterialInstance, param: efk.RenderParameter) {
    let target = new gfx.BlendTarget();
    target.assign(material.passes[0].blendState.targets[0]);
    target.blend = true;

    if (param.Blend == efk.AlphaBlendType.Opacity) {
        target.blendSrc = gfx.BlendFactor.ONE;
        target.blendDst = gfx.BlendFactor.ZERO;
        target.blendEq = gfx.BlendOp.ADD;
        target.blendSrcAlpha = gfx.BlendFactor.ONE;
        target.blendDstAlpha = gfx.BlendFactor.ONE;
        target.blendAlphaEq = gfx.BlendOp.MAX;
    }
    else if (param.Blend == efk.AlphaBlendType.Blend) {
        target.blendSrc = gfx.BlendFactor.SRC_ALPHA;
        target.blendDst = gfx.BlendFactor.ONE_MINUS_SRC_ALPHA;
        target.blendEq = gfx.BlendOp.ADD;
        target.blendSrcAlpha = gfx.BlendFactor.ONE;
        target.blendDstAlpha = gfx.BlendFactor.ONE;
        target.blendAlphaEq = gfx.BlendOp.ADD;
    }
    else if (param.Blend == efk.AlphaBlendType.Add) {
        target.blendSrc = gfx.BlendFactor.SRC_ALPHA;
        target.blendDst = gfx.BlendFactor.ONE;
        target.blendEq = gfx.BlendOp.ADD;
        target.blendSrcAlpha = gfx.BlendFactor.ONE;
        target.blendDstAlpha = gfx.BlendFactor.ONE;
        target.blendAlphaEq = gfx.BlendOp.ADD;
    }
    else if (param.Blend == efk.AlphaBlendType.Mul) {
        target.blendSrc = gfx.BlendFactor.ZERO;
        target.blendDst = gfx.BlendFactor.SRC_COLOR;
        target.blendEq = gfx.BlendOp.ADD;
        target.blendSrcAlpha = gfx.BlendFactor.ZERO;
        target.blendDstAlpha = gfx.BlendFactor.ONE;
        target.blendAlphaEq = gfx.BlendOp.ADD;
    }
    else if (param.Blend == efk.AlphaBlendType.Sub) {
        target.blendSrc = gfx.BlendFactor.ONE;
        target.blendDst = gfx.BlendFactor.ZERO;
        target.blendEq = gfx.BlendOp.ADD;
        target.blendSrcAlpha = gfx.BlendFactor.ONE;
        target.blendDstAlpha = gfx.BlendFactor.ONE;
        target.blendAlphaEq = gfx.BlendOp.MAX;
    }

    let cullMode = gfx.CullMode.NONE;
    if (param.Culling == efk.CullingType.Front) cullMode = gfx.CullMode.FRONT;
    if (param.Culling == efk.CullingType.Back) cullMode = gfx.CullMode.BACK;

    material.overridePipelineStates({
        rasterizerState: {
            cullMode: cullMode
        },
        depthStencilState: {
            depthTest: param.ZTest == 1,
            depthWrite: param.ZWrite == 1,
            depthFunc: gfx.ComparisonFunc.LESS_EQUAL
        },
        blendState: {
            targets: [target]
        },
        // @ts-ignore
        batchingScheme: renderer.BatchingSchemes.VB_MERGING
    })
}

function material_update(param: efk.RenderParameter, material: renderer.MaterialInstance, uniforms: Float32Array, models: Float32Array, cam: renderer.scene.Camera, element: number) {
    if (param.MaterialType == efk.RendererShaderType.Material) {
        // 精灵渲染
        if (param.RenderMode == efk.RendererMode.Sprite) {
            material.setProperty("uMatCamera", cam.matView);
            material.setProperty("uMatProjection", cam.matProj);
        }

        // 模型渲染
        if (param.RenderMode == efk.RendererMode.Model) {
            material.setProperty("mProjection", cam.matViewProj);
            material.setProperty("cameraPosition", new Vec4(cam.node.position.x, cam.node.position.y, cam.node.position.z, 1.0));
        }
    }
    else {
        material.setProperty("mCameraProj", cam.matViewProj);
    }

    uniforms_predefined(material, param);
    uniforms_reconstruction(material, param);
    uniforms_model(material, param, models);
    uniforms_scale(material, param);
    uniforms_light(material, param);
    uniforms_advanced(material, param);
    uniforms_gradient(material, param, uniforms);
    uniforms_uv_inversed(material, param);
}

function config(textures: Record<number, Texture2D>, materials: Record<number, Material[]>, defaultMats: Material[]) {
    g_textures = textures;
    g_materials = materials;
    g_defaultMats = defaultMats;

    let imageAsset = new ImageAsset();
    imageAsset.reset({
        _data: new Uint8ClampedArray([255, 255, 255, 255]),
        width: 1,
        height: 1,
        format: Texture2D.PixelFormat.RGBA8888,
        _compressed: false
    });

    g_defaultWhite = new Texture2D;
    g_defaultWhite.mipmaps = [imageAsset];
    g_textures[0] = g_defaultWhite;

    g_defaultNormal = new Texture2D;
    g_defaultNormal.mipmaps = [imageAsset];
    g_textures[1] = g_defaultNormal;
}

function create(param: efk.RenderParameter, uniforms: Float32Array) {
    let material: renderer.MaterialInstance = null!;

    if (param.MaterialType != efk.RendererShaderType.Material) {
        material = new renderer.MaterialInstance({
            parent: g_defaultMats[param.RenderMode == efk.RendererMode.Model ? efk.RendererShaderType.Material + param.MaterialType : param.MaterialType]
        });
    }
    else {
        let origin = g_materials[param.MaterialPtr][param.RenderMode];
        material = new renderer.MaterialInstance({
            parent: origin
        });
    }

    uniforms_textures(material, param);
    pipeline_states(material, param);

    return material;
}

function check(param: efk.RenderParameter, uniforms: Float32Array, models: Float32Array, cam: renderer.scene.Camera, renderid: number, element: number) {
    // 计算材质 HASH, 方便合批
    let hash = material_hash(param);
    //console.log(hash)
    let material = g_materialCache[hash];

    if (null == material) {
        g_materialCache[hash] = material = create(param, uniforms);
    }

    material_update(param, material, uniforms, models, cam, element);
    return material
}


export const EFKMaterial = {
    config,
    check,
    reset,
    clearCache
}