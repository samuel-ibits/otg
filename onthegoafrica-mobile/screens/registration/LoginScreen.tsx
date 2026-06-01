// screens/auth/LoginScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginUser } from "../../api/api";
import SocialAuthModal from "../../component/SocialAuthModal";
import ForgotPasswordModal from "../../component/ForgotPasswordModal";
import PhoneLoginModal from "../../component/PhoneLoginModal"; // <-- add this

type Provider = "apple" | "instagram" | "google";

type Props = {
  onBack?: () => void;
  onUsePhoneNumber?: () => void; // no longer used; kept for compat
  onForgotPassword?: () => void;
  onApple?: () => void;
  onInstagram?: () => void;
  onGoogle?: () => void;
  onSignUp?: () => void;
};

export default function LoginScreen({
  onBack,
  onUsePhoneNumber, // unused, we open modal inline
  onForgotPassword,
  onApple,
  onInstagram,
  onGoogle,
  onSignUp,
}: Props) {
  const nav = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // social modal state
  const [socialVisible, setSocialVisible] = useState(false);
  const [socialProvider, setSocialProvider] = useState<Provider | null>(null);

  // forgot + phone modals
  const [forgotVisible, setForgotVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false); // <-- add this

  const openSocial = (p: Provider) => {
    setSocialProvider(p);
    setSocialVisible(true);
  };

  const confirmSocial = (p: Provider) => {
    setSocialVisible(false);
    if (p === "apple" && onApple) return onApple();
    if (p === "instagram" && onInstagram) return onInstagram();
    if (p === "google" && onGoogle) return onGoogle();
    Alert.alert("Social login", `Proceed with ${p}`);
  };

  const handleLogin = async () => {
    const u = email.trim();
    const p = password.trim();

    if (!u || !p) {
      setError("Enter email/username and password.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await loginUser(u, p);
      const user = res?.user;
      const type =
        user?.type || user?.role || user?.userType || user?.accountType;

      if (String(type).toLowerCase() === "user") {
        nav.navigate("BusinessNavigator");
      } else {
        nav.navigate("MainTabs");
      }
    } catch (e: any) {
      const apiMsg = e?.message || "Login failed. Check your credentials.";
      setError(apiMsg);
      Alert.alert("Login failed", apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack ?? (() => nav.goBack())}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/icons/back.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back👋 </Text>
          <Text style={styles.title}> Glad to see you, Again!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter email address or username"
              placeholderTextColor={PLACEHOLDER}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Image
                  source={require("../../assets/icons/eye.png")}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.linkContainer}>
            {/* Open PhoneLoginModal inline */}
            <TouchableOpacity
              onPress={() => setPhoneVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkLeft}>Use phone number instead</Text>
            </TouchableOpacity>

            {/* Open forgot password modal inline */}
            <TouchableOpacity
              onPress={() => setForgotVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkRight}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.loginBtnText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* <View style={styles.dividerContainer}>
            <Divider label="Or Login with" />
          </View>

          <View style={styles.socialSection}>
            <AuthButton
              label="Continue with Apple"
              icon={require('../../assets/icons/apple.png')}
              onPress={() => openSocial('apple')}
            />
            <View style={{ height: 12 }} />
            <AuthButton
              label="Continue with Instagram"
              icon={require('../../assets/icons/instagram.png')}
              onPress={() => openSocial('instagram')}
            />
            <View style={{ height: 12 }} />
            <AuthButton
              label="Continue with Google"
              icon={require('../../assets/icons/google.png')}
              onPress={() => openSocial('google')}
            />
          </View> */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              I have an Account,{" "}
              <Text style={styles.signUpLink} onPress={onSignUp}>
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <SocialAuthModal
        visible={socialVisible}
        provider={socialProvider}
        onClose={() => setSocialVisible(false)}
        onConfirm={confirmSocial}
      />
      <ForgotPasswordModal
        visible={forgotVisible}
        onClose={() => setForgotVisible(false)}
        defaultEmail={email}
        onSubmit={async (e) => {
          // TODO: call your API to send reset link or OTP
          Alert.alert(
            "Password reset",
            "If this email exists, a reset link has been sent."
          );
          setForgotVisible(false);
        }}
      />
      <PhoneLoginModal
        visible={phoneVisible}
        onClose={() => setPhoneVisible(false)}
        onLogin={async (phone, pw) => {
          // If your API accepts phone as username, reuse loginUser
          const res = await loginUser(phone, pw);
          const user = res?.user;
          const type =
            user?.type || user?.role || user?.userType || user?.accountType;

          if (String(type).toLowerCase() === "user") {
            nav.navigate("BusinessNavigatorMainTabs");
          } else {
            nav.navigate("MainTabs");
          }
        }}
      />
    </SafeAreaView>
  );
}

function AuthButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.authBtn}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={icon} style={styles.authIcon} resizeMode="contain" />
      <Text style={styles.authText}>{label}</Text>
      <View style={{ width: 24 }} />
    </TouchableOpacity>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.divider} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const PLACEHOLDER = "#A8B5C8";
const INPUT_BG = "#F5F7FA";
const INPUT_BORDER = "#E8EDF5";
const AUTH_BORDER = "#CBD6F3";
const ERROR = "#B00020";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: { width: 24, height: 24, tintColor: TEXT },
  header: { marginBottom: 32 },
  title: { fontSize: 28, lineHeight: 36, color: TEXT, fontFamily: "RCB-Bold" },

  form: { flex: 1 },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    color: TEXT,
    fontFamily: "RCB-Medium",
    marginBottom: 8,
  },
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
  passwordContainer: { position: "relative" },
  passwordInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: TEXT,
    fontFamily: "RCB-Regular",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 0,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
  },
  eyeIcon: { width: 20, height: 20, tintColor: MUTED },

  errorText: {
    color: ERROR,
    marginTop: -8,
    marginBottom: 16,
    fontFamily: "RCB-Medium",
  },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  linkLeft: { fontSize: 14, color: BLUE, fontFamily: "RCB-SemiBold" },
  linkRight: { fontSize: 14, color: MUTED, fontFamily: "RCB-Regular" },

  loginBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "RCB-SemiBold" },

  dividerContainer: { marginBottom: 24 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 6,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#E3E9F3" },
  dividerLabel: { color: MUTED, fontFamily: "RCB-Regular", fontSize: 14 },

  socialSection: { marginBottom: 32 },
  authBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AUTH_BORDER,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  authIcon: { width: 22, height: 22, marginRight: 10 },
  authText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: TEXT,
    fontFamily: "RCB-SemiBold",
  },

  footer: { alignItems: "center", paddingBottom: 32, justifyContent: "center" },
  footerText: { fontSize: 14, color: MUTED, fontFamily: "RCB-Regular" },
  signUpLink: { fontSize: 14, color: BLUE, fontFamily: "RCB-SemiBold" },
});
