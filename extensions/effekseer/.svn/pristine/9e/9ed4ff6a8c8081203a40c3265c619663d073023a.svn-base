
#pragma once

#include "./common.h"
#include "./vfile.h"

namespace cce {

class ModelEx : public Effekseer::Model {
    friend class ModelLoader;

public:
    ModelEx(void* data, int32_t size)
    : Effekseer::Model(data, size) {}
    virtual ~ModelEx()  = default;
    int32_t InternalPtr = 0;

public:
    int                  getFrameCount();
    std::vector<uint8_t> getVertecies(int frame);
    std::vector<uint8_t> getFaces(int frame);
};

using ModelLoaderLoad   = std::function<std::vector<uint8_t>(int32_t key, std::string src)>;
using ModelLoaderMeshLoad = std::function<void(int32_t key, ModelEx* model)>;
using ModelLoaderUnload = std::function<void(int32_t key, std::string src)>;

class ModelLoader : public Effekseer::ModelLoader {
private:
    ModelLoaderLoad                            m_load;
    ModelLoaderMeshLoad                        m_load_mesh;
    ModelLoaderUnload                          m_unload;
    std::map<std::string, Effekseer::ModelRef> m_id2model;
    std::map<Effekseer::ModelRef, std::string> m_model2id;
    Effekseer::RefPtr<MemoryFile>              m_file;
    Effekseer::RefPtr<Effekseer::ModelLoader>  m_loader;

public:
    ModelLoader(ModelLoaderLoad load, ModelLoaderMeshLoad meshload, ModelLoaderUnload unload);
    virtual ~ModelLoader() = default;
    virtual Effekseer::ModelRef Load(const char16_t* path) override;
    virtual void                Unload(Effekseer::ModelRef source) override;

    Effekseer::FileInterfaceRef GetFileInterface() { return m_file; }
    void                        SetInternalLoader(Effekseer::RefPtr<Effekseer::ModelLoader> loader) { m_loader = loader; }
};

using MeshLoaderLoad   = std::function<int(std::vector<float> vertecies, int verteciesCount, std::vector<int32_t> faces, int facesCount)>;
using MeshLoaderUnload = std::function<void(int32_t id, int32_t handle)>;

class Model : public Effekseer::Model {
public:
    Model(void* data, int32_t size)
    : Effekseer::Model(data, size) {}
    Model(const Effekseer::CustomVector<Effekseer::Model::Vertex>& vertecies, const Effekseer::CustomVector<Effekseer::Model::Face>& faces)
    : Effekseer::Model(vertecies, faces) {}
    virtual ~Model()    = default;
    int32_t InternalPtr = 0;
};

class MeshLoader : public Effekseer::ProceduralModelGenerator {
private:
    MeshLoaderLoad   generate_;
    MeshLoaderUnload ungenerate_;

public:
    MeshLoader(MeshLoaderLoad generate, MeshLoaderUnload ungenerate)
    : generate_(generate)
    , ungenerate_(ungenerate) {}
    ~MeshLoader() override = default;
    Effekseer::ModelRef Generate(const Effekseer::ProceduralModelParameter& parameter) override;
    void                Ungenerate(Effekseer::ModelRef model) override;
};

}
