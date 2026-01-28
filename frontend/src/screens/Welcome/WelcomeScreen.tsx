// screens/Welcome/WelcomeScreen.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";

// Import screen-specific styles
import { styles } from "./styles";

/**
 * =========================
 * WelcomeScreen
 * =========================
 *
 * First screen of the app.
 *
 * Purpose:
 * - Introduce the app and its main value
 * - Guide users to Login or Register
 * - Act as a landing page before authentication
 */
export default function WelcomeScreen({ navigation }: any) {
  return (
    // Full-screen wrapper
    <View style={styles.screen}>
      {/* Center card container */}
      <View style={styles.card}>
        {/* App name / branding */}
        <Text style={styles.title}>Workout App</Text>

        {/* Short app description */}
        <Text style={styles.subtitle}>
          Record workout plans, track sets & reps, and stay consistent.
        </Text>

        {/* Primary action: Login */}
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        {/* Secondary action: Register */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.secondaryButtonText}>Create account</Text>
        </Pressable>
      </View>
    </View>
  );
}
