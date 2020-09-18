import { ChatiumUserRole } from './ChatiumUser';
import { ChatiumAuthType } from './ChatiumAuth';
export interface ChatiumAppRequestToken {
    acc: number;
    host: string;
    aid?: number;
    atp?: ChatiumAuthType;
    tkn?: string;
    uid?: string;
    ufn?: string;
    uln?: string;
    urs?: ChatiumUserRole[];
}
export declare function validateChatiumAppRequestToken(token: string, secret: string): ChatiumAppRequestToken;
