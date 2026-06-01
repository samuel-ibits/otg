import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => Promise<void> | void; // send reset link
  defaultEmail?: string;
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const INPUT_BG = "#F5F7FA";
const INPUT_BORDER = "#E8EDF5";
const ERROR = "#B00020";
const SUCCESS = "#0E8A47";

export default function ForgotPasswordModal({
  visible,
  onClose,
  onSubmit,
  defaultEmail,
}: Props) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ t: "error" | "ok"; text: string } | null>(
    null
  );

  useEffect(() => {
    if (!visible) {
      setMsg(null);
      setLoading(false);
      setEmail(defaultEmail ?? "");
    }
  }, [visible, defaultEmail]);

  function valid(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  }

  async function handleSend() {
    const e = email.trim();
    if (!valid(e)) {
      setMsg({ t: "error", text: "Enter a valid email." });
      return;
    }
    setMsg(null);
    setLoading(true);
    try {
      await onSubmit?.(e);
      setMsg({
        t: "ok",
        text: "If this email exists, a reset link has been sent.",
      });
    } catch (err: any) {
      setMsg({
        t: "error",
        text: err?.message || "Could not send reset link. Try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={s.overlay}
      >
        <View style={s.sheet}>
          {/* Close */}
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>Forgot password</Text>
          <Text style={s.body}>
            Enter your account email. We’ll send a password reset link.
          </Text>

          <View style={s.inputWrap}>
            <Text style={s.inputLabel}>Email address</Text>
            <TextInput
              style={s.textInput}
              placeholder="email"
              placeholderTextColor="#A8B5C8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </View>

          {msg ? (
            <Text style={[s.msg, msg.t === "error" ? s.msgErr : s.msgOk]}>
              {msg.text}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[s.cta, loading && { opacity: 0.7 }]}
            onPress={handleSend}
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.ctaText}>Send reset link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={s.secondary} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.secondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

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
    paddingBottom: 24,
    paddingHorizontal: 22,
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
  closeX: { fontSize: 24, lineHeight: Platform.OS === "ios" ? 24 : 26, color: "#617291" },
  title: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 20, textAlign: "center" },
  body: {
    color: MUTED,
    fontFamily: "RCB-Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  inputWrap: { marginBottom: 12 },
  inputLabel: { fontSize: 13, color: TEXT, fontFamily: "RCB-Medium", marginBottom: 6 },
  textInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: TEXT,
    fontFamily: "RCB-Regular",
  },
  msg: { marginTop: 6, fontSize: 13, textAlign: "center" },
  msgErr: { color: ERROR, fontFamily: "RCB-Medium" },
  msgOk: { color: SUCCESS, fontFamily: "RCB-Medium" },
  cta: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BLUE,
    marginTop: 8,
  },
  ctaText: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
  secondary: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E3E9F3",
  },
  secondaryText: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 15 },
});
