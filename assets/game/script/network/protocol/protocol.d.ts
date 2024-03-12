import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace protocol. */
export namespace protocol {

    /** UserToServer enum. */
    enum UserToServer {
        U2S_NONE = 0,
        U2S_INFO_REQ = 21,
        U2S_HIT_REQ = 22,
        U2S_GIVEUP_REQ = 23,
        U2S_DAMAGED_REQ = 24,
        U2S_ENERGY_REQ = 25,
        U2S_JACKOPT_HISTORY = 26,
        U2S_JACKPOT_REQ = 27,
        U2S_LEADERBORAD = 30
    }

    /** ServerToUser enum. */
    enum ServerToUser {
        S2U_NONE = 0,
        S2U_INFO_ACK = 21,
        S2U_HIT_ACK = 22,
        S2U_GIVEUP_ACK = 23,
        S2U_ENERGY_ACK = 25,
        S2U_JACKOPT_HISTORY = 26,
        S2U_JACKPOT_ACK = 27,
        S2U_LEADERBORAD = 30,
        S2U_BROADCAST = 60
    }

    /** HitResult enum. */
    enum HitResult {
        HR_FAILED = 0,
        HR_SUCCESS = 1,
        HR_FISH_ALREADY_DEAD = 2
    }

    /** BulletType enum. */
    enum BulletType {
        Normal = 0,
        Cannon = 1,
        Energy = 23
    }

    /** Properties of a Fish. */
    interface IFish {

        /** Fish no */
        no?: (number|null);

        /** Fish index */
        index?: (number|null);
    }

    /** Represents a Fish. */
    class Fish implements IFish {

        /**
         * Constructs a new Fish.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IFish);

        /** Fish no. */
        public no: number;

        /** Fish index. */
        public index: number;

        /**
         * Creates a new Fish instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Fish instance
         */
        public static create(properties?: protocol.IFish): protocol.Fish;

        /**
         * Encodes the specified Fish message. Does not implicitly {@link protocol.Fish.verify|verify} messages.
         * @param message Fish message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IFish, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Fish message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Fish
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.Fish;

        /**
         * Gets the default type url for Fish
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an InfoAck. */
    interface IInfoAck {

        /** InfoAck plate */
        plate?: (protocol.IFish[]|null);

        /** InfoAck energy */
        energy?: (number|null);

        /** InfoAck wagers */
        wagers?: (Long|null);
    }

    /** Represents an InfoAck. */
    class InfoAck implements IInfoAck {

        /**
         * Constructs a new InfoAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IInfoAck);

        /** InfoAck plate. */
        public plate: protocol.IFish[];

        /** InfoAck energy. */
        public energy: number;

        /** InfoAck wagers. */
        public wagers: Long;

        /**
         * Creates a new InfoAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InfoAck instance
         */
        public static create(properties?: protocol.IInfoAck): protocol.InfoAck;

        /**
         * Encodes the specified InfoAck message. Does not implicitly {@link protocol.InfoAck.verify|verify} messages.
         * @param message InfoAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IInfoAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InfoAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InfoAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.InfoAck;

        /**
         * Gets the default type url for InfoAck
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HitReqData. */
    interface IHitReqData {

        /** HitReqData bulletId */
        bulletId?: (number|null);

        /** HitReqData index */
        index?: (number[]|null);

        /** HitReqData bet */
        bet?: (number|null);

        /** HitReqData type */
        type?: (protocol.BulletType|null);
    }

    /** Represents a HitReqData. */
    class HitReqData implements IHitReqData {

        /**
         * Constructs a new HitReqData.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IHitReqData);

        /** HitReqData bulletId. */
        public bulletId: number;

        /** HitReqData index. */
        public index: number[];

        /** HitReqData bet. */
        public bet: number;

        /** HitReqData type. */
        public type: protocol.BulletType;

        /**
         * Creates a new HitReqData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HitReqData instance
         */
        public static create(properties?: protocol.IHitReqData): protocol.HitReqData;

        /**
         * Encodes the specified HitReqData message. Does not implicitly {@link protocol.HitReqData.verify|verify} messages.
         * @param message HitReqData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IHitReqData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HitReqData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HitReqData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.HitReqData;

        /**
         * Gets the default type url for HitReqData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HitAckData. */
    interface IHitAckData {

        /** HitAckData result */
        result?: (protocol.HitResult|null);

        /** HitAckData bet */
        bet?: (number|null);

        /** HitAckData coin */
        coin?: (number|null);

        /** HitAckData bulletId */
        bulletId?: (number|null);

        /** HitAckData plate */
        plate?: (protocol.IFish[]|null);

        /** HitAckData type */
        type?: (protocol.BulletType|null);

        /** HitAckData remain */
        remain?: (number|null);

        /** HitAckData remove */
        remove?: (protocol.HitAckData.IRemove[]|null);
    }

    /** Represents a HitAckData. */
    class HitAckData implements IHitAckData {

        /**
         * Constructs a new HitAckData.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IHitAckData);

        /** HitAckData result. */
        public result: protocol.HitResult;

        /** HitAckData bet. */
        public bet: number;

        /** HitAckData coin. */
        public coin: number;

        /** HitAckData bulletId. */
        public bulletId: number;

        /** HitAckData plate. */
        public plate: protocol.IFish[];

        /** HitAckData type. */
        public type: protocol.BulletType;

        /** HitAckData remain. */
        public remain: number;

        /** HitAckData remove. */
        public remove: protocol.HitAckData.IRemove[];

        /**
         * Creates a new HitAckData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HitAckData instance
         */
        public static create(properties?: protocol.IHitAckData): protocol.HitAckData;

        /**
         * Encodes the specified HitAckData message. Does not implicitly {@link protocol.HitAckData.verify|verify} messages.
         * @param message HitAckData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IHitAckData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HitAckData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HitAckData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.HitAckData;

        /**
         * Gets the default type url for HitAckData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace HitAckData {

        /** Properties of a Remove. */
        interface IRemove {

            /** Remove idx */
            idx?: (number|null);

            /** Remove coin */
            coin?: (number|null);

            /** Remove alive */
            alive?: (boolean|null);

            /** Remove meta */
            meta?: (google.protobuf.IAny|null);

            /** Remove jackpot */
            jackpot?: (protocol.IJackpot|null);

            /** Remove bonus */
            bonus?: (protocol.HitAckData.Remove.IBonus|null);
        }

        /** Represents a Remove. */
        class Remove implements IRemove {

            /**
             * Constructs a new Remove.
             * @param [properties] Properties to set
             */
            constructor(properties?: protocol.HitAckData.IRemove);

            /** Remove idx. */
            public idx: number;

            /** Remove coin. */
            public coin: number;

            /** Remove alive. */
            public alive: boolean;

            /** Remove meta. */
            public meta?: (google.protobuf.IAny|null);

            /** Remove jackpot. */
            public jackpot?: (protocol.IJackpot|null);

            /** Remove bonus. */
            public bonus?: (protocol.HitAckData.Remove.IBonus|null);

            /**
             * Creates a new Remove instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Remove instance
             */
            public static create(properties?: protocol.HitAckData.IRemove): protocol.HitAckData.Remove;

            /**
             * Encodes the specified Remove message. Does not implicitly {@link protocol.HitAckData.Remove.verify|verify} messages.
             * @param message Remove message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: protocol.HitAckData.IRemove, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Remove message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Remove
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.HitAckData.Remove;

            /**
             * Gets the default type url for Remove
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Remove {

            /** Properties of a Bonus. */
            interface IBonus {

                /** Bonus coin */
                coin?: (number|null);

                /** Bonus treasures */
                treasures?: (protocol.ITreasures|null);
            }

            /** Represents a Bonus. */
            class Bonus implements IBonus {

                /**
                 * Constructs a new Bonus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: protocol.HitAckData.Remove.IBonus);

                /** Bonus coin. */
                public coin: number;

                /** Bonus treasures. */
                public treasures?: (protocol.ITreasures|null);

                /**
                 * Creates a new Bonus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Bonus instance
                 */
                public static create(properties?: protocol.HitAckData.Remove.IBonus): protocol.HitAckData.Remove.Bonus;

                /**
                 * Encodes the specified Bonus message. Does not implicitly {@link protocol.HitAckData.Remove.Bonus.verify|verify} messages.
                 * @param message Bonus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: protocol.HitAckData.Remove.IBonus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Bonus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Bonus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.HitAckData.Remove.Bonus;

                /**
                 * Gets the default type url for Bonus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    /** Properties of a GiveUpReq. */
    interface IGiveUpReq {

        /** GiveUpReq index */
        index?: (number[]|null);

        /** GiveUpReq treasure */
        treasure?: (boolean|null);

        /** GiveUpReq type */
        type?: (number|null);
    }

    /** Represents a GiveUpReq. */
    class GiveUpReq implements IGiveUpReq {

        /**
         * Constructs a new GiveUpReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IGiveUpReq);

        /** GiveUpReq index. */
        public index: number[];

        /** GiveUpReq treasure. */
        public treasure: boolean;

        /** GiveUpReq type. */
        public type: number;

        /**
         * Creates a new GiveUpReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GiveUpReq instance
         */
        public static create(properties?: protocol.IGiveUpReq): protocol.GiveUpReq;

        /**
         * Encodes the specified GiveUpReq message. Does not implicitly {@link protocol.GiveUpReq.verify|verify} messages.
         * @param message GiveUpReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IGiveUpReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GiveUpReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GiveUpReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.GiveUpReq;

        /**
         * Gets the default type url for GiveUpReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GiveUpAck. */
    interface IGiveUpAck {

        /** GiveUpAck plate */
        plate?: (protocol.IFish[]|null);

        /** GiveUpAck treasure */
        treasure?: (boolean|null);

        /** GiveUpAck type */
        type?: (number|null);
    }

    /** Represents a GiveUpAck. */
    class GiveUpAck implements IGiveUpAck {

        /**
         * Constructs a new GiveUpAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IGiveUpAck);

        /** GiveUpAck plate. */
        public plate: protocol.IFish[];

        /** GiveUpAck treasure. */
        public treasure: boolean;

        /** GiveUpAck type. */
        public type: number;

        /**
         * Creates a new GiveUpAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GiveUpAck instance
         */
        public static create(properties?: protocol.IGiveUpAck): protocol.GiveUpAck;

        /**
         * Encodes the specified GiveUpAck message. Does not implicitly {@link protocol.GiveUpAck.verify|verify} messages.
         * @param message GiveUpAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IGiveUpAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GiveUpAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GiveUpAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.GiveUpAck;

        /**
         * Gets the default type url for GiveUpAck
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DamagedReq. */
    interface IDamagedReq {

        /** DamagedReq index */
        index?: (number[]|null);
    }

    /** Represents a DamagedReq. */
    class DamagedReq implements IDamagedReq {

        /**
         * Constructs a new DamagedReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IDamagedReq);

        /** DamagedReq index. */
        public index: number[];

        /**
         * Creates a new DamagedReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DamagedReq instance
         */
        public static create(properties?: protocol.IDamagedReq): protocol.DamagedReq;

        /**
         * Encodes the specified DamagedReq message. Does not implicitly {@link protocol.DamagedReq.verify|verify} messages.
         * @param message DamagedReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IDamagedReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DamagedReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DamagedReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.DamagedReq;

        /**
         * Gets the default type url for DamagedReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BroadcastData. */
    interface IBroadcastData {

        /** BroadcastData name */
        name?: (string|null);

        /** BroadcastData theme */
        theme?: (number|null);

        /** BroadcastData odds */
        odds?: (number|null);

        /** BroadcastData fish */
        fish?: (number|null);

        /** BroadcastData coin */
        coin?: (number|null);

        /** BroadcastData vendor */
        vendor?: (number|null);

        /** BroadcastData currency */
        currency?: (number|null);

        /** BroadcastData nickName */
        nickName?: (string|null);
    }

    /** Represents a BroadcastData. */
    class BroadcastData implements IBroadcastData {

        /**
         * Constructs a new BroadcastData.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IBroadcastData);

        /** BroadcastData name. */
        public name: string;

        /** BroadcastData theme. */
        public theme: number;

        /** BroadcastData odds. */
        public odds: number;

        /** BroadcastData fish. */
        public fish: number;

        /** BroadcastData coin. */
        public coin: number;

        /** BroadcastData vendor. */
        public vendor: number;

        /** BroadcastData currency. */
        public currency: number;

        /** BroadcastData nickName. */
        public nickName: string;

        /**
         * Creates a new BroadcastData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BroadcastData instance
         */
        public static create(properties?: protocol.IBroadcastData): protocol.BroadcastData;

        /**
         * Encodes the specified BroadcastData message. Does not implicitly {@link protocol.BroadcastData.verify|verify} messages.
         * @param message BroadcastData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IBroadcastData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BroadcastData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BroadcastData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.BroadcastData;

        /**
         * Gets the default type url for BroadcastData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LeaderBorad. */
    interface ILeaderBorad {

        /** LeaderBorad list */
        list?: (protocol.LeaderBorad.IInfo[]|null);

        /** LeaderBorad start */
        start?: (Long|null);
    }

    /** Represents a LeaderBorad. */
    class LeaderBorad implements ILeaderBorad {

        /**
         * Constructs a new LeaderBorad.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.ILeaderBorad);

        /** LeaderBorad list. */
        public list: protocol.LeaderBorad.IInfo[];

        /** LeaderBorad start. */
        public start: Long;

        /**
         * Creates a new LeaderBorad instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaderBorad instance
         */
        public static create(properties?: protocol.ILeaderBorad): protocol.LeaderBorad;

        /**
         * Encodes the specified LeaderBorad message. Does not implicitly {@link protocol.LeaderBorad.verify|verify} messages.
         * @param message LeaderBorad message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.ILeaderBorad, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaderBorad message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaderBorad
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.LeaderBorad;

        /**
         * Gets the default type url for LeaderBorad
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace LeaderBorad {

        /** Properties of an Info. */
        interface IInfo {

            /** Info userName */
            userName?: (string|null);

            /** Info odds */
            odds?: (number|null);

            /** Info createdAt */
            createdAt?: (Long|null);

            /** Info nickName */
            nickName?: (string|null);
        }

        /** Represents an Info. */
        class Info implements IInfo {

            /**
             * Constructs a new Info.
             * @param [properties] Properties to set
             */
            constructor(properties?: protocol.LeaderBorad.IInfo);

            /** Info userName. */
            public userName: string;

            /** Info odds. */
            public odds: number;

            /** Info createdAt. */
            public createdAt: Long;

            /** Info nickName. */
            public nickName: string;

            /**
             * Creates a new Info instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Info instance
             */
            public static create(properties?: protocol.LeaderBorad.IInfo): protocol.LeaderBorad.Info;

            /**
             * Encodes the specified Info message. Does not implicitly {@link protocol.LeaderBorad.Info.verify|verify} messages.
             * @param message Info message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: protocol.LeaderBorad.IInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Info message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Info
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.LeaderBorad.Info;

            /**
             * Gets the default type url for Info
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of an EnergyAck. */
    interface IEnergyAck {

        /** EnergyAck energy */
        energy?: (number|null);
    }

    /** Represents an EnergyAck. */
    class EnergyAck implements IEnergyAck {

        /**
         * Constructs a new EnergyAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IEnergyAck);

        /** EnergyAck energy. */
        public energy: number;

        /**
         * Creates a new EnergyAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnergyAck instance
         */
        public static create(properties?: protocol.IEnergyAck): protocol.EnergyAck;

        /**
         * Encodes the specified EnergyAck message. Does not implicitly {@link protocol.EnergyAck.verify|verify} messages.
         * @param message EnergyAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IEnergyAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnergyAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnergyAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.EnergyAck;

        /**
         * Gets the default type url for EnergyAck
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Treasures. */
    interface ITreasures {

        /** Treasures round */
        round?: (number|null);

        /** Treasures list */
        list?: (protocol.Treasures.ITreasure[]|null);

        /** Treasures odds */
        odds?: (number|null);

        /** Treasures jackpot */
        jackpot?: (protocol.IJackpot|null);
    }

    /** Represents a Treasures. */
    class Treasures implements ITreasures {

        /**
         * Constructs a new Treasures.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.ITreasures);

        /** Treasures round. */
        public round: number;

        /** Treasures list. */
        public list: protocol.Treasures.ITreasure[];

        /** Treasures odds. */
        public odds: number;

        /** Treasures jackpot. */
        public jackpot?: (protocol.IJackpot|null);

        /**
         * Creates a new Treasures instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Treasures instance
         */
        public static create(properties?: protocol.ITreasures): protocol.Treasures;

        /**
         * Encodes the specified Treasures message. Does not implicitly {@link protocol.Treasures.verify|verify} messages.
         * @param message Treasures message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.ITreasures, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Treasures message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Treasures
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.Treasures;

        /**
         * Gets the default type url for Treasures
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Treasures {

        /** Properties of a Treasure. */
        interface ITreasure {

            /** Treasure id */
            id?: (number|null);

            /** Treasure odds */
            odds?: (number|null);

            /** Treasure point */
            point?: (number|null);

            /** Treasure multiply */
            multiply?: (number|null);

            /** Treasure addRound */
            addRound?: (boolean|null);

            /** Treasure jackpot */
            jackpot?: (protocol.JackpotType|null);
        }

        /** Represents a Treasure. */
        class Treasure implements ITreasure {

            /**
             * Constructs a new Treasure.
             * @param [properties] Properties to set
             */
            constructor(properties?: protocol.Treasures.ITreasure);

            /** Treasure id. */
            public id: number;

            /** Treasure odds. */
            public odds: number;

            /** Treasure point. */
            public point: number;

            /** Treasure multiply. */
            public multiply: number;

            /** Treasure addRound. */
            public addRound: boolean;

            /** Treasure jackpot. */
            public jackpot: protocol.JackpotType;

            /**
             * Creates a new Treasure instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Treasure instance
             */
            public static create(properties?: protocol.Treasures.ITreasure): protocol.Treasures.Treasure;

            /**
             * Encodes the specified Treasure message. Does not implicitly {@link protocol.Treasures.Treasure.verify|verify} messages.
             * @param message Treasure message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: protocol.Treasures.ITreasure, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Treasure message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Treasure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.Treasures.Treasure;

            /**
             * Gets the default type url for Treasure
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a Jackpot. */
    interface IJackpot {

        /** Jackpot type */
        type?: (protocol.JackpotType|null);

        /** Jackpot coin */
        coin?: (number|null);
    }

    /** Represents a Jackpot. */
    class Jackpot implements IJackpot {

        /**
         * Constructs a new Jackpot.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IJackpot);

        /** Jackpot type. */
        public type: protocol.JackpotType;

        /** Jackpot coin. */
        public coin: number;

        /**
         * Creates a new Jackpot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Jackpot instance
         */
        public static create(properties?: protocol.IJackpot): protocol.Jackpot;

        /**
         * Encodes the specified Jackpot message. Does not implicitly {@link protocol.Jackpot.verify|verify} messages.
         * @param message Jackpot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IJackpot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Jackpot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Jackpot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.Jackpot;

        /**
         * Gets the default type url for Jackpot
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** JackpotType enum. */
    enum JackpotType {
        None = 0,
        Grand = 1,
        Major = 2,
        Minor = 3,
        Mini = 4
    }

    /** Properties of a JackpotAck. */
    interface IJackpotAck {

        /** JackpotAck coin */
        coin?: (number|null);
    }

    /** Represents a JackpotAck. */
    class JackpotAck implements IJackpotAck {

        /**
         * Constructs a new JackpotAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IJackpotAck);

        /** JackpotAck coin. */
        public coin: number;

        /**
         * Creates a new JackpotAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JackpotAck instance
         */
        public static create(properties?: protocol.IJackpotAck): protocol.JackpotAck;

        /**
         * Encodes the specified JackpotAck message. Does not implicitly {@link protocol.JackpotAck.verify|verify} messages.
         * @param message JackpotAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IJackpotAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JackpotAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JackpotAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.JackpotAck;

        /**
         * Gets the default type url for JackpotAck
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a JackpotHistory. */
    interface IJackpotHistory {

        /** JackpotHistory list */
        list?: (protocol.JackpotHistory.IJp[]|null);

        /** JackpotHistory grand */
        grand?: (protocol.JackpotHistory.IJp|null);
    }

    /** Represents a JackpotHistory. */
    class JackpotHistory implements IJackpotHistory {

        /**
         * Constructs a new JackpotHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: protocol.IJackpotHistory);

        /** JackpotHistory list. */
        public list: protocol.JackpotHistory.IJp[];

        /** JackpotHistory grand. */
        public grand?: (protocol.JackpotHistory.IJp|null);

        /**
         * Creates a new JackpotHistory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JackpotHistory instance
         */
        public static create(properties?: protocol.IJackpotHistory): protocol.JackpotHistory;

        /**
         * Encodes the specified JackpotHistory message. Does not implicitly {@link protocol.JackpotHistory.verify|verify} messages.
         * @param message JackpotHistory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protocol.IJackpotHistory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JackpotHistory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JackpotHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.JackpotHistory;

        /**
         * Gets the default type url for JackpotHistory
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace JackpotHistory {

        /** Properties of a Jp. */
        interface IJp {

            /** Jp type */
            type?: (number|null);

            /** Jp name */
            name?: (string|null);

            /** Jp coin */
            coin?: (number|null);

            /** Jp create */
            create?: (Long|null);
        }

        /** Represents a Jp. */
        class Jp implements IJp {

            /**
             * Constructs a new Jp.
             * @param [properties] Properties to set
             */
            constructor(properties?: protocol.JackpotHistory.IJp);

            /** Jp type. */
            public type: number;

            /** Jp name. */
            public name: string;

            /** Jp coin. */
            public coin: number;

            /** Jp create. */
            public create: Long;

            /**
             * Creates a new Jp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Jp instance
             */
            public static create(properties?: protocol.JackpotHistory.IJp): protocol.JackpotHistory.Jp;

            /**
             * Encodes the specified Jp message. Does not implicitly {@link protocol.JackpotHistory.Jp.verify|verify} messages.
             * @param message Jp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: protocol.JackpotHistory.IJp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Jp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Jp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protocol.JackpotHistory.Jp;

            /**
             * Gets the default type url for Jp
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Gets the default type url for Any
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
