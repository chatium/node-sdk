"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongArgumentError = exports.ApiError = exports.AccessDeniedError = exports.AuthRequiredError = exports.NotFoundError = exports.ChatiumError = void 0;
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
class AuthRequiredError extends ChatiumError {
    constructor(reason) {
        super('Authentication required!' + (reason ? ' Reason: ' + reason : ''));
        this.statusCode = 401;
    }
}
exports.AuthRequiredError = AuthRequiredError;
class AccessDeniedError extends ChatiumError {
    constructor(...args) {
        super(args.length === 0
            ? 'Access denied!'
            : args.length === 1
                ? args[0]
                : args.length === 2
                    ? `Access denied to ${args[0]}[${args[1]}]`
                    : args.length === 3
                        ? `Access denied to ${args[0]}[${args[1]}] (${args[2]})`
                        : `Access denied to ${args[0]}[${args[1]}] (${args[2]}). ` +
                            `Reason: ${args[3]}`);
        this.statusCode = 403;
        if (args.length > 1) {
            this.type = args[0];
            this.id = args[1];
            this.action = args[2];
            this.reason = args[3];
        }
    }
}
exports.AccessDeniedError = AccessDeniedError;
class ApiError extends ChatiumError {
    constructor() {
        super(...arguments);
        this.statusCode = 400;
    }
}
exports.ApiError = ApiError;
class WrongArgumentError extends ChatiumError {
    constructor(reason) {
        super('Wrong argument error!' + (reason ? ' Reason: ' + reason : ''));
        this.statusCode = 500;
    }
}
exports.WrongArgumentError = WrongArgumentError;
