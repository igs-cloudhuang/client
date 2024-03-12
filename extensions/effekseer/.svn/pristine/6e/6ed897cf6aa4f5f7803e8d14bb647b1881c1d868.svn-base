
#include "./sound.h"

namespace cce {

Effekseer::SoundDataRef SoundLoader::Load(const EFK_CHAR* path) {
    std::string src = UTF16ToUTF8(path);

    Effekseer::SoundDataRef generated;
    if (m_id2sound.find(src) != m_id2sound.end()) {
        return m_id2sound[src];
    }

    auto nativePtr = m_load(src);
    auto data      = Effekseer::MakeRefPtr<SoundData>(nativePtr);

    m_id2sound.insert(std::make_pair(src, data));
    m_sound2id.insert(std::make_pair(data, src));

    return data;
}

void SoundLoader::Unload(Effekseer::SoundDataRef source) {
    if (source == nullptr) {
        return;
    }

    auto itr = m_sound2id.find(source);
    if (itr != m_sound2id.end()) {
        m_unload(itr->second, 0);
        m_id2sound.erase(itr->second);
        m_sound2id.erase(itr->first);
    }
}

Effekseer::SoundLoaderRef SoundLoader::Create(SoundLoaderLoad load, SoundLoaderUnload unload) {
    return Effekseer::MakeRefPtr<SoundLoader>(load, unload);
}

Effekseer::SoundPlayerRef SoundPlayer::Create(SoundPlayerPlay            play,
                                              SoundPlayerStopTag         stopTag,
                                              SoundPlayerPauseTag        pauseTag,
                                              SoundPlayerCheckPlayingTag checkPlayingTag,
                                              SoundPlayerStopAll         stopAll) {
    return Effekseer::MakeRefPtr<SoundPlayer>(play, stopTag, pauseTag, checkPlayingTag, stopAll);
}

}