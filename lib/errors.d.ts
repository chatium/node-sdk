export declare abstract class ChatiumError extends Error {
    abstract readonly statusCode: number;
}
export declare class NotFoundError extends ChatiumError {
    readonly type: string;
    readonly id: string | number;
    readonly statusCode = 404;
    constructor(type: string, id: string | number);
}
export declare class AuthRequiredError extends ChatiumError {
    readonly statusCode = 401;
    constructor(reason?: string);
}
export declare class AccessDeniedError extends ChatiumError {
    readonly statusCode = 403;
    readonly type: string | undefined;
    readonly id: string | number | undefined;
    readonly action: string | undefined;
    readonly reason: string | undefined;
    constructor(message: string);
    constructor(type: string, id: string | number, action?: string, reason?: string);
}
export declare class ApiError extends ChatiumError {
    readonly statusCode = 400;
}
export declare class WrongArgumentError extends ChatiumError {
    readonly statusCode = 500;
    constructor(reason?: string);
}
