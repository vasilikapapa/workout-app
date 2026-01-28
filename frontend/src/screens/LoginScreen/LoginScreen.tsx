import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// API client for backend communication
import { api } from "../../api/client";

// Utility for securely storing JWT token
import { setToken } from "../../auth/token";

// Screen-specific styles
import { styles } from "./styles";

/**
 * =========================
 * LoginScreen
 * =========================
 *
 * Responsibilities:
 * - Collect user credentials (email & password)
 * - Authenticate user with backend API
 * - Store JWT token securely on success
 * - Notify navigator to switch to authenticated flow
 */
export default function LoginScreen({ navigation, onSignedIn }: any) {
  /**
   * =========================
   * Local state
   * =========================
   */

  // Email input value
  const [email, setEmail] = useState("");

  // Password input value
  const [password, setPassword] = useState("");

  // Error message returned from API
  const [error, setError] = useState("");

  /**
   * =========================
   * Login handler
   * =========================
   *
   * Sends credentials to backend,
   * saves JWT token on success,
   * and transitions app to signed-in state.
   */
  async function login() {
    // Reset previous error
    setError("");

    try {
      // Send login request to backend
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Store JWT token securely on device
      await setToken(res.data.token);

      // Inform parent navigator that user is authenticated
      onSignedIn();
    } catch (e: any) {
      // Display server-provided error or fallback message
      setError(e?.response?.data?.error ?? "Login failed");
    }
  }

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    // Prevent keyboard from covering inputs
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Centered login card */}
      <View style={styles.card}>
        {/* Screen title */}
        <Text style={styles.title}>Welcome Back 💪</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Log in to continue your workout
        </Text>

        {/* Email input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* Password input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Login button */}
        <View style={styles.primaryButton}>
          <Button title="Login" onPress={login} color="#fff" />
        </View>

        {/* Navigation to register screen */}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Create an account
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
