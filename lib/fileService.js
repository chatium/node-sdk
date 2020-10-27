"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatiumFsThumbnailUrl = exports.chatiumFsAttachMedia = void 0;
const json_1 = require("@chatium/json");
function chatiumFsAttachMedia(ctx, props) {
    return json_1.attachMedia(chatiumFsUploadEndpoint(ctx), props);
}
exports.chatiumFsAttachMedia = chatiumFsAttachMedia;
function chatiumFsThumbnailUrl(hash, width, height) {
    if ((!width && !height) || (width && height && !(width > 0 && height > 0))) {
        width = 600;
        height = undefined;
    }
    const size = (width ? width : '') + 'x' + (height ? height : '');
    return `${fileServiceHost}/fileservice/file/thumbnail/h/${hash}/s/${size}`;
}
exports.chatiumFsThumbnailUrl = chatiumFsThumbnailUrl;
function chatiumFsUploadEndpoint(ctx) {
    return fileServiceHost + '/upload?accountId=' + ctx.account.id;
}
const fileServiceHost = `https://fs.chatium.io`;
