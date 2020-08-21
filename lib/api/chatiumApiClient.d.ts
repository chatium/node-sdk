import { AccountCtx, AppCtx, AuthCtx } from '../context';
export declare function chatiumGet<R = unknown>(ctx: AccountCtx & AppCtx & AuthCtx, url: string): Promise<R>;
export declare function chatiumPost<R = unknown, P = unknown>(ctx: AccountCtx & AppCtx & AuthCtx, url: string, params?: P): Promise<R>;
