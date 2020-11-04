import { OptionalAuthCtx } from '../ChatiumAuth';
import { AccountCtx, AppCtx } from '../context';
export declare function chatiumGet<R = unknown>(ctx: AccountCtx & AppCtx & OptionalAuthCtx, url: string): Promise<R>;
export declare function chatiumPost<R = unknown, P = unknown>(ctx: AccountCtx & AppCtx & OptionalAuthCtx, url: string, params?: P): Promise<R>;
