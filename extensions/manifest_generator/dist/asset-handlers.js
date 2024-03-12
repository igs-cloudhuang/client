"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressTextures = void 0;
const compressTextures = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    // for (let i = 0; i < Array.from(tasks).length; i++) {
    //     const task = Array.from(tasks)[i];
    //     if (task.format !== 'jpg') {
    //         continue;
    //     }
    //     // task.dest should change suffix before compress
    //     task.dest = task.dest.replace('.png', '.jpg');
    //     await pngToJPG(task.src, task.dest, task.quality as number);
    //     // The compress task have done needs to be removed from the original tasks
    //     tasks.splice(i, 1);
    // }
});
exports.compressTextures = compressTextures;
// async function pngToJPG(src: string, dest: string, quality: number) {
//     const img = await getImage(src) as CanvasImageSource;
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0);
//     const imageData = canvas.toDataURL('image/jpeg', quality / 100);
//     await outputFile(dest, imageData);
//     console.debug('pngToJPG', dest);
// }
// function getImage(path: string) {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.onload = function() {
//             resolve(img);
//         };
//         img.onerror = function(err) {
//             reject(err);
//         };
//         img.src = path.replace('#', '%23');
//     });
// }
