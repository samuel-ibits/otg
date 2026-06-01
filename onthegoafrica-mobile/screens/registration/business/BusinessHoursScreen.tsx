import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { addOpeningHours, getProfileId } from "../../../api/api"; // Import the API functions

const BACK_ICON = require("../../../assets/icons/back.png");
const CLOCK_ICON = require("../../../assets/icons/clock.png");
const CARET_ICON = require("../../../assets/icons/down.png");

type Meridiem = "AM" | "PM";
type Time = { h: number; m: number; ap: Meridiem };
type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const DAYS: { key: DayKey; label: string }[] = [
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

export default function BusinessHoursScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = React.useState(false);

  const [hours, setHours] = React.useState<
    Record<DayKey, { open: Time; close: Time }>
  >(() => {
    const base: any = {};
    for (const d of DAYS)
      base[d.key] = { open: { ...DEFAULT_OPEN }, close: { ...DEFAULT_CLOSE } };
    return base;
  });

  const [editing, setEditing] = React.useState<{
    visible: boolean;
    day?: DayKey;
    which?: "open" | "close";
    value?: Time;
  }>({ visible: false });

  const openPicker = (day: DayKey, which: "open" | "close") =>
    setEditing({ visible: true, day, which, value: { ...hours[day][which] } });

  const closePicker = () => setEditing({ visible: false });

  const applyPicker = (t: Time) => {
    if (!editing.day || !editing.which) return;
    setHours((prev) => ({
      ...prev,
      [editing.day!]: { ...prev[editing.day!], [editing.which!]: t },
    }));
    closePicker();
  };

  const toDisplay = (t: Time) => `${pad(t.h)}:${pad(t.m)} ${t.ap}`;
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Convert Time object to "HH:MM" format for API
  const timeToApiFormat = (time: Time): string => {
    let hour = time.h;
    if (time.ap === "PM" && hour !== 12) hour += 12;
    if (time.ap === "AM" && hour === 12) hour = 0;
    return `${pad(hour)}:${pad(time.m)}`;
  };

  const next = async () => {
    setIsLoading(true);
    try {
      // Get the profile ID from AsyncStorage
      const profileId = await getProfileId();

      if (!profileId) {
        Alert.alert(
          "Error",
          "Profile ID not found. Please create a profile first."
        );
        return;
      }

      // Convert hours to API format
      const hoursData = DAYS.map((day) => {
        const dayHours = hours[day.key];
        return {
          dayOfWeek: day.label.toLowerCase(), // Convert to lowercase: "monday", "tuesday", etc.
          openTime: timeToApiFormat(dayHours.open),
          closeTime: timeToApiFormat(dayHours.close),
        };
      });

      // Prepare data for API call
      const openingHoursData = {
        profileId: profileId,
        hours: hoursData,
      };

      // Call the API
      const response = await addOpeningHours(openingHoursData);

      // Show success message
      Alert.alert("Success", "Opening hours saved successfully!");

      // Navigate back to the setup list and mark this step complete
      // navigation.navigate("CreateBusinessProfile", { markDone: "hours" });
      navigation.navigate("BusinessNavigator", {
        screen: "BizHome",
      });
      // navigation.reset({
      //   index: 0, // Reset the stack to avoid going back to onboarding
      //   routes: [{ name: "BuisnessDashboard" }], // Navigate to the initial screen of the Dashboard stack
      // });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save opening hours");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={HS}>
          <Image source={BACK_ICON} style={s.back} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Opening and Closing Time</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {DAYS.map((d) => {
          const row = hours[d.key];
          return (
            <View key={d.key} style={s.card}>
              <Text style={s.dayLabel}>{d.label}</Text>

              <View style={s.row}>
                <TimeCell
                  labelLeft
                  value={toDisplay(row.open)}
                  onPress={() => openPicker(d.key, "open")}
                />
                <Text style={s.to}>to</Text>
                <TimeCell
                  value={toDisplay(row.close)}
                  onPress={() => openPicker(d.key, "close")}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.nextBtn, isLoading && s.nextBtnDisabled]}
          onPress={next}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          <Text style={s.nextTxt}>{isLoading ? "Saving..." : "Next"}</Text>
        </TouchableOpacity>
      </View>

      {/* Picker modal */}
      <TimePickerModal
        visible={editing.visible}
        initial={editing.value ?? DEFAULT_OPEN}
        onClose={closePicker}
        onApply={applyPicker}
      />
    </SafeAreaView>
  );
}

/* ---------- Small components ---------- */

function TimeCell({
  value,
  onPress,
  labelLeft,
}: {
  value: string;
  onPress: () => void;
  labelLeft?: boolean;
}) {
  return (
    <TouchableOpacity style={s.cell} onPress={onPress} activeOpacity={0.85}>
      <Image source={CLOCK_ICON} style={s.clock} />
      <Text style={s.cellTxt}>{value}</Text>
      <Image
        source={CARET_ICON}
        style={[s.caret, labelLeft && { marginLeft: 4 }]}
      />
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

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,...55

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
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
    const idx = Math.max(
      0,
      data.findIndex((x) => x === value)
    );
    setTimeout(
      () => ref.current?.scrollToIndex({ index: idx, animated: false }),
      0
    );
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

function MeridiemToggle({
  ap,
  onChange,
}: {
  ap: Meridiem;
  onChange: (m: Meridiem) => void;
}) {
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

/* ---------- styles ---------- */
const HS = { top: 8, bottom: 8, left: 8, right: 8 };

const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E6ECF5";
const CARD = "#F4F7FB";
const BLUE = "#0145FE";
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

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
  },
  dayLabel: { color: TEXT, fontFamily: "RCB-SemiBold", marginBottom: 10 },

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
  clock: {
    width: 16,
    height: 16,
    tintColor: "#6D7D96",
    marginRight: 6,
    resizeMode: "contain",
  },
  cellTxt: { flex: 1, color: TEXT, fontFamily: "RCB-SemiBold" },
  caret: { width: 14, height: 14, tintColor: "#6D7D96", resizeMode: "contain" },

  footer: { padding: 16 },
  nextBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnDisabled: {
    backgroundColor: "#BFD0FF",
  },
  nextTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },

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
  modalTitle: {
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
    marginBottom: 8,
  },

  pickersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
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
  wheelTxt: { color: MUTED, fontFamily: "RCB-Regular" },
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
  apBtnActive: {
    backgroundColor: "#EAF1FF",
    borderWidth: 1,
    borderColor: "#D9E6FF",
  },
  apTxt: { color: MUTED, fontFamily: "RCB-Regular" },
  apTxtActive: { color: TEXT, fontFamily: "RCB-SemiBold" },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F3F6FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6ECF5",
  },
  modalCancelTxt: {
    color: "#0A1220",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
  modalApply: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#0145FE",
    alignItems: "center",
    justifyContent: "center",
  },
  modalApplyTxt: {
    color: "#FFFFFF",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
});
