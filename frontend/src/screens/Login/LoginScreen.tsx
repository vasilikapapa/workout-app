import React, { useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  ImageBackground,
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
 *
 * UI:
 * - Background image with dark overlay
 * - Centered login card
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

  // Loading flag to prevent double-submits and improve UX
  const [loading, setLoading] = useState(false);

  // Ref to move focus from email → password
  const passwordRef = useRef<TextInput>(null);

  /**
   * =========================
   * Derived state
   * =========================
   */

  // Normalize email to avoid common login issues (extra spaces, casing)
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  // Basic form validity check
  const canSubmit =
    normalizedEmail.length > 0 && password.length > 0 && !loading;

  /**
   * =========================
   * Login handler
   * =========================
   */
  async function login() {
    if (!canSubmit) return;

    setError("");
    setLoading(true);

    try {
      // Dismiss keyboard for cleaner UX
      Keyboard.dismiss();

      // Send login request to backend
      const res = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      // Store JWT token securely on device
      await setToken(res.data.token);

      // Switch to authenticated flow
      onSignedIn();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <ImageBackground
      source={require("../../../assets/Login.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Dark overlay for readability */}
      <View style={styles.overlay} />

      {/* Prevent keyboard from covering inputs */}
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
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            returnKeyType="next"
            accessibilityLabel="Email input"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {/* Password input */}
          <TextInput
            ref={passwordRef}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            returnKeyType="done"
            accessibilityLabel="Password input"
            onSubmitEditing={login}
          />

          {/* Error message */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Login button */}
          <View style={styles.primaryButton}>
            <Button
              title={loading ? "Logging in..." : "Login"}
              onPress={login}
              color="#fff"
              disabled={!canSubmit}
            />
          </View>

          {/* Forgot password (future feature placeholder) */}
          <Text
            style={styles.link}
            onPress={() =>
              Alert.alert("Forgot password", "Coming soon.")
            }
          >
            Forgot password?
          </Text>

          {/* Navigation to register screen */}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            Create an account
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
