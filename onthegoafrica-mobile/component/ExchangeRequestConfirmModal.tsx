// components/modals/ExchangeRequestConfirmModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

type Reward = {
  id: string;
  percent: number;
  brand: string;
  validDays: string;
};

type Props = {
  visible: boolean;
  reward: Reward | null;
  onCancel: () => void;
  onConfirm: (r: Reward) => void;
};

const BRAND = require("../assets/icons/cafe.jpeg");

export default function ExchangeRequestConfirmModal({
  visible,
  reward,
  onCancel,
  onConfirm,
}: Props) {
  if (!reward) return null;

    const handleConfirm = () => {
    onConfirm(reward);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <TouchableOpacity style={s.close} onPress={onCancel}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>
            Do you want to send a request{"\n"}for this reward voucher?
          </Text>

          <View style={s.card}>
            <Text style={s.percent}>{reward.percent}% OFF</Text>

            <View style={s.brandRow}>
              <Image source={BRAND} style={s.brandImg} />
              <Text style={s.brandName} numberOfLines={1}>
                {reward.brand}
              </Text>
            </View>

            <View style={s.dash} />
            <Text style={s.valid}>Validity - {reward.validDays}</Text>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity style={s.ghostBtn} onPress={onCancel} activeOpacity={0.9}>
              <Text style={s.ghostTxt}>No, cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.primaryBtn}
               onPress={handleConfirm}
              activeOpacity={0.9}
            >
              <Text style={s.primaryTxt}>Yes, request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const TEXT = "#0A1220";
const BLUE = "#0A59FF";
const SUB = "#6B7C97";
const BORDER = "#D6E1FF";

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 26,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, color: "#64748B", lineHeight: 22 },

  title: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#EAF1FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  percent: { color: BLUE, fontSize: 22, fontWeight: "900", marginBottom: 10 },
  brandRow: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFD0FF",
    backgroundColor: "#EAF0FF",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  brandImg: { width: 22, height: 22, borderRadius: 11, marginRight: 8 },
  brandName: { color: TEXT, fontSize: 16, fontWeight: "700", flexShrink: 1 },

  dash: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#BFD0FF",
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 1,
  },
  valid: { color: SUB, fontWeight: "600" },

  btnRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  ghostBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EFF3FB",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostTxt: { color: TEXT, fontSize: 16, fontWeight: "700" },
  primaryBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});
