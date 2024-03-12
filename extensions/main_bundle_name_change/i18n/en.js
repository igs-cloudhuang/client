module.exports = {
    title: "main bundle name change",
    options: {
        enabledlabel: "enable",
        enabledDescription: "Enable this plugin, it require \"Erase Modules\" be enabled",
        bundleNameDescription: "Bundle Name want to change, which need be same name with CDN name",
        bundleNamePlaceholder: "Enter new bundle name"
    },
    description: "For lobby load this main bundle that it can change the main bundle name",
    exception: {
        disableEraseModules: "\"Erase Modules\" is disabled, this plugin need \"Erase Modules\" be enabled.\nIf don't need it, you should disable this plugin",
        nullBundleName: "Bundle Name is empty.\nIf don't need it, you should disable this plugin"
    },
    phase: {
        start: "start modify main bundle index.js",
        compelete: " index.js modify compelete"
    }
};