// screens/Day/styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/styles";

/**
 * =========================
 * Day Screen Styles
 * =========================
 *
 * Design goals:
 * - Open palette (light background)
 * - Clean header + segmented tabs
 * - Clear exercise cards (tap to edit)
 * - Friendly empty + loading states
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /**
   * Header section (title + action)
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

  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 260,
  },

  /**
   * Add Exercise button (header)
   */
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: COLORS.surface,
    fontWeight: "900",
    fontSize: 13,
  },

  /**
   * Tabs wrapper
   */
  tabsWrap: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  /**
   * Individual tab
   */
  tab: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },

  /**
   * Active tab style
   */
  tabActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },

  tabText: {
    color: COLORS.textSecondary,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.6,
  },

  tabTextActive: {
    color: COLORS.primary,
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

  loadingText: {
    color: COLORS.textSecondary,
  },

  /**
   * FlatList content spacing
   */
  listContent: {
    paddingBottom: 20,
  },

  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },

  /**
   * Exercise item wrapper
   */
  exerciseBlock: {
    marginBottom: 12,
  },

  /**
   * Exercise card (tap to edit)
   */
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  exerciseTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },

  exerciseTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },

  exerciseEditHint: {
    color: COLORS.textMuted,
    fontSize: 12,
  },

  exerciseMeta: {
    marginTop: 6,
    color: COLORS.textSecondary,
  },

  /**
   * Delete button under card
   */
  deleteButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  deleteText: {
    color: COLORS.danger,
    fontWeight: "800",
  },

  /**
   * Empty state
   */
  emptyWrap: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },

  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },

  /**
   * Primary button (empty state)
   */
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },

  primaryButtonText: {
    color: COLORS.surface,
    fontWeight: "900",
    fontSize: 15,
  },
});
