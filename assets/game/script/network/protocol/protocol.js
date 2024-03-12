/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.protocol = (function() {

    /**
     * Namespace protocol.
     * @exports protocol
     * @namespace
     */
    var protocol = {};

    /**
     * UserToServer enum.
     * @name protocol.UserToServer
     * @enum {number}
     * @property {number} U2S_NONE=0 U2S_NONE value
     * @property {number} U2S_INFO_REQ=21 U2S_INFO_REQ value
     * @property {number} U2S_HIT_REQ=22 U2S_HIT_REQ value
     * @property {number} U2S_GIVEUP_REQ=23 U2S_GIVEUP_REQ value
     * @property {number} U2S_DAMAGED_REQ=24 U2S_DAMAGED_REQ value
     * @property {number} U2S_ENERGY_REQ=25 U2S_ENERGY_REQ value
     * @property {number} U2S_JACKOPT_HISTORY=26 U2S_JACKOPT_HISTORY value
     * @property {number} U2S_JACKPOT_REQ=27 U2S_JACKPOT_REQ value
     * @property {number} U2S_LEADERBORAD=30 U2S_LEADERBORAD value
     */
    protocol.UserToServer = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "U2S_NONE"] = 0;
        values[valuesById[21] = "U2S_INFO_REQ"] = 21;
        values[valuesById[22] = "U2S_HIT_REQ"] = 22;
        values[valuesById[23] = "U2S_GIVEUP_REQ"] = 23;
        values[valuesById[24] = "U2S_DAMAGED_REQ"] = 24;
        values[valuesById[25] = "U2S_ENERGY_REQ"] = 25;
        values[valuesById[26] = "U2S_JACKOPT_HISTORY"] = 26;
        values[valuesById[27] = "U2S_JACKPOT_REQ"] = 27;
        values[valuesById[30] = "U2S_LEADERBORAD"] = 30;
        return values;
    })();

    /**
     * ServerToUser enum.
     * @name protocol.ServerToUser
     * @enum {number}
     * @property {number} S2U_NONE=0 S2U_NONE value
     * @property {number} S2U_INFO_ACK=21 S2U_INFO_ACK value
     * @property {number} S2U_HIT_ACK=22 S2U_HIT_ACK value
     * @property {number} S2U_GIVEUP_ACK=23 S2U_GIVEUP_ACK value
     * @property {number} S2U_ENERGY_ACK=25 S2U_ENERGY_ACK value
     * @property {number} S2U_JACKOPT_HISTORY=26 S2U_JACKOPT_HISTORY value
     * @property {number} S2U_JACKPOT_ACK=27 S2U_JACKPOT_ACK value
     * @property {number} S2U_LEADERBORAD=30 S2U_LEADERBORAD value
     * @property {number} S2U_BROADCAST=60 S2U_BROADCAST value
     */
    protocol.ServerToUser = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "S2U_NONE"] = 0;
        values[valuesById[21] = "S2U_INFO_ACK"] = 21;
        values[valuesById[22] = "S2U_HIT_ACK"] = 22;
        values[valuesById[23] = "S2U_GIVEUP_ACK"] = 23;
        values[valuesById[25] = "S2U_ENERGY_ACK"] = 25;
        values[valuesById[26] = "S2U_JACKOPT_HISTORY"] = 26;
        values[valuesById[27] = "S2U_JACKPOT_ACK"] = 27;
        values[valuesById[30] = "S2U_LEADERBORAD"] = 30;
        values[valuesById[60] = "S2U_BROADCAST"] = 60;
        return values;
    })();

    /**
     * HitResult enum.
     * @name protocol.HitResult
     * @enum {number}
     * @property {number} HR_FAILED=0 HR_FAILED value
     * @property {number} HR_SUCCESS=1 HR_SUCCESS value
     * @property {number} HR_FISH_ALREADY_DEAD=2 HR_FISH_ALREADY_DEAD value
     */
    protocol.HitResult = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "HR_FAILED"] = 0;
        values[valuesById[1] = "HR_SUCCESS"] = 1;
        values[valuesById[2] = "HR_FISH_ALREADY_DEAD"] = 2;
        return values;
    })();

    /**
     * BulletType enum.
     * @name protocol.BulletType
     * @enum {number}
     * @property {number} Normal=0 Normal value
     * @property {number} Cannon=1 Cannon value
     * @property {number} Energy=23 Energy value
     */
    protocol.BulletType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "Normal"] = 0;
        values[valuesById[1] = "Cannon"] = 1;
        values[valuesById[23] = "Energy"] = 23;
        return values;
    })();

    protocol.Fish = (function() {

        /**
         * Properties of a Fish.
         * @memberof protocol
         * @interface IFish
         * @property {number|null} [no] Fish no
         * @property {number|null} [index] Fish index
         */

        /**
         * Constructs a new Fish.
         * @memberof protocol
         * @classdesc Represents a Fish.
         * @implements IFish
         * @constructor
         * @param {protocol.IFish=} [properties] Properties to set
         */
        function Fish(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Fish no.
         * @member {number} no
         * @memberof protocol.Fish
         * @instance
         */
        Fish.prototype.no = 0;

        /**
         * Fish index.
         * @member {number} index
         * @memberof protocol.Fish
         * @instance
         */
        Fish.prototype.index = 0;

        /**
         * Creates a new Fish instance using the specified properties.
         * @function create
         * @memberof protocol.Fish
         * @static
         * @param {protocol.IFish=} [properties] Properties to set
         * @returns {protocol.Fish} Fish instance
         */
        Fish.create = function create(properties) {
            return new Fish(properties);
        };

        /**
         * Encodes the specified Fish message. Does not implicitly {@link protocol.Fish.verify|verify} messages.
         * @function encode
         * @memberof protocol.Fish
         * @static
         * @param {protocol.IFish} message Fish message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Fish.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.no != null && Object.hasOwnProperty.call(message, "no"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.no);
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.index);
            return writer;
        };

        /**
         * Decodes a Fish message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.Fish
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.Fish} Fish
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Fish.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.Fish();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.no = reader.uint32();
                        break;
                    }
                case 2: {
                        message.index = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for Fish
         * @function getTypeUrl
         * @memberof protocol.Fish
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Fish.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.Fish";
        };

        return Fish;
    })();

    protocol.InfoAck = (function() {

        /**
         * Properties of an InfoAck.
         * @memberof protocol
         * @interface IInfoAck
         * @property {Array.<protocol.IFish>|null} [plate] InfoAck plate
         * @property {number|null} [energy] InfoAck energy
         * @property {Long|null} [wagers] InfoAck wagers
         */

        /**
         * Constructs a new InfoAck.
         * @memberof protocol
         * @classdesc Represents an InfoAck.
         * @implements IInfoAck
         * @constructor
         * @param {protocol.IInfoAck=} [properties] Properties to set
         */
        function InfoAck(properties) {
            this.plate = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InfoAck plate.
         * @member {Array.<protocol.IFish>} plate
         * @memberof protocol.InfoAck
         * @instance
         */
        InfoAck.prototype.plate = $util.emptyArray;

        /**
         * InfoAck energy.
         * @member {number} energy
         * @memberof protocol.InfoAck
         * @instance
         */
        InfoAck.prototype.energy = 0;

        /**
         * InfoAck wagers.
         * @member {Long} wagers
         * @memberof protocol.InfoAck
         * @instance
         */
        InfoAck.prototype.wagers = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new InfoAck instance using the specified properties.
         * @function create
         * @memberof protocol.InfoAck
         * @static
         * @param {protocol.IInfoAck=} [properties] Properties to set
         * @returns {protocol.InfoAck} InfoAck instance
         */
        InfoAck.create = function create(properties) {
            return new InfoAck(properties);
        };

        /**
         * Encodes the specified InfoAck message. Does not implicitly {@link protocol.InfoAck.verify|verify} messages.
         * @function encode
         * @memberof protocol.InfoAck
         * @static
         * @param {protocol.IInfoAck} message InfoAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfoAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.plate != null && message.plate.length)
                for (var i = 0; i < message.plate.length; ++i)
                    $root.protocol.Fish.encode(message.plate[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.energy != null && Object.hasOwnProperty.call(message, "energy"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.energy);
            if (message.wagers != null && Object.hasOwnProperty.call(message, "wagers"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.wagers);
            return writer;
        };

        /**
         * Decodes an InfoAck message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.InfoAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.InfoAck} InfoAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfoAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.InfoAck();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.plate && message.plate.length))
                            message.plate = [];
                        message.plate.push($root.protocol.Fish.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.energy = reader.double();
                        break;
                    }
                case 3: {
                        message.wagers = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for InfoAck
         * @function getTypeUrl
         * @memberof protocol.InfoAck
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        InfoAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.InfoAck";
        };

        return InfoAck;
    })();

    protocol.HitReqData = (function() {

        /**
         * Properties of a HitReqData.
         * @memberof protocol
         * @interface IHitReqData
         * @property {number|null} [bulletId] HitReqData bulletId
         * @property {Array.<number>|null} [index] HitReqData index
         * @property {number|null} [bet] HitReqData bet
         * @property {protocol.BulletType|null} [type] HitReqData type
         */

        /**
         * Constructs a new HitReqData.
         * @memberof protocol
         * @classdesc Represents a HitReqData.
         * @implements IHitReqData
         * @constructor
         * @param {protocol.IHitReqData=} [properties] Properties to set
         */
        function HitReqData(properties) {
            this.index = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HitReqData bulletId.
         * @member {number} bulletId
         * @memberof protocol.HitReqData
         * @instance
         */
        HitReqData.prototype.bulletId = 0;

        /**
         * HitReqData index.
         * @member {Array.<number>} index
         * @memberof protocol.HitReqData
         * @instance
         */
        HitReqData.prototype.index = $util.emptyArray;

        /**
         * HitReqData bet.
         * @member {number} bet
         * @memberof protocol.HitReqData
         * @instance
         */
        HitReqData.prototype.bet = 0;

        /**
         * HitReqData type.
         * @member {protocol.BulletType} type
         * @memberof protocol.HitReqData
         * @instance
         */
        HitReqData.prototype.type = 0;

        /**
         * Creates a new HitReqData instance using the specified properties.
         * @function create
         * @memberof protocol.HitReqData
         * @static
         * @param {protocol.IHitReqData=} [properties] Properties to set
         * @returns {protocol.HitReqData} HitReqData instance
         */
        HitReqData.create = function create(properties) {
            return new HitReqData(properties);
        };

        /**
         * Encodes the specified HitReqData message. Does not implicitly {@link protocol.HitReqData.verify|verify} messages.
         * @function encode
         * @memberof protocol.HitReqData
         * @static
         * @param {protocol.IHitReqData} message HitReqData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HitReqData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bulletId != null && Object.hasOwnProperty.call(message, "bulletId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.bulletId);
            if (message.index != null && message.index.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.index.length; ++i)
                    writer.uint32(message.index[i]);
                writer.ldelim();
            }
            if (message.bet != null && Object.hasOwnProperty.call(message, "bet"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.bet);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
            return writer;
        };

        /**
         * Decodes a HitReqData message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.HitReqData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.HitReqData} HitReqData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HitReqData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.HitReqData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.bulletId = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.index && message.index.length))
                            message.index = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.index.push(reader.uint32());
                        } else
                            message.index.push(reader.uint32());
                        break;
                    }
                case 3: {
                        message.bet = reader.double();
                        break;
                    }
                case 4: {
                        message.type = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for HitReqData
         * @function getTypeUrl
         * @memberof protocol.HitReqData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HitReqData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.HitReqData";
        };

        return HitReqData;
    })();

    protocol.HitAckData = (function() {

        /**
         * Properties of a HitAckData.
         * @memberof protocol
         * @interface IHitAckData
         * @property {protocol.HitResult|null} [result] HitAckData result
         * @property {number|null} [bet] HitAckData bet
         * @property {number|null} [coin] HitAckData coin
         * @property {number|null} [bulletId] HitAckData bulletId
         * @property {Array.<protocol.IFish>|null} [plate] HitAckData plate
         * @property {protocol.BulletType|null} [type] HitAckData type
         * @property {number|null} [remain] HitAckData remain
         * @property {Array.<protocol.HitAckData.IRemove>|null} [remove] HitAckData remove
         */

        /**
         * Constructs a new HitAckData.
         * @memberof protocol
         * @classdesc Represents a HitAckData.
         * @implements IHitAckData
         * @constructor
         * @param {protocol.IHitAckData=} [properties] Properties to set
         */
        function HitAckData(properties) {
            this.plate = [];
            this.remove = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HitAckData result.
         * @member {protocol.HitResult} result
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.result = 0;

        /**
         * HitAckData bet.
         * @member {number} bet
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.bet = 0;

        /**
         * HitAckData coin.
         * @member {number} coin
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.coin = 0;

        /**
         * HitAckData bulletId.
         * @member {number} bulletId
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.bulletId = 0;

        /**
         * HitAckData plate.
         * @member {Array.<protocol.IFish>} plate
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.plate = $util.emptyArray;

        /**
         * HitAckData type.
         * @member {protocol.BulletType} type
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.type = 0;

        /**
         * HitAckData remain.
         * @member {number} remain
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.remain = 0;

        /**
         * HitAckData remove.
         * @member {Array.<protocol.HitAckData.IRemove>} remove
         * @memberof protocol.HitAckData
         * @instance
         */
        HitAckData.prototype.remove = $util.emptyArray;

        /**
         * Creates a new HitAckData instance using the specified properties.
         * @function create
         * @memberof protocol.HitAckData
         * @static
         * @param {protocol.IHitAckData=} [properties] Properties to set
         * @returns {protocol.HitAckData} HitAckData instance
         */
        HitAckData.create = function create(properties) {
            return new HitAckData(properties);
        };

        /**
         * Encodes the specified HitAckData message. Does not implicitly {@link protocol.HitAckData.verify|verify} messages.
         * @function encode
         * @memberof protocol.HitAckData
         * @static
         * @param {protocol.IHitAckData} message HitAckData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HitAckData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            if (message.bet != null && Object.hasOwnProperty.call(message, "bet"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.bet);
            if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.coin);
            if (message.bulletId != null && Object.hasOwnProperty.call(message, "bulletId"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.bulletId);
            if (message.plate != null && message.plate.length)
                for (var i = 0; i < message.plate.length; ++i)
                    $root.protocol.Fish.encode(message.plate[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.type);
            if (message.remain != null && Object.hasOwnProperty.call(message, "remain"))
                writer.uint32(/* id 8, wireType 1 =*/65).double(message.remain);
            if (message.remove != null && message.remove.length)
                for (var i = 0; i < message.remove.length; ++i)
                    $root.protocol.HitAckData.Remove.encode(message.remove[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a HitAckData message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.HitAckData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.HitAckData} HitAckData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HitAckData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.HitAckData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.result = reader.int32();
                        break;
                    }
                case 2: {
                        message.bet = reader.double();
                        break;
                    }
                case 3: {
                        message.coin = reader.double();
                        break;
                    }
                case 4: {
                        message.bulletId = reader.uint32();
                        break;
                    }
                case 6: {
                        if (!(message.plate && message.plate.length))
                            message.plate = [];
                        message.plate.push($root.protocol.Fish.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        message.type = reader.int32();
                        break;
                    }
                case 8: {
                        message.remain = reader.double();
                        break;
                    }
                case 11: {
                        if (!(message.remove && message.remove.length))
                            message.remove = [];
                        message.remove.push($root.protocol.HitAckData.Remove.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for HitAckData
         * @function getTypeUrl
         * @memberof protocol.HitAckData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HitAckData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.HitAckData";
        };

        HitAckData.Remove = (function() {

            /**
             * Properties of a Remove.
             * @memberof protocol.HitAckData
             * @interface IRemove
             * @property {number|null} [idx] Remove idx
             * @property {number|null} [coin] Remove coin
             * @property {boolean|null} [alive] Remove alive
             * @property {google.protobuf.IAny|null} [meta] Remove meta
             * @property {protocol.IJackpot|null} [jackpot] Remove jackpot
             * @property {protocol.HitAckData.Remove.IBonus|null} [bonus] Remove bonus
             */

            /**
             * Constructs a new Remove.
             * @memberof protocol.HitAckData
             * @classdesc Represents a Remove.
             * @implements IRemove
             * @constructor
             * @param {protocol.HitAckData.IRemove=} [properties] Properties to set
             */
            function Remove(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Remove idx.
             * @member {number} idx
             * @memberof protocol.HitAckData.Remove
             * @instance
             */
            Remove.prototype.idx = 0;

            /**
             * Remove coin.
             * @member {number} coin
             * @memberof protocol.HitAckData.Remove
             * @instance
             */
            Remove.prototype.coin = 0;

            /**
             * Remove alive.
             * @member {boolean} alive
             * @memberof protocol.HitAckData.Remove
             * @instance
             */
            Remove.prototype.alive = false;

            /**
             * Remove meta.
             * @member {google.protobuf.IAny|null|undefined} meta
             * @memberof protocol.HitAckData.Remove
             * @instance
             */
            Remove.prototype.meta = null;

            /**
             * Remove jackpot.
             * @member {protocol.IJackpot|null|undefined} jackpot
             * @memberof protocol.HitAckData.Remove
             * @instance
             */
            Remove.prototype.jackpot = null;

            /**
             * Remove bonus.
             * @member {protocol.HitAckData.Remove.IBonus|null|undefined} bonus
             * @memberof protocol.HitAckData.Remove
             * @instance
             */
            Remove.prototype.bonus = null;

            /**
             * Creates a new Remove instance using the specified properties.
             * @function create
             * @memberof protocol.HitAckData.Remove
             * @static
             * @param {protocol.HitAckData.IRemove=} [properties] Properties to set
             * @returns {protocol.HitAckData.Remove} Remove instance
             */
            Remove.create = function create(properties) {
                return new Remove(properties);
            };

            /**
             * Encodes the specified Remove message. Does not implicitly {@link protocol.HitAckData.Remove.verify|verify} messages.
             * @function encode
             * @memberof protocol.HitAckData.Remove
             * @static
             * @param {protocol.HitAckData.IRemove} message Remove message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Remove.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.idx != null && Object.hasOwnProperty.call(message, "idx"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.idx);
                if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.coin);
                if (message.alive != null && Object.hasOwnProperty.call(message, "alive"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.alive);
                if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                    $root.google.protobuf.Any.encode(message.meta, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.jackpot != null && Object.hasOwnProperty.call(message, "jackpot"))
                    $root.protocol.Jackpot.encode(message.jackpot, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.bonus != null && Object.hasOwnProperty.call(message, "bonus"))
                    $root.protocol.HitAckData.Remove.Bonus.encode(message.bonus, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };

            /**
             * Decodes a Remove message from the specified reader or buffer.
             * @function decode
             * @memberof protocol.HitAckData.Remove
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {protocol.HitAckData.Remove} Remove
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Remove.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.HitAckData.Remove();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.idx = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.coin = reader.double();
                            break;
                        }
                    case 3: {
                            message.alive = reader.bool();
                            break;
                        }
                    case 4: {
                            message.meta = $root.google.protobuf.Any.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.jackpot = $root.protocol.Jackpot.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.bonus = $root.protocol.HitAckData.Remove.Bonus.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for Remove
             * @function getTypeUrl
             * @memberof protocol.HitAckData.Remove
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Remove.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/protocol.HitAckData.Remove";
            };

            Remove.Bonus = (function() {

                /**
                 * Properties of a Bonus.
                 * @memberof protocol.HitAckData.Remove
                 * @interface IBonus
                 * @property {number|null} [coin] Bonus coin
                 * @property {protocol.ITreasures|null} [treasures] Bonus treasures
                 */

                /**
                 * Constructs a new Bonus.
                 * @memberof protocol.HitAckData.Remove
                 * @classdesc Represents a Bonus.
                 * @implements IBonus
                 * @constructor
                 * @param {protocol.HitAckData.Remove.IBonus=} [properties] Properties to set
                 */
                function Bonus(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Bonus coin.
                 * @member {number} coin
                 * @memberof protocol.HitAckData.Remove.Bonus
                 * @instance
                 */
                Bonus.prototype.coin = 0;

                /**
                 * Bonus treasures.
                 * @member {protocol.ITreasures|null|undefined} treasures
                 * @memberof protocol.HitAckData.Remove.Bonus
                 * @instance
                 */
                Bonus.prototype.treasures = null;

                /**
                 * Creates a new Bonus instance using the specified properties.
                 * @function create
                 * @memberof protocol.HitAckData.Remove.Bonus
                 * @static
                 * @param {protocol.HitAckData.Remove.IBonus=} [properties] Properties to set
                 * @returns {protocol.HitAckData.Remove.Bonus} Bonus instance
                 */
                Bonus.create = function create(properties) {
                    return new Bonus(properties);
                };

                /**
                 * Encodes the specified Bonus message. Does not implicitly {@link protocol.HitAckData.Remove.Bonus.verify|verify} messages.
                 * @function encode
                 * @memberof protocol.HitAckData.Remove.Bonus
                 * @static
                 * @param {protocol.HitAckData.Remove.IBonus} message Bonus message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Bonus.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                        writer.uint32(/* id 1, wireType 1 =*/9).double(message.coin);
                    if (message.treasures != null && Object.hasOwnProperty.call(message, "treasures"))
                        $root.protocol.Treasures.encode(message.treasures, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Decodes a Bonus message from the specified reader or buffer.
                 * @function decode
                 * @memberof protocol.HitAckData.Remove.Bonus
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {protocol.HitAckData.Remove.Bonus} Bonus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Bonus.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.HitAckData.Remove.Bonus();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.coin = reader.double();
                                break;
                            }
                        case 2: {
                                message.treasures = $root.protocol.Treasures.decode(reader, reader.uint32());
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Gets the default type url for Bonus
                 * @function getTypeUrl
                 * @memberof protocol.HitAckData.Remove.Bonus
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Bonus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/protocol.HitAckData.Remove.Bonus";
                };

                return Bonus;
            })();

            return Remove;
        })();

        return HitAckData;
    })();

    protocol.GiveUpReq = (function() {

        /**
         * Properties of a GiveUpReq.
         * @memberof protocol
         * @interface IGiveUpReq
         * @property {Array.<number>|null} [index] GiveUpReq index
         * @property {boolean|null} [treasure] GiveUpReq treasure
         * @property {number|null} [type] GiveUpReq type
         */

        /**
         * Constructs a new GiveUpReq.
         * @memberof protocol
         * @classdesc Represents a GiveUpReq.
         * @implements IGiveUpReq
         * @constructor
         * @param {protocol.IGiveUpReq=} [properties] Properties to set
         */
        function GiveUpReq(properties) {
            this.index = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GiveUpReq index.
         * @member {Array.<number>} index
         * @memberof protocol.GiveUpReq
         * @instance
         */
        GiveUpReq.prototype.index = $util.emptyArray;

        /**
         * GiveUpReq treasure.
         * @member {boolean} treasure
         * @memberof protocol.GiveUpReq
         * @instance
         */
        GiveUpReq.prototype.treasure = false;

        /**
         * GiveUpReq type.
         * @member {number} type
         * @memberof protocol.GiveUpReq
         * @instance
         */
        GiveUpReq.prototype.type = 0;

        /**
         * Creates a new GiveUpReq instance using the specified properties.
         * @function create
         * @memberof protocol.GiveUpReq
         * @static
         * @param {protocol.IGiveUpReq=} [properties] Properties to set
         * @returns {protocol.GiveUpReq} GiveUpReq instance
         */
        GiveUpReq.create = function create(properties) {
            return new GiveUpReq(properties);
        };

        /**
         * Encodes the specified GiveUpReq message. Does not implicitly {@link protocol.GiveUpReq.verify|verify} messages.
         * @function encode
         * @memberof protocol.GiveUpReq
         * @static
         * @param {protocol.IGiveUpReq} message GiveUpReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GiveUpReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.index != null && message.index.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.index.length; ++i)
                    writer.uint32(message.index[i]);
                writer.ldelim();
            }
            if (message.treasure != null && Object.hasOwnProperty.call(message, "treasure"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.treasure);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.type);
            return writer;
        };

        /**
         * Decodes a GiveUpReq message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.GiveUpReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.GiveUpReq} GiveUpReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GiveUpReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.GiveUpReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.index && message.index.length))
                            message.index = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.index.push(reader.uint32());
                        } else
                            message.index.push(reader.uint32());
                        break;
                    }
                case 2: {
                        message.treasure = reader.bool();
                        break;
                    }
                case 3: {
                        message.type = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GiveUpReq
         * @function getTypeUrl
         * @memberof protocol.GiveUpReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GiveUpReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.GiveUpReq";
        };

        return GiveUpReq;
    })();

    protocol.GiveUpAck = (function() {

        /**
         * Properties of a GiveUpAck.
         * @memberof protocol
         * @interface IGiveUpAck
         * @property {Array.<protocol.IFish>|null} [plate] GiveUpAck plate
         * @property {boolean|null} [treasure] GiveUpAck treasure
         * @property {number|null} [type] GiveUpAck type
         */

        /**
         * Constructs a new GiveUpAck.
         * @memberof protocol
         * @classdesc Represents a GiveUpAck.
         * @implements IGiveUpAck
         * @constructor
         * @param {protocol.IGiveUpAck=} [properties] Properties to set
         */
        function GiveUpAck(properties) {
            this.plate = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GiveUpAck plate.
         * @member {Array.<protocol.IFish>} plate
         * @memberof protocol.GiveUpAck
         * @instance
         */
        GiveUpAck.prototype.plate = $util.emptyArray;

        /**
         * GiveUpAck treasure.
         * @member {boolean} treasure
         * @memberof protocol.GiveUpAck
         * @instance
         */
        GiveUpAck.prototype.treasure = false;

        /**
         * GiveUpAck type.
         * @member {number} type
         * @memberof protocol.GiveUpAck
         * @instance
         */
        GiveUpAck.prototype.type = 0;

        /**
         * Creates a new GiveUpAck instance using the specified properties.
         * @function create
         * @memberof protocol.GiveUpAck
         * @static
         * @param {protocol.IGiveUpAck=} [properties] Properties to set
         * @returns {protocol.GiveUpAck} GiveUpAck instance
         */
        GiveUpAck.create = function create(properties) {
            return new GiveUpAck(properties);
        };

        /**
         * Encodes the specified GiveUpAck message. Does not implicitly {@link protocol.GiveUpAck.verify|verify} messages.
         * @function encode
         * @memberof protocol.GiveUpAck
         * @static
         * @param {protocol.IGiveUpAck} message GiveUpAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GiveUpAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.plate != null && message.plate.length)
                for (var i = 0; i < message.plate.length; ++i)
                    $root.protocol.Fish.encode(message.plate[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.treasure != null && Object.hasOwnProperty.call(message, "treasure"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.treasure);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.type);
            return writer;
        };

        /**
         * Decodes a GiveUpAck message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.GiveUpAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.GiveUpAck} GiveUpAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GiveUpAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.GiveUpAck();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.plate && message.plate.length))
                            message.plate = [];
                        message.plate.push($root.protocol.Fish.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.treasure = reader.bool();
                        break;
                    }
                case 3: {
                        message.type = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GiveUpAck
         * @function getTypeUrl
         * @memberof protocol.GiveUpAck
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GiveUpAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.GiveUpAck";
        };

        return GiveUpAck;
    })();

    protocol.DamagedReq = (function() {

        /**
         * Properties of a DamagedReq.
         * @memberof protocol
         * @interface IDamagedReq
         * @property {Array.<number>|null} [index] DamagedReq index
         */

        /**
         * Constructs a new DamagedReq.
         * @memberof protocol
         * @classdesc Represents a DamagedReq.
         * @implements IDamagedReq
         * @constructor
         * @param {protocol.IDamagedReq=} [properties] Properties to set
         */
        function DamagedReq(properties) {
            this.index = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DamagedReq index.
         * @member {Array.<number>} index
         * @memberof protocol.DamagedReq
         * @instance
         */
        DamagedReq.prototype.index = $util.emptyArray;

        /**
         * Creates a new DamagedReq instance using the specified properties.
         * @function create
         * @memberof protocol.DamagedReq
         * @static
         * @param {protocol.IDamagedReq=} [properties] Properties to set
         * @returns {protocol.DamagedReq} DamagedReq instance
         */
        DamagedReq.create = function create(properties) {
            return new DamagedReq(properties);
        };

        /**
         * Encodes the specified DamagedReq message. Does not implicitly {@link protocol.DamagedReq.verify|verify} messages.
         * @function encode
         * @memberof protocol.DamagedReq
         * @static
         * @param {protocol.IDamagedReq} message DamagedReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DamagedReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.index != null && message.index.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.index.length; ++i)
                    writer.uint32(message.index[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Decodes a DamagedReq message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.DamagedReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.DamagedReq} DamagedReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DamagedReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.DamagedReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.index && message.index.length))
                            message.index = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.index.push(reader.uint32());
                        } else
                            message.index.push(reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for DamagedReq
         * @function getTypeUrl
         * @memberof protocol.DamagedReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DamagedReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.DamagedReq";
        };

        return DamagedReq;
    })();

    protocol.BroadcastData = (function() {

        /**
         * Properties of a BroadcastData.
         * @memberof protocol
         * @interface IBroadcastData
         * @property {string|null} [name] BroadcastData name
         * @property {number|null} [theme] BroadcastData theme
         * @property {number|null} [odds] BroadcastData odds
         * @property {number|null} [fish] BroadcastData fish
         * @property {number|null} [coin] BroadcastData coin
         * @property {number|null} [vendor] BroadcastData vendor
         * @property {number|null} [currency] BroadcastData currency
         * @property {string|null} [nickName] BroadcastData nickName
         */

        /**
         * Constructs a new BroadcastData.
         * @memberof protocol
         * @classdesc Represents a BroadcastData.
         * @implements IBroadcastData
         * @constructor
         * @param {protocol.IBroadcastData=} [properties] Properties to set
         */
        function BroadcastData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BroadcastData name.
         * @member {string} name
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.name = "";

        /**
         * BroadcastData theme.
         * @member {number} theme
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.theme = 0;

        /**
         * BroadcastData odds.
         * @member {number} odds
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.odds = 0;

        /**
         * BroadcastData fish.
         * @member {number} fish
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.fish = 0;

        /**
         * BroadcastData coin.
         * @member {number} coin
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.coin = 0;

        /**
         * BroadcastData vendor.
         * @member {number} vendor
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.vendor = 0;

        /**
         * BroadcastData currency.
         * @member {number} currency
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.currency = 0;

        /**
         * BroadcastData nickName.
         * @member {string} nickName
         * @memberof protocol.BroadcastData
         * @instance
         */
        BroadcastData.prototype.nickName = "";

        /**
         * Creates a new BroadcastData instance using the specified properties.
         * @function create
         * @memberof protocol.BroadcastData
         * @static
         * @param {protocol.IBroadcastData=} [properties] Properties to set
         * @returns {protocol.BroadcastData} BroadcastData instance
         */
        BroadcastData.create = function create(properties) {
            return new BroadcastData(properties);
        };

        /**
         * Encodes the specified BroadcastData message. Does not implicitly {@link protocol.BroadcastData.verify|verify} messages.
         * @function encode
         * @memberof protocol.BroadcastData
         * @static
         * @param {protocol.IBroadcastData} message BroadcastData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BroadcastData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.theme != null && Object.hasOwnProperty.call(message, "theme"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.theme);
            if (message.odds != null && Object.hasOwnProperty.call(message, "odds"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.odds);
            if (message.fish != null && Object.hasOwnProperty.call(message, "fish"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.fish);
            if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.coin);
            if (message.vendor != null && Object.hasOwnProperty.call(message, "vendor"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.vendor);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.currency);
            if (message.nickName != null && Object.hasOwnProperty.call(message, "nickName"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.nickName);
            return writer;
        };

        /**
         * Decodes a BroadcastData message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.BroadcastData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.BroadcastData} BroadcastData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BroadcastData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.BroadcastData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.theme = reader.uint32();
                        break;
                    }
                case 3: {
                        message.odds = reader.double();
                        break;
                    }
                case 4: {
                        message.fish = reader.uint32();
                        break;
                    }
                case 5: {
                        message.coin = reader.double();
                        break;
                    }
                case 6: {
                        message.vendor = reader.uint32();
                        break;
                    }
                case 7: {
                        message.currency = reader.uint32();
                        break;
                    }
                case 8: {
                        message.nickName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for BroadcastData
         * @function getTypeUrl
         * @memberof protocol.BroadcastData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BroadcastData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.BroadcastData";
        };

        return BroadcastData;
    })();

    protocol.LeaderBorad = (function() {

        /**
         * Properties of a LeaderBorad.
         * @memberof protocol
         * @interface ILeaderBorad
         * @property {Array.<protocol.LeaderBorad.IInfo>|null} [list] LeaderBorad list
         * @property {Long|null} [start] LeaderBorad start
         */

        /**
         * Constructs a new LeaderBorad.
         * @memberof protocol
         * @classdesc Represents a LeaderBorad.
         * @implements ILeaderBorad
         * @constructor
         * @param {protocol.ILeaderBorad=} [properties] Properties to set
         */
        function LeaderBorad(properties) {
            this.list = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LeaderBorad list.
         * @member {Array.<protocol.LeaderBorad.IInfo>} list
         * @memberof protocol.LeaderBorad
         * @instance
         */
        LeaderBorad.prototype.list = $util.emptyArray;

        /**
         * LeaderBorad start.
         * @member {Long} start
         * @memberof protocol.LeaderBorad
         * @instance
         */
        LeaderBorad.prototype.start = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LeaderBorad instance using the specified properties.
         * @function create
         * @memberof protocol.LeaderBorad
         * @static
         * @param {protocol.ILeaderBorad=} [properties] Properties to set
         * @returns {protocol.LeaderBorad} LeaderBorad instance
         */
        LeaderBorad.create = function create(properties) {
            return new LeaderBorad(properties);
        };

        /**
         * Encodes the specified LeaderBorad message. Does not implicitly {@link protocol.LeaderBorad.verify|verify} messages.
         * @function encode
         * @memberof protocol.LeaderBorad
         * @static
         * @param {protocol.ILeaderBorad} message LeaderBorad message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeaderBorad.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.list.length)
                for (var i = 0; i < message.list.length; ++i)
                    $root.protocol.LeaderBorad.Info.encode(message.list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.start);
            return writer;
        };

        /**
         * Decodes a LeaderBorad message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.LeaderBorad
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.LeaderBorad} LeaderBorad
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeaderBorad.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.LeaderBorad();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.list && message.list.length))
                            message.list = [];
                        message.list.push($root.protocol.LeaderBorad.Info.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.start = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LeaderBorad
         * @function getTypeUrl
         * @memberof protocol.LeaderBorad
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LeaderBorad.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.LeaderBorad";
        };

        LeaderBorad.Info = (function() {

            /**
             * Properties of an Info.
             * @memberof protocol.LeaderBorad
             * @interface IInfo
             * @property {string|null} [userName] Info userName
             * @property {number|null} [odds] Info odds
             * @property {Long|null} [createdAt] Info createdAt
             * @property {string|null} [nickName] Info nickName
             */

            /**
             * Constructs a new Info.
             * @memberof protocol.LeaderBorad
             * @classdesc Represents an Info.
             * @implements IInfo
             * @constructor
             * @param {protocol.LeaderBorad.IInfo=} [properties] Properties to set
             */
            function Info(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Info userName.
             * @member {string} userName
             * @memberof protocol.LeaderBorad.Info
             * @instance
             */
            Info.prototype.userName = "";

            /**
             * Info odds.
             * @member {number} odds
             * @memberof protocol.LeaderBorad.Info
             * @instance
             */
            Info.prototype.odds = 0;

            /**
             * Info createdAt.
             * @member {Long} createdAt
             * @memberof protocol.LeaderBorad.Info
             * @instance
             */
            Info.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Info nickName.
             * @member {string} nickName
             * @memberof protocol.LeaderBorad.Info
             * @instance
             */
            Info.prototype.nickName = "";

            /**
             * Creates a new Info instance using the specified properties.
             * @function create
             * @memberof protocol.LeaderBorad.Info
             * @static
             * @param {protocol.LeaderBorad.IInfo=} [properties] Properties to set
             * @returns {protocol.LeaderBorad.Info} Info instance
             */
            Info.create = function create(properties) {
                return new Info(properties);
            };

            /**
             * Encodes the specified Info message. Does not implicitly {@link protocol.LeaderBorad.Info.verify|verify} messages.
             * @function encode
             * @memberof protocol.LeaderBorad.Info
             * @static
             * @param {protocol.LeaderBorad.IInfo} message Info message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Info.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userName != null && Object.hasOwnProperty.call(message, "userName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userName);
                if (message.odds != null && Object.hasOwnProperty.call(message, "odds"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.odds);
                if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.createdAt);
                if (message.nickName != null && Object.hasOwnProperty.call(message, "nickName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.nickName);
                return writer;
            };

            /**
             * Decodes an Info message from the specified reader or buffer.
             * @function decode
             * @memberof protocol.LeaderBorad.Info
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {protocol.LeaderBorad.Info} Info
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Info.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.LeaderBorad.Info();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.userName = reader.string();
                            break;
                        }
                    case 2: {
                            message.odds = reader.double();
                            break;
                        }
                    case 3: {
                            message.createdAt = reader.int64();
                            break;
                        }
                    case 4: {
                            message.nickName = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for Info
             * @function getTypeUrl
             * @memberof protocol.LeaderBorad.Info
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Info.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/protocol.LeaderBorad.Info";
            };

            return Info;
        })();

        return LeaderBorad;
    })();

    protocol.EnergyAck = (function() {

        /**
         * Properties of an EnergyAck.
         * @memberof protocol
         * @interface IEnergyAck
         * @property {number|null} [energy] EnergyAck energy
         */

        /**
         * Constructs a new EnergyAck.
         * @memberof protocol
         * @classdesc Represents an EnergyAck.
         * @implements IEnergyAck
         * @constructor
         * @param {protocol.IEnergyAck=} [properties] Properties to set
         */
        function EnergyAck(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnergyAck energy.
         * @member {number} energy
         * @memberof protocol.EnergyAck
         * @instance
         */
        EnergyAck.prototype.energy = 0;

        /**
         * Creates a new EnergyAck instance using the specified properties.
         * @function create
         * @memberof protocol.EnergyAck
         * @static
         * @param {protocol.IEnergyAck=} [properties] Properties to set
         * @returns {protocol.EnergyAck} EnergyAck instance
         */
        EnergyAck.create = function create(properties) {
            return new EnergyAck(properties);
        };

        /**
         * Encodes the specified EnergyAck message. Does not implicitly {@link protocol.EnergyAck.verify|verify} messages.
         * @function encode
         * @memberof protocol.EnergyAck
         * @static
         * @param {protocol.IEnergyAck} message EnergyAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnergyAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.energy != null && Object.hasOwnProperty.call(message, "energy"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.energy);
            return writer;
        };

        /**
         * Decodes an EnergyAck message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.EnergyAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.EnergyAck} EnergyAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnergyAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.EnergyAck();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.energy = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for EnergyAck
         * @function getTypeUrl
         * @memberof protocol.EnergyAck
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnergyAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.EnergyAck";
        };

        return EnergyAck;
    })();

    protocol.Treasures = (function() {

        /**
         * Properties of a Treasures.
         * @memberof protocol
         * @interface ITreasures
         * @property {number|null} [round] Treasures round
         * @property {Array.<protocol.Treasures.ITreasure>|null} [list] Treasures list
         * @property {number|null} [odds] Treasures odds
         * @property {protocol.IJackpot|null} [jackpot] Treasures jackpot
         */

        /**
         * Constructs a new Treasures.
         * @memberof protocol
         * @classdesc Represents a Treasures.
         * @implements ITreasures
         * @constructor
         * @param {protocol.ITreasures=} [properties] Properties to set
         */
        function Treasures(properties) {
            this.list = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Treasures round.
         * @member {number} round
         * @memberof protocol.Treasures
         * @instance
         */
        Treasures.prototype.round = 0;

        /**
         * Treasures list.
         * @member {Array.<protocol.Treasures.ITreasure>} list
         * @memberof protocol.Treasures
         * @instance
         */
        Treasures.prototype.list = $util.emptyArray;

        /**
         * Treasures odds.
         * @member {number} odds
         * @memberof protocol.Treasures
         * @instance
         */
        Treasures.prototype.odds = 0;

        /**
         * Treasures jackpot.
         * @member {protocol.IJackpot|null|undefined} jackpot
         * @memberof protocol.Treasures
         * @instance
         */
        Treasures.prototype.jackpot = null;

        /**
         * Creates a new Treasures instance using the specified properties.
         * @function create
         * @memberof protocol.Treasures
         * @static
         * @param {protocol.ITreasures=} [properties] Properties to set
         * @returns {protocol.Treasures} Treasures instance
         */
        Treasures.create = function create(properties) {
            return new Treasures(properties);
        };

        /**
         * Encodes the specified Treasures message. Does not implicitly {@link protocol.Treasures.verify|verify} messages.
         * @function encode
         * @memberof protocol.Treasures
         * @static
         * @param {protocol.ITreasures} message Treasures message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Treasures.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.round != null && Object.hasOwnProperty.call(message, "round"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.round);
            if (message.list != null && message.list.length)
                for (var i = 0; i < message.list.length; ++i)
                    $root.protocol.Treasures.Treasure.encode(message.list[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.odds != null && Object.hasOwnProperty.call(message, "odds"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.odds);
            if (message.jackpot != null && Object.hasOwnProperty.call(message, "jackpot"))
                $root.protocol.Jackpot.encode(message.jackpot, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a Treasures message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.Treasures
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.Treasures} Treasures
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Treasures.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.Treasures();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.round = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.list && message.list.length))
                            message.list = [];
                        message.list.push($root.protocol.Treasures.Treasure.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.odds = reader.double();
                        break;
                    }
                case 4: {
                        message.jackpot = $root.protocol.Jackpot.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for Treasures
         * @function getTypeUrl
         * @memberof protocol.Treasures
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Treasures.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.Treasures";
        };

        Treasures.Treasure = (function() {

            /**
             * Properties of a Treasure.
             * @memberof protocol.Treasures
             * @interface ITreasure
             * @property {number|null} [id] Treasure id
             * @property {number|null} [odds] Treasure odds
             * @property {number|null} [point] Treasure point
             * @property {number|null} [multiply] Treasure multiply
             * @property {boolean|null} [addRound] Treasure addRound
             * @property {protocol.JackpotType|null} [jackpot] Treasure jackpot
             */

            /**
             * Constructs a new Treasure.
             * @memberof protocol.Treasures
             * @classdesc Represents a Treasure.
             * @implements ITreasure
             * @constructor
             * @param {protocol.Treasures.ITreasure=} [properties] Properties to set
             */
            function Treasure(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Treasure id.
             * @member {number} id
             * @memberof protocol.Treasures.Treasure
             * @instance
             */
            Treasure.prototype.id = 0;

            /**
             * Treasure odds.
             * @member {number} odds
             * @memberof protocol.Treasures.Treasure
             * @instance
             */
            Treasure.prototype.odds = 0;

            /**
             * Treasure point.
             * @member {number} point
             * @memberof protocol.Treasures.Treasure
             * @instance
             */
            Treasure.prototype.point = 0;

            /**
             * Treasure multiply.
             * @member {number} multiply
             * @memberof protocol.Treasures.Treasure
             * @instance
             */
            Treasure.prototype.multiply = 0;

            /**
             * Treasure addRound.
             * @member {boolean} addRound
             * @memberof protocol.Treasures.Treasure
             * @instance
             */
            Treasure.prototype.addRound = false;

            /**
             * Treasure jackpot.
             * @member {protocol.JackpotType} jackpot
             * @memberof protocol.Treasures.Treasure
             * @instance
             */
            Treasure.prototype.jackpot = 0;

            /**
             * Creates a new Treasure instance using the specified properties.
             * @function create
             * @memberof protocol.Treasures.Treasure
             * @static
             * @param {protocol.Treasures.ITreasure=} [properties] Properties to set
             * @returns {protocol.Treasures.Treasure} Treasure instance
             */
            Treasure.create = function create(properties) {
                return new Treasure(properties);
            };

            /**
             * Encodes the specified Treasure message. Does not implicitly {@link protocol.Treasures.Treasure.verify|verify} messages.
             * @function encode
             * @memberof protocol.Treasures.Treasure
             * @static
             * @param {protocol.Treasures.ITreasure} message Treasure message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Treasure.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                if (message.odds != null && Object.hasOwnProperty.call(message, "odds"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.odds);
                if (message.point != null && Object.hasOwnProperty.call(message, "point"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.point);
                if (message.multiply != null && Object.hasOwnProperty.call(message, "multiply"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.multiply);
                if (message.addRound != null && Object.hasOwnProperty.call(message, "addRound"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.addRound);
                if (message.jackpot != null && Object.hasOwnProperty.call(message, "jackpot"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.jackpot);
                return writer;
            };

            /**
             * Decodes a Treasure message from the specified reader or buffer.
             * @function decode
             * @memberof protocol.Treasures.Treasure
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {protocol.Treasures.Treasure} Treasure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Treasure.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.Treasures.Treasure();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.odds = reader.double();
                            break;
                        }
                    case 3: {
                            message.point = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.multiply = reader.double();
                            break;
                        }
                    case 5: {
                            message.addRound = reader.bool();
                            break;
                        }
                    case 6: {
                            message.jackpot = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for Treasure
             * @function getTypeUrl
             * @memberof protocol.Treasures.Treasure
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Treasure.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/protocol.Treasures.Treasure";
            };

            return Treasure;
        })();

        return Treasures;
    })();

    protocol.Jackpot = (function() {

        /**
         * Properties of a Jackpot.
         * @memberof protocol
         * @interface IJackpot
         * @property {protocol.JackpotType|null} [type] Jackpot type
         * @property {number|null} [coin] Jackpot coin
         */

        /**
         * Constructs a new Jackpot.
         * @memberof protocol
         * @classdesc Represents a Jackpot.
         * @implements IJackpot
         * @constructor
         * @param {protocol.IJackpot=} [properties] Properties to set
         */
        function Jackpot(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Jackpot type.
         * @member {protocol.JackpotType} type
         * @memberof protocol.Jackpot
         * @instance
         */
        Jackpot.prototype.type = 0;

        /**
         * Jackpot coin.
         * @member {number} coin
         * @memberof protocol.Jackpot
         * @instance
         */
        Jackpot.prototype.coin = 0;

        /**
         * Creates a new Jackpot instance using the specified properties.
         * @function create
         * @memberof protocol.Jackpot
         * @static
         * @param {protocol.IJackpot=} [properties] Properties to set
         * @returns {protocol.Jackpot} Jackpot instance
         */
        Jackpot.create = function create(properties) {
            return new Jackpot(properties);
        };

        /**
         * Encodes the specified Jackpot message. Does not implicitly {@link protocol.Jackpot.verify|verify} messages.
         * @function encode
         * @memberof protocol.Jackpot
         * @static
         * @param {protocol.IJackpot} message Jackpot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Jackpot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.coin);
            return writer;
        };

        /**
         * Decodes a Jackpot message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.Jackpot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.Jackpot} Jackpot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Jackpot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.Jackpot();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 3: {
                        message.coin = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for Jackpot
         * @function getTypeUrl
         * @memberof protocol.Jackpot
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Jackpot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.Jackpot";
        };

        return Jackpot;
    })();

    /**
     * JackpotType enum.
     * @name protocol.JackpotType
     * @enum {number}
     * @property {number} None=0 None value
     * @property {number} Grand=1 Grand value
     * @property {number} Major=2 Major value
     * @property {number} Minor=3 Minor value
     * @property {number} Mini=4 Mini value
     */
    protocol.JackpotType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        values[valuesById[1] = "Grand"] = 1;
        values[valuesById[2] = "Major"] = 2;
        values[valuesById[3] = "Minor"] = 3;
        values[valuesById[4] = "Mini"] = 4;
        return values;
    })();

    protocol.JackpotAck = (function() {

        /**
         * Properties of a JackpotAck.
         * @memberof protocol
         * @interface IJackpotAck
         * @property {number|null} [coin] JackpotAck coin
         */

        /**
         * Constructs a new JackpotAck.
         * @memberof protocol
         * @classdesc Represents a JackpotAck.
         * @implements IJackpotAck
         * @constructor
         * @param {protocol.IJackpotAck=} [properties] Properties to set
         */
        function JackpotAck(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JackpotAck coin.
         * @member {number} coin
         * @memberof protocol.JackpotAck
         * @instance
         */
        JackpotAck.prototype.coin = 0;

        /**
         * Creates a new JackpotAck instance using the specified properties.
         * @function create
         * @memberof protocol.JackpotAck
         * @static
         * @param {protocol.IJackpotAck=} [properties] Properties to set
         * @returns {protocol.JackpotAck} JackpotAck instance
         */
        JackpotAck.create = function create(properties) {
            return new JackpotAck(properties);
        };

        /**
         * Encodes the specified JackpotAck message. Does not implicitly {@link protocol.JackpotAck.verify|verify} messages.
         * @function encode
         * @memberof protocol.JackpotAck
         * @static
         * @param {protocol.IJackpotAck} message JackpotAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JackpotAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.coin);
            return writer;
        };

        /**
         * Decodes a JackpotAck message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.JackpotAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.JackpotAck} JackpotAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JackpotAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.JackpotAck();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.coin = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for JackpotAck
         * @function getTypeUrl
         * @memberof protocol.JackpotAck
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JackpotAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.JackpotAck";
        };

        return JackpotAck;
    })();

    protocol.JackpotHistory = (function() {

        /**
         * Properties of a JackpotHistory.
         * @memberof protocol
         * @interface IJackpotHistory
         * @property {Array.<protocol.JackpotHistory.IJp>|null} [list] JackpotHistory list
         * @property {protocol.JackpotHistory.IJp|null} [grand] JackpotHistory grand
         */

        /**
         * Constructs a new JackpotHistory.
         * @memberof protocol
         * @classdesc Represents a JackpotHistory.
         * @implements IJackpotHistory
         * @constructor
         * @param {protocol.IJackpotHistory=} [properties] Properties to set
         */
        function JackpotHistory(properties) {
            this.list = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JackpotHistory list.
         * @member {Array.<protocol.JackpotHistory.IJp>} list
         * @memberof protocol.JackpotHistory
         * @instance
         */
        JackpotHistory.prototype.list = $util.emptyArray;

        /**
         * JackpotHistory grand.
         * @member {protocol.JackpotHistory.IJp|null|undefined} grand
         * @memberof protocol.JackpotHistory
         * @instance
         */
        JackpotHistory.prototype.grand = null;

        /**
         * Creates a new JackpotHistory instance using the specified properties.
         * @function create
         * @memberof protocol.JackpotHistory
         * @static
         * @param {protocol.IJackpotHistory=} [properties] Properties to set
         * @returns {protocol.JackpotHistory} JackpotHistory instance
         */
        JackpotHistory.create = function create(properties) {
            return new JackpotHistory(properties);
        };

        /**
         * Encodes the specified JackpotHistory message. Does not implicitly {@link protocol.JackpotHistory.verify|verify} messages.
         * @function encode
         * @memberof protocol.JackpotHistory
         * @static
         * @param {protocol.IJackpotHistory} message JackpotHistory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JackpotHistory.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.list.length)
                for (var i = 0; i < message.list.length; ++i)
                    $root.protocol.JackpotHistory.Jp.encode(message.list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.grand != null && Object.hasOwnProperty.call(message, "grand"))
                $root.protocol.JackpotHistory.Jp.encode(message.grand, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a JackpotHistory message from the specified reader or buffer.
         * @function decode
         * @memberof protocol.JackpotHistory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protocol.JackpotHistory} JackpotHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JackpotHistory.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.JackpotHistory();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.list && message.list.length))
                            message.list = [];
                        message.list.push($root.protocol.JackpotHistory.Jp.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.grand = $root.protocol.JackpotHistory.Jp.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for JackpotHistory
         * @function getTypeUrl
         * @memberof protocol.JackpotHistory
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JackpotHistory.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protocol.JackpotHistory";
        };

        JackpotHistory.Jp = (function() {

            /**
             * Properties of a Jp.
             * @memberof protocol.JackpotHistory
             * @interface IJp
             * @property {number|null} [type] Jp type
             * @property {string|null} [name] Jp name
             * @property {number|null} [coin] Jp coin
             * @property {Long|null} [create] Jp create
             */

            /**
             * Constructs a new Jp.
             * @memberof protocol.JackpotHistory
             * @classdesc Represents a Jp.
             * @implements IJp
             * @constructor
             * @param {protocol.JackpotHistory.IJp=} [properties] Properties to set
             */
            function Jp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Jp type.
             * @member {number} type
             * @memberof protocol.JackpotHistory.Jp
             * @instance
             */
            Jp.prototype.type = 0;

            /**
             * Jp name.
             * @member {string} name
             * @memberof protocol.JackpotHistory.Jp
             * @instance
             */
            Jp.prototype.name = "";

            /**
             * Jp coin.
             * @member {number} coin
             * @memberof protocol.JackpotHistory.Jp
             * @instance
             */
            Jp.prototype.coin = 0;

            /**
             * Jp create.
             * @member {Long} create
             * @memberof protocol.JackpotHistory.Jp
             * @instance
             */
            Jp.prototype.create = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Jp instance using the specified properties.
             * @function create
             * @memberof protocol.JackpotHistory.Jp
             * @static
             * @param {protocol.JackpotHistory.IJp=} [properties] Properties to set
             * @returns {protocol.JackpotHistory.Jp} Jp instance
             */
            Jp.create = function create(properties) {
                return new Jp(properties);
            };

            /**
             * Encodes the specified Jp message. Does not implicitly {@link protocol.JackpotHistory.Jp.verify|verify} messages.
             * @function encode
             * @memberof protocol.JackpotHistory.Jp
             * @static
             * @param {protocol.JackpotHistory.IJp} message Jp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Jp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.type);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.coin != null && Object.hasOwnProperty.call(message, "coin"))
                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.coin);
                if (message.create != null && Object.hasOwnProperty.call(message, "create"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.create);
                return writer;
            };

            /**
             * Decodes a Jp message from the specified reader or buffer.
             * @function decode
             * @memberof protocol.JackpotHistory.Jp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {protocol.JackpotHistory.Jp} Jp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Jp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protocol.JackpotHistory.Jp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.name = reader.string();
                            break;
                        }
                    case 3: {
                            message.coin = reader.double();
                            break;
                        }
                    case 4: {
                            message.create = reader.int64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for Jp
             * @function getTypeUrl
             * @memberof protocol.JackpotHistory.Jp
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Jp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/protocol.JackpotHistory.Jp";
            };

            return Jp;
        })();

        return JackpotHistory;
    })();

    return protocol;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type_url = reader.string();
                            break;
                        }
                    case 2: {
                            message.value = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for Any
             * @function getTypeUrl
             * @memberof google.protobuf.Any
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Any.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Any";
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
