// screens/business/BusinessSocialsScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { addSocialMedia, getProfileId } from "../../../api/api"; // Import the API functions

const BACK_ICON = require("../../../assets/icons/back.png");

export default function BusinessSocialsScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = React.useState(false);

  const [twitter, setTwitter] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [website, setWebsite] = React.useState("");

  const onNext = async () => {
    setIsLoading(true);
    try {
      // Get the profile ID from AsyncStorage
      const profileId = await getProfileId();
      
      // if (!profileId) {
      //   Alert.alert("Error", "Profile ID not found. Please create a profile first.");
      //   return;
      // }

      // Prepare social media data
      const socialData = {
        // profileId: profileId,
        socials: {
          twitter: twitter.trim() || undefined,
          instagram: instagram.trim() || undefined,
          website: website.trim() || undefined,
        },
      };

      // Call the API
      const response = await addSocialMedia(socialData);
      
      // Show success message
      Alert.alert("Success", "Social media links saved successfully!");
      
      // Navigate back to the setup list and mark this step complete
      navigation.navigate("CreateBusinessProfile", { markDone: "socials" });
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save social media links");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={HS}>
            <Image source={BACK_ICON} style={s.back} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Socials</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Body */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <Field label="Twitter">
            <Input
              placeholder="https://twitter.com/username"
              autoCapitalize="none"
              keyboardType="url"
              value={twitter}
              onChangeText={setTwitter}
            />
          </Field>

          <Field label="Instagram">
            <Input
              placeholder="https://instagram.com/username"
              autoCapitalize="none"
              keyboardType="url"
              value={instagram}
              onChangeText={setInstagram}
            />
          </Field>

          <Field label="Website">
            <Input
              placeholder="https://yourwebsite.com"
              autoCapitalize="none"
              keyboardType="url"
              value={website}
              onChangeText={setWebsite}
            />
          </Field>
        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          <TouchableOpacity 
            style={[s.nextBtn, isLoading && s.nextBtnDisabled]} 
            activeOpacity={0.9} 
            onPress={onNext}
            disabled={isLoading}
          >
            <Text style={s.nextTxt}>
              {isLoading ? "Saving..." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- small components ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#A2B0C3"
      style={s.input}
    />
  );
}

/* ---------- styles ---------- */
const HS = { top: 8, bottom: 8, left: 8, right: 8 };
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const INPUT_BG = "#F3F6FA";
const INPUT_BORDER = "#E6ECF5";
const BLUE = "#0145FE";
const WHITE = "#FFFFFF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  header: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: INPUT_BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  headerTitle: { color: TEXT, fontSize: 16, fontFamily: "RCB-SemiBold" },

  label: { color: TEXT, fontFamily: "RCB-SemiBold", marginBottom: 8 },

  input: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "RCB-Regular",
    color: TEXT,
  },

  footer: { padding: 16 },
  nextBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnDisabled: {
    backgroundColor: "#BFD0FF",
  },
  nextTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },
});