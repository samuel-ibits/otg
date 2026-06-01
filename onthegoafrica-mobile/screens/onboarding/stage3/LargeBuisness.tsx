import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import * as ImagePicker from "expo-image-picker"; // If using Expo for image picking

const LargeBusinessForm = () => {
  const [businessType, setBusinessType] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [website, setWebsite] = useState("");
  const [cacCertificate, setCacCertificate] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [bankStatement, setBankStatement] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [workingHours, setWorkingHours] = useState({});
  const [businessImages, setBusinessImages] = useState([]);

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      switch (type) {
        case "CAC":
          setCacCertificate(result.uri);
          break;
        case "Address":
          setAddressProof(result.uri);
          break;
        case "Bank":
          setBankStatement(result.uri);
          break;
        case "Business":
          setBusinessImages((prev) => [...prev, result.uri]);
          break;
        default:
          break;
      }
    }
  };

  const handleAmenitySelection = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* Business Information Section */}
      <Text>Business Information</Text>
      <TextInput
        placeholder="Business Type"
        value={businessType}
        onChangeText={setBusinessType}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Business Description"
        value={businessDesc}
        onChangeText={setBusinessDesc}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      {/* Address Section */}
      <Text>Head Office Address</Text>
      <TextInput
        placeholder="Street Address"
        value={address}
        onChangeText={setAddress}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Picker
        selectedValue={country}
        onValueChange={setCountry}
        style={{ marginBottom: 10 }}
      >
        <Picker.Item label="Please Select" value="" />
        <Picker.Item label="Nigeria" value="Nigeria" />
        {/* Add more countries as needed */}
      </Picker>

      {/* Document Upload Section */}
      <TouchableOpacity onPress={() => pickImage("CAC")}>
        <Text>Upload CAC Certificate</Text>
      </TouchableOpacity>
      {cacCertificate && (
        <Image
          source={{ uri: cacCertificate }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity onPress={() => pickImage("Address")}>
        <Text>Upload Proof of Address</Text>
      </TouchableOpacity>
      {addressProof && (
        <Image
          source={{ uri: addressProof }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity onPress={() => pickImage("Bank")}>
        <Text>Upload Bank Statement</Text>
      </TouchableOpacity>
      {bankStatement && (
        <Image
          source={{ uri: bankStatement }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      )}

      {/* Amenities Selection Section */}
      <Text>What amenities does your business provide?</Text>
      {[
        "Coffee",
        "Wi-Fi",
        "Co-working space",
        "Food & Drinks",
        "Water",
        "Kitchen",
        "Private Workspace",
        "Conference Room",
      ].map((amenity) => (
        <TouchableOpacity
          key={amenity}
          onPress={() => handleAmenitySelection(amenity)}
        >
          <Text style={{ marginBottom: 10 }}>{amenity}</Text>
        </TouchableOpacity>
      ))}

      {/* Business Hours Section */}
      <Text>Business Hours</Text>
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => (
        <View key={day} style={{ marginBottom: 10 }}>
          <Text>{day}</Text>
          <TextInput
            placeholder="Opens"
            style={{ borderBottomWidth: 1, marginBottom: 5 }}
          />
          <TextInput placeholder="Closes" style={{ borderBottomWidth: 1 }} />
        </View>
      ))}

      {/* Upload Business Location Images */}
      <Text>Upload Pictures of your business location</Text>
      {businessImages.map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      ))}
      <TouchableOpacity onPress={() => pickImage("Business")}>
        <Text>Upload Photos</Text>
      </TouchableOpacity>

      <Button title="Save" onPress={() => console.log("Form Submitted")} />
    </ScrollView>
  );
};

export default LargeBusinessForm;
