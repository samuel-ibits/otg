// screens/profile/PersonalDetails.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const I = {
  back: require("../../../assets/icons/back.png"),
};

const BLUE = "#0145FE";
const TEXT_DARK = "#0A1220";
const TEXT_MUTED = "#62718C";
const BORDER = "#EDF2FA";
const INPUT_BG = "#F3F7FE";

export default function PersonalDetails() {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const canSave = useMemo(() => {
    if (!firstName.trim()) return false;
    if (!lastName.trim()) return false;
    if (!email.trim()) return false;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return emailOk;
  }, [firstName, lastName, email]);

  const onSave = () => {
    if (!canSave) {
      Alert.alert("Check details", "Fill required fields with valid info.");
      return;
    }
    // TODO: call your API here
    // Example payload:
    // const payload = { firstName, lastName, phone, email, location };
    Alert.alert("Saved", "Your changes have been saved.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={I.back} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Personal Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 12, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Field
            label="First Name"
            placeholder="Enter First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Field
            label="Last Name"
            placeholder="Enter Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Field
            label="Phone number"
            placeholder="Enter Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            returnKeyType="next"
          />

          <Field
            label="Email Address"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            returnKeyType="next"
          />

          <Field
            label="Location"
            placeholder="Enter email address"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onSave}
            disabled={!canSave}
            style={[s.cta, !canSave && s.ctaDisabled]}
          >
            <Text style={s.ctaText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Reusable field */
function Field({
  label,
  ...rest
}: {
  label: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...rest}
        style={s.input}
        placeholderTextColor="#9FB1CC"
      />
    </View>
  );
}

/* styles */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  back: { width: 24, height: 24, tintColor: TEXT_DARK },
  title: { flex: 1, textAlign: "center", color: TEXT_DARK, fontSize: 18, fontWeight: "700" },

  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },

  label: { color: TEXT_DARK, fontWeight: "700", marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 24,
    backgroundColor: INPUT_BG,
    paddingHorizontal: 16,
    fontSize: 14,
    color: TEXT_DARK,
    borderWidth: 1,
    borderColor: "#E7EFFA",
  },

  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
