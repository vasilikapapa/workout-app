import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Pressable, Alert } from "react-native";
import { api } from "../api/client";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

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
    const trimmed = name.trim();

    // Basic validation
    if (!trimmed) {
      return Alert.alert("Validation", "Exercise name is required.");
    }

    setSaving(true);
    try {
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
          name: trimmed,
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
          name: trimmed,
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
      Alert.alert(
        "Error",
        e?.response?.data?.error ?? "Failed to save exercise"
      );
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
    })();
  }, [exerciseId]);

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {/* Exercise name */}
      <TextInput
        placeholder="Exercise name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      {/* Mode selector */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["reps", "time"] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderRadius: 999,
              opacity: mode === m ? 1 : 0.6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{m.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      {/* Reps mode inputs */}
      {mode === "reps" ? (
        <>
          <TextInput
            placeholder="Sets (e.g. 3)"
            value={sets}
            onChangeText={setSets}
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
          />
          <TextInput
            placeholder="Reps (e.g. 12 or 12-15)"
            value={reps}
            onChangeText={setReps}
            style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
          />
        </>
      ) : (
        <>
          {/* Time value */}
          <TextInput
            placeholder="Time value (e.g. 30)"
            value={timeValue}
            onChangeText={setTimeValue}
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
          />

          {/* Time unit selector */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["sec", "min", "hour"] as TimeUnit[]).map((u) => (
              <Pressable
                key={u}
                onPress={() => setTimeUnit(u)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderRadius: 999,
                  opacity: timeUnit === u ? 1 : 0.6,
                }}
              >
                <Text style={{ fontWeight: "600" }}>{u.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Save button */}
      <Button
        title={saving ? "Saving..." : "Save"}
        onPress={save}
        disabled={saving}
      />
    </View>
  );
}
