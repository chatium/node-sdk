export interface ChatiumUser {
    id: string;
    roles: ChatiumUserRole[];
    firstName: string | null;
    lastName: string | null;
}
export declare enum ChatiumUserRole {
    Admin = "Admin",
    Staff = "Staff",
    Support = "Support",
    ActiveSupport = "ActiveSupport",
    Developer = "Developer",
    BetaTester = "BetaTester",
    User = "User"
}
export interface UserCtx {
    user: ChatiumUser;
}
export interface OptionalUserCtx {
    user: ChatiumUser | null;
}
/**
 * Performs user role access checking logic.
 * Access is allowed if current user has any role from the list of allowed.
 * If performed in optional user context - never throw's AccessDenied,
 *  instead user is cleared from the context like it is is not authenticated, so the route should behave
 *  like it's public anonymous user (auth context is not cleared though).
 */
export declare function checkUserRoleAuthorization<Ctx extends OptionalUserCtx>(ctx: Ctx, allowedRoles: ChatiumUserRole[]): Ctx;
