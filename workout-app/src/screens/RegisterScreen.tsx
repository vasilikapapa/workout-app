import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { api } from "../api/client";
import { setToken } from "../auth/token";

/**
 * =========================
 * RegisterScreen
 * =========================
 *
 * Allows a new user to:
 * - Create an account with email & password
 * - Receive a JWT from the backend
 * - Store the token securely
 * - Enter the authenticated app flow
 */
export default function RegisterScreen({ navigation, onSignedIn }: any) {
  /**
   * =========================
   * Form state
   * =========================
   */
  const [email, setEmail] = useState("");     // Email input
  const [password, setPassword] = useState(""); // Password input
  const [error, setError] = useState("");     // Error message from API

  /**
   * =========================
   * Register handler
   * =========================
   */
  async function register() {
    // Clear previous error
    setError("");

    try {
      // Send registration request to backend
      const res = await api.post("/auth/register", {
        email,
        password,
      });

      // Extract JWT token from response
      const token = res.data.token;

      // Store token securely on device
      await setToken(token);

      // Notify AppNavigator to switch to signed-in state
      onSignedIn();
    } catch (e: any) {
      // Show server-provided error or fallback message
      setError(e?.response?.data?.error ?? "Register failed");
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
        placeholder="Password (min 6)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      {/* Error message */}
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      {/* Create account */}
      <Button title="Create account" onPress={register} />

      {/* Navigate back to login */}
      <Button
        title="Back to login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
