// screens/registration/business/BusinessWifiScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const I = {
  back: require("../../../assets/icons/back.png"),
  edit: require("../../../assets/icons/edit.png"),
  router: require("../../../assets/icons/router.png"),
  pen: require("../../../assets/icons/pen.png"),
  gear: require("../../../assets/icons/gear.png"),
  chevronR: require("../../../assets/icons/chev-right.png"),
  info: require("../../../assets/icons/Info.png"),
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#62718C";
const BORDER = "#E7EFFA";
const SOFT = "#F5F8FF";
const DANGER_BG = "#FEECEC";
const DANGER_TXT = "#B71C1C";

type WifiSummary = { routerType: string; usersRange: string; isp: string };
type RouterConfig = { name: string };

export default function BusinessWifiScreen() {
  const navigation = useNavigation<any>();

  const [summary] = useState<WifiSummary>({
    routerType: "Ubiquiti UniFi U6-Lite",
    usersRange: "10–20 users",
    isp: "Spectranet",
  });

  const [router, setRouter] = useState<RouterConfig | null>(null);

  const goBack = () => navigation.goBack();
  const onEditSummary = () => Alert.alert("Edit", "Hook this to your edit flow.");

  const onAddRouter = () => {
    setRouter({ name: "AVS Mikrotik Router" });
    Alert.alert("Router added");
  };

  // NAVIGATION FIXES
  const onEditConfig = () => navigation.navigate("WifiConfig");        // <-- make sure this route exists
  const onManageTicket = () => navigation.navigate("Ticket");    // <-- make sure this route exists
  const onLearn = () => Alert.alert("Learn", "Open a help article or webview.");

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={I.back} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>WiFi Details</Text>
        <TouchableOpacity onPress={onEditSummary} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.editTxt}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={s.gridRow}>
          <InfoCell label="Type of Router" value={summary.routerType} onPress={onEditSummary} />
        </View>
        <View style={[s.gridRow, { marginTop: 10 }]}>
          <InfoCell label="Number of Users" value={summary.usersRange} half onPress={onEditSummary} />
          <View style={{ width: 12 }} />
          <InfoCell label="ISP" value={summary.isp} half onPress={onEditSummary} />
        </View>

        {!router ? (
          <TouchableOpacity activeOpacity={0.9} onPress={onAddRouter} style={s.addWrap}>
            <Text style={s.addPlus}>＋</Text>
            <Text style={s.addTitle}>Add Router</Text>
            <Text style={s.addSub}>No router added yet</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.routerCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={s.routerIconWrap}>
                <Image source={I.router} style={s.routerIcon} />
              </View>
              <Text style={s.routerName}>{router.name}</Text>
            </View>

            <View style={s.routerActions}>
              <TouchableOpacity style={s.actionBtn} onPress={onEditConfig} activeOpacity={0.9}>
                <Image source={I.pen} style={s.actionIcon} />
                <Text style={s.actionTxt}>Edit configuration</Text>
              </TouchableOpacity>

              <View style={s.divider} />

              <TouchableOpacity style={s.actionBtn} onPress={onManageTicket} activeOpacity={0.9}>
                <Image source={I.gear} style={s.actionIcon} />
                <Text style={s.actionTxt}>Manage ticket profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity onPress={onLearn} activeOpacity={0.9} style={s.helpCard}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image source={I.info} style={s.helpIcon} />
            <Text style={s.helpTxt}>Learn how to set up your router</Text>
          </View>
          <Image source={I.chevronR} style={s.chev} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCell({
  label,
  value,
  half,
  onPress,
}: {
  label: string;
  value: string;
  half?: boolean;
  onPress?: () => void;
}) {
  return (
    <View style={[s.cell, half && { flex: 1 }]}>
      <Text style={s.cellLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={s.cellValue}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  back: { width: 24, height: 24, tintColor: TEXT },
  title: { flex: 1, textAlign: "center", color: TEXT, fontSize: 18, fontWeight: "700" },
  editTxt: { color: BLUE, fontWeight: "700" },

  gridRow: { flexDirection: "row" },

  cell: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    flexGrow: 1,
  },
  cellLabel: { color: MUTED, fontWeight: "700" },
  cellValue: { color: BLUE, fontWeight: "700", marginTop: 6 },

  addWrap: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#DBE7FB",
    borderStyle: "dashed",
    backgroundColor: SOFT,
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addPlus: { fontSize: 26, color: "#0F172A" },
  addTitle: { marginTop: 6, color: "#0F172A", fontWeight: "700" },
  addSub: { marginTop: 2, color: "#9BA9C1" },

  routerCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
  },
  routerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF5FF",
    borderWidth: 1,
    borderColor: "#DCEAFF",
    alignItems: "center",
    justifyContent: "center",
  },
  routerIcon: { width: 18, height: 18, tintColor: "#5B6B88" },
  routerName: { marginLeft: 10, color: TEXT, fontWeight: "700" },

  routerActions: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  actionIcon: { width: 16, height: 16, tintColor: "#7283A3", marginRight: 8 },
  actionTxt: { color: "#1E293B", fontWeight: "700" },
  divider: { width: 1, height: 16, backgroundColor: "#E6EDF7" },

  helpCard: {
    marginTop: 18,
    backgroundColor: DANGER_BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FAD2D2",
  },
  helpIcon: { width: 16, height: 16, tintColor: DANGER_TXT, marginRight: 10 },
  helpTxt: { color: DANGER_TXT, fontWeight: "700", flex: 1 },
  chev: { width: 16, height: 16, tintColor: DANGER_TXT },
});
