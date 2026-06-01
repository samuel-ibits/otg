// screens/business/BusinessRewardsScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Image,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { addRewardRedeemHours, getProfileId } from "../../../api/api";

const BACK_ICON = require("../../../assets/icons/back.png");
const CLOCK_ICON = require("../../../assets/icons/clock.png");
const CARET_ICON = require("../../../assets/icons/down.png");

type Meridiem = "AM" | "PM";
type Time = { h: number; m: number; ap: Meridiem };
type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const ALL_DAYS: { key: DayKey; label: string }[] = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
];

const DEFAULT_OPEN: Time = { h: 10, m: 0, ap: "AM" };
const DEFAULT_CLOSE: Time = { h: 5, m: 0, ap: "PM" };

/* ----- small components ----- */

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.tabBtn, active ? s.tabBtnActive : s.tabBtnInactive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={[s.tabTxt, active ? s.tabTxtActive : s.tabTxtInactive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TimeCell({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.cell} onPress={onPress} activeOpacity={0.85}>
      <Image source={CLOCK_ICON} style={s.clock} />
      <Text style={s.cellTxt}>{value}</Text>
      <Image source={CARET_ICON} style={s.caret} />
    </TouchableOpacity>
  );
}

function TimePickerModal({
  visible,
  initial,
  onClose,
  onApply,
}: {
  visible: boolean;
  initial: Time;
  onClose: () => void;
  onApply: (t: Time) => void;
}) {
  const [h, setH] = React.useState<number>(initial.h);
  const [m, setM] = React.useState<number>(initial.m);
  const [ap, setAp] = React.useState<Meridiem>(initial.ap);

  React.useEffect(() => {
    if (visible) {
      setH(initial.h);
      setM(initial.m);
      setAp(initial.ap);
    }
  }, [visible, initial]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>Select time</Text>

          <View style={s.pickersRow}>
            <Wheel data={hours} value={h} onChange={setH} />
            <Text style={s.colon}>:</Text>
            <Wheel data={minutes} value={m} onChange={setM} pad />
            <View style={{ width: 10 }} />
            <MeridiemToggle ap={ap} onChange={setAp} />
          </View>

          <View style={s.modalBtns}>
            <TouchableOpacity style={s.modalCancel} onPress={onClose}>
              <Text style={s.modalCancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.modalApply}
              onPress={() => onApply({ h, m, ap })}
              activeOpacity={0.9}
            >
              <Text style={s.modalApplyTxt}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Wheel({
  data,
  value,
  onChange,
  pad,
}: {
  data: number[];
  value: number;
  onChange: (v: number) => void;
  pad?: boolean;
}) {
  const ref = React.useRef<FlatList<number>>(null);

  React.useEffect(() => {
    const idx = Math.max(0, data.findIndex((x) => x === value));
    setTimeout(() => ref.current?.scrollToIndex({ index: idx, animated: false }), 0);
  }, [data, value]);

  return (
    <FlatList
      ref={ref as any}
      data={data}
      keyExtractor={(it) => String(it)}
      showsVerticalScrollIndicator={false}
      style={s.wheel}
      getItemLayout={(_, index) => ({ length: 36, offset: 36 * index, index })}
      renderItem={({ item }) => {
        const active = item === value;
        return (
          <TouchableOpacity
            onPress={() => onChange(item)}
            style={[s.wheelItem, active && s.wheelItemActive]}
          >
            <Text style={[s.wheelTxt, active && s.wheelTxtActive]}>
              {pad ? String(item).padStart(2, "0") : item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

function MeridiemToggle({ ap, onChange }: { ap: Meridiem; onChange: (m: Meridiem) => void }) {
  return (
    <View style={s.apWrap}>
      {(["AM", "PM"] as Meridiem[]).map((m) => {
        const active = ap === m;
        return (
          <TouchableOpacity
            key={m}
            style={[s.apBtn, active && s.apBtnActive]}
            onPress={() => onChange(m)}
          >
            <Text style={[s.apTxt, active && s.apTxtActive]}>{m}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function BusinessRewardsScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = React.useState<"voucher" | "value">("voucher");
  const [isLoading, setIsLoading] = React.useState(false);

  // active rows for voucher validity windows
  const [rows, setRows] = React.useState<
    { day: DayKey; open: Time; close: Time }[]
  >(() =>
    ALL_DAYS.map((d) => ({ day: d.key, open: { ...DEFAULT_OPEN }, close: { ...DEFAULT_CLOSE } }))
  );

  const removeRow = (day: DayKey) =>
    setRows((prev) => prev.filter((r) => r.day !== day));

  const addMissingRows = () => {
    // re-add any removed days at the bottom
    const missing = ALL_DAYS.filter((d) => !rows.find((r) => r.day === d.key)).map((d) => ({
      day: d.key,
      open: { ...DEFAULT_OPEN },
      close: { ...DEFAULT_CLOSE },
    }));
    setRows((prev) => [...prev, ...missing]);
  };

  const [editing, setEditing] = React.useState<{
    visible: boolean;
    idx?: number;
    which?: "open" | "close";
    value?: Time;
  }>({ visible: false });

  const openPicker = (idx: number, which: "open" | "close") =>
    setEditing({ visible: true, idx, which, value: { ...rows[idx][which] } });

  const closePicker = () => setEditing({ visible: false });

  const applyPicker = (t: Time) => {
    if (editing.idx == null || !editing.which) return;
    setRows((prev) => {
      const copy = [...prev];
      copy[editing.idx!] = { ...copy[editing.idx!], [editing.which!]: t } as any;
      return copy;
    });
    closePicker();
  };

  const toDisplay = (t: Time) => `${pad(t.h)}:${pad(t.m)} ${t.ap}`;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Convert Time object to "HH:MM" format for API
  const timeToApiFormat = (time: Time): string => {
    let hour = time.h;
    if (time.ap === "PM" && hour !== 12) hour += 12;
    if (time.ap === "AM" && hour === 12) hour = 0;
    return `${pad(hour)}:${pad(time.m)}`;
  };

  const done = async () => {
    // Only save if we're in the voucher tab and have rows
    if (tab === "voucher" && rows.length > 0) {
      setIsLoading(true);
      try {
        // Get the profile ID from AsyncStorage
        const profileId = await getProfileId();
        
        if (!profileId) {
          Alert.alert("Error", "Profile ID not found. Please create a profile first.");
          return;
        }

        // Convert rows to API format
        const hoursData = rows.map(row => {
          const dayLabel = ALL_DAYS.find((d) => d.key === row.day)?.label ?? row.day;
          return {
            dayOfWeek: dayLabel.toLowerCase(), // Convert to lowercase: "monday", "tuesday", etc.
            openTime: timeToApiFormat(row.open),
            closeTime: timeToApiFormat(row.close),
          };
        });

        // Prepare data for API call
        const rewardHoursData = {
          profileId: profileId,
          hours: hoursData,
        };

        // Call the API
        const response = await addRewardRedeemHours(rewardHoursData);
        
        // Show success message
        Alert.alert("Success", "Reward redeem hours saved successfully!");
        
        // Navigate back to the setup list and mark this step complete
        navigation.navigate("CreateBusinessProfile", { markDone: "rewards" });
        
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to save reward redeem hours");
        return; // Don't navigate if there's an error
      } finally {
        setIsLoading(false);
      }
    } else {
      // For value-added system or empty voucher, just navigate
      navigation.navigate("CreateBusinessProfile", { markDone: "rewards" });
    }
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={HS}>
          <Image source={BACK_ICON} style={s.back} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Reward voucher set up</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Intro */}
      <View style={s.introWrap}>
        <Text style={s.intro}>
          You can pick what you want to offer people who review your{"\n"}
          business, whether voucher or value-added system
        </Text>

        <View style={s.tabs}>
          <TabButton label="Reward voucher" active={tab === "voucher"} onPress={() => setTab("voucher")} />
          <TabButton label="Value-added system" active={tab === "value"} onPress={() => setTab("value")} />
        </View>
      </View>

      {/* Body */}
      {tab === "voucher" ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text style={s.sectionTitle}>Set validity time and dates</Text>

          {rows.map((row, idx) => {
            const dayLabel = ALL_DAYS.find((d) => d.key === row.day)?.label ?? row.day;
            return (
              <View key={row.day} style={s.card}>
                <View style={s.cardTop}>
                  <Text style={s.dayLabel}>{dayLabel}</Text>
                  <TouchableOpacity onPress={() => removeRow(row.day)} hitSlop={HS}>
                    <Text style={s.trash}>🗑</Text>
                  </TouchableOpacity>
                </View>

                <View style={s.row}>
                  <TimeCell
                    value={toDisplay(row.open)}
                    onPress={() => openPicker(idx, "open")}
                  />
                  <Text style={s.to}>to</Text>
                  <TimeCell
                    value={toDisplay(row.close)}
                    onPress={() => openPicker(idx, "close")}
                  />
                </View>
              </View>
            );
          })}

          {rows.length < ALL_DAYS.length ? (
            <TouchableOpacity style={s.addBack} onPress={addMissingRows}>
              <Text style={s.addBackTxt}>Restore removed days</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {/* Footer */}
      <View style={s.footer}>
        <TouchableOpacity 
          style={[s.doneBtn, isLoading && s.doneBtnDisabled]} 
          activeOpacity={0.9} 
          onPress={done}
          disabled={isLoading}
        >
          <Text style={s.doneTxt}>
            {isLoading ? "Saving..." : "Done"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time picker */}
      <TimePickerModal
        visible={editing.visible}
        initial={editing.value ?? DEFAULT_OPEN}
        onClose={closePicker}
        onApply={applyPicker}
      />
    </SafeAreaView>
  );
}

/* ----- styles ----- */
const HS = { top: 8, bottom: 8, left: 8, right: 8 };
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E6ECF5";
const CARD = "#F4F7FB";
const BLUE = "#0145FE";
const BLUE_SOFT = "#E3EBFF";
const WHITE = "#FFFFFF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  header: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  headerTitle: { color: TEXT, fontSize: 16, fontFamily: "RCB-SemiBold" },

  introWrap: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  intro: { textAlign: "center", color: MUTED, fontFamily: "RCB-Regular", lineHeight: 18 },
  tabs: {
    marginTop: 10,
    backgroundColor: BLUE_SOFT,
    padding: 4,
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    alignSelf: "center",
  },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  tabBtnActive: { backgroundColor: BLUE },
  tabBtnInactive: { backgroundColor: "transparent" },
  tabTxt: { fontFamily: "RCB-SemiBold" },
  tabTxtActive: { color: "#fff" },
  tabTxtInactive: { color: TEXT },

  sectionTitle: {
    marginBottom: 8,
    color: TEXT,
    fontFamily: "RCB-SemiBold",
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  dayLabel: { color: TEXT, fontFamily: "RCB-SemiBold" },
  trash: { fontSize: 18, color: "#7686A3" },

  row: { flexDirection: "row", alignItems: "center" },
  to: { marginHorizontal: 10, color: MUTED, fontFamily: "RCB-SemiBold" },

  cell: {
    flex: 1,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#EAF1FF",
    borderWidth: 1,
    borderColor: "#D9E6FF",
    flexDirection: "row",
    alignItems: "center",
  },
  clock: { width: 16, height: 16, tintColor: "#6D7D96", marginRight: 6, resizeMode: "contain" },
  cellTxt: { flex: 1, color: TEXT, fontFamily: "RCB-SemiBold" },
  caret: { width: 14, height: 14, tintColor: "#6D7D96", resizeMode: "contain" },

  addBack: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  addBackTxt: {
    color: BLUE,
    fontFamily: "RCB-SemiBold",
    textDecorationLine: "underline",
  },

  footer: { padding: 16 },
  doneBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnDisabled: {
    backgroundColor: "#BFD0FF",
  },
  doneTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },

  /* picker modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
  },
  modalTitle: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16, marginBottom: 8 },

  pickersRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  colon: { color: TEXT, fontFamily: "RCB-SemiBold", marginHorizontal: 6 },

  wheel: {
    height: 144,
    width: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F7FAFF",
  },
  wheelItem: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelItemActive: {
    backgroundColor: "#EAF1FF",
  },
  wheelTxt: { color: "#6C7A92", fontFamily: "RCB-Regular" },
  wheelTxtActive: { color: TEXT, fontFamily: "RCB-SemiBold" },

  apWrap: {
    height: 144,
    width: 82,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F7FAFF",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  apBtn: {
    marginHorizontal: 10,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  apBtnActive: { backgroundColor: "#EAF1FF", borderWidth: 1, borderColor: "#D9E6FF" },
  apTxt: { color: "#6C7A92", fontFamily: "RCB-Regular" },
  apTxtActive: { color: TEXT, fontFamily: "RCB-SemiBold" },

  modalBtns: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },
  modalApply: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  modalApplyTxt: { color: WHITE, fontFamily: "RCB-SemiBold" },
});