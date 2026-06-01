// navigation/FeedStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Adjust these paths to your structure
import FeedScreen from "../screens/feed/FeedScreen";
import UserProfileScreen from "../screens/feed/UserProfileScreen";
import BusinessProfileScreen from "../screens/profile/BusinessProfileScreen";
import FeaturedServicesScreen from "../screens/profile/FeaturedServicesScreen";
import WifiCheckoutScreen from "../screens/wifi/WifiCheckoutScreen";


export type FeedStackParamList = {
  FeedMain: undefined;
  UserProfile: { userId?: string } | undefined;
  BusinessProfile: undefined
  FeaturePlan: undefined
  ServiceDetails: undefined
};

const Stack = createStackNavigator<FeedStackParamList>();

export default function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedMain" component={FeedScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
      <Stack.Screen name="FeaturePlan" component={FeaturedServicesScreen} />
      <Stack.Screen name="ServiceDetails" component={WifiCheckoutScreen} />

    </Stack.Navigator>
  );
}
