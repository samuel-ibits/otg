// screens/registration/business/AddTicketScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

type OnSaveParam = (t: { duration: string; price: string }) => void;

type RouteParams = {
  onSave?: OnSaveParam; // optional callback provided by previous screen
};

const I = {
  back: require("../../../assets/icons/back.png"),
  chevron: require("../../../assets/icons/down.png"), // or any down-caret you have
  naira: require("../../../assets/icons/naira.png"), // optional. fallback to text if missing
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#62718C";
const BORDER = "#E6EDF7";
const INPUT_BG = "#F3F7FE";

export default function AddTicketScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const onSaveCb: OnSaveParam | undefined = route.params?.onSave;

  const qtyOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), []);
  const unitOptions = useMemo(() => ["Minutes", "Hours", "Days"], []);

  const [qty, setQty] = useState("1");
  const [unit, setUnit] = useState<"Minutes" | "Hours" | "Days">("Hours");
  const [price, setPrice] = useState("");

  const [showQty, setShowQty] = useState(false);
  const [showUnit, setShowUnit] = useState(false);

  const durationLabel = `${qty}${unit === "Minutes" ? "min" : unit === "Hours" ? "hr" : "day"}${
    qty === "1" ? "" : unit === "Minutes" ? "s" : unit === "Hours" ? "s" : "s"
  }`;

  const onSave = () => {
    if (!price.trim()) {
      Alert.alert("Missing price", "Enter a price.");
      return;
    }
    const payload = { duration: durationLabel, price: `₦${price.trim()}` };
    onSaveCb?.(payload);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={I.back} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Add ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 12, android: 0 })}
      >
        <View style={s.body}>
          <Text style={s.label}>Duration</Text>

          <View style={s.row}>
            <Select
              value={qty}
              placeholder="1"
              onPress={() => setShowQty(true)}
              style={{ flex: 1, marginRight: 12 }}
            />
            <Select value={unit} onPress={() => setShowUnit(true)} style={{ flex: 1 }} />
          </View>

          <Text style={[s.label, { marginTop: 18 }]}>Price</Text>
          <View style={s.priceWrap}>
            <Text style={s.naira}>₦</Text>
            <TextInput
              value={price}
              onChangeText={(t) => setPrice(t.replace(/[^\d]/g, ""))}
              keyboardType="number-pad"
              placeholder="Enter price"
              placeholderTextColor="#9FB1CC"
              style={s.priceInput}
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={s.footer}>
          <TouchableOpacity activeOpacity={0.9} onPress={onSave} style={s.cta}>
            <Text style={s.ctaText}>Save ticket</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Quantity picker */}
      <PickerModal
        visible={showQty}
        title="Select quantity"
        data={qtyOptions}
        onClose={() => setShowQty(false)}
        onSelect={(v) => {
          setQty(v);
          setShowQty(false);
        }}
      />

      {/* Unit picker */}
      <PickerModal
        visible={showUnit}
        title="Select unit"
        data={unitOptions}
        onClose={() => setShowUnit(false)}
        onSelect={(v) => {
          setUnit(v as any);
          setShowUnit(false);
        }}
      />
    </SafeAreaView>
  );
}

/* small components */

function Select({
  value,
  placeholder,
  onPress,
  style,
}: {
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  style?: any;
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[s.select, style]}>
      <Text style={[s.selectText, value ? { color: TEXT } : { color: "#9FB1CC" }]}>{value || placeholder}</Text>
      <Image source={I.chevron} style={s.chev} />
    </TouchableOpacity>
  );
}

function PickerModal({
  visible,
  title,
  data,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  data: string[];
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalBackdrop}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(x) => x}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)} style={s.modalItem}>
                <Text style={s.modalItemTxt}>{item}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
          <TouchableOpacity onPress={onClose} style={s.modalCancel}>
            <Text style={s.modalCancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* styles */

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

  body: { paddingHorizontal: 16, paddingTop: 18 },

  label: { color: TEXT, fontWeight: "700", marginBottom: 8 },

  row: { flexDirection: "row" },

  select: {
    height: 48,
    borderRadius: 12,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  selectText: { fontSize: 14, color: TEXT, fontWeight: "600" },
  chev: { width: 14, objectFit:'contain', tintColor: "#8AA0BE" },

  priceWrap: {
    height: 48,
    borderRadius: 24,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  naira: { color: "#4B5875", fontWeight: "800", marginRight: 8 },
  priceInput: { flex: 1, color: TEXT, fontSize: 14 },

  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },

  /* modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
  },
  modalTitle: { color: TEXT, fontWeight: "800", fontSize: 16, marginBottom: 12 },
  modalItem: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemTxt: { color: TEXT, fontWeight: "700" },
  modalCancel: { alignSelf: "center", paddingVertical: 14 },
  modalCancelTxt: { color: MUTED, fontWeight: "700" },
});
