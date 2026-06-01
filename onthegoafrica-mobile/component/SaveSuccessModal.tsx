// components/modals/SaveSuccessModal.tsx
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
  onDone: () => void;
  onClose?: () => void; // close icon
};

export default function SaveSuccessModal({ visible, onDone, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Close */}
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.85}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Success badge */}
          <View style={s.ring3}>
            <View style={s.ring2}>
              <View style={s.ring1}>
                <View style={s.core}>
                  <Text style={s.tick}>✓</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={s.title}>Changes saved</Text>

          <TouchableOpacity style={s.primary} onPress={onDone} activeOpacity={0.9}>
            <Text style={s.primaryTxt}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* styles */
const BLUE = "#0A59FF";
const TEXT = "#0A1220";

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
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

  // concentric green rings
  ring3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16,185,129,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  ring2: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(16,185,129,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  ring1: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(16,185,129,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: Platform.OS === "ios" ? 22 : 24,
    fontWeight: "800",
  },

  title: {
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    fontSize: 20,
    marginTop: 4,
    marginBottom: 18,
  },

  primary: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: {
    color: "#FFFFFF",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
});
