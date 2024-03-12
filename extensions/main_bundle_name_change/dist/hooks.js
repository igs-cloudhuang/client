"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onBeforeBuild = exports.load = exports.throwError = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PACKAGE_NAME = 'main_bundle_name_change';
function log(...arg) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}
function error(msg) {
    return console.error(`[${PACKAGE_NAME}]${msg}`);
}
let allAssets = [];
exports.throwError = true;
const load = function () {
    return __awaiter(this, void 0, void 0, function* () {
        allAssets = yield Editor.Message.request('asset-db', 'query-assets');
    });
};
exports.load = load;
const onBeforeBuild = function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        if (!options.experimentalEraseModules && options.packages[PACKAGE_NAME].enabled) {
            error(Editor.I18n.t(PACKAGE_NAME + '.exception.disableEraseModules'));
            throw -1;
        }
    });
};
exports.onBeforeBuild = onBeforeBuild;
const onBeforeCompressSettings = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
    });
};
exports.onBeforeCompressSettings = onBeforeCompressSettings;
const onAfterCompressSettings = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
    });
};
exports.onAfterCompressSettings = onAfterCompressSettings;
const onAfterBuild = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        let opt = options.packages[PACKAGE_NAME];
        if (opt.enabled) {
            if (opt.bundleName == null || opt.bundleName.length == 0) {
                error(Editor.I18n.t(PACKAGE_NAME + '.exception.nullBundleName'));
                throw -1;
            }
            log(Editor.I18n.t(PACKAGE_NAME + '.phase.start'));
            let bundleName = opt.bundleName;
            let mainBundlePath = path_1.default.join(result.paths.dir, "assets/main");
            let fileList = fs_1.default.readdirSync(mainBundlePath);
            let mainJsPath = "";
            fileList.forEach((fileName) => {
                if (fileName.match(/index.[\w]+.js/) != null) {
                    mainJsPath = path_1.default.join(mainBundlePath, fileName);
                    log(`find index.js in ${mainJsPath}`);
                }
            });
            let rawData = fs_1.default.readFileSync(mainJsPath);
            let rawStr = rawData.toString('utf-8');
            rawStr = `window.bundleName=(location.href.indexOf("https://")>-1&&new URL(location.href).pathname.indexOf("/${bundleName}/")==0)?"main":"${bundleName}";\n` + rawStr;
            rawStr = rawStr.replace(`System.register("chunks:///main.js",`, `System.register("chunks:///"+window.bundleName+".js",`);
            rawStr = rawStr.replace(`r('virtual:///prerequisite-imports/main', 'chunks:///main.js');`, `r('virtual:///prerequisite-imports/'+window.bundleName, 'chunks:///'+window.bundleName+'.js');`);
            fs_1.default.writeFileSync(mainJsPath, rawStr, { encoding: "utf-8" });
            log(Editor.I18n.t(PACKAGE_NAME + '.phase.compelete'));
        }
    });
};
exports.onAfterBuild = onAfterBuild;
const unload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
    });
};
exports.unload = unload;
