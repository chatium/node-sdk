"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatiumPost = exports.chatiumGet = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const jsonwebtoken_1 = require("jsonwebtoken");
function chatiumGet(ctx, url) {
    return chatiumRequest(ctx, 'get', url, {});
}
exports.chatiumGet = chatiumGet;
function chatiumPost(ctx, url, params) {
    return chatiumRequest(ctx, 'post', url, { data: params });
}
exports.chatiumPost = chatiumPost;
/**
 * DRY function for any chatium api request
 */
async function chatiumRequest(ctx, method, url, config) {
    var _a;
    const accountUrl = ctx.account.host + (url.startsWith('/') ? '' : '/') + url;
    const requestResult = await axios_1.default({
        method,
        url: 'https://' + accountUrl,
        headers: {
            'x-chatium-api-key': ctx.app.apiKey,
            authorization: createChatiumApiToken(ctx, method, accountUrl),
        },
        ...config,
    });
    if (requestResult.data.success) {
        return requestResult.data.data;
    }
    else {
        throw new Error(`Error response from chatium backend on ${(_a = requestResult.config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()} ` +
            `${requestResult.config.url} (${requestResult.data.statusCode}): ${requestResult.data.reason}`);
    }
}
function createChatiumApiToken(ctx, method, url) {
    const token = {
        iat: Math.ceil(Date.now() / 1000),
    };
    if (ctx.auth) {
        token.tkn = ctx.auth.requestToken;
    }
    return jsonwebtoken_1.sign(token, ctx.app.apiSecret + method + url);
}
