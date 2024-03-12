
#include "./common.h"

namespace cce {

std::u16string& UTF8ToUTF16(std::string src) {
    static std::u16string ret;
    ret.resize((src.length() + 1) * 2);

    char* pUTF8Start = (char*)src.data();
    char* pUTF8End   = (char*)(src.data() + src.size());

    char16_t* pUTF16Start = (char16_t*)ret.data();
    char16_t* pUTF16End   = (char16_t*)(ret.data() + ret.size());

    char16_t* pTempUTF16 = pUTF16Start;
    char*     pTempUTF8  = pUTF8Start;

    while (pTempUTF8 < pUTF8End && pTempUTF16 + 1 < pUTF16End) {
        if ((uint8_t)*pTempUTF8 >= 0xE0 && (uint8_t)*pTempUTF8 <= 0xEF) {
            // 0800 - FFFF 1110xxxx 10xxxxxx 10xxxxxx
            *pTempUTF16 |= ((*pTempUTF8++ & 0xEF) << 12);
            *pTempUTF16 |= ((*pTempUTF8++ & 0x3F) << 6);
            *pTempUTF16 |= (*pTempUTF8++ & 0x3F);
        }
        else if ((uint8_t)*pTempUTF8 >= 0xC0 && (uint8_t)*pTempUTF8 <= 0xDF) {
            // 0080 - 07FF 110xxxxx 10xxxxxx
            *pTempUTF16 |= ((*pTempUTF8++ & 0x1F) << 6);
            *pTempUTF16 |= (*pTempUTF8++ & 0x3F);
        }
        else if ((uint8_t)*pTempUTF8 >= 0 && (uint8_t)*pTempUTF8 <= 0x7F) {
            // 0000 - 007F  0xxxxxxx
            *pTempUTF16 = *pTempUTF8++;
        }
        else {
            break;
        }
        pTempUTF16++;
    }
    *pTempUTF16 = 0;

    return ret;
}

#define UTF8_ONE_START (0xOOO1)
#define UTF8_ONE_END (0x007F)
#define UTF8_TWO_START (0x0080)
#define UTF8_TWO_END (0x07FF)
#define UTF8_THREE_START (0x0800)
#define UTF8_THREE_END (0xFFFF)

std::string& UTF16ToUTF8(std::u16string src) {
    static std::string ret;
    ret.resize(src.length());

    char16_t* pUTF16Start = (char16_t*)src.data();
    char16_t* pUTF16End   = (char16_t*)(src.data() + src.size());
    char*     pUTF8Start  = (char*)ret.data();
    char*     pUTF8End    = (char*)(ret.data() + ret.size());

    char16_t* pTempUTF16 = pUTF16Start;
    char*     pTempUTF8  = pUTF8Start;

    while (pTempUTF16 < pUTF16End) {
        if (*pTempUTF16 <= UTF8_ONE_END && pTempUTF8 + 1 <= pUTF8End) {
            // 0000 - 007F  0xxxxxxx
            *pTempUTF8++ = (char)*pTempUTF16;
        }
        else if (*pTempUTF16 >= UTF8_TWO_START && *pTempUTF16 <= UTF8_TWO_END && pTempUTF8 + 2 <= pUTF8End) {
            // 0080 - 07FF 110xxxxx 10xxxxxx
            *pTempUTF8++ = (*pTempUTF16 >> 6) | 0xC0;
            *pTempUTF8++ = (*pTempUTF16 & 0x3F) | 0x80;
        }
        else if (*pTempUTF16 >= UTF8_THREE_START && *pTempUTF16 <= UTF8_THREE_END && pTempUTF8 + 3 <= pUTF8End) {
            // 0800 - FFFF 1110xxxx 10xxxxxx 10xxxxxx
            *pTempUTF8++ = (*pTempUTF16 >> 12) | 0xE0;
            *pTempUTF8++ = ((*pTempUTF16 >> 6) & 0x3F) | 0x80;
            *pTempUTF8++ = (*pTempUTF16 & 0x3F) | 0x80;
        }
        else {
            break;
        }
        pTempUTF16++;
    }
    *pTempUTF8 = 0;

    return ret;
}

}
