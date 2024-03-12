export default function (efk_name: string, efk_com_uuid: string, efk_uuid: string, efkModels_uuids: string[], efkTextures_uuids: string[], efkMats_uuids: string[], efkMaterial_uuids: string[]) {
    let _efkModels = [] as {
        __uuid__: string,
        __expectedType__: "cc.Asset"
    }[];

    let _efkMats = [] as {
        __uuid__: string,
        __expectedType__: "cc.Asset"
    }[];

    let _efkTextures = [] as {
        __uuid__: string,
        __expectedType__: "cc.Texture2D"
    }[];

    let _efkMaterial = [] as {
        __uuid__: string,
        __expectedType__: "cc.Material"
    }[];

    let _efk = {
        __uuid__: efk_uuid,
        __expectedType__: "cc.Asset"
    }

    efkModels_uuids.forEach(uuid => {
        _efkModels.push({
            __uuid__: uuid,
            __expectedType__: "cc.Asset"
        })
    });

    efkMats_uuids.forEach(uuid => {
        _efkMats.push({
            __uuid__: uuid,
            __expectedType__: "cc.Asset"
        })
    });

    efkTextures_uuids.forEach(uuid => {
        _efkTextures.push({
            __uuid__: uuid,
            __expectedType__: "cc.Texture2D"
        })
    });

    efkMaterial_uuids.forEach(uuid => {
        _efkMaterial.push({
            __uuid__: uuid,
            __expectedType__: "cc.Material"
        })
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
            "_repeat": false,
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
            "_materials": _efkMaterial,
            "_visFlags": 0,
            "_efk": _efk,
            "efkModels": _efkModels,
            "efkTextures": _efkTextures,
            "efkMats": _efkMats,
            "efkConfig": {
                "__uuid__": "6b7033b8-a9a2-4026-9cef-cace182c35fb",
                "__expectedType__": "cc.Prefab"
            },
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
