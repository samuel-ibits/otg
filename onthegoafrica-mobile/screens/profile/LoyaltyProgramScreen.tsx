// screens/loyalty/LoyaltyProgramScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BACK_ICON = require("../../assets/icons/back.png");

// ---- mock user data (wire to real data) ----
const USER_NAME = "Jane Doe";
const REVIEWS_COUNT = 51;

export default function LoyaltyProgramScreen({ navigation }: any) {
  const { tier, nextTierAt, discount, floor, ceiling } = useMemo(
    () => getTierInfo(REVIEWS_COUNT),
    []
  );
  const progress = clamp(
    (REVIEWS_COUNT - floor) / Math.max(1, ceiling - floor),
    0,
    1
  );

  const [open, setOpen] = useState<number | null>(1);
  const [showRules, setShowRules] = useState(false);

  return (
    <SafeAreaView style={s.root}>
      {/* Rules modal */}
      <RulesModal visible={showRules} onClose={() => setShowRules(false)} />

      {/* Header on blue bg */}
      <LinearGradient colors={["#0A69FF", "#0664F6", "#0457E8"]} style={s.headerBG}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Image source={BACK_ICON} style={s.back} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>OTG Loyalty Program</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={s.name}>{USER_NAME}</Text>

        {/* rope with medals */}
        <View style={s.rope}>
          <Text style={s.dot}>🥉</Text>
          <Text style={[s.dot, { top: -10 }]}>🥈</Text>
          <Text style={s.dot}>🥇</Text>
        </View>

        {/* Reward card */}
        <View style={s.cardWrap}>
          <LinearGradient colors={["#4A4A4A", "#313131"]} style={s.card}>
            <View>
              <Text style={s.upTo}>Up to</Text>
              <Text style={s.off}>{discount}% OFF</Text>
            </View>

            <TouchableOpacity style={s.rulesRow} onPress={() => setShowRules(true)} activeOpacity={0.85}>
              <Text style={s.rules}>View rules</Text>
              <Text style={s.infoIcon}>ⓘ</Text>
            </TouchableOpacity>

            <Text style={s.cornerMedal}>{tier === "gold" ? "🥇" : tier === "silver" ? "🥈" : "🥉"}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <Text style={s.tierTitle}>{tier.toUpperCase()} USER</Text>
        <Text style={s.meta}>
          Number of reviews - {REVIEWS_COUNT} out of {ceiling}
        </Text>

        {/* Progress */}
        <View style={s.progressWrap}>
          <Text style={s.progressLabel}>{REVIEWS_COUNT}</Text>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={s.progressLabel}>{ceiling}</Text>
        </View>

        {/* FAQs */}
        <View style={s.faqHeader}>
          <View style={s.faqLine} />
          <Text style={s.faqTitle}>FAQs</Text>
          <View style={s.faqLine} />
        </View>

        {FAQ_DATA.map((f, i) => (
          <FAQItem
            key={f.q}
            index={i}
            open={open}
            onToggle={setOpen}
            q={f.q}
          >
            {f.a}
          </FAQItem>
        ))}

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Rules Modal */

function RulesModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={m.overlay}>
        <View style={m.sheet}>
          <TouchableOpacity style={m.close} onPress={onClose} activeOpacity={0.85}>
            <Text style={m.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={m.title}>Loyalty Program Rules</Text>

          <ScrollView style={{ alignSelf: "stretch" }} contentContainerStyle={{ paddingBottom: 12 }}>
            <RuleH>Eligibility</RuleH>
            <RuleP>Posting verified place reviews counts toward your tier. Spam or removed reviews do not count.</RuleP>

            <RuleH>Tiers</RuleH>
            <RuleP>• Bronze: 0–50 reviews → 5% discount</RuleP>
            <RuleP>• Silver: 51–100 reviews → 10% discount</RuleP>
            <RuleP>• Gold: 101+ reviews → 15% discount</RuleP>

            <RuleH>How discounts apply</RuleH>
            <RuleP>Discounts are platform promos redeemable at supported spots. They cannot be combined with other promos unless stated.</RuleP>

            <RuleH>Upgrading and downgrading</RuleH>
            <RuleP>Upgrades happen immediately when you cross a threshold. Extended inactivity may remove benefits until you post again.</RuleP>

            <RuleH>Abuse</RuleH>
            <RuleP>Fake or harmful content voids benefits and may result in account action.</RuleP>
          </ScrollView>

          <TouchableOpacity style={m.primary} onPress={onClose} activeOpacity={0.9}>
            <Text style={m.primaryTxt}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function RuleH({ children }: { children: React.ReactNode }) {
  return <Text style={m.h}>{children}</Text>;
}
function RuleP({ children }: { children: React.ReactNode }) {
  return <Text style={m.p}>{children}</Text>;
}

/* helpers */

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function getTierInfo(count: number) {
  if (count >= 101) {
    return { tier: "gold", discount: 15, floor: 101, ceiling: 150, nextTierAt: null as number | null };
  }
  if (count >= 51) {
    return { tier: "silver", discount: 10, floor: 51, ceiling: 100, nextTierAt: 101 };
  }
  return { tier: "bronze", discount: 5, floor: 0, ceiling: 50, nextTierAt: 51 };
}

/* FAQ */

function FAQItem({
  q,
  children,
  index,
  open,
  onToggle,
}: {
  q: string;
  children: React.ReactNode;
  index: number;
  open: number | null;
  onToggle: (n: number | null) => void;
}) {
  const expanded = open === index;
  return (
    <View style={s.faqItem}>
      <TouchableOpacity style={s.faqRow} onPress={() => onToggle(expanded ? null : index)} activeOpacity={0.85}>
        <Text style={s.faqQ}>{q}</Text>
        <Text style={s.chev}>{expanded ? "▾" : "▸"}</Text>
      </TouchableOpacity>
      {expanded ? <Text style={s.faqA}>{children}</Text> : null}
    </View>
  );
}

const FAQ_DATA = [
  {
    q: "What is the OTG Loyalty Program?",
    a: "A simple tiered program that rewards you for posting verified reviews. Your tier increases as your number of reviews grows.",
  },
  {
    q: "What are the different loyalty levels?",
    a:
      "• Bronze (0–50 reviews): 5% discount\n" +
      "• Silver (51–100 reviews): 10% discount\n" +
      "• Gold (101+ reviews): 15% discount",
  },
  {
    q: "How do I move up a level?",
    a: "Post more quality reviews that meet our community guidelines. Once your total crosses the next threshold you are upgraded automatically.",
  },
  {
    q: "How do I maintain my current tier?",
    a: "Stay active. Inactive accounts may lose tier benefits if no new reviews are posted over a long period.",
  },
  {
    q: "What happens if I get downgraded?",
    a: "Your current discount will reduce to the new tier’s rate. You can regain your previous tier by reaching the threshold again.",
  },
  {
    q: "Where can I see my tier and review count?",
    a: "Right on this page and on your profile header.",
  },
];

/* styles */

const TEXT = "#FFFFFF";
const DARK = "#0A1220";
const SUB = "#CFE0FF";
const PROG_BG = "#DEEAFF";
const PROG_FILL = "#1F50FF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A69FF" },

  headerBG: { paddingBottom: 18 },
  headerRow: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  headerTitle: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },
  name: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 28, textAlign: "center", marginTop: 8 },

  rope: {
    marginTop: 10,
    height: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  dot: { color: "rgba(255,255,255,0.9)", fontSize: 16, top: 6 },

  cardWrap: { paddingHorizontal: 16, marginTop: 8 },
  card: {
    height: 140,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
  },
  upTo: { color: "#E6E6E6", fontFamily: "RCB-Medium" },
  off: { color: "#FFFFFF", fontFamily: "RCB-Black", fontSize: 36, letterSpacing: 0.5 },
  rulesRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  rules: { color: "#E6E6E6", fontFamily: "RCB-SemiBold", textDecorationLine: "underline" },
  infoIcon: { color: "#E6E6E6" },
  cornerMedal: { position: "absolute", right: 10, top: 10, fontSize: 18 },

  body: { backgroundColor: "#0A69FF", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  tierTitle: { color: TEXT, fontFamily: "RCB-Black", fontSize: 22, letterSpacing: 0.3 },
  meta: { color: SUB, fontFamily: "RCB-SemiBold", marginTop: 8, marginBottom: 8 },

  progressWrap: {
    backgroundColor: "#115DF2",
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  progressLabel: { color: TEXT, fontFamily: "RCB-SemiBold" },
  progressBar: { flex: 1, height: 8, borderRadius: 4, backgroundColor: PROG_BG, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: PROG_FILL, borderRadius: 4 },

  faqHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  faqLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: "#8FB4FF" },
  faqTitle: { color: TEXT, fontFamily: "RCB-SemiBold" },

  faqItem: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  faqRow: { flexDirection: "row", alignItems: "center" },
  faqQ: { flex: 1, color: TEXT, fontFamily: "RCB-Bold", fontSize: 16 },
  chev: { color: "#CFE0FF", fontSize: 16, marginLeft: 8 },
  faqA: { color: "#E6F0FF", marginTop: 8, lineHeight: 20, fontFamily: "RCB-Medium" },
});

/* modal styles */
const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  close: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, lineHeight: 22, color: "#657A9A" },
  title: { color: DARK, fontFamily: "RCB-Bold", fontSize: 18, marginTop: 8, marginBottom: 10 },
  h: { color: DARK, fontFamily: "RCB-SemiBold", fontSize: 16, alignSelf: "flex-start", marginTop: 8 },
  p: { color: "#475569", fontFamily: "RCB-Medium", lineHeight: 20, marginTop: 6 },
  primary: {
    marginTop: 14,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A59FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  primaryTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
