import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

type Props = {
  visible: boolean;
  onLeave: () => void;
  onCancel: () => void;
  onClose?: () => void; // close icon
};

export default function LeaveCommunityModal({
  visible,
  onLeave,
  onCancel,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* floating close */}
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.85}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* info badge */}
          <View style={s.badge3}>
            <View style={s.badge2}>
              <View style={s.badge1}>
                <View style={s.badgeCore}>
                  <Text style={s.info}>i</Text>
                </View>
              </View>
            </View>
          </View>

          {/* title + body */}
          <Text style={s.title}>Leave Community?</Text>
          <Text style={s.body}>
            Are you sure you want to leave this{"\n"}community?
          </Text>

          {/* actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.9}>
              <Text style={s.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.leaveBtn} onPress={onLeave} activeOpacity={0.9}>
              <Text style={s.leaveTxt}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* styles */

const TEXT = "#0A1220";
const MUTED = "#63708A";
const RED = "#E03137";

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
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  // close
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
  closeX: { fontSize: 22, lineHeight: 22, color: "#617291" },

  // concentric warning badge
  badge3: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(224,49,55,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badge2: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: "rgba(224,49,55,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge1: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(224,49,55,0.26)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: RED,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  info: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: Platform.OS === "ios" ? 22 : 24,
    fontWeight: "700",
  },

  title: {
    color: TEXT,
    fontSize: 20,
    fontFamily: "RCB-Bold",
    marginTop: 6,
    marginBottom: 6,
  },
  body: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 18,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
    paddingHorizontal: 2,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelTxt: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },

  leaveBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
