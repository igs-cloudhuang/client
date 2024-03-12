
#pragma once

#include "scene/Camera.h"

#include "./efk_material.h"
#include "./efk_model.h"
#include "../effekseer.h"

class EFKRenderN {
public:
    static std::map<int32_t, std::vector<cc::scene::Model*>> render(std::vector<cc::scene::Camera*> cameras, bool stepmode);

private:
    static void renderCamera(uint32_t renderid, cc::scene::Camera* cam);
    static void drawSprite(cce::RenderParameter* param, std::vector<uint8_t>& infoBuffer, cc::scene::Camera* cam, uint32_t renderid);
    static void drawModel(cce::RenderParameter* param, std::vector<uint8_t>& infoBuffer, cc::scene::Camera* cam, uint32_t renderid);

private:
    static std::map<int32_t, std::vector<cc::scene::Model*>> com_models;
};
