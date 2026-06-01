// components/modals/ConfirmLogoutModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void; // close icon
};

export default function ConfirmLogoutModal({
  visible,
  onConfirm,
  onCancel,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose || onCancel}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Close */}
          <TouchableOpacity style={s.close} onPress={onClose || onCancel} activeOpacity={0.85}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Info badge */}
          <View style={s.ring3}>
            <View style={s.ring2}>
              <View style={s.ring1}>
                <View style={s.core}>
                  <Text style={s.i}>i</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={s.title}>Log out?</Text>

          <View style={s.row}>
            <TouchableOpacity style={s.grayBtn} onPress={onCancel} activeOpacity={0.9}>
              <Text style={s.grayTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.blueBtn} onPress={onConfirm} activeOpacity={0.9}>
              <Text style={s.blueTxt}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* styles */
const BLUE = "#0A59FF";
const TEXT = "#0A1220";

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  close: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, lineHeight: 22, color: "#657A9A" },

  // concentric info rings
  ring3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(99,102,241,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  ring2: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(99,102,241,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  ring1: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(99,102,241,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6474A6",
    alignItems: "center",
    justifyContent: "center",
  },
  i: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: Platform.OS === "ios" ? 20 : 22,
  },

  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 22, marginTop: 12, marginBottom: 20 },

  row: { flexDirection: "row", gap: 12, alignSelf: "stretch" },
  grayBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  grayTxt: { color: "#2B3A55", fontFamily: "RCB-SemiBold", fontSize: 16 },

  blueBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  blueTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
