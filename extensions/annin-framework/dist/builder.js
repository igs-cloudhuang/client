"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const complexTestItems = {
    jili: {
        label: 'JILI',
        render: {
            ui: 'ui-input',
        },
    },
    tada: {
        label: 'TADA',
        render: {
            ui: 'ui-input',
        },
    },
};
exports.configs = {
    'web-mobile': {
        hooks: './build/web-mobile',
        options: {
            enabled: {
                label: 'enabled',
                description: '是否使用',
                default: false,
                render: {
                    ui: 'ui-checkbox',
                },
            },
            gameId: {
                label: '遊戲 ID',
                render: {
                    ui: 'ui-num-input',
                },
                verifyRules: ['required'],
            },
            gameName: {
                label: '自定義遊戲名稱',
                type: 'object',
                itemConfigs: complexTestItems,
            },
            delay: {
                label: '編譯前先暫停多久',
                render: {
                    ui: 'ui-num-input',
                },
                default: 3000,
            },
        },
    },
    'android': {
        hooks: './build/android',
    }
};
