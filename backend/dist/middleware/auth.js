"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
function requireAuth(req, res, next) {
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
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach authenticated user id to request
        req.userId = payload.userId;
        // Proceed to the next middleware / route handler
        next();
    }
    catch {
        // Token verification failed
        return res.status(401).json({ error: "Invalid token" });
    }
}
