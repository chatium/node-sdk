import { AccountCtx, AppCtx } from '../context';
import { AuthCtx, OptionalAuthCtx } from '../ChatiumAuth';
export declare function chatiumGet<R = unknown>(ctx: AccountCtx & AppCtx & AuthCtx, url: string): Promise<R>;
export declare function chatiumPost<R = unknown, P = unknown>(ctx: AccountCtx & AppCtx & OptionalAuthCtx, url: string, params?: P): Promise<R>;
