// screens/profile/InviteFriendsShareScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

const BACK_ICON = require("../../assets/icons/back.png");
const SHARE_ICON = require("../../assets/icons/share.png");
const LINK_ICON = require("../../assets/icons/link.png");
const SMS_ICON = require("../../assets/icons/chat.png");
const MAIL_ICON = require("../../assets/icons/chat.png");

const APP_LINK = Platform.select({
  ios: "https://apps.apple.com/app/id0000000000",        // replace with real App Store link
  android: "https://play.google.com/store/apps/details?id=com.otg.app", // replace with real Play link
  default: "https://onthego.africa/app",
}) as string;

const REF_CODE = "OTG-7X9K2"; // replace with user’s referral code if available

export default function InviteFriendsShareScreen({ navigation }: any) {
  const message = `I'm using OnTheGo Africa to find great spots. Join me:\n${APP_LINK}\nUse my code: ${REF_CODE}`;

  const onShare = async () => {
    try {
      await Share.share(
        Platform.select({
          ios: { message, url: APP_LINK },
          android: { message },
          default: { message },
        }) as any
      );
    } catch {
      Alert.alert("Share failed", "Could not open the share sheet.");
    }
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(APP_LINK);
    Alert.alert("Copied", "Download link copied to clipboard.");
  };

  const shareSMS = () => {
    const url = `sms:&body=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open Messages."));
  };

  const shareEmail = () => {
    const subject = "Try OnTheGo Africa";
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open Mail."));
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Top bar */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={BACK_ICON} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Invite Friends</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.body}>
        <View style={s.card}>
          <Text style={s.h1}>Share the app</Text>
          <Text style={s.sub}>Invite your friends on iOS or Android.</Text>

          <TouchableOpacity style={s.primary} onPress={onShare} activeOpacity={0.9}>
            <Image source={SHARE_ICON} style={s.btnIcon} />
            <Text style={s.primaryTxt}>Share invite</Text>
          </TouchableOpacity>

          <View style={s.row}>
            <ActionButton icon={SMS_ICON} label="Text" onPress={shareSMS} />
              <ActionButton icon={LINK_ICON} label="Copy link" onPress={copyLink} />
          </View>

          <View style={s.refBox}>
            <Text style={s.refLabel}>Your code</Text>
            <Text style={s.refCode}>{REF_CODE}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ActionButton({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.action} onPress={onPress} activeOpacity={0.9}>
      <Image source={icon} style={s.actionIcon} />
      <Text style={s.actionTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

/* styles */
const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const SUB = "#6B7C97";
const CARD = "#F7FAFF";
const BORDER = "#E6ECF5";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },

  body: { flex: 1, padding: 16 },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7EEF8",
    padding: 16,
  },
  h1: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 22 },
  sub: { color: SUB, marginTop: 6, marginBottom: 16, fontFamily: "RCB-Medium" },

  primary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnIcon: { width: 18, height: 18, tintColor: "#fff" },
  primaryTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  action: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionIcon: { width: 18, height: 18, tintColor: SUB, marginBottom: 6 },
  actionTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },

  refBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  refLabel: { color: SUB, fontFamily: "RCB-Medium" },
  refCode: { marginTop: 4, color: TEXT, fontFamily: "RCB-Bold", fontSize: 18, letterSpacing: 1 },
});
