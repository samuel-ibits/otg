import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PrivacyPolicyModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>Privacy Policy</Text>

          <ScrollView
            style={s.scroll}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator
          >
            <Text style={s.h}>1. Data We Collect</Text>
            <Text style={s.p}>
              We collect account details you provide and usage data generated
              while using the app. Some features may request device permissions.
            </Text>

            <Text style={s.h}>2. How We Use Data</Text>
            <Text style={s.p}>
              We use data to provide, secure, and improve the service, personalize
              features, and communicate with you.
            </Text>

            <Text style={s.h}>3. Sharing</Text>
            <Text style={s.p}>
              We do not sell personal data. We share with processors that help us
              operate the service, subject to contractual safeguards.
            </Text>

            <Text style={s.h}>4. Storage & Security</Text>
            <Text style={s.p}>
              We use industry-standard security. No method is 100% secure. You
              are responsible for maintaining account security.
            </Text>

            <Text style={s.h}>5. Your Choices</Text>
            <Text style={s.p}>
              You can access, update, or delete certain data from settings or
              via support. You can opt out of non-essential notifications.
            </Text>

            <Text style={s.h}>6. International Transfers</Text>
            <Text style={s.p}>
              Data may be processed in other countries with appropriate
              protections in place.
            </Text>

            <Text style={s.h}>7. Retention</Text>
            <Text style={s.p}>
              We keep data only as long as needed for the purposes described or
              as required by law.
            </Text>

            <Text style={s.h}>8. Changes</Text>
            <Text style={s.p}>
              We may update this policy. Significant changes will be communicated
              in-app or by email.
            </Text>

            <Text style={s.h}>9. Contact</Text>
            <Text style={s.p}>
              Questions about privacy? Contact support in the app.
            </Text>
          </ScrollView>

          <TouchableOpacity style={s.cta} onPress={onClose} activeOpacity={0.9}>
            <Text style={s.ctaText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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
    paddingBottom: 16,
    paddingHorizontal: 22,
    maxHeight: "90%",
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
  title: {
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  scroll: {
    maxHeight: 420,
  },
  h: {
    marginTop: 14,
    marginBottom: 6,
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    fontSize: 15,
  },
  p: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  cta: {
    marginTop: 12,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0145FE",
  },
  ctaText: {
    color: "#FFFFFF",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
  },
});
