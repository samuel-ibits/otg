// components/modals/UpgradeToPremiumModal.tsx
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
  onUpgrade: () => void;
  onLater: () => void;
  onClose?: () => void; // close icon
};

export default function UpgradeToPremiumModal({
  visible,
  onUpgrade,
  onLater,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Close */}
          <TouchableOpacity
            style={s.close}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Orange badge with crown */}
          <View style={s.ring3}>
            <View style={s.ring2}>
              <View style={s.ring1}>
                <View style={s.core}>
                  <Text style={s.crown}>👑</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Copy */}
          <Text style={s.title}>Upgrade account to{"\n"}send individual chat</Text>
          <Text style={s.subtitle}>
            Upgrade to premium plan to send personal{"\n"}chat to your customers.
          </Text>

          {/* Primary CTA */}
          <TouchableOpacity
            style={s.primary}
            onPress={onUpgrade}
            activeOpacity={0.9}
          >
            <Text style={s.bolt}>⚡</Text>
            <Text style={s.primaryTxt}>Upgrade to premium</Text>
          </TouchableOpacity>

          {/* Tertiary CTA */}
          <TouchableOpacity
            style={s.later}
            onPress={onLater}
            activeOpacity={0.7}
          >
            <Text style={s.laterTxt}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* styles */
const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const SUB = "#6B7A90";
const ORANGE = "#F59E0B";

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

  // concentric orange rings
  ring3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(245,158,11,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  ring2: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(245,158,11,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  ring1: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(245,158,11,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  crown: {
    fontSize: 28,
    lineHeight: Platform.OS === "ios" ? 28 : 30,
  },

  title: {
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    color: SUB,
    fontFamily: "RCB-Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
  },

  primary: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  bolt: { color: "#FFFFFF", fontSize: 16, marginRight: 8 },
  primaryTxt: {
    color: "#FFFFFF",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },

  later: { marginTop: 14 },
  laterTxt: {
    color: "#0A1220",
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
    opacity: 0.7,
  },
});
