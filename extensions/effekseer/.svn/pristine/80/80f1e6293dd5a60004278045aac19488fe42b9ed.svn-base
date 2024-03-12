// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "EffekseerCocosCreator/framework/efk_render.h"

bool register_all_effekseer(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cce::ShaderEx);
JSB_REGISTER_OBJECT_TYPE(cce::ModelEx);
JSB_REGISTER_OBJECT_TYPE(cce::StrideBufferParameterEx);
JSB_REGISTER_OBJECT_TYPE(cce::FlipbookParametersEx);
JSB_REGISTER_OBJECT_TYPE(cce::EdgeParametersEx);
JSB_REGISTER_OBJECT_TYPE(cce::FalloffParameterEx);
JSB_REGISTER_OBJECT_TYPE(cce::RenderParameter);
JSB_REGISTER_OBJECT_TYPE(cce::effekseer);
JSB_REGISTER_OBJECT_TYPE(EFKMaterialN);
JSB_REGISTER_OBJECT_TYPE(EFKModelN);
JSB_REGISTER_OBJECT_TYPE(EFKRenderN);


extern se::Object *__jsb_cce_ShaderEx_proto;   // NOLINT
extern se::Class *__jsb_cce_ShaderEx_class;    // NOLINT

bool js_register_cce_ShaderEx(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_effekseer_ShaderEx_GetType);
SE_DECLARE_FUNC(js_effekseer_ShaderEx_getFS);
SE_DECLARE_FUNC(js_effekseer_ShaderEx_getUniform);
SE_DECLARE_FUNC(js_effekseer_ShaderEx_getUniformCount);
SE_DECLARE_FUNC(js_effekseer_ShaderEx_getVS);
SE_DECLARE_FUNC(js_effekseer_ShaderEx_ShaderEx);

extern se::Object *__jsb_cce_ModelEx_proto;   // NOLINT
extern se::Class *__jsb_cce_ModelEx_class;    // NOLINT

bool js_register_cce_ModelEx(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_effekseer_ModelEx_getFaces);
SE_DECLARE_FUNC(js_effekseer_ModelEx_getFrameCount);
SE_DECLARE_FUNC(js_effekseer_ModelEx_getVertecies);
SE_DECLARE_FUNC(js_effekseer_ModelEx_ModelEx);

extern se::Object *__jsb_cce_StrideBufferParameterEx_proto;   // NOLINT
extern se::Class *__jsb_cce_StrideBufferParameterEx_class;    // NOLINT

bool js_register_cce_StrideBufferParameterEx(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cce::StrideBufferParameterEx *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cce_FlipbookParametersEx_proto;   // NOLINT
extern se::Class *__jsb_cce_FlipbookParametersEx_class;    // NOLINT

bool js_register_cce_FlipbookParametersEx(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cce::FlipbookParametersEx *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cce_EdgeParametersEx_proto;   // NOLINT
extern se::Class *__jsb_cce_EdgeParametersEx_class;    // NOLINT

bool js_register_cce_EdgeParametersEx(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cce::EdgeParametersEx *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cce_FalloffParameterEx_proto;   // NOLINT
extern se::Class *__jsb_cce_FalloffParameterEx_class;    // NOLINT

bool js_register_cce_FalloffParameterEx(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cce::FalloffParameterEx *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cce_RenderParameter_proto;   // NOLINT
extern se::Class *__jsb_cce_RenderParameter_class;    // NOLINT

bool js_register_cce_RenderParameter(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cce::RenderParameter *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_effekseer_RenderParameter_getEdgeParams);
SE_DECLARE_FUNC(js_effekseer_RenderParameter_getFalloffParam);
SE_DECLARE_FUNC(js_effekseer_RenderParameter_getFlipbookParams);

extern se::Object *__jsb_cce_effekseer_proto;   // NOLINT
extern se::Class *__jsb_cce_effekseer_class;    // NOLINT

bool js_register_cce_effekseer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_effekseer_effekseer_enableBackGroundTexture);
SE_DECLARE_FUNC(js_effekseer_effekseer_enableDepthTexture);
SE_DECLARE_FUNC(js_effekseer_effekseer_exists);
SE_DECLARE_FUNC(js_effekseer_effekseer_getCameraCullingMaskToShowAllEffects);
SE_DECLARE_FUNC(js_effekseer_effekseer_getDynamicInput);
SE_DECLARE_FUNC(js_effekseer_effekseer_getEffectMagnification);
SE_DECLARE_FUNC(js_effekseer_effekseer_getFrameCount);
SE_DECLARE_FUNC(js_effekseer_effekseer_getInstanceCount);
SE_DECLARE_FUNC(js_effekseer_effekseer_getPaused);
SE_DECLARE_FUNC(js_effekseer_effekseer_getRestInstancesCount);
SE_DECLARE_FUNC(js_effekseer_effekseer_getShown);
SE_DECLARE_FUNC(js_effekseer_effekseer_getSpeed);
SE_DECLARE_FUNC(js_effekseer_effekseer_init);
SE_DECLARE_FUNC(js_effekseer_effekseer_initRenderer);
SE_DECLARE_FUNC(js_effekseer_effekseer_loadEffect);
SE_DECLARE_FUNC(js_effekseer_effekseer_loadEffectOnMemory);
SE_DECLARE_FUNC(js_effekseer_effekseer_playEffect);
SE_DECLARE_FUNC(js_effekseer_effekseer_releaseEffect);
SE_DECLARE_FUNC(js_effekseer_effekseer_reloadResources);
SE_DECLARE_FUNC(js_effekseer_effekseer_render);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderBack);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderFront);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderInfoBuffer);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderParameter);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderParameterCount);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderStrideBufferCount);
SE_DECLARE_FUNC(js_effekseer_effekseer_renderStrideBufferParameter);
SE_DECLARE_FUNC(js_effekseer_effekseer_resetTime);
SE_DECLARE_FUNC(js_effekseer_effekseer_sendTrigger);
SE_DECLARE_FUNC(js_effekseer_effekseer_setAllColor);
SE_DECLARE_FUNC(js_effekseer_effekseer_setCameraMatrix);
SE_DECLARE_FUNC(js_effekseer_effekseer_setCurveLoaderEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setDynamicInput);
SE_DECLARE_FUNC(js_effekseer_effekseer_setGroupMask);
SE_DECLARE_FUNC(js_effekseer_effekseer_setLayer);
SE_DECLARE_FUNC(js_effekseer_effekseer_setLightAmbientColor);
SE_DECLARE_FUNC(js_effekseer_effekseer_setLightColor);
SE_DECLARE_FUNC(js_effekseer_effekseer_setLightDirection);
SE_DECLARE_FUNC(js_effekseer_effekseer_setLocation);
SE_DECLARE_FUNC(js_effekseer_effekseer_setMaterialLoaderEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setMatrix);
SE_DECLARE_FUNC(js_effekseer_effekseer_setMeshLoaderEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setModelLoaderEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setPaused);
SE_DECLARE_FUNC(js_effekseer_effekseer_setPausedToAllEffects);
SE_DECLARE_FUNC(js_effekseer_effekseer_setProjectionMatrix);
SE_DECLARE_FUNC(js_effekseer_effekseer_setRemovingCallback);
SE_DECLARE_FUNC(js_effekseer_effekseer_setRenderSettings);
SE_DECLARE_FUNC(js_effekseer_effekseer_setRenderTargetProperty);
SE_DECLARE_FUNC(js_effekseer_effekseer_setRenderingCameraCullingMask);
SE_DECLARE_FUNC(js_effekseer_effekseer_setRotation);
SE_DECLARE_FUNC(js_effekseer_effekseer_setScale);
SE_DECLARE_FUNC(js_effekseer_effekseer_setShown);
SE_DECLARE_FUNC(js_effekseer_effekseer_setSoundLoaderEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setSoundPlayerEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setSpeed);
SE_DECLARE_FUNC(js_effekseer_effekseer_setStereoRenderingMatrix);
SE_DECLARE_FUNC(js_effekseer_effekseer_setTargetLocation);
SE_DECLARE_FUNC(js_effekseer_effekseer_setTextureLoaderEvent);
SE_DECLARE_FUNC(js_effekseer_effekseer_setTimeScaleByGroup);
SE_DECLARE_FUNC(js_effekseer_effekseer_setUserData);
SE_DECLARE_FUNC(js_effekseer_effekseer_stopAllEffects);
SE_DECLARE_FUNC(js_effekseer_effekseer_stopEffect);
SE_DECLARE_FUNC(js_effekseer_effekseer_stopRoot);
SE_DECLARE_FUNC(js_effekseer_effekseer_unloadResources);
SE_DECLARE_FUNC(js_effekseer_effekseer_update);
SE_DECLARE_FUNC(js_effekseer_effekseer_updateHandle);
SE_DECLARE_FUNC(js_effekseer_effekseer_updateHandleToMoveToFrame);
SE_DECLARE_FUNC(js_effekseer_effekseer_updateTime);
SE_DECLARE_FUNC(js_effekseer_effekseer_effekseer);

extern se::Object *__jsb_EFKMaterialN_proto;   // NOLINT
extern se::Class *__jsb_EFKMaterialN_class;    // NOLINT

bool js_register_EFKMaterialN(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_effekseer_EFKMaterialN_check);
SE_DECLARE_FUNC(js_effekseer_EFKMaterialN_clearCache);
SE_DECLARE_FUNC(js_effekseer_EFKMaterialN_setCumstom);
SE_DECLARE_FUNC(js_effekseer_EFKMaterialN_setInternals);
SE_DECLARE_FUNC(js_effekseer_EFKMaterialN_setTexture);

extern se::Object *__jsb_EFKModelN_proto;   // NOLINT
extern se::Class *__jsb_EFKModelN_class;    // NOLINT

bool js_register_EFKModelN(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_effekseer_EFKModelN_addModel);
SE_DECLARE_FUNC(js_effekseer_EFKModelN_addSprite);
SE_DECLARE_FUNC(js_effekseer_EFKModelN_drawModel);
SE_DECLARE_FUNC(js_effekseer_EFKModelN_drawSprite);
SE_DECLARE_FUNC(js_effekseer_EFKModelN_removeModel);
SE_DECLARE_FUNC(js_effekseer_EFKModelN_reset);

extern se::Object *__jsb_EFKRenderN_proto;   // NOLINT
extern se::Class *__jsb_EFKRenderN_class;    // NOLINT

bool js_register_EFKRenderN(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_effekseer_EFKRenderN_render);
// clang-format on
