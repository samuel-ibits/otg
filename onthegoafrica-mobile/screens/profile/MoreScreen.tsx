// screens/profile/MoreScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import ConfirmLogoutModal from "../../component/ConfirmLogoutModal";
import DeleteAccountModal from "../../component/DeleteAccountModal";
import { logoutUser } from "../../api/api";

const BACK_ICON = require("../../assets/icons/back.png");
const INVITE_ICON = require("../../assets/icons/people.png");
const LOCK_ICON = require("../../assets/icons/lock.png");
const INFO_ICON = require("../../assets/icons/Info.png");
const GEAR_ICON = require("../../assets/icons/gear.png");
const LOGOUT_ICON = require("../../assets/icons/logout.png");
const BUSINESS_ICON = require("../../assets/icons/Case.png"); // add this asset

type Item = {
  id: string;
  title: string;
  icon: any;
  onPress: () => void;
};

export default function MoreScreen({ navigation }: any) {
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // persisted flags. set these elsewhere after auth or profile actions.
  const [hasBusinessAccount, setHasBusinessAccount] = useState<boolean>(false);
  const [hasBusinessProfile, setHasBusinessProfile] = useState<boolean>(false);

  async function loadBusinessFlags() {
    const acc = (await AsyncStorage.getItem("hasBusinessAccount")) === "true";
    const prof = (await AsyncStorage.getItem("hasBusinessProfile")) === "true";
    setHasBusinessAccount(acc);
    setHasBusinessProfile(prof);
  }

  useEffect(() => {
    loadBusinessFlags();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      loadBusinessFlags();
    }, [])
  );

  const goToLogin = async () => {
    await logoutUser();
    const tabNav = navigation.getParent?.();
    const rootNav = tabNav?.getParent?.();

    if (rootNav) {
      rootNav.navigate("OnboardingFlow", { screen: "Login" });
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "OnboardingFlow", params: { screen: "Login" } as any },
        ],
      })
    );
  };

  const confirmLogout = () => {
    setShowLogout(false);
    // TODO: clear auth/session here
    goToLogin();
  };

  const confirmDelete = () => {
    setShowDelete(false);
    // TODO: call delete account API, then redirect
    goToLogin();
  };

  // Navigate to create business profile flow in Onboarding stack
  const goToCreateBusinessProfile = () => {
    const tabNav = navigation.getParent?.();
    const rootNav = tabNav?.getParent?.();
    // OnboardingStack exposes CreateBusinessProfile route
    // We jump to OnboardingFlow -> CreateBusinessProfile
    // App root stack contains OnboardingFlow and BusinessNavigator. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}
    if (rootNav?.navigate) {
      rootNav.navigate("OnboardingFlow", { screen: "CreateBusinessProfile" });
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "OnboardingFlow",
            params: { screen: "CreateBusinessProfile" } as any,
          },
        ],
      })
    );
  };

  // Switch into the business app area
  const goToBusinessApp = () => {
    const tabNav = navigation.getParent?.();
    const rootNav = tabNav?.getParent?.();
    // App root exposes BusinessNavigator. :contentReference[oaicite:5]{index=5}
    if (rootNav?.navigate) {
      rootNav.navigate("BusinessNavigator");
      return;
    }
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "BusinessNavigator" }] })
    );
  };

  // Single action for the dynamic row
  const onBusinessCta = () => {
    if (!hasBusinessAccount) {
      // No business account: start profile creation flow
      goToCreateBusinessProfile();
      return;
    }
    // Has business account:
    if (!hasBusinessProfile) {
      // Account exists but profile not completed: send to setup
      goToCreateBusinessProfile();
      return;
    }
    // Account + profile exist: go to Business navigator tabs
    goToBusinessApp();
  };

  const businessTitle = !hasBusinessAccount
    ? "Register a business"
    : hasBusinessProfile
    ? "Switch to OTG Business"
    : "Complete business profile";

  const items: Item[] = [
    // Dynamic business row first
    {
      id: "business-cta",
      title: businessTitle,
      icon: BUSINESS_ICON,
      onPress: onBusinessCta,
    },

    {
      id: "invite",
      title: "Invite Friends",
      icon: INVITE_ICON,
      onPress: () => navigation.navigate("Invite"),
    },
    {
      id: "password",
      title: "Change password",
      icon: LOCK_ICON,
      onPress: () => navigation.navigate("ChangePassword"),
    },
    {
      id: "about",
      title: "About on the go",
      icon: INFO_ICON,
      onPress: () => navigation.navigate("About"),
    },
    {
      id: "delete",
      title: "Delete account",
      icon: GEAR_ICON,
      onPress: () => setShowDelete(true),
    },
    {
      id: "logout",
      title: "Log out",
      icon: LOGOUT_ICON,
      onPress: () => setShowLogout(true),
    },
  ];

  return (
    <SafeAreaView style={s.root}>
      {/* Modals */}
      <ConfirmLogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onClose={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />
      <DeleteAccountModal
        visible={showDelete}
        onCancel={() => setShowDelete(false)}
        onClose={() => setShowDelete(false)}
        onDelete={confirmDelete}
      />

      {/* Top bar */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={BACK_ICON} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>More</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* List */}
      <View style={s.list}>
        {items.map((it) => (
          <TouchableOpacity
            key={it.id}
            style={s.row}
            activeOpacity={0.85}
            onPress={it.onPress}
          >
            <View style={s.iconWrap}>
              <Image source={it.icon} style={s.icon} />
            </View>
            <Text style={s.rowText}>{it.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* styles */
const BORDER = "#E6ECF5";
const BG_CARD = "#F3F7FD";
const TEXT = "#0A1220";
const SUB = "#6B7C97";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },

  list: { padding: 16, gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: BG_CARD,
    borderWidth: 1,
    borderColor: "#E7EEF8",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: { width: 18, height: 18, tintColor: SUB, resizeMode: "contain" },
  rowText: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },
});
