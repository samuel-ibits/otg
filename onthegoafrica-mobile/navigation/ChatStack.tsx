import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatListScreen from "../screens/chat/ChatScreen";
import DirectChatScreen from "../screens/chat/DirectChatScreen";
import SearchMembersScreen from "../screens/chat/SearchMembersScreen";

export type ChatStackParamList = {
  ChatList: undefined;
  DirectChat: { id: string; name: string; avatar?: any };
    SearchMembers: undefined;
};

const Stack = createStackNavigator<ChatStackParamList>();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="DirectChat" component={DirectChatScreen} />
      <Stack.Screen name="SearchMembers" component={SearchMembersScreen} />
    </Stack.Navigator>
  );
}
