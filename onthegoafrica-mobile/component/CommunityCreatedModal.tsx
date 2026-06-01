import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";

type Props = {
  visible: boolean;
  onInvite?: () => void;
  onClose?: () => void;
  onBroadcastHelpPress?: () => void; // optional override for the “Broadcast” link
};

export default function CommunityCreatedModal({
  visible,
  onInvite,
  onClose,
  onBroadcastHelpPress,
}: Props) {
  const handleBroadcastPress = () => {
    if (onBroadcastHelpPress) return onBroadcastHelpPress();
    // Fallback to a placeholder link
    Linking.openURL("https://example.com/broadcast").catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Floating close */}
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Success badge */}
          <View style={s.badgeOuter2}>
            <View style={s.badgeOuter1}>
              <View style={s.badgeCore}>
                <Text style={s.tick}>✓</Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={s.title}>
            Community Created{"\n"}successfully
          </Text>

          {/* Body copy */}
          <Text style={s.body}>
            Share and interact with people in your carefully crafted space, a
            safe haven to meet like minds. Messages you share here clear after
            24 hours, with the{" "}
            <Text style={s.link} onPress={handleBroadcastPress}>
              “Broadcast”
            </Text>{" "}
            feature your messages last longer!
          </Text>

          {/* CTA */}
          <TouchableOpacity style={s.cta} onPress={onInvite} activeOpacity={0.9}>
            <Text style={s.ctaText}>Invite friends</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- styles ---------------- */

const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const GREEN = "#1FB767";

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 22,
    minHeight: 420,
    alignItems: "center",
  },

  // floating close button
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  closeX: { fontSize: 24, lineHeight: Platform.OS === "ios" ? 24 : 26, color: "#617291" },

  // concentric success badge
  badgeOuter2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(31,183,103,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  badgeOuter1: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "rgba(31,183,103,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCore: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  tick: { color: "#FFFFFF", fontSize: 34, lineHeight: 36, fontWeight: "700" },

  title: {
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  body: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
    marginBottom: 22,
  },
  link: {
    color: BLUE,
    fontFamily: "RCB-SemiBold",
  },

  cta: {
    backgroundColor: BLUE,
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  ctaText: {
    color: "#FFFFFF",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
});
