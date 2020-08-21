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
export interface AuthCtx {
    auth: {
        id: number;
        type: AuthType;
        key: string;
        requestToken: string;
    };
}
export declare enum AuthType {
    Email = "Email",
    None = "None",
    Phone = "Phone",
    Session = "Session"
}
