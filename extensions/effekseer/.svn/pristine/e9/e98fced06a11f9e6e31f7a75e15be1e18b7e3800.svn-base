
#include "./effekseer.h"
#include <assert.h>

namespace cce {
enum class RendererMode : uint32_t {
    Sprite = 0,
    Model  = 1
};

Graphics*             g_graphics;
RenderSettings        g_renderSettings[MAX_RENDER_PATH] = { {} };
Effekseer::ManagerRef g_manager;
Effekseer::Vector3D   g_lightDirection;
Effekseer::Color      g_lightColor;
Effekseer::Color      g_lightAmbientColor;
float                 g_time;

static int32_t                   g_uuid = 0;
static std::map<uint32_t, void*> g_objects;

static void Array2Matrix(Effekseer::Matrix44& matrix, float matrixArray[]) {
    matrix.Values[0][0] = matrixArray[0];
    matrix.Values[1][0] = matrixArray[1];
    matrix.Values[2][0] = matrixArray[2];
    matrix.Values[3][0] = matrixArray[3];
    matrix.Values[0][1] = matrixArray[4];
    matrix.Values[1][1] = matrixArray[5];
    matrix.Values[2][1] = matrixArray[6];
    matrix.Values[3][1] = matrixArray[7];
    matrix.Values[0][2] = matrixArray[8];
    matrix.Values[1][2] = matrixArray[9];
    matrix.Values[2][2] = matrixArray[10];
    matrix.Values[3][2] = matrixArray[11];
    matrix.Values[0][3] = matrixArray[12];
    matrix.Values[1][3] = matrixArray[13];
    matrix.Values[2][3] = matrixArray[14];
    matrix.Values[3][3] = matrixArray[15];
}

static void CalculateCameraDirectionAndPosition(const Effekseer::Matrix44& matrix, Effekseer::Vector3D& direction, Effekseer::Vector3D& position) {
    const auto& mat = matrix;
    direction       = -::Effekseer::Vector3D(matrix.Values[0][2], matrix.Values[1][2], matrix.Values[2][2]);
    {
        auto localPos = ::Effekseer::Vector3D(-mat.Values[3][0], -mat.Values[3][1], -mat.Values[3][2]);
        auto f        = ::Effekseer::Vector3D(mat.Values[0][2], mat.Values[1][2], mat.Values[2][2]);
        auto r        = ::Effekseer::Vector3D(mat.Values[0][0], mat.Values[1][0], mat.Values[2][0]);
        auto u        = ::Effekseer::Vector3D(mat.Values[0][1], mat.Values[1][1], mat.Values[2][1]);
        position      = r * localPos.X + u * localPos.Y + f * localPos.Z;
    }
}

void effekseer::updateTime(float deltaFrame) {
    g_time += deltaFrame * (1.0f / 60.0f);
}

void effekseer::resetTime() {
    g_time = 0.0f;
}

void effekseer::update(float deltaFrame) {
    Effekseer::Manager::UpdateParameter param;
    param.DeltaFrame     = deltaFrame;
    param.UpdateInterval = 1.0f;
    g_manager->Update(param);
}

int effekseer::loadEffect(std::string path, float magnification) {
    auto effect = Effekseer::Effect::Create(g_manager, UTF8ToUTF16(path).c_str(), magnification);

    g_uuid++;
    g_objects[g_uuid] = effect.Pin();

    return g_uuid;
}

int32_t effekseer::getFrameCount(int32_t handle) {
    auto pin    = g_objects[handle];
    auto effect = Effekseer::EffectRef::FromPinned(pin);
    auto ret    = effect->CalculateTerm();

    if (ret.TermMin > ret.TermMax) {
        return -ret.TermMax;
    }

    return ret.TermMax;
}

int effekseer::loadEffectOnMemory(std::vector<uint8_t> buffer, std::string path, float magnification) {
    auto effect = Effekseer::Effect::Create(g_manager, buffer.data(), (int32_t)(buffer.size()), magnification);
    effect->SetName(UTF8ToUTF16(path).c_str());

    g_uuid++;
    g_objects[g_uuid] = effect.Pin();

    return g_uuid;
}

void effekseer::releaseEffect(int32_t handle) {
    auto pin = g_objects[handle];
    Effekseer::EffectRef::Unpin(pin);
}

void effekseer::reloadResources(int32_t handle) {
    auto pin    = g_objects[handle];
    auto effect = Effekseer::EffectRef::FromPinned(pin);
    g_manager->LockRendering();
    effect->ReloadResources();
    g_manager->UnlockRendering();
}

void effekseer::unloadResources(int32_t handle) {
    auto pin    = g_objects[handle];
    auto effect = Effekseer::EffectRef::FromPinned(pin);
    g_manager->LockRendering();
    effect->UnloadResources();
    g_manager->UnlockRendering();
}

float effekseer::getEffectMagnification(int32_t handle) {
    auto pin    = g_objects[handle];
    auto effect = Effekseer::EffectRef::FromPinned(pin);
    return effect->GetMaginification();
}

int effekseer::playEffect(int32_t handle, float x, float y, float z) {
    auto pin    = g_objects[handle];
    auto effect = Effekseer::EffectRef::FromPinned(pin);
    return g_manager->Play(effect, x, y, z);
}

void effekseer::updateHandle(int32_t handle, float deltaFrame) {
    g_manager->BeginUpdate();
    g_manager->UpdateHandle(handle, deltaFrame);
    g_manager->EndUpdate();
}

void effekseer::updateHandleToMoveToFrame(int32_t handle, float frame) {
    g_manager->BeginUpdate();
    g_manager->UpdateHandleToMoveToFrame(handle, frame);
    g_manager->EndUpdate();
}

void effekseer::stopEffect(int32_t handle) {
    g_manager->StopEffect(handle);
}

void effekseer::stopRoot(int32_t handle) {
    g_manager->StopRoot(handle);
}

void effekseer::stopAllEffects() {
    g_manager->StopAllEffects();
}

void effekseer::setPausedToAllEffects(int paused) {
    g_manager->SetPausedToAllEffects(paused != 0);
}

int32_t effekseer::getCameraCullingMaskToShowAllEffects() {
    return g_manager->GetCameraCullingMaskToShowAllEffects();
}

int32_t effekseer::getShown(int32_t handle) {
    return g_manager->GetShown(handle);
}

void effekseer::setShown(int32_t handle, int shown) {
    g_manager->SetShown(handle, shown != 0);
}

int32_t effekseer::getPaused(int32_t handle) {
    return g_manager->GetPaused(handle);
}

void effekseer::setPaused(int32_t handle, int paused) {
    if (g_manager == NULL) {
        return;
    }

    g_manager->SetPaused(handle, paused != 0);
}

float effekseer::getSpeed(int32_t handle) {
    return g_manager->GetSpeed(handle);
}

void effekseer::setSpeed(int32_t handle, float speed) {
    g_manager->SetSpeed(handle, speed);
}

int effekseer::exists(int32_t handle) {
    if (g_manager == NULL) {
        return false;
    }

    return g_manager->Exists(handle);
}

void effekseer::setLocation(int32_t handle, float x, float y, float z) {
    g_manager->SetLocation(handle, x, y, z);
}

void effekseer::setMatrix(int32_t handle, std::vector<float> mat) {
    Effekseer::Matrix43 m43;
    m43.Value[0][0] = mat[0];
    m43.Value[0][1] = mat[1];
    m43.Value[0][2] = mat[2];
    m43.Value[1][0] = mat[4];
    m43.Value[1][1] = mat[5];
    m43.Value[1][2] = mat[6];
    m43.Value[2][0] = mat[8];
    m43.Value[2][1] = mat[9];
    m43.Value[2][2] = mat[10];
    m43.Value[3][0] = mat[12];
    m43.Value[3][1] = mat[13];
    m43.Value[3][2] = mat[14];
    g_manager->SetMatrix(handle, m43);
}

void effekseer::setRotation(int32_t handle, float x, float y, float z, float angle) {
    Effekseer::Vector3D axis(x, y, z);
    g_manager->SetRotation(handle, axis, angle);
}

void effekseer::setScale(int32_t handle, float x, float y, float z) {
    g_manager->SetScale(handle, x, y, z);
}

void effekseer::setAllColor(int32_t handle, int r, int g, int b, int a) {
    g_manager->SetAllColor(handle, Effekseer::Color(r, g, b, a));
}

void effekseer::setTargetLocation(int32_t handle, float x, float y, float z) {
    g_manager->SetTargetLocation(handle, x, y, z);
}

float effekseer::getDynamicInput(int32_t handle, int index) {
    return g_manager->GetDynamicInput(handle, index);
}

void effekseer::setDynamicInput(int32_t handle, int index, float value) {
    g_manager->SetDynamicInput(handle, index, value);
}

void effekseer::setLayer(int32_t handle, int layer) {
    g_manager->SetLayer(handle, layer);
}

void effekseer::setGroupMask(int32_t handle, int64_t groupMask) {
    g_manager->SetGroupMask(handle, groupMask);
}

void effekseer::setTimeScaleByGroup(int64_t groupMask, float timeScale) {
    g_manager->SetTimeScaleByGroup(groupMask, timeScale);
}

int effekseer::getInstanceCount(int32_t handle) {
    return g_manager->GetInstanceCount(handle);
}

int effekseer::getRestInstancesCount() {
    return g_manager->GetRestInstancesCount();
}

void effekseer::sendTrigger(int32_t handle, int32_t index) {
    g_manager->SendTrigger(handle, index);
}

void effekseer::setUserData(int32_t handle, int32_t userdata) {
    g_manager->SetUserData(handle, (void*)(int64_t)userdata);
}

void effekseer::setRemovingCallback(int32_t handle, std::function<void(int32_t)> cb) {
    g_manager->SetRemovingCallback(handle, [cb](Effekseer::Manager*, Effekseer::Handle handle, bool) {
        cb((int32_t)(int64_t)g_manager->GetUserData(handle));
    });
}

void effekseer::setLightDirection(float x, float y, float z) {
    g_lightDirection.X = x;
    g_lightDirection.Y = y;
    g_lightDirection.Z = z;
}

void effekseer::setLightColor(int32_t r, int32_t g, int32_t b) {
    g_lightColor.R = r;
    g_lightColor.G = g;
    g_lightColor.B = b;
}

void effekseer::setLightAmbientColor(int32_t r, int32_t g, int32_t b) {
    g_lightAmbientColor.R = r;
    g_lightAmbientColor.G = g;
    g_lightAmbientColor.B = b;
}

void effekseer::setProjectionMatrix(int renderId, std::vector<float> matrixArray) {
    if (renderId >= 0 && renderId < MAX_RENDER_PATH) {
        Array2Matrix(g_renderSettings[renderId].projectionMatrix, matrixArray.data());
        g_renderSettings[renderId].stereoEnabled = false;
    }
}

void effekseer::setCameraMatrix(int renderId, std::vector<float> matrixArray) {
    if (renderId >= 0 && renderId < MAX_RENDER_PATH) {
        Array2Matrix(g_renderSettings[renderId].cameraMatrix, matrixArray.data());
        g_renderSettings[renderId].stereoEnabled = false;
    }
}

void effekseer::setStereoRenderingMatrix(
    int renderId, int renderType, std::vector<float> camCenterMat, std::vector<float> projMatL, std::vector<float> projMatR, std::vector<float> camMatL, std::vector<float> camMatR) {
    if (renderId >= 0 && renderId < MAX_RENDER_PATH) {
        auto& settings               = g_renderSettings[renderId];
        settings.stereoEnabled       = true;
        settings.stereoRenderCount   = 0;
        settings.stereoRenderingType = (StereoRenderingType)renderType;
        Array2Matrix(settings.cameraMatrix, camCenterMat.data());
        Array2Matrix(settings.leftProjectionMatrix, projMatL.data());
        Array2Matrix(settings.rightProjectionMatrix, projMatR.data());
        Array2Matrix(settings.leftCameraMatrix, camMatL.data());
        Array2Matrix(settings.rightCameraMatrix, camMatR.data());
    }
}

void effekseer::setRenderSettings(int renderId, bool renderIntoTexture) {
    if (renderId >= 0 && renderId < MAX_RENDER_PATH) {
        g_renderSettings[renderId].renderIntoTexture = renderIntoTexture;
    }
}

void effekseer::setRenderingCameraCullingMask(int renderId, int32_t cameraCullingMask) {
    if (renderId >= 0 && renderId < MAX_RENDER_PATH) {
        g_renderSettings[renderId].cameraCullingMask = cameraCullingMask;
    }
}

void effekseer::setRenderTargetProperty(int renderId, PixelFormat renderTarget, PixelFormat depthTarget, int width, int height) {
    if (renderId >= 0 && renderId < MAX_RENDER_PATH) {
        g_renderSettings[renderId].renderTargetType = renderTarget;
        g_renderSettings[renderId].depthTargetType  = depthTarget;
        g_renderSettings[renderId].screenWidth      = width;
        g_renderSettings[renderId].screenHeight     = height;
    }
}

int32_t effekseer::enableBackGroundTexture(int renderId) {
    std::ostringstream os;
    os << "* _background" << renderId;

    int32_t hash_key = std::hash<std::string>{}(os.str());
    g_graphics->SetExternalTexture(renderId, ExternalTextureType::Background, hash_key);

    return hash_key;
}

int32_t effekseer::enableDepthTexture(int renderId) {
    const std::string tex      = "efk_depth";
    int32_t           hash_key = std::hash<std::string>{}(tex);
    g_graphics->SetExternalTexture(renderId, ExternalTextureType::Depth, hash_key);

    return hash_key;
}

void effekseer::setTextureLoaderEvent(TextureLoaderLoad load, TextureLoaderUnload unload) {
    g_manager->SetTextureLoader(g_graphics->CreateTextureLoader(load, unload));
}

void effekseer::setModelLoaderEvent(ModelLoaderLoad load, ModelLoaderMeshLoad meshload, ModelLoaderUnload unload) {
    g_manager->SetModelLoader(g_graphics->CreateModelLoader(load, meshload, unload));
}

void effekseer::setMaterialLoaderEvent(MaterialLoaderLoad load, MaterialLoaderUnload unload, MaterialLoaderLoadShader loadShader) {
    g_manager->SetMaterialLoader(g_graphics->CreateMaterialLoader(load, unload, loadShader));
}

void effekseer::setCurveLoaderEvent(CurveLoaderLoad load, CurveLoaderUnload unload) {
    g_manager->SetCurveLoader(Effekseer::MakeRefPtr<CurveLoader>(load, unload));
}

void effekseer::setMeshLoaderEvent(MeshLoaderLoad load, MeshLoaderUnload unload) {
    auto generator = g_graphics->CreateMeshLoader(load, unload);
    if (generator != nullptr) {
        g_manager->GetSetting()->SetProceduralMeshGenerator(generator);
    }
}

void effekseer::setSoundLoaderEvent(SoundLoaderLoad load, SoundLoaderUnload unload) {
    g_manager->SetSoundLoader(SoundLoader::Create(load, unload));
}

void effekseer::setSoundPlayerEvent(SoundPlayerPlay play, SoundPlayerStopTag stopTag, SoundPlayerPauseTag pauseTag, SoundPlayerCheckPlayingTag checkPlayingTag, SoundPlayerStopAll stopAll) {
    if (play && stopTag && pauseTag && checkPlayingTag && stopAll) {
        g_manager->SetSoundPlayer(SoundPlayer::Create(play, stopTag, pauseTag, checkPlayingTag, stopAll));
    }
    else {
        g_manager->SetSoundPlayer(nullptr);
    }
}

int32_t g_maxInstances               = 0;
int32_t g_maxSquares                 = 0;
bool    g_reversedDepth              = false;
bool    g_isTextureFlipped           = false;
bool    g_isBackgroundTextureFlipped = false;
bool    g_isRightHandedCoordinate    = true;
bool    g_maintainGammaColor         = false;
bool    g_isRunning                  = false;

void effekseer::init(int maxInstances, int maxSquares, int reversedDepth, int maintainGammaColor, int isRightHandedCoordinate, int threadCount) {
    g_maxInstances            = maxInstances;
    g_maxSquares              = maxSquares;
    g_reversedDepth           = reversedDepth != 0;
    g_maintainGammaColor      = maintainGammaColor != 0;
    g_isRightHandedCoordinate = isRightHandedCoordinate != 0;

    g_manager = Effekseer::Manager::Create(maxInstances);
    g_manager->GetSetting()->SetIsFileCacheEnabled(false);

    if (g_isRightHandedCoordinate) {
        g_manager->SetCoordinateSystem(Effekseer::CoordinateSystem::RH);
    }
    else {
        g_manager->SetCoordinateSystem(Effekseer::CoordinateSystem::LH);
    }

    g_time      = 0.0f;
    g_graphics  = new Graphics;
    g_isRunning = true;

    initRenderer();
}

void effekseer::initRenderer() {
    g_renderer = g_graphics->CreateRenderer(g_maxSquares, g_reversedDepth);

    g_manager->SetSpriteRenderer(g_renderer->CreateSpriteRenderer());
    g_manager->SetRibbonRenderer(g_renderer->CreateRibbonRenderer());
    g_manager->SetRingRenderer(g_renderer->CreateRingRenderer());
    g_manager->SetTrackRenderer(g_renderer->CreateTrackRenderer());
    g_manager->SetModelRenderer(g_renderer->CreateModelRenderer());

    // light a model
    g_renderer->SetLightColor(Effekseer::Color(255, 255, 255, 255));
    g_renderer->SetLightDirection(Effekseer::Vector3D(1, 1, -1));
    g_renderer->SetLightAmbientColor(Effekseer::Color(40, 40, 40, 255));

    g_renderer->SetMaintainGammaColorInLinearColorSpace(g_maintainGammaColor);
}

std::unordered_map<int, std::shared_ptr<RenderPass>> g_frontRenderPasses;
std::unordered_map<int, std::shared_ptr<RenderPass>> g_backRenderPasses;
std::unordered_map<int, std::shared_ptr<RenderPass>> g_renderPasses;
std::vector<int32_t>                                 g_removingRenderPathes;

static void TermRenderer() {
    if (g_graphics != nullptr) {
        g_graphics->WaitFinish();
    }

    g_renderer.Reset();

    g_frontRenderPasses.clear();
    g_backRenderPasses.clear();
    g_renderPasses.clear();

    g_removingRenderPathes.clear();
}

static void removeRenderPathes() {
    for (auto id : g_removingRenderPathes) {
        g_renderPasses.erase(id);
        g_frontRenderPasses.erase(id);
        g_backRenderPasses.erase(id);
    }
    g_removingRenderPathes.clear();
}

void effekseer::render(int renderId) {
    assert(g_graphics != nullptr);

    removeRenderPathes();

    // assign flipped
    if (g_isTextureFlipped) {
        g_renderer->SetTextureUVStyle(EffekseerRenderer::UVStyle::VerticalFlipped);
    }
    else {
        g_renderer->SetTextureUVStyle(EffekseerRenderer::UVStyle::Normal);
    }

    if (g_isBackgroundTextureFlipped) {
        g_renderer->SetBackgroundTextureUVStyle(EffekseerRenderer::UVStyle::VerticalFlipped);
    }
    else {
        g_renderer->SetBackgroundTextureUVStyle(EffekseerRenderer::UVStyle::Normal);
    }

    RenderSettings& settings = g_renderSettings[renderId];
    settings.id              = renderId;
    Effekseer::Matrix44 projectionMatrix, cameraMatrix;

    if (settings.stereoEnabled) {
        if (settings.stereoRenderCount == 0) {
            projectionMatrix = settings.leftProjectionMatrix;
            cameraMatrix     = settings.leftCameraMatrix;
        }
        else if (settings.stereoRenderCount == 1) {
            projectionMatrix = settings.rightProjectionMatrix;
            cameraMatrix     = settings.rightCameraMatrix;
        }
        settings.stereoRenderCount++;
    }
    else {
        projectionMatrix = settings.projectionMatrix;
        cameraMatrix     = settings.cameraMatrix;
    }

    // if renderer is some backend, render flipped image when render to a texture.
    if (settings.renderIntoTexture && g_graphics->IsRequiredToFlipVerticallyWhenRenderToTexture()) {
        projectionMatrix.Values[1][1] = -projectionMatrix.Values[1][1];
    }

    // 行列をセット
    g_renderer->SetProjectionMatrix(projectionMatrix);
    g_renderer->SetCameraMatrix(cameraMatrix);

    // convert a right hand into a left hand
    ::Effekseer::Vector3D cameraPosition;
    ::Effekseer::Vector3D cameraFrontDirection;
    CalculateCameraDirectionAndPosition(cameraMatrix, cameraFrontDirection, cameraPosition);

    g_renderer->SetCameraParameter(cameraFrontDirection, cameraPosition);

    Effekseer::Manager::LayerParameter layerParam;
    layerParam.ViewerPosition = cameraPosition;
    g_manager->SetLayerParameter(0, layerParam);

    // Specify textures

    if (g_graphics != nullptr) {
        g_graphics->SetBackGroundTextureToRenderer(g_renderer.Get(), settings.externalTextures[static_cast<int>(ExternalTextureType::Background)].Texture);
        g_graphics->SetDepthTextureToRenderer(g_renderer.Get(), projectionMatrix, settings.externalTextures[static_cast<int>(ExternalTextureType::Depth)].Texture);
    }

    // render

    std::shared_ptr<RenderPass> renderPath = nullptr;
    auto                        it         = g_renderPasses.find(renderId);

    if (it != g_renderPasses.end()) {
        renderPath = it->second;
    }
    else {
        auto created = g_graphics->CreateRenderPass();
        if (created != nullptr) {
            g_renderPasses[renderId] = std::shared_ptr<RenderPass>(created);
            renderPath               = g_renderPasses[renderId];
        }
    }

    if (renderPath != nullptr) {
        renderPath->Begin(settings, nullptr);
        g_graphics->SetRenderPath(g_renderer.Get(), renderPath.get());
    }

    Effekseer::Manager::DrawParameter drawParameter;
    drawParameter.CameraCullingMask       = settings.cameraCullingMask;
    drawParameter.IsSortingEffectsEnabled = true;
    drawParameter.CameraPosition          = cameraPosition;
    drawParameter.CameraFrontDirection    = cameraFrontDirection;

    g_renderer->SetTime(g_time);
    g_renderer->BeginRendering();
    g_manager->Draw(drawParameter);
    g_renderer->EndRendering();

    if (renderPath != nullptr) {
        renderPath->End(settings);
        renderPath->Execute(settings);
        g_graphics->SetRenderPath(g_renderer.Get(), nullptr);
    }

    if (g_graphics != nullptr) {
        g_graphics->SetBackGroundTextureToRenderer(g_renderer.Get(), nullptr);
        g_graphics->SetDepthTextureToRenderer(g_renderer.Get(), projectionMatrix, nullptr);
    }
}

void effekseer::renderFront(int renderId) {
    RenderSettings& settings = g_renderSettings[renderId];
    settings.id              = renderId;

    std::shared_ptr<RenderPass> renderPass = nullptr;
    auto                        it         = g_frontRenderPasses.find(renderId);
    if (it != g_frontRenderPasses.end()) {
        renderPass = it->second;
    }
    else {
        auto created = g_graphics->CreateRenderPass();
        if (created != nullptr) {
            g_frontRenderPasses[renderId] = std::shared_ptr<RenderPass>(created);
            renderPass                    = g_frontRenderPasses[renderId];
        }
    }

    if (renderPass != nullptr) {
        std::shared_ptr<RenderPass> backRenderPass = nullptr;
        auto                        itb            = g_backRenderPasses.find(renderId);
        if (itb != g_backRenderPasses.end()) {
            backRenderPass = itb->second;
        }

        renderPass->Begin(settings, backRenderPass.get());
        g_graphics->SetRenderPath(g_renderer.Get(), renderPass.get());
    }

    Effekseer::Matrix44 projectionMatrix, cameraMatrix;

    projectionMatrix = g_renderer->GetProjectionMatrix();
    cameraMatrix     = g_renderer->GetCameraMatrix();

    // convert a right hand into a left hand
    ::Effekseer::Vector3D cameraPosition;
    ::Effekseer::Vector3D cameraFrontDirection;
    CalculateCameraDirectionAndPosition(cameraMatrix, cameraFrontDirection, cameraPosition);

    Effekseer::Manager::LayerParameter layerParam;
    layerParam.ViewerPosition = cameraPosition;
    g_manager->SetLayerParameter(0, layerParam);

    // Need not to assgin matrixes. Because these were assigned in EffekseerRenderBack
    Effekseer::Manager::DrawParameter drawParameter;
    drawParameter.CameraCullingMask       = settings.cameraCullingMask;
    drawParameter.IsSortingEffectsEnabled = true;
    drawParameter.CameraPosition          = cameraPosition;
    drawParameter.CameraFrontDirection    = cameraFrontDirection;
    g_renderer->SetTime(g_time);
    g_renderer->BeginRendering();
    g_manager->DrawFront(drawParameter);
    g_renderer->EndRendering();

    if (renderPass != nullptr) {
        renderPass->End(settings);
        renderPass->Execute(settings);
        g_graphics->SetRenderPath(g_renderer.Get(), nullptr);
    }

    if (g_graphics != nullptr) {
        g_graphics->SetBackGroundTextureToRenderer(g_renderer.Get(), nullptr);
        g_graphics->SetDepthTextureToRenderer(g_renderer.Get(), projectionMatrix, nullptr);
    }

    // Viewportを初期化
    if (settings.stereoRenderingType == StereoRenderingType::SinglePass) {
        g_graphics->ShiftViewportForStereoSinglePass(false);
    }
}

void effekseer::renderBack(int renderId) {
    assert(g_graphics != nullptr);
    // g_graphics->StartRender(g_renderer);

    removeRenderPathes();

    // assign flipped
    if (g_isTextureFlipped) {
        g_renderer->SetTextureUVStyle(EffekseerRenderer::UVStyle::VerticalFlipped);
    }
    else {
        g_renderer->SetTextureUVStyle(EffekseerRenderer::UVStyle::Normal);
    }

    if (g_isBackgroundTextureFlipped) {
        g_renderer->SetBackgroundTextureUVStyle(EffekseerRenderer::UVStyle::VerticalFlipped);
    }
    else {
        g_renderer->SetBackgroundTextureUVStyle(EffekseerRenderer::UVStyle::Normal);
    }

    RenderSettings& settings = g_renderSettings[renderId];
    settings.id              = renderId;

    Effekseer::Matrix44 projectionMatrix, cameraMatrix, cameraPositionMatrix;

    if (settings.stereoEnabled) {
        if (settings.stereoRenderCount == 0) {
            projectionMatrix = settings.leftProjectionMatrix;
            cameraMatrix     = settings.leftCameraMatrix;

            if (settings.stereoRenderingType == StereoRenderingType::SinglePass) {
                g_graphics->ShiftViewportForStereoSinglePass(false);
            }
        }
        else if (settings.stereoRenderCount == 1) {
            projectionMatrix = settings.rightProjectionMatrix;
            cameraMatrix     = settings.rightCameraMatrix;

            if (settings.stereoRenderingType == StereoRenderingType::SinglePass) {
                g_graphics->ShiftViewportForStereoSinglePass(true);
            }
        }
        cameraPositionMatrix = settings.cameraMatrix;

        settings.stereoRenderCount++;
    }
    else {
        projectionMatrix     = settings.projectionMatrix;
        cameraMatrix         = settings.cameraMatrix;
        cameraPositionMatrix = settings.cameraMatrix;
    }

    // if renderer is some backend, render flipped image when render to a texture.
    if (settings.renderIntoTexture && g_graphics->IsRequiredToFlipVerticallyWhenRenderToTexture()) {
        projectionMatrix.Values[1][1] = -projectionMatrix.Values[1][1];
    }

    // 行列をセット
    g_renderer->SetProjectionMatrix(projectionMatrix);
    g_renderer->SetCameraMatrix(cameraMatrix);

    // convert a right hand into a left hand
    ::Effekseer::Vector3D cameraPosition;
    ::Effekseer::Vector3D cameraFrontDirection;
    CalculateCameraDirectionAndPosition(cameraPositionMatrix, cameraFrontDirection, cameraPosition);

    Effekseer::Manager::LayerParameter layerParam;
    layerParam.ViewerPosition = cameraPosition;
    g_manager->SetLayerParameter(0, layerParam);

    g_renderer->SetCameraParameter(cameraFrontDirection, cameraPosition);

    // Specify textures
    if (g_graphics != nullptr) {
        g_graphics->SetBackGroundTextureToRenderer(
            g_renderer.Get(), settings.externalTextures[static_cast<int>(ExternalTextureType::Background)].Texture);
        g_graphics->SetDepthTextureToRenderer(g_renderer.Get(),
                                              projectionMatrix,
                                              settings.externalTextures[static_cast<int>(ExternalTextureType::Depth)].Texture);
    }

    std::shared_ptr<RenderPass> renderPath = nullptr;
    auto                        it         = g_backRenderPasses.find(renderId);
    if (it != g_backRenderPasses.end()) {
        renderPath = it->second;
    }
    else {
        auto created = g_graphics->CreateRenderPass();
        if (created != nullptr) {
            g_backRenderPasses[renderId] = std::shared_ptr<RenderPass>(created);
            renderPath                   = g_backRenderPasses[renderId];
        }
    }

    if (renderPath != nullptr) {
        renderPath->Begin(settings, nullptr);
        g_graphics->SetRenderPath(g_renderer.Get(), renderPath.get());
    }

    // render
    Effekseer::Manager::DrawParameter drawParameter;
    drawParameter.CameraCullingMask       = settings.cameraCullingMask;
    drawParameter.IsSortingEffectsEnabled = true;
    drawParameter.CameraPosition          = cameraPosition;
    drawParameter.CameraFrontDirection    = cameraFrontDirection;

    g_renderer->SetTime(g_time);
    g_renderer->SetLightColor(g_lightColor);
    g_renderer->SetLightAmbientColor(g_lightAmbientColor);
    g_renderer->SetLightDirection(g_lightDirection);
    g_renderer->BeginRendering();
    g_manager->DrawBack(drawParameter);
    g_renderer->EndRendering();

    if (renderPath != nullptr) {
        renderPath->End(settings);
        renderPath->Execute(settings);
        g_graphics->SetRenderPath(g_renderer.Get(), nullptr);
    }
}

RenderParameter* effekseer::renderParameter(int index) {
    auto renderer = (RendererImplemented*)g_renderer.Get();
    return &(renderer->GetRenderParameters()[index]);
}

int effekseer::renderParameterCount() {
    auto renderer = (RendererImplemented*)g_renderer.Get();
    return static_cast<int32_t>(renderer->GetRenderParameters().size());
}

std::vector<uint8_t>& effekseer::renderInfoBuffer() {
    auto renderer = (RendererImplemented*)g_renderer.Get();
    return renderer->GetRenderInfoBuffer();
}

int32_t effekseer::renderStrideBufferCount() {
    auto renderer = (RendererImplemented*)g_renderer.Get();
    return renderer->GetStrideBufferCount();
}

StrideBufferParameterEx* effekseer::renderStrideBufferParameter(int index) {
    static StrideBufferParameterEx param;
    auto                           renderer = (RendererImplemented*)g_renderer.Get();
    param                                   = renderer->GetStrideBufferParameter(index);
    return &param;
}

}
