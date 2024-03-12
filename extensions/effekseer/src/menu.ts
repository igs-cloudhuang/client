import { AssetInfo } from "../@types/packages/asset-db/@types/public";
import { ExecuteSceneScriptMethodOptions } from "../@types/packages/scene/@types/public";

import * as path from "path"

export function onAssetMenu(info: AssetInfo) {
    if (path.extname(info.name) != '.efkefc' && path.extname(info.name) != '.efk') {
        return [];
    }
    return [
        {
            label: '导入 efk 特效',
            click: async () => {
                const options: ExecuteSceneScriptMethodOptions = {
                    name: "effekseer",
                    method: 'efk_new',
                    args: [
                        info.uuid,
                        info.name,
                        info.file,
                        info.url
                    ]
                };

                return await Editor.Message.request('scene', 'execute-scene-script', options);
            },
            // submenu: []
        }
    ]
}