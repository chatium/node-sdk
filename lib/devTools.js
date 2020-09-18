"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerHotReload = void 0;
const chatiumApiClient_1 = require("./api/chatiumApiClient");
async function triggerHotReload(ctx, backendDomain = 'chatium.com') {
    const syscallCtx = {
        ...ctx,
        account: {
            id: 1,
            host: backendDomain,
        },
        auth: null,
    };
    await chatiumApiClient_1.chatiumPost(syscallCtx, `/api/v1/dev/hot-reload/${process.env.DEV_TUNNEL_DOMAIN || ''}`);
}
exports.triggerHotReload = triggerHotReload;
