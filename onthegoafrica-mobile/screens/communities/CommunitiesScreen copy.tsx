import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CommunityPreviewModal, {
  CommunityPreview,
} from "./CommunityPreviewModal";
import { fetchChats } from "../../api/messaging";

const { width } = Dimensions.get("window");
const CARD_W = (width - 16 * 3) / 2;
const CARD_H = Math.round(CARD_W * 0.58);

type Community = {
  id: string;
  name: string;
  members: number;
  cover?: any;
  avatar?: any;
  integrated?: boolean;
  memberAvatars?: any[];
  creator: {
    userName: string;
    picture?: string;
  };
  visibility?: "Public" | "Private";
};

// const INTEGRATED: Community[] = [
//   {
//     id: "i1",
//     name: "The Avengers",
//     members: 34,
//     cover: require("../../assets/feed/photo1.png"),
//     integrated: true,
//     visibility: "Public",
//   },
//   {
//     id: "i2",
//     name: "The Bar",
//     members: 34,
//     cover: require("../../assets/feed/photo1.png"),
//     integrated: true,
//     visibility: "Public",
//   },
// ];

// const OTHERS: Community[] = [
//   {
//     id: "o1",
//     name: "Cozy Cafe Community",
//     members: 134,
//     avatar: require("../../assets/feed/user1.png"),
//     visibility: "Public",
//     memberAvatars: [
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//     ],
//   },
//   {
//     id: "o2",
//     name: "All things cafe",
//     members: 14,
//     avatar: require("../../assets/feed/user1.png"),
//     visibility: "Private",
//     memberAvatars: [
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//     ],
//   },
//   {
//     id: "o3",
//     name: "Cozy Cafe Community",
//     members: 134,
//     avatar: require("../../assets/feed/user1.png"),
//     visibility: "Public",
//     memberAvatars: [
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//     ],
//   },
//   {
//     id: "o4",
//     name: "Cozy Cafe Community",
//     members: 134,
//     avatar: require("../../assets/feed/user1.png"),
//     visibility: "Public",
//     memberAvatars: [
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//     ],
//   },
//   {
//     id: "o5",
//     name: "Cozy Cafe Community",
//     members: 134,
//     avatar: require("../../assets/feed/user1.png"),
//     visibility: "Public",
//     memberAvatars: [
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//       require("../../assets/feed/user1.png"),
//     ],
//   },
// ];
const SEARCH = require("../../assets/icons/search.png");
const ADD = require("../../assets/icons/community-add.png");
type Chat = {
  id: string;
  name: string;
  members: any[]; // Array of member objects
  creator: {
    userName: string;
    picture?: string;
  };
  cover?: any;
  avatar?: any;
  visibility: "Public" | "Private";
};

export default function CommunitiesScreen({ navigation }: any) {
  // const integrated = useMemo(() => INTEGRATED, []);

  const [preview, setPreview] = useState<CommunityPreview | null>(null);
  const [show, setShow] = useState(false);
  const [chat, setChat] = useState([]);

  // Fetch chats from the API when the component mounts
  useEffect(() => {
    const fetchChatsApi = async () => {
      try {
        const response = await fetchChats();
        if (response.data && response.data.chats) {
          setChat(response.data.chats);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChatsApi();
  }, []);

  const openPreview = (chat: Chat) => {
    const payload: CommunityPreview = {
      name: chat.name,
      members: chat.members.length,
      visibility: chat.visibility,
      cover: chat.cover,
      description: "Lorem ipsum dolor sit amet consectetur.",
      createdBy: {
        name: chat.creator.userName,
        avatar: chat.creator.picture || require("../../assets/feed/user1.png"),
        date: "12/06/2024",
      },
    };
    setPreview(payload);
    setShow(true);
  };

  return (
    <SafeAreaView style={s.root}>
      {preview && (
        <CommunityPreviewModal
          visible={show}
          community={preview}
          onClose={() => setShow(false)}
          onJoin={() => {
            setShow(false);
            navigation.navigate("CommunityChat", {
              communityName: preview.name,
              communityId: "dummy-id",
            });
          }}
        />
      )}
      <View style={s.header}>
        <Text style={s.h1}>Community</Text>
        <View style={s.headerIcons}>
          <TouchableOpacity style={s.iconBtn} activeOpacity={0.7}>
            <Image source={SEARCH} style={s.searchIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("CreateCommunity")}
          >
            {" "}
            <Image source={ADD} style={s.searchIcon} />
            {/* <Text style={s.iconText}>👥</Text> */}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.sectionTitle}>Integrated Communities</Text>
        <View style={s.integratedRow}>
          {chat.map((item) => (
            <IntegratedCard
              key={item.id}
              c={item}
              onPress={() => openPreview(item)}
            />
          ))}
        </View>

        <Text style={[s.sectionTitle, { marginTop: 20 }]}>
          Discover new communities
        </Text>
        <View style={{ paddingHorizontal: 16 }}>
          {chat.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={s.row}
              activeOpacity={0.9}
              onPress={() => openPreview(c)}
            >
              <Image source={c.avatar} style={s.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle} numberOfLines={1}>
                  {c.name}
                </Text>
                <View style={s.metaRow}>
                  <Text style={s.memberCount}>{c.members} Members</Text>
                  <StatusPill visibility={c.visibility} />
                </View>
                {c.memberAvatars && (
                  <View style={s.avatarRow}>
                    {c.memberAvatars.map((av, i) => (
                      <Image
                        key={i}
                        source={av}
                        style={[s.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}
                      />
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function IntegratedCard({ c, onPress }: { c: Community; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.cardWrap} activeOpacity={0.9} onPress={onPress}>
      <ImageBackground source={c.cover} style={s.card} imageStyle={s.cardImg}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.65)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={s.cardBottom}>
          <Text style={s.cardTitle} numberOfLines={1}>
            {c.name}
          </Text>
          <Text style={s.cardMembers}>{c.members} Members</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

function StatusPill({ visibility }: { visibility: "Public" | "Private" }) {
  const isPublic = visibility === "Public";
  return (
    <View
      style={[
        s.pill,
        {
          backgroundColor: isPublic ? "#E8F5E9" : "#FFF9E6",
        },
      ]}
    >
      <View
        style={[s.dot, { backgroundColor: isPublic ? "#4CAF50" : "#FFC107" }]}
      />
      <Text style={[s.pillText, { color: isPublic ? "#2E7D32" : "#F57C00" }]}>
        {visibility}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FA",
  },
  h1: { fontSize: 28, color: "#1A1A1A", fontFamily: "RCB-Bold" },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: { padding: 4 },
  searchIcon: {
    width: 19,
    height: 19,
    // tintColor: SUB,
    marginRight: 12,
    resizeMode: "contain",
  },
  iconText: { fontSize: 24 },
  content: { paddingBottom: 100 },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0A59FF",
    alignItems: "center",
    justifyContent: "center",
  },
  addPlus: { color: "#fff", fontSize: 30, lineHeight: 30 },

  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#4A5568",
    fontFamily: "RCB-SemiBold",
  },
  integratedRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  cardWrap: {
    flex: 1,
    height: CARD_H,
    borderRadius: 16,
    overflow: "hidden",
  },
  card: { width: "100%", height: "100%", justifyContent: "flex-end" },
  cardImg: { borderRadius: 16 },
  cardBottom: { padding: 12 },
  cardTitle: {
    color: "#FFFFFF",
    fontFamily: "RCB-Bold",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardMembers: {
    color: "#FFFFFF",
    fontFamily: "RCB-Medium",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  rowTitle: {
    color: "#1A1A1A",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 8,
  },
  memberCount: {
    color: "#6B7280",
    fontFamily: "RCB-Medium",
    fontSize: 13,
    marginRight: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  pillText: { fontFamily: "RCB-SemiBold", fontSize: 11 },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navItemCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 24,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "RCB-Medium",
  },
  addBtnNav: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  addPlusNav: {
    color: "#6B7280",
    fontSize: 24,
    lineHeight: 24,
  },
});
