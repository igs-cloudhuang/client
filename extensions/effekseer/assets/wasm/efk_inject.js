
const load_wasm = function (err, data, cb) {
    if (!effekseer170b) {
        cb(err, data);
        return;
    }

    // fix browser preview
    if (window.effekseer170b_preview) {
        return effekseer170b_preview(err, data, cb)
    }

    effekseer170b({ wasmBinary: data }).then((module) => {
        // @ts-ignore
        window.efk = {
            effekseer: new module.effekseer,
        };
        cb(err, data);
    }).catch(e => {
        console.error(e);
        cb(err, data);
    })
}

const pre_download = function (url, options, onComplete) {
    // @ts-ignore
    cc.assetManager.downloader._downloaders[".bin"](url, options, (err, data) => {
        load_wasm(err, data, (err, data) => {
            window.efk.RendererShaderType = {
                Unlit: 0,
                Lit: 1,
                BackDistortion: 2,
                AdvancedUnlit: 3,
                AdvancedLit: 4,
                AdvancedBackDistortion: 5,
                Material: 6,
            }
            window.efk.AlphaBlendType = {
                Opacity: 0,
                Blend: 1,
                Add: 2,
                Sub: 3,
                Mul: 4,
            }
            window.efk.RendererMode = {
                Sprite: 0,
                Model: 1
            }
            window.efk.TextureFilterType = {
                Nearest: 0,
                Linear: 1,
            }
            window.efk.CullingType = {
                Front: 0,
                Back: 1,
                Double: 2
            }
            onComplete(err, data);
        });
    });
}

const parse = function (url, options, onComplete) {
    // @ts-ignore
    cc.assetManager.parser._parsers[".bin"](url, options, onComplete);
}

const download = function (url, options, onComplete) {
    // @ts-ignore
    cc.assetManager.downloader._downloaders[".bin"](url, options, onComplete);
}

// @ts-ignore
if (window.jsb) {
    cc.assetManager.parser.register('.efkwasm', parse);
    cc.assetManager.parser.register('.efkmodel', parse);
    cc.assetManager.parser.register('.efkmat', parse);
    cc.assetManager.parser.register('.efkefc', parse);
    cc.assetManager.parser.register('.efk', parse);
    cc.assetManager.downloader.register('.efkwasm', download);

    efk.RendererShaderType = {
        Unlit: 0,
        Lit: 1,
        BackDistortion: 2,
        AdvancedUnlit: 3,
        AdvancedLit: 4,
        AdvancedBackDistortion: 5,
        Material: 6,
    }
    efk.AlphaBlendType = {
        Opacity: 0,
        Blend: 1,
        Add: 2,
        Sub: 3,
        Mul: 4,
    }
    efk.RendererMode = {
        Sprite: 0,
        Model: 1
    }
    efk.TextureFilterType = {
        Nearest: 0,
        Linear: 1,
    }
    efk.CullingType = {
        Front: 0,
        Back: 1,
        Double: 2
    }
}
else {
    cc.assetManager.downloader.register('.efkwasm', pre_download);
}

cc.assetManager.downloader.register('.efkmodel', download);
cc.assetManager.downloader.register('.efkmat', download);
cc.assetManager.downloader.register('.efkefc', download);
cc.assetManager.downloader.register('.efk', download);
