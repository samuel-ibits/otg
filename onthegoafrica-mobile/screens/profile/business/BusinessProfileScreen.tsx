// screens/profile/BusinessProfileScreen.tsx
import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type Row = {
  id: keyof typeof ROUTES;
  title: string;
  icon: any; // local image
};

const I = {
  back: require("../../../assets/icons/back.png"),
  chevron: require("../../../assets/icons/chev-right.png"),
  doc: require("../../../assets/icons/Case.png"),
  verify: require("../../../assets/icons/shield-check.png"),
  crown: require("../../../assets/icons/crown.png"),
  clock: require("../../../assets/icons/clock.png"),
  chat: require("../../../assets/icons/message-circle.png"),
  wifi: require("../../../assets/icons/wifi.png"),
  gift: require("../../../assets/icons/gift.png"),
  hourglass: require("../../../assets/icons/hourglass.png"),
};

/**
 * Map each row id to a React Navigation route.
 * Adjust the route names to match your navigator.
 */
const ROUTES = {
  pd: "PersonalDetails",           // e.g. stack screen name
  bv: "BusinessVerification",
  pl: "PlanScreen",
  oc: "OpeningHours",
  sc: "Socials",
  wf: "WifiDetails",
  rv: "RewardVoucherSetup",
} as const;

export default function BusinessProfileScreen() {
  const navigation = useNavigation<any>();

  const rows: (Row & { trailing?: "awaiting" | "free" | null })[] = useMemo(
    () => [
      { id: "pd", title: "Personal Details", icon: I.doc },
      { id: "bv", title: "Business Verification", icon: I.verify, trailing: "awaiting" },
      { id: "pl", title: "Plan", icon: I.crown, trailing: "free" },
      { id: "oc", title: "Opening and closing time", icon: I.clock },
      { id: "sc", title: "Socials", icon: I.chat },
      { id: "wf", title: "WiFi Details", icon: I.wifi },
      { id: "rv", title: "Reward voucher setup", icon: I.gift },
    ],
    []
  );

  const onBack = () => navigation.goBack();

  const open = (id: Row["id"]) => {
    const route = ROUTES[id];
    if (!route) return;
    navigation.navigate(route);
  };

  const renderItem = ({ item }: { item: Row & { trailing?: "awaiting" | "free" | null } }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => open(item.id)}
      style={styles.rowWrap}
    >
      <View style={styles.rowInner}>
        <View style={styles.leftPack}>
          <View style={styles.iconPill}>
            <Image source={item.icon} style={styles.icon} resizeMode="contain" />
          </View>
          <Text style={styles.rowTitle}>{item.title}</Text>
        </View>

        <View style={styles.rightPack}>
          {item.trailing === "awaiting" && (
            <View style={[styles.badge, styles.badgeAwait]}>
              <Image source={I.hourglass} style={styles.badgeIcon} />
              <Text style={[styles.badgeText, styles.badgeAwaitText]}>Awaiting</Text>
            </View>
          )}
          {item.trailing === "free" && (
            <View style={[styles.badge, styles.badgeFree]}>
              <Text style={[styles.badgeText, styles.badgeFreeText]}>Free</Text>
            </View>
          )}
          <Image source={I.chevron} style={styles.chev} resizeMode="contain" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={I.back} style={styles.back} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.title}>Business Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const BORDER = "#E9EFF7";
const BG_SOFT = "#F7FAFF";
const TEXT_DARK = "#0A1220";
const TEXT_MUTED = "#62718C";
const BLUE = "#0145FE";
const AWAIT_BG = "#FFF4D6";
const AWAIT_TXT = "#9A6B00";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EDF2FA",
  },
  back: { width: 24, height: 24, tintColor: TEXT_DARK },
  title: { flex: 1, textAlign: "center", color: TEXT_DARK, fontSize: 18, fontWeight: "700" },

  rowWrap: {
    backgroundColor: BG_SOFT,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  leftPack: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E3ECFF",
  },
  icon: { width: 18, height: 18, tintColor: TEXT_MUTED },
  rowTitle: { marginLeft: 12, color: TEXT_DARK, fontSize: 15, fontWeight: "700", flexShrink: 1 },

  rightPack: { flexDirection: "row", alignItems: "center" },
  chev: { width: 18, height: 18, tintColor: "#B5C2D6", marginLeft: 10 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 6,
  },
  badgeIcon: { width: 13, height: 13, tintColor: AWAIT_TXT, marginRight: 6 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  badgeAwait: { backgroundColor: AWAIT_BG, borderColor: "#FFE6A6" },
  badgeAwaitText: { color: AWAIT_TXT },
  badgeFree: { backgroundColor: "#EAF1FF", borderColor: "#CBDDFF" },
  badgeFreeText: { color: BLUE },
});
