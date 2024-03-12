
#pragma once

#include "./common.h"
#include "./material.h"
#include "./vfile.h"

namespace cce {

using CurveLoaderLoad   = std::function<std::vector<uint8_t>(std::string src)>;
using CurveLoaderUnload = std::function<void(std::string src, uint32_t handle)>;

class CurveLoader : public Effekseer::CurveLoader {
    CurveLoaderLoad                            m_load;
    CurveLoaderUnload                          m_unload;
    Effekseer::RefPtr<MemoryFile>              m_file;
    Effekseer::RefPtr<Effekseer::CurveLoader>  m_loader;
    std::map<std::string, Effekseer::CurveRef> m_id2curve;
    std::map<Effekseer::CurveRef, std::string> m_curve2id;

public:
    CurveLoader(CurveLoaderLoad load, CurveLoaderUnload unload);
    virtual ~CurveLoader() = default;
    virtual Effekseer::CurveRef Load(const char16_t* path) override;
    virtual void                Unload(Effekseer::CurveRef source) override;
};

}
