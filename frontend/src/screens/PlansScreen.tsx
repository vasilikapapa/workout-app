import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Pressable } from "react-native";
import { api } from "../api/client";
import { clearToken } from "../auth/token";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

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

  const [plans, setPlans] = useState<Plan[]>([]); // List of plans
  const [title, setTitle] = useState("");         // New plan title input

  /**
   * =========================
   * Data loading
   * =========================
   */

  // Fetch all plans for the logged-in user
  async function loadPlans() {
    const res = await api.get<Plan[]>("/plans");
    setPlans(res.data);
  }

  // Load plans when screen mounts
  useEffect(() => {
    loadPlans();
  }, []);

  /**
   * =========================
   * Actions
   * =========================
   */

  // Create a new plan
  async function createPlan() {
    if (!title.trim()) return;

    // Create plan in backend
    const res = await api.post<Plan>("/plans", {
      title: title.trim(),
    });

    // Clear input field
    setTitle("");

    // Refresh plans list
    await loadPlans();

    // Navigate directly to the newly created plan
    navigation.navigate("Plan", {
      planId: res.data.id,
      title: res.data.title,
    });
  }

  // Logout the user
  async function logout() {
    // Remove stored auth token
    await clearToken();

    // Notify AppNavigator to switch to auth flow
    onSignedOut();
  }

  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      {/* Create plan input */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="New plan title"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            flex: 1,
          }}
        />
        <Button title="Add" onPress={createPlan} />
      </View>

      {/* Plans list */}
      <FlatList
        data={plans}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("Plan", {
                planId: item.id,
                title: item.title,
              })
            }
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {item.title}
            </Text>
            <Text style={{ opacity: 0.6, marginTop: 4 }}>
              Tap to edit
            </Text>
          </Pressable>
        )}
      />

      {/* Logout button */}
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
