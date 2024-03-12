"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.unload = exports.load = void 0;
const load = function () {
    console.debug('manifest_generator load');
};
exports.load = load;
const unload = function () {
    console.debug('manifest_generator unload');
};
exports.unload = unload;
exports.configs = {
    '*': {
        hooks: './hooks',
        options: {},
        verifyRuleMap: {},
    },
};
// export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
