
export interface LevelManager {
    init(enable: boolean) 

    /**
     *  刷新經驗值，注意帶入的是淨值，每款遊戲理論上有所不同
     *  @param preserve 淨值
     */
    update(preserve: number): Promise<void> 
}

let node: LevelManager
export function UpdateLevel() {
    node = Annin.Level
}
export { node as levelManager }