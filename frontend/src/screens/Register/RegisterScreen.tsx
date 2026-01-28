// screens/Register/RegisterScreen.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import { api } from "../../api/client";
import { setToken } from "../../auth/token";

// Screen-specific styles
import { styles } from "./styles";

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
 *
 * UX improvements:
 * - Card layout
 * - Loading state + disabled submit
 * - Email + password validation
 * - Keyboard-friendly flow
 */
export default function RegisterScreen({ navigation, onSignedIn }: any) {
  /**
   * =========================
   * Form state
   * =========================
   */

  // Email input
  const [email, setEmail] = useState("");

  // Password input
  const [password, setPassword] = useState("");

  // Confirm password input (client-side validation)
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error message from API or validation
  const [error, setError] = useState("");

  // Loading flag to prevent double submit
  const [loading, setLoading] = useState(false);

  // Ref to move focus email → password → confirm
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  /**
   * =========================
   * Derived state
   * =========================
   */

  // Normalize email (trim + lower-case)
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  /**
   * Email format validation (simple but effective)
   */
  function isValidEmail(value: string) {
    // Basic email regex: "something@something.domain"
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /**
   * Password validation rules
   * You can adjust these based on your backend requirements.
   */
  function validatePassword(pw: string): string | null {
    if (pw.length < 6) return "Password must be at least 6 characters.";
    // Optional stronger rules (uncomment if you want):
    // if (!/[A-Z]/.test(pw)) return "Password must include 1 uppercase letter.";
    // if (!/[0-9]/.test(pw)) return "Password must include 1 number.";
    return null;
  }

  /**
   * Validate the whole form before submit
   */
  function validateForm(): string | null {
    if (!normalizedEmail) return "Email is required.";
    if (!isValidEmail(normalizedEmail)) return "Please enter a valid email.";

    const pwErr = validatePassword(password);
    if (pwErr) return pwErr;

    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  // Submit allowed if form is valid and not loading
  const canSubmit = useMemo(() => !validateForm() && !loading, [
    normalizedEmail,
    password,
    confirmPassword,
    loading,
  ]);

  /**
   * =========================
   * Register handler
   * =========================
   */
  async function register() {
    // Run validation
    const v = validateForm();
    if (v) {
      setError(v);
      return;
    }

    // Clear previous error
    setError("");
    setLoading(true);

    try {
      // Dismiss keyboard after submit
      Keyboard.dismiss();

      // Send registration request to backend
      const res = await api.post("/auth/register", {
        email: normalizedEmail,
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
    // Prevent keyboard from covering inputs
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Center card */}
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>Create Account ✨</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Start recording your workouts and progress.
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
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        {/* Password input */}
        <TextInput
          ref={passwordRef}
          placeholder="Password (min 6)"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        {/* Confirm password input */}
        <TextInput
          ref={confirmRef}
          placeholder="Confirm password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={register}
        />

        {/* Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Create account button */}
        <Pressable
          style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
          onPress={register}
          disabled={!canSubmit}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Creating..." : "Create account"}
          </Text>
        </Pressable>

        {/* Back to login */}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Back to login
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
