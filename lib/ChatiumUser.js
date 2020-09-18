"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRoleAuthorization = exports.ChatiumUserRole = void 0;
const errors_1 = require("./errors");
var ChatiumUserRole;
(function (ChatiumUserRole) {
    ChatiumUserRole["Admin"] = "Admin";
    ChatiumUserRole["Staff"] = "Staff";
    ChatiumUserRole["Support"] = "Support";
    ChatiumUserRole["ActiveSupport"] = "ActiveSupport";
    ChatiumUserRole["Developer"] = "Developer";
    ChatiumUserRole["BetaTester"] = "BetaTester";
    ChatiumUserRole["User"] = "User";
})(ChatiumUserRole = exports.ChatiumUserRole || (exports.ChatiumUserRole = {}));
/**
 * Performs user role access checking logic.
 * Access is allowed if current user has any role from the list of allowed.
 * If performed in optional user context - never throw's AccessDenied,
 *  instead user is cleared from the context like it is is not authenticated, so the route should behave
 *  like it's public anonymous user (auth context is not cleared though).
 */
function checkUserRoleAuthorization(ctx, allowedRoles) {
    if (ctx.user) {
        for (const allowed of allowedRoles) {
            if (ctx.user.roles.includes(allowed)) {
                return ctx;
            }
            if (allowed === ChatiumUserRole.Admin && ctx.user.roles.includes(ChatiumUserRole.ActiveSupport)) {
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
