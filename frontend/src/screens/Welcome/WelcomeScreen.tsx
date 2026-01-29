// src/screens/Welcome/WelcomeScreen.tsx
import React from "react";
import { View, Text, ImageBackground, Pressable, StatusBar } from "react-native";

// Screen-specific styles
import { styles } from "./styles";

/**
 * =========================
 * WelcomeScreen
 * =========================
 *
 * Purpose:
 * - First screen users see when signed out
 * - Introduce the app
 * - Provide clear actions to Login / Register
 *
 * Design:
 * - Full-screen background image
 * - Dark overlay for readability
 * - Title + short tagline
 * - Two actions: Get started / Log in
 */
export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.screen}>
      {/* Helps text look better over a dark image */}
      <StatusBar barStyle="light-content" />

      <ImageBackground
        // ✅ Put your image here (instructions below)
        source={require("../../assets/welcome.jpg")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Dark overlay to keep text readable */}
        <View style={styles.overlay} />

        {/* Content */}
        <View style={styles.content}>
          {/* App title */}
          <Text style={styles.title}>Workout Plan</Text>

          {/* Tagline */}
          <Text style={styles.subtitle}>
            Record your workout plans. Stay consistent. Track progress.
          </Text>

          {/* Buttons */}
          <View style={styles.actions}>
            {/* Primary button */}
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.primaryButtonText}>Get started</Text>
            </Pressable>

            {/* Secondary button */}
            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.secondaryButtonText}>Log in</Text>
            </Pressable>
          </View>

          {/* Small footer text */}
          <Text style={styles.footerText}>
            Plan • Train • Improve
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
