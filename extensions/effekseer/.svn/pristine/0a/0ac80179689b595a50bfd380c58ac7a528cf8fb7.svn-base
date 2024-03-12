

#pragma once

#include "./common.h"
#include "./vfile.h"

namespace cce {

class ShaderEx;

using MaterialLoaderLoad       = std::function<std::vector<uint8_t>(int32_t key, std::string src)>;
using MaterialLoaderUnload     = std::function<void(std::string src, int32_t handle)>;
using MaterialLoaderLoadShader = std::function<void(int32_t key, ShaderEx* shader, int32_t user_or_model)>;

class Material : public Effekseer::Material {
public:
    Material() {}
    virtual ~Material()   = default;
    int32_t InternalPtr = 0;
};

class MaterialLoader : public Effekseer::MaterialLoader {
    MaterialLoaderLoad                            m_load;
    MaterialLoaderUnload                          m_unload;
    MaterialLoaderLoadShader                      m_load_shader;
    Effekseer::MaterialLoaderRef                  m_loader;
    std::map<std::string, Effekseer::MaterialRef> m_id2material;
    std::map<Effekseer::MaterialRef, std::string> m_material2id;

public:
    MaterialLoader(MaterialLoaderLoad load, MaterialLoaderUnload unload, MaterialLoaderLoadShader loadShader);
    virtual ~MaterialLoader() = default;
    Effekseer::MaterialRef Load(const EFK_CHAR* path) override;
    void                   Unload(Effekseer::MaterialRef data) override;

private:
    Effekseer::MaterialRef LoadAcutually(int materialPtr, std::shared_ptr<Effekseer::MaterialFile>& materialFile, ::Effekseer::CompiledMaterialBinary* binary);
};

class ShaderEx final {
    friend class MaterialLoader;
    friend class RendererImplemented;

private:
    EffekseerRenderer::MaterialShaderParameterGenerator               parameterGenerator_;
    std::shared_ptr<Effekseer::MaterialFile>                          material_;
    int32_t                                                           unityMaterial_ = 0;
    EffekseerRenderer::RendererShaderType                             shaderType_{};
    std::vector<uint8_t>                                              vertexConstantBuffer;
    std::vector<uint8_t>                                              pixelConstantBuffer;
    bool                                                              isRefraction_;
    std::vector<Effekseer::Backend::VertexLayoutElement>              layouts;
    Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement> uniforms;
    std::string                                                       vs;
    std::string                                                       fs;

public:
    ShaderEx(int32_t unityMaterial, std::shared_ptr<Effekseer::MaterialFile> material, bool isModel, bool isRefraction);
    ShaderEx(EffekseerRenderer::RendererShaderType shaderType);
    ~ShaderEx();

    void SetConstantBuffer() {}

    void* GetVertexConstantBuffer() {
        return vertexConstantBuffer.data();
    }

    void* GetPixelConstantBuffer() {
        return pixelConstantBuffer.data();
    }

    template <typename T>
    T* GetVertexConstantBuffer() {
        return reinterpret_cast<T*>(vertexConstantBuffer.data());
    }

    template <typename T>
    T* GettPixelConstantBuffer() {
        return reinterpret_cast<T*>(pixelConstantBuffer.data());
    }

    void                                  SetVertexLayout(std::vector<Effekseer::Backend::VertexLayoutElement> layout) { layouts = layout; }
    void                                  SetUniformLayout(Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement> uniform) { uniforms = uniform; }
    EffekseerRenderer::RendererShaderType GetType() const;

    int32_t GetMaterialPtr() const;

    const std::shared_ptr<Effekseer::MaterialFile>& GetMaterial() {
        return material_;
    }

    const EffekseerRenderer::MaterialShaderParameterGenerator* GetParameterGenerator() const {
        return &parameterGenerator_;
    }

    bool GetIsRefraction() const;

public:
    int32_t getUniformCount() {
        return (int32_t)uniforms.size();
    }

    char* getUniform(int idx) {
        return (char*)uniforms[idx].Name.c_str();
    }

    std::string& getVS() {
        return vs;
    }

    std::string& getFS() {
        return fs;
    }
};

}
