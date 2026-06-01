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

export default function TermsModal({ visible, onClose }: Props) {
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

          <Text style={s.title}>Terms & Conditions</Text>

          <ScrollView
            style={s.scroll}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator
          >
            <Text style={s.h}>1. Acceptance</Text>
            <Text style={s.p}>
              By creating an account or using this app, you agree to these Terms.
              If you do not agree, do not use the service.
            </Text>

            <Text style={s.h}>2. Eligibility</Text>
            <Text style={s.p}>
              You confirm you are legally permitted to use the service in your
              jurisdiction and you provide accurate information.
            </Text>

            <Text style={s.h}>3. Use of Service</Text>
            <Text style={s.p}>
              Do not misuse the service. No illegal activity, harassment, or
              attempts to disrupt or reverse engineer the app.
            </Text>

            <Text style={s.h}>4. Accounts</Text>
            <Text style={s.p}>
              You are responsible for your credentials and all activity under
              your account.
            </Text>

            <Text style={s.h}>5. Content</Text>
            <Text style={s.p}>
              You retain rights to your content. You grant us a limited license
              to operate and improve the service.
            </Text>

            <Text style={s.h}>6. Termination</Text>
            <Text style={s.p}>
              We may suspend or terminate access for violations or risks to the
              service. You may stop using the service at any time.
            </Text>

            <Text style={s.h}>7. Disclaimers</Text>
            <Text style={s.p}>
              Service is provided “as is”. To the extent permitted by law, we
              disclaim warranties of any kind.
            </Text>

            <Text style={s.h}>8. Limitation of Liability</Text>
            <Text style={s.p}>
              We are not liable for indirect, incidental, or consequential
              damages. Aggregate liability is limited to the amount you paid in
              the last 12 months.
            </Text>

            <Text style={s.h}>9. Changes</Text>
            <Text style={s.p}>
              We may update these Terms. Continued use means you accept the new
              Terms.
            </Text>

            <Text style={s.h}>10. Contact</Text>
            <Text style={s.p}>
              Questions about these Terms? Contact support in the app.
            </Text>
          </ScrollView>

          <TouchableOpacity style={s.cta} onPress={onClose} activeOpacity={0.9}>
            <Text style={s.ctaText}>I Understand</Text>
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
