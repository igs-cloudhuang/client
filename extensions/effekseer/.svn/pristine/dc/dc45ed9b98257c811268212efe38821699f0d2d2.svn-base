
#include "./model.h"

namespace cce {

int ModelEx::getFrameCount() {
    return this->GetFrameCount();
}

std::vector<uint8_t> ModelEx::getVertecies(int frame) {
    auto data = (uint8_t*)this->GetVertexes(frame);
    auto size = this->GetVertexCount(frame) * sizeof(Model::Vertex);
    return std::vector<uint8_t>(data, data + size);
}

std::vector<uint8_t> ModelEx::getFaces(int frame) {
    auto data = (uint8_t*)this->GetFaces(frame);
    auto size = this->GetFaceCount(frame) * sizeof(Model::Face);
    return std::vector<uint8_t>(data, data + size);
}

ModelLoader::ModelLoader(ModelLoaderLoad load, ModelLoaderMeshLoad meshload, ModelLoaderUnload unload)
: m_load(load)
, m_unload(unload)
, m_load_mesh(meshload) {
    m_file = Effekseer::MakeRefPtr<MemoryFile>();
}

Effekseer::ModelRef ModelLoader::Load(const EFK_CHAR* path) {
    std::string src      = UTF16ToUTF8(path);
    int32_t     hash_key = std::hash<std::string>{}(src);

    Effekseer::ModelRef generated;
    if (m_id2model.find(src) != m_id2model.end()) {
        // a empty call for right slot order
        m_load(hash_key, src);

        auto model = m_id2model[src];
        m_load_mesh(hash_key, model.DownCast<ModelEx>().Get());

        return model;
    }
    std::vector<uint8_t> data = m_load(hash_key, src);

    auto model         = Effekseer::MakeRefPtr<ModelEx>(data.data(), data.size());
    model->InternalPtr = hash_key;

    m_id2model.insert(std::make_pair(src, model));
    m_model2id.insert(std::make_pair(model, src));

    m_load_mesh(hash_key, model.DownCast<ModelEx>().Get());

    return model;
}

void ModelLoader::Unload(Effekseer::ModelRef source) {
    if (source == nullptr) {
        return;
    }

    auto itr = m_model2id.find(source);
    if (itr != m_model2id.end()) {
        m_unload(itr->first.DownCast<ModelEx>()->InternalPtr, itr->second);
        m_id2model.erase(itr->second);
        m_model2id.erase(itr->first);
    }
}

void MeshLoader::Ungenerate(Effekseer::ModelRef model) {
    if (model == nullptr) {
        return;
    }
}

Effekseer::ModelRef MeshLoader::Generate(const Effekseer::ProceduralModelParameter& parameter) {
    auto original = Effekseer::ProceduralModelGenerator::Generate(parameter);

    std::vector<float>   cc_vertecies;
    std::vector<int32_t> cc_faces;

    cc_vertecies.resize(sizeof(Effekseer::Model::Vertex) * original->GetVertexCount());
    memcpy(cc_vertecies.data(), original->GetVertexes(), cc_vertecies.size());

    cc_faces.resize(sizeof(Effekseer::Model::Face) * original->GetFaceCount());
    memcpy(cc_faces.data(), original->GetFaces(), cc_faces.size());

    auto ptr = generate_(cc_vertecies, original->GetVertexCount(), cc_faces, original->GetFaceCount());

    // ========================

    Effekseer::CustomVector<Effekseer::Model::Vertex> vertecies_;
    Effekseer::CustomVector<Effekseer::Model::Face>   faces_;

    vertecies_.resize(original->GetVertexCount());
    memcpy(vertecies_.data(), original->GetVertexes(), sizeof(Effekseer::Model::Vertex) * vertecies_.size());

    faces_.resize(original->GetFaceCount());
    memcpy(faces_.data(), original->GetFaces(), sizeof(Effekseer::Model::Face) * faces_.size());

    auto newmodel         = Effekseer::MakeRefPtr<Model>(vertecies_, faces_);
    newmodel->InternalPtr = ptr;

    return newmodel;
}

}
