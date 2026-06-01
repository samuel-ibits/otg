// screens/profile/ChangePasswordScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const BACK_ICON = require("../../assets/icons/back.png"); // add a left chevron image
const EYE_ICON = require("../../assets/icons/eye.png");   // outline eye
const EYE_OFF_ICON = require("../../assets/icons/eye.png"); // eye with slash (optional). If missing, EYE_ICON is reused.

export default function ChangePasswordScreen({ navigation }: any) {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const save = () => {
    if (!oldPwd || !newPwd || !confirmPwd) {
      Alert.alert("Missing info", "Fill all fields.");
      return;
    }
    if (newPwd.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("Mismatch", "New passwords do not match.");
      return;
    }
    // TODO: wire to backend
    Alert.alert("Success", "Password changed.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Image source={BACK_ICON} style={s.back} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled" bounces={false}>
          <Text style={s.title}>Change password</Text>
          <Text style={s.subtitle}>
            Your new password must be unique from those{"\n"}previously used.
          </Text>

          <Text style={s.label}>Old password</Text>
          <PasswordInput
            value={oldPwd}
            onChangeText={setOldPwd}
            placeholder="Enter password"
            visible={showOld}
            onToggle={() => setShowOld((v) => !v)}
          />

          <Text style={s.label}>New password</Text>
          <PasswordInput
            value={newPwd}
            onChangeText={setNewPwd}
            placeholder="Enter password"
            visible={showNew}
            onToggle={() => setShowNew((v) => !v)}
          />

          <Text style={s.label}>Confirm new password</Text>
          <PasswordInput
            value={confirmPwd}
            onChangeText={setConfirmPwd}
            placeholder="Enter password"
            visible={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />

          <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Hook to reset flow.")}>
            <Text style={s.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.primary} onPress={save} activeOpacity={0.9}>
            <Text style={s.primaryTxt}>Save changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PasswordInput({
  value,
  onChangeText,
  placeholder,
  visible,
  onToggle,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={s.inputRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA8BD"
        style={s.input}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="oneTimeCode"
      />
      <TouchableOpacity onPress={onToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Image source={visible ? (EYE_OFF_ICON || EYE_ICON) : EYE_ICON} style={s.eye} />
      </TouchableOpacity>
    </View>
  );
}

/* styles */
const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const BORDER = "#E6ECF5";
const FIELD_BG = "#F2F6FC";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },

  container: { paddingHorizontal: 20, paddingBottom: 32 },
  title: { color: TEXT, fontFamily: "RCB-Black", fontSize: 34, marginTop: 8 },
  subtitle: {
    color: "#7A8BA8",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 18,
  },

  label: { color: TEXT, fontFamily: "RCB-SemiBold", marginTop: 16, marginBottom: 8 },

  inputRow: {
    height: 56,
    borderRadius: 28,
    backgroundColor: FIELD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, color: TEXT, fontFamily: "RCB-Medium" },
  eye: { width: 22, height: 22, tintColor: "#7E8CA6", marginLeft: 8 },

  forgot: {
    alignSelf: "flex-end",
    color: "#7A8BA8",
    fontFamily: "RCB-SemiBold",
    marginTop: 12,
  },

  primary: {
    marginTop: 28,
    height: 64,
    borderRadius: 32,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#FFFFFF", fontFamily: "RCB-Bold", fontSize: 18 },
});
