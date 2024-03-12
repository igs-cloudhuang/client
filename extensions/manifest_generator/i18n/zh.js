module.exports = {
    title: "bundle md5 manifest 產生器",
    ruleTest_msg: "验证该字段符合规则",
    options: {
        enterCocos: "请输入 'cocos' 字符 ",
        remoteAddress: "资源服务地址"
    },
    description: "產出bundle的版本號json檔",
    phase: {
        start: "開始獲取bundle md5碼",
        compelete: "versions.json 產生成功"
    }
};