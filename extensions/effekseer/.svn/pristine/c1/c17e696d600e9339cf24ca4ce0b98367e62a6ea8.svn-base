
#pragma once

#include "./common.h"
#include "./vfile.h"

namespace cce {

using SoundTag    = Effekseer::SoundTag;
using SoundHandle = Effekseer::SoundHandle;

using SoundLoaderLoad   = std::function<uint32_t(std::string src)>;
using SoundLoaderUnload = std::function<void(std::string src, int32_t handle)>;

class SoundData : public Effekseer::SoundData {
public:
    SoundData(uint32_t userData)
    : UserData(userData) {}
    virtual ~SoundData() = default;
    uint32_t UserData    = 0;
};

class SoundLoader : public Effekseer::SoundLoader {
    SoundLoaderLoad                                m_load;
    SoundLoaderUnload                              m_unload;
    std::map<std::string, Effekseer::SoundDataRef> m_id2sound;
    std::map<Effekseer::SoundDataRef, std::string> m_sound2id;

public:
    static Effekseer::SoundLoaderRef Create(SoundLoaderLoad load, SoundLoaderUnload unload);
    SoundLoader(SoundLoaderLoad load, SoundLoaderUnload unload)
    : m_load(load)
    , m_unload(unload) {
    }
    virtual ~SoundLoader() override = default;
    virtual Effekseer::SoundDataRef Load(const EFK_CHAR* path) override;
    virtual void                    Unload(Effekseer::SoundDataRef source) override;
};

using SoundPlayerPlay            = std::function<void(SoundTag tag, uint32_t Data, float Volume, float Pan, float Pitch, bool Mode3D, float x, float y, float z, float Distance)>;
using SoundPlayerStopTag         = std::function<void(SoundTag tag)>;
using SoundPlayerPauseTag        = std::function<void(SoundTag tag, bool pause)>;
using SoundPlayerCheckPlayingTag = std::function<bool(SoundTag tag)>;
using SoundPlayerStopAll         = std::function<void()>;

class SoundPlayer : public Effekseer::SoundPlayer {
    SoundPlayerPlay            play;
    SoundPlayerStopTag         stopTag;
    SoundPlayerPauseTag        pauseTag;
    SoundPlayerCheckPlayingTag checkPlayingTag;
    SoundPlayerStopAll         stopAll;

public:
    static Effekseer::SoundPlayerRef Create(SoundPlayerPlay            play,
                                            SoundPlayerStopTag         stopTag,
                                            SoundPlayerPauseTag        pauseTag,
                                            SoundPlayerCheckPlayingTag checkPlayingTag,
                                            SoundPlayerStopAll         stopAll);
    SoundPlayer(SoundPlayerPlay            play,
                SoundPlayerStopTag         stopTag,
                SoundPlayerPauseTag        pauseTag,
                SoundPlayerCheckPlayingTag checkPlayingTag,
                SoundPlayerStopAll         stopAll)
    : play(play)
    , stopTag(stopTag)
    , pauseTag(pauseTag)
    , checkPlayingTag(checkPlayingTag)
    , stopAll(stopAll) {
    }
    virtual ~SoundPlayer() {}
    virtual SoundHandle Play(SoundTag tag, const InstanceParameter& parameter) {
        auto sd = reinterpret_cast<SoundData*>(parameter.Data.Get());

        play(tag,
             (uintptr_t)sd->UserData,
             parameter.Volume,
             parameter.Pan,
             parameter.Pitch,
             parameter.Mode3D,
             parameter.Position.X,
             parameter.Position.Y,
             parameter.Position.Z,
             parameter.Distance);
        return 0;
    }
    virtual void Stop(SoundHandle handle, SoundTag tag) {}
    virtual void Pause(SoundHandle handle, SoundTag tag, bool pause) {}
    virtual bool CheckPlaying(SoundHandle handle, SoundTag tag) { return false; }
    virtual void StopTag(SoundTag tag) { stopTag(tag); }
    virtual void PauseTag(SoundTag tag, bool pause) { pauseTag(tag, pause); }
    virtual bool CheckPlayingTag(SoundTag tag) { return checkPlayingTag(tag); }
    virtual void StopAll() { stopAll(); }
};

}
