// navigation/DashboardStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import BusinessDashboardScreen from "../screens/home/BusinessDashboardScreen";
import ProfileVisitsScreen from "../screens/home/ProfileVisitsScreen";
import RepeatCustomersScreen from "../screens/home/RepeatCustomersScreen";
import WiFiConnectionsScreen from "../screens/home/WiFiConnectionsScreen";
import PostsAnalyticsScreen from "../screens/home/PostsAnalyticsScreen";
import CafeReviewsScreen from "../screens/home/CafeReviewsScreen";
import VouchersScreen from "../screens/home/VouchersScreen";
import CustomerInsightsScreen from "../screens/home/CustomerInsightsScreen";
import QRScannerScreen from "../screens/home/QRScanner";

export type DashboardStackParamList = {
  BusinessDashboard: undefined;
  ProfileVisits: undefined;
  RepeatCustomers: undefined;
  WiFiConnections: undefined;
  PostsAnalytics: undefined;
  CafeReviews: undefined;
  Vouchers: undefined;
  CustomerInsights: undefined;
};

const Stack = createStackNavigator<DashboardStackParamList>();

export default function DashboardStack() {
  return (
    <Stack.Navigator
      initialRouteName="BusinessDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BusinessDashboard" component={BusinessDashboardScreen} />
      <Stack.Screen name="ProfileVisits" component={ProfileVisitsScreen} />
      <Stack.Screen name="RepeatCustomers" component={RepeatCustomersScreen} />
      <Stack.Screen name="WiFiConnections" component={WiFiConnectionsScreen} />
      <Stack.Screen name="PostsAnalytics" component={PostsAnalyticsScreen} />
      <Stack.Screen name="CafeReviews" component={CafeReviewsScreen} />
      <Stack.Screen name="Vouchers" component={VouchersScreen} />
      <Stack.Screen name="CustomerInsights" component={CustomerInsightsScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
    </Stack.Navigator>
  );
}
