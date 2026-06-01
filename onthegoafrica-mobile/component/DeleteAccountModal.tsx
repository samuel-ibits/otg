// components/modals/DeleteAccountModal.tsx
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
  onDelete: () => void;
  onCancel: () => void;
  onClose?: () => void;
};

export default function DeleteAccountModal({
  visible,
  onDelete,
  onCancel,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose || onCancel}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <TouchableOpacity style={s.close} onPress={onClose || onCancel} activeOpacity={0.85}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <View style={s.r3}>
            <View style={s.r2}>
              <View style={s.r1}>
                <View style={s.core}>
                  <Text style={s.i}>i</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={s.title}>Delete account?</Text>
          <Text style={s.desc}>
            You would be able to appeal for your account in the next 48 hours after which, your account would be totally deleted.
          </Text>

          <View style={s.row}>
            <TouchableOpacity style={s.grayBtn} onPress={onCancel} activeOpacity={0.9}>
              <Text style={s.grayTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.redBtn} onPress={onDelete} activeOpacity={0.9}>
              <Text style={s.redTxt}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* styles */
const TEXT = "#0A1220";
const RED = "#E11D48";

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

  r3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(225,29,72,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  r2: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(225,29,72,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  r1: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(225,29,72,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  i: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: Platform.OS === "ios" ? 20 : 22,
  },

  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 22, marginBottom: 8 },
  desc: {
    color: "#6B7C97",
    textAlign: "center",
    fontFamily: "RCB-Medium",
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 16,
  },

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

  redBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  redTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
