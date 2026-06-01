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
  onAccept: () => void;
  onDecline: () => void;
  onClose?: () => void;
};

export default function MessageRequestModal({
  visible,
  onAccept,
  onDecline,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Close */}
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.85}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Info badge (soft concentric rings) */}
          <View style={s.badge3}>
            <View style={s.badge2}>
              <View style={s.badge1}>
                <View style={s.badgeCore}>
                  <Text style={s.info}>i</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Title + subtitle */}
          <Text style={s.title}>Would you like to accept{"\n"}this message request?</Text>
          <Text style={s.sub}>
            You haven’t heard from this person{"\n"}before. Accept to start chatting.
          </Text>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.ghostBtn} onPress={onDecline} activeOpacity={0.9}>
              <Text style={s.ghostTxt}>Not Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.primaryBtn} onPress={onAccept} activeOpacity={0.9}>
              <Text style={s.primaryTxt}>Accept</Text>
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
const MUTED = "#6F7F99";

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

  // concentric info
  badge3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(10,89,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badge2: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(10,89,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge1: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(10,89,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7C92C0",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: Platform.OS === "ios" ? 20 : 22,
    fontWeight: "700",
  },

  title: {
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 6,
  },
  sub: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },

  actions: {
    alignSelf: "stretch",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 2,
  },
  ghostBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostTxt: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },

  primaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
