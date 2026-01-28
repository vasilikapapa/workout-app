// screens/Plans/styles.ts
import { StyleSheet } from "react-native";

/**
 * =========================
 * Plans Screen Styles
 * =========================
 *
 * Design goals:
 * - Dark background (fitness vibe)
 * - Clear header hierarchy
 * - White cards for plans
 * - Strong primary action (Add)
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
    alignItems: "flex-start",
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
   * Logout button (small, subtle)
   */
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  logoutText: {
    color: "#fff",
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

  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,

    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "#fff",
  },

  addButton: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },

  addButtonDisabled: {
    opacity: 0.55,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  /**
   * Plan card list
   */
  listContent: {
    paddingBottom: 20,
  },

  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },

  planCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  planTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  planHint: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
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

  primaryButton: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
});
