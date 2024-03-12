const fs = require('fs');
const path = require('path');

let langCode = process.argv[2];
let func = process.argv[3];

let newTPSPath = "./" + langCode + ".tps";
if(func == "-c"){
    if(!fs.existsSync("../" + langCode)) return;
    
    // 複製一份新的語系TPS檔
    fs.copyFileSync("main.tps", newTPSPath);
    let tps = fs.readFileSync(newTPSPath).toString();
    // 替換掉語系代碼
    tps = tps.replaceAll("XX-XX", langCode);

    // 尋找專案內放置多國語系的路徑
    let dir = ""
    let search = (srcDir)=>{
        if(!!dir) return;
        let files = fs.readdirSync(srcDir);
        for (let i = 0, len = files.length; i < len; i++) {
            if(!!dir) break;
            let file = files[i];
            let curPath = path.join(srcDir, file);

            let stats = fs.statSync(curPath);
            if (stats.isDirectory()) {
                // 如果是資料夾  判斷裡面有en-US資料夾和th-TH資料夾就當作他是我要的路徑
                let en = curPath + "\\en-US";
                let th = curPath + "\\th-TH";
                if(fs.existsSync(en) && fs.statSync(en).isDirectory() && fs.existsSync(th) && fs.statSync(th)?.isDirectory()) {
                    dir = curPath;
                    break;
                }
                else{
                    search(curPath);
                }
            }
            continue
        }
        return;
    }

    let assetsPath = "../../assets/";
    if (fs.existsSync(assetsPath)) {
        search(assetsPath);
    }
    else{
        // assets不存在  不是遊戲專案當作是公版專案
        dir = "../../Share/common/bundle/langImg";
    }
    // 替換掉路徑
    tps = tps.replaceAll("../../assets/OOOOOOO", dir);
    fs.writeFileSync(newTPSPath, tps);
}
else if(func == "-d"){
    // 刪除TPS檔
    fs.unlinkSync(newTPSPath);
}
