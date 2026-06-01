//create profile
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
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

type Skill = { id: string; name: string };

type Props = {
  onContinue?: (profileData: {
    username: string;
    bio: string;
    gender: string;
    profession: string;
    skills: Skill[];
    profileImage: string | null;
  }) => void;
  onSelectPhoto?: () => void;
};

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function CreateProfileScreen({
  onContinue,
  onSelectPhoto,
}: Props) {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("janedoe");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to select a photo."
      );
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    // const ok = await requestPermission();
    // if (!ok) return;
    setLoading(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      onSelectPhoto?.();
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setSkills((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newSkill.trim() },
    ]);
    setNewSkill("");
  };

  const removeSkill = (id: string) =>
    setSkills((prev) => prev.filter((s) => s.id !== id));

  const handleContinue = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
    } else if (!profession.trim()) {
      Alert.alert("Error", "Please enter your profession");
    } else {
      setLoading(true);
      // hand off to stack; do NOT submit here

      const profileData = {
        userName: username,
        bio,
        gender,
        profession,
        skills,
        picture: profileImage,
      };
      navigation.navigate("InterestsSelection", { profileData });
      //   onContinue?.({
      //     username,
      //     bio,
      //     gender,
      //     profession,
      //     skills,
      //     profileImage,
      //   });
      //   setLoading(false);
    }
  };

  const canContinue =
    username.trim().length > 0 && profession.trim().length > 0;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a profile</Text>
          <Text style={styles.stepText}>Step 1 of 2</Text>
        </View>

        <Text style={styles.subtitle}>
          Fill the details below to create a profile
        </Text>

        <TouchableOpacity
          style={styles.photoSection}
          onPress={selectImage}
          activeOpacity={0.7}
        >
          <View style={styles.photoContainer}>
            {profileImage ? (
              <>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profilePhoto}
                />
                <Text style={styles.changePhotoText}>Change photo</Text>
              </>
            ) : (
              <>
                <View style={styles.photoPlaceholder}>
                  <Image
                    source={require("../../assets/icons/camera.png")}
                    style={styles.cameraIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.addPhotoText}>Add a photo</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Create username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="@username"
              placeholderTextColor={PLACEHOLDER}
              value={`@${username}`}
              onChangeText={(t) => setUsername(t.replace("@", ""))}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Add a Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              placeholder="Enter a short bio of yourself"
              placeholderTextColor={PLACEHOLDER}
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowGenderModal(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.dropdownText, !gender && styles.placeholderText]}
              >
                {gender || "Select gender"}
              </Text>
              <Image
                source={require("../../assets/icons/chevron-down.png")}
                style={styles.chevronIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Profession</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g Accountant"
              placeholderTextColor={PLACEHOLDER}
              value={profession}
              onChangeText={setProfession}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Skills</Text>
            <View style={styles.skillsInputContainer}>
              <TextInput
                style={styles.skillsInput}
                placeholder="Add skills"
                placeholderTextColor={PLACEHOLDER}
                value={newSkill}
                onChangeText={setNewSkill}
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
            </View>

            {skills.length > 0 && (
              <View style={styles.skillsContainer}>
                {skills.map((skill) => (
                  <View key={skill.id} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill.name}</Text>
                    <TouchableOpacity
                      onPress={() => removeSkill(skill.id)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require("../../assets/icons/close.png")}
                        style={styles.removeSkillIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!canContinue || loading) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.9}
          disabled={!canContinue || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueBtnText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                activeOpacity={0.7}
              >
                <Image
                  source={require("../../assets/icons/close.png")}
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {["Male", "Female", "Non-binary", "Prefer not to say"].map(
              (option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setGender(option);
                    setShowGenderModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const PLACEHOLDER = "#A8B5C8";
const INPUT_BG = "#F5F7FA";
const INPUT_BORDER = "#E8EDF5";
const PHOTO_BG = "#E8F0FF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  title: { fontSize: 24, color: TEXT, fontFamily: "RCB-Bold" },
  stepText: { fontSize: 14, color: MUTED, fontFamily: "RCB-Regular" },
  subtitle: {
    fontSize: 16,
    color: MUTED,
    fontFamily: "RCB-Regular",
    marginBottom: 32,
  },

  photoSection: { alignItems: "center", marginBottom: 32 },
  photoContainer: { alignItems: "center" },
  photoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: PHOTO_BG,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profilePhoto: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  cameraIcon: { width: 32, height: 32, tintColor: MUTED },
  addPhotoText: { fontSize: 16, color: MUTED, fontFamily: "RCB-Regular" },
  changePhotoText: { fontSize: 16, color: BLUE, fontFamily: "RCB-Medium" },

  form: { gap: 24 },
  inputSection: { gap: 8 },
  inputLabel: { fontSize: 16, color: TEXT, fontFamily: "RCB-Medium" },
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
  bioInput: { height: 120, paddingTop: 16 },
  dropdownInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { fontSize: 16, color: TEXT, fontFamily: "RCB-Regular" },
  placeholderText: { color: PLACEHOLDER },
  chevronIcon: { width: 20, height: 20, tintColor: MUTED },

  skillsInputContainer: { marginBottom: 12 },
  skillsInput: {
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
  skillsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
  },
  skillText: {
    fontSize: 14,
    color: TEXT,
    fontFamily: "RCB-Regular",
    marginRight: 6,
  },
  removeSkillIcon: { width: 16, height: 16, tintColor: MUTED },

  continueBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  continueBtnDisabled: { backgroundColor: MUTED, opacity: 0.5 },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "RCB-SemiBold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, color: TEXT, fontFamily: "RCB-SemiBold" },
  closeIcon: { width: 24, height: 24, tintColor: TEXT },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER,
  },
  modalOptionText: { fontSize: 16, color: TEXT, fontFamily: "RCB-Regular" },
});
