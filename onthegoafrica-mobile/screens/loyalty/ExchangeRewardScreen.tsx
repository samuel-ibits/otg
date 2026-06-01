// screens/loyalty/ExchangeRewardScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import ExchangeRequestConfirmModal from "./../../component/ExchangeRequestConfirmModal"; // Fixed import path

const CLOSE = require("../../assets/icons/close.png"); // if missing, we render a fallback "×"
const SEARCH = require("../../assets/icons/search.png"); // optional
const BRAND = require("../../assets/icons/cafe.jpeg");  // replace with your brand/logo

type Reward = {
  id: string;
  percent: number;
  brand: string;
  validDays: string;
};

const SELECTED: Reward = {
  id: "my-1",
  percent: 10,
  brand: "Cafe One Chevron",
  validDays: "Mondays, Wednesdays, Fridays",
};

const CANDIDATES: Reward[] = [
  { id: "r1", percent: 10, brand: "Hayes - Block", validDays: "Mondays, Wednesdays, Fridays" },
  { id: "r2", percent: 10, brand: "Nolan and Sons", validDays: "Mondays, Wednesdays, Fridays" },
  { id: "r3", percent: 10, brand: "Becker - Littel", validDays: "Mondays, Wednesdays, Fridays" },
  { id: "r4", percent: 10, brand: "Hudson Group", validDays: "Weekdays only" },
  { id: "r5", percent: 10, brand: "Queen's Place", validDays: "Daily" },
];

export default function ExchangeRewardScreen({ navigation, route }: any) {
  const mine: Reward = route?.params?.voucher ?? SELECTED;

  const [q, setQ] = useState("");
  const list = useMemo(
    () => CANDIDATES.filter((r) => r.brand.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  // modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<Reward | null>(null);

  const requestExchange = (target: Reward) => {
    console.log("requestExchange called with:", target); // Debug log
    setPendingTarget(target);
    setConfirmOpen(true);
  };

  const confirmRequest = (r: Reward) => {
    console.log("confirmRequest called with:", r); // Debug log
    setConfirmOpen(false);
    setPendingTarget(null); // Reset pending target
    
    // TODO: replace with API call
    console.log("Exchange requested:", mine.id, "→", r.id);
    
    // Navigate to success screen
    navigation.navigate("SuccessExchange");
  };

  const handleCancel = () => {
    console.log("handleCancel called"); // Debug log
    setConfirmOpen(false);
    setPendingTarget(null); // Reset pending target
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Confirm exchange modal - Only render when we have a pending target */}
      {pendingTarget && (
        <ExchangeRequestConfirmModal
          visible={confirmOpen}
          reward={pendingTarget}
          onCancel={handleCancel}
          onConfirm={confirmRequest}
        />
      )}

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Exchange reward</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={s.closeButton}
        >
          {Image.resolveAssetSource(CLOSE)?.uri ? (
            <Image source={CLOSE} style={s.closeIcon} />
          ) : (
            <Text style={s.closeTxt}>×</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={s.sectionH}>Exchange reward</Text>
            <RewardCard reward={mine} highlight />

            {/* Search */}
            <View style={s.searchBox}>
              {Image.resolveAssetSource(SEARCH)?.uri ? (
                <Image source={SEARCH} style={s.searchIcon} />
              ) : (
                <Text style={s.searchFallback}>⌕</Text>
              )}
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search"
                placeholderTextColor="#8CA0BE"
                style={s.searchInput}
              />
            </View>

            <Text style={[s.sectionH, { marginTop: 10 }]}>Available rewards up for exchange</Text>
          </View>
        }
        data={list}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <RewardCard
            reward={item}
            actionLabel="Request exchange"
            onAction={() => requestExchange(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* a single reward voucher row */
function RewardCard({
  reward,
  actionLabel,
  onAction,
  highlight,
}: {
  reward: Reward;
  actionLabel?: string;
  onAction?: () => void;
  highlight?: boolean;
}) {
  return (
    <View style={[s.card, highlight && s.cardHighlight]}>
      <View style={s.cardTop}>
        <Text style={s.percent}>{reward.percent}% OFF</Text>
        {actionLabel && onAction ? (
          <TouchableOpacity onPress={onAction} style={s.reqBtn} activeOpacity={0.9}>
            <Text style={s.reqTxt}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={s.brandRow}>
        <View style={s.brandInner}>
          <Image source={BRAND} style={s.brandImg} />
          <Text style={s.brandName} numberOfLines={1}>
            {reward.brand}
          </Text>
        </View>
      </View>

      <View style={s.dash} />
      <Text style={s.valid}>Validity - {reward.validDays}</Text>
    </View>
  );
}

/* styles */
const TEXT = "#0A1220";
const BLUE = "#0A59FF";
const SUB = "#6B7C97";
const BORDER = "#D6E1FF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7EAF3",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 52,
  },
  closeIcon: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  closeTxt: { fontSize: 24, color: TEXT, fontWeight: "300" },

  sectionH: { color: TEXT, fontSize: 14, fontWeight: "700", marginTop: 14, marginBottom: 8 },

  card: {
    backgroundColor: "#F3F6FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  cardHighlight: { backgroundColor: "#EAF1FF" },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  percent: { color: BLUE, fontSize: 20, fontWeight: "900", letterSpacing: 0.2 },

  reqBtn: {
    height: 30,
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: "#0E1730",
    alignItems: "center",
    justifyContent: "center",
  },
  reqTxt: { color: "#fff", fontWeight: "700", fontSize: 12 },

  brandRow: {
    marginTop: 12,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFD0FF",
    backgroundColor: "#EAF0FF",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  brandInner: { flexDirection: "row", alignItems: "center" },
  brandImg: { width: 22, height: 22, borderRadius: 11, marginRight: 8 },
  brandName: { color: TEXT, fontWeight: "600", fontSize: 15 },

  dash: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#BFD0FF",
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 1,
  },
  valid: { color: SUB, fontWeight: "600" },

  searchBox: {
    marginTop: 10,
    marginBottom: 10,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#DFE7F3",
    backgroundColor: "#F4F7FC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchIcon: { width: 18, height: 18, tintColor: SUB, marginRight: 8, resizeMode: "contain" },
  searchFallback: { marginRight: 8, color: SUB, fontSize: 16 },
  searchInput: { flex: 1, color: TEXT, fontWeight: "600" },
});