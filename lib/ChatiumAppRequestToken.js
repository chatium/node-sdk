"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChatiumAppRequestToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errors_1 = require("./errors");
function validateChatiumAppRequestToken(token, secret) {
    const raw = jsonwebtoken_1.verify(token, secret);
    if (typeof raw.iat !== 'number' || raw.iat + requestTokenExpirationSeconds < Math.round(Date.now() / 1000)) {
        throw new errors_1.ApiError('Chatium app token is expired');
    }
    if (typeof raw.acc === 'number' &&
        typeof raw.host === 'string' &&
        (!raw.uqid || typeof raw.uqid === 'string') &&
        (!raw.aid ||
            (typeof raw.aid === 'number' &&
                typeof raw.tkn === 'string' &&
                typeof raw.atp === 'string' &&
                (!raw.akey || typeof raw.akey === 'string'))) &&
        (!raw.uid ||
            (typeof raw.uid === 'string' &&
                Array.isArray(raw.urs) &&
                (!raw.ufn || typeof raw.ufn === 'string') &&
                (!raw.uln || typeof raw.uln === 'string')))) {
        return raw;
    }
    else {
        throw new errors_1.ApiError('Invalid chatium app token');
    }
}
exports.validateChatiumAppRequestToken = validateChatiumAppRequestToken;
const requestTokenExpirationSeconds = 5 * 60; // 5 minutes
