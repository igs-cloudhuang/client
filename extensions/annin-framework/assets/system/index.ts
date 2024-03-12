import { UpdateApp, UpdateBackpack, Updatei18n, UpdateLevel, UpdateMsgbox, UpdateRankboard, UpdateRedPoint, UpdateSound, UpdateToast, UpdateToolBox, UpdateTouchMove, UpdateVipWeb, UpdateWallet, UpdateWinMore } from '../manager'
import { UpdateBus } from './bus'
import { UpdateComm } from './comm'
import { UpdateTimer } from './timer'

export * from './automata'
export * from './bus'
export * from './comm'
export * from './timer'


export function AnninInit() {
    UpdateSound()
    UpdateTouchMove()
    UpdateToast()
    UpdateApp()
    Updatei18n()
    UpdateMsgbox()
    UpdateVipWeb()
    UpdateWallet()
    UpdateWinMore()
    UpdateLevel()
    UpdateBackpack()
    UpdateRedPoint()
    UpdateRankboard()
    UpdateToolBox()

    UpdateBus()
    UpdateComm()
    UpdateTimer()
}
