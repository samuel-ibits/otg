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
} from "react-native";

type Member = {
  id: string;
  name: string;
  handle: string;
  avatar?: any; // require(...) or undefined -> initials bubble
};

const MEMBERS: Member[] = [
  { id: "1", name: "Jane Doe", handle: "@jannydoe", avatar: require("../../assets/feed/user1.png") },
  { id: "2", name: "Tommy Gbese", handle: "@tom_g", avatar: require("../../assets/feed/user1.png") },
  { id: "3", name: "Dan Nithingale", handle: "@thesparrow" },
  { id: "4", name: "Mariam Bolade", handle: "@theredhair", avatar: require("../../assets/feed/user1.png") },
  { id: "5", name: "Adeola Bukola", handle: "@baldie", avatar: require("../../assets/feed/user1.png") },
  { id: "6", name: "Susan Obinna", handle: "@blackyy", avatar: require("../../assets/feed/user1.png") },
  { id: "7", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
  { id: "8", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
  { id: "9", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
];

export default function SearchMembersScreen({ navigation }: any) {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MEMBERS;
    return MEMBERS.filter(
      m =>
        m.name.toLowerCase().includes(s) ||
        m.handle.toLowerCase().includes(s)
    );
  }, [q]);

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
        <Text style={s.h1}>Search Follower</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.search}
          placeholder="type a name"
          placeholderTextColor="#9FAEC4"
          value={q}
          onChangeText={setQ}
          autoFocus
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.row}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate?.("MemberProfile", { id: item.id })}
          >
            {item.avatar ? (
              <Image source={item.avatar} style={s.avatar} />
            ) : (
              <View style={s.initials}>
                <Text style={s.initialsTxt}>{initials(item.name)}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.handle}>{item.handle}</Text>
            </View>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={s.sep} />}
      />
    </SafeAreaView>
  );
}

/* utils */
function initials(t: string) {
  const p = t.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
}

/* styles */
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
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#E9F0FA", marginLeft: 72 },

  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  initials: {
    width: 44, height: 44, borderRadius: 22, marginRight: 12,
    backgroundColor: "#E6EEFA", alignItems: "center", justifyContent: "center",
  },
  initialsTxt: { color: "#506384", fontFamily: "RCB-SemiBold" },

  name: { color: "#0A1220", fontFamily: "RCB-SemiBold", fontSize: 16 },
  handle: { color: "#8DA0BD", fontFamily: "RCB-Regular", marginTop: 2 },

  chev: { color: "#8FA1BE", fontSize: 20 },
});
