import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

type Provider = "apple" | "instagram" | "google";

type Props = {
  visible: boolean;
  provider: Provider | null;
  onConfirm?: (p: Provider) => void;
  onClose?: () => void;
};

const BRAND: Record<
  Provider,
  { label: string; icon: any; color: string; hint: string }
> = {
  apple: {
    label: "Continue with Apple",
    icon: require("../assets/icons/apple.png"),
    color: "#000000",
    hint: "Use your Apple ID to sign in.",
  },
  instagram: {
    label: "Continue with Instagram",
    icon: require("../assets/icons/instagram.png"),
    color: "#C13584",
    hint: "Authorize with your Instagram account.",
  },
  google: {
    label: "Continue with Google",
    icon: require("../assets/icons/google.png"),
    color: "#0145FE",
    hint: "Use your Google account to sign in.",
  },
};

export default function SocialAuthModal({
  visible,
  provider,
  onConfirm,
  onClose,
}: Props) {
  if (!provider) return null;
  const brand = BRAND[provider];

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
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Brand pill */}
          <View style={[s.brandPill, { borderColor: brand.color }]}>
            <Image source={brand.icon} style={s.brandIcon} resizeMode="contain" />
            <Text style={[s.brandText, { color: brand.color }]}>
              {brand.label}
            </Text>
          </View>

          {/* Title */}
          <Text style={s.title}>Confirm login</Text>

          {/* Body */}
          <Text style={s.body}>
            {brand.hint} We’ll redirect you to complete authentication, then bring you
            back here.
          </Text>

          {/* Actions */}
          <TouchableOpacity
            style={[s.cta, { backgroundColor: brand.color }]}
            activeOpacity={0.9}
            onPress={() => onConfirm && onConfirm(provider)}
          >
            <Text style={s.ctaText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondary} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.secondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- styles ---------------- */

const TEXT = "#0A1220";
const MUTED = "#6C7A92";

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
    minHeight: 340,
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  closeX: {
    fontSize: 24,
    lineHeight: Platform.OS === "ios" ? 24 : 26,
    color: "#617291",
  },
  brandPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  brandIcon: { width: 22, height: 22, marginRight: 8 },
  brandText: { fontFamily: "RCB-SemiBold", fontSize: 14 },
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
    maxWidth: 320,
    marginBottom: 22,
  },
  cta: {
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
  secondary: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E3E9F3",
  },
  secondaryText: {
    color: "#0A1220",
    fontFamily: "RCB-SemiBold",
    fontSize: 15,
  },
});
