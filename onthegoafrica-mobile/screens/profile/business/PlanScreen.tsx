// screens/profile/PlanScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const I = {
  back: require("../../../assets/icons/back.png"),
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#62718C";
const BORDER = "#E6EEF9";
const SOFT = "#F7FAFF";
const GRAY = "#A8B3C6";

type PlanKey = "basic" | "premium";

export default function PlanScreen() {
  const navigation = useNavigation<any>();

  // Wire this to your store or API
  const [currentPlan, setCurrentPlan] = useState<PlanKey>("basic");

  const plans = useMemo(
    () => [
      {
        key: "basic" as PlanKey,
        title: "Basic",
        priceTop: "Free",
        features: ["Basic analytics", "Send broadcast message to all followers"],
      },
      {
        key: "premium" as PlanKey,
        title: "Premium",
        priceTop: "₦1500",
        priceSub: "/month",
        features: [
          "Detailed analytics e.g see repeating costumers, What they buy e.t.c",
          "Send broadcast message to all followers",
          "Send message to followers individually",
        ],
      },
    ],
    []
  );

  const upgrade = () => {
    // TODO: call subscribe/upgrade API
    setCurrentPlan("premium");
    Alert.alert("Upgraded", "You are now on Premium.");
  };

  const cancel = () => {
    // TODO: call cancel API
    setCurrentPlan("basic");
    Alert.alert("Cancelled", "Premium cancelled. You are back on Basic.");
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={I.back} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Basic */}
        <PlanCard
          title={plans[0].title}
          headerColor="#C9D3E6"
          outlineColor="#E4ECF7"
          priceTop={plans[0].priceTop}
          features={plans[0].features}
          current={currentPlan === "basic"}
        />

        {/* Premium */}
        <PlanCard
          title={plans[1].title}
          headerColor={BLUE}
          outlineColor="#CBDDFF"
          priceTop={plans[1].priceTop}
          priceSub={plans[1].priceSub}
          features={plans[1].features}
          current={currentPlan === "premium"}
          style={{ marginTop: 16 }}
        />

        <View style={{ height: 28 }} />

        {currentPlan === "basic" ? (
          <TouchableOpacity activeOpacity={0.9} onPress={upgrade} style={s.ctaPrimary}>
            <Text style={s.ctaPrimaryText}>⚡  Upgrade to premium</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.9} onPress={cancel} style={s.ctaGhost}>
            <Text style={s.ctaGhostText}>Cancel subscription</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({
  title,
  headerColor,
  outlineColor,
  priceTop,
  priceSub,
  features,
  current,
  style,
}: {
  title: string;
  headerColor: string;
  outlineColor: string;
  priceTop: string;
  priceSub?: string;
  features: string[];
  current?: boolean;
  style?: any;
}) {
  return (
    <View style={[s.card, { borderColor: outlineColor }, style]}>
      <View style={[s.pill, { backgroundColor: headerColor }]}>
        <Text style={[s.pillText, headerColor === BLUE ? s.pillTextLight : s.pillTextDark]}>{title}</Text>
        {current && (
          <View style={[s.badge, headerColor === BLUE ? s.badgeOnBlue : s.badgeOnGray]}>
            <Text style={[s.badgeText, headerColor === BLUE ? s.badgeTextOnBlue : s.badgeTextOnGray]}>
              Current plan
            </Text>
          </View>
        )}
      </View>

      <Text style={s.priceTop}>{priceTop}{priceSub ? <Text style={s.priceSub}>{priceSub}</Text> : null}</Text>

      <Text style={s.includeTitle}>What&apos;s included:</Text>
      {features.map((f, i) => (
        <View key={i} style={s.row}>
          <Text style={s.bullet}>•</Text>
          <Text style={s.feature}>{f}</Text>
        </View>
      ))}
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

  card: {
    backgroundColor: SOFT,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },

  pill: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillText: { fontWeight: "700", fontSize: 15 },
  pillTextLight: { color: "#FFFFFF" },
  pillTextDark: { color: "#3A4A66" },

  badge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  badgeOnBlue: { backgroundColor: "#1C56FF", borderColor: "#7EA5FF" },
  badgeOnGray: { backgroundColor: "#D2DBE9", borderColor: "#C3CDDC" },
  badgeText: { fontSize: 12, fontWeight: "700" },
  badgeTextOnBlue: { color: "#FFFFFF" },
  badgeTextOnGray: { color: "#415270" },

  priceTop: { color: TEXT, fontSize: 20, fontWeight: "700", marginTop: 12 },
  priceSub: { color: MUTED, fontSize: 14, fontWeight: "600" },

  includeTitle: { color: MUTED, fontWeight: "700", marginTop: 12, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  bullet: { color: TEXT, marginRight: 8, fontSize: 18, lineHeight: 20 },
  feature: { color: "#1F2A44", flex: 1 },

  ctaPrimary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPrimaryText: { color: "#fff", fontWeight: "700" },
  ctaGhost: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#D7E3F6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  ctaGhostText: { color: TEXT, fontWeight: "700" },
});
