"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ChatiumError = void 0;
class ChatiumError extends Error {
}
exports.ChatiumError = ChatiumError;
class NotFoundError extends ChatiumError {
    constructor(type, id) {
        super(`'${id}' is not found in '${type}'`);
        this.type = type;
        this.id = id;
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
