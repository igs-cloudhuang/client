import { _decorator, Component, Node, Label, RichText } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('LangFont')
export class LangFont extends Component {

    start() {
        let labelComp = (
            this.getComponent(Label) ||
            this.getComponent(RichText)
        );

        // 某些語系也許需要自己的字型檔
        if (!labelComp.font)
            labelComp.font = Annin.i18n.getFont();

        // 緬甸文保證行距至少字行大小的1.5倍
        if(Annin.i18n.getLangCode() == Annin.i18n.LangCode.my_MM){
            labelComp.lineHeight = Math.max(labelComp.lineHeight, labelComp.fontSize * 1.5);
        }

        // 設定完成後該元件功成身退
        this.destroy();
    }
}
