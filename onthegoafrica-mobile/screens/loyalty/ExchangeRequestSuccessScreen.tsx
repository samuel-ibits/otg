// screens/loyalty/ExchangeRequestSuccessScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const CLOSE = require("../../assets/icons/close.png"); // optional; falls back to "×"

export default function ExchangeRequestSuccessScreen({ navigation }: any) {
  const goRewards = () => navigation.navigate("Exchange"); // adjust route name if different
  const close = () => navigation.goBack();

  return (
    <SafeAreaView style={s.root}>
      {/* Top bar */}
      <View style={s.header}>
        <TouchableOpacity onPress={close} style={s.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {Image.resolveAssetSource(CLOSE)?.uri ? (
            <Image source={CLOSE} style={s.closeIcon} />
          ) : (
            <Text style={s.closeTxt}>×</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={s.content}>
        <View style={s.ringOuter}>
          <View style={s.ringMid}>
            <View style={s.ringInner}>
              <Text style={s.check}>✓</Text>
            </View>
          </View>
        </View>

        <Text style={s.title}>
          Request sent{"\n"}successfully
        </Text>
        <Text style={s.sub}>
          We have sent your request to the owner{"\n"}of this reward.
        </Text>
      </View>

      {/* CTA */}
      <View style={s.footer}>
        <TouchableOpacity style={s.primary} onPress={goRewards} activeOpacity={0.9}>
          <Text style={s.primaryTxt}>Go back to your rewards</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const TEXT = "#0A1220";
const SUB = "#6B7C97";
const BLUE = "#0A59FF";
const GREEN = "#14B85A";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 52,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EDF1F7",
  },
  closeBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  closeIcon: { width: 20, height: 20, tintColor: TEXT, resizeMode: "contain" },
  closeTxt: { fontSize: 26, color: TEXT, fontWeight: "300" },

  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },

  ringOuter: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "rgba(20,184,90,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  ringMid: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(20,184,90,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { color: "#fff", fontSize: 30, fontWeight: "900" },

  title: { color: TEXT, fontSize: 22, fontWeight: "800", textAlign: "center", lineHeight: 28 },
  sub: { color: SUB, fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 8, lineHeight: 20 },

  footer: { padding: 16 },
  primary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
