
declare namespace efk {
    type ArrayLimit4 = [0, 0, 0, 0];
    type ArrayLimit8 = [0, 0, 0, 0, 0, 0, 0, 0];
    type ArrayLimit16 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    type Vec4 = [0, 0, 0, 0];
    type Float = 0;
    type Int = 0;

    const enum TextureFormatType {
        R8G8B8A8_UNORM,
        B8G8R8A8_UNORM,
        R8_UNORM,
        R16G16_FLOAT,
        R16G16B16A16_FLOAT,
        R32G32B32A32_FLOAT,
        BC1,
        BC2,
        BC3,
        R8G8B8A8_UNORM_SRGB,
        B8G8R8A8_UNORM_SRGB,
        BC1_SRGB,
        BC2_SRGB,
        BC3_SRGB,
        D32,
        D24S8,
        D32S8,
        Unknown,
    }

    enum TextureFilterType {
        Nearest = 0,
        Linear = 1,
    }

    enum RendererShaderType {
        Unlit = 0,
        Lit = 1,
        BackDistortion = 2,
        AdvancedUnlit = 3,
        AdvancedLit = 4,
        AdvancedBackDistortion = 5,
        Material = 6,
    }

    enum RendererMode {
        Sprite = 0,
        Model = 1
    }

    enum AlphaBlendType {
        Opacity = 0,
        Blend = 1,
        Add = 2,
        Sub = 3,
        Mul = 4,
    }

    enum CullingType {
        Front = 0,
        Back = 1,
        Double = 2,
    }

    interface UnityRenderModelParameter1 {
        Matrix: Vec4;
        UV: Vec4;
        VColor: Vec4;
        Time: Int;
    }

    interface UnityRenderModelParameter2 {
        AlphaUV: Vec4;
        DistortionUV: Vec4;
        BlendUV: Vec4;
        BlendAlphaUV: Vec4;
        BlendDistortionUV: Vec4;
        FlipbookIndexAndNextRate: Float;
        AlphaThreshold: Float;
        ViewOffsetDistance: Float;
    }

    interface FlipbookParametersEx {
        Enable: number;
        LoopType: number;
        DivideX: number;
        DivideY: number;
        OneSizeX: number;
        OneSizeY: number;
        OffsetX: number;
        OffsetY: number;
    }

    interface EdgeParametersEx {
        Color: ArrayLimit4;
        Threshold: number;
        ColorScaling: number;
    }

    interface FalloffParameterEx {
        ColorBlendType: number;
        BeginColor: ArrayLimit4;
        EndColor: ArrayLimit4;
        Pow: number;
    }

    interface RenderParameter {
        getFlipbookParams(): FlipbookParametersEx;
        getFalloffParam(): FalloffParameterEx;
        getEdgeParams(): EdgeParametersEx;

        //! 0 - procedural, 1 - model
        RenderMode: number;
        MaterialType: number;
        VertexBufferOffset: number;
        AdvancedBufferOffset: number;
        VertexBufferStride: number;
        CustomData1BufferOffset: number;
        CustomData2BufferOffset: number;
        UniformBufferOffset: number;
        ElementCount: number;
        modelFrame: number;
        UVDistortionIntensity: number;
        TextureBlendType: number;
        BlendUVDistortionIntensity: number;
        EnableFalloff: number;
        EmissiveScaling: number;
        SoftParticleParam: ArrayLimit4;
        ReconstrcutionParam1: ArrayLimit4;
        ReconstrcutionParam2: ArrayLimit4;
        PredefinedUniform: ArrayLimit4;
        ZTest: number;
        ZWrite: number;
        Blend: number;
        Culling: number;
        DistortionIntensity: number;
        IsRefraction: number;
        TexturePtrs: ArrayLimit8;
        TextureFilterTypes: ArrayLimit8;
        TextureWrapTypes: ArrayLimit8;
        TextureCount: number;
        MaterialPtr: number;
        ModelPtr: number;
        ComPtr: number;
    }

    interface StrideBufferParameterEx {
        Stride: number;
        Ptr: Uint8Array;
    }

    export class effekseer {
        public static init(maxInstances: number, maxSquares: number, reversedDepth: number, maintainGammaColor: number, isRightHandedCoordinate: number, threadCount: number): void;
        public static term(): void;
        public static resetTime(): void;
        public static updateTime(deltaTime: number): void;
        public static update(deltaTime: number): void;
        public static getRenderFunc(renderId: number): number;
        public static getRenderFrontFunc(renderId: number): number;
        public static getRenderBackFunc(renderId: number): number;
        public static render(renderId: number);
        public static renderFront(renderId: number);
        public static renderBack(renderId: number);
        public static renderParameter(index: number): RenderParameter;
        public static renderParameterCount(): number;
        public static renderStrideBufferCount(): number;
        public static renderStrideBufferParameter(index: number): StrideBufferParameterEx;
        public static renderInfoBuffer(): Int8Array;

        /* space */

        public static setProjectionMatrix(renderId: number, matrix: Float32Array);
        public static setCameraMatrix(renderId: number, matrix: Float32Array);
        public static setStereoRenderingMatrix(renderId: number, renderType: number, camCenterMat: number[], projMatL: number[], projMatR: number[], camMatL: number[], camMatR: number[]);
        public static setExternalTexture(renderId: number, type: number, background: number);
        public static enableDepthTexture(renderId: number);
        public static enableBackGroundTexture(renderId: number);
        public static setRenderSettings(renderId: number, renderIntoTexture: boolean);
        public static setRenderingCameraCullingMask(renderId: number, cullingMask: number);
        public static setRenderTargetProperty(renderId: number, renderTarget: TextureFormatType, depthTarget: TextureFormatType, width: number, height: number);
        public static setIsTextureFlipped(isFlipped: number);
        public static setIsBackgroundTextureFlipped(isFlipped: number);
        public static addRemovingRenderPath(renderId: number);

        /* load effect */

        public static loadEffectOnMemory(data: ArrayBuffer, name: string, magnification?: number);
        public static playEffect(effect: number, x: number, y: number, z: number): number;
        public static releaseEffect(effect: number);
        public static reloadResources(effect: number);
        public static unloadResources(effect: number);
        public static getEffectMagnification(effect: number): number;
        public static getFrameCount(effect: number): number;

        /* play effect */

        public static updateHandle(handle: number, deltaDrame: number);
        public static updateHandleToMoveToFrame(handle: number, frame: number);
        public static stopEffect(handle: number);
        public static stopRoot(handle: number);
        public static stopAllEffects();
        public static setPausedToAllEffects(paused: boolean);
        public static getCameraCullingMaskToShowAllEffects(): number;
        public static getShown(handle: number): boolean;
        public static getShown(handle: number, shown: boolean);
        public static getPaused(handle: number): boolean;
        public static setPaused(handle: number, paused: boolean);
        public static getSpeed(handle: number): number;
        public static setSpeed(handle: number, speed: number): number;
        public static exists(handle: number): boolean;
        public static setMatrix(handle: number, mat44: Float32Array);
        public static setLocation(handle: number, x: number, y: number, z: number);
        public static setRotation(handle: number, x: number, y: number, z: number, angle: number);
        public static setScale(handle: number, x: number, y: number, z: number);
        public static setAllColor(handle: number, r: number, g: number, b: number, a: number);
        public static setTargetLocation(handle: number, x: number, y: number, z: number);
        public static setLightDirection(x: number, y: number, z: number);
        public static setLightColor(r: number, g: number, b: number);
        public static setLightAmbientColor(r: number, g: number, b: number);
        public static setLayer(handle: number, layer: number);
        public static setGroupMask(handle: number, groupMask: number);
        public static setTimeScaleByGroup(groupMask: number, timeScale: number);
        public static getInstanceCount(handle: number): number;
        public static getRestInstancesCount(): number;
        public static sendTrigger(handle: number, index: number);
        public static getDynamicInput(handle: number, index: number): number;
        public static setDynamicInput(handle: number, index: number, value: number);
        public static setUserData(handle: number, userdata: number);
        public static setRemovingCallback(handle: number, cb: (comPtr: number) => void);

        // resource load

        public static setTextureLoaderEvent(
            load: (key: number, src: string) => void,
            unload: (id: number, nativePtr: number) => void
        );
        public static setModelLoaderEvent(
            load: (key: number, src: string) => ArrayBuffer,
            loadmesh: (key: number, model: any) => void,
            unload: (key: number, src: string) => void
        );
        public static setMaterialLoaderEvent(
            load: (key: number, src: string) => ArrayBuffer,
            unload: (src: string, key: number) => void,
            loadShader: (key: number, shader: any, type: number) => void
        );
        public static setCurveLoaderEvent(
            load: (src: string) => ArrayBuffer,
            unload: (id: number, curvePtr: number) => void
        );
        public static setProceduralModelGeneratorEvent(
            load: (vertecies: Float32Array, verteciesCount: number, faces: Uint16Array, facesCount: number) => number,
            nload: (modelPtr: number) => number
        );
        public static setSoundLoaderEvent(
            load: (src: string) => number,
            unload: (nativePtr: number) => void
        );
        public static setSoundPlayerEvent(
            play: (tag: number, data: number, volume: number, pan: number, pitch: number, mode3D: boolean, x: number, y: number, z: number, distance: number) => void,
            stopTag: (tag: number) => void,
            pauseTag: (tag: number, pause: boolean) => void,
            checkPlayingTag: (tag: number) => boolean,
            atopAll: () => void
        );

        public static renderNaitveMaterialPropertys(material: any, camp: any, param: RenderParameter, renderid: number, element: number);
    }
}
