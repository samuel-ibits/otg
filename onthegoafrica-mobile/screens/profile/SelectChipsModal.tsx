import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  options: string[];        // all available chips
  selected: string[];       // currently selected
  onSave: (next: string[]) => void;
  onClose: () => void;
};

export default function SelectChipsModal({
  visible,
  title,
  options,
  selected,
  onSave,
  onClose,
}: Props) {
  const initial = useMemo(() => new Set(selected), [selected]);
  const [picked, setPicked] = useState<Set<string>>(initial);

  useEffect(() => setPicked(new Set(selected)), [selected, visible]);

  const toggle = (label: string) => {
    const s = new Set(picked);
    s.has(label) ? s.delete(label) : s.add(label);
    setPicked(s);
  };

  const save = () => onSave(Array.from(picked));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.head}>
            <Text style={s.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.close}>
              <Text style={s.closeX}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
            <View style={s.pillsWrap}>
              {options.map((opt) => {
                const active = picked.has(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => toggle(opt)}
                    style={[s.pill, active && s.pillActive]}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.pillTxt, active && s.pillTxtActive]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity style={s.primary} onPress={save} activeOpacity={0.9}>
            <Text style={s.primaryTxt}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const BLUE = "#0A59FF";
const BORDER = "#E6ECF5";
const TEXT = "#0A1220";

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: "80%",
  },
  head: { paddingTop: 6, paddingBottom: 8 },
  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, lineHeight: 22, color: "#657A9A" },

  body: { paddingTop: 6, paddingBottom: 10 },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  pillActive: { backgroundColor: "#E9F0FF", borderColor: "#CFE0FF" },
  pillTxt: { color: "#334155", fontFamily: "RCB-SemiBold" },
  pillTxtActive: { color: "#143A8C" },

  primary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryTxt: { color: "#FFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
