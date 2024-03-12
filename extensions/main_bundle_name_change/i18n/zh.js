module.exports = {
    title: "main bundle子包更名器",
    options: {
        enabledlabel: "啟用",
        enabledDescription: "是否啟用開插件,此插件必須開啟擦除模塊功能才能運行",
        bundleNameDescription: "main bundle要變更的名字(需與上傳CDN位置同名)",
        bundleNamePlaceholder: "輸入要變更的名字"
    },
    description: "讓大廳讀取遊戲時能夠變更main bundle名用",
    exception: {
        disableEraseModules: "未開啟擦除模塊功能,此插件必須開啟擦除模塊功能才能運行\n如無需求應當關閉此插件",
        nullBundleName: "沒有填入要變更的bundle name\n如無需求應當關閉此插件"
    },
    phase: {
        start: "開始修改main bundle index.js",
        compelete: " index.js 修改完成"
    }
};