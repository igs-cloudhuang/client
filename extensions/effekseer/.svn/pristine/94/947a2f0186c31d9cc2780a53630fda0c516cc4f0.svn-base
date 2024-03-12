
#include <sstream>

#include "./efk_material.h"
#include "cocos/scene/Pass.h"
#include "core/assets/EffectAsset.h"
#include "renderer/core/ProgramLib.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cce {
extern RenderSettings g_renderSettings[MAX_RENDER_PATH];
}

enum class RendererMode : uint32_t {
    Sprite = 0,
    Model  = 1
};

void uniforms_gradient(cc::Material* material, cce::RenderParameter* param) {
    bool hasGradient = param->MaterialType == EffekseerRenderer::RendererShaderType::Material;

    if (!hasGradient) {
        return;
    }

    const uint8_t* infoBuffer = cce::effekseer::renderInfoBuffer().data();
    const float*   uniforms   = (float*)(infoBuffer + param->UniformBufferOffset);

    auto uniformOffset = 0;
    auto blocks        = material->getEffectAsset()->getShaders()[0].blocks;
    for (auto i = 0; i < blocks.size(); i++) {
        auto block = blocks[i];
        if (block.name != "EFK_UNIFORM_GRADIENT")
            continue;
        auto members = block.members;
        for (auto u = 0; u < members.size(); u++) {
            material->setPropertyVec4(members[u].name, cc::Vec4(
                                                           uniforms[uniformOffset + 0],
                                                           uniforms[uniformOffset + 1],
                                                           uniforms[uniformOffset + 2],
                                                           uniforms[uniformOffset + 3]));
            uniformOffset += 4;
        }
    }
}

void uniforms_light(cc::Material* material, cce::RenderParameter* param) {
    bool hasLight = param->MaterialType == EffekseerRenderer::RendererShaderType::Material ||
                    param->MaterialType == EffekseerRenderer::RendererShaderType::Lit ||
                    param->MaterialType == EffekseerRenderer::RendererShaderType::AdvancedLit;

    if (!hasLight) {
        return;
    }

    material->setPropertyVec4("fLightColor", cc::Vec4(1.0, 1.0, 1.0, 1.0));
    material->setPropertyVec4("fLightAmbient", cc::Vec4(0.15, 0.15, 0.15, 1));
    material->setPropertyVec4("fLightDirection", cc::Vec4(1.0, 1.0, 1.0, 1.0));
}

void uniforms_advanced(cc::Material* material, cce::RenderParameter* param) {
    bool hasAdvanced = param->MaterialType == EffekseerRenderer::RendererShaderType::AdvancedBackDistortion ||
                       param->MaterialType == EffekseerRenderer::RendererShaderType::AdvancedLit ||
                       param->MaterialType == EffekseerRenderer::RendererShaderType::AdvancedUnlit;

    if (!hasAdvanced) {
        return;
    }

    auto FlipbookParams = param->FlipbookParams;
    auto FalloffParam   = param->FalloffParam;
    auto EdgeParams     = param->EdgeParams;
    material->setPropertyVec4("fFlipbookParameter", cc::Vec4(FlipbookParams.Enable, FlipbookParams.LoopType, FlipbookParams.DivideX, FlipbookParams.DivideY));
    // material->setPropertyVec4("flipbookParameter2", cc::Vec4(FlipbookParams.OneSizeX, FlipbookParams.OneSizeY, FlipbookParams.OffsetX, FlipbookParams.OffsetY));
    material->setPropertyVec4("fUVDistortionParameter", cc::Vec4(param->UVDistortionIntensity, param->BlendUVDistortionIntensity, 1.0, 0.0));
    material->setPropertyVec4("fBlendTextureParameter", cc::Vec4(param->TextureBlendType, 0.0, 0.0, 0.0));
    material->setPropertyVec4("fFalloffParameter", cc::Vec4(param->EnableFalloff, FalloffParam.ColorBlendType, FalloffParam.Pow, 0.0));
    material->setPropertyColor("fFalloffBeginColor", cc::Color(FalloffParam.BeginColor[0], FalloffParam.BeginColor[1], FalloffParam.BeginColor[2], FalloffParam.BeginColor[3]));
    material->setPropertyColor("fFalloffEndColor", cc::Color(FalloffParam.EndColor[0], FalloffParam.EndColor[1], FalloffParam.EndColor[2], FalloffParam.EndColor[3]));
    material->setPropertyColor("fEdgeColor", cc::Color(EdgeParams.Color[0], EdgeParams.Color[1], EdgeParams.Color[2], EdgeParams.Color[3]));
    material->setPropertyVec4("fEdgeParameter", cc::Vec4(EdgeParams.Threshold, EdgeParams.ColorScaling, 0.0, 0.0));
}

void uniforms_uv_inversed(cc::Material* material, cce::RenderParameter* param) {
    if (param->MaterialType == EffekseerRenderer::RendererShaderType::Material) {
        material->setPropertyVec4("mUVInversedBack", cc::Vec4(0.0, 1.0, 0.0, 1.0));
        material->setPropertyVec4("mUVInversed", cc::Vec4(1.0, 1.0, 0.0, 0.0));
    }
    else {
        if (param->MaterialType == EffekseerRenderer::RendererShaderType::BackDistortion ||
            param->MaterialType == EffekseerRenderer::RendererShaderType::AdvancedBackDistortion) {
            material->setPropertyVec4("mUVInversedBack", cc::Vec4(0.0, 1.0, 0.0, 1.0));
        }

        // param->RenderMode == EffekseerRenderer::RendererShaderType::Model
        if (param->RenderMode == 1) {
            material->setPropertyVec4("mUVInversed", cc::Vec4(0.0, 1.0, 0.0, 0.0));
        }
        else {
            material->setPropertyVec4("mUVInversed", cc::Vec4(1.0, 1.0, 0.0, 0.0));
        }
    }
}

void uniforms_scale(cc::Material* material, cce::RenderParameter* param) {
    if (param->MaterialType == EffekseerRenderer::RendererShaderType::Material) {
        return;
    }

    if (param->MaterialType == EffekseerRenderer::RendererShaderType::BackDistortion ||
        param->MaterialType == EffekseerRenderer::RendererShaderType::AdvancedBackDistortion) {
        material->setPropertyVec4("g_scale", cc::Vec4(param->DistortionIntensity, 0.0, 0.0, 0.0));
    }
    else {
        material->setPropertyVec4("miscFlags", cc::Vec4(0.0, 0.0, 0.0, 0.0));
        material->setPropertyVec4("fEmissiveScaling", cc::Vec4(param->EmissiveScaling, 0.0, 0.0, 0.0));
    }
}

void uniforms_predefined(cc::Material* material, cce::RenderParameter* param) {
    if (param->MaterialType != EffekseerRenderer::RendererShaderType::Material) {
        return;
    }

    material->setPropertyVec4("predefined_uniform", cc::Vec4(param->PredefinedUniform[0], param->PredefinedUniform[1], param->PredefinedUniform[2], param->PredefinedUniform[3]));
}

void uniforms_reconstruction(cc::Material* material, cce::RenderParameter* param) {
    if (param->MaterialType != EffekseerRenderer::RendererShaderType::Material) {
        return;
    }

    material->setPropertyVec4("reconstructionParam1", cc::Vec4(param->ReconstrcutionParam1[0], param->ReconstrcutionParam1[1], param->ReconstrcutionParam1[2], param->ReconstrcutionParam1[3]));
    material->setPropertyVec4("reconstructionParam2", cc::Vec4(param->ReconstrcutionParam2[0], param->ReconstrcutionParam2[1], param->ReconstrcutionParam2[2], param->ReconstrcutionParam2[3]));
}

void uniforms_model(cc::Material* material, cce::RenderParameter* param, int32_t element) {
    if (param->RenderMode != (int)RendererMode::Model) {
        return;
    }

    const uint8_t* infoBuffer = cce::effekseer::renderInfoBuffer().data();

    auto   model_params_float_count = 29;
    auto   model_params_offset      = element * (sizeof(float) * model_params_float_count);
    float* models                   = (float*)(infoBuffer + param->VertexBufferOffset + model_params_offset);

    auto mModel = cc::Mat4(                            //
        models[0], models[1], models[2], models[3],    //
        models[4], models[5], models[6], models[7],    //
        models[8], models[9], models[10], models[11],  //
        models[12], models[13], models[14], models[15]);
    mModel.transpose();

    material->setPropertyMat4("mModel", mModel);
    material->setPropertyVec4("fUV", cc::Vec4(models[16], models[17], models[18], models[19]));
    material->setPropertyVec4("fModelColor", cc::Vec4(models[20], models[21], models[22], models[23]));
    if (param->MaterialType == EffekseerRenderer::RendererShaderType::Material && param->CustomData1BufferOffset > 0) {
        material->setPropertyVec4("customData1", cc::Vec4(models[25], models[26], models[27], models[28]));
    }
}

std::map<int32_t, std::vector<cc::Material*>>   EFKMaterialN::cumstoms;
std::vector<cc::Material*>                      EFKMaterialN::internals;

std::map<int32_t, cc::Texture2D*>       EFKMaterialN::textures;
std::map<int32_t, int32_t>              EFKMaterialN::keys;
std::map<std::string, cc::Material*>    EFKMaterialN::caches;

void EFKMaterialN::setInternals(std::vector<cc::Material*> _internals) {
    internals = _internals;
    for (auto mat : internals) {
        mat->addAssetRef();
    }
}

void EFKMaterialN::setTexture(int32_t id, cc::Texture2D* texture, bool isremove) {
    if (!isremove) {
        texture->addRef();
        textures.insert(std::make_pair(id, texture));
        return;
    }
    if (textures.find(id) != textures.end()) {
        texture->release();
        textures.erase(id);
    }
}

void EFKMaterialN::setCumstom(int32_t id, std::vector<cc::Material*> mats, bool isremove) {
    if (!isremove) {
        for (auto mat : mats) {
            mat->addRef();
        }
        cumstoms.insert(std::make_pair(id, mats));
        return;
    }
    if (cumstoms.find(id) != cumstoms.end()) {
        for (auto mat : mats) {
            mat->release();
        }
        cumstoms.erase(id);
    }
}

void EFKMaterialN::clearCache() {
    for (auto mat : caches) {
        mat.second->release();
    }
    caches.clear();
}

std::string EFKMaterialN::calcHash(cce::RenderParameter* param) {
    std::stringstream hash_str;

    for (auto id = 0; id < param->TextureCount; ++id) {
        hash_str << param->TexturePtrs[id];
        hash_str << param->TextureFilterTypes[id];
    }

    hash_str << param->MaterialPtr << param->Blend << param->ZTest << param->ZWrite;
    auto key = std::hash<std::string>{}(hash_str.str());

    if (keys.find(key) == keys.end()) {
        keys.insert(std::make_pair(key, 0));
    }
    keys[key] += 1;

    hash_str.clear();
    hash_str << key << "_" << keys[key];

    return hash_str.str();
}

void EFKMaterialN::reset() {
    keys.clear();
}

cc::Material* EFKMaterialN::check(cce::RenderParameter* param, float* uniforms, float* models, cc::scene::Camera* cam, uint32_t renderid, int32_t element) {
    // 计算材质 HASH, 方便合批
    auto hash = calcHash(param);
    if (caches.find(hash) == caches.end()) {
        caches.insert(std::make_pair(hash, create(param, uniforms)));
    }

    auto material = caches[hash];
    auto settings = cce::g_renderSettings[renderid];
    auto viewMat4 = cc::Mat4((float*)settings.cameraMatrix.Values);
    auto projMat4 = cc::Mat4((float*)settings.projectionMatrix.Values);

    viewMat4.transpose();
    viewMat4.inverse();
    projMat4.transpose();

    if (param->MaterialType == EffekseerRenderer::RendererShaderType::Material) {
        if (param->RenderMode == (int)RendererMode::Sprite) {
            material->setPropertyMat4("uMatCamera", viewMat4);
            material->setPropertyMat4("uMatProjection", projMat4);
        }

        if (param->RenderMode == (int)RendererMode::Model) {
            const cc::Vec3& pos = cam->getPosition();
            cc::Vec4 posv4(pos.x, pos.y, pos.z, 1.0);
            material->setPropertyMat4("mProjection", projMat4 * viewMat4);
            material->setPropertyVec4("cameraPosition", posv4);
        }
    }
    else {
        material->setPropertyMat4("mCameraProj", projMat4 * viewMat4);
    }

    uniforms_predefined(material, param);
    uniforms_reconstruction(material, param);
    uniforms_model(material, param, element);
    uniforms_scale(material, param);
    uniforms_light(material, param);
    uniforms_advanced(material, param);
    uniforms_gradient(material, param);
    uniforms_uv_inversed(material, param);

    return material;
}

void EFKMaterialN::setTextures(cc::MaterialInstance* material, cce::RenderParameter* param) {
    cc::gfx::Device* device = cc::gfx::Device::getInstance();

    auto pass    = (*material->getPasses().get())[0].get();
    auto samples = pass->getShaderInfo()->samplerTextures;

    // 填充纹理
    for (auto id = 0; id < param->TextureCount; ++id) {
        auto hashkey = param->TexturePtrs[id];
        if (samples.size() <= id)
            continue;

        auto sample = samples[id];
        auto texture = textures[hashkey];

        if (texture != nullptr) {
            material->setProperty(sample.name, texture);
        }

        auto            filter    = param->TextureFilterTypes[id];
        cc::gfx::Filter minFilter = (uint32_t)Effekseer::TextureFilterType::Linear == filter ? cc::gfx::Filter::LINEAR : cc::gfx::Filter::POINT;
        cc::gfx::Filter magFilter = (uint32_t)Effekseer::TextureFilterType::Linear == filter ? cc::gfx::Filter::LINEAR : cc::gfx::Filter::POINT;

        auto info = device->getSampler(cc::gfx::SamplerInfo{minFilter, magFilter});
        pass->bindSampler(sample.binding, info);
    }
}

void EFKMaterialN::setPipelineStates(cc::MaterialInstance* material, cce::RenderParameter* param) {
    auto pass = (*material->getPasses().get())[0].get();

    cc::BlendTargetInfo target;
    target.blend = true;

    if (param->Blend == (uint32_t)Effekseer::AlphaBlendType::Opacity) {
        target.blendSrc      = cc::gfx::BlendFactor::ONE;
        target.blendDst      = cc::gfx::BlendFactor::ZERO;
        target.blendEq       = cc::gfx::BlendOp::ADD;
        target.blendSrcAlpha = cc::gfx::BlendFactor::ONE;
        target.blendDstAlpha = cc::gfx::BlendFactor::ONE;
        target.blendAlphaEq  = cc::gfx::BlendOp::MAX;
    }
    else if (param->Blend == (uint32_t)Effekseer::AlphaBlendType::Blend) {
        target.blendSrc      = cc::gfx::BlendFactor::SRC_ALPHA;
        target.blendDst      = cc::gfx::BlendFactor::ONE_MINUS_SRC_ALPHA;
        target.blendEq       = cc::gfx::BlendOp::ADD;
        target.blendSrcAlpha = cc::gfx::BlendFactor::ONE;
        target.blendDstAlpha = cc::gfx::BlendFactor::ONE;
        target.blendAlphaEq  = cc::gfx::BlendOp::ADD;
    }
    else if (param->Blend == (uint32_t)Effekseer::AlphaBlendType::Add) {
        target.blendSrc      = cc::gfx::BlendFactor::SRC_ALPHA;
        target.blendDst      = cc::gfx::BlendFactor::ONE;
        target.blendEq       = cc::gfx::BlendOp::ADD;
        target.blendSrcAlpha = cc::gfx::BlendFactor::ONE;
        target.blendDstAlpha = cc::gfx::BlendFactor::ONE;
        target.blendAlphaEq  = cc::gfx::BlendOp::ADD;
    }
    else if (param->Blend == (uint32_t)Effekseer::AlphaBlendType::Mul) {
        target.blendSrc      = cc::gfx::BlendFactor::ZERO;
        target.blendDst      = cc::gfx::BlendFactor::SRC_COLOR;
        target.blendEq       = cc::gfx::BlendOp::ADD;
        target.blendSrcAlpha = cc::gfx::BlendFactor::ZERO;
        target.blendDstAlpha = cc::gfx::BlendFactor::ONE;
        target.blendAlphaEq  = cc::gfx::BlendOp::ADD;
    }
    else if (param->Blend == (uint32_t)Effekseer::AlphaBlendType::Sub) {
        target.blendSrc      = cc::gfx::BlendFactor::ONE;
        target.blendDst      = cc::gfx::BlendFactor::ZERO;
        target.blendEq       = cc::gfx::BlendOp::ADD;
        target.blendSrcAlpha = cc::gfx::BlendFactor::ONE;
        target.blendDstAlpha = cc::gfx::BlendFactor::ONE;
        target.blendAlphaEq  = cc::gfx::BlendOp::MAX;
    }

    auto cullMode = cc::gfx::CullMode::NONE;
    if (param->Culling == (uint32_t)Effekseer::CullingType::Front)
        cullMode = cc::gfx::CullMode::FRONT;
    if (param->Culling == (uint32_t)Effekseer::CullingType::Back)
        cullMode = cc::gfx::CullMode::BACK;

    cc::IPassInfoFull info;

    info.blendState = cc::BlendStateInfo{};
    info.blendState.get().targets = cc::BlendTargetInfoList{target};

    info.rasterizerState                = cc::RasterizerStateInfo{};
    info.rasterizerState.get().cullMode = cullMode;

    info.depthStencilState                  = cc::DepthStencilStateInfo();
    info.depthStencilState.get().depthTest  = param->ZTest == 1;
    info.depthStencilState.get().depthWrite = param->ZWrite == 1;
    info.depthStencilState.get().depthFunc  = cc::gfx::ComparisonFunc::LESS_EQUAL;

    material->overridePipelineStates(cc::PassOverrides(info));
}

cc::Material* EFKMaterialN::create(cce::RenderParameter* param, float* uniforms) {
    cc::MaterialInstance* material = nullptr;
    
    if (param->MaterialType != EffekseerRenderer::RendererShaderType::Material) {
        auto idx = (param->RenderMode == (uint32_t)RendererMode::Model) ? (((uint32_t)EffekseerRenderer::RendererShaderType::Material) + ((uint32_t)param->MaterialType)) : (uint32_t)param->MaterialType;
        material = new cc::MaterialInstance({ internals[idx] });
    }
    else {
        auto origin = cumstoms[param->MaterialPtr][param->RenderMode];
        material    = new cc::MaterialInstance({ origin });
    }

    setTextures(material, param);
    setPipelineStates(material, param);

    material->addRef();
    return material;
}
