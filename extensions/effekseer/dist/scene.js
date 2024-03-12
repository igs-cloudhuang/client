"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.unload = exports.load = void 0;
const efk_1 = __importDefault(require("./template/efk"));
const efkmat_1 = require("./template/efkmat");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const loadModelEFK = require("../wasm/effekseer.js");
let effekseer = null;
async function load_wasm() {
    if (effekseer)
        return effekseer;
    const buffer = fs.readFileSync(path.join(__dirname, "../wasm/effekseer.wasm"));
    await loadModelEFK({ wasmBinary: buffer.buffer }).then((module) => {
        effekseer = new module.effekseer;
        effekseer.init(8192, 8192, 1, 1, 1, 1);
    }).catch(e => {
        console.error(e);
    });
    return effekseer;
}
function load_ext(ext, subdir, baseUrl, ret) {
    let fiels = fs.readdirSync(subdir);
    for (let i = 0; i < fiels.length; ++i) {
        let url = subdir + fiels[i];
        let state = fs.statSync(url);
        if (path.extname(url) == ext) {
            url = url.replace(/\\/g, "/");
            let file = url.replace(baseUrl, '');
            ret[file] = fs.readFileSync(url);
        }
        else {
            if (state.isDirectory()) {
                load_ext(ext, subdir + fiels[i] + '/', baseUrl, ret);
            }
        }
    }
    ;
    return ret;
}
function load_efkmat(efkfile) {
    const ret = {};
    const baseUrl = path.dirname(efkfile).replace(/\\/g, "/") + '/';
    load_ext('.efkmat', baseUrl, baseUrl, ret);
    return ret;
}
function load_efkmodel(efkfile) {
    const ret = {};
    const baseUrl = path.dirname(efkfile).replace(/\\/g, "/") + '/';
    load_ext('.efkmodel', baseUrl, baseUrl, ret);
    return ret;
}
function load() { }
exports.load = load;
;
function unload() { }
exports.unload = unload;
;
exports.methods = {
    install: async function (efk_uuid, name, file, url) {
        const from = path.join(Editor.Project.path, "extensions/effekseer/engine/native");
        const to = path.join(path.dirname(Editor.App.path), "resources/3d/engine/native");
        console.log(from, to);
        var copy_files = function (src, dst) {
            let names = fs.readdirSync(src);
            names.forEach(function (name) {
                var name_src = path.join(src, name);
                var name_dst = path.join(dst, name);
                var stat = fs.statSync(name_src);
                if (stat.isFile()) {
                    let readable = fs.createReadStream(name_src);
                    let writable = fs.createWriteStream(name_dst);
                    readable.pipe(writable);
                }
                else if (stat.isDirectory()) {
                    try {
                        fs.accessSync(name_dst, fs.constants.F_OK);
                    }
                    catch (error) {
                        fs.mkdirSync(name_dst);
                    }
                    copy_files(name_src, name_dst);
                }
            });
        };
        copy_files(from, to);
        await new Promise((resolve, reject) => {
            const py = (0, child_process_1.spawn)('python', ['genbindings.py', '--config', 'effekseer.ini'], { cwd: path.join(path.dirname(Editor.App.path), "resources/3d/engine/native/tools/tojs") });
            py.stdout.on('data', function (res) {
                let data = res.toString();
                console.log(data);
            });
            py.stderr.on('data', function (res) {
                let data = res.toString();
                console.error(data);
            });
            py.on('close', (code) => {
                return resolve(null);
            });
        });
    },
    efk_new: async function (efk_uuid, name, file, url) {
        // 加载 efk 解析库
        await load_wasm();
        // 加载 efk 材质文件
        let mat = load_efkmat(file);
        // 加载 efk 模型文件
        let models = load_efkmodel(file);
        let texture_names = [];
        effekseer.setTextureLoaderEvent((key, src) => {
            texture_names.push(src);
            return texture_names.length;
        }, (id) => { });
        let single = null;
        let materials = [];
        effekseer.setMaterialLoaderEvent((key, src) => {
            single = {
                src: src,
                shaders: [],
            };
            materials.push(single);
            let buf = mat[src];
            if (!buf)
                console.error('miss material, ', src);
            return buf;
        }, (key, src) => {
            debugger;
        }, (key, shader, type) => {
            let uniforms = {};
            for (let i = 0; i < shader.getUniformCount(); ++i) {
                uniforms[shader.getUniform(i)] = 1;
            }
            single.shaders[type] = {
                vs: shader.vs,
                fs: shader.fs,
                uniforms: Object.keys(uniforms)
            };
        });
        let model_names = [];
        effekseer.setModelLoaderEvent((key, src) => {
            model_names.push(src);
            let buf = models[src].buffer;
            if (!buf)
                console.error('miss model, ', src);
            return buf;
        }, (key, model) => { }, (key, src) => { });
        const buffer = fs.readFileSync(file);
        effekseer.loadEffectOnMemory(buffer, efk_uuid, 1.0);
        const baseUrl = path.dirname(url);
        for (let i = 0; i < texture_names.length; ++i) {
            texture_names[i] = await Editor.Message.request("asset-db", "query-uuid", baseUrl + "/" + texture_names[i] + "/texture");
        }
        for (let i = 0; i < model_names.length; ++i) {
            model_names[i] = await Editor.Message.request("asset-db", "query-uuid", baseUrl + "/" + model_names[i]);
        }
        let material_names = [];
        let efkmat_names = [];
        for (let i in materials) {
            let mat = materials[i];
            let shaders = mat.shaders;
            let effect = (0, efkmat_1.EFK_EFFECT)(shaders);
            // 获取 .efkmat 文件 uuid
            let uuid = await Editor.Message.request("asset-db", "query-uuid", path.dirname(url) + '/' + mat.src);
            efkmat_names.push(uuid);
            // 生成 .effect 文件
            let dest = path.dirname(file) + '/' + mat.src.replace('.efkmat', '.effect');
            fs.writeFileSync(dest, effect, 'utf-8');
            await Editor.Message.request("asset-db", "refresh-asset", dest);
            // 生成 .material 文件
            uuid = await Editor.Message.request("asset-db", "query-uuid", path.dirname(url) + '/' + mat.src.replace('.efkmat', '.effect'));
            let material = (0, efkmat_1.EFK_MATERIAL)(uuid);
            let dest2 = path.dirname(file) + '/' + mat.src.replace('.efkmat', '.mtl');
            fs.writeFileSync(dest2, material, 'utf-8');
            await Editor.Message.request("asset-db", "refresh-asset", dest2);
            uuid = await Editor.Message.request("asset-db", "query-uuid", path.dirname(url) + '/' + mat.src.replace('.efkmat', '.mtl'));
            material_names.push(uuid);
        }
        ;
        // @ts-ignore
        const com_uuid = cc.js._getClassId(cc.js.getClassByName("EFKComponent"));
        const efk_prefab = (0, efk_1.default)(path.basename(name, '.efk'), com_uuid, efk_uuid, model_names, texture_names, efkmat_names, material_names);
        // 生成 .prefab 文件
        file = file.replace('.efkefc', '.prefab').replace('.efk', '.prefab');
        fs.writeFileSync(file, JSON.stringify(efk_prefab), 'utf-8');
        await Editor.Message.request("asset-db", "refresh-asset", file);
    }
};
