export declare abstract class ChatiumError extends Error {
    abstract readonly statusCode: number;
}
export declare class NotFoundError extends ChatiumError {
    readonly type: string;
    readonly id: string | number;
    readonly statusCode = 404;
    constructor(type: string, id: string | number);
}
