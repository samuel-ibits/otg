// screens/profile/UserProfileScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from "react-native";

const BACK = require("../../assets/icons/back.png");
const MORE = require("../../assets/feed/more.png");
const MAP = require("../../assets/icons/marker.png");
const CLOCK = require("../../assets/icons/clock.png");
const STAR = require("../../assets/home/star.png");
const WIFI = require("../../assets/icons/wifi.png");
const COFFEE = require("../../assets/feed/coffee.png");
const WORK = require("../../assets/icons/work.png");
const SAVE = require("../../assets/feed/bookmark.png");

type TabKey = "Posts" | "Reviews" | "Skills";

export default function UserProfileScreen({ navigation, route }: any) {
  const { userId } = route.params || {};
  const [tab, setTab] = useState<TabKey>("Posts");
  const [actionsVisible, setActionsVisible] = useState(false);

  const profile = {
    id: "jane_doe",
    name: "Jane Doe",
    handle: "@jannydd",
    avatar:
      "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=300",
  };

  const posts = useMemo(
    () => [
      {
        id: "p1",
        image:
          "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200",
        text:
          "This has one of the best cover ever. A place away from home. I could always go back again.",
        place: "Cafe One Chevron",
        distance: "1.2km",
        stats: { likes: 23, comments: 23 },
        rating: 4.5,
        reviews: 150,
        sub: [
          { icon: WIFI, label: "Wifi (4.5)" },
          { icon: COFFEE, label: "Coffee (5.0)" },
          { icon: WORK, label: "Co-working space (5.0)" },
        ],
      },
      {
        id: "p2",
        image:
          "https://images.unsplash.com/photo-1600891965050-d8c8eacc2a87?q=80&w=1200",
        text:
          "Fresh brew and quiet corners. Perfect for quick tasks and long reads.",
        place: "Roast & Grind",
        distance: "2.6km",
        stats: { likes: 41, comments: 12 },
        rating: 4.8,
        reviews: 260,
        sub: [
          { icon: WIFI, label: "Wifi (5.0)" },
          { icon: COFFEE, label: "Coffee (4.8)" },
          { icon: WORK, label: "Co-working space (4.7)" },
        ],
      },
      {
        id: "p3",
        image:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200",
        text:
          "Citrus jar and sunlight. Friendly staff and good music. Will return.",
        place: "Zorkle",
        distance: "0.8km",
        stats: { likes: 12, comments: 4 },
        rating: 4.3,
        reviews: 98,
        sub: [
          { icon: WIFI, label: "Wifi (4.2)" },
          { icon: COFFEE, label: "Coffee (4.0)" },
          { icon: WORK, label: "Co-working space (4.3)" },
        ],
      },
    ],
    []
  );

  const openDirectChat = () => {
    navigation.navigate("Chat", {
      screen: "DirectChat",
      params: {
        id: profile.id,
        name: profile.name,
        avatar: { uri: profile.avatar },
      },
    });
  };

  // actions
  const complainSupport = () => {
    setActionsVisible(false);
    Alert.alert("Support", "Your complaint has been queued.");
  };

  const blockUser = () => {
    setActionsVisible(false);
    Alert.alert("Blocked", `You will no longer see content from ${profile.name}.`);
    // Optional: navigate back or update global state to hide user content.
  };

  const reportUser = () => {
    setActionsVisible(false);
    Alert.alert("Reported", "Thanks. We will review this user.");
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
          <Image source={BACK} style={s.icon24} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Profile</Text>
        <TouchableOpacity style={s.iconBtn} onPress={() => setActionsVisible(true)}>
          <Image source={MORE} style={s.icon24} />
        </TouchableOpacity>
      </View>

      <ScrollView bounces showsVerticalScrollIndicator={false}>
        {/* Top card */}
        <View style={s.top}>
          <Image source={{ uri: profile.avatar }} style={s.avatar} />

          <View style={{ flex: 1 }}>
            <Text style={s.name}>{profile.name}</Text>
            <Text style={s.handle}>{profile.handle}</Text>

            <View style={s.statsRow}>
              <Text style={s.stat}>
                <Text style={s.statNum}>60</Text> Following
              </Text>
              <Text style={[s.stat, { marginLeft: 12 }]}>
                <Text style={s.statNum}>960</Text> Followers
              </Text>
            </View>

            <View style={s.actionRow}>
              <TouchableOpacity style={s.followBtn}>
                <Text style={s.followTxt}>Following</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.msgBtn} onPress={openDirectChat}>
                <Text style={s.msgTxt}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={s.bio}>
          “Lorem ipsum dolor sit amet consectetur. Nam eget purus aliquet justo.
          Id cras eget convallis”.
        </Text>

        <View style={s.metaRow}>
          <Image source={WORK} style={s.dotIcon} />
          <Text style={s.meta}>Digital Marketer</Text>
        </View>
        <View style={s.metaRow}>
          <Image source={MAP} style={s.dotIcon} />
          <Text style={s.meta}>Lagos, Nigeria</Text>
        </View>
        <View style={s.metaRow}>
          <Image source={CLOCK} style={s.dotIcon} />
          <Text style={s.meta}>Joined Jan 2024</Text>
        </View>

        {/* skills quick row */}
        <View style={s.skillsRowHeader}>
          <Text style={s.skillsHeaderTxt}>Skills</Text>
          <TouchableOpacity>
            <Text style={s.seeAll}>See all ›</Text>
          </TouchableOpacity>
        </View>
        <View style={s.chipsRow}>
          {["SEO Marketing", "MS Word", "SEO Marketing", "Excel"].map((c) => (
            <View key={c} style={s.chip}>
              <Text style={s.chipTxt}>{c}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          {(["Posts", "Reviews", "Skills"] as TabKey[]).map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={s.tabBtn}>
              <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>
                {t === "Skills" ? "Skills & Hobbies" : t}
              </Text>
              {tab === t && <View style={s.tabBar} />}
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Posts" && (
          <FlatList
            data={posts}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <PostCard data={item} />}
            contentContainerStyle={{ paddingBottom: 28 }}
            scrollEnabled={false}
          />
        )}

        {tab === "Reviews" && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
            <View style={s.reviewBox}>
              <Text style={s.reviewTitle}>Cafe One Chevron</Text>
              <View style={s.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} source={STAR} style={[s.star, { opacity: i < 4 ? 1 : 0.25 }]} />
                ))}
              </View>
              <Text style={s.reviewText}>
                Cozy, clean and friendly. Good internet. Try the cold brew.
              </Text>
            </View>
            <View style={s.reviewBox}>
              <Text style={s.reviewTitle}>Roast & Grind</Text>
              <View style={s.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} source={STAR} style={[s.star, { opacity: i < 5 ? 1 : 0.25 }]} />
                ))}
              </View>
              <Text style={s.reviewText}>
                Loved the ambience. Seats are comfortable for long sessions.
              </Text>
            </View>
          </View>
        )}

        {tab === "Skills" && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
            <Block title="Skills" chips={["SEO Marketing", "MS Word"]} />
            <Block
              title="Hobbies"
              chips={["Singing 🎤", "Running 🏃‍♀️", "Cooking 🍳", "Food tasting 😛"]}
            />
            <Block
              title="Places to visit"
              chips={["Cafe ☕", "Co-workspace 💼", "Beach house 🏖️", "Hotel 🏢", "Bar 🍺"]}
            />
          </View>
        )}
      </ScrollView>

      {/* Profile actions modal */}
      <ProfileActionsModal
        visible={actionsVisible}
        onClose={() => setActionsVisible(false)}
        onComplainSupport={complainSupport}
        onBlockUser={blockUser}
        onReportUser={reportUser}
        username={profile.name}
        handle={profile.handle}
      />
    </SafeAreaView>
  );
}

function Block({ title, chips }: { title: string; chips: string[] }) {
  return (
    <View style={s.block}>
      <View style={s.blockHeader}>
        <Text style={s.blockTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={s.edit}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={s.blockChips}>
        {chips.map((c) => (
          <View key={c} style={s.chipLarge}>
            <Text style={s.chipTxt}>{c}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PostCard({ data }: any) {
  return (
    <View style={s.card}>
      <Image source={{ uri: data.image }} style={s.cardImg} />
      <TouchableOpacity style={s.fabSave}>
        <Image source={SAVE} style={[s.icon18]} />
      </TouchableOpacity>

      <View style={s.cardBody}>
        <View style={s.engRow}>
          <View style={s.engLeft}>
            <Text style={s.engTxt}>♡ {data.stats.likes}</Text>
            <Text style={[s.engTxt, { marginLeft: 12 }]}>💬 {data.stats.comments}</Text>
          </View>
          <View style={s.ratingMini}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Image key={i} source={STAR} style={[s.starMini, { opacity: i + 0.5 <= data.rating ? 1 : 0.25 }]} />
            ))}
          </View>
        </View>

        <Text style={s.cardText}>{data.text}</Text>

        {/* place card */}
        <View style={s.place}>
          <View style={{ flex: 1 }}>
            <View style={s.placeRow}>
              <Text style={s.placeName}>{data.place}</Text>
              <Text style={s.km}>({data.distance})</Text>
            </View>

            <View style={s.subRow}>
              {data.sub.map((sitem: any) => (
                <View key={sitem.label} style={s.subPill}>
                  <Image source={sitem.icon} style={[s.icon14]} />
                  <Text style={s.subTxt}>{sitem.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
            <View style={s.reviewRight}>
              <View style={s.ratingRight}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} source={STAR} style={[s.starTiny, { opacity: i + 0.5 <= data.rating ? 1 : 0.25 }]} />
                ))}
              </View>
              <Text style={s.reviewsNum}>{data.reviews}</Text>
            </View>
            <TouchableOpacity>
              <Text style={s.visit}>Visit profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.timeAgo}>5 minutes ago</Text>
      </View>
    </View>
  );
}

/* ------------ ProfileActionsModal (copied pattern from Feed) ------------ */

function ProfileActionsModal({
  visible,
  onClose,
  onComplainSupport,
  onBlockUser,
  onReportUser,
  username,
  handle,
}: {
  visible: boolean;
  onClose?: () => void;
  onComplainSupport?: () => void;
  onBlockUser?: () => void;
  onReportUser?: () => void;
  username?: string;
  handle?: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={sA.overlay}>
        <View style={sA.sheet}>
          <TouchableOpacity style={sA.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={sA.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={sA.title}>More options</Text>
          {username ? <Text style={sA.sub}>{username}</Text> : null}
          {handle ? <Text style={sA.subMuted}>{handle}</Text> : null}

          <View style={sA.list}>
            <ActionRow emoji="🛟" label="Complain to support" desc="Tell support what went wrong" onPress={onComplainSupport} />
            <View style={sA.divider} />
            <ActionRow emoji="🚫" label="Block user" desc="Hide posts and messages from this user" onPress={onBlockUser} danger />
            <View style={sA.divider} />
            <ActionRow emoji="🚩" label="Report user" desc="Flag this account for review" onPress={onReportUser} danger />
          </View>

          <TouchableOpacity style={sA.cancel} onPress={onClose} activeOpacity={0.9}>
            <Text style={sA.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function ActionRow({
  emoji,
  label,
  desc,
  onPress,
  danger,
}: {
  emoji: string;
  label: string;
  desc?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={sA.row} onPress={onPress} activeOpacity={0.9}>
      <Text style={sA.emoji}>{emoji}</Text>
      <View style={sA.rowText}>
        <Text style={[sA.rowLabel, danger && sA.rowDanger]}>{label}</Text>
        {desc ? <Text style={sA.rowDesc}>{desc}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

/* styles */
const TEXT = "#0F2238";
const SUB = "#7F8A99";
const BLUE = "#0A59FF";
const BORDER = "#E7EDF4";
const BG = "#F7FAFE";
const MUTED = "#6C7A92";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 48,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  headerTitle: { color: TEXT, fontSize: 16, fontWeight: "800" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  icon24: { width: 22, height: 22, resizeMode: "contain" },
  icon18: { width: 18, height: 18, resizeMode: "contain" },
  icon14: { width: 14, height: 14, resizeMode: "contain" },

  top: { flexDirection: "row", padding: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: 12 },
  name: { color: TEXT, fontWeight: "900", fontSize: 16 },
  handle: { color: SUB, marginTop: 2 },

  statsRow: { flexDirection: "row", marginTop: 6 },
  stat: { color: SUB, fontWeight: "700" },
  statNum: { color: TEXT, fontWeight: "900" },

  actionRow: { flexDirection: "row", marginTop: 10 },
  followBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  followTxt: { color: TEXT, fontWeight: "800" },
  msgBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: { color: "#fff", fontWeight: "800" },

  bio: { color: TEXT, paddingHorizontal: 16, paddingBottom: 6, lineHeight: 18 },
  metaRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 2 },
  dotIcon: { width: 14, height: 14, marginRight: 6 },
  meta: { color: TEXT, fontWeight: "700" },

  skillsRowHeader: {
    marginTop: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillsHeaderTxt: { color: TEXT, fontWeight: "900" },
  seeAll: { color: BLUE, fontWeight: "900" },

  chipsRow: { paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", paddingBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG,
    marginRight: 8,
    marginTop: 8,
  },
  chipLarge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG,
    marginRight: 8,
    marginTop: 8,
  },
  chipTxt: { color: TEXT, fontWeight: "800" },

  tabs: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingTop: 10 },
  tabTxt: { color: TEXT, fontWeight: "800", paddingBottom: 10 },
  tabTxtActive: { color: BLUE },
  tabBar: { height: 3, backgroundColor: BLUE, alignSelf: "stretch", borderRadius: 2 },

  /* Blocks */
  block: {
    backgroundColor: "#F9FBFE",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    marginTop: 14,
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  blockTitle: { color: TEXT, fontWeight: "900" },
  edit: { color: TEXT, fontWeight: "900", opacity: 0.7 },
  blockChips: { flexDirection: "row", flexWrap: "wrap", padding: 12 },

  /* Post card */
  card: { marginTop: 10 },
  cardImg: { height: 220, width: "100%" },
  fabSave: {

  },

  cardBody: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  engRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  engLeft: { flexDirection: "row", alignItems: "center" },
  engTxt: { color: SUB, fontWeight: "800" },

  ratingMini: { flexDirection: "row" },
  starMini: { width: 14, height: 14, tintColor: "#F6B30D", marginLeft: 2 },

  cardText: { color: TEXT, marginTop: 8, marginBottom: 10 },

  place: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
  },
  placeRow: { flexDirection: "row", alignItems: "center" },
  placeName: { color: TEXT, fontWeight: "900" },
  km: { color: SUB, marginLeft: 6, fontWeight: "800" },

  subRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  subPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F4FAF6",
    borderRadius: 20,
    marginRight: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E3F3EA",
  },
  subTxt: { fontWeight: "800", marginLeft: 6 },

  reviewRight: { alignItems: "flex-end" },
  ratingRight: { flexDirection: "row" },
  starTiny: { width: 12, height: 12, tintColor: "#F6B30D", marginLeft: 2 },
  reviewsNum: { color: "#F6B30D", fontWeight: "900", marginTop: 4 },

  visit: {
    color: BLUE,
    marginTop: 6,
    fontWeight: "900",
    textDecorationLine: "underline",
  },
  timeAgo: { color: SUB, marginTop: 8 },
  reviewBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginTop: 12,
  },
  reviewTitle: { color: TEXT, fontWeight: "900", marginBottom: 6 },
  ratingRow: { flexDirection: "row", marginBottom: 6 },
  star: { width: 16, height: 16, tintColor: "#F6B30D", marginRight: 2 },
  reviewText: { color: TEXT },
});

/* actions modal styles (same pattern as FeedScreen) */
const sA = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  closeX: { fontSize: 24, lineHeight: Platform.OS === "ios" ? 24 : 26, color: "#617291" },
  title: { color: TEXT, fontWeight: "900", fontSize: 18, textAlign: "center", marginTop: 6 },
  sub: { color: TEXT, fontWeight: "700", fontSize: 14, textAlign: "center", marginTop: 6 },
  subMuted: { color: MUTED, fontSize: 12, textAlign: "center", marginTop: 2 },
  list: {
    marginTop: 14,
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 14, paddingVertical: 14 },
  emoji: { fontSize: 18, marginRight: 10 },
  rowText: { flex: 1 },
  rowLabel: { color: TEXT, fontWeight: "800", fontSize: 15 },
  rowDesc: { color: MUTED, fontSize: 12, marginTop: 2 },
  rowDanger: { color: "#B91C1C" },
  divider: { height: 1, backgroundColor: BORDER },
  cancel: {
    marginTop: 14,
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
});
