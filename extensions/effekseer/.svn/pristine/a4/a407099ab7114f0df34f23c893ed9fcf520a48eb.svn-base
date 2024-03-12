
#include "./efk_render.h"

std::map<int32_t, std::vector<cc::scene::Model*>> EFKRenderN::com_models;

std::map<int32_t, std::vector<cc::scene::Model*>> EFKRenderN::render(std::vector<cc::scene::Camera*> cameras, bool stepmode) {
    EFKModelN::reset();
    EFKMaterialN::reset();

    com_models.clear();

    if (stepmode) {
        cce::effekseer::update(0);
    }
    else {
        cce::effekseer::updateTime(1);
        cce::effekseer::update(1);
    }

    for (auto renderid = 0; renderid < cameras.size(); ++renderid) {
        if (nullptr == cameras[renderid])
            continue;
        renderCamera(renderid, cameras[renderid]);
    }

    return com_models;
}

void EFKRenderN::renderCamera(uint32_t renderid, cc::scene::Camera* cam) {
    cce::effekseer::render(renderid);

    auto count = cce::effekseer::renderStrideBufferCount();
    for (auto i = 0; i < count; ++i) {
        auto stride = cce::effekseer::renderStrideBufferParameter(i);
        if (stride->Ptr.size() == 0) {
            continue;
        }
        EFKModelN::addSprite(stride->Stride, stride->Ptr);
    }

    auto draws = cce::effekseer::renderParameterCount();
    if (0 >= draws)
        return;

    auto uniforms = cce::effekseer::renderInfoBuffer();
    for (auto i = 0; i < draws; ++i) {
        // if (i != 2) continue;
        auto param = cce::effekseer::renderParameter(i);
        if (param->RenderMode != 0) {
            drawModel(param, uniforms, cam, renderid);
        }
        else {
            drawSprite(param, uniforms, cam, renderid);
        }
    }
}

void EFKRenderN::drawSprite(cce::RenderParameter* param, std::vector<uint8_t>& infoBuffer, cc::scene::Camera* cam, uint32_t renderid) {
    auto uniforms = (float*)(infoBuffer.data() + param->UniformBufferOffset);
    auto material = EFKMaterialN::check(param, uniforms, nullptr, cam, renderid, 0);
    auto model    = EFKModelN::drawSprite(param->VertexBufferStride, param->VertexBufferOffset, param->ElementCount, material, material->getParent()->getHash() /* param.MaterialPtr */);

    if (com_models.find(param->ComPtr) == com_models.end()) {
        com_models.insert(std::make_pair(param->ComPtr, std::vector<cc::scene::Model*>{}));
    }
    com_models[param->ComPtr].push_back(model);
}

void EFKRenderN::drawModel(cce::RenderParameter* param, std::vector<uint8_t>& infoBuffer, cc::scene::Camera* cam, uint32_t renderid) {
    auto uniforms = (float*)(infoBuffer.data() + param->UniformBufferOffset);
    auto count    = param->ElementCount;

    for (auto element = 0; element < count; ++element) {
        // 参数为 29 个浮点数, 查看 c++ 代码定义 ModelParameter1
        auto model_params_float_count = sizeof(cce::ModelParameter1);
        auto model_params_offset      = element * model_params_float_count;
        auto models                   = (float*)(infoBuffer.data() + param->VertexBufferOffset + model_params_offset);

        // 执行绘制渲染
        auto material = EFKMaterialN::check(param, uniforms, models, cam, renderid, element);
        auto model    = EFKModelN::drawModel(param->ModelPtr, models[24], material, param->MaterialPtr);

        if (com_models.find(param->ComPtr) == com_models.end()) {
            com_models.insert(std::make_pair(param->ComPtr, std::vector<cc::scene::Model*>{}));
        }
        com_models[param->ComPtr].push_back(model);
    }
}
