import { IBuildTaskOption, BuildHook, IBuildResult } from '../@types';
import fs from "fs"
import path from 'path';

const PACKAGE_NAME = 'manifest_generator';

function log(...arg: any[]) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

let allAssets = [];

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    allAssets = await Editor.Message.request('asset-db', 'query-assets');
};

export const onBeforeBuild: BuildHook.onAfterBuild = async function (options) {
    // Todo some thing
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function (options, result) {
    // Todo some thing
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function (options, result) {
    // Todo some thing
};

export const onAfterBuild: BuildHook.onAfterBuild = async function (options, result) {
    log(Editor.I18n.t('manifest_generator.phase.start'));
    // 3.4.2 取不到 result.settings (undefined), 只能直接掃產出的bundle資料夾了
    let assetPath = path.join(result.paths.dir, "assets");
    let fileList = fs.readdirSync(assetPath);
    let output: { [k: string]: string } = {};
    fileList.forEach((bundleName) => {
        let bundlePath = path.join(assetPath, bundleName);
        if (fs.lstatSync(bundlePath).isDirectory()) {
            let bundleFileList = fs.readdirSync(bundlePath);
            bundleFileList.forEach((name) => {
                if (name.match(/index.[\w]+.js/) != null) {
                    output[bundleName] = name.split(".")[1];
                }
            })
        }
    });

    // 獲取 bundle.js md5
    let bundleJsPath = path.join(result.paths.dir, "src/chunks");
    if (fs.existsSync(bundleJsPath)) {
        let bundleJsFileList = fs.readdirSync(bundleJsPath);
        bundleJsFileList.forEach((name) => {
            if (name.match(/bundle.[\w]+.js/) != null) {
                output["bundle.js"] = name.split(".")[1];
            }
        })
    } else {
        log("no bundle.js can get");
    }

    let manifestPath = path.join(assetPath, 'versions.json');
    fs.writeFileSync(manifestPath, JSON.stringify(output));
    log(Editor.I18n.t('manifest_generator.phase.compelete'));
};

export const unload: BuildHook.unload = async function () {
    console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
};
