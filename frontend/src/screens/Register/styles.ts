// screens/Register/styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

/**
 * =========================
 * Register Screen Styles
 * =========================
 *
 * Design goals:
 * - Same visual language as Login screen
 * - Clean centered card
 * - Clear inputs + strong primary action
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 20,
  },

  /**
   * Center card
   */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    gap: 12,

    // Subtle shadow (works on iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /**
   * Title + subtitle
   */
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 18,
  },

  /**
   * Inputs
   */
  input: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  /**
   * Error message
   */
  error: {
    color: COLORS.danger,
    textAlign: "center",
    marginTop: 2,
    fontWeight: "600",
  },

  /**
   * Primary button
   */
  primaryButton: {
    marginTop: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: COLORS.surface,
    fontWeight: "900",
    fontSize: 15,
  },

  /**
   * Link under button
   */
  link: {
    textAlign: "center",
    marginTop: 10,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
