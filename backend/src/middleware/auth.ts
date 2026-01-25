import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Authenticated Request type.
 *
 * Extends Express `Request` and:
 * - Keeps route params strongly typed (default: string → string)
 * - Adds `userId`, injected after successful JWT verification
 *
 * The generics allow each route to specify its own params shape:
 *   AuthedRequest<{ id: string }>
 */
export type AuthedRequest<
  Params extends Record<string, string> = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  userId?: string;
};

/**
 * Authentication middleware.
 *
 * Responsibilities:
 * - Reads `Authorization` header
 * - Extracts Bearer token
 * - Verifies JWT using `JWT_SECRET`
 * - Attaches `userId` to the request object
 * - Blocks unauthenticated requests with HTTP 401
 *
 * Expected header format:
 *   Authorization: Bearer <JWT>
 */
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  // Read Authorization header
  const header = req.headers.authorization;

  // Header missing → unauthenticated
  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  // Extract token from "Bearer <token>"
  const token = header.split(" ")[1];

  // Token missing or malformed
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    /**
     * Verify and decode JWT.
     * If invalid or expired, jwt.verify throws.
     */
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Attach authenticated user id to request
    req.userId = payload.userId;

    // Proceed to the next middleware / route handler
    next();
  } catch {
    // Token verification failed
    return res.status(401).json({ error: "Invalid token" });
  }
}
