
#pragma once

#include "../loader/curve.h"
#include "../loader/material.h"
#include "../loader/model.h"
#include "../loader/sound.h"
#include "../loader/texture.h"

#include <Effekseer.h>
#include <EffekseerRenderer.Renderer.h>

namespace cce {

enum class ExternalTextureType : int {
    Background,
    Depth,
    Max,
};

enum class StereoRenderingType : int {
    // Multiple pass VR rendering.
    MultiPass = 0,
    // Single pass VR rendering ( via double-wide render texture ).
    SinglePass = 1,
    // Single pass VR rendering ( via instanced rendering ).
    Instancing = 2
};

struct ExternalTextureProperty {
    Effekseer::Backend::TextureRef Texture;
    uint32_t                       OriginalPtr = 0;

    void Reset() {
        Texture.Reset();
        OriginalPtr = 0;
    }
};
using ExternalTextureArray = std::array<ExternalTextureProperty, static_cast<int>(ExternalTextureType::Max)>;

struct RenderSettings {
    int32_t                               id                = 0;
    int32_t                               cameraCullingMask = 1;
    Effekseer::Matrix44                   cameraMatrix;
    Effekseer::Matrix44                   projectionMatrix;
    bool                                  renderIntoTexture = false;
    ExternalTextureArray                  externalTextures;
    bool                                  stereoEnabled       = false;
    int                                   stereoRenderCount   = 1;
    StereoRenderingType                   stereoRenderingType = StereoRenderingType::MultiPass;
    Effekseer::Matrix44                   leftCameraMatrix;
    Effekseer::Matrix44                   leftProjectionMatrix;
    Effekseer::Matrix44                   rightCameraMatrix;
    Effekseer::Matrix44                   rightProjectionMatrix;
    Effekseer::Backend::TextureFormatType renderTargetType = Effekseer::Backend::TextureFormatType::R8G8B8A8_UNORM;
    Effekseer::Backend::TextureFormatType depthTargetType  = Effekseer::Backend::TextureFormatType::D32S8;
    int32_t                               screenWidth      = 0;
    int32_t                               screenHeight     = 0;
    RenderSettings() {
        for (auto& t : externalTextures) {
            t.Reset();
        }
    }
};

class RenderPass {
public:
    RenderPass()          = default;
    virtual ~RenderPass() = default;

    //! if this renderpass is front, back render pass is sent as an argument
    virtual void Begin(RenderSettings& setting, RenderPass* backRenderPass) {}
    virtual void End(RenderSettings& setting) {}
    virtual void Execute(RenderSettings& setting) {}
};

class Graphics {
public:
    Graphics()  = default;
    ~Graphics() = default;
    Effekseer::RefPtr<EffekseerRenderer::Renderer> CreateRenderer(int squareMaxCount, bool reversedDepth);
    void                                           SetBackGroundTextureToRenderer(EffekseerRenderer::Renderer* renderer, Effekseer::Backend::TextureRef backgroundTexture);
    void                                           SetDepthTextureToRenderer(EffekseerRenderer::Renderer* renderer, const Effekseer::Matrix44& projectionMatrix, Effekseer::Backend::TextureRef depthTexture);
    void                                           SetExternalTexture(int renderId, ExternalTextureType type, uint32_t texture);
    Effekseer::TextureLoaderRef                    CreateTextureLoader(TextureLoaderLoad load, TextureLoaderUnload unload);
    Effekseer::ModelLoaderRef                      CreateModelLoader(ModelLoaderLoad load, ModelLoaderMeshLoad meshload, ModelLoaderUnload unload);
    Effekseer::MaterialLoaderRef                   CreateMaterialLoader(MaterialLoaderLoad load, MaterialLoaderUnload unload, MaterialLoaderLoadShader loadShader);
    Effekseer::ProceduralModelGeneratorRef         CreateMeshLoader(MeshLoaderLoad generate, MeshLoaderUnload ungenerate);
    void                                           ShiftViewportForStereoSinglePass(bool isShift);
    RenderPass*                                    CreateRenderPass();
    void                                           SetRenderPath(EffekseerRenderer::Renderer* renderer, RenderPass* renderPath);
    void                                           WaitFinish();
    bool                                           IsRequiredToFlipVerticallyWhenRenderToTexture() const;
};

}