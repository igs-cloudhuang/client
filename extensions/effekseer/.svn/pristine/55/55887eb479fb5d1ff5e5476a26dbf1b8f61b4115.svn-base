
#include "./vfile.h"

namespace cce {

MemoryFileReader::MemoryFileReader(uint8_t* data, size_t length)
: m_data(data)
, m_length(length)
, m_position(0) {}

size_t MemoryFileReader::Read(void* buffer, size_t size) {
    if (size >= m_length - m_position) {
        size = m_length - m_position;
    }
    memcpy(buffer, &m_data[m_position], size);
    m_position += static_cast<int32_t>(size);
    return size;
}

void MemoryFileReader::Seek(int position) {
    this->m_position = position;
}

int MemoryFileReader::GetPosition() const {
    return m_position;
}

size_t MemoryFileReader::GetLength() const {
    return m_length;
}

MemoryFile::MemoryFile() {
}

MemoryFile::MemoryFile(std::vector<uint8_t>& buffer) {
    m_buffer = buffer;
}

void MemoryFile::Reset(std::vector<uint8_t>& buffer) {
    m_buffer = buffer;
}

Effekseer::FileReaderRef MemoryFile::OpenRead(const EFK_CHAR* path) {
    return Effekseer::MakeRefPtr<MemoryFileReader>(m_buffer.data(), m_buffer.size());
}

Effekseer::FileWriterRef MemoryFile::OpenWrite(const EFK_CHAR* path) {
    return nullptr;
}

}