import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CommunitiesScreen from "../screens/communities/CommunitiesScreen";
import CreateCommunityScreen from "../screens/communities/CreateCommunityScreen";
import InviteFriendsScreen from "../screens/communities/InviteFriendsScreen";
import CommunityChatScreen from "../screens/communities/CommunityChatScreen";
import CommunityInfoScreen from "../screens/communities/CommunityInfoScreen";
import SearchMembersScreen from "../screens/communities/SearchMembersScreen";

export type CommunityStackParamList = {
  CommunitiesHome: undefined;
  CreateCommunity: undefined;
  InviteFriends: undefined;
  CommunityChat: { communityName: string; communityId: string };
  CommunityInfo: { name: string} | undefined;
  SearchMembers: undefined;
};

const Stack = createStackNavigator<CommunityStackParamList>();

export default function CommunityStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // your app shows its own top bars
      }}
    >
      <Stack.Screen name="CommunitiesHome" component={CommunitiesScreen} />
      <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} />
      <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
      <Stack.Screen name="CommunityChat" component={CommunityChatScreen} />
      <Stack.Screen name="CommunityInfo" component={CommunityInfoScreen} />
      <Stack.Screen name="SearchMembers" component={SearchMembersScreen} />
    </Stack.Navigator>
  );
}
