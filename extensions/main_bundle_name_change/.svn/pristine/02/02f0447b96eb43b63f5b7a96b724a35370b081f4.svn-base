
import { BuildPlugin } from '../@types';

export const load: BuildPlugin.load = function () {
    console.debug('manifest_generator load');
};

export const unload: BuildPlugin.load = function () {
    console.debug('manifest_generator unload');
};

export const configs: BuildPlugin.Configs = {
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
