import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { api } from "../api/client";
import { setToken } from "../auth/token";

/**
 * =========================
 * LoginScreen
 * =========================
 *
 * Allows a user to:
 * - Enter email & password
 * - Authenticate with the backend
 * - Store JWT securely on success
 * - Transition to the authenticated app flow
 */
export default function LoginScreen({ navigation, onSignedIn }: any) {
  /**
   * =========================
   * Form state
   * =========================
   */
  const [email, setEmail] = useState("");       // User email input
  const [password, setPassword] = useState(""); // User password input
  const [error, setError] = useState("");       // Error message from API

  /**
   * =========================
   * Login handler
   * =========================
   */
  async function login() {
    // Clear previous error
    setError("");

    try {
      // Send login request to API
      const res = await api.post("/auth/login", { email, password });

      // Save JWT token securely on device
      await setToken(res.data.token);

      // Notify AppNavigator to switch to signed-in state
      onSignedIn();
    } catch (e: any) {
      // Helpful debug logs during development
      console.log("AUTH ERROR:", e?.message);
      console.log(
        "AUTH RESPONSE:",
        e?.response?.status,
        e?.response?.data
      );

      // Show server-provided error or fallback message
      setError(e?.response?.data?.error ?? "Login failed");
    }
  }

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {/* Email input */}
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      {/* Password input */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      {/* Error message */}
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      {/* Login action */}
      <Button title="Login" onPress={login} />

      {/* Navigate to register screen */}
      <Button
        title="Create account"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
