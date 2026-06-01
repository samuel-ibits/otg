import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Platform,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

type Friend = {
  id: string;
  name: string;
  handle: string;
  avatar?: any; // require(...) or undefined for initials bubble
};

const FRIENDS: Friend[] = [
  { id: "1", name: "Jane Doe", handle: "@jannydoe", avatar: require("../../assets/feed/user1.png") },
  { id: "2", name: "Tommy Gbese", handle: "@tom_g", avatar: require("../../assets/feed/user1.png") },
  { id: "3", name: "Dan Nithingale", handle: "@thesparrow" }, // initials only
  { id: "4", name: "Mariam Bolade", handle: "@theredhair", avatar: require("../../assets/feed/user1.png") },
  { id: "5", name: "Adeola Bukola", handle: "@baldie", avatar: require("../../assets/feed/user1.png") },
  { id: "6", name: "Susan Obinna", handle: "@blackyy", avatar: require("../../assets/feed/user1.png") },
  { id: "7", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
  { id: "8", name: "Jake Stone", handle: "@jakeston", avatar: require("../../assets/feed/user1.png") },
  { id: "9", name: "Nora Alabi", handle: "@noralabi", avatar: require("../../assets/feed/user1.png") },
];

export default function InviteFriendsScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FRIENDS;
    return FRIENDS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.handle.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  const copyLink = async () => {
    const link = "https://example.com/invite/abc123";
    await Clipboard.setStringAsync(link);
    Alert.alert("Copied", "Invite link copied.");
  };

  const sendInvite = () => {
    if (!selectedIds.length) {
      Alert.alert("No selection", "Pick at least one friend.");
      return;
    }
    Alert.alert("Invited", `Sent to ${selectedIds.length} friend(s).`);
    navigation?.goBack?.();
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={s.back}>×</Text>
        </TouchableOpacity>
        <Text style={s.h1}>Invite friends</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.search}
          placeholder="type a name"
          placeholderTextColor="#9FAEC4"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => (
          <FriendRow
            f={item}
            checked={!!selected[item.id]}
            onToggle={() => toggle(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom bar */}
      <View style={s.bottom}>
        <TouchableOpacity style={s.copyBtn} onPress={copyLink} activeOpacity={0.9}>
          <Text style={s.copyTxt}>Copy link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.sendBtn, { opacity: selectedIds.length ? 1 : 0.6 }]}
          onPress={sendInvite}
          activeOpacity={0.9}
          disabled={!selectedIds.length}
        >
          <Text style={s.sendTxt}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---- row ---- */

function FriendRow({
  f,
  checked,
  onToggle,
}: {
  f: Friend;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity style={s.row} onPress={onToggle} activeOpacity={0.9}>
      {f.avatar ? (
        <Image source={f.avatar} style={s.avatar} />
      ) : (
        <View style={s.initials}>
          <Text style={s.initialsTxt}>{getInitials(f.name)}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={s.name}>{f.name}</Text>
        <Text style={s.handle}>{f.handle}</Text>
      </View>
      <Checkbox checked={checked} />
    </TouchableOpacity>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[s.box, checked && s.boxChecked]}>
      {checked ? <Text style={s.tick}>✓</Text> : null}
    </View>
  );
}

/* ---- utils ---- */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

/* ---- styles ---- */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6ECF5",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { fontSize: 26, color: "#0A1220", lineHeight: 26 },
  h1: { fontSize: 16, color: "#0A1220", fontFamily: "RCB-SemiBold" },

  searchWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF3F9",
    borderWidth: 1,
    borderColor: "#E5EDF7",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: { fontSize: 14, color: "#8EA0BB", marginRight: 8 },
  search: {
    flex: 1,
    color: "#0A1220",
    fontFamily: "RCB-Regular",
    includeFontPadding: Platform.OS === "android" ? false : undefined,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  initials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#E6EEFA",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsTxt: { color: "#506384", fontFamily: "RCB-SemiBold" },

  name: { color: "#0A1220", fontFamily: "RCB-SemiBold", fontSize: 16 },
  handle: { color: "#8DA0BD", fontFamily: "RCB-Regular", marginTop: 2 },

  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C7D6EE",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  boxChecked: {
    borderColor: "#0A59FF",
    backgroundColor: "#0A59FF",
  },
  tick: { color: "#FFFFFF", fontSize: 16, lineHeight: 16, fontWeight: "700" },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6ECF5",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  copyBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EEF3F9",
    borderWidth: 1,
    borderColor: "#E5EDF7",
    alignItems: "center",
    justifyContent: "center",
  },
  copyTxt: { color: "#0A1220", fontFamily: "RCB-SemiBold", fontSize: 16 },

  sendBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0A59FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sendTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
