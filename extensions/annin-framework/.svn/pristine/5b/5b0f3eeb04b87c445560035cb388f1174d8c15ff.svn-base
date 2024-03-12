import { Component, macro } from "cc"

export const Forever = macro.REPEAT_FOREVER

export interface Timer {
    /**
     * 延遲 n 秒後執行 (從下一幀開始)
     */
    delay(delay: number, callback: (task: Task) => void): Task

    /**
     * 下一幀執行
     */
    nextFrame(callback: (task: Task) => void): Task

    /**
     * 每幀執行 (從下一幀開始)
     */
    perFrame(callback: (task: Task) => void): Task

    /**
     * 延遲 n 秒後, 每幀執行 (從下一幀開始)
     */
    delay_perFrame(delay: number, callback: (task: Task) => void): Task

    /**
     * 每幀執行一次, 重複 t 次後結束 (從下一幀開始)
     */
    repeat(times: number, callback: (task: Task) => void): Task

    /**
     * 重複 t 次執行, 每次間隔 dt 秒 (從下一幀開始)
     */
    repeat_dt(times: number, dt: number, callback: (task: Task) => void): Task

    /**
     * 延遲 n 秒後, 每幀執行一次, 重複 t 次後結束, 每次間隔 dt 秒 (從下一幀開始)
     */
    delay_repeat_dt(delay: number, times: number, dt: number, callback: (task: Task) => void): Task

    /**
     * 取得所有定時器
     */
    getTasks(): Map<number, Task>

    /**
     * 關閉所有定時器
     */
    shutdownAll(): number

    /**
     * 延遲 n秒 後，再繼續執行後續程式
     * @param t 延遲秒數
     * @returns Promise
     */
    asyncDelay(t: number)

    clear()
}

export interface Task {
    owner: Component;
    mission: Function;
    /**
     * Timer 用來記錄 Task 的 Tag (請勿改動)
     */
    tag: number

    /**
     * 執行的間隔時間 (包含執行前的延遲時間)
     */
    dt: number

    /**
     * 是否有效
     */
    isValid(): boolean

    /**
     * 關閉定時器
     */
    shutdown()
}

let node: Timer
export function UpdateTimer() {
    node = Annin.Timer
}
export { node as Timer }