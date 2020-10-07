import { OptionalUserCtx } from './ChatiumUser';
import { OptionalAuthCtx } from './ChatiumAuth';
export interface AppCtx {
    app: {
        apiKey: string;
        apiSecret: string;
    };
}
export interface AccountCtx {
    account: {
        id: number;
        host: string;
    };
}
export interface UniqCtx {
    uniqId: string | null;
}
export declare function getChatiumContext(ctx: AppCtx, headers: ChatiumHeaders): AppCtx & UniqCtx & AccountCtx & OptionalAuthCtx & OptionalUserCtx;
export interface ChatiumHeaders {
    'x-chatium-application'?: string;
}
