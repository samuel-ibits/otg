import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SaveSuccessModal from "../../component/SaveSuccessModal";
import SelectChipsModal from "./SelectChipsModal";
import { updateProfile, submitInterestsAndPlaces } from "../../api/api";

type Chip = { id: string; label: string };

const BACK_ICON = require("../../assets/icons/back.png");
const AVATAR_FALLBACK = require("../../assets/feed/user1.png");

export default function EditProfileScreen({ navigation }: any) {
  const [tab, setTab] = useState<"Profile" | "Interests">("Profile");
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // avatar
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // profile fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [profileType, setProfileType] = useState("personal");
  const [skills, setSkills] = useState<Chip[]>([]);
  const [skillDraft, setSkillDraft] = useState("");

  // interests
  const HOBBY_OPTIONS = [
    "Singing 🎤",
    "Reading 📖",
    "Hiking 🥾",
    "Travel ✈️",
    "Arts & Crafts 🎨",
    "Running 🏃🏻‍♂️",
    "Swimming 🏊‍♀️",
    "Dancing 💃🏽",
    "Photography 📸",
    "Cooking 🥘",
    "DIY 🧰",
    "Console Games 🎮",
    "Food tasting 👅",
    "Shopping 🛍️",
    "Board Games 🎲",
    "Gardening 🌿",
  ];
  const PLACE_OPTIONS = [
    "Cafe ☕",
    "Co-workspace 🧳",
    "Beach house 🏖️",
    "Hotel 🏢",
    "Bar 🍺",
    "Library 📚",
    "Park 🌳",
    "Museum 🏛️",
    "Rooftop 🌆",
    "Gallery 🖼️",
  ];

  const [hobbies, setHobbies] = useState<Chip[]>([]);
  const [places, setPlaces] = useState<Chip[]>([]);
  const [picker, setPicker] = useState<null | { kind: "hobbies" | "places" }>(
    null
  );

  // Load user profile data on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      const authUserStr = await AsyncStorage.getItem("authUser");

      if (userProfileStr) {
        const profile = JSON.parse(userProfileStr);
        setUsername(profile.userName || profile.username || "");
        setBio(profile.bio || "");
        setProfession(profile.profession || "");
        setGender(profile.gender || "");
        setProfileType(profile.profileType || "personal");
        setAvatarUri(profile.picture || null);

        if (profile.skills && Array.isArray(profile.skills)) {
          setSkills(
            profile.skills.map((skill: string, idx: number) => ({
              id: `skill-${idx}`,
              label: skill,
            }))
          );
        }

        if (Array.isArray(profile.interests)) {
          setHobbies(
            profile.interests.map((hobby: string, idx: number) => ({
              id: `hobby-${idx}`,
              label: hobby,
            }))
          );
        }

        if (Array.isArray(profile.placesVisited)) {
          setPlaces(
            profile.placesVisited.map((place: string, idx: number) => ({
              id: `place-${idx}`,
              label: place,
            }))
          );
        }
      }
      if (authUserStr) {
        const user = JSON.parse(authUserStr);
        setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
        setEmail(user.email || "");
        setPhone(user.phone_number || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const addSkill = () => {
    const v = skillDraft.trim();
    if (!v) return;
    setSkills((x) => [...x, { id: String(Date.now()), label: v }]);
    setSkillDraft("");
  };

  const removeSkill = (id: string) =>
    setSkills((x) => x.filter((c) => c.id !== id));

  const pill = (c: Chip, onRemove?: (id: string) => void) => (
    <View key={c.id} style={styles.pill}>
      <Text style={styles.pillTxt}>{c.label}</Text>
      {onRemove ? (
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => onRemove(c.id)}
        >
          <Text style={styles.pillX}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const SectionLabel = ({ title }: { title: string }) => (
    <Text style={styles.label}>{title}</Text>
  );

  const Input = ({
    value,
    onChangeText,
    placeholder,
    multiline,
    keyboardType,
  }: any) => (
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor="#9FAEC4"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
    />
  );

  const pickAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow photo library access to change your picture."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Could not open photo library.");
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);

      if (tab === "Profile") {
        const profileData = {
          userName: username,
          bio,
          profession,
          skills: skills.map((s) => s.label),
          gender,
          profileType,
          picture: avatarUri || "",
        };
        const response = await updateProfile(profileData);
        console.log("Profile updated successfully:", response);
      } else if (tab === "Interests") {
        const payload = {
          interests: hobbies.map((h) => h.label),
          placesVisited: places.map((p) => p.label),
        };
        const response = await submitInterestsAndPlaces(
          payload.interests,
          payload.placesVisited
        );
        console.log("Interests and places saved:", response);
      }

      setShowSaved(true);
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.message || "Could not update. Please try again."
      );
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openHobbyPicker = () => setPicker({ kind: "hobbies" });
  const openPlacePicker = () => setPicker({ kind: "places" });
  const closePicker = () => setPicker(null);

  const onPickerSave = (selectedLabels: string[]) => {
    const toChips = (labels: string[]) =>
      labels.map((l) => ({ id: l, label: l }));
    if (picker?.kind === "hobbies") setHobbies(toChips(selectedLabels));
    if (picker?.kind === "places") setPlaces(toChips(selectedLabels));
    setPicker(null);
  };

  const pickerTitle =
    picker?.kind === "hobbies"
      ? "Select hobbies"
      : picker?.kind === "places"
      ? "Select places to visit"
      : "";

  const pickerOptions =
    picker?.kind === "hobbies" ? HOBBY_OPTIONS : PLACE_OPTIONS;
  const pickerSelected =
    picker?.kind === "hobbies"
      ? hobbies.map((h) => h.label)
      : places.map((p) => p.label);

  return (
    <SafeAreaView style={styles.root}>
      {/* Modals */}
      <SaveSuccessModal
        visible={showSaved}
        onClose={() => setShowSaved(false)}
        onDone={() => {
          setShowSaved(false);
          navigation?.goBack?.();
        }}
      />
      <SelectChipsModal
        visible={!!picker}
        title={pickerTitle}
        options={picker ? pickerOptions : []}
        selected={picker ? pickerSelected : []}
        onSave={onPickerSave}
        onClose={closePicker}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={BACK_ICON} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.h1}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["Profile", "Interests"] as const).map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={styles.tab}
            >
              <Text style={[styles.tabTxt, active && styles.tabActive]}>
                {t}
              </Text>
              {active ? <View style={styles.tabBar} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Keyboard Handling */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {tab === "Profile" ? (
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <Image
                  source={avatarUri ? { uri: avatarUri } : AVATAR_FALLBACK}
                  style={styles.avatar}
                />
                <TouchableOpacity onPress={pickAvatar}>
                  <Text style={styles.changePhoto}>Change photo</Text>
                </TouchableOpacity>
              </View>

              <SectionLabel title="Full name" />
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
              />

              <SectionLabel title="User name" />
              <Input
                value={username}
                onChangeText={setUsername}
                placeholder="@username"
              />

              <SectionLabel title="Email address" />
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="name@email.com"
                keyboardType="email-address"
              />

              <SectionLabel title="Bio" />
              <Input
                value={bio}
                onChangeText={setBio}
                placeholder="Say something about yourself"
                multiline
              />

              <SectionLabel title="Profession" />
              <Input
                value={profession}
                onChangeText={setProfession}
                placeholder="Your profession"
              />

              <SectionLabel title="Skills" />
              <TextInput
                style={styles.input}
                placeholder="Add skills"
                placeholderTextColor="#9FAEC4"
                value={skillDraft}
                onChangeText={setSkillDraft}
                onSubmitEditing={addSkill}
                returnKeyType="done"
              />
              <View style={styles.pillsRow}>
                {skills.map((c) => pill(c, (id) => removeSkill(id)))}
              </View>

              <SectionLabel title="Phone number" />
              <View style={styles.phoneRow}>
                <Text style={styles.flag}>🇳🇬</Text>
                <Text style={styles.calling}>+234 ▾</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="00 000 000"
                  placeholderTextColor="#9FAEC4"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="number-pad"
                />
              </View>

              <SectionLabel title="Location" />
              <Input
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
              />

              <TouchableOpacity
                style={styles.primary}
                onPress={onSave}
                activeOpacity={0.9}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryTxt}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Card title="Hobbies" onEdit={openHobbyPicker}>
                <View style={styles.pillsRow}>
                  {hobbies.map((c) => pill(c))}
                </View>
              </Card>

              <Card title="Places to visit" onEdit={openPlacePicker}>
                <View style={styles.pillsRow}>
                  {places.map((c) => pill(c))}
                </View>
              </Card>

              <TouchableOpacity
                style={[styles.primary, { marginTop: 24 }]}
                onPress={onSave}
                activeOpacity={0.9}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryTxt}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Card component */
function Card({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle}>{title}</Text>
        {!!onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.cardEdit}>✎ Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

/* styles */

const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const BORDER = "#E6ECF5";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backIcon: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  h1: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  tab: { paddingBottom: 8 },
  tabTxt: { color: "#63728F", fontFamily: "RCB-SemiBold" },
  tabActive: { color: TEXT },
  tabBar: { marginTop: 6, height: 3, backgroundColor: BLUE, borderRadius: 2 },

  scroll: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12 },

  avatarWrap: { alignItems: "center", marginBottom: 8 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  changePhoto: {
    color: "#5C6E91",
    marginTop: 8,
    fontFamily: "RCB-SemiBold",
  },

  label: {
    color: TEXT,
    marginTop: 14,
    marginBottom: 8,
    fontFamily: "RCB-Medium",
  },

  input: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F2F6FC",
    borderWidth: 1,
    borderColor: "#E7EEF8",
    paddingHorizontal: 16,
    color: TEXT,
    fontFamily: "RCB-Regular",
  },
  inputMultiline: {
    height: 110,
    borderRadius: 16,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDD9EE",
  },
  pillTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },
  pillX: { marginLeft: 8, color: "#7B8BA7", fontSize: 16 },

  phoneRow: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F2F6FC",
    borderWidth: 1,
    borderColor: "#E7EEF8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  flag: { fontSize: 18, marginRight: 6 },
  calling: { color: TEXT, fontFamily: "RCB-SemiBold", marginRight: 8 },
  phoneInput: { flex: 1, color: TEXT, fontFamily: "RCB-Regular" },

  primary: {
    marginTop: 20,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },

  card: {
    backgroundColor: "#F7FAFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6EDF7",
    padding: 14,
    marginTop: 14,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 18 },
  cardEdit: { color: "#2F5BFF", fontFamily: "RCB-SemiBold" },
});
