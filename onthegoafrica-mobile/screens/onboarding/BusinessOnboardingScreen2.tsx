// screens/registration/business/BusinessProfileSetupScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { createBusinessProfile } from "../../api/api"; // ✅ adjust import path
import countries from "../../assets/data/countries.json";
import { useNavigation } from "@react-navigation/native";
// --- Common Style Variables ---
const GRAY = "#6B7280";
interface Category {
  id: string;
  title: string;
  description: string;
}

export const BusinessCategoryScreen = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const categories: Category[] = [
    {
      id: "sme",
      title: "SME",
      description: "Small & Medium Enterprise with <5 branches",
    },
    {
      id: "large_enterprise",
      title: "Large Enterprise",
      description: "Large Enterprise with >5 branches",
    },
  ];

  const handleContinue = async () => {
    if (!selected) return;

    await AsyncStorage.mergeItem(
      "businessProfileData",
      JSON.stringify({
        businessCategory: selected,
      })
    );

    navigation.navigate("BusinessName");
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.content}>
        {/* Header */}
        <TouchableOpacity
          style={s.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={s.title}>Select business{"\n"}category</Text>
        <Text style={s.subtitle}>Define your business size</Text>

        {/* Options */}
        <View style={s.optionsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[s.option, selected === category.id && s.optionSelected]}
              onPress={() => setSelected(category.id)}
            >
              <View style={s.optionContent}>
                <View style={s.optionText}>
                  <Text style={s.optionTitle}>{category.title}</Text>
                  <Text style={s.optionDescription}>
                    {category.description}
                  </Text>
                </View>
                <View
                  style={[s.radio, selected === category.id && s.radioSelected]}
                >
                  {selected === category.id && <View style={s.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Continue Button */}
        <TouchableOpacity
          style={[s.button, !selected && s.buttonDisabled]}
          disabled={!selected}
          onPress={handleContinue}
        >
          <Text style={s.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// --- 1️⃣ Business Name ---
export const BusinessNameScreen = ({ navigation }: any) => {
  const [businessName, setBusinessName] = useState("");

  const handleContinue = async () => {
    await AsyncStorage.mergeItem(
      "businessProfileData",
      JSON.stringify({ userName: businessName })
    );
    navigation.navigate("HeadOfficeAddress");
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.keyboardView}
      >
        <View style={s.content}>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={s.title}>What's your{"\n"}business name?</Text>

          <TextInput
            style={s.input}
            placeholder="The Cozy Cafe"
            placeholderTextColor={GRAY}
            value={businessName}
            onChangeText={setBusinessName}
          />

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[s.button, !businessName && s.buttonDisabled]}
            disabled={!businessName}
            onPress={handleContinue}
          >
            <Text style={s.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- 2️⃣ Business Location ---
export const BusinessLocationScreen = ({ navigation }: any) => {
  const [location, setLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleContinue = async () => {
    let geoLocation = "[]";

    if (useCurrentLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied", status);
        return;
      }
      console.log("Permission granted, fetching location..", status);
      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      geoLocation = `${latitude},${longitude}`;
    }
    await AsyncStorage.mergeItem(
      "businessProfileData",
      JSON.stringify({
        address: location,
        geoLocation,
      })
    );

    navigation.navigate("BusinessCAC");
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.keyboardView}
      >
        <View style={s.content}>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={s.title}>Where's your{"\n"}business located?</Text>

          <TextInput
            style={s.input}
            placeholder="Full address"
            placeholderTextColor={GRAY}
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={s.checkboxRow}
            onPress={() => setUseCurrentLocation(!useCurrentLocation)}
          >
            <View style={[s.checkbox, useCurrentLocation && s.checkboxChecked]}>
              {useCurrentLocation && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={s.checkboxLabel}>Use your current location</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[s.button, !location && s.buttonDisabled]}
            disabled={!location}
            onPress={handleContinue}
          >
            <Text style={s.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ---Head Office ---
export const HeadOfficeAddressScreen = ({ navigation }: any) => {
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isFormValid = streetAddress && city && state && country;

  const handleSave = async () => {
    let geoLocation = [0, 0];

    if (useCurrentLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied", status);
        return;
      }
      console.log("Permission granted, fetching location..", status);
      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      geoLocation = `${latitude},${longitude}`;
    }
    await AsyncStorage.mergeItem(
      "businessProfileData",
      JSON.stringify({
        geoLocation,
        streetAddress,
        city,
        state,
        country,
      })
    );
  };

  const handleNext = async () => {
    await handleSave();

    navigation.navigate("BusinessCAC");
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.keyboardView}
      >
        <View style={s.content}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity
              style={s.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={s.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={s.title}>Head Office Address</Text>
            <View style={s.placeholder} />
          </View>

          {/* Form Fields */}
          <View style={s.form}>
            <View style={s.fieldGroup}>
              <Text style={s.label}>Street Address</Text>
              <TextInput
                style={s.input}
                placeholder="123 John Str."
                placeholderTextColor={GRAY}
                value={streetAddress}
                onChangeText={setStreetAddress}
              />
            </View>

            <View style={s.row}>
              <View style={[s.fieldGroup, s.halfWidth]}>
                <Text style={s.label}>City</Text>
                <TextInput
                  style={s.input}
                  placeholder="Victoria Island"
                  placeholderTextColor={GRAY}
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={[s.fieldGroup, s.halfWidth]}>
                <Text style={s.label}>State</Text>
                <TextInput
                  style={s.input}
                  placeholder="Lagos"
                  placeholderTextColor={GRAY}
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>Country</Text>

              <TouchableOpacity
                style={s.selectInput}
                onPress={() => setShowModal(true)}
              >
                <TextInput
                  style={s.selectText}
                  placeholder="Please Select"
                  placeholderTextColor="#888"
                  value={country}
                  editable={false}
                />
                <Text style={s.dropdownIcon}>▼</Text>
              </TouchableOpacity>

              {/* Modal for selecting a country */}
              <Modal visible={showModal} animationType="slide">
                <View style={s.modalContainer}>
                  <Text style={s.modalTitle}>Select Country</Text>

                  <FlatList
                    data={countries}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={s.countryItem}
                        onPress={() => {
                          setCountry(item.name);
                          setShowModal(false);
                        }}
                      >
                        <Text style={s.countryName}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity
                    style={s.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={s.closeText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
          <View style={s.fieldGroup}>
            <TouchableOpacity
              style={s.checkboxRow}
              onPress={() => setUseCurrentLocation(!useCurrentLocation)}
            >
              <View
                style={[s.checkbox, useCurrentLocation && s.checkboxChecked]}
              >
                {useCurrentLocation && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.checkboxLabel}>Use your current location</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }} />
          {/* Buttons */}
          <View style={s.buttonContainer}>
            <TouchableOpacity style={s.saveButton} onPress={handleSave}>
              <Text style={s.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.nextButton, !isFormValid && s.buttonDisabled]}
              disabled={!isFormValid}
              onPress={handleNext}
            >
              <Text style={s.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- 3️⃣ CAC Number ---
export const BusinessCACScreen = ({ navigation }: any) => {
  const [cacNumber, setCacNumber] = useState("");

  const handleContinue = async () => {
    await AsyncStorage.mergeItem(
      "businessProfileData",
      JSON.stringify({ cacNo: cacNumber })
    );
    navigation.navigate("BusinessLogo");
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.keyboardView}
      >
        <View style={s.content}>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={s.title}>Enter your{"\n"}CAC Reg Number</Text>

          <TextInput
            style={s.input}
            placeholder="BN: 02302016"
            placeholderTextColor={GRAY}
            value={cacNumber}
            onChangeText={setCacNumber}
          />

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[s.button, !cacNumber && s.buttonDisabled]}
            disabled={!cacNumber}
            onPress={handleContinue}
          >
            <Text style={s.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- 4️⃣ Add Logo ---

export const BusinessLogoScreen = ({ navigation }: any) => {
  const [logo, setLogo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setLogo(image);
      await AsyncStorage.mergeItem(
        "businessProfileData",
        JSON.stringify({ picture: image.uri })
      );
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const saved = await AsyncStorage.getItem("businessProfileData");
      const data = saved ? JSON.parse(saved) : {};

      const payload = {
        state: data.state,
        city: data.city,
        country: data.country,
        businessCategory: data.businessCategory,
        cacNo: data.cacNo,
        userName: data.userName || "",

        picture: data.picture ? data.picture : null,
        streetAddress: data.streetAddress || "",
        geoLocation: data.geoLocation || [0, 0],
        profileType: "business",
      };

      const result = await createBusinessProfile(payload);
      console.log("✅ Business created:", result);

      Alert.alert("Success", "Business profile created successfully!");
      // await AsyncStorage.removeItem("businessProfileData");
      // const category = data.businessCategory;
      // if (category == "sme") navigation.navigate("SmeBusinessInformation");
      // else navigation.navigate("largeOnboarding");
      navigation.navigate("SmeBusinessInformation");
    } catch (error: any) {
      console.error("❌ Error:", error);
      Alert.alert("Error", error.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.imagecontent}>
        <TouchableOpacity
          style={styles.imagebackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.imagebackIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.imagetitle}>Add your{"\n"}business logo</Text>
        <Text style={s.subtitle}>
          This is needed to easily identify your business
        </Text>

        {/* Business Logo Preview Circle */}
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
          {logo ? (
            <Image source={{ uri: logo.uri }} style={styles.logoImage} />
          ) : (
            <Text style={styles.uploadIcon}>📷</Text>
          )}
          <Text style={styles.uploadText}>
            {logo ? "Change Logo" : "Upload Logo"}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.imagebutton}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.imagebuttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// --- 5️⃣ Final Submission ---
export const BusinessLogoConfirmScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const saved = await AsyncStorage.getItem("businessProfileData");
      const data = saved ? JSON.parse(saved) : {};

      const payload = {
        state: data.state,
        city: data.city,
        country: data.country,
        businessCategory: data.businessCategory,
        cacNo: data.cacNo,
        userName: data.userName || "",

        // picture: data.picture ? data.picture : null,
        streetAddress: data.streetAddress || "",
        geoLocation: data.geoLocation || [0, 0],
        profileType: "business",
      };

      const result = await createBusinessProfile(payload);
      console.log("✅ Business created:", data);

      Alert.alert("Success", "Business profile created successfully!");
      // await AsyncStorage.removeItem("businessProfileData");
      // const category = data.businessCategory;
      // if (category == "sme") navigation.navigate("SmeBusinessInformation");
      // else navigation.navigate("largeOnboarding");
      navigation.navigate("SmeBusinessInformation");
    } catch (error: any) {
      console.error("❌ Error:", error);
      Alert.alert("Error", error.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.content}>
        <Text style={s.title}>Confirm your{"\n"}Business Profile</Text>
        <Text style={s.subtitle}>Click finish to submit all details</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={BLUE}
            style={{ marginTop: 40 }}
          />
        ) : (
          <TouchableOpacity style={s.button} onPress={handleSubmit}>
            <Text style={s.buttonText}>Finish & Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---

const BLUE = "#0066FF";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const LIGHT_BLUE = "#B3D4FF";
const LIGHT_GRAY = "#F5F5F5";
const DARK = "#1A1A1A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 28,
    color: TEXT_DARK,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 32,
  },
  progressFill: {
    height: "100%",
    backgroundColor: BLUE,
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_DARK,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: TEXT_DARK,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: TEXT_DARK,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: 14,
    color: TEXT_DARK,
  },
  button: {
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A8C5FF",
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addressBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  addressText: {
    fontSize: 16,
    color: TEXT_DARK,
  },
  suggestionsList: {
    flex: 1,
    marginTop: 16,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  suggestionName: {
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: "600",
    marginBottom: 4,
  },
  suggestionSubtext: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  confirmedBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  confirmedText: {
    fontSize: 16,
    color: TEXT_DARK,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadIconText: {
    fontSize: 24,
  },
  logoPreview: {
    position: "relative",
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 20,
  },
  imagecontent: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  imagebackButton: { position: "absolute", top: 20, left: 20, zIndex: 1 },
  imagebackIcon: { fontSize: 28, color: "#111827" },
  imagetitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A1220",
    marginBottom: 2,
    marginTop: 30,
    textAlign: "center",
  },
  uploadBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  uploadIcon: { fontSize: 40 },
  logoImage: { width: 120, height: 120, borderRadius: 60 },
  uploadText: { color: "#555", marginTop: 8 },
  imagebutton: {
    backgroundColor: "#0066FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 40,
  },
  imagebuttonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
});
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: 24 },
  backButton: { marginBottom: 10 },
  backIcon: { fontSize: 20, color: "#000" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A1220",
    marginBottom: 12,
  },
  subtitle: { color: "#6B7280", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 152 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: BLUE, borderColor: BLUE },
  checkmark: { color: "#FFF", fontWeight: "bold" },
  checkboxLabel: { color: "#111827" },
  uploadBox: {
    marginTop: 60,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 40,
  },
  uploadIcon: { fontSize: 40 },
  button: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: "#9CA3AF" },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK,
  },
  placeholder: {
    width: 40,
  },
  form: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: DARK,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  selectInput: {
    height: 52,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: DARK,
  },
  dropdownIcon: {
    fontSize: 10,
    color: GRAY,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    height: 56,
    backgroundColor: "transparent",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: BLUE,
  },
  nextButton: {
    flex: 1,
    height: 56,
    backgroundColor: BLUE,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    padding: 16,
  },
  optionSelected: {
    borderColor: BLUE,
    backgroundColor: "#F0F7FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: GRAY,
    lineHeight: 18,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
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

  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  countryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countryName: {
    fontSize: 16,
  },
  closeButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginTop: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});
export default BusinessNameScreen;
