import { director, gfx, Material, renderer, RenderingSubMesh } from "cc";

const ModelVertexEx = [                                         //                  = 72
    new gfx.Attribute("Input_Pos", gfx.Format.RGB32F),          // Pos      -> vec3 + 12   
    new gfx.Attribute("Input_Normal", gfx.Format.RGB32F),       // Normal   -> vec3 + 12
    new gfx.Attribute("Input_Binormal", gfx.Format.RGB32F),     // Binormal -> vec3 + 12
    new gfx.Attribute("Input_Tangent", gfx.Format.RGB32F),      // Tangent  -> vec3 + 12
    new gfx.Attribute("Input_UV", gfx.Format.RG32F),            // UV1      -> vec2 + 8
    new gfx.Attribute("Input_Color", gfx.Format.RGBA32F),       // Color    -> vec4 + 16
];

const ModelStrip = 72;

// 特效 自定义模型渲染

const g_models: Record<number, {
    vertex: gfx.Buffer,
    indice: gfx.Buffer,
    ia: gfx.IndirectBuffer
}[]> = {};

export class EFKModel {
    private static m_meshs: RenderingSubMesh[] = [];
    private static m_typeid_meshs: Record<number, number[]> = {};
    private static m_typeid_used: Record<number, boolean> = {};

    private static m_model_meshs: Record<number, number[]> = {};
    private static m_model_cache: Record<number, number[]> = {};

    private static m_models: renderer.scene.Model[] = [];
    private static m_model_used: Record<number, boolean> = {};

    // priority 决定渲染顺序
    private static m_priority: number = 0;

    public static doDestroy() {
        EFKModel.m_meshs.forEach(mesh => {
            mesh.vertexBuffers.length = 0;
            mesh.destroy();
        })
        EFKModel.m_meshs = [];
    }


    // 特效 sprite 网格数据渲染

    private static m_buffers: Record<number, {
        vertex: gfx.Buffer,
        indice: gfx.Buffer
    }> = {};

    public static updateMesh(stride: number, vertecies: Uint8Array) {
        const device = gfx.deviceManager.gfxDevice;

        const buffer = EFKModel.m_buffers[stride];
        if (!buffer || buffer.vertex.size < vertecies.byteLength) {
            const vertexBuffer = buffer ? buffer.vertex : device.createBuffer(new gfx.BufferInfo(
                gfx.BufferUsageBit.VERTEX | gfx.BufferUsageBit.TRANSFER_DST,
                gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
                vertecies.byteLength,
                stride,
            ));

            if (buffer) {
                vertexBuffer.resize(vertecies.byteLength);
            }

            // 顶点数/4 = 多少四边形，四边形由 2 个三角形组成，三角形由 3 个顶点组成
            const indexCount = 3; // (vertexBuffer.size / stride) / 4 * 2 * 3;
            const indexBuffer: gfx.Buffer = buffer ? buffer.indice : device.createBuffer(new gfx.BufferInfo(
                gfx.BufferUsageBit.INDEX | gfx.BufferUsageBit.TRANSFER_DST,
                gfx.MemoryUsageBit.DEVICE,
                indexCount * Uint16Array.BYTES_PER_ELEMENT,
                Uint16Array.BYTES_PER_ELEMENT,
            ));

            EFKModel.m_buffers[stride] = {
                vertex: vertexBuffer,
                indice: indexBuffer
            }
        }

        EFKModel.m_buffers[stride].vertex.update(vertecies);
    }

    protected static resizeIndice(indexBuffer: gfx.Buffer, indexCount: number) {
        if (indexBuffer.size >= indexCount * Uint16Array.BYTES_PER_ELEMENT) {
            return;
        }

        indexBuffer.resize(indexCount * Uint16Array.BYTES_PER_ELEMENT);
        const indices: Uint16Array = new Uint16Array(indexCount);

        let element = 0;
        for (let i = 0; i < indexCount;) {
            const baseIdx = 4 * element;
            indices[i++] = baseIdx;
            indices[i++] = baseIdx + 1;
            indices[i++] = baseIdx + 2;
            indices[i++] = baseIdx + 3;
            indices[i++] = baseIdx + 2;
            indices[i++] = baseIdx + 1;
            element++;
        }
        indexBuffer.update(indices);
    }

    public static drawSprite(stride: number, offset: number, spriteCount: number, material: renderer.MaterialInstance, typeid: number): renderer.scene.Model {
        const fisrtVertex = offset / stride;
        const fisrtIndex = fisrtVertex / 4 * 6;

        const buffer = EFKModel.m_buffers[stride];
        if (null == buffer) debugger

        // 索引偏移 + 索引数
        EFKModel.resizeIndice(buffer.indice, fisrtIndex + spriteCount * 6);

        const iaInfo = new gfx.DrawInfo(
            spriteCount * 4,
            fisrtVertex,
            spriteCount * 6,
            fisrtIndex
        );

        let mesh = -1;
        let meshs = EFKModel.m_typeid_meshs[typeid] = EFKModel.m_typeid_meshs[typeid] || [];
        for (let i = 0; i < meshs.length; ++i) {
            let idx = meshs[i];
            if (!EFKModel.m_typeid_used[idx]) {
                EFKModel.m_typeid_used[idx] = true;
                mesh = idx;
                break;
            }
        }

        let subMesh: RenderingSubMesh = null!;
        if (mesh >= 0) {
            subMesh = EFKModel.m_meshs[mesh];
            subMesh.drawInfo = iaInfo;
        }
        else {
            const attrs: gfx.Attribute[] = [];
            material.passes[0].shaderInfo.attributes.forEach(attr => {
                attrs.push(new gfx.Attribute(attr.name, attr.format, attr.isNormalized, attr.stream, attr.isInstanced, attr.location));
            })
            subMesh = new RenderingSubMesh([buffer.vertex], attrs, gfx.PrimitiveMode.TRIANGLE_LIST, buffer.indice);

            mesh = EFKModel.m_meshs.length;
            EFKModel.m_meshs.push(subMesh);

            EFKModel.m_typeid_meshs[typeid].push(mesh);
            EFKModel.m_typeid_used[mesh] = true;
        }

        return EFKModel.checkModel(mesh, subMesh, material, iaInfo);
    }

    static sum_count: number = 0;
    public static addModel(key: number, vertecies: Uint8Array, indices: Uint8Array, frame: number) {
         const device = gfx.deviceManager.gfxDevice;
        g_models[key] = g_models[key] || [];

        const buffer = g_models[key][frame];
        if (!buffer || buffer.vertex.size < vertecies.byteLength) {
            const vertexBuffer = buffer ? buffer.vertex : device.createBuffer(new gfx.BufferInfo(
                gfx.BufferUsageBit.VERTEX | gfx.BufferUsageBit.TRANSFER_DST,
                gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
                vertecies.byteLength,
                ModelStrip
            ));

            const indexBuffer: gfx.Buffer = buffer ? buffer.indice : device.createBuffer(new gfx.BufferInfo(
                gfx.BufferUsageBit.INDEX | gfx.BufferUsageBit.TRANSFER_DST,
                gfx.MemoryUsageBit.DEVICE,
                indices.byteLength,
                Int32Array.BYTES_PER_ELEMENT,
            ));

            if (buffer) {
                vertexBuffer.resize(vertecies.byteLength);
                indexBuffer.resize(indices.byteLength);
            }

            g_models[key][frame] = {
                vertex: vertexBuffer,
                indice: indexBuffer,
                ia: new gfx.IndirectBuffer([new gfx.DrawInfo(
                    vertexBuffer.count, 0, indexBuffer.count, 0
                )])
            }

            //this.sum_count += (vertecies.byteLength + indices.byteLength)/1024/1024;
            //console.log(key, frame, (this.sum_count).toFixed(2), " mb");
        }

        g_models[key][frame].vertex.update(vertecies);
        g_models[key][frame].indice.update(indices);
    }

    public static removeModel(key: number) {        
        if (null == g_models[key]) {
            return;
        }

        // 清除 buffer 对象
        g_models[key].forEach(frame => {
            frame.vertex.destroy();
            frame.indice.destroy();
        });

        delete g_models[key];

        EFKModel.m_model_meshs[key].forEach(mesh => {
            // 清除 mesh 对象
            EFKModel.m_meshs[mesh].destroy();
            delete EFKModel.m_meshs[mesh];

            // 清除 model 对象            
            let models = EFKModel.m_model_cache[mesh];
            models.forEach(m => {
                EFKModel.m_models[m].destroy();
                delete EFKModel.m_models[m];
            });
        });
        delete EFKModel.m_model_meshs[key];
    }

    public static drawModel(id: number, frame: number, material: renderer.MaterialInstance, typeid: number): renderer.scene.Model {
        // return;
        let meshs = EFKModel.m_model_meshs[id] = EFKModel.m_model_meshs[id] || [];
        let mesh = (meshs[frame] !== undefined) ? meshs[frame] : -1;

        const buffer = g_models[id][frame];
        if (null == buffer) debugger

        let subMesh: RenderingSubMesh = null!;
        if (mesh >= 0) {
            subMesh = EFKModel.m_meshs[mesh];
        }
        else {
            const attrs: gfx.Attribute[] = [];
            material.passes[0].shaderInfo.attributes.forEach(attr => {
                attrs.push(new gfx.Attribute(attr.name, attr.format, attr.isNormalized, attr.stream, attr.isInstanced, attr.location));
            })
            subMesh = new RenderingSubMesh([buffer.vertex], ModelVertexEx, gfx.PrimitiveMode.TRIANGLE_LIST, buffer.indice);

            mesh = EFKModel.m_meshs.length;
            EFKModel.m_meshs.push(subMesh);
            EFKModel.m_model_meshs[id].push(mesh);
        }

        return EFKModel.checkModel(mesh, subMesh, material, buffer.ia.drawInfos[0]);
    }

    private static checkModel(mesh_id: number, mesh_obj: RenderingSubMesh, material: Material, info: gfx.DrawInfo): renderer.scene.Model {
        let model = null as renderer.scene.Model;
        const cache = EFKModel.m_model_cache[mesh_id] = (EFKModel.m_model_cache[mesh_id] || []);
        for (let ii = 0; ii < cache.length; ++ii) {
            let mid = cache[ii];
            if (EFKModel.m_model_used[mid]) {
                continue;
            }
            model = EFKModel.m_models[mid];
            EFKModel.m_model_used[mid] = true;
            break;
        }

        if (null == model) {
            model = director.root.createModel(renderer.scene.Model);
            model.initSubModel(0, mesh_obj, material);

            const mid = EFKModel.m_models.length;
            EFKModel.m_models.push(model);

            EFKModel.m_model_cache[mesh_id] = EFKModel.m_model_cache[mesh_id] || [];
            EFKModel.m_model_cache[mesh_id].push(mid);

            EFKModel.m_model_used[mid] = true;
        }
        else {
            model.setSubModelMaterial(0, material);
        }

        model.subModels[0].inputAssembler.drawInfo = info;
        model.priority = EFKModel.m_priority++;

        return model;
    }

    public static reset() {
        EFKModel.m_typeid_used = [];
        EFKModel.m_model_used = [];
        EFKModel.m_priority = 0;
    }
}
