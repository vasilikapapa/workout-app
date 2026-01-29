// screens/Plans/PlansScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard,
  RefreshControl,
} from "react-native";

import { api } from "../../api/client";
import { clearToken } from "../../auth/token";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

// ✅ Swipe-to-delete
import { Swipeable } from "react-native-gesture-handler";

// Screen-specific styles
import { styles } from "./styles";

/**
 * =========================
 * Types
 * =========================
 */

// Screen props typed from navigation
type Props = NativeStackScreenProps<RootStackParamList, "Plans">;

// Plan entity returned by the API
type Plan = {
  id: string;
  title: string;
};

/**
 * =========================
 * PlansScreen
 * =========================
 *
 * Displays:
 * - All user plans
 * - Create new plan
 * - Navigate to plan editor
 * - Logout
 *
 * UX Improvements:
 * - Header with title and logout action
 * - Card-based list
 * - Empty state + loading state
 * - Pull-to-refresh
 * - Swipe to delete (with confirmation)
 */
export default function PlansScreen({
  navigation,
  onSignedOut,
}: Props & { onSignedOut: () => void }) {
  /**
   * =========================
   * State
   * =========================
   */

  // List of plans
  const [plans, setPlans] = useState<Plan[]>([]);

  // New plan title input
  const [title, setTitle] = useState("");

  // Initial loading state
  const [initialLoading, setInitialLoading] = useState(true);

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Create plan loading state (prevents double taps)
  const [creating, setCreating] = useState(false);

  // Track which plan is being deleted (so we can show “Deleting…” in swipe action)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep refs to Swipeable rows so we can close them programmatically
  const rowRefs = useRef<Record<string, Swipeable | null>>({});

  /**
   * =========================
   * Derived state
   * =========================
   */

  // Clean title input
  const trimmedTitle = useMemo(() => title.trim(), [title]);

  // Basic validation for add action
  const canCreate = trimmedTitle.length > 0 && !creating;

  /**
   * =========================
   * Data loading
   * =========================
   */

  // Fetch all plans for the logged-in user
  const loadPlans = useCallback(async () => {
    try {
      const res = await api.get<Plan[]>("/plans");
      setPlans(res.data);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to load plans");
    }
  }, []);

  // Load plans when screen mounts
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      await loadPlans();
      setInitialLoading(false);
    })();
  }, [loadPlans]);

  /**
   * Pull-to-refresh handler
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPlans();
    setRefreshing(false);
  }, [loadPlans]);

  /**
   * =========================
   * Actions
   * =========================
   */

  // Create a new plan
  async function createPlan() {
    if (!canCreate) return;

    setCreating(true);
    try {
      // Dismiss keyboard for cleaner UX
      Keyboard.dismiss();

      // Create plan in backend
      const res = await api.post<Plan>("/plans", {
        title: trimmedTitle,
      });

      // Clear input field
      setTitle("");

      // Refresh plans list (keeps list consistent)
      await loadPlans();

      // Navigate directly to the newly created plan
      navigation.navigate("Plan", {
        planId: res.data.id,
        title: res.data.title,
      });
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to create plan");
    } finally {
      setCreating(false);
    }
  }

  /**
   * Delete a plan (called after user confirms).
   * - Calls backend delete endpoint
   * - Updates UI immediately
   */
  async function deletePlan(planId: string) {
    // Close the swipe row to avoid it staying open after delete
    rowRefs.current[planId]?.close?.();

    setDeletingId(planId);

    try {
      // ✅ Adjust endpoint if yours is different:
      // If your backend uses /plans/:planId then this is correct.
      await api.delete(`/plans/${planId}`);

      // Instant UI update without needing a refetch
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to delete plan");
    } finally {
      setDeletingId(null);
    }
  }

  /**
   * Ask the user to confirm deletion
   * (best practice so users don't delete by accident).
   */
  function confirmDeletePlan(planId: string) {
    Alert.alert(
      "Delete plan?",
      "This will delete all days and exercises inside it.",
      [
        {
          text: "Cancel",
          style: "cancel",
          // If user cancels, close swipe row so UI feels consistent
          onPress: () => rowRefs.current[planId]?.close?.(),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePlan(planId),
        },
      ]
    );
  }

  // Logout the user
  async function logout() {
    try {
      // Remove stored auth token
      await clearToken();

      // Notify AppNavigator to switch to auth flow
      onSignedOut();
    } catch {
      Alert.alert("Error", "Failed to logout");
    }
  }

  /**
   * =========================
   * Swipe UI helpers
   * =========================
   */

  /**
   * Render the right-side swipe actions (Delete)
   * - This appears when the user swipes left on a plan card
   */
  function renderRightActions(planId: string) {
    const isDeleting = deletingId === planId;

    return (
      <Pressable
        onPress={() => {
          // Prevent repeated taps while deleting
          if (isDeleting) return;
          confirmDeletePlan(planId);
        }}
        style={[
          styles.swipeDelete,
          isDeleting && styles.swipeDeleteDisabled,
        ]}
      >
        <Text style={styles.swipeDeleteText}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Text>
      </Pressable>
    );
  }

  /**
   * =========================
   * Render helpers
   * =========================
   */

  // Empty state UI when no plans exist
  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>No plans yet</Text>
      <Text style={styles.emptyText}>
        Create your first workout plan to start recording workouts.
      </Text>

      <Pressable
        style={[
          styles.primaryButton,
          !canCreate && styles.primaryButtonDisabled,
        ]}
        onPress={createPlan}
        disabled={!canCreate}
      >
        <Text style={styles.primaryButtonText}>
          {creating ? "Creating..." : "Create plan"}
        </Text>
      </Pressable>
    </View>
  );

  /**
   * Render one plan row
   * - Wrapped in Swipeable so users can swipe left to delete
   * - Tap card to open plan
   */
  const renderPlanItem = ({ item }: { item: Plan }) => (
    <Swipeable
      // Keep a ref so we can close it when needed
      ref={(ref) => {
        rowRefs.current[item.id] = ref;
      }}
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      onSwipeableWillOpen={() => {
        // Optional: close other open rows when a new one opens (prevents multiple open)
        Object.keys(rowRefs.current).forEach((key) => {
          if (key !== item.id) rowRefs.current[key]?.close?.();
        });
      }}
    >
      <Pressable
        onPress={() =>
          navigation.navigate("Plan", {
            planId: item.id,
            title: item.title,
          })
        }
        style={styles.planCard}
      >
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planHint}>Tap to open • Swipe to delete</Text>
      </Pressable>
    </Swipeable>
  );

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Plans</Text>
          <Text style={styles.headerSubtitle}>
            Create plans to record workout days and exercises.
          </Text>
        </View>

        {/* Logout action in header */}
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Create plan input row */}
      <View style={styles.createRow}>
        <TextInput
          placeholder="New plan title"
          placeholderTextColor="rgba(255,255,255,0.55)"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={createPlan}
        />

        <Pressable
          style={[styles.addButton, !canCreate && styles.addButtonDisabled]}
          onPress={createPlan}
          disabled={!canCreate}
        >
          <Text style={styles.addButtonText}>{creating ? "..." : "Add"}</Text>
        </Pressable>
      </View>

      {/* Initial loading */}
      {initialLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(p) => p.id}
          renderItem={renderPlanItem}
          contentContainerStyle={plans.length ? styles.listContent : styles.listEmpty}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
