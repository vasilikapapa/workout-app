// screens/Welcome/styles.ts
import { StyleSheet } from "react-native";

/**
 * =========================
 * Welcome Screen Styles
 * =========================
 *
 * Centralized styling for the Welcome screen.
 * Keeps UI concerns separate from screen logic.
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   * - Centers content vertically
   * - Dark background for strong contrast
   */
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 20,
  },

  /**
   * Card container
   * - White surface for focus
   * - Rounded corners
   * - Padding for comfortable spacing
   */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    gap: 14,
  },

  /**
   * App title
   * - Large, bold typography for branding
   */
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  /**
   * App description
   * - Softer color and smaller size
   * - Explains app value in one sentence
   */
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },

  /**
   * Primary button (Login)
   * - Green to encourage action
   * - Rounded to match card style
   */
  primaryButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  /**
   * Primary button text
   */
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  /**
   * Secondary button (Register)
   * - Outlined style to reduce emphasis
   */
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  /**
   * Secondary button text
   */
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
