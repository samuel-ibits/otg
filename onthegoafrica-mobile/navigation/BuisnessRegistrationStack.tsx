// navigation/BusinessRegistrationStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BusinessNameScreen,
  BusinessLocationScreen,
  BusinessCACScreen,
  BusinessLogoScreen,
  BusinessLogoConfirmScreen,
} from "../screens/business/BusinessProfileSetupScreen";

const Stack = createNativeStackNavigator();

export default function BusinessRegistrationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BusinessName" component={BusinessNameScreen} />
      <Stack.Screen
        name="BusinessLocation"
        component={BusinessLocationScreen}
      />
      <Stack.Screen name="BusinessCAC" component={BusinessCACScreen} />
      <Stack.Screen name="BusinessLogo" component={BusinessLogoScreen} />
      <Stack.Screen
        name="BusinessLogoConfirm"
        component={BusinessLogoConfirmScreen}
      />
    </Stack.Navigator>
  );
}
