// components/modals/NearbyWifiModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";

export type WifiNetwork = {
  ssid: string;
  bssid?: string;
  signalLevel?: number; // optional RSSI or signal strength
  secure?: boolean; // true if locked
  frequency?: number;
  // anything else your scanner returns
};

type Props = {
  visible: boolean;
  onClose: () => void;
  networks?: WifiNetwork[]; // pass pre-scanned list if you already have it
  onRefresh?: () => Promise<WifiNetwork[]>; // optional scan function; if provided modal will call it
  onConnect?: (network: WifiNetwork) => void; // called when user taps Connect
  showConnectButton?: boolean; // default true
  title?: string;
};

export default function NearbyWifiModal({
  visible,
  onClose,
  networks = [],
  onRefresh,
  onConnect,
  showConnectButton = true,
  title = "Nearby Wi-Fi",
}: Props) {
  const [list, setList] = useState<WifiNetwork[]>(networks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setList(networks);
  }, [networks]);

  useEffect(() => {
    if (!visible) {
      setError(null);
      setLoading(false);
    }
  }, [visible]);

  async function doRefresh() {
    if (!onRefresh) {
      setError("No scanner available. Provide an onRefresh prop.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await onRefresh();
      setList(res ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  function renderItem({ item }: { item: WifiNetwork }) {
    return (
      <View style={s.row}>
        <View style={s.left}>
          <Text style={s.ssid} numberOfLines={1}>
            {item.ssid || "<hidden ssid>"}
          </Text>
          <Text style={s.meta}>
            {item.bssid ? item.bssid : ""}{" "}
            {item.frequency ? `• ${item.frequency}MHz` : ""}{" "}
            {typeof item.signalLevel === "number" ? `• ${item.signalLevel}dBm` : ""}
          </Text>
        </View>

        <View style={s.right}>
          <Text style={[s.lock, item.secure ? s.locked : s.unlocked]}>
            {item.secure ? "Locked" : "Open"}
          </Text>

          {showConnectButton ? (
            <TouchableOpacity
              style={s.connectBtn}
              activeOpacity={0.8}
              onPress={() => onConnect?.(item)}
            >
              <Text style={s.connectText}>Connect</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.headerRow}>
            <Text style={s.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.closeX}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={s.controls}>
            <TouchableOpacity style={s.refreshBtn} onPress={doRefresh} activeOpacity={0.8}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.refreshText}>Scan</Text>}
            </TouchableOpacity>

            <Text style={s.platformHint}>
              {Platform.OS === "ios"
                ? "iOS: scanning limited by system. Use native code or guide user to Settings."
                : "Android: scanning requires location permission and a scanner module."}
            </Text>
          </View>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <FlatList
            data={list}
            keyExtractor={(i) => (i.bssid ?? i.ssid) + Math.random().toString(36).slice(2, 8)}
            renderItem={renderItem}
            style={s.list}
            contentContainerStyle={list.length ? undefined : s.empty}
            ListEmptyComponent={
              loading ? null : (
                <View style={s.empty}>
                  <Text style={s.emptyText}>No networks found.</Text>
                </View>
              )
            }
          />
        </View>
      </View>
    </Modal>
  );
}

/* styles */
const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingBottom: 30,
    paddingHorizontal: 16,
    maxHeight: "80%",
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "600", color: "#0A1220" },
  closeBtn: { position: "absolute", right: 8, top: -2, padding: 6 },
  closeX: { fontSize: 22, color: "#617291" },
  controls: { marginTop: 6, marginBottom: 8, alignItems: "center" },
  refreshBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#0145FE",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshText: { color: "#fff", fontWeight: "600" },
  platformHint: { fontSize: 12, color: "#6C7A92", marginTop: 8, textAlign: "center" },
  list: { marginTop: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#F7F9FC",
    marginBottom: 8,
  },
  left: { flex: 1, paddingRight: 8 },
  ssid: { fontSize: 15, color: "#0A1220", fontWeight: "600" },
  meta: { fontSize: 12, color: "#6C7A92", marginTop: 4 },
  right: { alignItems: "flex-end" },
  lock: { fontSize: 12, marginBottom: 8, fontWeight: "600" },
  locked: { color: "#B00020" },
  unlocked: { color: "#0E8A47" },
  connectBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#0145FE",
    alignItems: "center",
    justifyContent: "center",
  },
  connectText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  empty: { padding: 28, alignItems: "center" },
  emptyText: { color: "#6C7A92" },
  error: { color: "#B00020", textAlign: "center", marginTop: 8 },
});
