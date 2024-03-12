
#include "./material.h"

static const int GL_InstanceCount = 10;

void StoreVertexUniform(const ::Effekseer::MaterialFile& materialFile, const EffekseerRenderer::MaterialShaderParameterGenerator& generator, Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement>& uniformLayout) {
    using namespace Effekseer::Backend;

    auto storeVector = [&](const char* name, int offset, int count = 1) {
        uniformLayout.emplace_back(UniformLayoutElement{ ShaderStageType::Vertex, name, UniformBufferLayoutElementType::Vector4, count, offset });
    };

    auto storeMatrix = [&](const char* name, int offset, int count = 1) {
        uniformLayout.emplace_back(UniformLayoutElement{ ShaderStageType::Vertex, name, UniformBufferLayoutElementType::Matrix44, count, offset });
    };

    storeMatrix("uMatCamera", generator.VertexCameraMatrixOffset);
    storeMatrix("uMatProjection", generator.VertexProjectionMatrixOffset);
    storeVector("mUVInversed", generator.VertexInversedFlagOffset);
    storeVector("predefined_uniform", generator.VertexPredefinedOffset);
    storeVector("cameraPosition", generator.VertexCameraPositionOffset);

    auto currentOffset = generator.VertexUserUniformOffset;

    for (int32_t ui = 0; ui < materialFile.GetUniformCount(); ui++) {
        storeVector(materialFile.GetUniformName(ui), currentOffset);
        currentOffset += sizeof(float) * 4;
    }

    for (size_t ui = 0; ui < materialFile.Gradients.size(); ui++) {
        for (int j = 0; j < 13; j++) {
            const auto name = materialFile.Gradients.at(ui).Name + "_" + std::to_string(j);
            storeVector(name.c_str(), currentOffset);
            currentOffset += sizeof(float) * 4;
        }
    }
}

void StoreModelVertexUniform(const ::Effekseer::MaterialFile& materialFile, const EffekseerRenderer::MaterialShaderParameterGenerator& generator, Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement>& uniformLayout, bool instancing) {
    using namespace Effekseer::Backend;

    auto storeVector = [&](const char* name, int offset, int count = 1) {
        uniformLayout.emplace_back(UniformLayoutElement{ ShaderStageType::Vertex, name, UniformBufferLayoutElementType::Vector4, count, offset });
    };

    auto storeMatrix = [&](const char* name, int offset, int count = 1) {
        uniformLayout.emplace_back(UniformLayoutElement{ ShaderStageType::Vertex, name, UniformBufferLayoutElementType::Matrix44, count, offset });
    };

    storeMatrix("mProjection", generator.VertexProjectionMatrixOffset);

    if (instancing) {
        storeMatrix("mModel", generator.VertexModelMatrixOffset, GL_InstanceCount);

        storeVector("fUV", generator.VertexModelUVOffset, GL_InstanceCount);

        storeVector("fModelColor", generator.VertexModelColorOffset, GL_InstanceCount);
    }
    else {
        storeMatrix("mModel", generator.VertexModelMatrixOffset);

        storeVector("fUV", generator.VertexModelUVOffset);

        storeVector("fModelColor", generator.VertexModelColorOffset);
    }

    storeVector("mUVInversed", generator.VertexInversedFlagOffset);

    storeVector("predefined_uniform", generator.VertexPredefinedOffset);

    storeVector("cameraPosition", generator.VertexCameraPositionOffset);

    if (instancing) {
        if (materialFile.GetCustomData1Count() > 0) {
            storeVector("customData1s", generator.VertexModelCustomData1Offset, GL_InstanceCount);
        }

        if (materialFile.GetCustomData2Count() > 0) {
            storeVector("customData2s", generator.VertexModelCustomData2Offset, GL_InstanceCount);
        }
    }
    else {
        if (materialFile.GetCustomData1Count() > 0) {
            storeVector("customData1", generator.VertexModelCustomData1Offset);
        }

        if (materialFile.GetCustomData2Count() > 0) {
            storeVector("customData2", generator.VertexModelCustomData2Offset);
        }
    }

    auto currentOffset = generator.VertexUserUniformOffset;

    for (int32_t ui = 0; ui < materialFile.GetUniformCount(); ui++) {
        storeVector(materialFile.GetUniformName(ui), currentOffset);
        currentOffset += sizeof(float) * 4;
    }

    for (size_t ui = 0; ui < materialFile.Gradients.size(); ui++) {
        for (int j = 0; j < 13; j++) {
            const auto name = materialFile.Gradients.at(ui).Name + "_" + std::to_string(j);
            storeVector(name.c_str(), currentOffset);
            currentOffset += sizeof(float) * 4;
        }
    }
}

void StorePixelUniform(const ::Effekseer::MaterialFile& materialFile, const EffekseerRenderer::MaterialShaderParameterGenerator& generator, Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement>& uniformLayout, int shaderType) {
    using namespace Effekseer::Backend;

    auto storeVector = [&](const char* name, int offset, int count = 1) {
        uniformLayout.emplace_back(UniformLayoutElement{ ShaderStageType::Pixel, name, UniformBufferLayoutElementType::Vector4, count, offset });
    };

    auto storeMatrix = [&](const char* name, int offset, int count = 1) {
        uniformLayout.emplace_back(UniformLayoutElement{ ShaderStageType::Pixel, name, UniformBufferLayoutElementType::Matrix44, count, offset });
    };

    storeVector("mUVInversedBack", generator.PixelInversedFlagOffset);
    storeVector("predefined_uniform", generator.PixelPredefinedOffset);
    storeVector("cameraPosition", generator.PixelCameraPositionOffset);
    storeVector("reconstructionParam1", generator.PixelReconstructionParam1Offset);
    storeVector("reconstructionParam2", generator.PixelReconstructionParam2Offset);
    storeVector("fLightDirection", generator.PixelLightDirectionOffset);
    storeVector("fLightColor", generator.PixelLightColorOffset);
    storeVector("fLightAmbient", generator.PixelLightAmbientColorOffset);

    if (materialFile.GetHasRefraction() && shaderType == 1) {
        storeMatrix("cameraMat", generator.PixelCameraMatrixOffset);
    }

    auto currentOffset = generator.PixelUserUniformOffset;

    for (int32_t ui = 0; ui < materialFile.GetUniformCount(); ui++) {
        storeVector(materialFile.GetUniformName(ui), currentOffset);
        currentOffset += sizeof(float) * 4;
    }

    for (size_t ui = 0; ui < materialFile.Gradients.size(); ui++) {
        for (int j = 0; j < 13; j++) {
            const auto name = materialFile.Gradients.at(ui).Name + "_" + std::to_string(j);
            storeVector(name.c_str(), currentOffset);
            currentOffset += sizeof(float) * 4;
        }
    }
}

Effekseer::CustomVector<Effekseer::CustomString<char>> StoreTextureLocations(const ::Effekseer::MaterialFile& materialFile) {
    Effekseer::CustomVector<Effekseer::CustomString<char>> texLoc;

    int32_t maxInd = -1;
    for (int32_t ti = 0; ti < materialFile.GetTextureCount(); ti++) {
        maxInd = Effekseer::Max(maxInd, materialFile.GetTextureIndex(ti));
    }

    texLoc.resize(maxInd + 1);
    for (int32_t ti = 0; ti < materialFile.GetTextureCount(); ti++) {
        texLoc[materialFile.GetTextureIndex(ti)] = materialFile.GetTextureName(ti);
    }

    texLoc.emplace_back("efk_background");
    texLoc.emplace_back("efk_depth");
    return texLoc;
}

namespace cce {
MaterialLoader::MaterialLoader(MaterialLoaderLoad load, MaterialLoaderUnload unload, MaterialLoaderLoadShader loadShader)
: m_load(load)
, m_unload(unload)
, m_load_shader(loadShader) {
}

Effekseer::MaterialRef MaterialLoader::Load(const EFK_CHAR* path) {
    std::string src = UTF16ToUTF8(path);
    int32_t hash_key = std::hash<std::string>{}(src);

    Effekseer::MaterialRef generated;
    if (m_id2material.find(src) != m_id2material.end()) {
        // a empty call for right slot order
        auto buffer = m_load(hash_key, src);
        return m_id2material[src];
    }

    auto buffer = m_load(hash_key, src);

    std::shared_ptr<Effekseer::MaterialFile> materialFile = std::shared_ptr<Effekseer::MaterialFile>(new Effekseer::MaterialFile);
    if (!materialFile->Load((const uint8_t*)buffer.data(), buffer.size())) {
        return nullptr;
    }

#if CC_EFFEKSSER_IMPORTOR
    auto compiler = ::Effekseer::CreateUniqueReference(new Effekseer::MaterialCompilerGL());
    auto binary   = ::Effekseer::CreateUniqueReference(compiler->Compile(materialFile.get()));
    auto material = LoadAcutually(hash_key, materialFile, binary.get());
#else
    auto material = LoadAcutually(hash_key, materialFile, nullptr);
#endif
    ((Material*)material.Get())->InternalPtr = hash_key;

    m_id2material.insert(std::make_pair(src, material));
    m_material2id.insert(std::make_pair(material, src));

    return material;
}

Effekseer::MaterialRef MaterialLoader::LoadAcutually(int materialPtr, std::shared_ptr<Effekseer::MaterialFile>& materialFile, ::Effekseer::CompiledMaterialBinary* binary) {
#if CC_EFFEKSSER_IMPORTOR
    if (binary == nullptr) {
        return nullptr;
    }
#endif

    auto instancing = false;

    auto material                  = ::Effekseer::MakeRefPtr<cce::Material>();
    material->IsSimpleVertex       = materialFile->GetIsSimpleVertex();
    material->IsRefractionRequired = materialFile->GetHasRefraction();

    std::array<Effekseer::MaterialShaderType, 2> shaderTypes;
    std::array<Effekseer::MaterialShaderType, 2> shaderTypesModel;

    shaderTypes[0]          = Effekseer::MaterialShaderType::Standard;
    shaderTypes[1]          = Effekseer::MaterialShaderType::Refraction;
    shaderTypesModel[0]     = Effekseer::MaterialShaderType::Model;
    shaderTypesModel[1]     = Effekseer::MaterialShaderType::RefractionModel;
    int32_t shaderTypeCount = 1;

    if (materialFile->GetHasRefraction()) {
        shaderTypeCount = 2;
    }

    for (int32_t st = 0; st < shaderTypeCount; st++) {
        auto parameterGenerator = EffekseerRenderer::MaterialShaderParameterGenerator(*materialFile, false, st, 1);

        Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement> uniformLayoutElements;
        StoreVertexUniform(*materialFile, parameterGenerator, uniformLayoutElements);
        StorePixelUniform(*materialFile, parameterGenerator, uniformLayoutElements, st);
        auto uniformLayout = Effekseer::MakeRefPtr<Effekseer::Backend::UniformLayout>(StoreTextureLocations(*materialFile), uniformLayoutElements);

        auto shader = new ShaderEx(materialPtr, materialFile, true, true);
        shader->SetUniformLayout(uniformLayout->GetElements());

#if CC_EFFEKSSER_IMPORTOR
        if (shader == nullptr) {
            EffekseerPrintDebug("Vertex shader error");
            EffekseerPrintDebug((const char*)binary->GetVertexShaderData(shaderTypes[st]));

            EffekseerPrintDebug("Pixel shader error");
            EffekseerPrintDebug((const char*)binary->GetPixelShaderData(shaderTypes[st]));

            return nullptr;
        }

        shader->vs = (const char*)binary->GetVertexShaderData(shaderTypes[st]);
        shader->fs = (const char*)binary->GetPixelShaderData(shaderTypes[st]);
#endif

        if (material->IsSimpleVertex) {
            shader->SetVertexLayout({
                { Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT, "atPosition", "POSITION", 0 },
                { Effekseer::Backend::VertexLayoutFormat::R8G8B8A8_UNORM, "atColor", "NORMAL", 0 },
                { Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT, "atTexCoord", "TEXCOORD", 0 },
            });
        }
        else {
            std::vector<Effekseer::Backend::VertexLayoutElement> vlElem = {
                { Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT, "atPosition", "POSITION", 0 },
                { Effekseer::Backend::VertexLayoutFormat::R8G8B8A8_UNORM, "atColor", "NORMAL", 0 },
                { Effekseer::Backend::VertexLayoutFormat::R8G8B8A8_UNORM, "atNormal", "NORMAL", 1 },
                { Effekseer::Backend::VertexLayoutFormat::R8G8B8A8_UNORM, "atTangent", "NORMAL", 2 },
                { Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT, "atTexCoord", "TEXCOORD", 0 },
                { Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT, "atTexCoord2", "TEXCOORD", 1 },
                { Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT, "", "TEXCOORD", 2 },
                { Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT, "", "TEXCOORD", 3 },
            };

            auto getFormat = [](int32_t i) -> Effekseer::Backend::VertexLayoutFormat {
                if (i == 1)
                    return Effekseer::Backend::VertexLayoutFormat::R32_FLOAT;
                if (i == 2)
                    return Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT;
                if (i == 3)
                    return Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT;
                if (i == 4)
                    return Effekseer::Backend::VertexLayoutFormat::R32G32B32A32_FLOAT;

                assert(0);
                return Effekseer::Backend::VertexLayoutFormat::R32_FLOAT;
            };

            int32_t     offset          = 40;
            int         count           = 6;
            int         semanticIndex   = 2;
            const char* customData1Name = "atCustomData1";
            const char* customData2Name = "atCustomData2";

            if (materialFile->GetCustomData1Count() > 0) {
                vlElem[count].Name          = customData1Name;
                vlElem[count].Format        = getFormat(materialFile->GetCustomData1Count());
                vlElem[count].SemanticIndex = semanticIndex;
                semanticIndex++;

                count++;
                offset += sizeof(float) * materialFile->GetCustomData1Count();
            }

            if (materialFile->GetCustomData2Count() > 0) {
                vlElem[count].Name          = customData2Name;
                vlElem[count].Format        = getFormat(materialFile->GetCustomData2Count());
                vlElem[count].SemanticIndex = semanticIndex;
                semanticIndex++;

                count++;
                offset += sizeof(float) * materialFile->GetCustomData2Count();
            }

            shader->SetVertexLayout(vlElem);
        }

        material->TextureCount = std::min(materialFile->GetTextureCount(), Effekseer::UserTextureSlotMax);
        material->UniformCount = materialFile->GetUniformCount();

        if (st == 0) {
            material->UserPtr = shader;
            m_load_shader(materialPtr, shader, 0);
        }
        else {
            material->RefractionUserPtr = shader;
            m_load_shader(materialPtr, shader, 1);
        }
    }

    for (int32_t st = 0; st < shaderTypeCount; st++) {
        auto                                                              parameterGenerator = EffekseerRenderer::MaterialShaderParameterGenerator(*materialFile, true, st, instancing ? GL_InstanceCount : 1);
        Effekseer::CustomVector<Effekseer::Backend::UniformLayoutElement> uniformLayoutElements;
        StoreModelVertexUniform(*materialFile, parameterGenerator, uniformLayoutElements, instancing);
        StorePixelUniform(*materialFile, parameterGenerator, uniformLayoutElements, st);
        auto uniformLayout = Effekseer::MakeRefPtr<Effekseer::Backend::UniformLayout>(StoreTextureLocations(*materialFile), uniformLayoutElements);

        auto shader = new ShaderEx(materialPtr, materialFile, true, true);
        shader->SetUniformLayout(uniformLayout->GetElements());

#if CC_EFFEKSSER_IMPORTOR
        shader->vs = (const char*)binary->GetVertexShaderData(shaderTypesModel[st]);
        shader->fs = (const char*)binary->GetPixelShaderData(shaderTypesModel[st]);

        if (shader == nullptr) {
            EffekseerPrintDebug("Vertex shader error");
            EffekseerPrintDebug((const char*)binary->GetVertexShaderData(shaderTypesModel[st]));

            EffekseerPrintDebug("Pixel shader error");
            EffekseerPrintDebug((const char*)binary->GetPixelShaderData(shaderTypesModel[st]));

            return nullptr;
        }
#endif

        shader->SetVertexLayout({
            { Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT, "a_Position", "POSITION", 0 },
            { Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT, "a_Normal", "NORMAL", 1 },
            { Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT, "a_Binormal", "NORMAL", 1 },
            { Effekseer::Backend::VertexLayoutFormat::R32G32B32_FLOAT, "a_Tangent", "NORMAL", 2 },
            { Effekseer::Backend::VertexLayoutFormat::R32G32_FLOAT, "a_TexCoord", "TEXCOORD", 0 },
            { Effekseer::Backend::VertexLayoutFormat::R8G8B8A8_UNORM, "a_Color", "NORMAL", 3 },
        });

        if (st == 0) {
            material->ModelUserPtr = shader;
            m_load_shader(materialPtr, shader, 2);
        }
        else {
            material->RefractionModelUserPtr = shader;
            m_load_shader(materialPtr, shader, 3);
        }
    }

    material->CustomData1  = materialFile->GetCustomData1Count();
    material->CustomData2  = materialFile->GetCustomData2Count();
    material->TextureCount = std::min(materialFile->GetTextureCount(), Effekseer::UserTextureSlotMax);
    material->UniformCount = materialFile->GetUniformCount();
    material->ShadingModel = materialFile->GetShadingModel();

    for (int32_t i = 0; i < material->TextureCount; i++) {
        material->TextureWrapTypes.at(i) = materialFile->GetTextureWrap(i);
    }

    return material;
}

void MaterialLoader::Unload(Effekseer::MaterialRef data) {
    if (data == nullptr) {
        return;
    }

    auto key = ((Material*)data.Get())->InternalPtr;
    auto itr = m_material2id.find(data);

    if (itr != m_material2id.end()) {
        m_unload(itr->second, key);
        m_id2material.erase(itr->second);
        m_material2id.erase(itr->first);
    }
}

ShaderEx::ShaderEx(int32_t unityMaterial, std::shared_ptr<Effekseer::MaterialFile> material, bool isModel, bool isRefraction)
: unityMaterial_(unityMaterial)
, parameterGenerator_(*material, isModel, isRefraction ? 1 : 0, 1)
, shaderType_(EffekseerRenderer::RendererShaderType::Material)
, material_(material)
, isRefraction_(isRefraction) {
    vertexConstantBuffer.resize(parameterGenerator_.VertexShaderUniformBufferSize);
    pixelConstantBuffer.resize(parameterGenerator_.PixelShaderUniformBufferSize);
}

ShaderEx::ShaderEx(EffekseerRenderer::RendererShaderType shaderType)
: parameterGenerator_(::Effekseer::MaterialFile(), false, 0, 1)
, shaderType_(shaderType) {
    auto vertexConstantBufferSize = sizeof(EffekseerRenderer::ModelRendererAdvancedVertexConstantBuffer<1>);
    vertexConstantBufferSize      = std::max(vertexConstantBufferSize, sizeof(EffekseerRenderer::ModelRendererVertexConstantBuffer<1>));
    vertexConstantBufferSize      = std::max(vertexConstantBufferSize, sizeof(EffekseerRenderer::StandardRendererVertexBuffer));
    vertexConstantBuffer.resize(vertexConstantBufferSize);
    pixelConstantBuffer.resize(std::max(sizeof(EffekseerRenderer::PixelConstantBuffer), sizeof(EffekseerRenderer::PixelConstantBufferDistortion)));
}

ShaderEx::~ShaderEx() {
}

EffekseerRenderer::RendererShaderType ShaderEx::GetType() const {
    return shaderType_;
}

int32_t ShaderEx::GetMaterialPtr() const {
    return unityMaterial_;
}

bool ShaderEx::GetIsRefraction() const {
    return isRefraction_;
};

}  // namespace EffekseerPlugin
