
#include "./texture.h"
#include <unordered_map>

namespace cce {

Effekseer::TextureRef TextureLoader::Load(const EFK_CHAR* path, Effekseer::TextureType textureType) {
    std::string src = UTF16ToUTF8(path);
    int32_t hash_key = std::hash<std::string>{}(src);

    Effekseer::TextureRef generated;
    if (m_id2texture.find(src) != m_id2texture.end()) {
        // a empty call for right slot order
        m_load(hash_key, src);
        return m_id2texture[src];
    }

    m_load(hash_key, src);
    auto backend = Effekseer::MakeRefPtr<Texture>(hash_key);

    auto texture = Effekseer::MakeRefPtr<Effekseer::Texture>();
    texture->SetBackend(backend);

    m_id2texture.insert(std::make_pair(src, texture));
    m_texturel2id.insert(std::make_pair(texture, src));

    return texture;
}

void TextureLoader::Unload(Effekseer::TextureRef source) {
    if (source == nullptr) {
        return;
    }

    auto itr = m_texturel2id.find(source);
    if (itr != m_texturel2id.end()) {
        m_unload(itr->second, ((Texture*)itr->first->GetBackend().Get())->InternalPtr);
        m_id2texture.erase(itr->second);
        m_texturel2id.erase(itr->first);
    }
}

}
