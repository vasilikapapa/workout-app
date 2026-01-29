// src/screens/Welcome/styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/styles";

/**
 * =========================
 * Welcome Screen Styles
 * =========================
 *
 * Design goals:
 * - Full-screen hero background
 * - High contrast overlay for readability
 * - Modern buttons
 * - Clean typography
 */
export const styles = StyleSheet.create({
  /**
   * Root wrapper
   */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /**
   * Background image wrapper
   */
  bg: {
    flex: 1,
    justifyContent: "flex-end",
  },

  /**
   * Dark overlay so white text is always readable
   */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  /**
   * Main content container
   */
  content: {
    paddingHorizontal: 22,
    paddingBottom: 34,
    gap: 12,
  },

  /**
   * Title
   */
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  /**
   * Subtitle / tagline
   */
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },

  /**
   * Buttons wrapper
   */
  actions: {
    marginTop: 10,
    gap: 10,
  },

  /**
   * Primary button
   */
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "900",
  },

  /**
   * Secondary button (transparent)
   */
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  /**
   * Footer text
   */
  footerText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
  },
});
