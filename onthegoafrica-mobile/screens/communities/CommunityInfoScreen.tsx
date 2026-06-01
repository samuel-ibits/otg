import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import LeaveCommunityModal from "./LeaveCommunityModal";
import EditCommunityModal, { EditCommunityPayload } from "../../component/EditCommunityModal";

type Member = {
  id: string;
  name: string;
  handle: string;
  avatar?: any;
  isAdmin?: boolean;
};

const MEMBERS: Member[] = [
  { id: "1", name: "Jane Doe", handle: "@jannydoe", avatar: require("../../assets/feed/user1.png"), isAdmin: true },
  { id: "2", name: "Tommy Gbese", handle: "@tom_g", avatar: require("../../assets/feed/user1.png") },
  { id: "3", name: "Dan Nithingale", handle: "@thesparrow" },
  { id: "4", name: "Mariam Bolade", handle: "@theredhair", avatar: require("../../assets/feed/user1.png") },
  { id: "5", name: "Adeola Bukola", handle: "@baldie", avatar: require("../../assets/feed/user1.png") },
  { id: "6", name: "Susan Obinna", handle: "@blackyy", avatar: require("../../assets/feed/user1.png") },
  { id: "7", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
  { id: "8", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
  { id: "9", name: "Ada Sike", handle: "@demure", avatar: require("../../assets/feed/user1.png") },
];

export default function CommunityInfoScreen({ navigation, route }: any) {
  const [adminOnly, setAdminOnly] = useState(true);
  const [showLeave, setShowLeave] = useState(false);

  // Editable meta moved into state
  const [name, setName] = useState(route?.params?.name ?? "Cozy Cafe Spots");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet consectetur. Dolor a sem massa consequat amet sed. Phasellus orci at in netus aliquam sed id sagittis ipsum arcu."
  );
  const [visibility, setVisibility] = useState<"Public" | "Private">("Public");
  const [cover] = useState(require("../../assets/feed/photo1.png"));

  const [showEdit, setShowEdit] = useState(false);

  const createdBy = { name: "Jane Doe", avatar: require("../../assets/feed/user1.png"), date: "12/06/2024" };
  const membersCount = 134;

  const confirmLeave = () => {
    setShowLeave(false);
    Alert.alert("Left community", `You left “${name}”.`);
    navigation.navigate("CommunitiesHome");
  };

  const openEdit = () => setShowEdit(true);

  const handleSaveEdit = (p: EditCommunityPayload) => {
    setName(p.name);
    setDescription(p.description);
    setVisibility(p.visibility);
    setAdminOnly(p.adminOnly);
    setShowEdit(false);
  };

  return (
    <SafeAreaView style={s.root}>
      <LeaveCommunityModal
        visible={showLeave}
        onCancel={() => setShowLeave(false)}
        onClose={() => setShowLeave(false)}
        onLeave={confirmLeave}
      />

      <EditCommunityModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={handleSaveEdit}
        initial={{ name, description, visibility, adminOnly, cover }}
      />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.h1}>Community Info</Text>
        <TouchableOpacity onPress={openEdit}>
          <Text style={s.edit}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={s.coverCircle}>
          <Image source={cover} style={s.coverImg} />
        </View>

        {/* Title */}
        <Text style={s.title}>{name}</Text>

        {/* Meta row */}
        <View style={s.metaRow}>
          <View style={s.metaLeft}>
            <Image source={require("../../assets/icons/people.png")} style={[s.metaIcon, { width: 12, height: 12 }]} />
            <Text style={s.metaText}>{membersCount} Members</Text>
          </View>

          <View style={[s.pill, { backgroundColor: visibility === "Public" ? "#E8FBEF" : "#FFF4E5" }]}>
            <View style={[s.dot, { backgroundColor: visibility === "Public" ? "#25C067" : "#F59E0B" }]} />
            <Text style={[s.pillText, { color: visibility === "Public" ? "#199E54" : "#9A6A00" }]}>{visibility}</Text>
          </View>
        </View>

        {/* Created by */}
        <View style={s.createdRow}>
          <Text style={s.createdLabel}>Created by:</Text>
          <Image source={createdBy.avatar} style={s.creatorAvatar} />
          <Text style={s.creatorName}>{createdBy.name}</Text>
          <Text style={s.dotSep}>•</Text>
          <Text style={s.createdDate}>{createdBy.date}</Text>
        </View>

        {/* Description */}
        <View style={s.card}>
          <Text style={s.desc}>{description}</Text>
        </View>

        {/* Admin-only toggle */}
        <View style={[s.card, s.toggleCard]}>
          <View style={{ flex: 1 }}>
            <Text style={s.toggleTitle}>Only Admin can send messages</Text>
            <Text style={s.toggleSub}>Members will not be able to send messages</Text>
          </View>
          <Switch
            value={adminOnly}
            onValueChange={setAdminOnly}
            trackColor={{ false: "#D6DEEC", true: "#BFD2FF" }}
            thumbColor={adminOnly ? "#0A59FF" : "#FFFFFF"}
          />
        </View>

        {/* Members header */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{membersCount} Members</Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.("InviteFriends")}>
            <Text style={s.addMember}>+ Add member</Text>
          </TouchableOpacity>
        </View>

        {/* Members list */}
        <View style={s.listCard}>
          {MEMBERS.map((m, idx) => (
            <View key={m.id} style={[s.row, idx !== MEMBERS.length - 1 && s.rowDivider]}>
              {m.avatar ? (
                <Image source={m.avatar} style={s.avatar} />
              ) : (
                <View style={s.initials}>
                  <Text style={s.initialsTxt}>{initials(m.name)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View style={s.nameLine}>
                  <Text style={s.name}>{m.name}</Text>
                  {m.isAdmin && <Text style={s.adminBadge}>• Admin</Text>}
                </View>
                <Text style={s.handle}>{m.handle}</Text>
              </View>
              <Text style={s.chev}>›</Text>
            </View>
          ))}

          <TouchableOpacity style={s.seeAllBtn} onPress={() => {navigation?.navigate?.("SearchMembers")}}>
            <Text style={s.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Leave community */}
        <TouchableOpacity style={s.deleteBtn} onPress={() => setShowLeave(true)}>
          <Text style={s.deleteTxt}>Leave community</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* utils */
function initials(t: string) {
  const p = t.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
}

/* styles copied from your original file without changes */
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BLUE = "#0A59FF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6ECF5",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { fontSize: 26, lineHeight: 26, color: TEXT },
  h1: { fontSize: 16, color: TEXT, fontFamily: "RCB-SemiBold" },
  edit: { color: BLUE, fontFamily: "RCB-SemiBold" },

  content: { padding: 16, paddingBottom: 28, gap: 12 },

  coverCircle: {
    alignSelf: "center",
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    backgroundColor: "#F1F6FD",
  },
  coverImg: { width: "100%", height: "100%" },

  title: {
    marginTop: 8,
    textAlign: "center",
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 22,
  },

  metaRow: {
    alignSelf: "center",
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaLeft: { flexDirection: "row", alignItems: "center" },
  metaIcon: { tintColor: "#7C8CA5", marginRight: 6 },
  metaText: { color: "#8A9AB7", fontFamily: "RCB-Medium" },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pillText: { fontFamily: "RCB-SemiBold", fontSize: 13 },

  createdRow: {
    alignSelf: "center",
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createdLabel: { color: MUTED, fontFamily: "RCB-Medium" },
  creatorAvatar: { width: 20, height: 20, borderRadius: 10, marginLeft: 2 },
  creatorName: { color: TEXT, fontFamily: "RCB-SemiBold" },
  dotSep: { color: "#B6C3D9", marginHorizontal: 2 },
  createdDate: { color: "#8FA1BE", fontFamily: "RCB-Regular" },

  card: {
    backgroundColor: "#F6FAFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6F0FB",
    padding: 12,
    marginTop: 4,
  },
  desc: { color: MUTED, lineHeight: 18, fontFamily: "RCB-Regular" },

  toggleCard: { flexDirection: "row", alignItems: "center" },
  toggleTitle: { color: TEXT, fontFamily: "RCB-SemiBold" },
  toggleSub: { color: "#9AA8BE", fontFamily: "RCB-Regular", fontSize: 12, marginTop: 4 },

  sectionHeader: {
    marginTop: 6,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: TEXT, fontFamily: "RCB-SemiBold" },
  addMember: { color: TEXT, fontFamily: "RCB-SemiBold" },

  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6EDF7",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E9F0FA" },
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
  nameLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },
  adminBadge: { color: "#8FA1BE", fontFamily: "RCB-Medium", fontSize: 12 },
  handle: { color: "#8DA0BD", fontFamily: "RCB-Regular", marginTop: 2 },
  chev: { color: "#8FA1BE", fontSize: 20 },

  seeAllBtn: { paddingVertical: 10, alignItems: "flex-start", paddingHorizontal: 12 },
  seeAll: { color: TEXT, fontFamily: "RCB-SemiBold" },

  deleteBtn: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F6D9DB",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  deleteTxt: { color: "#E5484D", fontFamily: "RCB-SemiBold" },
});
