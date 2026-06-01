// navigation/BusinessTabNavigator.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BusinessDashboardScreen from "../navigation/DashboardStack";
import PostScreen from "../screens/post/BusinessPostScreen";
import ChatsScreen from "../navigation/BusinessChat";
import ProfileScreen from "../navigation/BusinessProfileStack";


export type BusinessTabsParamList = {
  BizHome: undefined;
  BizPost: undefined;
  BizChat: undefined;
  BizProfile: undefined;
};

const Tab = createBottomTabNavigator<BusinessTabsParamList>();

export default function BusinessTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      tabBar={(props) => <BusinessTabBar {...props} />}
    >
      <Tab.Screen name="BizHome" component={BusinessDashboardScreen} />
      <Tab.Screen name="BizPost" component={PostScreen} />
      <Tab.Screen name="BizChat" component={ChatsScreen} />
      <Tab.Screen name="BizProfile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/* ---------------- Custom Tab Bar ---------------- */

function BusinessTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        // Icons: replace with your assets if you have them
        if (route.name === "BizPost") {
          return (
            <TouchableOpacity key={route.key} accessibilityRole="button" onPress={onPress} style={s.centerBtn} activeOpacity={0.9}>
              <View style={s.plusCircle}>
                <Text style={s.plus}>＋</Text>
              </View>
              <Text style={[s.label, focused && s.labelActive]}>Post</Text>
            </TouchableOpacity>
          );
        }

        const { icon, label } = tabMeta(route.name, focused);

        return (
          <TouchableOpacity key={route.key} accessibilityRole="button" onPress={onPress} style={s.item} activeOpacity={0.8}>
            {icon}
            <Text style={[s.label, focused && s.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function tabMeta(name: keyof BusinessTabsParamList, focused: boolean) {
  const tint = focused ? "#0145FE" : "#98A6BD";
  const size = 22;

  switch (name) {
    case "BizHome":
      return {
        label: "Home",
        icon: <Image source={require("../assets/icons/home.png")} style={{ width: size, height: size, tintColor: tint }} />,
      };
    case "BizChat":
      return {
        label: "Chat",
        icon: <Image source={require("../assets/icons/chat.png")} style={{ width: size, height: size, tintColor: tint }} />,
      };
    case "BizProfile":
      return {
        label: "Profile",
        // If you have an avatar, render it here
        icon: (
          <View style={s.avatarRing}>
            <Image
              source={require("../assets/feed/user1.png")}
              style={{ width: 22, height: 22, borderRadius: 11 }}
            />
          </View>
        ),
      };
    default:
      return { label: "", icon: <View /> };
  }
}

/* ---------------- Styles ---------------- */

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6ECF5",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 6,
  },
  item: { alignItems: "center", justifyContent: "center", flex: 1, paddingVertical: 6 },
  label: { marginTop: 4, fontSize: 12, color: "#98A6BD", fontFamily: "RCB-SemiBold" },
  labelActive: { color: "#0145FE" },

  centerBtn: { alignItems: "center", justifyContent: "center", flex: 1 },
  plusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0145FE",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: { color: "#fff", fontSize: 22, lineHeight: 22, fontWeight: "700" },

  avatarRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6ECF5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
