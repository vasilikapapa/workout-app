// screens/Plans/styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/styles";

/**
 * =========================
 * Plans Screen Styles
 * =========================
 *
 * Design goals:
 * - Open, light background (less heavy than dark blue)
 * - Clear header hierarchy
 * - Card-based list for plans
 * - Strong but friendly primary action
 * - Consistent use of global color palette
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   * - Uses global background color
   */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /**
   * Header section
   * - Soft surface container
   * - Subtle border for separation
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
    marginBottom: 12,
  },

  /**
   * Header title
   */
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },

  /**
   * Header subtitle
   */
  headerSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 260,
  },

  /**
   * Logout button
   * - Small, subtle action
   */
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  /**
   * Logout button text
   */
  logoutText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 13,
  },

  /**
   * Create row: input + add button
   */
  createRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  /**
   * New plan input
   */
  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,

    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },

  /**
   * Add plan button
   * - Uses primary brand color
   */
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },

  /**
   * Disabled add button state
   */
  addButtonDisabled: {
    opacity: 0.55,
  },

  /**
   * Add button text
   */
  addButtonText: {
    color: COLORS.surface,
    fontWeight: "900",
    fontSize: 14,
  },

  /**
   * FlatList content spacing
   */
  listContent: {
    paddingBottom: 20,
  },

  /**
   * Used when list is empty (centers empty state)
   */
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },

  /**
   * Plan card
   * - White surface
   * - Clear tap target
   */
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /**
   * Plan title text
   */
  planTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  /**
   * Small hint text under plan title
   */
  planHint: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  /**
   * Loading state
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
   * Empty state container
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
   * Primary action button (empty state)
   */
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },

  /**
   * Disabled primary button
   */
  primaryButtonDisabled: {
    opacity: 0.6,
  },

  /**
   * Primary button text
   */
  primaryButtonText: {
    color: COLORS.surface,
    fontWeight: "900",
    fontSize: 15,
  },
    /**
   * Swipe-to-delete action
   * - Appears when swiping left on a plan card
   */
  swipeDelete: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    width: 96,
    borderRadius: 16,
    marginBottom: 12, // match card spacing
  },

  swipeDeleteDisabled: {
    opacity: 0.7,
  },

  swipeDeleteText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

});
