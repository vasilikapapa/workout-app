// screens/Plan/styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/styles";

/**
 * =========================
 * Plan Screen Styles
 * =========================
 *
 * Design goals:
 * - Clean header area
 * - Card-based list for days
 * - Easy-to-tap buttons
 * - Friendly empty and loading states
 *
 * Notes:
 * - Colors are pulled from a centralized palette (COLORS)
 * - Changing COLORS will update the whole app theme
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   * - Uses the app-wide background color
   */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /**
   * Header section
   * - Soft surface container (not pure black/blue)
   * - Border adds subtle structure
   */
  header: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  /**
   * Header title text
   */
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },

  /**
   * Header subtitle text
   */
  headerSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 260,
  },

  /**
   * Add day button in header
   * - Uses app-wide primary color
   */
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 68,
  },

  /**
   * Disabled state for add button
   */
  addButtonDisabled: {
    opacity: 0.6,
  },

  /**
   * Add button text
   */
  addButtonText: {
    color: COLORS.surface,
    fontWeight: "800",
    fontSize: 14,
  },

  /**
   * Error banner (non-blocking)
   * - Uses "danger" color tones for clear feedback
   */
  errorBanner: {
    backgroundColor: COLORS.primarySoft, // soft background so it doesn't scream
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  /**
   * Error banner text
   */
  errorBannerText: {
    color: COLORS.textPrimary,
    opacity: 0.95,
    flex: 1,
  },

  /**
   * Retry text link in banner
   */
  retryText: {
    color: COLORS.primary,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  /**
   * Loading state container
   */
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  /**
   * Loading helper text
   */
  loadingText: {
    color: COLORS.textSecondary,
  },

  /**
   * FlatList content spacing
   */
  listContent: {
    paddingBottom: 20,
  },

  /**
   * Used when list is empty (centers the empty state)
   */
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },

  /**
   * Day item wrapper (card + action row)
   */
  dayBlock: {
    marginBottom: 12,
  },

  /**
   * Day card (main tap target)
   */
  dayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /**
   * Top row inside day card
   */
  dayCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },

  /**
   * Day title
   */
  dayTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  /**
   * Small hint text ("Tap to open")
   */
  dayHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  /**
   * Actions row under each card
   */
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  /**
   * Action button (Edit)
   * - Soft surface, clear border
   */
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },

  /**
   * Action button text
   */
  actionText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },

  /**
   * Delete action button
   */
  deleteButton: {
    backgroundColor: "#FEE2E2", // soft red background (you can add COLORS.dangerSoft later)
    borderColor: "#FECACA",
  },

  /**
   * Delete action text
   */
  deleteText: {
    color: COLORS.danger,
  },

  /**
   * Empty state card
   */
  emptyWrap: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },

  /**
   * Empty state title
   */
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  /**
   * Empty state description
   */
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },

  /**
   * Empty state main button
   * - Uses primary color for consistent action styling
   */
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },

  /**
   * Primary button text
   */
  primaryButtonText: {
    color: COLORS.surface,
    fontWeight: "800",
    fontSize: 15,
  },
});
