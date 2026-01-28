// screens/Login/styles.ts
import { StyleSheet } from "react-native";

/**
 * =========================
 * Login Screen Styles
 * =========================
 *
 * Styles are separated from the screen component
 * to keep layout, design, and logic concerns isolated.
 */
export const styles = StyleSheet.create({
  /**
   * Full-screen wrapper
   * - Centers content vertically
   * - Provides dark background for contrast
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
   * - Rounded corners for modern UI
   * - Shadow/elevation for depth
   */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    gap: 14,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,

    // Android elevation
    elevation: 8,
  },

  /**
   * Main heading
   * - Strong font weight
   * - Centered for balance
   */
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  /**
   * Supporting text below title
   * - Softer color to reduce visual weight
   */
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },

  /**
   * Text input fields
   * - Rounded edges
   * - Neutral border color
   * - Comfortable touch padding
   */
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },

  /**
   * Error message
   * - Red color to indicate validation/auth issues
   * - Centered to align with form layout
   */
  error: {
    color: "#dc2626",
    textAlign: "center",
  },

  /**
   * Primary action button wrapper
   * - Green color to convey action & energy
   * - Rounded corners to match inputs
   * - Overflow hidden for proper button clipping
   */
  primaryButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },

  /**
   * Secondary navigation link
   * - Used for routing to Register screen
   * - Blue color to signal interactivity
   */
  link: {
    textAlign: "center",
    marginTop: 10,
    color: "#2563eb",
    fontWeight: "500",
  },
});
