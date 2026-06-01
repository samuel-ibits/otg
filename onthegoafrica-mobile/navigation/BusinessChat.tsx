import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Chatscreen from "../screens/chat/business/ChatsScreen";
import NewChatScreen from "../screens/chat/business/NewChatScreen";

export type ChatStackParamList = {
  ChatList: undefined;
  DirectChat: { id: string; name: string; avatar?: any };
    SearchMembers: undefined;
};

const Stack = createStackNavigator<ChatStackParamList>();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={Chatscreen} />
      <Stack.Screen name="DirectChat" component={NewChatScreen} />
    </Stack.Navigator>
  );
}
