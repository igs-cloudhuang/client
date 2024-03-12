
import { BackpackManager, MsgboxManager, RankboardManager, I18nManager, AppManager, SoundManager, RedPointMgr, WinmoreManager, WalletManager, VipwebManager, LevelManager, TouchMoveManager, ToastManager, ToolBoxManager } from 'db://annin-framework/manager';
import { Timer, Comm, Bus } from 'db://annin-framework/system';

declare global {
    namespace Annin{
        var Msgbox: MsgboxManager
        var i18n: I18nManager
        var App: AppManager
        var Backpack: BackpackManager
        var Sound: SoundManager
        var Comm: Comm
        var Bus: Bus
        var RedPoint: RedPointMgr
        var WinMore: WinmoreManager
        var Wallet: WalletManager
        var VipWeb: VipwebManager
        var Level: LevelManager
        var TouchMove: TouchMoveManager
        var Toast: ToastManager
        var Timer: Timer
        var Rankboard: RankboardManager
        var ToolBox: ToolBoxManager
    }
}