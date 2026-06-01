// components/modals/RedeemQrModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

type Props = {
  visible: boolean;
  value: string; // encode voucher id or redeem token
  onClose: () => void;
};

export default function RedeemQrModal({ visible, value, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.85}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <View style={s.cardShadow}>
            <View style={s.qrCard}>
              <QRCode value={value} size={240} backgroundColor="#FFFFFF" color="#000000" />
            </View>
          </View>

          <Text style={s.title}>Your Qr Code</Text>
          <Text style={s.caption}>
            Share your qr code with seller to{"\n"}redeem the rewards.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

/* styles */
const TEXT = "#0A1220";

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, lineHeight: 22, color: "#657A9A" },

  cardShadow: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: "rgba(24,119,242,0.06)",
    shadowColor: "#2B6EF7",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  qrCard: {
    width: 280,
    height: 280,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 18,
    color: TEXT,
    fontSize: 24,
    fontWeight: "700",
  },
  caption: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7C97",
    lineHeight: 20,
    fontWeight: Platform.OS === "ios" ? "600" : "500",
  },
});