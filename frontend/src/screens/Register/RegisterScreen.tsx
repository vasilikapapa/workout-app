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
 * RegisterScreen
 * =========================
 *
 * Allows a new user to:
 * - Create an account with email & password
 * - Receive a JWT from the backend
 * - Store the token securely
 * - Enter the authenticated app flow
 *
 * UX decision:
 * - Do NOT disable the submit button.
 * - Always allow tapping "Create account".
 * - If something is wrong, show a clear validation message.
 */
export default function RegisterScreen({ navigation, onSignedIn }: any) {
  /**
   * =========================
   * Form state
   * =========================
   */

  // Email input value
  const [email, setEmail] = useState("");

  // Password input value
  const [password, setPassword] = useState("");

  // Confirm password input value (client-side check)
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error message (validation or API)
  const [error, setError] = useState("");

  // Loading flag to prevent double-submits
  const [loading, setLoading] = useState(false);

  // Refs for moving focus between fields
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  /**
   * =========================
   * Derived values
   * =========================
   */

  // Normalize email to avoid issues with spaces/casing
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  /**
   * =========================
   * Validation helpers
   * =========================
   */

  /**
   * Basic email format validation
   * (simple regex: something@something.domain)
   */
  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /**
   * Password validation rules
   * Adjust if your backend requires stronger passwords.
   */
  function validatePassword(pw: string): string | null {
    if (pw.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  /**
   * Validate all fields and return a user-friendly message
   * or null if everything is valid.
   */
  function validateForm(): string | null {
    // Email required + format
    if (!normalizedEmail) return "Email is required.";
    if (!isValidEmail(normalizedEmail)) return "Please enter a valid email.";

    // Password rules
    const pwErr = validatePassword(password);
    if (pwErr) return pwErr;

    // Confirm password matches
    if (password !== confirmPassword) return "Passwords do not match.";

    // All good
    return null;
  }

  /**
   * =========================
   * Register handler
   * =========================
   *
   * Behavior:
   * - Always allow pressing the button
   * - Show validation message if invalid
   * - If valid, submit to backend
   */
  async function register() {
    // Clear previous error
    setError("");

    // Run validation before calling the API
    const v = validateForm();
    if (v) {
      setError(v);
      return;
    }

    // Prevent double-submits while request is in-flight
    if (loading) return;

    setLoading(true);

    try {
      // Dismiss keyboard for a clean feel
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
      // (e.g. "Email already exists")
      setError(e?.response?.data?.error ?? "Register failed");
    } finally {
      // Always reset loading state
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
          style={styles.bg}
          resizeMode="cover"
        >
    {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Content ABOVE the overlay */}
      <KeyboardAvoidingView
        style={styles.container}
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
          onChangeText={(v) => {
            // Update field and clear error as user types (better UX)
            setEmail(v);
            if (error) setError("");
          }}
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
          onChangeText={(v) => {
            setPassword(v);
            if (error) setError("");
          }}
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
          onChangeText={(v) => {
            setConfirmPassword(v);
            if (error) setError("");
          }}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={register}
        />

        {/* Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Create account button (NOT disabled; shows feedback via error messages) */}
        <Pressable style={styles.primaryButton} onPress={register}>
          <Text style={styles.primaryButtonText}>
            {loading ? "Creating..." : "Create account"}
          </Text>
        </Pressable>

        {/* Navigate back to login */}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Back to login
        </Text>
      </View>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
}
