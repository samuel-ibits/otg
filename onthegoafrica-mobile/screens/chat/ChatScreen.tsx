import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import MessageRequestModal from "./MessageRequestModal";

type Chat = {
  id: string;
  name: string;
  last: string;
  time: string; // "12:25 PM"
  avatar: any;
  request?: boolean; // shows “• Request” badge
};

const AV = require("../../assets/feed/user1.png");

// Seed. Replace with real data from API. Set to [] to see empty state.
const SEED: Chat[] = [
  { id: "1", name: "Jared", last: "okay sure!!", time: "12:25 PM", avatar: AV },
  { id: "2", name: "Jane Doe", last: "okay sure!!", time: "12:25 PM", avatar: AV, request: true },
  { id: "3", name: "Shindyy", last: "okay sure!!", time: "12:25 PM", avatar: AV },
  { id: "4", name: "Bissymonee", last: "okay sure!!", time: "12:25 PM", avatar: AV },
  { id: "5", name: "Adebaby", last: "okay sure!!", time: "12:25 PM", avatar: AV },
  { id: "6", name: "Seerah", last: "okay sure!!", time: "12:25 PM", avatar: AV },
];

export default function ChatListScreen({ navigation }: any) {
  const [chats, setChats] = useState<Chat[]>(SEED);

  // modal state
  const [pending, setPending] = useState<Chat | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isEmpty = useMemo(() => chats.length === 0, [chats.length]);

  const openChat = (c: Chat) => {
    if (c.request) {
      setPending(c);
      setShowModal(true);
      return;
    }
    navigation?.navigate?.("DirectChat", { id: c.id, name: c.name, avatar: c.avatar });
  };

  const startNew = () => {
    navigation?.navigate?.("SearchMembers");
  };

  const acceptRequest = () => {
    if (!pending) return;
    // clear request badge locally
    setChats(prev => prev.map(x => (x.id === pending.id ? { ...x, request: false } : x)));
    setShowModal(false);
    navigation?.navigate?.("DirectChat", { id: pending.id, name: pending.name, avatar: pending.avatar });
    setPending(null);
  };

  const declineRequest = () => {
    setShowModal(false);
    setPending(null);
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Request modal */}
      <MessageRequestModal
        visible={showModal}
        onAccept={acceptRequest}
        onDecline={declineRequest}
        onClose={declineRequest}
      />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.h1}>Chats</Text>
        <TouchableOpacity onPress={startNew} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.new}><Text style={s.plus}>＋</Text> New chat</Text>
        </TouchableOpacity>
      </View>

      {/* Empty state */}
      {isEmpty ? (
        <View style={s.emptyWrap}>
          <View style={s.illusCircle}>
            <Text style={s.illusEmoji}>💬</Text>
          </View>
          <Text style={s.emptyTitle}>No chats</Text>
          <Text style={s.emptySub}>
            Send messages to your favorite spots{"\n"}directly today.
          </Text>
          <TouchableOpacity style={s.cta} onPress={startNew} activeOpacity={0.9}>
            <Text style={s.ctaTxt}>Send message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View style={s.sep} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.row} onPress={() => openChat(item)} activeOpacity={0.8}>
              <Image source={item.avatar} style={s.avatar} />
              <View style={{ flex: 1 }}>
                <View style={s.nameLine}>
                  <Text style={s.name} numberOfLines={1}>{item.name}</Text>
                  {item.request && (
                    <View style={s.reqPill}>
                      <View style={s.reqDot} />
                      <Text style={s.reqTxt}>Request</Text>
                    </View>
                  )}
                </View>
                <Text style={s.last} numberOfLines={1}>{item.last}</Text>
              </View>
              <Text style={s.time}>{item.time}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

/* styles */

const BLUE = "#0A59FF";
const TEXT = "#0A1220";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  h1: { fontSize: 32, color: TEXT, fontFamily: "RCB-Bold" },
  new: { color: BLUE, fontFamily: "RCB-SemiBold", fontSize: 18 },
  plus: { fontSize: 22 },

  /* empty */
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illusCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#F1F6FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  illusEmoji: { fontSize: 56 },
  emptyTitle: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 26, marginTop: 6 },
  emptySub: { color: "#8EA0BB", textAlign: "center", lineHeight: 20, marginTop: 6 },

  cta: {
    marginTop: 24,
    width: "88%",
    height: 64,
    backgroundColor: BLUE,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 18 },

  /* list */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sep: { height: 12 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 14 },

  nameLine: { flexDirection: "row", alignItems: "center" },
  name: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 22, marginRight: 8 },
  last: { color: "#8EA0BB", fontFamily: "RCB-Regular", fontSize: 18, marginTop: 2 },

  time: { color: "#9EB0C8", fontFamily: "RCB-Medium", fontSize: 14 },

  reqPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3C5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  reqDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F1C21B", marginRight: 6 },
  reqTxt: { color: "#B98A00", fontFamily: "RCB-SemiBold", fontSize: 12 },
});
