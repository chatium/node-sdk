import { AccountCtx } from './context';
import { attachMedia, AttachMediaAction } from '@chatium/json';
export declare function chatiumFsAttachMedia(ctx: AccountCtx, props: Parameters<typeof attachMedia>[1]): AttachMediaAction;
export declare function chatiumFsThumbnailUrl(hash: string, width?: number, height?: number): string;
