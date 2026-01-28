// screens/Plan/PlanScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { api } from "../../api/client";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

// Screen-specific styles
import { styles } from "./styles";

/**
 * =========================
 * Types
 * =========================
 */

// Screen props typed from navigation
type Props = NativeStackScreenProps<RootStackParamList, "Plan">;

// Day entity returned by the API
type Day = {
  id: string;
  name: string;
  dayOrder: number;
};

/**
 * =========================
 * PlanScreen
 * =========================
 *
 * Displays:
 * - All days for a specific plan
 * - Ability to add, edit, delete days
 * - Navigation into individual Day screens
 *
 * UX improvements:
 * - Header with title + quick action button
 * - Card-based list items
 * - Pull-to-refresh
 * - Loading + error states
 */
export default function PlanScreen({ route, navigation }: Props) {
  /**
   * =========================
   * Params
   * =========================
   */

  // Plan ID passed from navigation
  const { planId } = route.params;

  /**
   * =========================
   * State
   * =========================
   */

  // Days belonging to this plan
  const [days, setDays] = useState<Day[]>([]);

  // Loading state for initial fetch
  const [initialLoading, setInitialLoading] = useState(true);

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Loading state for adding a day
  const [adding, setAdding] = useState(false);

  // Optional: store a load error message
  const [loadError, setLoadError] = useState<string>("");

  /**
   * =========================
   * Derived state
   * =========================
   */

  /**
   * Compute the default name for the next day
   * (memoized to avoid unnecessary recalculation)
   */
  const nextName = useMemo(() => `Day ${days.length + 1}`, [days.length]);

  /**
   * =========================
   * Data loading
   * =========================
   */

  /**
   * Fetch all days for the plan.
   * - Handles success + error
   * - Can be reused for refresh and after mutations
   */
  const loadDays = useCallback(async () => {
    try {
      setLoadError("");
      const res = await api.get<Day[]>(`/plans/${planId}/days`);
      setDays(res.data);
    } catch (e: any) {
      setLoadError(e?.response?.data?.error ?? "Failed to load days");
    }
  }, [planId]);

  // Load days when the screen mounts or planId changes
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      await loadDays();
      setInitialLoading(false);
    })();
  }, [loadDays]);

  /**
   * Pull-to-refresh handler
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDays();
    setRefreshing(false);
  }, [loadDays]);

  /**
   * =========================
   * Day actions
   * =========================
   */

  /**
   * Create a new day, then refresh list
   */
  async function addDay() {
    if (adding) return;

    setAdding(true);
    try {
      await api.post(`/plans/${planId}/days`, { name: nextName });
      await loadDays(); // refresh list
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to add day");
    } finally {
      setAdding(false);
    }
  }

  /**
   * Ask user to confirm deletion
   */
  function confirmDeleteDay(dayId: string) {
    Alert.alert("Delete day?", "This will delete its sections and exercises.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteDay(dayId),
      },
    ]);
  }

  /**
   * Delete a day and update UI immediately
   */
  async function deleteDay(dayId: string) {
    try {
      await api.delete(`/days/${dayId}`);

      // Instant UI update without refetch
      setDays((prev) => prev.filter((d) => d.id !== dayId));
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to delete day");
    }
  }

  /**
   * Prompt user to edit the day name
   *
   * Note:
   * Alert.prompt is iOS-only. On Android, we show a helpful message.
   * If you want cross-platform rename, we can create a small modal screen.
   */
  function editDayName(dayId: string, currentName: string) {
    if (Platform.OS !== "ios") {
      Alert.alert(
        "Rename coming soon",
        "On Android, we’ll use a small modal for renaming. For now, try on iOS or tell me and I’ll add the modal."
      );
      return;
    }

    Alert.prompt(
      "Edit day name",
      undefined,
      async (newName) => {
        if (!newName?.trim()) return;

        try {
          const res = await api.patch(`/days/${dayId}`, {
            name: newName.trim(),
          });

          // Update UI instantly
          setDays((prev) => prev.map((d) => (d.id === dayId ? res.data : d)));
        } catch (e: any) {
          Alert.alert("Error", e?.response?.data?.error ?? "Failed to update day");
        }
      },
      "plain-text",
      currentName
    );
  }

  /**
   * =========================
   * Render helpers
   * =========================
   */

  /**
   * Renders one day "card" row
   */
  const renderDayItem = ({ item }: { item: Day }) => {
    return (
      <View style={styles.dayBlock}>
        {/* Tap card to navigate */}
        <Pressable
          style={styles.dayCard}
          onPress={() =>
            navigation.navigate("Day", {
              dayId: item.id,
              dayName: item.name,
            })
          }
        >
          <View style={styles.dayCardTop}>
            <Text style={styles.dayTitle}>{item.name}</Text>
            <Text style={styles.dayHint}>Tap to open</Text>
          </View>
        </Pressable>

        {/* Small action row */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() => editDayName(item.id, item.name)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => confirmDeleteDay(item.id)}
          >
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  /**
   * Empty list UI
   */
  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>No days yet</Text>
      <Text style={styles.emptyText}>
        Tap “Add Day” to create your first workout day.
      </Text>

      <Pressable style={styles.primaryButton} onPress={addDay} disabled={adding}>
        <Text style={styles.primaryButtonText}>
          {adding ? "Adding..." : "Add Day"}
        </Text>
      </Pressable>
    </View>
  );

  /**
   * =========================
   * Main render
   * =========================
   */
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Plan</Text>
          <Text style={styles.headerSubtitle}>
            Build your workout days and open each day to add exercises.
          </Text>
        </View>

        {/* Add Day button */}
        <Pressable
          style={[styles.addButton, adding && styles.addButtonDisabled]}
          onPress={addDay}
          disabled={adding}
        >
          <Text style={styles.addButtonText}>{adding ? "..." : "+ Day"}</Text>
        </Pressable>
      </View>

      {/* Error banner (non-blocking) */}
      {loadError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{loadError}</Text>
          <Pressable onPress={loadDays}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Initial loading state */}
      {initialLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading days...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={days.length ? styles.listContent : styles.listEmpty}
          data={days}
          keyExtractor={(d) => d.id}
          renderItem={renderDayItem}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
