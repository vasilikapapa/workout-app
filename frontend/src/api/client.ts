import axios from "axios";
import { getToken } from "../auth/token";

/**
 * =========================
 * Axios API client
 * =========================
 *
 * Centralized HTTP client used by the app to communicate
 * with the backend API.
 *
 * IMPORTANT:
 * - Use your machine's local IP (not localhost) when testing on a real phone
 * - Phone and backend must be on the same network
 */

// Create a preconfigured Axios instance
export const api = axios.create({
  baseURL: "https://workout-app-iy2c.onrender.com", // Backend API base URL
});

// Log base URL for debugging (safe to remove in production)
console.log("API baseURL =", api.defaults.baseURL);

/**
 * Request interceptor
 *
 * - Runs before every request
 * - Attaches Authorization header if a JWT token exists
 * - Allows protected endpoints to identify the user
 */
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  // Add Authorization header if user is logged in
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
