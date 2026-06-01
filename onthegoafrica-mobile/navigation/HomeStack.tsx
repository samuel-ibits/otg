import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import MoreScreen from "../screens/profile/MoreScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import InviteFriendsShareScreen from "../screens/profile/InviteFriendsShareScreen";
import LoyaltyProgramScreen from "../screens/profile/LoyaltyProgramScreen";
import RewardVouchersScreen from "../screens/loyalty/RewardVouchersScreen";
import ExchangeRewardScreen from "../screens/loyalty/ExchangeRewardScreen";
import ExchangeRequestSuccessScreen from "../screens/loyalty/ExchangeRequestSuccessScreen";
import RewardsMarketplaceScreen from "../screens/loyalty/RewardsMarketplaceScreen";
import TrendsScreen from "../screens/loyalty/TrendsScreen";
import DirectionPreviewScreen from "../screens/map/DirectionPreviewScreen";
import WifiTransactionsScreen from "../screens/wifi/WifiTransactionsScreen";
import AffiliateListScreen from "../screens/Affiliate/Affiliate";
import AffiliateDetailsScreen from "../screens/Affiliate/AffiliateDetailsScreen";
import BusinessProfileScreen from "../screens/profile/BusinessProfileScreen";
import FeaturedServicesScreen from "../screens/profile/FeaturedServicesScreen";
import WifiCheckoutScreen from "../screens/wifi/WifiCheckoutScreen";


export type HomeStackParamList = {
  HomeMain: undefined;
  Profile: undefined;
    EditProfile: undefined;
    More: undefined;
    ChangePassword:undefined;
    About:undefined;
    Invite: undefined
    Loyalty: undefined
    Reward: undefined
    Exchange: undefined
    SuccessExchange: undefined
    RewardMarket: undefined
    Trend: undefined
    Map: undefined
    WifiTransaction: undefined
    AffliList: undefined
    AffilDetails: undefined
    BusinessProfile: undefined
    FeaturePlan: undefined
    ServiceDetails:undefined
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="More" component={MoreScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Invite" component={InviteFriendsShareScreen} />
        <Stack.Screen name="Loyalty" component={LoyaltyProgramScreen} />
        <Stack.Screen name="Reward" component={RewardVouchersScreen} />
        <Stack.Screen name="Exchange" component={ExchangeRewardScreen} />
        <Stack.Screen name="SuccessExchange" component={ExchangeRequestSuccessScreen} />
        <Stack.Screen name="RewardMarket" component={RewardsMarketplaceScreen} />
        <Stack.Screen name="Trend" component={TrendsScreen} />
        <Stack.Screen name="Map" component={DirectionPreviewScreen} />
        <Stack.Screen name="WifiTransaction" component={WifiTransactionsScreen} />
        <Stack.Screen name="AffliList" component={AffiliateListScreen} />
        <Stack.Screen name="AffilDetails" component={AffiliateDetailsScreen} />
        <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
        <Stack.Screen name="FeaturePlan" component={FeaturedServicesScreen} />
        <Stack.Screen name="ServiceDetails" component={WifiCheckoutScreen} />
    </Stack.Navigator>
  );
}
