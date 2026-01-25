import type { Request, Response, NextFunction } from "express";
/**
 * Extended Express Request type.
 * Adds `userId` so authenticated routes can know
 * which user is making the request.
 */
export interface AuthedRequest extends Request {
    userId?: string;
}
/**
 * Authentication middleware.
 *
 * - Expects an Authorization header in the form:
 *   "Authorization: Bearer <JWT>"
 * - Verifies the JWT using JWT_SECRET
 * - Attaches the decoded userId to req.userId
 * - Blocks the request with 401 if anything is invalid
 */
export declare function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): any;
//# sourceMappingURL=auth.d.ts.map