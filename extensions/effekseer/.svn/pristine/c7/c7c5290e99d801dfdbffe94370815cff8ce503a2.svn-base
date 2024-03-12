
#pragma once

#include "./loader/curve.h"
#include "./loader/material.h"
#include "./loader/model.h"
#include "./loader/sound.h"
#include "./loader/texture.h"
#include "./renderer/graphics.h"
#include "./renderer/renderer.h"

namespace cce {

const int MAX_RENDER_PATH = 128;

using PixelFormat = Effekseer::Backend::TextureFormatType;

class effekseer {
public:
    effekseer() {}
    static void    updateTime(float deltaFrame);
    static void    resetTime();
    static void    update(float deltaFrame);
    static void    stopAllEffects();
    static void    setPausedToAllEffects(int paused);
    static int32_t getCameraCullingMaskToShowAllEffects();
    static int32_t getRestInstancesCount();
    static int32_t loadEffect(std::string path, float magnification);
    static int32_t loadEffectOnMemory(std::vector<uint8_t> buffer, std::string path, float magnification = 1.0);
    static int32_t getFrameCount(int32_t effect);
    static void    releaseEffect(int32_t effect);
    static void    setLightDirection(float x, float y, float z);
    static void    setLightColor(int32_t r, int32_t g, int32_t b);
    static void    setLightAmbientColor(int32_t r, int32_t g, int32_t b);

public:
    // render group

    static void    setProjectionMatrix(int renderId, std::vector<float> matrixArray);
    static void    setCameraMatrix(int renderId, std::vector<float> matrixArray);
    static void    setStereoRenderingMatrix(int renderId, int renderType, std::vector<float> camCenterMat, std::vector<float> projMatL, std::vector<float> projMatR, std::vector<float> camMatL, std::vector<float> camMatR);
    static void    setRenderSettings(int renderId, bool renderIntoTexture);
    static void    setRenderingCameraCullingMask(int renderId, int32_t cameraCullingMask);
    static void    setRenderTargetProperty(int renderId, PixelFormat renderTarget, PixelFormat depthTarget, int width, int height);
    static int32_t enableBackGroundTexture(int renderId);
    static int32_t enableDepthTexture(int renderId);

public:
    // resource loader

    static void setTextureLoaderEvent(TextureLoaderLoad load, TextureLoaderUnload unload);
    static void setModelLoaderEvent(ModelLoaderLoad load, ModelLoaderMeshLoad meshload, ModelLoaderUnload unload);
    static void setMaterialLoaderEvent(MaterialLoaderLoad load, MaterialLoaderUnload unload, MaterialLoaderLoadShader loadShader);
    static void setCurveLoaderEvent(CurveLoaderLoad load, CurveLoaderUnload unload);
    static void setMeshLoaderEvent(MeshLoaderLoad load, MeshLoaderUnload unload);
    static void setSoundLoaderEvent(SoundLoaderLoad load, SoundLoaderUnload unload);
    static void setSoundPlayerEvent(SoundPlayerPlay play, SoundPlayerStopTag stopTag, SoundPlayerPauseTag pauseTag, SoundPlayerCheckPlayingTag checkPlayingTag, SoundPlayerStopAll stopAll);

public:
    /* effect instance handle */

    static void    reloadResources(int32_t handle);
    static void    unloadResources(int32_t handle);
    static float   getEffectMagnification(int32_t handle);
    static int     playEffect(int32_t handle, float x, float y, float z);
    static void    updateHandle(int32_t handle, float deltaFrame);
    static void    updateHandleToMoveToFrame(int32_t handle, float frame);
    static void    stopEffect(int32_t handle);
    static void    stopRoot(int32_t handle);
    static int32_t getShown(int32_t handle);
    static void    setShown(int32_t handle, int shown);
    static int32_t getPaused(int32_t handle);
    static void    setPaused(int32_t handle, int paused);
    static float   getSpeed(int32_t handle);
    static void    setSpeed(int32_t handle, float speed);
    static int32_t exists(int32_t handle);
    static void    setMatrix(int32_t handle, std::vector<float> mat);
    static void    setLocation(int32_t handle, float x, float y, float z);
    static void    setRotation(int32_t handle, float x, float y, float z, float angle);
    static void    setScale(int32_t handle, float x, float y, float z);
    static void    setAllColor(int32_t handle, int r, int g, int b, int a);
    static void    setTargetLocation(int32_t handle, float x, float y, float z);
    static float   getDynamicInput(int32_t handle, int index);
    static void    setDynamicInput(int32_t handle, int index, float value);
    static void    setLayer(int32_t handle, int layer);
    static void    setGroupMask(int32_t handle, int64_t groupMask);
    static void    setTimeScaleByGroup(int64_t groupMask, float timeScale);
    static int32_t getInstanceCount(int32_t handle);
    static void    sendTrigger(int32_t handle, int32_t index);
    static void    setUserData(int32_t handle, int32_t data);
    static void    setRemovingCallback(int32_t handle, std::function<void(int32_t)> cb);

public:
    static void                     init(int maxInstances, int maxSquares, int reversedDepth, int maintainGammaColor, int isRightHandedCoordinate, int threadCount);
    static void                     initRenderer();
    static void                     render(int renderId);
    static void                     renderFront(int renderId);
    static void                     renderBack(int renderId);
    static RenderParameter*         renderParameter(int index);
    static int                      renderParameterCount();
    static std::vector<uint8_t>&    renderInfoBuffer();
    static int32_t                  renderStrideBufferCount();
    static StrideBufferParameterEx* renderStrideBufferParameter(int index);
};

extern Effekseer::ManagerRef          g_manager;
extern EffekseerRenderer::RendererRef g_renderer;
extern RenderSettings                 g_renderSettings[MAX_RENDER_PATH];
}
