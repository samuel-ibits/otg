// screens/business/BusinessWifiScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { addWifiDetails, getProfileId } from "../../../api/api"; // Import the API functions

const BACK_ICON = require("../../../assets/icons/back.png");
const CARET_ICON = require("../../../assets/icons/down.png");

type Option = { id: string; label: string };

const ROUTERS: Option[] = [
  { id: "tplink_ac1200", label: "TP-Link Archer AC1200" },
  { id: "tplink_ax1800", label: "TP-Link AX1800" },
  { id: "netgear_r7000", label: "Netgear R7000" },
  { id: "huawei_b535", label: "Huawei B535" },
  { id: "others", label: "Other" },
];

export default function BusinessWifiScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = React.useState(false);

  const [router, setRouter] = React.useState<Option | null>(null);
  const [capacity, setCapacity] = React.useState(""); // e.g. "10–20"
  const [isp, setIsp] = React.useState(""); // e.g. "Spectranet"
  const [password, setPassword] = React.useState(""); // WiFi password

  const [showPicker, setShowPicker] = React.useState(false);

  const canSubmit = !!router && capacity.trim().length > 0 && isp.trim().length > 0 && password.trim().length > 0;

  const onAdd = async () => {
    if (!canSubmit) return;
    
    setIsLoading(true);
    try {
      // Get the profile ID from AsyncStorage
      const profileId = await getProfileId();
      
      if (!profileId) {
        Alert.alert("Error", "Profile ID not found. Please create a profile first.");
        return;
      }

      // Prepare WiFi data - combine router and ISP info into the name field
      const wifiName = `${router?.label} - ${isp} (${capacity} users)`;
      
      const wifiData = {
        profileId: profileId,
        name: wifiName,
        password: password,
      };

      // Call the API
      const response = await addWifiDetails(wifiData);
      
      // Show success message
      Alert.alert("Success", "WiFi details saved successfully!");
      
      // Navigate back to the setup list and mark this step complete
      navigation.navigate("CreateBusinessProfile", { markDone: "wifi" });
      
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save WiFi details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={HS}>
            <Image source={BACK_ICON} style={s.back} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>WiFi Connection</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Body */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <Field label="Type of Router">
            <TouchableOpacity
              style={[s.input, s.inputRow]}
              activeOpacity={0.85}
              onPress={() => setShowPicker(true)}
            >
              <Text style={[s.selectText, !router && { color: "#A2B0C3" }]}>
                {router ? router.label : "Select Router"}
              </Text>
              <Image source={CARET_ICON} style={s.caret} />
            </TouchableOpacity>
          </Field>

          <Field label="Number of Users the Router Can Support">
            <Input
              placeholder="E.g 10–20"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numbers-and-punctuation"
            />
          </Field>

          <Field label="Internet Service Provider (ISP)">
            <Input
              placeholder="E.g Spectranet"
              value={isp}
              onChangeText={setIsp}
              autoCapitalize="words"
            />
          </Field>

          <Field label="WiFi Password">
            <Input
              placeholder="Enter WiFi password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </Field>
        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.nextBtn, (!canSubmit || isLoading) && s.nextBtnDisabled]}
            activeOpacity={0.9}
            disabled={!canSubmit || isLoading}
            onPress={onAdd}
          >
            <Text style={s.nextTxt}>
              {isLoading ? "Adding..." : "Add WiFi"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Router picker */}
      <Modal visible={showPicker} animationType="slide" transparent onRequestClose={() => setShowPicker(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Select Router</Text>
            <FlatList
              data={ROUTERS}
              keyExtractor={(it) => it.id}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => {
                const active = router?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[s.optRow, active && s.optRowActive]}
                    onPress={() => {
                      setRouter(item);
                      setShowPicker(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.optLabel, active && s.optLabelActive]}>{item.label}</Text>
                    {active ? <Text style={s.optCheck}>✓</Text> : null}
                  </TouchableOpacity>
                );
              }}
            />

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setShowPicker(false)}>
                <Text style={s.modalCancelTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* --- small components --- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
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

/* --- styles --- */
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
  inputRow: { flexDirection: "row", alignItems: "center" },
  selectText: { flex: 1, color: TEXT, fontFamily: "RCB-Regular" },
  caret: { width: 16, height: 16, tintColor: "#8DA0B7", marginLeft: 8, resizeMode: "contain" },

  footer: { padding: 16 },
  nextBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnDisabled: { backgroundColor: "#BFD0FF" },
  nextTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: WHITE,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalTitle: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16, marginBottom: 10 },
  optRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optRowActive: { backgroundColor: "#E9F1FF", borderColor: "#CFE0FF" },
  optLabel: { color: TEXT, fontFamily: "RCB-Regular" },
  optLabelActive: { fontFamily: "RCB-SemiBold" },
  optCheck: { color: "#14A44D", fontSize: 16 },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modalCancel: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#EEF2F8",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },
});