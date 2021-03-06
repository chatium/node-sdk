import { ChatiumAuthType } from './ChatiumAuth';
import { ChatiumUserRole } from './ChatiumUser';
export interface ChatiumAppRequestToken {
    acc: number;
    host: string;
    aid?: number;
    atp?: ChatiumAuthType;
    akey?: string;
    tkn?: string;
    uid?: string;
    ufn?: string;
    uln?: string;
    urs?: ChatiumUserRole[];
    uqid?: string;
}
export declare function validateChatiumAppRequestToken(token: string, secret: string): ChatiumAppRequestToken;
