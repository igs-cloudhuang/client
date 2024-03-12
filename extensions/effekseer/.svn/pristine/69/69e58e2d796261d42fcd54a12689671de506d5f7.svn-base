
#include "./curve.h"

namespace cce {
CurveLoader::CurveLoader(CurveLoaderLoad load, CurveLoaderUnload unload)
: m_load(load)
, m_unload(unload) {
    m_file   = Effekseer::MakeRefPtr<MemoryFile>(std::vector<uint8_t>(1 * 1024 * 1024));
    m_loader = Effekseer::MakeRefPtr<Effekseer::CurveLoader>(m_file);
}

Effekseer::CurveRef CurveLoader::Load(const EFK_CHAR* path) {
    std::string src = UTF16ToUTF8(path);

    Effekseer::CurveRef generated;
    if (m_id2curve.find(src) != m_id2curve.end()) {
        return m_id2curve[src];
    }

    auto data = m_load(src);
    m_file->Reset(data);
    auto curve = m_loader->Load(path);

    m_id2curve.insert(std::make_pair(src, curve));
    m_curve2id.insert(std::make_pair(curve, src));

    return curve;
}

void CurveLoader::Unload(Effekseer::CurveRef source) {
    if (source == nullptr) {
        return;
    }
    auto itr = m_curve2id.find(source);
    if (itr != m_curve2id.end()) {
        m_unload(itr->second, 0);
        m_id2curve.erase(itr->second);
        m_curve2id.erase(itr->first);
    }
}
}