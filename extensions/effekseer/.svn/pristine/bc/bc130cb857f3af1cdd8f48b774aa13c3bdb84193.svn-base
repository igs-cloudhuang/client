
#include "./graphics.h"
#include "../effekseer.h"

namespace cce {

void Graphics::SetBackGroundTextureToRenderer(EffekseerRenderer::Renderer* renderer, Effekseer::Backend::TextureRef backgroundTexture) {
    renderer->SetBackground(backgroundTexture);
}

void Graphics::SetDepthTextureToRenderer(EffekseerRenderer::Renderer*   renderer,
                                         const Effekseer::Matrix44&     projectionMatrix,
                                         Effekseer::Backend::TextureRef depthTexture) {
    if (depthTexture == nullptr) {
        renderer->SetDepth(nullptr, EffekseerRenderer::DepthReconstructionParameter{});
        return;
    }

    EffekseerRenderer::DepthReconstructionParameter param;
    param.DepthBufferScale   = 1.0f;
    param.DepthBufferOffset  = 0.0f;
    param.ProjectionMatrix33 = projectionMatrix.Values[2][2];
    param.ProjectionMatrix43 = projectionMatrix.Values[2][3];
    param.ProjectionMatrix34 = projectionMatrix.Values[3][2];
    param.ProjectionMatrix44 = projectionMatrix.Values[3][3];

    renderer->SetDepth(depthTexture, param);
}

Effekseer::RefPtr<EffekseerRenderer::Renderer> Graphics::CreateRenderer(int squareMaxCount, bool reversedDepth) {
    auto renderer = RendererImplemented::Create();
    if (renderer->Initialize(squareMaxCount)) {
        return renderer;
    }
    else {
        return nullptr;
    }
}

void Graphics::SetExternalTexture(int renderId, ExternalTextureType type, uint32_t texture) {
    auto& externalTexture = g_renderSettings[renderId].externalTextures[static_cast<int>(type)];

    // not changed
    if (externalTexture.OriginalPtr == texture) {
        return;
    }

    if (texture == 0) {
        externalTexture.Reset();
        return;
    }

    if (texture != 0) {
        externalTexture.Texture     = Effekseer::MakeRefPtr<Texture>(texture);
        externalTexture.OriginalPtr = texture;
    }
    else {
        externalTexture.Reset();
    }
}

Effekseer::TextureLoaderRef Graphics::CreateTextureLoader(TextureLoaderLoad load, TextureLoaderUnload unload) {
    return Effekseer::MakeRefPtr<TextureLoader>(load, unload);
}

Effekseer::ModelLoaderRef Graphics::CreateModelLoader(ModelLoaderLoad load, ModelLoaderMeshLoad meshload, ModelLoaderUnload unload) {
    auto loader         = Effekseer::MakeRefPtr<ModelLoader>(load, meshload, unload);
    auto internalLoader = EffekseerRenderer::CreateModelLoader(nullptr, loader->GetFileInterface());
    loader->SetInternalLoader(internalLoader);
    return loader;
}

Effekseer::MaterialLoaderRef Graphics::CreateMaterialLoader(MaterialLoaderLoad load, MaterialLoaderUnload unload, MaterialLoaderLoadShader loadShader) {
    return Effekseer::MakeRefPtr<MaterialLoader>(load, unload, loadShader);
}

Effekseer::ProceduralModelGeneratorRef Graphics::CreateMeshLoader(MeshLoaderLoad generate, MeshLoaderUnload ungenerate) {
    return Effekseer::MakeRefPtr<MeshLoader>(generate, ungenerate);
}

void Graphics::ShiftViewportForStereoSinglePass(bool isShift) {
}

RenderPass* Graphics::CreateRenderPass() {
    return nullptr;
}

void Graphics::SetRenderPath(EffekseerRenderer::Renderer* renderer, RenderPass* renderPath) {
}

bool Graphics::IsRequiredToFlipVerticallyWhenRenderToTexture() const {
    return true;
}

}
