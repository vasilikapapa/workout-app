// screens/Plan/styles.ts
import { StyleSheet } from "react-native";

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
 */
export const styles = StyleSheet.create({
  /**
   * Screen wrapper
   */
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /**
   * Header section
   */
  header: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 260,
  },

  /**
   * Add day button in header
   */
  addButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 68,
  },

  addButtonDisabled: {
    opacity: 0.6,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  /**
   * Error banner (non-blocking)
   */
  errorBanner: {
    backgroundColor: "rgba(220,38,38,0.20)",
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.30)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  errorBannerText: {
    color: "#fff",
    opacity: 0.9,
    flex: 1,
  },

  retryText: {
    color: "#fff",
    fontWeight: "800",
    textDecorationLine: "underline",
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
    color: "rgba(255,255,255,0.75)",
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
   * Day item wrapper (card + action row)
   */
  dayBlock: {
    marginBottom: 12,
  },

  /**
   * Day card (main tap target)
   */
  dayCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
  },

  dayCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },

  dayTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  dayHint: {
    fontSize: 12,
    color: "#6b7280",
  },

  /**
   * Actions row under each card
   */
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
  },

  deleteButton: {
    backgroundColor: "rgba(220,38,38,0.20)",
    borderColor: "rgba(220,38,38,0.30)",
  },

  deleteText: {
    color: "#fff",
  },

  /**
   * Empty state
   */
  emptyWrap: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 18,
  },

  /**
   * Empty state main button (reuses same green style)
   */
  primaryButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});
