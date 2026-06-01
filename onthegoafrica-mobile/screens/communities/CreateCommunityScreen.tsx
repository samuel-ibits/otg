import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CommunityCreatedModal from "./../../component/CommunityCreatedModal";
import { createGroupChat } from "../../api/messaging";

type Visibility = "Private" | "Public";
type PrivateExposure = "Listed" | "InviteOnly";

export default function CreateCommunityScreen({ navigation }: any) {
  const [visibility, setVisibility] = useState<Visibility>("Private");
  const [privateExposure, setPrivateExposure] =
    useState<PrivateExposure>("InviteOnly");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [profileIds, setProfileIds] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to upload.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.9,
    });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const createCommunity = async () => {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a community name.");
      return;
    }
    // Submit payload as needed

    //submit create chat
    await createGroupChat(
      name,
      desc,
      visibility,
      privateExposure,
      photoUri,
      profileIds
    );
    setShowSuccess(true);
  };

  const handleInviteFromModal = () => {
    setShowSuccess(false);
    navigation.navigate("InviteFriends");
  };

  return (
    <SafeAreaView style={s.root}>
      <CommunityCreatedModal
        visible={showSuccess}
        onInvite={handleInviteFromModal}
        onClose={() => setShowSuccess(false)}
      />

      {/* Top bar */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>Create Community</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Photo uploader */}
        <TouchableOpacity
          style={s.photoCircle}
          onPress={pickPhoto}
          activeOpacity={0.85}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={s.photoImg} />
          ) : (
            <View style={s.photoPlaceholder}>
              <View style={s.photoIconBox}>
                <Image
                  source={require("../../assets/icons/camera.png")}
                  style={s.cameraIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={s.photoText}>Upload photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Visibility */}
        <View style={s.card}>
          <Text style={s.qText}>
            What type of community do you want to create?
          </Text>
          <View style={s.radioRow}>
            <Radio
              label="Private"
              selected={visibility === "Private"}
              onPress={() => setVisibility("Private")}
            />
            <View style={{ width: 18 }} />
            <Radio
              label="Public"
              selected={visibility === "Public"}
              onPress={() => setVisibility("Public")}
            />
          </View>

          {/* Private exposure control */}
          {visibility === "Private" && (
            <View style={s.privateWrap}>
              <Text style={s.privateTitle}>Private visibility</Text>

              <TouchableOpacity
                style={[
                  s.optionRow,
                  privateExposure === "Listed" && s.optionRowActive,
                ]}
                onPress={() => setPrivateExposure("Listed")}
                activeOpacity={0.9}
              >
                <View style={s.optionLeft}>
                  <View
                    style={[
                      s.dotOuter,
                      privateExposure === "Listed" && s.dotOuterActive,
                    ]}
                  >
                    {privateExposure === "Listed" && (
                      <View style={s.dotInner} />
                    )}
                  </View>
                  <Text style={s.optionTitle}>Show in public feed</Text>
                </View>
                <Text style={s.optionDesc}>
                  Community is discoverable in the public community feed. Only
                  invited people can join.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.optionRow,
                  privateExposure === "InviteOnly" && s.optionRowActive,
                ]}
                onPress={() => setPrivateExposure("InviteOnly")}
                activeOpacity={0.9}
              >
                <View style={s.optionLeft}>
                  <View
                    style={[
                      s.dotOuter,
                      privateExposure === "InviteOnly" && s.dotOuterActive,
                    ]}
                  >
                    {privateExposure === "InviteOnly" && (
                      <View style={s.dotInner} />
                    )}
                  </View>
                  <Text style={s.optionTitle}>Invite-only visibility</Text>
                </View>
                <Text style={s.optionDesc}>
                  Hidden from the public feed. Only people with an invite can
                  see and access it.
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={s.label}>Community name</Text>
        <TextInput
          style={s.input}
          placeholder="@janedoe"
          placeholderTextColor="#A4B0C4"
          value={name}
          onChangeText={setName}
        />

        {/* Description */}
        <Text style={[s.label, { marginTop: 18 }]}>Description</Text>
        <TextInput
          style={s.textArea}
          multiline
          placeholder="Tell people what this community is about"
          placeholderTextColor="#A4B0C4"
          value={desc}
          onChangeText={setDesc}
        />

        {/* CTA */}
        <TouchableOpacity
          style={s.cta}
          onPress={createCommunity}
          activeOpacity={0.9}
        >
          <Text style={s.ctaText}>Create Community</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Subcomponents ---------- */

function Radio({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={s.radio} activeOpacity={0.9}>
      <View style={[s.dotOuter, selected && s.dotOuterActive]}>
        {selected && <View style={s.dotInner} />}
      </View>
      <Text style={[s.radioText, selected && s.radioTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- Styles ---------- */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6ECF5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  backArrow: { fontSize: 28, color: "#0A1220" },
  title: { fontSize: 18, color: "#0A1220", fontFamily: "RCB-Bold" },

  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 28 },

  photoCircle: {
    alignSelf: "center",
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#F1F6FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  photoImg: { width: "100%", height: "100%", borderRadius: 100 },
  photoPlaceholder: { alignItems: "center", justifyContent: "center" },
  photoIconBox: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cameraIcon: { width: 32, height: 32 },
  photoText: { color: "#637798", fontFamily: "RCB-SemiBold" },

  card: {
    backgroundColor: "#F6FAFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6F0FB",
    marginBottom: 18,
  },
  qText: {
    color: "#0A1220",
    fontSize: 16,
    fontFamily: "RCB-SemiBold",
    marginBottom: 12,
  },
  radioRow: { flexDirection: "row", alignItems: "center" },

  radio: { flexDirection: "row", alignItems: "center" },
  dotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D3DEEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  dotOuterActive: { borderColor: "#0A59FF" },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0A59FF",
  },
  radioText: { color: "#4A5D79", fontFamily: "RCB-SemiBold", fontSize: 16 },
  radioTextActive: { color: "#0A1220" },

  /* Private exposure block */
  privateWrap: {
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6F0FB",
    paddingTop: 12,
    gap: 10,
  },
  privateTitle: {
    color: "#0A1220",
    fontFamily: "RCB-SemiBold",
    marginBottom: 2,
  },
  optionRow: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6EDF7",
    borderRadius: 12,
    padding: 12,
  },
  optionRowActive: {
    borderColor: "#0A59FF",
  },
  optionLeft: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  optionTitle: { color: "#0A1220", fontFamily: "RCB-SemiBold", fontSize: 15 },
  optionDesc: { color: "#7C8CA5", fontFamily: "RCB-Regular", lineHeight: 18 },

  label: {
    color: "#0A1220",
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F6FD",
    borderWidth: 1,
    borderColor: "#E6F0FB",
    paddingHorizontal: 16,
    color: "#0A1220",
    fontFamily: "RCB-Regular",
  },
  textArea: {
    minHeight: 140,
    borderRadius: 20,
    backgroundColor: "#F1F6FD",
    borderWidth: 1,
    borderColor: "#E6F0FB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#0A1220",
    fontFamily: "RCB-Regular",
  },

  cta: {
    marginTop: 28,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0A59FF",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#FFFFFF", fontSize: 18, fontFamily: "RCB-SemiBold" },
});
