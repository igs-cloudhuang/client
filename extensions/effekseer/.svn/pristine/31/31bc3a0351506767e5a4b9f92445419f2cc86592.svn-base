project(EffekseerRendererCommon)
cmake_minimum_required(VERSION 3.1)

if(BUILD_UNITYPLUGIN)
    add_library(EffekseerRendererCommon INTERFACE)
endif()

# Setup source codes

set(PublicHeader
    EffekseerRenderer.Renderer.h
    EffekseerRenderer.VertexBufferBase.h
    EffekseerRenderer.IndexBufferBase.h
    EffekseerRenderer.RenderStateBase.h

    EffekseerRenderer.ModelRendererBase.h
    EffekseerRenderer.RibbonRendererBase.h
    EffekseerRenderer.RingRendererBase.h
    EffekseerRenderer.SpriteRendererBase.h
    EffekseerRenderer.StandardRenderer.h
    EffekseerRenderer.TrackRendererBase.h
    EffekseerRenderer.CommonUtils.h
    EffekseerRenderer.ShaderBase.h
    EffekseerRenderer.Renderer_Impl.h
)

file(GLOB_RECURSE LOCAL_SOURCES *.cpp)
add_library(EffekseerRendererCommon STATIC ${LOCAL_SOURCES})
target_include_directories(EffekseerRendererCommon PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../Effekseer ${EFK_THIRDPARTY_INCLUDES})
target_link_libraries(EffekseerRendererCommon PUBLIC Effekseer)
