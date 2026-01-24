import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, Button, Alert } from "react-native";
import { api } from "../api/client";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useFocusEffect } from "@react-navigation/native";

/**
 * =========================
 * Types
 * =========================
 */

// Screen props typed from the navigation stack
type Props = NativeStackScreenProps<RootStackParamList, "Day">;

// Section tabs supported by the UI
type SectionType = "warmup" | "workout" | "stretch";

// Section returned by the API
type Section = {
  id: string;
  type: SectionType;
  sectionOrder: number;
};

// Exercise returned by the API
type Exercise = {
  id: string;
  name: string;
  mode: "reps" | "time";
  sets?: number | null;
  reps?: string | null;
  timeValue?: number | null;
  timeUnit?: "sec" | "min" | "hour" | null;
  exerciseOrder: number;
};

/**
 * =========================
 * DayScreen
 * =========================
 *
 * Shows:
 * - Tabs for warmup / workout / stretch
 * - Exercises for the active section
 * - Ability to add, edit, delete exercises
 */
export default function DayScreen({ route, navigation }: Props) {
  // Params passed from navigation
  const { dayId, dayName } = route.params;

  // Sections for the day (warmup/workout/stretch)
  const [sections, setSections] = useState<Section[]>([]);

  // Currently selected section tab
  const [activeType, setActiveType] = useState<SectionType>("workout");

  // Exercises for the active section
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Pull-to-refresh loading state
  const [loading, setLoading] = useState(false);

  /**
   * Find the currently active section object
   * (memoized to avoid unnecessary recalculations)
   */
  const activeSection = useMemo(
    () => sections.find((s) => s.type === activeType),
    [sections, activeType]
  );

  /**
   * =========================
   * Data loading helpers
   * =========================
   */

  // Load all sections for the day
  async function loadSections() {
    const res = await api.get<Section[]>(`/days/${dayId}/sections`);
    setSections(res.data);
  }

  // Load exercises for a specific section
  async function loadExercises(sectionId: string) {
    const res = await api.get<Exercise[]>(`/sections/${sectionId}/exercises`);
    setExercises(res.data);
  }

  // Delete an exercise and update UI immediately
  async function deleteExercise(exerciseId: string) {
    try {
      await api.delete(`/exercises/${exerciseId}`);
      setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to delete");
    }
  }

  // Confirm deletion with the user
  function confirmDelete(exerciseId: string) {
    Alert.alert("Delete exercise?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteExercise(exerciseId),
      },
    ]);
  }

  /**
   * =========================
   * Effects
   * =========================
   */

  // Load sections when the day changes
  useEffect(() => {
    loadSections();
  }, [dayId]);

  // Reload exercises every time this screen regains focus
  // (e.g. after returning from ExerciseForm)
  useFocusEffect(
    React.useCallback(() => {
      if (activeSection?.id) {
        loadExercises(activeSection.id);
      }
    }, [activeSection?.id])
  );

  // Pull-to-refresh handler
  async function refresh() {
    if (!activeSection?.id) return;
    setLoading(true);
    try {
      await loadExercises(activeSection.id);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Format exercise details for display
   */
  function formatExercise(e: Exercise) {
    if (e.mode === "reps") {
      return `${e.sets ?? "-"} sets • ${e.reps ?? "-"}`;
    }
    return `${e.timeValue ?? "-"} ${e.timeUnit ?? ""}`.trim();
  }

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      {/* Section tabs */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["warmup", "workout", "stretch"] as SectionType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setActiveType(t)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderRadius: 999,
              opacity: activeType === t ? 1 : 0.6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      {/* Add exercise button */}
      <Button
        title="Add Exercise"
        onPress={() => {
          if (!activeSection?.id) {
            return Alert.alert("Error", "Section not ready yet.");
          }
          navigation.navigate("ExerciseForm", {
            sectionId: activeSection.id,
            sectionType: activeType,
            dayName,
          });
        }}
      />

      {/* Exercises list */}
      <FlatList
        data={exercises}
        keyExtractor={(e) => e.id}
        refreshing={loading}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (!activeSection?.id) return;
              // Navigate to edit exercise
              navigation.navigate("ExerciseForm", {
                sectionId: activeSection.id,
                sectionType: activeType,
                dayName,
                exerciseId: item.id,
              });
            }}
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              {item.name}
            </Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>
              {formatExercise(item)}
            </Text>

            <View style={{ height: 10 }} />

            {/* Delete action */}
            <Button title="Delete" onPress={() => confirmDelete(item.id)} />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ opacity: 0.6 }}>
            No exercises in {activeType}. Tap “Add Exercise”.
          </Text>
        }
      />
    </View>
  );
}
