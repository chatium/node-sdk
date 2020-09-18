/**
 * Performs user role access checking logic.
 * Access is allowed if current user has any role from the list of allowed.
 * If performed in optional user context - never throw's AccessDenied,
 *  instead user is cleared from the context like it is is not authenticated, so the route should behave
 *  like it's public anonymous user (auth context is not cleared though).
 */
import { ChatiumUser, ChatiumUserRole, OptionalUserCtx, UserCtx } from './context';
export declare function checkUserRoleAuthorization<Ctx extends OptionalUserCtx>(ctx: Ctx, allowedRoles: ChatiumUserRole[]): Ctx;
export declare function isUserCtx(ctx: any): ctx is UserCtx;
export declare function isChatiumUser(user: any): user is ChatiumUser;
