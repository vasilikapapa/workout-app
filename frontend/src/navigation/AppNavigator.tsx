import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getToken } from "../auth/token";

import WelcomeScreen from "../screens/Welcome/WelcomeScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PlansScreen from "../screens/Plans/PlansScreen";
import PlanScreen from "../screens/Plan/PlanScreen";
import DayScreen from "../screens/Days/DayScreen";
import ExerciseFormScreen from "../screens/ExerciseForm/ExerciseFormScreen";

/**
 * =========================
 * Navigation type definitions
 * =========================
 *
 * Defines all screens and the params they expect.
 * Used for type-safe navigation with React Navigation.
 */
export type RootStackParamList = {
  // Landing / Auth screens
  Welcome: undefined;
  Login: undefined;
  Register: undefined;

  // Main screens
  Plans: undefined;

  // Single plan view
  Plan: {
    planId: string;
    title: string;
  };

  // Single day view
  Day: {
    dayId: string;
    dayName: string;
  };

  // Create / edit exercise screen
  ExerciseForm: {
    sectionId: string;
    sectionType: "warmup" | "workout" | "stretch";
    dayName: string;
    exerciseId?: string;
  };
};

// Create stack navigator with typed params
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * =========================
 * App Navigator
 * =========================
 *
 * - Handles authentication-based navigation
 * - Shows Welcome/Login/Register when signed out
 * - Shows app screens when signed in
 */
export default function AppNavigator() {
  const [ready, setReady] = useState(false); // Wait until token check completes
  const [signedIn, setSignedIn] = useState(false); // Auth state

  /**
   * On app load:
   * - Check if a token exists in secure storage
   * - Decide which navigation stack to show
   */
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setSignedIn(!!t); // true if token exists
      setReady(true); // allow rendering
    })();
  }, []);

  // Prevent rendering until auth state is resolved
  if (!ready) return null;

  return (
    <NavigationContainer>
      {/* =========================
          IMPORTANT:
          We use two different stacks depending on signedIn state.
          Signed out: Welcome -> Login/Register
          Signed in: Plans -> Plan -> Day -> ExerciseForm
         ========================= */}
      {!signedIn ? (
        /**
         * =========================
         * Auth flow (not signed in)
         * =========================
         *
         * Start on Welcome screen.
         */
        <Stack.Navigator initialRouteName="Welcome">
          {/* Welcome / landing screen */}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />

          {/* Login */}
          <Stack.Screen name="Login" options={{ title: "Login" }}>
            {(props) => (
              <LoginScreen {...props} onSignedIn={() => setSignedIn(true)} />
            )}
          </Stack.Screen>

          {/* Register */}
          <Stack.Screen name="Register" options={{ title: "Create account" }}>
            {(props) => (
              <RegisterScreen {...props} onSignedIn={() => setSignedIn(true)} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        /**
         * =========================
         * App flow (signed in)
         * =========================
         */
        <Stack.Navigator>
          {/* Plans list */}
          <Stack.Screen name="Plans" options={{ title: "Plans" }}>
            {(props) => (
              <PlansScreen {...props} onSignedOut={() => setSignedIn(false)} />
            )}
          </Stack.Screen>

          {/* Plan details */}
          <Stack.Screen
            name="Plan"
            component={PlanScreen}
            options={({ route }) => ({
              title: route.params.title,
            })}
          />

          {/* Day details */}
          <Stack.Screen
            name="Day"
            component={DayScreen}
            options={({ route }) => ({
              title: route.params.dayName,
            })}
          />

          {/* Add / edit exercise */}
          <Stack.Screen
            name="ExerciseForm"
            component={ExerciseFormScreen}
            options={({ route }) => ({
              title: `Add exercise (${route.params.sectionType})`,
            })}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
