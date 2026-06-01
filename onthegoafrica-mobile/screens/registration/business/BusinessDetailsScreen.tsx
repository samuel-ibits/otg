// screens/business/BusinessDetailsScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBusinessProfile } from "../../../api/api";
import * as ImagePicker from "expo-image-picker";

const BACK_ICON = require("../../../assets/icons/back.png");
const CARET_ICON = require("../../../assets/icons/down.png");

type Option = { id: string; label: string };

const BUSINESS_TYPES: Option[] = [
  { id: "cafe", label: "Cafe" },
  { id: "restaurant", label: "Restaurant" },
  { id: "cowork", label: "Co-working Space" },
  { id: "bar", label: "Bar" },
  { id: "hotel", label: "Hotel" },
];

const STATES: Option[] = [
  { id: "lagos", label: "Lagos" },
  { id: "abuja", label: "Abuja" },
  { id: "oyo", label: "Oyo" },
];

const CITIES: Record<string, Option[]> = {
  lagos: [
    { id: "lekki", label: "Lekki" },
    { id: "ikeja", label: "Ikeja" },
    { id: "yaba", label: "Yaba" },
  ],
  abuja: [
    { id: "maitama", label: "Maitama" },
    { id: "garki", label: "Garki" },
  ],
  oyo: [
    { id: "ibadan", label: "Ibadan" },
  ],
};

const AMENITIES: Option[] = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "cowork", label: "Co-working space" },
  { id: "coffee", label: "Coffee" },
  { id: "power", label: "Power outlets" },
  { id: "parking", label: "Parking" },
];

export default function BusinessDetailsScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<Option | null>(null);

  const [useCurrent, setUseCurrent] = React.useState(false);
  const [street, setStreet] = React.useState("");
  const [stateOpt, setStateOpt] = React.useState<Option | null>(null);
  const [cityOpt, setCityOpt] = React.useState<Option | null>(null);

  const [desc, setDesc] = React.useState("");

  const [amenityIds, setAmenityIds] = React.useState<string[]>([]);
  const [logo, setLogo] = React.useState<{ uri: string } | null>(null);

  // simple modal select controls
  const [selectOpen, setSelectOpen] = React.useState<
    null | { field: "type" | "state" | "city" | "amenities" }
  >(null);

  const openSelect = (field: "type" | "state" | "city" | "amenities") =>
    setSelectOpen({ field });
  const closeSelect = () => setSelectOpen(null);

  const toggleAmenity = (id: string) => {
    setAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const pickLogo = async () => {
    try {
      // Try expo-image-picker if available
      // @ts-ignore dynamic import at runtime
      // const ImagePicker = await import("expo-image-picker");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Media library permission is needed.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: false,
      });
      if (!res.canceled && res.assets?.length) {
        setLogo({ uri: res.assets[0].uri });
      }
    } catch {
      // Fallback: set a placeholder if expo-image-picker is not installed
      setLogo({
        uri: "https://images.unsplash.com/photo-1541976076758-347942db1970?w=800&q=80",
      });
    }
  };

  const canSubmit =
    name.trim().length > 0 &&
    type &&
    (useCurrent || street.trim().length > 0 || (!!stateOpt && !!cityOpt));

  const onNext = async () => {
    if (!canSubmit) {
      Alert.alert("Missing info", "Fill the required fields to continue.");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the data for API call
      const profileData = {
        userName: name.trim(),
        bio: desc,
        businessType: type?.id || "",
        picture: logo,
        address: useCurrent ? "Current Location" : `${street}, ${cityOpt?.label}, ${stateOpt?.label}`,
        geolocation: "[1.221, 1.2121]", // You might want to get actual geolocation
        profileType: "business",
        amenities: amenityIds.map(id => AMENITIES.find(a => a.id === id)?.label || id),
      };

      // Call the API
      const response = await createBusinessProfile(profileData);

      // Show success message
      Alert.alert("Success", response.message || "Business profile created successfully!");

      // Navigate back to the setup list and mark this step complete
      navigation.navigate("CreateBusinessProfile", {
        markDone: "businessDetails",
        profileId: response.profile?.id
      });

    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create business profile");
    } finally {
      setIsLoading(false);
    }
  };

  const stateCities = stateOpt ? CITIES[stateOpt.id] ?? [] : [];

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Image source={BACK_ICON} style={s.back} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Business Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Business name */}
          <Field label="Business Name">
            <Input
              placeholder="Business Name"
              value={name}
              onChangeText={setName}
            />
          </Field>

          {/* Business type */}
          <Field label="Business Type">
            <Select
              placeholder="e.g; Restaurant"
              valueLabel={type?.label}
              onPress={() => openSelect("type")}
            />
          </Field>

          {/* Address group */}
          <Text style={s.groupTitle}>Address</Text>
          <View style={s.addressCard}>
            <Checkbox
              label="Use my current location"
              checked={useCurrent}
              onToggle={() => setUseCurrent((x) => !x)}
            />

            {!useCurrent && (
              <>
                <Field label="Business Street Address" dense>
                  <Input
                    placeholder="Enter Address"
                    value={street}
                    onChangeText={setStreet}
                  />
                </Field>

                <View style={s.row2}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Field label="State" dense>
                      <Select
                        placeholder="Select State"
                        valueLabel={stateOpt?.label}
                        onPress={() => openSelect("state")}
                      />
                    </Field>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="City" dense>
                      <Select
                        placeholder="Select City"
                        valueLabel={cityOpt?.label}
                        onPress={() => openSelect("city")}
                        disabled={!stateOpt}
                      />
                    </Field>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Describe */}
          <Field label="Describe your business">
            <Input
              placeholder="Richness of coffee for your well being"
              multiline
              numberOfLines={4}
              value={desc}
              onChangeText={setDesc}
            />
            <Text style={s.counter}>{`${Math.min(desc.length, 400)}/400 minimum characters`}</Text>
          </Field>

          {/* Amenities */}
          <Field label="Add Amenities">
            <Select
              placeholder="Select amenities"
              valueLabel={amenityIds.length ? `${amenityIds.length} selected` : undefined}
              onPress={() => openSelect("amenities")}
              rightIcon
            />
            {amenityIds.length > 0 && (
              <View style={s.chipsWrap}>
                {amenityIds.map((id) => {
                  const label = AMENITIES.find((a) => a.id === id)?.label ?? id;
                  return (
                    <View key={id} style={s.chip}>
                      <Text style={s.chipTxt}>{label}</Text>
                      <Text style={s.chipX} onPress={() => toggleAmenity(id)}>
                        ×
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </Field>

          {/* Upload logo */}
          <Field label="Upload logo">
            {logo ? (
              <Image source={logo} style={s.logoImg} />
            ) : (
              <TouchableOpacity style={s.uploadBox} activeOpacity={0.9} onPress={pickLogo}>
                <Text style={s.plus}>＋</Text>
                <Text style={s.uploadHint}>
                  Upload Business Logo{"\n"}PNG, JPEG, JPG. Max of 200KB
                </Text>
              </TouchableOpacity>
            )}
          </Field>

          <View style={{ height: 18 }} />
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity
            style={[s.nextBtn, (!canSubmit || isLoading) && s.nextBtnDisabled]}
            disabled={!canSubmit || isLoading}
            onPress={onNext}
            activeOpacity={0.9}
          >
            <Text style={s.nextTxt}>
              {isLoading ? "Creating..." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Select modals */}
      <PickerModal
        visible={selectOpen?.field === "type"}
        title="Business Type"
        options={BUSINESS_TYPES}
        selectedIds={type ? [type.id] : []}
        multi={false}
        onClose={closeSelect}
        onSubmit={(ids) => {
          const id = ids[0];
          setType(BUSINESS_TYPES.find((o) => o.id === id) ?? null);
          closeSelect();
        }}
      />

      <PickerModal
        visible={selectOpen?.field === "state"}
        title="State"
        options={STATES}
        selectedIds={stateOpt ? [stateOpt.id] : []}
        multi={false}
        onClose={closeSelect}
        onSubmit={(ids) => {
          const id = ids[0];
          const opt = STATES.find((o) => o.id === id) ?? null;
          setStateOpt(opt);
          setCityOpt(null); // reset city when state changes
          closeSelect();
        }}
      />

      <PickerModal
        visible={selectOpen?.field === "city"}
        title="City"
        options={stateCities}
        selectedIds={cityOpt ? [cityOpt.id] : []}
        multi={false}
        onClose={closeSelect}
        onSubmit={(ids) => {
          const id = ids[0];
          const opt = stateCities.find((o) => o.id === id) ?? null;
          setCityOpt(opt);
          closeSelect();
        }}
      />

      <PickerModal
        visible={selectOpen?.field === "amenities"}
        title="Amenities"
        options={AMENITIES}
        selectedIds={amenityIds}
        multi
        onClose={closeSelect}
        onSubmit={(ids) => {
          setAmenityIds(ids);
          closeSelect();
        }}
      />
    </SafeAreaView>
  );
}

/* --- Small components --- */

function Field({
  label,
  dense,
  children,
}: {
  label: string;
  dense?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: dense ? 10 : 16 }}>
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
      style={[
        s.input,
        props.multiline && { height: 120, textAlignVertical: "top", paddingTop: 12 },
      ]}
    />
  );
}

function Select({
  placeholder,
  valueLabel,
  onPress,
  disabled,
  rightIcon,
}: {
  placeholder: string;
  valueLabel?: string;
  onPress?: () => void;
  disabled?: boolean;
  rightIcon?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[s.input, { flexDirection: "row", alignItems: "center" }]}
    >
      <Text style={[s.selectText, !valueLabel && { color: "#A2B0C3" }]}>
        {valueLabel ?? placeholder}
      </Text>
      <Image source={CARET_ICON} style={[s.caret, rightIcon && { marginLeft: 8 }]} />
    </TouchableOpacity>
  );
}

function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity style={s.checkboxRow} onPress={onToggle} activeOpacity={0.8}>
      <View style={[s.checkboxBox, checked && s.checkboxBoxChecked]}>
        {checked ? <Text style={s.checkboxTick}>✓</Text> : null}
      </View>
      <Text style={s.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function PickerModal({
  visible,
  title,
  options,
  selectedIds,
  multi,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  title: string;
  options: Option[];
  selectedIds: string[];
  multi: boolean;
  onClose: () => void;
  onSubmit: (ids: string[]) => void;
}) {
  const [chosen, setChosen] = React.useState<string[]>(selectedIds);

  React.useEffect(() => setChosen(selectedIds), [selectedIds, visible]);

  const toggle = (id: string) => {
    if (!multi) {
      setChosen([id]);
      return;
    }
    setChosen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>{title}</Text>

          <FlatList
            data={options}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => {
              const active = chosen.includes(item.id);
              return (
                <TouchableOpacity
                  style={[s.optRow, active && s.optRowActive]}
                  onPress={() => toggle(item.id)}
                >
                  <Text style={[s.optLabel, active && s.optLabelActive]}>{item.label}</Text>
                  {active ? <Text style={s.optCheck}>✓</Text> : null}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />

          <View style={s.modalBtns}>
            <TouchableOpacity style={s.modalCancel} onPress={onClose}>
              <Text style={s.modalCancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.modalApply}
              onPress={() => onSubmit(chosen)}
              activeOpacity={0.9}
            >
              <Text style={s.modalApplyTxt}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* --- Styles --- */
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const INPUT_BG = "#F3F6FA";
const INPUT_BORDER = "#E6ECF5";
const BLUE = "#0145FE";
const CARD_BG = "#8FA0B7";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: INPUT_BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, resizeMode: "contain", tintColor: TEXT },
  headerTitle: { color: TEXT, fontSize: 16, fontFamily: "RCB-SemiBold" },

  label: {
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    marginBottom: 8,
  },

  groupTitle: {
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    marginBottom: 8,
    marginTop: 10,
  },

  addressCard: {
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },

  input: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: "RCB-Regular",
    color: TEXT,
  },
  selectText: { flex: 1, fontFamily: "RCB-Regular", color: TEXT },
  caret: { width: 16, objectFit: 'contain', tintColor: "#8DA0B7" },

  checkboxRow: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E3EAF4",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#7587A1",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxBoxChecked: {
    backgroundColor: "#126BFB",
    borderColor: "#126BFB",
  },
  checkboxTick: { color: "#fff", fontSize: 12, lineHeight: 12 },
  checkboxLabel: { color: TEXT, fontFamily: "RCB-Regular" },

  row2: { flexDirection: "row" },

  counter: {
    color: MUTED,
    fontSize: 12,
    marginTop: 6,
    fontFamily: "RCB-Regular",
  },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#EFF4FB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1E9F5",
  },
  chipTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },
  chipX: { color: "#51627C", fontSize: 14, marginLeft: 8 },

  uploadBox: {
    height: 130,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C9D4E6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFCFF",
  },
  plus: { fontSize: 24, color: "#6D7D96", marginBottom: 6 },
  uploadHint: {
    textAlign: "center",
    color: "#6D7D96",
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  logoImg: { width: 100, height: 100, borderRadius: 8 },

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
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontFamily: "RCB-SemiBold",
    color: TEXT,
    fontSize: 16,
    marginBottom: 10,
  },
  optRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F3F6FA",
    borderWidth: 1,
    borderColor: "#E6ECF5",
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
    marginRight: 8,
  },
  modalCancelTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },
  modalApply: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  modalApplyTxt: { color: "#fff", fontFamily: "RCB-SemiBold" },
});
