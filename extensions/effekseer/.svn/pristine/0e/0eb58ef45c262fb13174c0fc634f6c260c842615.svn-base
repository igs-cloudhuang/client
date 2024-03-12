

#pragma once

#include "./common.h"

#include <map>
#include <memory>
#include <string>

namespace cce {

class MemoryFileReader : public Effekseer::FileReader {
    uint8_t* m_data     = nullptr;
    size_t   m_length   = 0;
    int      m_position = 0;

public:
    MemoryFileReader(uint8_t* data, size_t length);
    size_t Read(void* buffer, size_t size) override;
    void   Seek(int position) override;
    int    GetPosition() const override;
    size_t GetLength() const override;
};

class MemoryFile : public Effekseer::FileInterface {
public:
    std::vector<uint8_t>     m_buffer;
    MemoryFile(); 
    MemoryFile(std::vector<uint8_t>& buffer);
    void                     Reset(std::vector<uint8_t>& buffer);
    Effekseer::FileReaderRef OpenRead(const EFK_CHAR* path) override;
    Effekseer::FileWriterRef OpenWrite(const EFK_CHAR* path) override;
};

}
