import { Component, Label, RichText, tween, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LangTxt')
export class LangTxt extends Component {

    @property
    no: number = 0;

    @property({
        tooltip: '是否使用共用字表?',
    })
    useCommon: boolean = false;

    private label = null as Label | RichText;

    start() {
        if (this.label === null)
            this.init();

        this.changeString(this.no);
    }

    private init() {
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

        this.label = labelComp;
    }

    /**
     * 更換文字
     */
    changeString(no: number) {
        this.no = no;
        if (this.label === null) return;    // 等onLoad自動觸發
        if(this.useCommon) {
            this.label.string = Annin.i18n.getCommString(no);
        }
        else{
            // 等待字串讀取完成
            let waiting = tween(this.node)
                .call(() => {
                    if (Annin.i18n.isLangJsonLoaded() === true) {
                        this.label.string = Annin.i18n.getString(no);
                        waiting.stop();
                        waiting = null;
                    }
                })
                .delay(0.1)
                .union()
                .repeatForever()
                .start();

        }
    }

}
