"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChatiumUser = exports.isUserCtx = exports.checkUserRoleAuthorization = void 0;
/**
 * Performs user role access checking logic.
 * Access is allowed if current user has any role from the list of allowed.
 * If performed in optional user context - never throw's AccessDenied,
 *  instead user is cleared from the context like it is is not authenticated, so the route should behave
 *  like it's public anonymous user (auth context is not cleared though).
 */
const context_1 = require("./context");
const errors_1 = require("./errors");
function checkUserRoleAuthorization(ctx, allowedRoles) {
    if (ctx.user) {
        for (const allowed of allowedRoles) {
            if (ctx.user.roles.includes(allowed)) {
                return ctx;
            }
            if (allowed === context_1.ChatiumUserRole.Admin && ctx.user.roles.includes(context_1.ChatiumUserRole.ActiveSupport)) {
                return ctx;
            }
        }
        throw new errors_1.AccessDeniedError(`ACCESS DENIED: Current user [${ctx.user.id}] doesn't have ` +
            `required role(s): ${allowedRoles}`);
    }
    else {
        return ctx;
    }
}
exports.checkUserRoleAuthorization = checkUserRoleAuthorization;
function isUserCtx(ctx) {
    return ctx && isChatiumUser(ctx.user);
}
exports.isUserCtx = isUserCtx;
function isChatiumUser(user) {
    return user && typeof user.id === 'string' && user.roles instanceof Array;
}
exports.isChatiumUser = isChatiumUser;
//# sourceMappingURL=user.js.map