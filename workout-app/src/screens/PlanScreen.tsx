import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, FlatList, Pressable, Alert } from "react-native";
import { api } from "../api/client";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

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
 */
export default function PlanScreen({ route, navigation }: Props) {
  // Plan ID passed from navigation
  const { planId } = route.params;

  // Days belonging to this plan
  const [days, setDays] = useState<Day[]>([]);

  // Loading state for adding a day
  const [loading, setLoading] = useState(false);

  /**
   * =========================
   * Data loading
   * =========================
   */

  // Fetch all days for the plan
  async function loadDays() {
    const res = await api.get<Day[]>(`/plans/${planId}/days`);
    setDays(res.data);
  }

  // Load days when the screen mounts or planId changes
  useEffect(() => {
    loadDays();
  }, [planId]);

  /**
   * Compute the default name for the next day
   * (memoized to avoid unnecessary recalculation)
   */
  const nextName = useMemo(
    () => `Day ${days.length + 1}`,
    [days.length]
  );

  /**
   * =========================
   * Day actions
   * =========================
   */

  // Create a new day
  async function addDay() {
    setLoading(true);
    try {
      await api.post(`/plans/${planId}/days`, { name: nextName });
      await loadDays(); // refresh list
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to add day");
    } finally {
      setLoading(false);
    }
  }

  // Ask user to confirm deletion
  function confirmDeleteDay(dayId: string) {
    Alert.alert(
      "Delete day?",
      "This will delete its sections and exercises.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteDay(dayId),
        },
      ]
    );
  }

  // Delete a day and update UI immediately
  async function deleteDay(dayId: string) {
    try {
      await api.delete(`/days/${dayId}`);

      // Instant UI update without refetch
      setDays((prev) => prev.filter((d) => d.id !== dayId));
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to delete day");
    }
  }

  // Prompt user to edit the day name
  function editDayName(dayId: string, currentName: string) {
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
          setDays((prev) =>
            prev.map((d) => (d.id === dayId ? res.data : d))
          );
        } catch (e: any) {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "Failed to update day"
          );
        }
      },
      "plain-text",
      currentName
    );
  }

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      {/* Add new day */}
      <Button
        title={loading ? "Adding..." : "Add Day"}
        onPress={addDay}
        disabled={loading}
      />

      {/* Days list */}
      <FlatList
        data={days}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            {/* Navigate to Day screen */}
            <Pressable
              onPress={() =>
                navigation.navigate("Day", {
                  dayId: item.id,
                  dayName: item.name,
                })
              }
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.name}
              </Text>
            </Pressable>

            {/* Edit / Delete actions */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <Button
                title="Edit"
                onPress={() => editDayName(item.id, item.name)}
              />
              <Button
                title="Delete"
                onPress={() => confirmDeleteDay(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ opacity: 0.6 }}>
            No days yet. Tap “Add Day”.
          </Text>
        }
      />
    </View>
  );
}
