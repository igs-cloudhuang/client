import { Asset, AssetManager, Node, Prefab, Tween, UIOpacity, UIRenderer, UITransform, Vec3, color, instantiate, lerp, tween } from 'cc';
import { rInt, rStr } from 'db://annin-framework/utils';

// 臨時變量
const tmp_empty_obj = {};
const tmp_color = color();

/**
 * 修正在編輯器中, 用程式碼生成 Prefab 的實例, uuid 會重複的問題 (3.6.x issue)
 */
export function instantiateInEditor(prefab: Prefab): Node {
    const node = instantiate(prefab);
    const instance = new Prefab._utils.PrefabInstance();
    instance.fileId = EditorExtends?.UuidUtils.uuid();
    // @ts-ignore
    node._prefab.instance = instance;
    return node;
}

/**
 * 下載檔案
 */
export function downloadFile(obj: object, filename: string) {
    let blob = new Blob([JSON.stringify(obj, null, 0)], { type: 'application/plain' });
    let a = document.createElement('a');
    let url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

/**
 * 讀取 Bundle 裡的資源
 */
export async function loadRes<T extends Asset>(bundle: AssetManager.Bundle, url: string): Promise<T> {
    return new Promise<T>(resolve => {
        bundle.load<T>(url, (err, asset) => {
            if (err) { resolve(null); return; }
            resolve(asset);
        });
    });
}

/**
 * 設定 UI color's alpha
 */
export function setUIColorAlpha<T extends UIRenderer>(comp: T, alpha: number) {
    tmp_color.set(comp.color);
    tmp_color.a = alpha;
    comp.color = tmp_color;    // 觸發 comp.color 的 setter 函式
}

/**
 * 設定節點尺寸, 只有 w >= 0 或 h >= 0 時才會設定寬度或高度 (可透過代入負值來取得節點的 UITransform 元件)
 */
export function setUISize(node: Node, w: number, h: number): UITransform {
    let trans = node.getComponent(UITransform);
    let sw = w < 0 ? trans.width : w;
    let sh = h < 0 ? trans.height : h;
    if (w >= 0 || h >= 0) trans.setContentSize(sw, sh);
    return trans;
}

/**
 * 設定節點透明度, 只有 val >= 0 時才會設定透明度 (可透過代入負值來取得節點的 UIOpacity 元件)
 */
export function setOpacity(node: Node, val: number): UIOpacity {
    let opa = node.getComponent(UIOpacity);
    if (val >= 0) opa.opacity = val;
    return opa;
}

/**
 * 設定節點位置 X
 */
export function setPosX(node: Node, val: number): Readonly<Vec3> {
    const p = node.position;
    node.setPosition(val, p.y, p.z);
    return node.position;
}

/**
 * 設定節點位置 Y
 */
export function setPosY(node: Node, val: number): Readonly<Vec3> {
    const p = node.position;
    node.setPosition(p.x, val, p.z);
    return node.position;
}

/**
 * 設定節點位置 Z
 */
export function setPosZ(node: Node, val: number): Readonly<Vec3> {
    const p = node.position;
    node.setPosition(p.x, p.y, val);
    return node.position;
}

/**
 * 每幀運行
 */
export function perFrame<T>(target: T, taskFunc: (task: Tween<T>) => void): Tween<T> {
    let tw = tween(target), day = 86_400;
    return tw.by(day, tmp_empty_obj, { onUpdate: () => taskFunc(tw) })
        .repeatForever()
        .start();
}

/**
 * 重複運行
 */
export function repeat<T>(target: T, dt: number, times: number, taskFunc: (task: Tween<T>) => void): Tween<T> {
    if (times <= 0)
        return;

    let tw = tween(target);
    return tw.call(() => taskFunc(tw)).delay(Math.max(1e-6, dt))
        .union().repeat(times)
        .start();
}

/**
 * 輪詢
 */
export function poll<T>(target: T, dt: number, taskFunc: (task: Tween<T>) => void): Tween<T> {
    let tw = tween(target);
    return tw.call(() => taskFunc(tw)).delay(Math.max(1e-6, dt))
        .union().repeatForever()
        .start();
}

/**
 * Delay
 */
export function delay<T>(target: T, dt: number, taskFunc: () => void): Tween<T> {
    let tw = tween(target);
    if (dt <= 0) {    // delay 小於 0, 當前幀渲染之前執行
        return tw.call(taskFunc)
            .start();
    }
    return tw.delay(dt).call(taskFunc)
        .start();
}

/**
 * 取得數值內插的緩動
 */
export function lerpTween<T>(target: T, dur: number, a: number, b: number, update: (num: number) => void, easing?: (t: number) => number): Tween<T> {
    const currNum = !!easing ?
        (t: number) => lerp(a, b, easing(t)) :
        (t: number) => lerp(a, b, t);

    let tw = tween(target).by(dur, tmp_empty_obj, {
        onUpdate: (_: object, t: number) => update(currNum(t))
    });
    return tw;
}

/**
 * 淡入淡出的緩動, a < 0 表示使用當前透明度 (使用節點當緩動目標, 方便繼續串接其他節點屬性)
 */
export function fadeTween(node: Node, dur: number, a: number, b: number, easing?: (t: number) => number): Tween<Node> {
    let opa = setOpacity(node, a);
    if (a < 0) a = opa.opacity;

    const currNum = !!easing ?
        (t: number) => lerp(a, b, easing(t)) :
        (t: number) => lerp(a, b, t);

    let tw = tween(node).by(dur, tmp_empty_obj, {
        onUpdate: (_: object, t: number) =>
            opa.opacity = currNum(t)
    });
    return tw;
}

/**
 * loop a to b, and excute callback function (integer: a, b)
 */
export function count(a: number, b: number, cb: (i: number) => void) {
    if (a <= b)
        while (a <= b) cb(a), a += 1;
    else
        while (a >= b) cb(a), a -= 1;
}

/**
 * 取得所有相同元素的索引值
 */
export function getIndices<T>(arr: T[], val: T): number[] {
    let indices = new Array<number>();
    for (let i = 0, len = arr.length; i < len; ++i) {
        if (arr[i] === val) indices.push(i);
    }
    return indices;
}

/**
 * 創建種子碼
 */
export function createNewSeed(): string {
    return rStr(rInt(10, 20));
}
