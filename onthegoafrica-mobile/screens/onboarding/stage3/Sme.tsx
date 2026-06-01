import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker"; // If you're using Expo
import { useNavigation } from "@react-navigation/native";
import {
  addAmenities,
  addMoreInformation,
  uploadDocument,
} from "../../../api/api";

// ProfileScreen
const ProfileScreen = () => {
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [website, setWebsite] = useState("");
  const [idProof, setIdProof] = useState(null);
  const navigation = useNavigation<any>();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.uri);
    }
  };

  const pickIdProof = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setIdProof(result.uri);
    }
  };

  const handleNext = () => {
    const profileData = { gender, website, profilePic, idProof };
    navigation.navigate("SmeBusinessInformation", { profileData });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />
      <TextInput
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload Profile Picture</Text>
      </TouchableOpacity>
      {profilePic && (
        <Image source={{ uri: profilePic }} style={styles.imagePreview} />
      )}

      <TouchableOpacity onPress={pickIdProof} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload Identification</Text>
      </TouchableOpacity>
      {idProof && (
        <Image source={{ uri: idProof }} style={styles.imagePreview} />
      )}

      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

// SmeBusinessInformationScreen
const SmeBusinessInformationScreen = () => {
  const [businessType, setBusinessType] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [cacCertificate, setCacCertificate] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [bankStatement, setBankStatement] = useState(null);
  const [closeToUniversity, setCloseToUniversity] = useState("No");
  const [website, setWebsite] = useState("");
  const [idProof, setIdProof] = useState(null);
  const navigation = useNavigation<any>();

  const pickDocument = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      switch (type) {
        case "IdProof":
          setIdProof(result.uri);
          await uploadDocument({
            document: result.uri,
            documentType: "IdProof",
          });
          break;
        case "CAC":
          setCacCertificate(result.uri);
          await uploadDocument({ document: result.uri, documentType: "CAC" });
          break;
        case "Address":
          setAddressProof(result.uri);
          await uploadDocument({
            document: result.uri,
            documentType: "Address",
          });
          break;
        case "Bank":
          setBankStatement(result.uri);
          await uploadDocument({ document: result.uri, documentType: "Bank" });
          break;
        default:
          break;
      }
    }
  };

  const handleNext = async () => {
    const businessData = {
      businessType,
      businessDesc,
      website,
      cacCertificate,
      addressProof,
      bankStatement,
      closeToUniversity,
    };
    await addMoreInformation({
      bio: businessDesc,
      businessType,
      website,
    });

    navigation.navigate("Amenities");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Business Information</Text>
      <TextInput
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        style={styles.input}
      />
      <TextInput
        placeholder="Business Type"
        value={businessType}
        onChangeText={setBusinessType}
        style={styles.input}
      />
      <TextInput
        placeholder="Business Description"
        value={businessDesc}
        onChangeText={setBusinessDesc}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => pickDocument("IdProof")}
        style={styles.uploadButton}
      >
        <Text style={styles.uploadText}>Upload Identification</Text>
      </TouchableOpacity>
      {idProof && (
        <Image source={{ uri: idProof }} style={styles.imagePreview} />
      )}

      <TouchableOpacity
        onPress={() => pickDocument("CAC")}
        style={styles.uploadButton}
      >
        <Text style={styles.uploadText}>Upload CAC Certificate</Text>
      </TouchableOpacity>
      {cacCertificate && (
        <Image source={{ uri: cacCertificate }} style={styles.imagePreview} />
      )}

      <TouchableOpacity
        onPress={() => pickDocument("Address")}
        style={styles.uploadButton}
      >
        <Text style={styles.uploadText}>Upload Proof of Address</Text>
      </TouchableOpacity>
      {addressProof && (
        <Image source={{ uri: addressProof }} style={styles.imagePreview} />
      )}

      <TouchableOpacity
        onPress={() => pickDocument("Bank")}
        style={styles.uploadButton}
      >
        <Text style={styles.uploadText}>Upload Bank Statement</Text>
      </TouchableOpacity>
      {bankStatement && (
        <Image source={{ uri: bankStatement }} style={styles.imagePreview} />
      )}

      <Text style={styles.pickerLabel}>Are you close to a university?</Text>
      <Picker
        selectedValue={closeToUniversity}
        onValueChange={setCloseToUniversity}
        style={styles.picker}
      >
        <Picker.Item label="Yes" value="Yes" />
        <Picker.Item label="No" value="No" />
      </Picker>

      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

// AmenitiesScreen
const AmenitiesScreen = () => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const navigation = useNavigation<any>();

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleNext = async () => {
    try {
      const response = await addAmenities(selectedAmenities); // selectedAmenities is your array of selected amenities
      console.log("Amenities added successfully:", response);
      navigation.navigate("BusinessHours"); // Navigate to the next screen after saving amenities
    } catch (error) {
      console.error("Error adding amenities:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        What amenities does your business provide?
      </Text>
      {[
        "coffee",
        "wiFi",
        "Co-working space",
        "Food & Drinks",
        "Water",
        "Kitchen",
        "Private Workspace",
        "Conference Room",
      ].map((amenity) => (
        <TouchableOpacity
          key={amenity}
          style={[
            styles.amenityButton,
            selectedAmenities.includes(amenity) && styles.selectedAmenity,
          ]}
          onPress={() => toggleAmenity(amenity)}
        >
          <Text
            style={[
              styles.amenityText,
              selectedAmenities.includes(amenity) && styles.selectedAmenityText,
            ]}
          >
            {amenity}
          </Text>
        </TouchableOpacity>
      ))}

      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadText: {
    color: "#0066FF",
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  amenityButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedAmenity: {
    backgroundColor: "#0066FF",
    borderColor: "#0066FF",
  },
  amenityText: {
    fontSize: 16,
    color: "#111827",
  },
  selectedAmenityText: {
    color: "#FFF",
  },
});

export { ProfileScreen, SmeBusinessInformationScreen, AmenitiesScreen };
