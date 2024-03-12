"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(efk_name, efk_com_uuid, efk_uuid, efkModels_uuids, efkTextures_uuids) {
    let _efkModels = [];
    let _efkTextures = [];
    let _efk = {
        __uuid__: efk_uuid,
        __expectedType__: "cc.Asset"
    };
    efkModels_uuids.forEach(uuid => {
        _efkModels.unshift({
            __uuid__: uuid,
            __expectedType__: "cc.Asset"
        });
    });
    efkTextures_uuids.forEach(uuid => {
        _efkTextures.unshift({
            __uuid__: uuid,
            __expectedType__: "cc.Texture2D"
        });
    });
    return [
        {
            "__type__": "cc.Prefab",
            "_name": efk_name,
            "_objFlags": 0,
            "_native": "",
            "data": {
                "__id__": 1
            },
            "optimizationPolicy": 0,
            "persistent": false,
            "asyncLoadAssets": false
        },
        {
            "__type__": "cc.Node",
            "_name": efk_name,
            "_objFlags": 0,
            "__editorExtras__": {},
            "_parent": null,
            "_children": [],
            "_active": true,
            "_components": [
                {
                    "__id__": 2
                }
            ],
            "_prefab": {
                "__id__": 4
            },
            "_lpos": {
                "__type__": "cc.Vec3",
                "x": 0,
                "y": 0,
                "z": 0
            },
            "_lrot": {
                "__type__": "cc.Quat",
                "x": 0,
                "y": 0,
                "z": 0,
                "w": 1
            },
            "_lscale": {
                "__type__": "cc.Vec3",
                "x": 1.0,
                "y": 1.0,
                "z": 1.0
            },
            "_layer": 1073741824,
            "_euler": {
                "__type__": "cc.Vec3",
                "x": 0,
                "y": 0,
                "z": 0
            },
            "_id": ""
        },
        {
            "__type__": efk_com_uuid,
            "_name": "",
            "_objFlags": 0,
            "node": {
                "__id__": 1
            },
            "_enabled": true,
            "__prefab": {
                "__id__": 3
            },
            "_materials": [],
            "_visFlags": 0,
            "_efk": _efk,
            "efkModels": _efkModels,
            "efkTextures": _efkTextures,
            "_id": ""
        },
        {
            "__type__": "cc.CompPrefabInfo",
            "fileId": Editor.Utils.UUID.generate()
        },
        {
            "__type__": "cc.PrefabInfo",
            "root": {
                "__id__": 1
            },
            "asset": {
                "__id__": 0
            },
            "fileId": Editor.Utils.UUID.generate()
        }
    ];
}
exports.default = default_1;
