// navigation/BusinessProfileStack.tsx  (full, fixed)
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Profile area
import ProfileScreen from "../screens/profile/business/ProfileScreen";
import BusinessProfileScreen from "../screens/profile/business/BusinessProfileScreen";
import PersonalDetails from "../screens/profile/business/PersonalDetails";
import PlanScreen from "../screens/profile/business/PlanScreen";

// Reuse business editors from onboarding
import BusinessVerification from "../screens/registration/business/BusinessVerificationScreen";
import BusinessHoursScreen from "../screens/registration/business/BusinessHoursScreen";
import BusinessSocialsScreen from "../screens/registration/business/BusinessSocialsScreen";
import BusinessWifiScreen from "../screens/profile/business/BusinessWifiScreen";
import BusinessRewardsScreen from "../screens/registration/business/BusinessRewardsScreen";
import TicketProfileScreen from "../screens/profile/business/TicketProfileScreen";
import AddTicketScreen from "../screens/profile/business/AddTicketScreen";
import WifiConfigScreen from "../screens/profile/business/WifiConfigScreen";
import MoreScreen from "../screens/profile/MoreScreen";
// Nested chat stack (already defined)
import BusinessChatStack from "./BusinessChat";

export type BusinessProfileStackParamList = {
  ProfileHome: undefined;
  BusinessProfile: undefined;
  BusinessChat: undefined;

  // Editors referenced by BusinessProfileScreen ROUTES
  PersonalDetails: undefined;
  PlanScreen: undefined;
  BusinessVerification: undefined;
  OpeningHours: undefined;
  Socials: undefined;
  WifiDetails: undefined;
  RewardVoucherSetup: undefined;
  Ticket:undefined;
  AddTicket:undefined
  WifiConfig:undefined
  More:undefined
  
};

const Stack = createStackNavigator<BusinessProfileStackParamList>();

export default function BusinessProfileStack() {
  return (
    <Stack.Navigator initialRouteName="ProfileHome" screenOptions={{ headerShown: false }}>
      {/* Tabbed profile page */}
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />

      {/* Business profile menu page */}
      <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />

      {/* Editors */}
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="PlanScreen" component={PlanScreen} />
      <Stack.Screen name="BusinessVerification" component={BusinessVerification} />
      {/* Route names below match what BusinessProfileScreen navigates to */}
      <Stack.Screen name="OpeningHours" component={BusinessHoursScreen} />
      <Stack.Screen name="Socials" component={BusinessSocialsScreen} />
      <Stack.Screen name="WifiDetails" component={BusinessWifiScreen} />
      <Stack.Screen name="RewardVoucherSetup" component={BusinessRewardsScreen} />
      <Stack.Screen name="Ticket" component={TicketProfileScreen} />
      <Stack.Screen name="AddTicket" component={AddTicketScreen} />

      <Stack.Screen name="WifiConfig" component={WifiConfigScreen} />
      <Stack.Screen name="More" component={MoreScreen} />

      {/* Chats */}
      <Stack.Screen name="BusinessChat" component={BusinessChatStack} />
    </Stack.Navigator>
  );
}
