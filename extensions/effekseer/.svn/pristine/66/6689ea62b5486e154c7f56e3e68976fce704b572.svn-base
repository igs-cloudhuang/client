
#include "./efk_model.h"

using namespace cc;

const ccstd::vector<gfx::Attribute> ModelVertexEx{
    gfx::Attribute{ "Input_Pos", gfx::Format::RGB32F },       // Pos      -> vec3 + 12
    gfx::Attribute{ "Input_Normal", gfx::Format::RGB32F },    // Normal   -> vec3 + 12
    gfx::Attribute{ "Input_Binormal", gfx::Format::RGB32F },  // Binormal -> vec3 + 12
    gfx::Attribute{ "Input_Tangent", gfx::Format::RGB32F },   // Tangent  -> vec3 + 12
    gfx::Attribute{ "Input_UV", gfx::Format::RG32F },         // UV1      -> vec2 + 8
    gfx::Attribute{ "Input_Color", gfx::Format::RGBA32F },    // Color    -> vec4 + 16
                                                              //                  = 72
};

const int ModelStrip = 72;

struct ModelInfo {
    gfx::Buffer*  vertex;
    gfx::Buffer*  indice;
    gfx::DrawInfo ia;
};

static std::unordered_map<int32_t, std::vector<ModelInfo>> g_models;

struct SpriteInfo {
    gfx::Buffer* vertex;
    gfx::Buffer* indice;
};

static std::unordered_map<int32_t, SpriteInfo> m_buffers;

static std::vector<RenderingSubMesh*>                    m_meshs;
static std::unordered_map<int32_t, std::vector<int32_t>> m_typeid_meshs;
static std::unordered_map<int32_t, bool>                 m_typeid_used;
static std::unordered_map<int32_t, std::vector<int32_t>> m_model_meshs;
static std::unordered_map<int32_t, std::vector<int32_t>> m_model_cache;

static std::vector<scene::Model*>        m_models;
static std::unordered_map<int32_t, bool> m_model_used;

static int32_t m_priority = 0;

void EFKModelN::reset() {
    m_typeid_used.clear();
    m_model_used.clear();
    m_priority = 0;
}

void EFKModelN::addSprite(uint32_t stride, std::vector<uint8_t> vertecies) {
    gfx::Device* device = gfx::Device::getInstance();
    gfx::Buffer* vertex = nullptr;

    auto itr = m_buffers.find(stride);
    if (itr != m_buffers.end()) {
        auto sprite = itr->second;
        vertex      = sprite.vertex;
        if (sprite.vertex->getSize() < vertecies.size()) {
            sprite.vertex->resize(vertecies.size());
        }
    }
    else {
        vertex = device->createBuffer({ gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST, gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE, (uint32_t)vertecies.size(), stride });

        uint32_t     count  = 3;  // (vertexBuffer.size / stride) / 4 * 2 * 3;
        gfx::Buffer* indice = device->createBuffer({ gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST, gfx::MemoryUsageBit::DEVICE, (uint32_t)(count * sizeof(uint16_t)), sizeof(uint16_t) });

        m_buffers.insert(std::make_pair(stride, SpriteInfo{
                                                    vertex,
                                                    indice }));
    }

    vertex->update(vertecies.data(), vertecies.size());
}

void EFKModelN::resizeIndice(gfx::Buffer* indice, uint32_t count) {
    if (indice->getSize() >= count * sizeof(uint16_t)) {
        return;
    }

    indice->resize(count * sizeof(uint16_t));
    auto data = new uint16_t[count];

    auto element = 0;
    for (auto i = 0; i < count;) {
        auto baseIdx = 4 * element;
        data[i++]  = baseIdx;
        data[i++]  = baseIdx + 1;
        data[i++]  = baseIdx + 2;
        data[i++]  = baseIdx + 3;
        data[i++]  = baseIdx + 2;
        data[i++]  = baseIdx + 1;
        element++;
    }
    indice->update(data, count * sizeof(uint16_t));
}

scene::Model* EFKModelN::drawSprite(uint32_t stride, uint32_t offset, uint32_t spriteCount, cc::Material* material, uint32_t type) {
    auto fisrtVertex = offset / stride;
    auto fisrtIndex  = fisrtVertex / 4 * 6;

    auto buffer = m_buffers[stride];
    EFKModelN::resizeIndice(buffer.indice, fisrtIndex + spriteCount * 6);

    auto iaInfo = gfx::DrawInfo{
        spriteCount * 4,
        fisrtVertex,
        spriteCount * 6,
        fisrtIndex
    };

    auto mesh = -1;
    auto itr  = m_typeid_meshs.find(type);
    if (itr != m_typeid_meshs.end()) {
        m_typeid_meshs.insert(std::make_pair(type, std::vector<int32_t>{}));
    }

    auto& meshs = m_typeid_meshs[type];
    for (auto i = 0; i < meshs.size(); ++i) {
        auto idx = meshs[i];
        if (!m_typeid_used[idx]) {
            m_typeid_used.insert(std::make_pair(idx, true));
            mesh = idx;
            break;
        }
    }

    RenderingSubMesh* subMesh = NULL;
    if (mesh >= 0) {
        subMesh = m_meshs[mesh];
        subMesh->setDrawInfo(iaInfo);
    }
    else {
        std::vector<gfx::Attribute> attrs;

        scene::Pass* pass      = material->getPasses().get()->at(0).get();
        auto         attrs_src = pass->getShaderInfo()->attributes;
        for (auto attr : attrs_src) {
            attrs.push_back(gfx::Attribute{ attr.name, attr.format, attr.isNormalized, attr.stream, attr.isInstanced, attr.location });
        }

        subMesh = new RenderingSubMesh(std::vector<gfx::Buffer*>{ buffer.vertex }, attrs, gfx::PrimitiveMode::TRIANGLE_LIST, buffer.indice, nullptr, false);
        subMesh->addRef();

        mesh = m_meshs.size();
        m_meshs.push_back(subMesh);

        m_typeid_meshs[type].push_back(mesh);
        m_typeid_used[mesh] = true;
    }

    return EFKModelN::checkModel(mesh, subMesh, material, iaInfo);
}

void EFKModelN::addModel(int32_t key, std::vector<uint8_t> vertecies, std::vector<uint8_t> indices, uint32_t frame) {
    gfx::Device* device = gfx::Device::getInstance();

    auto itr = g_models.find(key);
    if (itr != g_models.end()) {
        g_models.insert(std::make_pair(key, std::vector<ModelInfo>{}));
    }

    if (g_models[key].size() > frame) {
        auto& buffer = g_models[key][frame];
        if (buffer.vertex->getSize() < vertecies.size()) {
            buffer.vertex->resize(vertecies.size());
            buffer.indice->resize(indices.size());
        }
    }
    else {
        auto vertex = device->createBuffer({ gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST, gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE, (uint32_t)vertecies.size(), ModelStrip });
        auto indice = device->createBuffer({ gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST, gfx::MemoryUsageBit::DEVICE, (uint32_t)indices.size(), sizeof(uint32_t) });

        vertex->addRef();
        indice->addRef();

        g_models[key].resize(frame + 1);
        g_models[key][frame] = {
            vertex,
            indice,
            { vertex->getCount(),
              0,
              indice->getCount(),
              0 }
        };
    }

    g_models[key][frame].vertex->update(vertecies.data(), vertecies.size());
    g_models[key][frame].indice->update(indices.data(), indices.size());
}

void EFKModelN::removeModel(int32_t key) {
    if (g_models.find(key) == g_models.end()) {
        return;
    }

    auto& frames = g_models[key];
    for (auto frame : frames) {
        frame.vertex->release();
        frame.indice->release();
    }
    g_models.erase(key);

    auto& meshs = m_model_meshs[key];
    for (auto mesh : meshs) {
        m_meshs[mesh]->release();

        auto& models = m_model_cache[mesh];
        for (auto model : models) {
            m_models[model]->release();
        }
        m_model_cache.erase(mesh);
    }
    m_model_meshs.erase(key);
}

scene::Model* EFKModelN::drawModel(int32_t id, uint32_t frame, Material* material, uint32_t type) {
    auto itr = m_model_meshs.find(id);
    if (itr == m_model_meshs.end()) {
        m_model_meshs.insert(std::make_pair(id, std::vector<int32_t>{}));
    }

    auto& meshs = m_model_meshs[id];
    auto  mesh  = (meshs.size() > frame && meshs[frame] != 0) ? meshs[frame] : -1;

    auto              buffer  = g_models[id][frame];
    RenderingSubMesh* subMesh = nullptr;

    if (mesh >= 0) {
        subMesh = m_meshs[mesh];
    }
    else {
        subMesh = new RenderingSubMesh({ buffer.vertex }, ModelVertexEx, gfx::PrimitiveMode::TRIANGLE_LIST, buffer.indice);
        subMesh->addRef();

        mesh = m_meshs.size();
        m_meshs.push_back(subMesh);
        m_model_meshs[id].push_back(mesh);
    }

    return EFKModelN::checkModel(mesh, subMesh, material, buffer.ia);
}

scene::Model* EFKModelN::checkModel(int32_t mesh_id, RenderingSubMesh* mesh_obj, Material* material, gfx::DrawInfo& info) {
    scene::Model* model = nullptr;

    auto itr = m_model_cache.find(mesh_id);
    if (itr == m_model_cache.end()) {
        m_model_cache.insert(std::make_pair(mesh_id, std::vector<int32_t>{}));
    }

    auto& cache = m_model_cache[mesh_id];
    for (auto ii = 0; ii < cache.size(); ++ii) {
        auto mid = cache[ii];
        if (m_model_used[mid]) {
            continue;
        }
        model             = m_models[mid];
        m_model_used[mid] = true;
        break;
    }

    if (nullptr == model) {
        model = Root::getInstance()->createModel<scene::Model>();
        model->addRef();
        model->initSubModel(0, mesh_obj, material);

        auto mid = m_models.size();
        m_models.push_back(model);
        m_model_cache[mesh_id].push_back(mid);

        m_model_used[mid] = true;
    }
    else {
        model->setSubModelMaterial(0, material);
    }

    model->getSubModels()[0]->getInputAssembler()->setDrawInfo(info);
    model->setPriority(m_priority++);

    return model;
}
