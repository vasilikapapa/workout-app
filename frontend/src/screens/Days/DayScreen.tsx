// screens/Day/DayScreen.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

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
 *
 * UX Improvements:
 * - Segmented tab UI
 * - Card-based exercise list
 * - Primary “Add Exercise” button
 * - Pull-to-refresh
 */
export default function DayScreen({ route, navigation }: Props) {
  /**
   * =========================
   * Params
   * =========================
   */

  // Params passed from navigation
  const { dayId, dayName } = route.params;

  /**
   * =========================
   * State
   * =========================
   */

  // Sections for the day (warmup/workout/stretch)
  const [sections, setSections] = useState<Section[]>([]);

  // Currently selected section tab
  const [activeType, setActiveType] = useState<SectionType>("workout");

  // Exercises for the active section
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Initial loading (when first opening screen)
  const [initialLoading, setInitialLoading] = useState(true);

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

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
  const loadSections = useCallback(async () => {
    const res = await api.get<Section[]>(`/days/${dayId}/sections`);
    setSections(res.data);
  }, [dayId]);

  // Load exercises for a specific section
  const loadExercises = useCallback(async (sectionId: string) => {
    const res = await api.get<Exercise[]>(`/sections/${sectionId}/exercises`);
    setExercises(res.data);
  }, []);

  /**
   * Delete an exercise and update UI immediately
   */
  async function deleteExercise(exerciseId: string) {
    try {
      await api.delete(`/exercises/${exerciseId}`);
      setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to delete");
    }
  }

  /**
   * Confirm deletion with the user
   */
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
    (async () => {
      setInitialLoading(true);
      await loadSections();
      setInitialLoading(false);
    })();
  }, [loadSections]);

  // Reload exercises every time screen regains focus
  // (e.g. after returning from ExerciseForm)
  useFocusEffect(
    useCallback(() => {
      if (activeSection?.id) {
        loadExercises(activeSection.id);
      }
    }, [activeSection?.id, loadExercises])
  );

  /**
   * Pull-to-refresh handler
   */
  const refresh = useCallback(async () => {
    if (!activeSection?.id) return;
    setRefreshing(true);
    try {
      await loadExercises(activeSection.id);
    } finally {
      setRefreshing(false);
    }
  }, [activeSection?.id, loadExercises]);

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
   * Handle Add Exercise action
   */
  function goToAddExercise() {
    if (!activeSection?.id) {
      return Alert.alert("Error", "Section not ready yet.");
    }

    navigation.navigate("ExerciseForm", {
      sectionId: activeSection.id,
      sectionType: activeType,
      dayName,
    });
  }

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
          <Text style={styles.headerTitle}>{dayName}</Text>
          <Text style={styles.headerSubtitle}>
            Select a section and manage exercises.
          </Text>
        </View>

        <Pressable style={styles.addButton} onPress={goToAddExercise}>
          <Text style={styles.addButtonText}>+ Exercise</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        {(["warmup", "workout", "stretch"] as SectionType[]).map((t) => {
          const isActive = activeType === t;
          return (
            <Pressable
              key={t}
              onPress={() => setActiveType(t)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {t.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Initial loading */}
      {initialLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading exercises...</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(e) => e.id}
          contentContainerStyle={
            exercises.length ? styles.listContent : styles.listEmpty
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.exerciseBlock}>
              {/* Exercise card (tap to edit) */}
              <Pressable
                onPress={() => {
                  if (!activeSection?.id) return;

                  navigation.navigate("ExerciseForm", {
                    sectionId: activeSection.id,
                    sectionType: activeType,
                    dayName,
                    exerciseId: item.id,
                  });
                }}
                style={styles.exerciseCard}
              >
                <View style={styles.exerciseTopRow}>
                  <Text style={styles.exerciseTitle}>{item.name}</Text>
                  <Text style={styles.exerciseEditHint}>Tap to edit</Text>
                </View>

                <Text style={styles.exerciseMeta}>{formatExercise(item)}</Text>
              </Pressable>

              {/* Delete action */}
              <Pressable
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No exercises yet</Text>
              <Text style={styles.emptyText}>
                Add your first exercise for {activeType}.
              </Text>

              <Pressable style={styles.primaryButton} onPress={goToAddExercise}>
                <Text style={styles.primaryButtonText}>Add Exercise</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}
