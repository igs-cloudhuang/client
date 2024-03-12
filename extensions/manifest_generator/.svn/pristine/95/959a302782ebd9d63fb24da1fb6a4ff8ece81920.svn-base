
import { BuildPlugin } from '../@types';

export const load: BuildPlugin.load = function() {
    console.debug('manifest_generator load');
};

export const unload: BuildPlugin.load = function() {
    console.debug('manifest_generator unload');
};

export const configs: BuildPlugin.Configs = {
    '*': {
        hooks: './hooks',
        options: {
        },
        verifyRuleMap: {
        },
    },
};

// export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
