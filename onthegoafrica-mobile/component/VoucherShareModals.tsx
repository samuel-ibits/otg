// components/modals/VoucherShareModals.tsx
import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";

type BaseProps = { visible: boolean; onClose: () => void };

// ============== 1) “More options” bottom sheet =================
export function VoucherOptionsModal({
  visible,
  onClose,
  onGift,
  onExchange,
}: BaseProps & { onGift: () => void; onExchange: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <TouchableOpacity style={s.close} onPress={onClose}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>More options</Text>

          <TouchableOpacity style={s.row} onPress={onGift} activeOpacity={0.9}>
            <Image source={require("../assets/icons/gift.png")} style={s.rowIcon} />
            <Text style={s.rowText}>Gift reward voucher</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.row} onPress={onExchange} activeOpacity={0.9}>
            <Image source={require("../assets/icons/swap.png")} style={s.rowIcon} />
            <Text style={s.rowText}>Exchange reward vouchers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ============== 2) “Send to” / Gift modal =================
type Person = { id: string; handle: string; avatar: any };
const MOCK: Person[] = [
  { id: "1", handle: "@Marvin65", avatar: require("../assets/feed/user1.png") },
  { id: "2", handle: "@Erica.Kris", avatar: require("../assets/feed/user1.png") },
  { id: "3", handle: "@Oscar80", avatar: require("../assets/feed/user1.png") },
  { id: "4", handle: "@Joanne_Fahey3", avatar: require("../assets/feed/user1.png") },
  { id: "5", handle: "@Jean61", avatar: require("../assets/feed/user1.png") },
  { id: "6", handle: "@Peggy69", avatar: require("../assets/feed/user1.png") },
  { id: "7", handle: "@Teri.Wunsch", avatar: require("../assets/feed/user1.png") },
  { id: "8", handle: "@Armando67", avatar: require("../assets/feed/user1.png") },
];

export function GiftVoucherModal({
  visible,
  onClose,
  onShareChoice,
}: BaseProps & { onShareChoice?: (kind: "copy" | "whatsapp" | "facebook" | "twitter" | "email" | "reddit") => void }) {
  const [q, setQ] = useState("");
  const people = useMemo(
    () => MOCK.filter((p) => p.handle.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const ShareIcon = ({ src, label, onPress }: { src: any; label: string; onPress: () => void }) => (
    <TouchableOpacity style={s.shareItem} onPress={onPress}>
      <Image source={src} style={s.shareIcon} />
      <Text style={s.shareLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, { paddingBottom: 8 }]}>
          <TouchableOpacity style={s.close} onPress={onClose}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>Send to</Text>

          {/* Search */}
          <View style={s.search}>
            <Image source={require("../assets/icons/search.png")} style={s.searchIcon} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search"
              placeholderTextColor="#9AA8BD"
              style={s.searchInput}
            />
          </View>

          {/* People grid */}
          <FlatList
            data={people}
            keyExtractor={(i) => i.id}
            numColumns={4}
            contentContainerStyle={{ paddingHorizontal: 6, paddingTop: 8 }}
            renderItem={({ item }) => (
              <View style={s.person}>
                <Image source={item.avatar} style={s.avatar} />
                <Text style={s.handle} numberOfLines={1}>
                  {item.handle}
                </Text>
              </View>
            )}
            style={{ maxHeight: 300 }}
          />

          {/* Share row */}
          <View style={s.shareRow}>
            <ShareIcon
              src={require("../assets/icons/link.png")}
              label="Copy link"
              onPress={() => onShareChoice?.("copy")}
            />
          
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* Styles */
const BG = "#FFFFFF";
const TEXT = "#0A1220";
const SUB = "#6B7C97";
const BORDER = "#E6ECF5";

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, color: "#64748B", lineHeight: 22 },
  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18, textAlign: "center", marginTop: 10, marginBottom: 16 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  rowIcon: { width: 20, height: 20, marginRight: 12, tintColor: TEXT, resizeMode: "contain" },
  rowText: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },

  search: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F4F7FC",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: { width: 18, height: 18, tintColor: SUB, marginRight: 8 },
  searchInput: { flex: 1, color: TEXT, fontFamily: "RCB-Medium" },

  person: { width: "25%", alignItems: "center", paddingVertical: 10 },
  avatar: { width: 68, height: 68, borderRadius: 34, marginBottom: 6 },
  handle: { color: TEXT, fontFamily: "RCB-Medium", fontSize: 12, maxWidth: 80, textAlign: "center" },

  shareRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 16,
  },
  shareItem: { width: "16.5%", alignItems: "center", marginBottom: 12 },
  shareIcon: { width: 42, height: 42, borderRadius: 21, resizeMode: "contain" },
  shareLabel: { marginTop: 6, color: SUB, fontFamily: "RCB-SemiBold", fontSize: 12, textAlign: "center" },
});
