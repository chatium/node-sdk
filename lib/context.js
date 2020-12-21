"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatiumContext = void 0;
const ChatiumAppRequestToken_1 = require("./ChatiumAppRequestToken");
const errors_1 = require("./errors");
function getChatiumContext(ctx, headers) {
    if (typeof headers['x-chatium-application'] !== 'string') {
        throw new errors_1.ApiError('x-chatium-application header is required!');
    }
    const token = ChatiumAppRequestToken_1.validateChatiumAppRequestToken(headers['x-chatium-application'], ctx.app.apiSecret);
    return {
        ...ctx,
        uniqId: token.uqid ? token.uqid : null,
        account: {
            id: token.acc,
            host: token.host,
        },
        auth: token.aid
            ? {
                id: token.aid,
                type: token.atp,
                key: token.akey,
                requestToken: token.tkn,
            }
            : null,
        user: token.uid
            ? {
                id: token.uid,
                roles: token.urs,
                firstName: token.ufn || null,
                lastName: token.uln || null,
            }
            : null,
    };
}
exports.getChatiumContext = getChatiumContext;
