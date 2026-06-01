// screens/wifi/WifiTransactionsScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";

type WifiTxn = {
  id: string;
  planName: string;
  ssid: string;
  password: string;
  priceKobo: number; // store minor units
  purchasedAt: string; // ISO
  expiresAt: string;   // ISO
  speedMbps?: number;
  dataCapGB?: number | "unlimited";
  autoRenew?: boolean;
  location?: string;
  ref?: string; // transaction reference
};

const NOW = new Date();

const SAMPLE: WifiTxn[] = [
  {
    id: "t_001",
    planName: "Daily Flex 2GB",
    ssid: "WorkCafe-Lagos",
    password: "9aX4-2LmQ",
    priceKobo: 80000, // ₦800
    purchasedAt: "2025-09-20T10:21:00+01:00",
    expiresAt: "2025-09-21T10:21:00+01:00",
    speedMbps: 30,
    dataCapGB: 2,
    autoRenew: false,
    location: "Victoria Island",
    ref: "RC-28931",
  },
  {
    id: "t_002",
    planName: "Weekly Pro 15GB",
    ssid: "DevHub-NG",
    password: "pW7*Xr01",
    priceKobo: 450000, // ₦4,500
    purchasedAt: "2025-09-15T09:00:00+01:00",
    expiresAt: "2025-09-22T09:00:00+01:00",
    speedMbps: 50,
    dataCapGB: 15,
    autoRenew: true,
    location: "Yaba",
    ref: "RC-28911",
  },
  {
    id: "t_003",
    planName: "Hourly Pass",
    ssid: "CafeOne",
    password: "HOUR-1-OK",
    priceKobo: 30000, // ₦300
    purchasedAt: "2025-08-10T14:05:00+01:00",
    expiresAt: "2025-08-10T15:05:00+01:00",
    speedMbps: 20,
    dataCapGB: "unlimited",
    autoRenew: false,
    location: "Ikeja",
    ref: "RC-27007",
  },
];

export default function WifiTransactionsScreen() {
  const [items, setItems] = useState<WifiTxn[]>(SAMPLE);
  const [tab, setTab] = useState<"active" | "expired" | "all">("active");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const list = items.slice().sort((a, b) => +new Date(b.purchasedAt) - +new Date(a.purchasedAt));
    if (tab === "all") return list;
    if (tab === "active") return list.filter((t) => +new Date(t.expiresAt) > +NOW);
    return list.filter((t) => +new Date(t.expiresAt) <= +NOW);
  }, [items, tab]);

  const totalSpent = useMemo(
    () => items.reduce((s, t) => s + t.priceKobo, 0),
    [items]
  );

  const toggleReveal = (id: string) =>
    setRevealed((r) => ({ ...r, [id]: !r[id] }));

  const copyPassword = async (t: WifiTxn) => {
    await Clipboard.setStringAsync(t.password);
    Alert.alert("Copied", "Password copied to clipboard.");
  };

  const shareTxn = async (t: WifiTxn) => {
    await Share.share({
      message:
        `Wi-Fi Access\nPlan: ${t.planName}\nSSID: ${t.ssid}\nPassword: ${t.password}\nPrice: ${naira(t.priceKobo)}\nExpires: ${fmtDate(t.expiresAt)}\nRef: ${t.ref}`,
    });
  };

  const renewTxn = (t: WifiTxn) => {
    // Stub: integrate payment flow here.
    Alert.alert("Renew", `Renewing ${t.planName} for ${naira(t.priceKobo)}.`);
  };

  const viewReceipt = (t: WifiTxn) => {
    // Stub: navigate to Receipt screen or open URL.
    Alert.alert("Receipt", `Reference: ${t.ref}`);
  };

  return (
    <SafeAreaView style={s.root}>
      <Header totalKobo={totalSpent} count={items.length} />

      <Tabs value={tab} onChange={setTab} />

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 28 }}
        renderItem={({ item }) => {
          const expired = +new Date(item.expiresAt) <= +NOW;
          const show = !!revealed[item.id];
          return (
            <View style={s.card}>
              <View style={s.rowBetween}>
                <Text style={s.plan}>{item.planName}</Text>
                <StatusBadge expired={expired} />
              </View>

              <View style={s.metaRow}>
                <KV label="SSID" value={item.ssid} />
                <KV
                  label="Password"
                  value={show ? item.password : mask(item.password)}
                  action={
                    <View style={s.inlineActions}>
                      <TouchableOpacity onPress={() => toggleReveal(item.id)} style={s.linkBtn}>
                        <Text style={s.link}>{show ? "Hide" : "Reveal"}</Text>
                      </TouchableOpacity>
                      <Dot />
                      <TouchableOpacity onPress={() => copyPassword(item)} style={s.linkBtn}>
                        <Text style={s.link}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
                <KV label="Price" value={naira(item.priceKobo)} />
                <KV label="Purchased" value={fmtDate(item.purchasedAt)} />
                <KV label="Expires" value={fmtDate(item.expiresAt)} />
                {item.speedMbps ? <KV label="Speed" value={`${item.speedMbps} Mbps`} /> : null}
                {item.dataCapGB ? (
                  <KV
                    label="Data"
                    value={
                      item.dataCapGB === "unlimited" ? "Unlimited" : `${item.dataCapGB} GB`
                    }
                  />
                ) : null}
                {item.location ? <KV label="Location" value={item.location} /> : null}
                <KV label="Auto-renew" value={item.autoRenew ? "On" : "Off"} />
                <KV label="Ref" value={item.ref} />
              </View>

              <View style={s.actionsRow}>
                <Action onPress={() => shareTxn(item)} label="Share" />
                <Action onPress={() => renewTxn(item)} label="Renew" />
                <Action onPress={() => viewReceipt(item)} label="Receipt" />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No transactions</Text>
            <Text style={s.emptyHint}>Buy a plan to see it here.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* UI bits */

function Header({ totalKobo, count }: { totalKobo: number; count: number }) {
  return (
    <LinearGradient colors={["#0F172A", "#1E293B"]} style={s.header}>
      <Text style={s.hTitle}>Wi-Fi Transactions</Text>
      <View style={s.hRow}>
        <View style={s.hCard}>
          <Text style={s.hLabel}>Total spent</Text>
          <Text style={s.hValue}>{naira(totalKobo)}</Text>
        </View>
        <View style={s.hCard}>
          <Text style={s.hLabel}>Count</Text>
          <Text style={s.hValue}>{count}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function Tabs({
  value,
  onChange,
}: {
  value: "active" | "expired" | "all";
  onChange: (v: "active" | "expired" | "all") => void;
}) {
  const opts: Array<{
    key: "active" | "expired" | "all";
    label: string;
  }> = [
    { key: "active", label: "Active" },
    { key: "expired", label: "Expired" },
    { key: "all", label: "All" },
  ];
  return (
    <View style={s.tabs}>
      {opts.map((o) => {
        const active = value === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[s.tab, active && s.tabActive]}
            activeOpacity={0.9}
          >
            <Text style={[s.tabText, active && s.tabTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function StatusBadge({ expired }: { expired: boolean }) {
  return (
    <View style={[s.badge, expired ? s.badgeRed : s.badgeGreen]}>
      <Text style={[s.badgeText, { color: expired ? "#991B1B" : "#065F46" }]}>
        {expired ? "Expired" : "Active"}
      </Text>
    </View>
  );
}

function KV({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={s.kvRow}>
      <Text style={s.kvLabel}>{label}</Text>
      <View style={s.kvValueWrap}>
        <Text style={s.kvValue} numberOfLines={1}>
          {value}
        </Text>
        {action}
      </View>
    </View>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.actionBtn} activeOpacity={0.9}>
      <Text style={s.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Dot() {
  return <View style={s.dot} />;
}

/* helpers */

function naira(kobo: number) {
  const n = kobo / 100;
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mask(s: string) {
  if (s.length <= 2) return "••";
  const last = s.slice(-2);
  return "•".repeat(s.length - 2) + last;
}

/* styles */

const BG = "#FFFFFF";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E6ECF5";
const BLUE = "#0145FE";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 18 },
  hTitle: { color: "#E5EDFF", fontSize: 18, fontFamily: "RCB-Bold", marginBottom: 10 },
  hRow: { flexDirection: "row", gap: 12 },
  hCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  hLabel: { color: "#9FB7FF", fontFamily: "RCB-Medium", fontSize: 12 },
  hValue: { color: "#F8FAFF", fontFamily: "RCB-Bold", fontSize: 18, marginTop: 4 },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: "#F8FAFF",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E6ECFF66",
  },
  tabActive: {
    backgroundColor: "#E6ECFF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  tabText: { color: BLUE, fontFamily: "RCB-SemiBold", fontSize: 13 },
  tabTextActive: { color: "#0A1220" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  plan: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 16 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeGreen: { backgroundColor: "#D1FAE5" },
  badgeRed: { backgroundColor: "#FEE2E2" },
  badgeText: { fontFamily: "RCB-SemiBold", fontSize: 12 },

  metaRow: { marginTop: 10, gap: 8 },
  kvRow: { flexDirection: "row", alignItems: "center" },
  kvLabel: { width: 100, color: MUTED, fontFamily: "RCB-Medium", fontSize: 13 },
  kvValueWrap: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kvValue: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 14 },

  inlineActions: { flexDirection: "row", alignItems: "center" },
  linkBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  link: { color: BLUE, fontFamily: "RCB-SemiBold", fontSize: 13 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#CBD5E1", marginHorizontal: 6 },

  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5FF",
    borderWidth: 1,
    borderColor: "#D8E0FF",
  },
  actionText: { color: "#1F2A56", fontFamily: "RCB-SemiBold", fontSize: 13 },

  empty: { alignItems: "center", marginTop: 48 },
  emptyTitle: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 16 },
  emptyHint: { color: MUTED, fontFamily: "RCB-Regular", fontSize: 13, marginTop: 6 },
});
