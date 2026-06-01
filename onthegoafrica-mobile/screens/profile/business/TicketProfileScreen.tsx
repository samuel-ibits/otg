// screens/registration/business/TicketProfileScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const I = {
  back: require("../../../assets/icons/back.png"),
  pen: require("../../../assets/icons/pen.png"),
  trash: require("../../../assets/icons/trash.png"),
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#62718C";
const BORDER = "#E6EDF7";
const SOFT = "#F5F8FF";
const DANGER = "#D32F2F";

type Ticket = { id: string; duration: string; price: string };

export default function TicketProfileScreen() {
  const navigation = useNavigation<any>();

  // Start unsynced to show the empty state.
  const [synced, setSynced] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "t1", duration: "1hr", price: "₦1000" },
    { id: "t2", duration: "2hrs", price: "₦1500" },
  ]);

  const hasTickets = synced && tickets.length > 0;

  const onSync = () => {
    setSynced(true);
    Alert.alert("Synced", "Router profile synced.");
  };

  // Navigate to AddTicket and collect the result
  const onAdd = () => {
    navigation.navigate("AddTicket", {
      onSave: (t: { duration: string; price: string }) => {
        setTickets((prev: Ticket[]) => [
          ...prev,
          { id: String(Date.now()), duration: t.duration, price: t.price },
        ]);
      },
    });
  };

  const onEdit = (t: Ticket) => Alert.alert("Edit ticket", `${t.duration} • ${t.price}`);
  const onDelete = (t: Ticket) =>
    Alert.alert("Delete ticket", `Remove ${t.duration}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setTickets((x) => x.filter((i) => i.id !== t.id)) },
    ]);

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={I.back} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Ticket profile</Text>
        {hasTickets ? (
          <TouchableOpacity onPress={onSync} style={s.syncBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Text style={s.syncTxt}>Sync</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 56 }} />
        )}
      </View>

      {!hasTickets ? (
        <View style={s.emptyWrap}>
          <Text style={s.emptyTitle}>No Router Profile Yet</Text>
          <Text style={s.emptyBody}>
            It looks like your router hasn&apos;t been synced with OTG. To preview, update, or manage your router
            profile, sync it with the app first.
          </Text>
          <TouchableOpacity onPress={onSync} activeOpacity={0.9} style={s.ctaPrimary}>
            <Text style={s.ctaPrimaryText}>Sync now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
          {tickets.map((t) => (
            <View key={t.id} style={s.ticketCard}>
              <View style={s.rowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Duration</Text>
                  <Text style={s.valueLink}>{t.duration}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Price</Text>
                  <Text style={s.valueLink}>{t.price}</Text>
                </View>
              </View>

              <View style={s.rowBottom}>
                <TouchableOpacity style={s.rowBtn} onPress={() => onEdit(t)} activeOpacity={0.8}>
                  <Image source={I.pen} style={s.rowIcon} />
                  <Text style={s.rowTxt}>Edit</Text>
                </TouchableOpacity>

                <View style={s.divider} />

                <TouchableOpacity style={s.rowBtn} onPress={() => onDelete(t)} activeOpacity={0.8}>
                  <Image source={I.trash} style={[s.rowIcon, { tintColor: DANGER }]} />
                  <Text style={[s.rowTxt, { color: DANGER }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity activeOpacity={0.9} onPress={onAdd} style={s.addWrap}>
            <Text style={s.addPlus}>＋</Text>
            <Text style={s.addTxt}>Add new ticket</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  back: { width: 24, height: 24, tintColor: TEXT },
  title: { flex: 1, textAlign: "center", color: TEXT, fontSize: 18, fontWeight: "700" },
  syncBtn: {
    height: 32,
    paddingHorizontal: 14,
    backgroundColor: BLUE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  syncTxt: { color: "#fff", fontWeight: "700" },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  emptyTitle: { color: TEXT, fontWeight: "800", fontSize: 16, marginBottom: 10 },
  emptyBody: { color: MUTED, textAlign: "center", lineHeight: 20, marginBottom: 16 },

  ctaPrimary: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPrimaryText: { color: "#fff", fontWeight: "700" },

  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rowTop: { flexDirection: "row" },
  label: { color: MUTED, fontWeight: "700" },
  valueLink: { color: BLUE, fontWeight: "700", marginTop: 6 },
  rowBottom: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  rowIcon: { width: 16, height: 16, tintColor: "#7283A3", marginRight: 8 },
  rowTxt: { color: "#1F2A44", fontWeight: "700" },
  divider: { width: 1, height: 16, backgroundColor: "#E6EDF7" },

  addWrap: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DBE7FB",
    borderStyle: "dashed",
    backgroundColor: SOFT,
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addPlus: { fontSize: 26, color: "#0F172A" },
  addTxt: { marginTop: 6, color: "#0F172A", fontWeight: "700" },
});
