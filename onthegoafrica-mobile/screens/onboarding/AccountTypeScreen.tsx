// screens/onboarding/AccountTypeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {
  onChooseIndividual?: () => void;
  onChooseBusiness?: () => void;
  onSignIn?: () => void;
};

export default function AccountTypeScreen({
  onChooseIndividual,
  onChooseBusiness,
  onSignIn,
}: Props) {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<"individual" | "business" | null>(
    null
  );

  const handleContinue = () => {
    if (!selected) return;

    if (selected === "individual") {
      if (onChooseIndividual) return onChooseIndividual();
      navigation.replace("CreateProfile");
    } else {
      if (onChooseBusiness) return onChooseBusiness();
      navigation.replace("BusinessCategory");
    }
  };

  const handleClose = () => {
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>
          Which of these{"\n"}best describes you?
        </Text>

        <View style={{ height: 32 }} />

        {/* Individual Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.card,
            selected === "individual" && styles.cardSelected,
          ]}
          onPress={() => setSelected("individual")}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Individual</Text>
            <Text style={styles.cardSubtitle}>
              Find free Wi-Fi near you, workspace and connect to a community
            </Text>
          </View>
          <View
            style={[
              styles.radio,
              selected === "individual" && styles.radioSelected,
            ]}
          >
            {selected === "individual" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <View style={{ height: 16 }} />

        {/* Business Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.card, selected === "business" && styles.cardSelected]}
          onPress={() => setSelected("business")}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Business</Text>
            <Text style={styles.cardSubtitle}>
              Have a conducive space, want to monitise your wi-fi and get more
              sales
            </Text>
          </View>
          <View
            style={[
              styles.radio,
              selected === "business" && styles.radioSelected,
            ]}
          >
            {selected === "business" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Terms Text */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of service</Text> and{" "}
          <Text style={styles.termsLink}>Policy</Text>
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selected && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#0066FF";
const BLUE_LIGHT = "#A8C5FF";
const BORDER = "#E5E7EB";
const BORDER_SELECTED = "#0066FF";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6B7280";
const BG_LIGHT = "#F9FAFB";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
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
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: TEXT_DARK,
    fontWeight: "700",
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  cardSelected: {
    borderColor: BORDER_SELECTED,
    backgroundColor: "#F0F7FF",
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 18,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: BLUE,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },
  termsText: {
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: TEXT_DARK,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    backgroundColor: BLUE_LIGHT,
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
