import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Visibility = "Public" | "Private";

export type EditCommunityPayload = {
  name: string;
  description: string;
  visibility: Visibility;
  adminOnly: boolean;
  cover?: any; // ImageSourcePropType
};

type Props = {
  visible: boolean;
  initial: EditCommunityPayload;
  onClose?: () => void;
  onSave?: (payload: EditCommunityPayload) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
};

export default function EditCommunityModal({ visible, initial, onClose, onSave, onDelete }: Props) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [visibility, setVisibility] = useState<Visibility>(initial.visibility);
  const [adminOnly, setAdminOnly] = useState(initial.adminOnly);

  useEffect(() => {
    if (visible) {
      setName(initial.name);
      setDescription(initial.description);
      setVisibility(initial.visibility);
      setAdminOnly(initial.adminOnly);
    }
  }, [visible, initial]);

  const disabled = !name.trim();

  const save = async () => {
    if (disabled) return;
    await Promise.resolve(
      onSave?.({
        name: name.trim(),
        description: description.trim(),
        visibility,
        adminOnly,
        cover: initial.cover,
      })
    );
    onClose?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={s.overlay}>
          <SafeAreaView edges={["bottom"]} style={s.sheet}>
            <View style={s.drag} />

            <View style={s.header}>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={s.cancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={s.title}>Edit community</Text>
              <TouchableOpacity
                onPress={save}
                disabled={disabled}
                style={[s.saveBtn, disabled && s.disabled]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={s.saveTxt}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
              {/* Cover preview (static for now) */}
              {initial.cover ? (
                <View style={s.coverCircle}>
                  <Image source={initial.cover} style={s.coverImg} />
                </View>
              ) : null}

              {/* Name */}
              <Text style={s.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Community name"
                placeholderTextColor="#9AA8BE"
                style={s.input}
                maxLength={60}
              />

              {/* Description */}
              <Text style={[s.label, { marginTop: 12 }]}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What is this community about?"
                placeholderTextColor="#9AA8BE"
                style={[s.input, s.textarea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={400}
              />

              {/* Visibility */}
              <Text style={[s.label, { marginTop: 12 }]}>Visibility</Text>
              <View style={s.segmentRow}>
                <Segment
                  label="Public"
                  active={visibility === "Public"}
                  onPress={() => setVisibility("Public")}
                />
                <Segment
                  label="Private"
                  active={visibility === "Private"}
                  onPress={() => setVisibility("Private")}
                />
              </View>

              {/* Admin-only toggle */}
              <View style={s.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.toggleTitle}>Only Admin can send messages</Text>
                  <Text style={s.toggleSub}>Members will not be able to send messages</Text>
                </View>
                <Switch
                  value={adminOnly}
                  onValueChange={setAdminOnly}
                  trackColor={{ false: "#D6DEEC", true: "#BFD2FF" }}
                  thumbColor={adminOnly ? "#0A59FF" : "#FFFFFF"}
                />
              </View>

              {/* Delete Community Button */}
             
                <TouchableOpacity 
                  style={s.deleteBtn} 
                  onPress={onDelete}
                  activeOpacity={0.7}
                >
                  <Text style={s.deleteTxt}>Delete Community</Text>
                </TouchableOpacity>
           
            </ScrollView>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[seg.pill, active && seg.active]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[seg.txt, active && seg.txtActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E6ECF5";
const CARD = "#F6FAFF";
const BLUE = "#0A59FF";

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "88%",
  },
  drag: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 3,
    marginTop: 10,
    backgroundColor: "#D8E1F0",
  },
  header: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  cancel: { color: TEXT, fontFamily: "RCB-SemiBold" },
  title: { color: TEXT, fontFamily: "RCB-Bold" },
  saveBtn: {
    backgroundColor: BLUE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveTxt: { color: "#fff", fontFamily: "RCB-Bold" },
  disabled: { opacity: 0.5 },

  content: { padding: 14, paddingBottom: 24 },

  coverCircle: {
    alignSelf: "center",
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: "hidden",
    backgroundColor: "#F1F6FD",
    marginBottom: 10,
  },
  coverImg: { width: "100%", height: "100%" },

  label: { color: TEXT, fontFamily: "RCB-SemiBold", marginBottom: 6 },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    paddingHorizontal: 12,
    color: TEXT,
  },
  textarea: { height: 120, paddingTop: 10 },

  segmentRow: { flexDirection: "row", gap: 10 },
  toggleRow: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleTitle: { color: TEXT, fontFamily: "RCB-SemiBold" },
  toggleSub: { color: MUTED, fontFamily: "RCB-Regular", fontSize: 12, marginTop: 4 },

  deleteBtn: {
    marginTop: 24,
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFD6D6",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  deleteTxt: { color: "#E63946", fontFamily: "RCB-Bold", fontSize: 15 },
});

const seg = StyleSheet.create({
  pill: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  active: { borderColor: BLUE, backgroundColor: "#E8F0FF" },
  txt: { color: TEXT, fontFamily: "RCB-SemiBold" },
  txtActive: { color: BLUE },
});