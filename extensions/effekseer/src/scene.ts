
import EFK from "./template/efk"
import { EFK_EFFECT, EFK_MATERIAL } from "./template/efkmat"
import * as path from "path"
import * as fs from "fs"
import { exec, spawn } from "child_process";


type effekseer170b = (param: { wasmBinary: ArrayBuffer }) => Promise<any>;
const loadModelEFK: effekseer170b = require("../wasm/effekseer.js")

let effekseer: any = null!;

async function load_wasm(): Promise<any> {
    if (effekseer) return effekseer;
    const buffer = fs.readFileSync(path.join(__dirname, "../wasm/effekseer.wasm"));
    await loadModelEFK({ wasmBinary: buffer.buffer }).then((module) => {
        effekseer = new module.effekseer;
        effekseer.init(8192, 8192, 1, 1, 1, 1);
    }).catch(e => {
        console.error(e);
    });
    return effekseer;
}

function load_ext(ext: string, subdir: string, baseUrl: string, ret: any) {
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
    };
    return ret;
}

function load_efkmat(efkfile: string) {
    const ret = {} as any;
    const baseUrl = path.dirname(efkfile).replace(/\\/g, "/") + '/';
    load_ext('.efkmat', baseUrl, baseUrl, ret);
    return ret;
}

function load_efkmodel(efkfile: string) {
    const ret = {} as any;
    const baseUrl = path.dirname(efkfile).replace(/\\/g, "/") + '/';
    load_ext('.efkmodel', baseUrl, baseUrl, ret);
    return ret;
}

export function load() { };
export function unload() { };

export const methods = {
    install: async function (efk_uuid: string, name: string, file: string, url: string) {
        const from = path.join(Editor.Project.path, "extensions/effekseer/engine/native");
        const to = path.join(path.dirname(Editor.App.path), "resources/3d/engine/native");

        console.log(from, to);

        var copy_files = function (src: string, dst: string) {
            let names = fs.readdirSync(src);
            names.forEach(function (name: string) {
                var name_src = path.join(src, name);
                var name_dst = path.join(dst, name);
                var stat = fs.statSync(name_src);
                if (stat.isFile()) {
                    let readable = fs.createReadStream(name_src);
                    let writable = fs.createWriteStream(name_dst);
                    readable.pipe(writable);
                } else if (stat.isDirectory()) {
                    try {
                        fs.accessSync(name_dst, fs.constants.F_OK);
                    } catch (error) {
                        fs.mkdirSync(name_dst);
                    }
                    copy_files(name_src, name_dst);
                }
            });
        }
        copy_files(from, to);

        await new Promise((resolve, reject) => {
            const py = spawn('python', ['genbindings.py', '--config', 'effekseer.ini'], { cwd: path.join(path.dirname(Editor.App.path), "resources/3d/engine/native/tools/tojs") });
            py.stdout.on('data', function (res:any) {
                let data = res.toString();
                console.log(data)
            })
            py.stderr.on('data', function (res:any) {
                let data = res.toString();
                console.error(data)
            })
            py.on('close', (code:any) => {
                return resolve(null);
            });
        })
    },
    efk_new: async function (efk_uuid: string, name: string, file: string, url: string) {        
        // 加载 efk 解析库
        await load_wasm();

        // 加载 efk 材质文件
        let mat = load_efkmat(file);

        // 加载 efk 模型文件
        let models = load_efkmodel(file);

        let texture_names: string[] = [];
        effekseer.setTextureLoaderEvent((key: number, src: string) => {
            texture_names.push(src);
            return texture_names.length;
        }, (id: number) => { });

        let single = null! as any;
        let materials: { src: string, shaders: [] }[] = [];

        effekseer.setMaterialLoaderEvent((key: number, src: string) => {
            single = {
                src: src,
                shaders: [],
            }
            materials.push(single);
            let buf = mat[src];

            if (!buf) console.error('miss material, ', src);
            return buf;
        }, (key: number, src: string) => {
            debugger
        }, (key: number, shader: any, type: number) => {
            let uniforms = {} as any
            for (let i = 0; i < shader.getUniformCount(); ++i) {
                uniforms[shader.getUniform(i)] = 1;
            }
            single.shaders[type] = {
                vs: shader.vs,
                fs: shader.fs,
                uniforms: Object.keys(uniforms)
            }
        });

        let model_names: string[] = [];
        effekseer.setModelLoaderEvent((key: number, src: string) => {
            model_names.push(src);
            let buf = models[src].buffer;
            if (!buf) console.error('miss model, ', src);
            return buf;
        }, (key: number, model: any) => { }, (key: number, src: string) => { });

        const buffer = fs.readFileSync(file);
        effekseer.loadEffectOnMemory(buffer, efk_uuid, 1.0);

        const baseUrl = path.dirname(url);
        for (let i = 0; i < texture_names.length; ++i) {
            texture_names[i] = await Editor.Message.request("asset-db", "query-uuid", baseUrl + "/" + texture_names[i] + "/texture") as string;
        }

        for (let i = 0; i < model_names.length; ++i) {
            model_names[i] = await Editor.Message.request("asset-db", "query-uuid", baseUrl + "/" + model_names[i]) as string;
        }

        let material_names: string[] = [];
        let efkmat_names: string[] = [];

        for (let i in materials) {
            let mat = materials[i];

            let shaders = mat.shaders;
            let effect = EFK_EFFECT(shaders)

            // 获取 .efkmat 文件 uuid
            let uuid = await Editor.Message.request("asset-db", "query-uuid", path.dirname(url) + '/' + mat.src);
            efkmat_names.push(uuid as string);

            // 生成 .effect 文件

            let dest = path.dirname(file) + '/' + mat.src.replace('.efkmat', '.effect');
            fs.writeFileSync(dest, effect, 'utf-8');
            await Editor.Message.request("asset-db", "refresh-asset", dest);

            // 生成 .material 文件

            uuid = await Editor.Message.request("asset-db", "query-uuid", path.dirname(url) + '/' + mat.src.replace('.efkmat', '.effect'));
            let material = EFK_MATERIAL(uuid as string)

            let dest2 = path.dirname(file) + '/' + mat.src.replace('.efkmat', '.mtl');
            fs.writeFileSync(dest2, material, 'utf-8');
            await Editor.Message.request("asset-db", "refresh-asset", dest2);

            uuid = await Editor.Message.request("asset-db", "query-uuid", path.dirname(url) + '/' + mat.src.replace('.efkmat', '.mtl'));
            material_names.push(uuid as string);
        };

        // @ts-ignore
        const com_uuid = cc.js._getClassId(cc.js.getClassByName("EFKComponent"));
        const efk_prefab = EFK(path.basename(name, '.efk'), com_uuid, efk_uuid, model_names, texture_names, efkmat_names, material_names);

        // 生成 .prefab 文件

        file = file.replace('.efkefc', '.prefab').replace('.efk', '.prefab')
        fs.writeFileSync(file, JSON.stringify(efk_prefab), 'utf-8');
        await Editor.Message.request("asset-db", "refresh-asset", file);
    }
};