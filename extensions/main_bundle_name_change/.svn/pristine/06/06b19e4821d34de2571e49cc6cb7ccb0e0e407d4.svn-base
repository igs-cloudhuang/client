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
        options: {
            enabled: {
                label: 'i18n:main_bundle_name_change.options.enabledlabel',
                description: "i18n:main_bundle_name_change.options.enabledDescription",
                render: {
                    ui: "ui-checkbox",
                },
            },
            bundleName: {
                label: 'bundleName',
                description: "i18n:main_bundle_name_change.options.bundleNameDescription",
                default: "",
                render: {
                    ui: "ui-input",
                    attributes: {
                        placeholder: "i18n:main_bundle_name_change.options.bundleNamePlaceholder",
                    },
                },
            },
        },
    },
};
// export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
