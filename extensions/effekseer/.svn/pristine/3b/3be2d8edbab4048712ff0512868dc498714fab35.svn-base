
#pragma once

#include "core/Root.h"
#include "core/assets/Material.h"
#include "core/assets/RenderingSubMesh.h"
#include "renderer//core/ProgramLib.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "renderer/gfx-base/states/GFXSampler.h"
#include "scene/Pass.h"

class EFKModelN {
public:
    static void              addSprite(uint32_t stride, std::vector<uint8_t> vertecies);
    static cc::scene::Model* drawSprite(uint32_t stride, uint32_t offset, uint32_t spriteCount, cc::Material* material, uint32_t type);
    static void              addModel(int32_t key, std::vector<uint8_t> vertecies, std::vector<uint8_t> indices, uint32_t frame);
    static void              removeModel(int32_t key);
    static cc::scene::Model* drawModel(int32_t id, uint32_t frame, cc::Material* material, uint32_t type);
    static void reset();

private:
    static void              resizeIndice(cc::gfx::Buffer* indice, uint32_t count);
    static cc::scene::Model* checkModel(int32_t mesh_id, cc::RenderingSubMesh* mesh_obj, cc::Material* material, cc::gfx::DrawInfo& info);
};
