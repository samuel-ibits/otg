import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AccountCreatedModal from "./../../component/AccountCreatedModal";
import { verifyEmail, sendVerificationCode } from "../../api/api";

type VerifyResult = { ok?: boolean; message?: string };
type Props = {
  email?: string;
  onVerify?: (
    code: string,
    email: string
  ) => Promise<boolean | VerifyResult> | boolean | VerifyResult;
  onResendCode?: () => Promise<void> | void;
  onAccountCreated?: () => void;
};

export default function VerifyEmailScreen({
  email = "bo***@gmail.com",
  onVerify,
  onResendCode,
  onAccountCreated,
}: Props) {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const userEmail = route.params?.email || email;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (raw: string, index: number) => {
    const pasted = (raw || "").replace(/\s/g, "");
    // If user pasted multiple characters, auto-distribute across inputs
    if (pasted.length > 1) {
      const digits = pasted.replace(/[^0-9A-Za-z]/g, "").slice(0, 6);
      const next = [...code];
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        next[index + i] = digits[i];
      }
      setCode(next);
      const lastIdx = Math.min(index + digits.length - 1, 5);
      inputRefs.current[lastIdx]?.focus();
      return;
    }

    const text = pasted;
    const next = [...code];
    next[index] = text;
    setCode(next);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
    if (!text && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const toOk = (result: unknown): { ok: boolean; message?: string } => {
    if (typeof result === "boolean") return { ok: result };
    if (result && typeof result === "object" && "ok" in (result as any))
      return result as any;
    const msg = (result as any)?.message;
    return { ok: msg === "User email verified successfully", message: msg };
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = onVerify
        ? await onVerify(verificationCode, userEmail)
        : await verifyEmail(verificationCode, userEmail);
      console.log(res);
      const outcome = toOk(res);
      if (outcome.ok) setShowSuccessModal(true);
      else
        Alert.alert(
          "Verification Failed",
          outcome.message || "Invalid verification code"
        );
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        err?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalDone = () => {
    setShowSuccessModal(false);
    if (onAccountCreated) onAccountCreated();
    else navigation.navigate("Login" as never);
  };
  const handleModalClose = () => setShowSuccessModal(false);

  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    setResendLoading(true);
    try {
      if (onResendCode) {
        await onResendCode();
      } else {
        const res: any = await sendVerificationCode(userEmail);
        Alert.alert(
          "Success",
          res?.message || "Verification code sent successfully!"
        );
      }
      setTimeLeft(59);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Could not resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isCodeComplete = code.every((d) => d !== "");

  const handleClose = () => {
    navigation.navigate("Welcome");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Verify email address</Text>
            <Text style={styles.subtitle}>
              Enter the six digit codes sent to your {userEmail}
            </Text>
          </View>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                ]}
                value={digit}
                onChangeText={(t) => handleCodeChange(t, index)}
                keyboardType="default"
                autoCapitalize="characters"
                maxLength={6}
                selectTextOnFocus
                autoFocus={index === 0}
                returnKeyType="next"
                editable={!loading}
              />
            ))}
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={timeLeft > 0 || resendLoading}
              activeOpacity={0.7}
            >
              {resendLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text
                  style={[
                    styles.resendText,
                    timeLeft > 0 ? styles.resendDisabled : styles.resendEnabled,
                  ]}
                >
                  Resend Code
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.verifyBtn,
                isCodeComplete && !loading
                  ? styles.verifyBtnEnabled
                  : styles.verifyBtnDisabled,
              ]}
              onPress={handleVerify}
              activeOpacity={0.9}
              disabled={!isCodeComplete || loading}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={[
                    styles.verifyBtnText,
                    isCodeComplete && !loading
                      ? styles.verifyBtnTextEnabled
                      : styles.verifyBtnTextDisabled,
                  ]}
                >
                  Verify email address
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <AccountCreatedModal
          visible={showSuccessModal}
          onDone={handleModalDone}
          onClose={handleModalClose}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const INPUT_BG = "#F5F7FA";
const INPUT_BORDER = "#E8EDF5";
const INPUT_ACTIVE = "#D6E3FF";
const TEXT_DARK = "#111827";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  closeIcon: {
    fontSize: 24,
    color: TEXT_DARK,
    fontWeight: "300",
  },
  header: { paddingTop: 20, paddingBottom: 32 },
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: TEXT_DARK,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: MUTED,
    fontFamily: "RCB-Regular",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    color: TEXT,
    fontFamily: "RCB-SemiBold",
  },
  codeInputFilled: { backgroundColor: INPUT_ACTIVE, borderColor: BLUE },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerText: { fontSize: 14, color: TEXT, fontFamily: "RCB-Medium" },
  resendText: { fontSize: 14, fontFamily: "RCB-SemiBold" },
  resendEnabled: { color: BLUE },
  resendDisabled: { color: MUTED },
  spacer: { flex: 1 },
  footer: { paddingBottom: 32 },
  verifyBtn: {
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnEnabled: { backgroundColor: BLUE },
  verifyBtnDisabled: { backgroundColor: INPUT_BG },
  verifyBtnText: { fontSize: 16, fontFamily: "RCB-SemiBold" },
  verifyBtnTextEnabled: { color: "#FFFFFF" },
  verifyBtnTextDisabled: { color: MUTED },
});
