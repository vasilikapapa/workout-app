// screens/ExerciseForm/ExerciseFormScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
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
type Props = NativeStackScreenProps<RootStackParamList, "ExerciseForm">;

// Supported time units
type TimeUnit = "sec" | "min" | "hour";

/**
 * =========================
 * ExerciseFormScreen
 * =========================
 *
 * Used for:
 * - Adding a new exercise
 * - Editing an existing exercise
 *
 * Behavior depends on whether `exerciseId` exists.
 */
export default function ExerciseFormScreen({ route, navigation }: Props) {
  /**
   * =========================
   * Params
   * =========================
   */

  // Params from navigation
  const { sectionId, exerciseId } = route.params;

  // If exerciseId exists → edit mode, otherwise add mode
  const isEdit = !!exerciseId;

  /**
   * =========================
   * Form state
   * =========================
   */

  // Common fields
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"reps" | "time">("reps");

  // Reps mode fields
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("12");

  // Time mode fields
  const [timeValue, setTimeValue] = useState("30");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("sec");

  // Save button loading state
  const [saving, setSaving] = useState(false);

  // Loading existing exercise data (edit mode)
  const [loadingExercise, setLoadingExercise] = useState(false);

  /**
   * =========================
   * Derived state
   * =========================
   */

  // Cleaned exercise name (used for validation and payload)
  const trimmedName = useMemo(() => name.trim(), [name]);

  // Basic save button enable/disable
  const canSave = trimmedName.length > 0 && !saving && !loadingExercise;

  /**
   * =========================
   * Validation helpers
   * =========================
   */

  // Validate time value based on selected unit
  function validateTime(valueStr: string, unit: TimeUnit): string | null {
    const v = Number(valueStr);

    if (!Number.isFinite(v) || v < 1) return "Time must be at least 1";

    if (unit === "sec" && v > 59) return "Seconds must be 1–59";
    if (unit === "min" && v > 59) return "Minutes must be 1–59";
    if (unit === "hour" && v > 12) return "Hours must be ≤ 12";

    return null;
  }

  /**
   * =========================
   * Save handler
   * =========================
   */

  async function save() {
    // Basic validation
    if (!trimmedName) {
      return Alert.alert("Validation", "Exercise name is required.");
    }

    setSaving(true);

    try {
      // Dismiss keyboard for a cleaner feel
      Keyboard.dismiss();

      // =====================
      // Reps mode
      // =====================
      if (mode === "reps") {
        const setsNum = Number(sets);

        if (!Number.isFinite(setsNum) || setsNum < 1) {
          return Alert.alert("Validation", "Sets must be 1+.");
        }

        if (!reps.trim()) {
          return Alert.alert("Validation", "Reps is required.");
        }

        const payload = {
          name: trimmedName,
          mode,
          sets: setsNum,
          reps: reps.trim(),
        };

        if (isEdit) {
          // ✏️ Update existing exercise
          await api.patch(`/exercises/${exerciseId}`, payload);
        } else {
          // ➕ Create new exercise
          await api.post(`/sections/${sectionId}/exercises`, payload);
        }

        // =====================
        // Time mode
        // =====================
      } else {
        const err = validateTime(timeValue, timeUnit);
        if (err) return Alert.alert("Validation", err);

        const payload = {
          name: trimmedName,
          mode,
          timeValue: Number(timeValue),
          timeUnit,
        };

        if (isEdit) {
          // ✏️ Update existing exercise
          await api.patch(`/exercises/${exerciseId}`, payload);
        } else {
          // ➕ Create new exercise
          await api.post(`/sections/${sectionId}/exercises`, payload);
        }
      }

      // Go back to Day screen after successful save
      navigation.goBack();
    } catch (e: any) {
      // Show server or network error
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to save exercise");
    } finally {
      setSaving(false);
    }
  }

  /**
   * =========================
   * Load exercise for edit mode
   * =========================
   */

  useEffect(() => {
    if (!exerciseId) return;

    (async () => {
      setLoadingExercise(true);
      try {
        // Fetch existing exercise data
        const res = await api.get(`/exercises/${exerciseId}`);
        const ex = res.data;

        // Populate form
        setName(ex.name);
        setMode(ex.mode);

        if (ex.mode === "reps") {
          setSets(String(ex.sets ?? "3"));
          setReps(String(ex.reps ?? "12"));
        } else {
          setTimeValue(String(ex.timeValue ?? "30"));
          setTimeUnit(ex.timeUnit ?? "sec");
        }
      } catch (e: any) {
        Alert.alert("Error", e?.response?.data?.error ?? "Failed to load exercise");
      } finally {
        setLoadingExercise(false);
      }
    })();
  }, [exerciseId]);

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header (title + cancel) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {isEdit ? "Edit Exercise" : "Add Exercise"}
          </Text>
          <Text style={styles.subtitle}>
            Choose a mode and fill in the details.
          </Text>
        </View>

        <Pressable onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      {/* Main card */}
      <View style={styles.card}>
        {/* Loading overlay for edit mode */}
        {loadingExercise ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Loading exercise...</Text>
          </View>
        ) : (
          <>
            {/* Exercise name */}
            <Text style={styles.label}>Exercise Name</Text>
            <TextInput
              placeholder="e.g. Push ups"
              value={name}
              onChangeText={setName}
              style={styles.input}
              returnKeyType="done"
            />

            {/* Mode selector */}
            <Text style={styles.label}>Mode</Text>
            <View style={styles.segmentRow}>
              {(["reps", "time"] as const).map((m) => {
                const active = mode === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    style={[styles.segment, active && styles.segmentActive]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        active && styles.segmentTextActive,
                      ]}
                    >
                      {m.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Reps mode inputs */}
            {mode === "reps" ? (
              <>
                <Text style={styles.label}>Sets</Text>
                <TextInput
                  placeholder="e.g. 3"
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="number-pad"
                  style={styles.input}
                />

                <Text style={styles.label}>Reps</Text>
                <TextInput
                  placeholder="e.g. 12 or 12-15"
                  value={reps}
                  onChangeText={setReps}
                  style={styles.input}
                />
              </>
            ) : (
              <>
                {/* Time value */}
                <Text style={styles.label}>Time</Text>
                <TextInput
                  placeholder="e.g. 30"
                  value={timeValue}
                  onChangeText={setTimeValue}
                  keyboardType="number-pad"
                  style={styles.input}
                />

                {/* Time unit selector */}
                <Text style={styles.label}>Unit</Text>
                <View style={styles.segmentRow}>
                  {(["sec", "min", "hour"] as TimeUnit[]).map((u) => {
                    const active = timeUnit === u;
                    return (
                      <Pressable
                        key={u}
                        onPress={() => setTimeUnit(u)}
                        style={[styles.segment, active && styles.segmentActive]}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            active && styles.segmentTextActive,
                          ]}
                        >
                          {u.toUpperCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* Save button */}
            <Pressable
              style={[styles.primaryButton, !canSave && styles.primaryButtonDisabled]}
              onPress={save}
              disabled={!canSave}
            >
              <Text style={styles.primaryButtonText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
