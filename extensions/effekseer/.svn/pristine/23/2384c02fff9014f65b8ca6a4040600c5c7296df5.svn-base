
#pragma once

#include "./common.h"

namespace cce {

// return hanle
using TextureLoaderLoad = std::function<void(int32_t, std::string src)>;
// id = [resource path hash], handle
using TextureLoaderUnload = std::function<void(std::string src, int32_t hanle)>;

class Texture : public Effekseer::Backend::Texture {
public:
    Texture(int32_t userData)
    : InternalPtr(userData) {}
    virtual ~Texture()   = default;
    int32_t InternalPtr = 0;
};

class TextureLoader : public Effekseer::TextureLoader {
protected:
    TextureLoaderLoad                            m_load;
    TextureLoaderUnload                          m_unload;
    std::map<std::string, Effekseer::TextureRef> m_id2texture;
    std::map<Effekseer::TextureRef, std::string> m_texturel2id;

public:
    TextureLoader(TextureLoaderLoad load, TextureLoaderUnload unload)
    : m_load(load)
    , m_unload(unload) {
    }
    virtual ~TextureLoader() override = default;
    virtual Effekseer::TextureRef Load(const EFK_CHAR* path, Effekseer::TextureType textureType) override;
    virtual void                  Unload(Effekseer::TextureRef source) override;
};

}
