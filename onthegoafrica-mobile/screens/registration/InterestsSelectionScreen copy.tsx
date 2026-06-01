import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserProfile } from "../../api/api"; // add import

type Interest = {
  id: string;
  label: string;
  emoji: string;
  category: "hobby" | "place";
};

const hobbies: Interest[] = [
  { id: "1", label: "Singing", emoji: "🎤", category: "hobby" },
  { id: "2", label: "Reading", emoji: "📚", category: "hobby" },
  { id: "3", label: "Hiking", emoji: "🏔️", category: "hobby" },
  { id: "4", label: "Travel", emoji: "✈️", category: "hobby" },
  { id: "5", label: "Arts & Crafts", emoji: "🎨", category: "hobby" },
  { id: "6", label: "Running", emoji: "🏃", category: "hobby" },
  { id: "7", label: "Swimming", emoji: "🏊", category: "hobby" },
  { id: "8", label: "Dancing", emoji: "🕺", category: "hobby" },
  { id: "9", label: "Photography", emoji: "📷", category: "hobby" },
  { id: "10", label: "Cooking", emoji: "🍳", category: "hobby" },
  { id: "11", label: "DIY", emoji: "🔨", category: "hobby" },
  { id: "12", label: "Gaming", emoji: "🎮", category: "hobby" },
  { id: "13", label: "Food tasting", emoji: "❤️", category: "hobby" },
  { id: "14", label: "Shopping", emoji: "🛍️", category: "hobby" },
  { id: "15", label: "Board Games", emoji: "🎲", category: "hobby" },
  { id: "16", label: "Gardening", emoji: "🌱", category: "hobby" },
  { id: "17", label: "Cycling", emoji: "🚴", category: "hobby" },
  { id: "18", label: "Hiking", emoji: "🥾", category: "hobby" },
  { id: "19", label: "Yoga", emoji: "🧘", category: "hobby" },
  { id: "20", label: "Football", emoji: "⚽", category: "hobby" },
  { id: "21", label: "Basketball", emoji: "🏀", category: "hobby" },
  { id: "22", label: "Partying", emoji: "🎉", category: "hobby" },
];

const places: Interest[] = [
  { id: "23", label: "Cafe", emoji: "☕", category: "place" },
  { id: "24", label: "Co-workspace", emoji: "🏢", category: "place" },
  { id: "25", label: "Restaurant", emoji: "🏠", category: "place" },
  { id: "26", label: "Hotel", emoji: "🏨", category: "place" },
  { id: "27", label: "Lounge", emoji: "🛋️", category: "place" },
  { id: "28", label: "Club", emoji: "♠️", category: "place" },
  { id: "29", label: "Bar", emoji: "🍺", category: "place" },
  { id: "30", label: "Beach house", emoji: "🏖️", category: "place" },
  { id: "31", label: "Hospital", emoji: "🏥", category: "place" },
  { id: "32", label: "Spa", emoji: "🧴", category: "place" },
  { id: "33", label: "Beauty center", emoji: "💅", category: "place" },
];

type InterestsSelectionScreenProps = {
  onContinue?: (selected: Interest[]) => void;
  onBack?: () => void;
};

export default function InterestsSelectionScreen({
  onContinue,
  onBack,
}: InterestsSelectionScreenProps) {
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = async () => {
    const selected = [...hobbies, ...places].filter((i) =>
      selectedInterests.includes(i.id)
    );

    try {
      setLoading(true);
      // Call the parent callback if provided
      if (onContinue) {
        await onContinue(selected);
      } else {
        console.log("No onContinue provided, selected:", selected);
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  const canContinue = selectedInterests.length >= 5;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack || (() => navigation.goBack())}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 2 of 2</Text>
        </View>

        {/* ... same UI ... */}

        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!canContinue || loading) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue || loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueBtnText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InterestTag({
  interest,
  selected,
  onPress,
}: {
  interest: Interest;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tag, selected && styles.tagSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.tagEmoji}>{interest.emoji}</Text>
      <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
        {interest.label}
      </Text>
    </TouchableOpacity>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const TAG_BORDER = "#E8EDF5";
const TAG_BG = "#FFFFFF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  backIcon: { width: 24, height: 24, tintColor: TEXT },
  stepText: { fontSize: 14, color: MUTED, fontFamily: "RCB-Regular" },

  titleSection: { marginBottom: 32 },
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: TEXT,
    fontFamily: "RCB-Bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    fontFamily: "RCB-Regular",
  },

  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 20,
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    marginBottom: 16,
  },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: TAG_BG,
    borderWidth: 1,
    borderColor: TAG_BORDER,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  tagSelected: { backgroundColor: BLUE, borderColor: BLUE },
  tagEmoji: { fontSize: 16, marginRight: 6 },
  tagText: { fontSize: 14, color: TEXT, fontFamily: "RCB-Medium" },
  tagTextSelected: { color: "#FFFFFF" },

  continueBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  continueBtnDisabled: { backgroundColor: MUTED, opacity: 0.5 },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "RCB-SemiBold",
  },
});
