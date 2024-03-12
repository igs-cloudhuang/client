
#pragma once

#include <Effekseer.h>
#include <EffekseerRenderer.ModelRendererBase.h>
#include <EffekseerRenderer.RenderStateBase.h>
#include <EffekseerRenderer.Renderer.h>
#include <EffekseerRenderer.RibbonRendererBase.h>
#include <EffekseerRenderer.RingRendererBase.h>
#include <EffekseerRenderer.SpriteRendererBase.h>
#include <EffekseerRenderer.StandardRenderer.h>
#include <EffekseerRenderer.TrackRendererBase.h>

#include <map>
#include <memory>

namespace cce {

struct ModelParameter1 {
    Effekseer::Matrix44 Matrix;
    Effekseer::RectF UV;
    float VColor[4];
    float Time = 0.0f;
    std::array<float, 4> customData;
};

struct ModelParameter2 {
    Effekseer::RectF AlphaUV;
    Effekseer::RectF DistortionUV;
    Effekseer::RectF BlendUV;
    Effekseer::RectF BlendAlphaUV;
    Effekseer::RectF BlendDistortionUV;
    float FlipbookIndexAndNextRate;
    float AlphaThreshold;
    float ViewOffsetDistance;
};

struct StrideBufferParameterEx {
    int32_t              Stride;
    std::vector<uint8_t> Ptr;
};

struct FlipbookParametersEx {
    int32_t Enable   = 0;
    int32_t LoopType = 0;
    float   DivideX  = 1.0f;
    float   DivideY  = 1.0f;
    float   OneSizeX = 0.0f;
    float   OneSizeY = 0.0f;
    float   OffsetX  = 0.0f;
    float   OffsetY  = 0.0f;
};

struct EdgeParametersEx {
    std::array<float, 4> Color;
    float                Threshold    = 0;
    float                ColorScaling = 1;
};

struct FalloffParameterEx {
    int32_t              ColorBlendType = 0;
    std::array<float, 4> BeginColor;
    std::array<float, 4> EndColor;
    float                Pow = 1.0f;
};

struct RenderParameter {
    FlipbookParametersEx* getFlipbookParams() { return &FlipbookParams; };
    FalloffParameterEx*   getFalloffParam() { return &FalloffParam; };
    EdgeParametersEx*     getEdgeParams() { return &EdgeParams; };

    //! 0 - procedural, 1 - model
    int                                             RenderMode              = 0;
    EffekseerRenderer::RendererShaderType           MaterialType            = EffekseerRenderer::RendererShaderType::Unlit;
    int                                             VertexBufferOffset      = 0;
    int                                             AdvancedBufferOffset    = 0;
    int                                             VertexBufferStride      = 0;
    int                                             CustomData1BufferOffset = 0;
    int                                             CustomData2BufferOffset = 0;
    int                                             UniformBufferOffset     = 0;
    int32_t                                         ElementCount            = 0;
    FlipbookParametersEx                            FlipbookParams;
    float                                           UVDistortionIntensity      = 1.0f;
    int32_t                                         TextureBlendType           = -1;
    float                                           BlendUVDistortionIntensity = 1.0f;
    int                                             EnableFalloff              = 0;
    FalloffParameterEx                              FalloffParam;
    float                                           EmissiveScaling = 1;
    EdgeParametersEx                                EdgeParams;
    std::array<float, 4>                            SoftParticleParam;
    std::array<float, 4>                            ReconstrcutionParam1;
    std::array<float, 4>                            ReconstrcutionParam2;
    std::array<float, 4>                            PredefinedUniform;
    int                                             ZTest               = 0;
    int                                             ZWrite              = 0;
    int                                             Blend               = 0;
    int                                             Culling             = 0;
    float                                           DistortionIntensity = 1.0f;
    int                                             IsRefraction        = 0;
    std::array<int32_t, Effekseer::TextureSlotMax>  TexturePtrs         = { 0 };
    std::array<int32_t, Effekseer::TextureSlotMax>  TextureFilterTypes  = { 0 };
    std::array<int32_t, Effekseer::TextureSlotMax>  TextureWrapTypes    = { 0 };
    int32_t                                         TextureCount        = 0;
    int32_t                                         MaterialPtr         = 0;
    int32_t                                         ModelPtr            = 0;
    int32_t                                         ComPtr              = 0;
};

void                    GetRenderParameter(RenderParameter* dst, int index);
int                     GetRenderCount();
void*                   GetVertexBuffer();
void*                   GetInfoBuffer();
int32_t                 GetStrideBufferCount();
StrideBufferParameterEx GetStrideBufferParameterEx(int32_t index);

class RendererImplemented;
class RenderState;
class VertexBuffer;
class IndexBuffer;
class ShaderEx;

using Vertex           = EffekseerRenderer::SimpleVertex;
using VertexDistortion = EffekseerRenderer::LightingVertex;
using DynamicVertex    = EffekseerRenderer::DynamicVertex;

using efkModelNodeParam     = ::Effekseer::ModelRenderer::NodeParameter;
using efkModelInstanceParam = ::Effekseer::ModelRenderer::InstanceParameter;
using efkVector3D           = ::Effekseer::Vector3D;

class ModelRenderer : public ::EffekseerRenderer::ModelRendererBase {
private:
    RendererImplemented* m_renderer;

public:
    ModelRenderer(RendererImplemented* renderer);
    virtual ~ModelRenderer();
    static ::Effekseer::ModelRendererRef Create(RendererImplemented* renderer);

public:
    void BeginRendering(const efkModelNodeParam& parameter, int32_t count, void* userData) override;
    void Rendering(const efkModelNodeParam& parameter, const efkModelInstanceParam& instanceParameter, void* userData) override;
    void EndRendering(const efkModelNodeParam& parameter, void* userData) override;
};

struct VertexEx {
    ::Effekseer::Vector3D Pos;
    float                 Col[4];
    float                 UV[2];
};

struct DynamicVertexEx {
    ::Effekseer::Vector3D Pos;
    float                 Col[4];
    ::Effekseer::Vector3D Normal;
    ::Effekseer::Vector3D Tangent;
    float                 UV1[2];
    float                 UV2[2];
};

struct AdvancedVertexParameter {
    std::array<float, 2> AlphaUV;
    std::array<float, 2> UVDistortionUV;
    std::array<float, 2> BlendUV;
    std::array<float, 2> BlendAlphaUV;
    std::array<float, 2> BlendUVDistortionUV;
    float                FlipbookIndexAndNextRate;
    float                AlphaThreshold;
};

class RendererImplemented : public ::EffekseerRenderer::Renderer, public ::Effekseer::ReferenceObject {
    struct StrideBuffer {
        int32_t              Stride = 0;
        std::vector<uint8_t> Buffer;
        int32_t              PushBuffer(const void* data, int32_t size);
        int32_t              GetOffset() const { return static_cast<int32_t>(Buffer.size()); }
    };

    std::vector<std::shared_ptr<StrideBuffer>> strideBuffers_;
    std::unordered_map<int32_t, int32_t>       strideToIndex_;
    void                                       ClearStrideBuffers();
    std::shared_ptr<StrideBuffer>              GetStrideBuffer(int32_t stride);

protected:
    int32_t                                                             m_squareMaxCount = 0;
    VertexBuffer*                                                       m_vertexBuffer   = nullptr;
    std::unique_ptr<ShaderEx>                                           unlitShader_;
    std::unique_ptr<ShaderEx>                                           backDistortedShader_;
    std::unique_ptr<ShaderEx>                                           litShader_;
    std::unique_ptr<ShaderEx>                                           adUnlitShader_;
    std::unique_ptr<ShaderEx>                                           adBackDistortedShader_;
    std::unique_ptr<ShaderEx>                                           adLitShader_;
    ShaderEx*                                                           m_currentShader = nullptr;
    RenderState*                                                        m_renderState   = nullptr;
    std::vector<uint32_t>                                               textures_;
    std::vector<RenderParameter>                                        renderModelParameters;
    std::vector<RenderParameter>                                        renderSpriteParameters;
    Effekseer::RendererMaterialType                                     rendererMaterialType_ = Effekseer::RendererMaterialType::Default;
    std::vector<uint8_t>                                                exportedInfoBuffer;
    Effekseer::TextureRef                                               backgroundData_;
    EffekseerRenderer::StandardRenderer<RendererImplemented, ShaderEx>* m_standardRenderer = nullptr;
    int32_t                                                             AddInfoBuffer(const void* data, int32_t size);

    template <typename T>
    void AddVertexBufferAsVertex(const T& v, StrideBuffer& strideBuffer) {
        VertexEx dst;
        dst.Pos    = v.Pos;
        dst.UV[0]  = v.UV[0];
        dst.UV[1]  = v.UV[1];
        dst.Col[0] = v.Col.R / 255.0f;
        dst.Col[1] = v.Col.G / 255.0f;
        dst.Col[2] = v.Col.B / 255.0f;
        dst.Col[3] = v.Col.A / 255.0f;
        strideBuffer.PushBuffer(&dst, sizeof(VertexEx));
    }

    template <typename T>
    void AddVertexBufferAsDynamicVertex(const T& v, StrideBuffer& strideBuffer) {
        DynamicVertexEx dst;
        dst.Pos     = v.Pos;
        dst.UV1[0]  = v.UV1[0];
        dst.UV1[1]  = v.UV1[1];
        dst.UV2[0]  = v.UV2[0];
        dst.UV2[1]  = v.UV2[1];
        dst.Col[0]  = v.Col.R / 255.0f;
        dst.Col[1]  = v.Col.G / 255.0f;
        dst.Col[2]  = v.Col.B / 255.0f;
        dst.Col[3]  = v.Col.A / 255.0f;
        dst.Tangent = EffekseerRenderer::UnpackVector3DF(v.Tangent);
        dst.Normal  = EffekseerRenderer::UnpackVector3DF(v.Normal);
        strideBuffer.PushBuffer(&dst, sizeof(DynamicVertexEx));
    }

    template <typename T>
    void AddVertexBufferAsAdvancedData(const T& v, StrideBuffer& strideBuffer) {
        AdvancedVertexParameter dst;

        dst.AlphaUV                  = EffekseerRenderer::GetVertexAlphaUV(v);
        dst.UVDistortionUV           = EffekseerRenderer::GetVertexUVDistortionUV(v);
        dst.BlendUV                  = EffekseerRenderer::GetVertexBlendUV(v);
        dst.BlendAlphaUV             = EffekseerRenderer::GetVertexBlendAlphaUV(v);
        dst.BlendUVDistortionUV      = EffekseerRenderer::GetVertexUVDistortionUV(v);
        dst.FlipbookIndexAndNextRate = EffekseerRenderer::GetVertexFlipbookIndexAndNextRate(v);
        dst.AlphaThreshold           = EffekseerRenderer::GetVertexAlphaThreshold(v);
        strideBuffer.PushBuffer(&dst, sizeof(AdvancedVertexParameter));
    }

public:
    static Effekseer::RefPtr<RendererImplemented> Create();
    RendererImplemented();
    virtual ~RendererImplemented();
    void                                                                OnLostDevice() override {}
    void                                                                OnResetDevice() override {}
    bool                                                                Initialize(int32_t squareMaxCount);
    void                                                                SetRestorationOfStatesFlag(bool flag) override;
    bool                                                                BeginRendering() override;
    bool                                                                EndRendering() override;
    int32_t                                                             GetSquareMaxCount() const override;
    ::Effekseer::Backend::TextureRef                                    CreateProxyTexture(EffekseerRenderer::ProxyTextureType type) override;
    ::Effekseer::SpriteRendererRef                                      CreateSpriteRenderer() override;
    ::Effekseer::RibbonRendererRef                                      CreateRibbonRenderer() override;
    ::Effekseer::RingRendererRef                                        CreateRingRenderer() override;
    ::Effekseer::ModelRendererRef                                       CreateModelRenderer() override;
    ::Effekseer::TrackRendererRef                                       CreateTrackRenderer() override;
    virtual ::Effekseer::TextureLoaderRef                               CreateTextureLoader(::Effekseer::FileInterfaceRef fileInterface = nullptr) override { return nullptr; }
    virtual ::Effekseer::ModelLoaderRef                                 CreateModelLoader(::Effekseer::FileInterfaceRef fileInterface = nullptr) override { return nullptr; }
    virtual ::Effekseer::MaterialLoaderRef                              CreateMaterialLoader(::Effekseer::FileInterfaceRef fileInterface = nullptr) override { return nullptr; }
    void                                                                ResetRenderState() override;
    ::EffekseerRenderer::DistortingCallback*                            GetDistortingCallback() override;
    void                                                                SetDistortingCallback(::EffekseerRenderer::DistortingCallback* callback) override;
    VertexBuffer*                                                       GetVertexBuffer();
    IndexBuffer*                                                        GetIndexBuffer();
    EffekseerRenderer::StandardRenderer<RendererImplemented, ShaderEx>* GetStandardRenderer();
    ::EffekseerRenderer::RenderStateBase*                               GetRenderState();
    void                                                                SetVertexBuffer(VertexBuffer* vertexBuffer, int32_t size);
    void                                                                SetIndexBuffer(IndexBuffer* indexBuffer);
    void                                                                SetLayout(ShaderEx* shader);
    void                                                                DrawSprites(int32_t spriteCount, int32_t vertexOffset);
    void                                                                DrawModel(Effekseer::ModelRef                model,
                                                                                  std::vector<Effekseer::Matrix44>&  matrixes,
                                                                                  std::vector<Effekseer::RectF>&     uvs,
                                                                                  std::vector<Effekseer::RectF>&     alphaUVs,
                                                                                  std::vector<Effekseer::RectF>&     uvDistortionUVs,
                                                                                  std::vector<Effekseer::RectF>&     blendUVs,
                                                                                  std::vector<Effekseer::RectF>&     blendAlphaUVs,
                                                                                  std::vector<Effekseer::RectF>&     blendUVDistortionUVs,
                                                                                  std::vector<float>&                flipbookIndexAndNextRates,
                                                                                  std::vector<float>&                alphaThresholds,
                                                                                  std::vector<Effekseer::Color>&     colors,
                                                                                  std::vector<int32_t>&              times,
                                                                                  std::vector<std::array<float, 4>>& customData1,
                                                                                  std::vector<std::array<float, 4>>& customData2,
                                                                                  void*                              userData);
    ShaderEx*                                                           GetShader(::EffekseerRenderer::RendererShaderType materialType) const;
    void                                                                BeginShader(ShaderEx* shader);
    void                                                                EndShader(ShaderEx* shader);
    void                                                                SetVertexBufferToShader(const void* data, int32_t size, int32_t dstOffset);
    void                                                                SetPixelBufferToShader(const void* data, int32_t size, int32_t dstOffset);
    void                                                                SetTextures(ShaderEx* shader, Effekseer::Backend::TextureRef* textures, int32_t count);
    std::vector<RenderParameter>&                                       GetRenderParameters() { return renderModelParameters; };
    std::vector<uint8_t>&                                               GetRenderInfoBuffer() { return exportedInfoBuffer; }
    int32_t                                                             GetStrideBufferCount() const;
    StrideBufferParameterEx                                             GetStrideBufferParameter(int32_t index) const;
    virtual int                                                         GetRef() override { return ::Effekseer::ReferenceObject::GetRef(); }
    virtual int                                                         AddRef() override { return ::Effekseer::ReferenceObject::AddRef(); }
    virtual int                                                         Release() override { return ::Effekseer::ReferenceObject::Release(); }
};

}
