// screens/registration/business/WifiConfigScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Switch,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const I = {
  back: require("../../../assets/icons/back.png"),
  chevDown: require("../../../assets/icons/down.png"),
  chevRight: require("../../../assets/icons/chev-right.png"),
  lock: require("../../../assets/icons/lock.png"),
  wifi: require("../../../assets/icons/wifi.png"),
  speed: require("../../../assets/icons/speed.png"),
  globe: require("../../../assets/icons/globe.png"),
  shield: require("../../../assets/icons/shield-check.png"),
};

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#62718C";
const BORDER = "#E6EDF7";
const INPUT_BG = "#F3F7FE";
const SOFT = "#F5F8FF";

export default function WifiConfigScreen() {
  const navigation = useNavigation<any>();

  // form state
  const [ssid, setSsid] = useState("CafeOne-Free");
  const [band, setBand] = useState<"2.4GHz" | "5GHz" | "Dual">("Dual");
  const [security, setSecurity] = useState<"WPA2" | "WPA3" | "Open">("WPA2");
  const [password, setPassword] = useState("mimosacafe2024");
  const [captive, setCaptive] = useState(true);
  const [ticketRequired, setTicketRequired] = useState(true);
  const [download, setDownload] = useState("20"); // Mbps
  const [upload, setUpload] = useState("10"); // Mbps
  const [sessionMinutes, setSessionMinutes] = useState("60");

  // pickers
  const bandOpts = useMemo(() => ["2.4GHz", "5GHz", "Dual"], []);
  const secOpts = useMemo(() => ["WPA2", "WPA3", "Open"], []);
  const [showBand, setShowBand] = useState(false);
  const [showSec, setShowSec] = useState(false);

  const save = () => {
    if (!ssid.trim()) return Alert.alert("SSID required");
    if (security !== "Open" && password.trim().length < 8)
      return Alert.alert("Password must be at least 8 characters.");
    // TODO: persist to API
    Alert.alert("Saved", "Router configuration updated.");
    navigation.goBack();
  };

  const openTickets = () => navigation.navigate("Ticket");

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={I.back} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Router configuration</Text>
        <TouchableOpacity onPress={save} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 10, android: 0 })}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Network */}
          <Card>
            <RowTitle icon={I.wifi} title="Network" />
            <Field label="SSID">
              <TextInput
                value={ssid}
                onChangeText={setSsid}
                placeholder="Enter SSID"
                placeholderTextColor="#9FB1CC"
                style={s.input}
              />
            </Field>

            <Field label="Band">
              <Select value={band} onPress={() => setShowBand(true)} />
            </Field>

            <Field label="Security">
              <Select value={security} onPress={() => setShowSec(true)} />
            </Field>

            {security !== "Open" && (
              <Field label="Password">
                <View style={s.inputWithIcon}>
                  <Image source={I.lock} style={s.iconSmall} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="#9FB1CC"
                    secureTextEntry
                    style={[s.input, { flex: 1, backgroundColor: "transparent", borderWidth: 0, marginLeft: 8 }]}
                  />
                </View>
              </Field>
            )}
          </Card>

          {/* Access control */}
          <Card style={{ marginTop: 12 }}>
            <RowTitle icon={I.shield} title="Access control" />
            <ToggleRow
              label="Enable captive portal"
              value={captive}
              onValueChange={setCaptive}
              hint="Show a portal page before granting access."
            />
            <Separator />
            <ToggleRow
              label="Require ticket to connect"
              value={ticketRequired}
              onValueChange={setTicketRequired}
              hint="Only users with valid tickets can get online."
            />
            {ticketRequired && (
              <TouchableOpacity onPress={openTickets} style={s.inlineLink} activeOpacity={0.8}>
                <Text style={s.inlineLinkTxt}>Manage ticket profile</Text>
                <Image source={I.chevRight} style={s.chevR} />
              </TouchableOpacity>
            )}
          </Card>

          {/* Bandwidth */}
          <Card style={{ marginTop: 12 }}>
            <RowTitle icon={I.speed} title="Bandwidth limits" />
            <View style={{ flexDirection: "row" }}>
              <Field label="Download Mbps" style={{ flex: 1, marginRight: 10 }}>
                <TextInput
                  value={download}
                  onChangeText={(t) => setDownload(t.replace(/[^\d]/g, ""))}
                  keyboardType="number-pad"
                  style={s.input}
                  placeholder="e.g. 20"
                  placeholderTextColor="#9FB1CC"
                />
              </Field>
              <Field label="Upload Mbps" style={{ flex: 1 }}>
                <TextInput
                  value={upload}
                  onChangeText={(t) => setUpload(t.replace(/[^\d]/g, ""))}
                  keyboardType="number-pad"
                  style={s.input}
                  placeholder="e.g. 10"
                  placeholderTextColor="#9FB1CC"
                />
              </Field>
            </View>

            <Field label="Session duration (mins)" style={{ marginTop: 12 }}>
              <TextInput
                value={sessionMinutes}
                onChangeText={(t) => setSessionMinutes(t.replace(/[^\d]/g, ""))}
                keyboardType="number-pad"
                style={s.input}
                placeholder="e.g. 60"
                placeholderTextColor="#9FB1CC"
              />
            </Field>
          </Card>

          {/* DNS / Landing */}
          <Card style={{ marginTop: 12 }}>
            <RowTitle icon={I.globe} title="Landing page (optional)" />
            <Field label="Redirect URL">
              <TextInput
                placeholder="https://your-site.com/welcome"
                placeholderTextColor="#9FB1CC"
                style={s.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Field>
            <Text style={s.hint}>
              If set, users are redirected after successful connection.
            </Text>
          </Card>

          <View style={{ height: 16 }} />
          <TouchableOpacity onPress={save} activeOpacity={0.9} style={s.cta}>
            <Text style={s.ctaTxt}>Save configuration</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Pickers */}
      <PickerModal
        visible={showBand}
        title="Select band"
        data={bandOpts}
        onClose={() => setShowBand(false)}
        onSelect={(v) => {
          setBand(v as any);
          setShowBand(false);
        }}
      />
      <PickerModal
        visible={showSec}
        title="Select security"
        data={secOpts}
        onClose={() => setShowSec(false)}
        onSelect={(v) => {
          setSecurity(v as any);
          setShowSec(false);
        }}
      />
    </SafeAreaView>
  );
}

/* atoms */

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[s.card, style]}>{children}</View>
  );
}

function RowTitle({ icon, title }: { icon: any; title: string }) {
  return (
    <View style={s.rowTitle}>
      <View style={s.pillIcon}>
        <Image source={icon} style={s.icon} />
      </View>
      <Text style={s.rowTitleTxt}>{title}</Text>
    </View>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[{ marginTop: 12 }, style]}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

function Select({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={s.select}>
      <Text style={s.selectTxt}>{value}</Text>
      <Image source={I.chevDown} style={s.chevDown} />
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
  hint,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <View>
      <View style={s.toggleRow}>
        <Text style={s.toggleLbl}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  );
}

function Separator() {
  return <View style={{ height: 12 }} />;
}

function PickerModal({
  visible,
  title,
  data,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  data: string[];
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalBackdrop}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(x) => x}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)} style={s.modalItem}>
                <Text style={s.modalItemTxt}>{item}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
          <TouchableOpacity onPress={onClose} style={s.modalCancel}>
            <Text style={s.modalCancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* styles */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  back: { width: 24, height: 24, tintColor: TEXT },
  title: { flex: 1, textAlign: "center", color: TEXT, fontSize: 18, fontWeight: "700" },
  saveTxt: { color: BLUE, fontWeight: "700" },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
  },

  rowTitle: { flexDirection: "row", alignItems: "center" },
  pillIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: SOFT,
    borderWidth: 1,
    borderColor: "#DCEAFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  icon: { width: 16, height: 16, tintColor: "#7283A3" },
  iconSmall: { width: 14, height: 14, tintColor: "#7283A3" },
  rowTitleTxt: { color: TEXT, fontWeight: "800" },

  label: { color: MUTED, fontWeight: "700", marginBottom: 6 },

  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    color: TEXT,
  },
  inputWithIcon: {
    height: 48,
    borderRadius: 12,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  select: {
    height: 48,
    borderRadius: 12,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectTxt: { color: TEXT, fontWeight: "700" },
  chevDown: { width: 14, objectFit:'contain', tintColor: "#8AA0BE" },

  toggleRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLbl: { color: TEXT, fontWeight: "700", flex: 1, paddingRight: 12 },
  hint: { color: "#7C8AA6", marginTop: 6 },

  inlineLink: {
    marginTop: 8,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  inlineLinkTxt: { color: BLUE, fontWeight: "700", marginRight: 6 },
  chevR: { width: 14, height: 14, tintColor: BLUE },

  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTxt: { color: "#FFFFFF", fontWeight: "700" },

  /* modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
  },
  modalTitle: { color: TEXT, fontWeight: "800", fontSize: 16, marginBottom: 12 },
  modalItem: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemTxt: { color: TEXT, fontWeight: "700" },
  modalCancel: { alignSelf: "center", paddingVertical: 14 },
  modalCancelTxt: { color: MUTED, fontWeight: "700" },
});
