// ----------------------------------------------------------------
// Declaration
// ----------------------------------------------------------------
interface FSM_State {
    (fsm: Automata, dt?: number): void;
}

interface FSM_Map {
    [key: string]: FSM_State;
}

const FSM_ENTER_FLAG = 1 << 0;
const FSM_POP_FLAG = 1 << 1;

// ----------------------------------------------------------------
// Class Automata
// ----------------------------------------------------------------

/**
 * Finite-State Machine
 */
export class Automata {

    private flags = 0;
    private stack = new Array<FSM_State>();

    private myStates = null as FSM_Map;
    private nextState = null as FSM_State;
    private stateNames = null as string[];

    /**
     * 建構子
     * @param entry 起始狀態
     * @param states 自動機中的各種狀態
     */
    constructor(entry?: string | FSM_State, states?: FSM_Map) {
        if (states)
            this.init(states);
        if (entry)
            this.setEntry(entry);
    }

    /**
     * 初始化
     * @param states 自動機中的各種狀態
     */
    init(states: FSM_Map): Automata {
        this.flags = 0;
        this.stack.length = 0;
        this.myStates = states;
        this.nextState = null;
        return this;
    }

    /**
     * 設定起始狀態
     * @param state 起始狀態
     */
    setEntry(state: string | FSM_State): boolean {
        if (this.myStates !== null && this.stack.length === 0) {
            this.push(state);
            return true;
        }
        return false;
    }

    /**
     * 壓入新狀態並在下次的 tick 進入該狀態 (會保留上個狀態在 stack 中)
     * @param state 新狀態
     */
    push(state: string | FSM_State) {
        if (typeof state === 'function') {
            this.nextState = state;
            return;
        }
        this.nextState = this.myStates[state];
    }

    /**
     * 準備彈出狀態並在下次的 tick 離開
     */
    pop() {
        this.flags |= FSM_POP_FLAG;
    }

    /**
     * 切換到新狀態並在下個 tick 執行 (不會保留舊狀態在 stack 中)
     * @param state 新狀態
     */
    transit(state: string | FSM_State) {
        this.pop();
        this.push(state);
    }

    /**
     * 自動機的更新函式
     */
    tick(dt?: number) {
        const fsm = this;
        const stk = this.stack;

        // Pop from the stack
        if (fsm.flags & FSM_POP_FLAG) {
            if (stk.length >= 1) {
                stk.pop();
                fsm.flags |= FSM_ENTER_FLAG;
            }
            fsm.flags &= ~FSM_POP_FLAG;
        }

        // Push to the stack
        if (fsm.nextState !== null) {
            stk.push(fsm.nextState);
            fsm.flags |= FSM_ENTER_FLAG;
            fsm.nextState = null;
        }

        // Excute the current state
        if (stk.length >= 1) {
            stk[stk.length - 1](fsm, dt);
            fsm.flags &= ~FSM_ENTER_FLAG;
        }
    }

    /**
     * 是否第一次進入目前狀態
     */
    isEntering(): boolean {
        return !!(this.flags & FSM_ENTER_FLAG);
    }

    /**
     * 是否準備切換狀態
     */
    isPopping(): boolean {
        return !!(this.flags & FSM_POP_FLAG);
    }

    /**
     * 查詢該狀態是否在運行
     * @param state 查詢狀態
     */
    isRunning(state: string | FSM_State): boolean {
        const stk = this.stack;
        const goal = (typeof state === 'function') ? state : this.myStates[state];
        if (stk.length >= 1)
            return stk[stk.length - 1] === goal;
        return false;
    }

    /**
     * 取得堆疊中的狀態,
     * 沒有則返回空值
     */
    private getState(index: number): FSM_State {
        let state = this.stack[index];
        return state !== undefined ? state : null;
    }

    /**
     * 返回堆疊中的上個狀態 (Pop 可快速退到上個狀態),
     * 沒有則返回空值
     */
    getPrevState(): FSM_State {
        return this.getState(this.stack.length - 2);
    }

    /**
     * 返回堆疊中的當前狀態,
     * 沒有則返回空值
     */
    getCurrState(): FSM_State {
        return this.getState(this.stack.length - 1);
    }

    /**
     * 返回堆疊中的當前狀態名稱 (如果需要知道名稱的話),
     * 沒有則返回空字串
     * @param resetMemory 當狀態數量改變後, 請更新狀態名的快取
     */
    getCurrStateName(resetMemory: boolean = false): string {
        let state = this.getCurrState();
        if (state !== null) {
            const states = this.myStates;
            if (this.stateNames === null || resetMemory === true)
                this.stateNames = Object.keys(states);

            const names = this.stateNames;
            for (let name of names) {
                if (states[name] === state)
                    return name;
            }
        }
        return '';
    }

    /**
     * 自動機中的各種狀態
     */
    get states(): FSM_Map {
        return this.myStates;
    }

}
