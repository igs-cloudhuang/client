# lobby_ingame_ui

在遊戲端使用大廳天bar，以及其他大廳UI顯示的插件定義

## 引入大廳in game ui 步驟

1.  import 定義檔
    ```typescript
    import { AppLobby, init } from 'db://lobby_ingame_ui/LobbyIngameUiDefine';
    ```

2.  呼叫初始化function init
    ```typescript
    init();
    ```

這樣就初始化完畢了

## 顯示UI

*   顯示整體in game的UI，呼叫後才會顯示天bar頂的小箭頭，一般建議進入主場玩家可操作後再予顯示
    ```typescript
    AppLobby.CommonGameLayout.show();
    ```
    並呼叫
    ```typescript
    AppLobby.CommonGameLayout.onResize();
    ```
    來設定正確的直橫版方向。當中onResize，若遊戲端有正確串接並發射” onSubGameRotation”的直橫轉換事件的話，大廳這邊會主動對天bar呼叫onResize，遊戲端不用再次呼叫onResize

*   隱藏整體in game的UI
    ```typescript
    AppLobby.CommonGameLayout.hide();
    ```

## 流程

*   老虎機: 

## 事件系統

目前天bar提供了幾項UI事件供遊戲端監聽使用,請直接使用cc.Node內建的監聽系統監聽以下事件即可
*   TOP_BAR_SHOW_START : 天bar開始打開
*   TOP_BAR_SHOW_END : 天bar打開完畢

使用方式如下
```typescript
AppLobby.CommonGameLayout.node.on(AppLobby.CommonGameLayout.EventType.TOP_BAR_SHOW_START, () => {
    console.log("開始打開");
})

AppLobby.CommonGameLayout.node.on(AppLobby.CommonGameLayout.EventType.TOP_BAR_SHOW_END, () => {
    console.log("打開完成");
})
```

## 其他功能

*   `shopTopBar(sec?: number)` : 伸展天barUI，sec為自動展開秒數，0為不收起，不填入則是大廳自訂自動收起時間(5秒)
    ```typescript
    AppLobby.CommonGameLayout.shopTopBar();
    ```
