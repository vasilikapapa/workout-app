import * as SecureStore from "expo-secure-store";

/**
 * =========================
 * Auth token storage
 * =========================
 *
 * Uses Expo SecureStore to safely persist the JWT token
 * on the device.
 *
 * SecureStore stores data encrypted and is preferred
 * over AsyncStorage for sensitive information.
 */

const KEY = "auth_token";

/**
 * Save the authentication token
 * @param token - JWT received from the backend
 */
export async function setToken(token: string) {
  await SecureStore.setItemAsync(KEY, token);
}

/**
 * Retrieve the stored authentication token
 * @returns JWT token or null if not found
 */
export async function getToken() {
  return SecureStore.getItemAsync(KEY);
}

/**
 * Remove the authentication token
 *
 * Used when logging out the user
 */
export async function clearToken() {
  await SecureStore.deleteItemAsync(KEY);
}
