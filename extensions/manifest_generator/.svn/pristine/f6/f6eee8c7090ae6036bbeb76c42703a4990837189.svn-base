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
const PACKAGE_NAME = 'manifest_generator';
function log(...arg) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
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
        log(Editor.I18n.t('manifest_generator.phase.start'));
        // 3.4.2 取不到 result.settings (undefined), 只能直接掃產出的bundle資料夾了
        let assetPath = path_1.default.join(result.paths.dir, "assets");
        let fileList = fs_1.default.readdirSync(assetPath);
        let output = {};
        fileList.forEach((bundleName) => {
            let bundlePath = path_1.default.join(assetPath, bundleName);
            if (fs_1.default.lstatSync(bundlePath).isDirectory()) {
                let bundleFileList = fs_1.default.readdirSync(bundlePath);
                bundleFileList.forEach((name) => {
                    if (name.match(/index.[\w]+.js/) != null) {
                        output[bundleName] = name.split(".")[1];
                    }
                });
            }
        });
        // 獲取 bundle.js md5
        let bundleJsPath = path_1.default.join(result.paths.dir, "src/chunks");
        if (fs_1.default.existsSync(bundleJsPath)) {
            let bundleJsFileList = fs_1.default.readdirSync(bundleJsPath);
            bundleJsFileList.forEach((name) => {
                if (name.match(/bundle.[\w]+.js/) != null) {
                    output["bundle.js"] = name.split(".")[1];
                }
            });
        }
        else {
            log("no bundle.js can get");
        }
        let manifestPath = path_1.default.join(assetPath, 'versions.json');
        fs_1.default.writeFileSync(manifestPath, JSON.stringify(output));
        log(Editor.I18n.t('manifest_generator.phase.compelete'));
    });
};
exports.onAfterBuild = onAfterBuild;
const unload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
    });
};
exports.unload = unload;
