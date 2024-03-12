
#pragma once

#include "../effekseer.h"
#include "core/assets/Texture2D.h"
#include "core/assets/Material.h"
#include "renderer/core/MaterialInstance.h"
#include "scene/Camera.h"

class EFKMaterialN {
    friend class EFKRenderN;
public:
    static cc::Material* check(cce::RenderParameter* param, float* uniforms, float* models, cc::scene::Camera* cam, uint32_t renderid, int32_t element);
    static void          setInternals(std::vector<cc::Material*> internals);
    static void          setTexture(int32_t, cc::Texture2D*, bool isremove);
    static void          setCumstom(int32_t, std::vector<cc::Material*> mats, bool isremove);
    static void          clearCache();

private:
    static void          reset();
    static std::string   calcHash(cce::RenderParameter* param);
    static cc::Material* create(cce::RenderParameter* param, float* uniforms);
    static void          setTextures(cc::MaterialInstance* material, cce::RenderParameter* param);
    static void          setPipelineStates(cc::MaterialInstance* material, cce::RenderParameter* param);

private:
    static std::vector<cc::Material*>                       internals;
    static std::map<int32_t, std::vector<cc::Material*>>    cumstoms;
    static std::map<int32_t, cc::Texture2D*>                textures;

private:
    static std::map<int32_t, int32_t>           keys;
    static std::map<std::string, cc::Material*> caches;
};
