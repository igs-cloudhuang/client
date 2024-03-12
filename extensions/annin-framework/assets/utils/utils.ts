import { Animation, AnimationClip, AnimationState, Camera, Component, Mat4, Node, PhysicsSystem, Tween, UITransform, Vec2, Vec3, __private, bezier, find as cc_find, director, geometry, misc, sp, tween, v2, v3 } from 'cc';
import { BUILD } from 'cc/env';
import numeral from 'numeral';

const tmp_v3 = v3()
const tmp_ray = new geometry.Ray()
const tmp_mat4 = new Mat4()

/**
 * 線性內插
 * @param a 起始值
 * @param b 終點值
 * @param t 內插值(0 ~ 1)
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

/**
 * 線性內插 for Vec2
 * @param a 起始值
 * @param b 終點值
 * @param t 內插值(0 ~ 1)
 */
export function lerp2(a: Vec2, b: Vec2, t: number): Vec2 {
    return Vec2.lerp(v2(), a, b, t)
}

/**
 * 線性內插 for Vec3
 * @param a 起始值
 * @param b 終點值
 * @param t 內插值(0 ~ 1)
 */
export function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
    return Vec3.lerp(v3(), a, b, t)
}

/**
 * 隨機整數 (範圍包含邊界)
 * @param a 整數下限
 * @param b 整數上限
 */
export function rInt(a: number, b: number): number {
    if (a > b) [a, b] = [b, a]
    return Math.floor(a + (b - a + 1) * Math.random())
}

/**
 * 隨機字串  內涵A-Z a-z 0-9
 * @param len 長度
 */
export function rStr(len: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let s = ''
    for (let i = 0; i < len; ++i) {
        s += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return s
}

/**
 * 隨機元素
 * @param list 欲取隨機元素的陣列
 */
export function rItem<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)]
}

/**
 * 末位元素
 * @param list 欲取末位元素的陣列
 */
export function lastItem<T>(list: T[]): T {
    return list[list.length - 1]
}

/**
 * 按權重比例隨機選擇一個
 * @param list 權重比例陣列 ex. [5, 'A'], [1, 'B'], [2, 'C']
 */
export function chooseByWeight<T>(...list: Array<[number, T]>): T {
    if (list.length <= 0) {
        return null
    }

    let total = 0
    for (let item of list) {
        if (item[0] <= 0) continue
        total += item[0]
    }

    let n = Math.random() * total  // 0 (incl.) ~ total (excl.)
    for (let item of list) {
        if (item[0] <= 0) continue
        n -= item[0]

        if (n < 0) {
            return item[1]
        }
    }

    return list[0][1]
}

/**
 * 隨機洗牌 (Fisher-Yates Shuffle)
 * @param list 欲洗牌陣列
 */
export function shuffleSelf<T>(items: Array<T>): Array<T> {
    let floor = Math.floor
    let random = Math.random
    for (let i = items.length - 1; i > 0; --i) {
        let j = floor(random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]]
    }
    return items
}

/**
 * binary search
 * @param sortedItems sorted array
 * @param cmpFunc current item - goal item
 * @returns index
 */
export function binarySearch<T>(sortedItems: T[], cmpFunc: (item: T) => number): number {
    let mid = 0, cmp = 0
    let lhs = 0, rhs = sortedItems.length - 1

    while (lhs <= rhs) {
        mid = (lhs + rhs) >>> 1
        cmp = cmpFunc(sortedItems[mid])

        if (cmp === 0)
            return mid

        if (cmp > 0)
            rhs = mid - 1
        else
            lhs = mid + 1
    }
    return -1
}

/**
 * 轉換到某個 UI 節點的座標系 (開銷較大請注意呼叫頻率)
 * ps. uiDst & uiSrc 必定要有 UITransform 元件
 * @param uiDst 轉換到的節點座標系
 * @param uiSrc 被轉換的節點
 * @param pos 被轉換的節點座標值(預設原點)
 */
export function transUIPos(uiDst: Node | UITransform, uiSrc: Node | UITransform, pos: Vec3 = null): Vec3 {
    if (uiDst instanceof Node) uiDst = uiDst.getComponent(UITransform)
    if (uiSrc instanceof Node) uiSrc = uiSrc.getComponent(UITransform)

    let wpos = uiSrc.convertToWorldSpaceAR(pos || Vec3.ZERO)
    let goal = uiDst.convertToNodeSpaceAR(wpos)
    return goal
}

/**
 * 轉換到某個 3D 節點的座標系 (開銷較大請注意呼叫頻率)
 * @param dstNode 轉換到的節點座標系
 * @param srcNode 被轉換的節點
 * @param pos 被轉換的節點座標值 (預設原點)
 */
export function trans3DPos(dstNode: Node, srcNode: Node, pos: Vec3 = null): Vec3 {
    let xyz = v3()
    let invMat4 = Mat4.invert(tmp_mat4, dstNode.worldMatrix)

    if (pos === null)
        xyz.set(srcNode.worldPosition)
    else
        Vec3.transformMat4(xyz, pos, srcNode.worldMatrix)

    return Vec3.transformMat4(xyz, xyz, invMat4)  // Vec3.transformMat4 的參數都唯讀的
}

/**
 * 檢查是否合法的 langCode (ex. en-US)
 * @param str langCode
 */
export function isLangCode(str: string): boolean {
    return /^[a-z]{2}-[A-Z]{2}$/.test(str)
}

/**
 * 取得網址列參數
 * @param url 完整網址
 * @param key 要搜尋的參數關鍵字
 */
export function getQuery(url: string, key: string): string {
    if (url.indexOf('?') === -1)
        return ''

    let tok = url.split('?')[1].split('&')
    for (let i = 0, len = tok.length; i < len; ++i) {
        if (tok[i].split('=')[0] === key)
            return tok[i].split('=')[1]
    }
    return ''
}

/**
 * 取得某位置下的元件或節點
 * @param root 節點或元件
 * @param key 路徑字串 ex "Canvas/nodeA/nodeB"
 * @param type 元件類型，有帶此參數會回傳該元件
 */
export function find(path: string): Node
export function find(root: Node | Component, path: string): Node
export function find(path: string, root: Node | Component): Node
export function find<T extends Component>(path: string, type: __private._types_globals__Constructor<T>): T
export function find<T extends Component>(root: Node | Component, type: __private._types_globals__Constructor<T>): T
export function find<T extends Component>(root: Node | Component, path: string, type: __private._types_globals__Constructor<T>): T
export function find(...argv: any[]): any {
    let argc = argv.length
    switch (argc) {
        case 1: {
            return cc_find(argv[0])
        }
        case 2: {
            if (typeof argv[0] === 'string') {
                if(argv[1] instanceof Node) return cc_find(argv[0], argv[1])
                else if(argv[1].node instanceof Node) return cc_find(argv[0], argv[1].node)
                return cc_find(argv[0]).getComponent(argv[1])
            }

            let root = argv[0] instanceof Node ? argv[0] : (argv[0].node as Node)
            return (typeof argv[1] === 'string') ? cc_find(argv[1], root) : root.getComponent(argv[1])

        }
        case 3: {
            let root = argv[0] instanceof Node ? argv[0] : (argv[0].node as Node)
            let node = cc_find(argv[1], root)
            if (node)
                return node.getComponent(argv[2])
        }
    }
    return null
}

/**
 * 向上查找元件
 * @param root 起始節點
 * @param compType 元件類型
 */
export function lookup<T extends Component>(root: Node, compType: __private._types_globals__Constructor<T>): T {
    let node = root.parent
    while (node) {
        let comp = node.getComponent(compType)
        if (comp) {
            return comp
        }
        node = node.parent
    }
    return null
}

/**
 * 3D 座標點轉成 2D 螢幕座標點
 * @param camera_3D 該3D節點的渲染相機
 * @param camera_2D 需要轉換到的2D層的渲染相機
 * @param worldPos_3D 欲轉換的3D座標
 * @param distNd 欲轉換到的2D層節點
 */
export function get3Dto2DPos(camera_3D: Camera, camera_2D: Camera, worldPos_3D: Vec3, distNd: Node): Vec3 {
    let screenPos = camera_3D.worldToScreen(worldPos_3D, tmp_v3)
    let worldPos_2D = camera_2D.screenToWorld(screenPos, tmp_v3)
    let newPos = distNd.getComponent(UITransform).convertToNodeSpaceAR(worldPos_2D, tmp_v3)
    return v3(newPos)
}

/**
 * 螢幕 2D 座標點轉換成 3D 座標點 (目前 Z 軸用不到)
 * - 因為 3D Root 可能不在原點, 所以需要多轉換回 Root Node 座標
 */
export function get2Dto3DPos(camera_3D: Camera, screenPos: Vec3): Vec3 {
    let intersect = v3(0, 0, 0)

    let ray = camera_3D.screenPointToRay(screenPos.x, screenPos.y, tmp_ray)
    let h = Math.abs(ray.o.z / ray.d.z)
    intersect.x = ray.o.x + (h * ray.d.x)
    intersect.y = ray.o.y + (h * ray.d.y)
    intersect.z = ray.o.z + (h * ray.d.z)

    return intersect
}

/**
 * 2D座標點擊3D節點
 */
export function get2Dto3DNode(camera_3D: Camera, screenPos: Vec3): Node[] {
    let ray = camera_3D.screenPointToRay(screenPos.x, screenPos.y, tmp_ray)
    let isHit = PhysicsSystem.instance.raycast(ray)
    let nodes = [] as Node[]

    if (isHit) {
        let results = PhysicsSystem.instance.raycastResults
        for (let i = 0, len = results.length; i < len; ++i) {
            const result = results[i]
            nodes.push(result.collider.node)
        }
    }

    return nodes
}

/**
 * type 1: Animation.play(), type 2: Animation.crossFade()
 */
function _playAnime(type: number, actor: Node | Animation, name: string = null, overwriteWrapMode: AnimationClip.WrapMode = null, endFunc: Function = null): AnimationState {
    let st = null as AnimationState
    let anime = actor as Animation
    if (actor instanceof Node) {
        anime = actor.getComponent(Animation)
    }

    if (anime) {
        if (name === null) {
            if (anime.defaultClip) name = anime.defaultClip.name
            else if (anime.clips[0]) name = anime.clips[0].name
            else name = ''
        }

        anime.off(Animation.EventType.FINISHED)
        switch (type) {
            case 1: anime.play(name); break
            case 2: anime.crossFade(name); break
        }

        st = anime.getState(name)

        if (!st) {
            return null
        }
        if (overwriteWrapMode !== null) {  // WrapMode could be 'zero' number
            st.wrapMode = overwriteWrapMode
        }
        if (endFunc) {
            anime.once(Animation.EventType.FINISHED, () => endFunc())
        }
    }
    return st
}

/**
 * 播放 creator 動畫 (overwriteWrapMode = null 表示不更改 clip 預設值)
 * 適用 Animation 與 SkeletalAnimation 
 * @param actor 節點或擁有動作組件的節點
 * @param name 動畫名稱
 * @param overwriteWrapMode 撥放模式 ex. Default 或 Loop
 * @param endFunc 播放結束的回調
 * 
 */
export function playAnime(actor: Node | Animation, name: string = null, overwriteWrapMode: AnimationClip.WrapMode = null, endFunc: Function = null): AnimationState {
    return _playAnime(1, actor, name, overwriteWrapMode, endFunc)
}

/**
 * 播放 creator 動畫 (overwriteWrapMode = null 表示不更改 clip 預設值)
 * 適用 Animation 與 SkeletalAnimation 
 * @param actor 節點或擁有動作組件的節點
 * @param name 動畫名稱
 * @param overwriteWrapMode 撥放模式 ex. Default 或 Loop
 * @param endFunc 播放結束的回調
 * 
 */
export function playAnimeCrossFade(actor: Node | Animation, name: string = null, overwriteWrapMode: AnimationClip.WrapMode = null, endFunc: Function = null): AnimationState {
    return _playAnime(2, actor, name, overwriteWrapMode, endFunc)
}

/**
 * 播放 spine 動畫 (spine 使用 cache mode 時, 將不會回傳 TrackEntry)
 * @param actor 節點或擁有動作組件的節點
 * @param name 動畫名稱
 * @param isLoop 是否循環撥放
 * @param endFunc 播放結束的回調
 * @param track 撥放執行序
 */
export function playSpine(actor: Node | sp.Skeleton, name: string, isLoop: boolean = false, endFunc: Function = null, track: number = 0): sp.spine.TrackEntry {
    let spine = actor as sp.Skeleton
    if (actor instanceof Node) {
        spine = actor.getComponent(sp.Skeleton)
    }

    let te = null as sp.spine.TrackEntry
    if (spine) {
        spine.setCompleteListener(null)
        te = spine.setAnimation(track, name, isLoop)

        if (endFunc) {
            spine.setCompleteListener(() => endFunc())
        }
    }
    return te
}

/**
 * 取得滾分時數字需要顯示小數點後幾位 (預設有小數點情況時顯示 2 位)
 * @param num 數字
 * @param maxDecimal 小數點幾位
 */
export function getNumIncreaseDecimal(num: number, maxDecimal: number = 2): number {
    return Math.abs(num - Math.floor(num)) > 1e6 ? maxDecimal : 0
}

/**
 * 設定緩動的運行速度
 */
export function setTweenSpeed<T>(tween: Tween<T>, speed: number) {
    let action = (<any>tween)._finalAction
    if (action) {
        action._speedMethod = true
        action._speed = speed
    }
}

/**
 * 取得緩動的運行速度
 */
export function getTweenSpeed<T>(tween: Tween<T>): number {
    let action = (<any>tween)._finalAction
    if (action && action._speedMethod) {
        return action._speed
    }
    return 1
}

/**
 * easeIn for tweening (慢到快)
 * ex. tween(node).to(1.0, { position: goalEL }, { easing: easeIn(1.5) }).start()
 * @param rate 緩動指數
 */
export function easeIn(rate: number): (t: number) => number {
    return t => Math.pow(t, rate)
}

/**
 * easeOut for tweening (快到慢)
 * ex. tween(node).to(1.0, { position: goalEL }, { easing: easeOut(1.5) }).start()
 * @param rate 緩動指數
 */
export function easeOut(rate: number): (t: number) => number {
    return t => 1.0 - Math.pow(1.0 - t, rate)
}

/**
 * easeInOut for tweening (慢到快, 快到慢)
 * ex. tween(node).to(1.0, { position: goalEL }, { easing: easeInOut(1.5) }).start()
 * @param rate 緩動指數
 */
export function easeInOut(rate: number): (t: number) => number {
    return t => {
        let x = t * 2.0
        if (x < 1.0) {
            return 0.5 * Math.pow(x, rate)
        }
        return 1.0 - (0.5 * Math.pow(2 - x, rate))
    }
}

/**
 * 取得滾分效果緩動
 */
export function getNumIncreaseTween(dur: number, a: number, b: number, setter: (num: number) => void, easing?: (t: number) => number): Tween<any> {
    let _lerp = (t: number) => {
        setter(lerp(a, b, t))
        return t
    }
    if (easing) {
        _lerp = (t: number) => {
            setter(lerp(a, b, t))
            return easing(t)
        }
    }
    return tween({ _: 0 })
        .to(dur, { _: 1 }, { easing: _lerp })
        .call(() => setter(b))
}

/**
 * 假的CardinalSplineTo  實作方法完全是假的
 */
export function fakeCardinalSplineTo(moveNd: Node, dt: number, c: Vec3[], t: number): Tween<Node> {
    const pt = dt / c.length;
    let tweenList = tween(moveNd);
    for (let i = 1; i < c.length; i++) {
        const isStart = (i == 1);
        const isEnd = (i == c.length - 1);
        tweenList.to(isStart || isEnd ? pt * 1.5 : pt, { position: c[i] }, { easing: isStart ? easeIn(1.5) : isEnd ? easeOut(1.5) : null })
    }
    return tweenList;
}

/**
 * 播放金額加錢放大的效果 (預設節點大小為 1)
 */
export function playAddCoinFx(coinNode: Node, vibrationTimes: number) {
    let repeats = vibrationTimes;
    let s0 = 1, s1 = 1.04, s2 = 1.08;
    let pos = v3(coinNode.position);
    let pos2 = v3(pos).add3f(0, 2, 0);
    let tag = 22336;

    Tween.stopAllByTag(tag, coinNode);
    coinNode.setPosition(pos2);
    coinNode.setScale(s2, s2, s2);

    tween(coinNode)
        .to(0.04, { scale: v3(s1, s1, s1), position: pos })
        .to(0.04, { scale: v3(s2, s2, s2), position: pos2 })
        .call(() => {
            if (--repeats <= 0) {
                coinNode.setPosition(pos);
                coinNode.setScale(s0, s0, s0);
            }
        })
        .union().repeat(vibrationTimes).tag(tag)
        .start();
}

/**
 * 晃動效果
 */
export function shake2D(node: Node, time: number, freq: number, strength: number) {
    // 是否在場景中
    if (node.activeInHierarchy === false) {
        return
    }

    // 是否重複呼叫
    if ((<any>node).__shake2D) {
        shake2DStop(node)
        shake2D(node, time, freq, strength)
        return
    }

    // 晃動資訊
    let t = time, f = Math.max(1, Math.round(freq)), s = strength
    let l = misc.clampf(f, 0, 12)
    let o = v2(node.position.x, node.position.y)
    let m = tween<Node>()
    let d = 1 / f

    // 緩存隨機向量
    let v2_dir = (globalThis.__lstDirectionVec2 as Vec2[]) || []
    if (v2_dir.length === 0) {
        let two_pi = 2 * Math.PI
        for (let i = 0; i < 100; ++i) {
            let rad = two_pi * (i / 100)
            v2_dir.push(v2(0, 1).rotate(rad))
        }
    }

    // 晃動路徑
    let p = v2(), moveProps = { position: null as Vec3 }
    for (let i = 0; i < l; ++i) {
        p.set(rItem(v2_dir))
        p.multiplyScalar(s).add(o)
        moveProps.position = v3(p.x, p.y, node.position.z)
        m.to(d, moveProps)
    }

    // 執行晃動
    (<any>node).__shake2D = {
        shakingTween: tween(node).then(m).repeatForever().start(),
        cleanupTween: tween(node).delay(t).call(() => shake2DStop(node)).start(),
        origin: o
    }
}

/**
 * 停止晃動效果
 */
export function shake2DStop(node: Node) {
    let shake2D = (<any>node).__shake2D
    if (shake2D) {
        if (node.isValid === true) {
            shake2D.shakingTween.stop()
            shake2D.cleanupTween.stop()
            node.setPosition(
                shake2D.origin.x,
                shake2D.origin.y
            )
        }
        (<any>node).__shake2D = null
    }
}

/**
 * 用於運行時手動拔除 lateUpdate
 */
export function cancelLateUpdate(comp: Component) {
    let compScheduler = (<any>director)._compScheduler
    if (!compScheduler || !compScheduler.lateUpdateInvoker) {
        console.warn('[Warn] The lateUpdate function cannot to cancel.')
        return
    }
    compScheduler.lateUpdateInvoker.remove(comp)
}

/**
 * 轉換成乾淨的數字，小數5位4捨5入 (SERVER同步規則)
 * ex: 1234.0000000000000064 -> 1234
 * ex: 1234.9449999999999997 -> 1234.945
 * @param num 
 * @deprecated 請改用 cleanNum
 */
export function CleanNum(num: number) {
    return cleanNum(num)
}

/**
 * 轉換成乾淨的數字，小數5位4捨5入 (SERVER同步規則)
 * ex: 1234.0000000000000064 -> 1234
 * ex: 1234.9449999999999997 -> 1234.945
 * @param num 
 */
export function cleanNum(num: number): number {
    if(!num) num = 0;
    return parseFloat(num.toFixed(5))
}

/**
 * 將數字轉換成小數幾位，無條件捨去，顯示千分位
 * @param num 數字
 * @param x 小數幾位
 * @deprecated 請改用 toThousandDecimalX
 */
export function ToThousandDecimalX(num: number, x: number): string {
    return toThousandDecimalX(num, x)
}

/**
 * 將數字轉換成小數幾位，無條件捨去，顯示千分位
 * @param num 數字
 * @param x 小數幾位
 */
export function toThousandDecimalX(num: number, x: number): string {
    let str = numeral(num).format('0,0.0000') as string
    if (x === 0)
        str = str.substring(0, str.length - 5)
    else
        str = str.substring(0, str.length - Math.max(0, 4 - x))
    return str
}

/**
 * 將數字轉換成'最多'小數幾位，無條件捨去，不顯示千分位
 * @param num 數字
 * @param x 小數幾位
 */
export function toDecimalX(num: number, x: number): number {
    let mul = 1;
    for (let i = 0; i < x; ++i) { mul = mul * 10; }
    let value = Math.floor(cleanNum(num * mul));
    value = cleanNum(value / mul);
    return value
}

/**
 * 將數字轉換成K位顯示   998.9=>999    2500=>2.5K
 * @param num 數字
 * @param x 強制保留小數幾位
 * @deprecated 請改用 walletManager.FormatCoinNum_MK方法
 */
export function toKNum(num: number, x: number = 0): string {
    if (num < 1000) return Math.round(num).toString()

    let point = x == 0 ? "[00]" : ""
    for (let i = 0; i < x; i++) point += "0"
    let str = numeral(num / 1000).format('0.' + point) as string
    str = str + "K"
    return str
}

/**
 * 取得小數幾位
 * @param num 數字
 */
export function getPointCnt(num: number): number {
    let fractStr = cleanNum(num).toString().split('.')[1];
    return fractStr ? fractStr.length : 0;
}
/**
 * 將數字自動轉換成 M | K 位顯示且無4捨5入(不足1k則無變化)  123 -> 123    1234 -> 1.234K
 * @param num 數字
 * @deprecated 請改用 walletManager.FormatCoinNum_MK方法
 */
export function convertToMK(num: number): string {
    let value = cleanNum(num);
    let str = `${value}`;
    if (num >= 1000000) {
        value = value / 1000000;
        str = `${value}M`;
    } else if (num >= 1000) {
        value = value / 1000;
        str = `${value}K`;
    }
    return str
}

/**
 * 隱藏玩家姓名(顯示後3位)
 */
export function hideName(str: string) {
    if (BUILD) {
        let slen = str.length
        if (slen <= 4) {
            return str
        }
        return '*' + str.substring(slen - 4, slen)
    }
    return str
}

/**
 * 三階貝茲曲線移動, 控制點: 當前位置, c1, c2, end
 */
export function bezier3DTo(duration: number, c1: Vec3, c2: Vec3, end: Vec3): Tween<Node> {
    const _ctrlPoints = [v3(), v3(c1), v3(c2), v3(end)]
    const _onStart = (target: Node) => {
        _ctrlPoints[0].set(target.position)
    }
    const _onUpdate = (target: Node, ratio: number) => {
        const c1 = _ctrlPoints[0], c2 = _ctrlPoints[1]
        const c3 = _ctrlPoints[2], c4 = _ctrlPoints[3]
        target.setPosition(
            bezier(c1.x, c2.x, c3.x, c4.x, ratio),
            bezier(c1.y, c2.y, c3.y, c4.y, ratio),
            bezier(c1.z, c2.z, c3.z, c4.z, ratio)
        )
    }
    return tween().to(duration, {}, { onStart: _onStart, onUpdate: _onUpdate })
}

/**
 * 三階貝茲曲線移動, 控制點: 當前位置, c1, c2, end (2D 版計算量較少)
 */
export function bezier2DTo(duration: number, c1: Vec2, c2: Vec2, end: Vec2): Tween<Node> {
    const _ctrlPoints = [v2(), v2(c1), v2(c2), v2(end)]
    const _onStart = (target: Node) => {
        _ctrlPoints[0].set(target.position.x, target.position.y)
    }
    const _onUpdate = (target: Node, ratio: number) => {
        const c1 = _ctrlPoints[0], c2 = _ctrlPoints[1]
        const c3 = _ctrlPoints[2], c4 = _ctrlPoints[3]
        target.setPosition(
            bezier(c1.x, c2.x, c3.x, c4.x, ratio),
            bezier(c1.y, c2.y, c3.y, c4.y, ratio)
        )
    }
    return tween().to(duration, {}, { onStart: _onStart, onUpdate: _onUpdate })
}

/**
 * 取得腳本的方法   因為APP版有跨bundle導致取不到的問題
 */
export function getComponentByName<T extends Component>(rootNd: Node, targetComp: Constructor<T>) {
    if (!rootNd) return null;
    let className = targetComp.prototype["__classname__"];
    for (let i = 0; i < rootNd.components.length; i++) {
        let comp = rootNd.components[i];
        // 最多只找五層  找不到就算了
        for (let j = 0; j < 5; j++) {
            if (!comp) break;
            if (comp["__classname__"] == className) return rootNd.components[i] as T;
            if (comp["__classname__"] == "cc.Component") break;
            comp = Object.getPrototypeOf(comp);
        }
    }
    return null;
}

/**
 * 取得魚隻腳本的方法   因為APP版有跨bundle導致取不到的問題
 */
export function lookUpComponentByName<T extends Component>(rootNd: Node, comp: Constructor<T>) {
    if (!rootNd) return null;
    let findComp = getComponentByName(rootNd, comp);
    if (findComp) return findComp;
    return lookUpComponentByName(rootNd.parent, comp);
}

/**
 *  無條件捨去到小數點第 N 位
 *  @param num     原始數字
 *  @param decimal 小數點第 N 位
 */
export function roundDown(num, decimal: number): number {
    return Math.floor(Number(`${num}e${decimal}`)) / Number(`1e${decimal}`)
}

/**
 * 打亂陣列
 * @param array 
 * @returns 
 */
export function shuffleArray(array: number[]): number[] {
    const shuffledArray = array.slice(); // Create a shallow copy to avoid modifying the original array.
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

/**
 * 取得隨機且不重複且指定長度的陣列
 * @param inputArray 
 * @param length 
 * @returns 
 */
export function generateRandomArray(inputArray: number[], length: number): number[] {
    const shuffledArray = shuffleArray(inputArray);
    return shuffledArray.slice(0, length);
}

/**
 * 判斷此數字是否帶有小數
 * @param number 
 * @returns 
 */

export function hasDecimal(number: number): boolean {
    // 使用 % 運算符來檢查是否有小數部分
    return number % 1 !== 0;
}