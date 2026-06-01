// components/modals/PhoneLoginModal.tsx
import React, { useEffect, useState } from "react";
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
  onLogin: (phone: string, password: string) => Promise<void> | void;
  initialPhone?: string;
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const INPUT_BG = "#F5F7FA";
const INPUT_BORDER = "#E8EDF5";
const ERROR = "#B00020";

export default function PhoneLoginModal({
  visible,
  onClose,
  onLogin,
  initialPhone,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setStep(1);
      setPhone(initialPhone ?? "");
      setPassword("");
      setErr(null);
      setLoading(false);
      setShowPassword(false);
    }
  }, [visible, initialPhone]);

  const validPhone = (p: string) => p.replace(/[^\d+]/g, "").length >= 8;

  const goNext = () => {
    const p = phone.trim();
    if (!validPhone(p)) {
      setErr("Enter a valid phone number.");
      return;
    }
    setErr(null);
    setStep(2);
  };

  const doLogin = async () => {
    const p = phone.trim();
    const pw = password.trim();
    if (!validPhone(p)) return setErr("Enter a valid phone number.");
    if (!pw) return setErr("Enter your password.");

    setErr(null);
    setLoading(true);
    try {
      await onLogin(p, pw);
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={s.overlay}
      >
        <View style={s.sheet}>
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>Login with phone</Text>

          {/* Step indicator */}
          <View style={s.steps}>
            <View style={[s.dot, step === 1 && s.dotActive]} />
            <View style={[s.dot, step === 2 && s.dotActive]} />
          </View>

          {step === 1 ? (
            <View style={{ width: "100%" }}>
              <Text style={s.label}>Phone number</Text>
              <TextInput
                style={s.input}
                placeholder="+234 801 234 5678"
                placeholderTextColor="#A8B5C8"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={goNext}
              />
              {err ? <Text style={s.err}>{err}</Text> : null}

              <TouchableOpacity style={s.cta} onPress={goNext} activeOpacity={0.9}>
                <Text style={s.ctaText}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.secondary} onPress={onClose} activeOpacity={0.8}>
                <Text style={s.secondaryText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: "100%" }}>
              <Text style={s.caption}>Phone</Text>
              <Text style={s.phoneChip}>{phone}</Text>

              <Text style={[s.label, { marginTop: 14 }]}>Password</Text>
              <View style={s.passwordWrap}>
                <TextInput
                  style={s.passwordInput}
                  placeholder="Enter password"
                  placeholderTextColor="#A8B5C8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={doLogin}
                />
                <TouchableOpacity
                  style={s.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: MUTED }}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>

              {err ? <Text style={s.err}>{err}</Text> : null}

              <TouchableOpacity
                style={[s.cta, loading && { opacity: 0.7 }]}
                onPress={doLogin}
                activeOpacity={0.9}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.ctaText}>Login</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={s.secondary} onPress={() => setStep(1)} activeOpacity={0.8}>
                <Text style={s.secondaryText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
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
  steps: { flexDirection: "row", gap: 8, justifyContent: "center", marginVertical: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#E3E9F3" },
  dotActive: { backgroundColor: BLUE },

  label: { fontSize: 13, color: TEXT, fontFamily: "RCB-Medium", marginBottom: 6 },
  input: {
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
  caption: { color: MUTED, fontSize: 12, marginTop: 4, marginBottom: 2, textAlign: "center" },
  phoneChip: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    color: TEXT,
    fontFamily: "RCB-SemiBold",
  },

  passwordWrap: { position: "relative" },
  passwordInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 60,
    fontSize: 16,
    color: TEXT,
    fontFamily: "RCB-Regular",
  },
  eyeBtn: { position: "absolute", right: 16, top: 0, height: 56, justifyContent: "center" },

  err: { color: ERROR, marginTop: 8, marginBottom: 8, textAlign: "center", fontFamily: "RCB-Medium" },

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
