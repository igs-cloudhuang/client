import * as $protobuf from "protobufjs";
/** Namespace levelProto. */
export namespace levelProto {

    /** Error enum. */
    enum Error {
        success = 0,
        failed = 1,
        unknow = 999
    }

    /** Properties of a LevelServiceReq. */
    interface ILevelServiceReq {

        /** LevelServiceReq accountID */
        accountID?: (number|null);
    }

    /** Represents a LevelServiceReq. */
    class LevelServiceReq implements ILevelServiceReq {

        /**
         * Constructs a new LevelServiceReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: levelProto.ILevelServiceReq);

        /** LevelServiceReq accountID. */
        public accountID: number;

        /**
         * Creates a new LevelServiceReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LevelServiceReq instance
         */
        public static create(properties?: levelProto.ILevelServiceReq): levelProto.LevelServiceReq;

        /**
         * Encodes the specified LevelServiceReq message. Does not implicitly {@link levelProto.LevelServiceReq.verify|verify} messages.
         * @param message LevelServiceReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: levelProto.ILevelServiceReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LevelServiceReq message, length delimited. Does not implicitly {@link levelProto.LevelServiceReq.verify|verify} messages.
         * @param message LevelServiceReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: levelProto.ILevelServiceReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LevelServiceReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LevelServiceReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): levelProto.LevelServiceReq;

        /**
         * Decodes a LevelServiceReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LevelServiceReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): levelProto.LevelServiceReq;

        /**
         * Verifies a LevelServiceReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LevelServiceReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LevelServiceReq
         */
        public static fromObject(object: { [k: string]: any }): levelProto.LevelServiceReq;

        /**
         * Creates a plain object from a LevelServiceReq message. Also converts values to other types if specified.
         * @param message LevelServiceReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: levelProto.LevelServiceReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LevelServiceReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LevelServiceResp. */
    interface ILevelServiceResp {

        /** LevelServiceResp level */
        level?: (number|null);

        /** LevelServiceResp exp */
        exp?: (number|null);

        /** LevelServiceResp nextExp */
        nextExp?: (number|null);

        /** LevelServiceResp nextReward */
        nextReward?: (levelProto.IRewardData[]|null);

        /** LevelServiceResp reward */
        reward?: (levelProto.IRewardData[]|null);

        /** LevelServiceResp error */
        error?: (levelProto.Error|null);

        /** LevelServiceResp betOpen */
        betOpen?: (number|null);
    }

    /** Represents a LevelServiceResp. */
    class LevelServiceResp implements ILevelServiceResp {

        /**
         * Constructs a new LevelServiceResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: levelProto.ILevelServiceResp);

        /** LevelServiceResp level. */
        public level: number;

        /** LevelServiceResp exp. */
        public exp: number;

        /** LevelServiceResp nextExp. */
        public nextExp: number;

        /** LevelServiceResp nextReward. */
        public nextReward: levelProto.IRewardData[];

        /** LevelServiceResp reward. */
        public reward: levelProto.IRewardData[];

        /** LevelServiceResp error. */
        public error: levelProto.Error;

        /** LevelServiceResp betOpen. */
        public betOpen: number;

        /**
         * Creates a new LevelServiceResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LevelServiceResp instance
         */
        public static create(properties?: levelProto.ILevelServiceResp): levelProto.LevelServiceResp;

        /**
         * Encodes the specified LevelServiceResp message. Does not implicitly {@link levelProto.LevelServiceResp.verify|verify} messages.
         * @param message LevelServiceResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: levelProto.ILevelServiceResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LevelServiceResp message, length delimited. Does not implicitly {@link levelProto.LevelServiceResp.verify|verify} messages.
         * @param message LevelServiceResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: levelProto.ILevelServiceResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LevelServiceResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LevelServiceResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): levelProto.LevelServiceResp;

        /**
         * Decodes a LevelServiceResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LevelServiceResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): levelProto.LevelServiceResp;

        /**
         * Verifies a LevelServiceResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LevelServiceResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LevelServiceResp
         */
        public static fromObject(object: { [k: string]: any }): levelProto.LevelServiceResp;

        /**
         * Creates a plain object from a LevelServiceResp message. Also converts values to other types if specified.
         * @param message LevelServiceResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: levelProto.LevelServiceResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LevelServiceResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RewardData. */
    interface IRewardData {

        /** RewardData amount */
        amount?: (number|null);

        /** RewardData betOpen */
        betOpen?: (number|null);

        /** RewardData newGame */
        newGame?: (number|null);

        /** RewardData origin */
        origin?: (number|null);

        /** RewardData newGames */
        newGames?: (number[]|null);

        /** RewardData unlock */
        unlock?: (number[]|null);

        /** RewardData vipExp */
        vipExp?: (number|null);

        /** RewardData ruby */
        ruby?: (number|null);

        /** RewardData itemID */
        itemID?: (number|null);

        /** RewardData ItemCount */
        ItemCount?: (number|null);

        /** RewardData buffID */
        buffID?: (number|Long|null);

        /** RewardData buffCount */
        buffCount?: (number|null);

        /** RewardData cardBookID */
        cardBookID?: (number|null);

        /** RewardData cardBookCount */
        cardBookCount?: (number|null);

        /** RewardData show */
        show?: (number|null);
    }

    /** Represents a RewardData. */
    class RewardData implements IRewardData {

        /**
         * Constructs a new RewardData.
         * @param [properties] Properties to set
         */
        constructor(properties?: levelProto.IRewardData);

        /** RewardData amount. */
        public amount: number;

        /** RewardData betOpen. */
        public betOpen: number;

        /** RewardData newGame. */
        public newGame: number;

        /** RewardData origin. */
        public origin: number;

        /** RewardData newGames. */
        public newGames: number[];

        /** RewardData unlock. */
        public unlock: number[];

        /** RewardData vipExp. */
        public vipExp: number;

        /** RewardData ruby. */
        public ruby: number;

        /** RewardData itemID. */
        public itemID: number;

        /** RewardData ItemCount. */
        public ItemCount: number;

        /** RewardData buffID. */
        public buffID: (number|Long);

        /** RewardData buffCount. */
        public buffCount: number;

        /** RewardData cardBookID. */
        public cardBookID: number;

        /** RewardData cardBookCount. */
        public cardBookCount: number;

        /** RewardData show. */
        public show: number;

        /**
         * Creates a new RewardData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RewardData instance
         */
        public static create(properties?: levelProto.IRewardData): levelProto.RewardData;

        /**
         * Encodes the specified RewardData message. Does not implicitly {@link levelProto.RewardData.verify|verify} messages.
         * @param message RewardData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: levelProto.IRewardData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RewardData message, length delimited. Does not implicitly {@link levelProto.RewardData.verify|verify} messages.
         * @param message RewardData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: levelProto.IRewardData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RewardData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RewardData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): levelProto.RewardData;

        /**
         * Decodes a RewardData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RewardData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): levelProto.RewardData;

        /**
         * Verifies a RewardData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RewardData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RewardData
         */
        public static fromObject(object: { [k: string]: any }): levelProto.RewardData;

        /**
         * Creates a plain object from a RewardData message. Also converts values to other types if specified.
         * @param message RewardData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: levelProto.RewardData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RewardData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
