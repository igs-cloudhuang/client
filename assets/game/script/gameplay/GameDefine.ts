// ----------------------------------------------------------------
// Enumerations
// ----------------------------------------------------------------

/**
 * 砲衣編號 (除了 1 - 3 等級的預設砲衣外)
 */
export enum AvatarNo {
    Normal_Lv1 = 0,
    Normal_Lv2 = 1,
    Normal_Lv3 = 2,
    Hummer = 3,         // 鎖定用砲台(用不到，保留編號)
    Torpedo = 4,        // 魚雷用砲台
    Multi = 5,          // 多管
    Missile = 6,        // 導彈留存砲
}

/**
 * 子彈編號 (除了 1 - 3 等級的預設子彈外)
 */
export enum BulletNo {
    Normal_Lv1 = 0,
    Normal_Lv2 = 1,
    Normal_Lv3 = 2,
    Hummer = 3,         // 鎖定用子彈(用不到，保留編號)
    Torpedo = 4,        // 魚雷用砲台
    Multi = 5,          // 多管
    Missile = 6,        // 導彈留存砲
}

/**
 * CoinAdd Prefab 編號
 */
export enum CoinAddNo {
    Normal = 0,
    Reverse = 1,
}

/**
 * Effect Prefab 編號
 */
export enum EffectNo {

    Meteorite = 1,                // 流星本體
    MeteoriteRain = 2,            // 流星雨背景
    TowerGone = 3,                // 塔消失

    CallTowerLight = 5,           // 召喚特效
    ChangeLight = 6,              // 放棄特效
    TowerShattered = 7,           // 塔碎裂受擊(死亡時)
    TowerShattered_Wood = 8,      // 木塔碎裂受擊(死亡時)
    Fall = 9,                     // 落地
    MoveSmoke = 10,               // 地板移動煙
    TowerBlastMagicG = 11,        // 魔法塔(G)碎裂受擊(死亡時)
    TowerBlastMagicR = 12,        // 魔法塔(R)碎裂受擊(死亡時)
    TowerBlastCoin = 13,          // 金幣塔碎裂受擊
    TowerBlastGolden = 14,        // 金塔碎裂受擊(死亡時)

    MonsterIn = 18,               // 寶藏庫石板登場
    TreasureIn = 19,              // 藏寶庫開門特效
    MagicBoxOpen = 20,            // 寶箱塔特效集
    Soul = 21,                    // 寶藏庫的魂
    HitFire = 22,                 // 大砲著火

    BrokenBlackGoldenS = 28,      // 黑金塔受擊特效 (小)
    BrokenBlackGoldenXL = 29,     // 黑金塔受擊特效 (大)
    BrokenGoldenS = 30,           // 金塔受擊特效 (小)
    BrokenGoldenXL = 31,          // 金塔受擊特效 (大)
    BrokenMagicGS = 32,           // 魔法塔(G)受擊特效 (小)
    BrokenMagicGXL = 33,          // 魔法塔(G)受擊特效 (大)
    BrokenMagicRS = 34,           // 魔法塔(R)受擊特效 (小)
    BrokenMagicRXL = 35,          // 魔法塔(R)受擊特效 (大)
    BrokenRockS = 36,             // 石塔受擊特效 (小)
    BrokenRockXL = 37,            // 石塔受擊特效 (大)
    BrokenWoodS = 38,             // 木塔受擊特效 (小)
    BrokenWoodXL = 39,            // 木塔受擊特效 (大)
    CannonSpark = 40,             // 大砲火花
    MeteoriteRain2 = 41,          // 流星雨背景 (小)
    FireSoul = 42,                // 紅魔女的魂
    Soul_Bowm = 43,               // 寶藏庫的魂命中
    OpenGem = 44,                 // treasure hitted
    ShotgunSpark = 45,            // Shotgun 砲火花
    Soul_in = 46,                 // 寶藏庫的魂
    Soul_BowmR = 47,              // 寶藏庫的魂命中

    FireBall02 = 49,              // 大砲特效
    MissileFire = 50,             // 導彈尾煙

    TowerShattered_Wood2 = 51,    // 木塔碎裂受擊
    IceDead = 52,                 // 冰龍死去
    TowerShattered2 = 53,         // 塔碎裂受擊
    TowerBlastGolden2 = 54,       // 金塔碎裂受擊
    TowerBlastMagicR2 = 55,       // 魔法塔(R)碎裂受擊
    TowerBlastMagicG2 = 56,       // 魔法塔(G)碎裂受擊
}

/**
 * Other Prefab 編號
 */
export enum OtherNo {
    BonusTitle = 0,            // 藏寶庫進場提示
    BonusEnergy = 1,           // 藏寶庫加局數
}

/**
 * 魚種編號
 */
export enum FishNo {
    None = 0,                  // 無
    ArcherGoblin = 1,          // 弓箭手哥布林
    SwordMan = 2,              // 劍士
    Viking = 3,                // 維京人
    ArmorSoldier = 4,          // 盔甲士兵
    Knight = 5,                // 騎士
    ArmorFighter = 6,          // 鐵甲戰士
    GoldenKnight = 7,          // 黃金騎士
    WheelChest = 8,            // 轉盤塔
    RedWitch = 9,              // 紅魔女
    TreasureChest = 10,        // 寶箱
    Queen = 11,                // 皇后
    King = 12,                 // 國王
    KnightEx = 13,             // 藏寶庫-騎士Ex
    ArmorFighterEx = 14,       // 藏寶庫-鐵甲戰士Ex
    GoldenKnightEx = 15,       // 藏寶庫-黃金騎士Ex
    QueenEx = 16,              // 藏寶庫-皇后Ex
    KingEx = 17,               // 藏寶庫-國王Ex

    RedWitchEz = 21,           // 紅魔女 (新手)
    TreasureChestEz = 22,      // 寶箱 (新手)
    QueenEz = 23,              // 皇后 (新手)
    KingEz = 24,               // 國王 (新手)
    TreasureChestEz2 = 25,     // 寶箱 (新手)
}

/**
 * 魚種分類 (用於 FishSpecialShow、FishSetting 中)
 */
export enum FishKind {
    None = 0,              // 無
    ArcherGoblin = 1,      // 弓箭手哥布林
    SwordMan = 2,          // 劍士
    Viking = 3,            // 維京人
    ArmorSoldier = 4,      // 盔甲士兵
    Knight = 5,            // 騎士
    ArmorFighter = 6,      // 鐵甲戰士
    GoldenKnight = 7,      // 黃金騎士
    WheelChest = 8,        // 轉盤塔
    RedWitch = 9,          // 紅魔女
    TreasureChest = 10,    // 寶箱
    Queen = 11,            // 皇后
    King = 12,             // 國王
}

/**
 * 獎圈
 */
export enum FishMedal {
    None = 0,           // 無
    Medal_1 = 1,        // 一般魚獎圈
    RedWitch = 2,       // 紅魔女
    MoreOdds = 4,       // 更高倍率
    Bonus = 6,          // Bonus結算
    Medal_2 = 7,        // 簡約結果獎圈
}

export enum SceneEvent {
    Treasure = 3,       // 藏寶庫
    MAX = 5,
}

// ----------------------------------------------------------------
// GameData Functions
// ----------------------------------------------------------------

/**
 * Sound Music 編號
 */
export enum MusicName {
    bgm1 = 'bgm1',
    bgm2 = 'bgm2',
    bgm3 = 'bgm3',
    bgm4 = 'bgm4',
    bgm5 = 'bgm5',
    bgm5_1 = 'bgm5_1',
    bgm6 = 'bgm6',
}

/**
 * Sound Effect 編號
 */
export enum SoundName {
    button01 = 'button01',
    tower1_hit = 'tower1_hit',
    tower2_hit = 'tower2_hit',
    tower3_hit = 'tower3_hit',
    tower4_hit = 'tower4_hit',
    tower1_blow = 'tower1_blow',
    tower2_blow = 'tower2_blow',
    tower3_blow = 'tower3_blow',
    tower4_blow = 'tower4_blow',
    tower5_blow = 'tower5_blow',
    tower06_hit = 'tower06_hit',
    tower06_blow1 = 'tower06_blow1',
    tower06_blow2 = 'tower06_blow2',
    tower06_blow3 = 'tower06_blow3',
    pig_01 = 'pig_01',
    pig_02 = 'pig_02',
    pig_03 = 'pig_03',
    pig_04 = 'pig_04',
    gem01 = 'gem01',
    chest01 = 'chest01',
    M_01 = 'M_01',
    M_02 = 'M_02',
    M_03 = 'M_03',
    M_04 = 'M_04',
    M_05 = 'M_05',
    M_06 = 'M_06',
    M_07 = 'M_07',
    M_08 = 'M_08',
    M_09 = 'M_09',
    M_10 = 'M_10',
    M_11 = 'M_11',
    M_12 = 'M_12',
    I_01 = 'I_01',
    I_02 = 'I_02',
    Treasure01 = 'Treasure01',
    Treasure02 = 'Treasure02',
    Treasure03 = 'Treasure03',
    Treasure04 = 'Treasure04',
    Treasure05 = 'Treasure05',
    Treasure06 = 'Treasure06',
    Treasure07 = 'Treasure07',
    Treasure08 = 'Treasure08',
    Treasure09 = 'Treasure09',
    Treasure10 = 'Treasure10',
    Treasure11 = 'Treasure11',
    Treasure12 = 'Treasure12',
    Treasure13 = 'Treasure13',
    ICE_01 = 'ICE_01',
    ICE_05 = 'ICE_05',
    ICE_06 = 'ICE_06',
    ICE_07 = 'ICE_07',
    ICE_08 = 'ICE_08',
    ICE_09 = 'ICE_09',
    ICE_10 = 'ICE_10',
    ICE_11 = 'ICE_11',
    ICE_15 = 'ICE_15',
    Bomb_01 = 'Bomb_01',
    Fire_01 = 'Fire_01',
    Fire_04 = 'Fire_04',
    Fire_05 = 'Fire_05',
    Fire_06 = 'Fire_06',
    flash = 'flash',
    gem02 = 'gem02',
    coin_02 = 'coin_02',
    dragon_wing = 'dragon_wing',
    gem03 = 'gem03',
    ICE_17 = 'ICE_17',
    chest02 = 'chest02',
    missile_01 = 'missile_01',
    missile_02 = 'missile_02',
}
