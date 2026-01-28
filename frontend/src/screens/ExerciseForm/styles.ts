// screens/ExerciseForm/styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/styles";

/**
 * =========================
 * Exercise Form Styles
 * =========================
 *
 * Design goals:
 * - Clean, modern card UI
 * - Clear labels and inputs
 * - Segmented controls for mode + unit
 * - Strong primary save button
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    gap: 12,
  },

  /**
   * Header row (title + cancel)
   */
  header: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 260,
  },

  /**
   * Cancel button (small, subtle)
   */
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  cancelText: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    fontSize: 13,
  },

  /**
   * Main card container
   */
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },

  /**
   * Field label
   */
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  /**
   * Text input styling
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
   * Segmented control row
   */
  segmentRow: {
    flexDirection: "row",
    gap: 10,
  },

  /**
   * One segment (tab)
   */
  segment: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },

  /**
   * Active segment highlight
   */
  segmentActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },

  segmentText: {
    color: COLORS.textSecondary,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.6,
  },

  segmentTextActive: {
    color: COLORS.primary,
  },

  /**
   * Loading block (edit mode)
   */
  loadingWrap: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: {
    color: COLORS.textSecondary,
  },

  /**
   * Save button
   */
  primaryButton: {
    marginTop: 8,
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
});
