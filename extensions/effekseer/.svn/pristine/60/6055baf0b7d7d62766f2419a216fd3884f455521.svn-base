
import fs from "fs"
import path from "path"
import { IBuildResult, IBuildTaskOption } from "../@types/packages/builder/@types";

export async function load() { }

const patch_cpp = function (src: string, local: string, after: boolean, key: string, value: string) {
    const begin_cpp = `\n//BEGIN ${key}`;
    const end_cpp = `//END ${key}\n`;

    let begin = src.indexOf(begin_cpp);
    let end = src.indexOf(end_cpp);

    // remove old part
    if (begin >= 0) {
        src = src.substring(0, begin) + src.substring(end + (end_cpp).length);
    }

    let pos = src.indexOf(`${local}`);
    if (after) {
        pos += (`${local}`).length;
    }

    let newsrc = src.substring(0, pos);
    newsrc += begin_cpp;
    newsrc += value;
    newsrc += end_cpp;
    newsrc += src.substring(pos);

    return newsrc;
}

const patch_cmake = function (src: string, local: string | null, after: boolean, key: string, value: string) {
    const begin_cmake = `\n#BEGIN ${key}`;
    const end_cmake = `#END ${key}\n`;

    let begin = src.indexOf(begin_cmake);
    let end = src.indexOf(end_cmake);

    // remove old part
    if (begin >= 0) {
        src = src.substring(0, begin) + src.substring(end + (end_cmake).length);
    }

    let pos = src.length;

    if (local) {
        pos = src.indexOf(`${local}`);
        if (after) {
            pos += (`${local}`).length;
        }
    }

    let newsrc = src.substring(0, pos);
    newsrc += begin_cmake;
    newsrc += value;
    newsrc += end_cmake;
    newsrc += src.substring(pos);

    return newsrc;
}

export async function onBeforeBuild(options: IBuildTaskOption, result: IBuildResult) {
    const from = path.join(Editor.Project.path, "extensions/effekseer/engine/native");
    const to = path.join(path.dirname(Editor.App.path), "resources/3d/engine/native");

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

    const cmakeFile = path.join(path.dirname(Editor.App.path), "resources/3d/engine/native/CMakeLists.txt");
    let cmakeBody: string = fs.readFileSync(cmakeFile).toString();

    cmakeBody = patch_cmake(cmakeBody, '### generate source files', false, 'EFFEKSEER_PART_0', `
cocos_source_files(
    effekseer/Effekseer/Effekseer/Effekseer.Color.cpp
    effekseer/Effekseer/Effekseer/Effekseer.CurveLoader.cpp
    effekseer/Effekseer/Effekseer/Effekseer.DefaultEffectLoader.cpp
    effekseer/Effekseer/Effekseer/Effekseer.DefaultFile.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Effect.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNode.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNodeModel.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNodeRibbon.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNodeRing.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNodeRoot.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNodeSprite.cpp
    effekseer/Effekseer/Effekseer/Effekseer.EffectNodeTrack.cpp
    effekseer/Effekseer/Effekseer/Effekseer.FCurves.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Instance.cpp
    effekseer/Effekseer/Effekseer/Effekseer.InstanceChunk.cpp
    effekseer/Effekseer/Effekseer/Effekseer.InstanceContainer.cpp
    effekseer/Effekseer/Effekseer/Effekseer.InstanceGlobal.cpp
    effekseer/Effekseer/Effekseer/Effekseer.InstanceGroup.cpp
    effekseer/Effekseer/Effekseer/Effekseer.InternalScript.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Manager.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Matrix43.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Matrix44.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Random.cpp
    effekseer/Effekseer/Effekseer/Effekseer.RectF.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Resource.cpp
    effekseer/Effekseer/Effekseer/Effekseer.ResourceManager.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Setting.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Vector2D.cpp
    effekseer/Effekseer/Effekseer/Effekseer.Vector3D.cpp
    effekseer/Effekseer/Effekseer/Effekseer.WorkerThread.cpp
    effekseer/Effekseer/Effekseer/Material/Effekseer.MaterialFile.cpp
    effekseer/Effekseer/Effekseer/Material/Effekseer.CompiledMaterial.cpp
    effekseer/Effekseer/Effekseer/Material/Effekseer.MaterialCompiler.cpp
    effekseer/Effekseer/Effekseer/IO/Effekseer.EfkEfcFactory.cpp
    effekseer/Effekseer/Effekseer/Parameter/Easing.cpp
    effekseer/Effekseer/Effekseer/Parameter/Effekseer.Parameters.cpp
    effekseer/Effekseer/Effekseer/Parameter/Rotation.cpp
    effekseer/Effekseer/Effekseer/Utils/Effekseer.CustomAllocator.cpp
    effekseer/Effekseer/Effekseer/SIMD/Mat43f.cpp
    effekseer/Effekseer/Effekseer/SIMD/Mat44f.cpp
    effekseer/Effekseer/Effekseer/SIMD/Utils.cpp
    effekseer/Effekseer/Effekseer/Noise/CurlNoise.cpp
    effekseer/Effekseer/Effekseer/ForceField/ForceFields.cpp
    effekseer/Effekseer/Effekseer/Model/ProceduralModelGenerator.cpp
    effekseer/Effekseer/Effekseer/Model/Model.cpp
    effekseer/Effekseer/Effekseer/Model/ModelLoader.cpp
    effekseer/Effekseer/Effekseer/Model/SplineGenerator.cpp
    effekseer/Effekseer/Effekseer/Network/Effekseer.Client.cpp
    effekseer/Effekseer/Effekseer/Network/Effekseer.Server.cpp
    effekseer/Effekseer/Effekseer/Network/Effekseer.Session.cpp
    effekseer/Effekseer/Effekseer/Network/Effekseer.Socket.cpp
)

cocos_source_files(
    effekseer/EffekseerRendererCommon/EffekseerRenderer.CommonUtils.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.ModelRendererBase.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.RenderStateBase.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.SpriteRendererBase.cpp
    effekseer/EffekseerRendererCommon/ModelLoader.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.DDSTextureLoader.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.Renderer.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.RibbonRendererBase.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.TrackRendererBase.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.IndexBufferBase.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.Renderer_Impl.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.RingRendererBase.cpp
    effekseer/EffekseerRendererCommon/EffekseerRenderer.VertexBufferBase.cpp
)

cocos_source_files(
    effekseer/EffekseerCocosCreator/effekseer.cpp
    effekseer/EffekseerCocosCreator/loader/common.cpp
    effekseer/EffekseerCocosCreator/loader/curve.cpp
    effekseer/EffekseerCocosCreator/loader/material.cpp
    effekseer/EffekseerCocosCreator/loader/model.cpp
    effekseer/EffekseerCocosCreator/loader/sound.cpp
    effekseer/EffekseerCocosCreator/loader/texture.cpp
    effekseer/EffekseerCocosCreator/loader/vfile.cpp
    effekseer/EffekseerCocosCreator/renderer/graphics.cpp
    effekseer/EffekseerCocosCreator/renderer/renderer.cpp
    effekseer/EffekseerCocosCreator/renderer/renderstate.cpp
    effekseer/EffekseerCocosCreator/renderer/vertexbuffer.cpp
    effekseer/EffekseerCocosCreator/framework/efk_material.cpp
    effekseer/EffekseerCocosCreator/framework/efk_model.cpp
    effekseer/EffekseerCocosCreator/framework/efk_render.cpp
)

cocos_source_files(
    cocos/bindings/manual/jsb_effekseer_manual.cpp
    cocos/bindings/manual/jsb_effekseer_manual.h
)
`);

    cmakeBody = patch_cmake(cmakeBody, null, false, 'EFFEKSEER_PART_1', `
target_include_directories(\${ENGINE_NAME} PRIVATE 
    \${CWD}/effekseer/
    \${CWD}/effekseer/Effekseer
    \${CWD}/effekseer/EffekseerRendererCommon
)

target_compile_definitions(\${ENGINE_NAME} PRIVATE
    __EFFEKSEER_RENDERER_GLES3__
    __EFFEKSEER_USE_LIBPNG__
)
`);

    fs.writeFileSync(cmakeFile, cmakeBody);

    const cppFile = path.join(path.dirname(Editor.App.path), "resources/3d/engine/native/cocos/bindings/manual/jsb_module_register.cpp");
    let cppBody: string = fs.readFileSync(cppFile).toString();

    cppBody = patch_cpp(cppBody, '#include "cocos/bindings/manual/jsb_xmlhttprequest.h"', true, 'EFFEKSEER_PART_2', `
#include "cocos/bindings/manual/jsb_effekseer_manual.h"
`);

    cppBody = patch_cpp(cppBody, 'se->addRegisterCallback(register_all_2d);', true, 'EFFEKSEER_PART_3', `
    se->addRegisterCallback(register_all_effekseer);
`);

    fs.writeFileSync(cppFile, cppBody);
}

export function unload() {
    // console.warn(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
}
