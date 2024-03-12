import { IBuildTaskOption, BuildHook, IBuildResult } from '../@types';
import fs from "fs"
import path from 'path';

const PACKAGE_NAME = 'main_bundle_name_change';

function log(...arg: any[]) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

function error(msg: string) {
    return console.error(`[${PACKAGE_NAME}]${msg}`);
}

let allAssets = [];

interface options {
    enabled: boolean;
    bundleName: string;
}

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    allAssets = await Editor.Message.request('asset-db', 'query-assets');
};

export const onBeforeBuild: BuildHook.onAfterBuild = async function (options) {
    // Todo some thing
    if (!options.experimentalEraseModules && options.packages[PACKAGE_NAME].enabled) {
        error(Editor.I18n.t(PACKAGE_NAME + '.exception.disableEraseModules'));
        throw -1;
    }
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function (options, result) {
    // Todo some thing
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function (options, result) {
    // Todo some thing
};

export const onAfterBuild: BuildHook.onAfterBuild = async function (options, result) {
    let opt: options = options.packages[PACKAGE_NAME];
    if (opt.enabled) {
        if (opt.bundleName == null || opt.bundleName.length == 0) {
            error(Editor.I18n.t(PACKAGE_NAME + '.exception.nullBundleName'));
            throw -1;
        }
        log(Editor.I18n.t(PACKAGE_NAME + '.phase.start'));
        let bundleName = opt.bundleName;
        let mainBundlePath = path.join(result.paths.dir, "assets/main");
        let fileList = fs.readdirSync(mainBundlePath);
        let mainJsPath = "";
        fileList.forEach((fileName) => {
            if (fileName.match(/index.[\w]+.js/) != null) {
                mainJsPath = path.join(mainBundlePath, fileName);
                log(`find index.js in ${mainJsPath}`)
            }
        })
        let rawData = fs.readFileSync(mainJsPath);
        let rawStr = rawData.toString('utf-8');
        rawStr = `window.bundleName=(location.href.indexOf("https://")>-1&&new URL(location.href).pathname.indexOf("/${bundleName}/")==0)?"main":"${bundleName}";\n` + rawStr;
        rawStr = rawStr.replace(`System.register("chunks:///main.js",`, `System.register("chunks:///"+window.bundleName+".js",`);
        rawStr = rawStr.replace(`r('virtual:///prerequisite-imports/main', 'chunks:///main.js');`, `r('virtual:///prerequisite-imports/'+window.bundleName, 'chunks:///'+window.bundleName+'.js');`);
        fs.writeFileSync(mainJsPath, rawStr, { encoding: "utf-8" });
        log(Editor.I18n.t(PACKAGE_NAME + '.phase.compelete'));
    }
};

export const unload: BuildHook.unload = async function () {
    console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
};
