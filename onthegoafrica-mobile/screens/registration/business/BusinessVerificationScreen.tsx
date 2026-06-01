// screens/business/BusinessVerificationScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { uploadDocument, getProfileId } from "../../../api/api";

type PickedDoc = {
  name: string;
  sizeKB: number;
  mime: string;
  uri: string;
  type: string;
};

export default function BusinessVerificationScreen() {
  const navigation = useNavigation<any>();


  const [doc, setDoc] = React.useState<PickedDoc | null>(null);
  const [progress, setProgress] = React.useState(0); // 0..100
  const [uploading, setUploading] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);


  // Supported document types
  const supportedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const getFileTypeLabel = (mimeType: string): string => {
    switch (mimeType) {
      case "application/pdf":
        return "PDF";
      case "image/jpeg":
      case "image/jpg":
        return "JPG";
      case "image/png":
        return "PNG";
      case "application/msword":
        return "DOC";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "DOCX";
      default:
        return "FILE";
    }
  };

  const getFileTypeColor = (mimeType: string): string => {
    switch (mimeType) {
      case "application/pdf":
        return "#D32F2F";
      case "image/jpeg":
      case "image/jpg":
      case "image/png":
        return "#1976D2";
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "#1565C0";
      default:
        return "#666666";
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: supportedTypes,
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Validate file size (max 10MB)
      const maxSizeBytes = 10 * 1024 * 1024; // 10MB
      if (file.size && file.size > maxSizeBytes) {
        Alert.alert(
          "File Too Large", 
          "Please select a file smaller than 10MB.",
          [{ text: "OK" }]
        );
        return;
      }

      // Get file info
      let fileInfo;
      try {
        fileInfo = await FileSystem.getInfoAsync(file.uri);
      } catch (error) {
        console.warn("Could not get file info:", error);
      }

      const pickedDoc: PickedDoc = {
        name: file.name,
        sizeKB: Math.max(1, Math.round((file.size || 0) / 1024)),
        mime: file.mimeType || "application/octet-stream",
        uri: file.uri,
        type: getFileTypeLabel(file.mimeType || ""),
      };

      setDoc(pickedDoc);
      setProgress(0);
      simulateUpload();

    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert(
        "Error", 
        "Failed to select document. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 15 + 5); // More realistic progress
      setProgress(Math.round(p));
      if (p >= 100) {
        clearInterval(id);
        setUploading(false);
        setProgress(100);
      }
    }, 300);
  };

  const removeDocument = () => {
    Alert.alert(
      "Remove Document",
      "Are you sure you want to remove this document?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setDoc(null);
            setProgress(0);
            setUploading(false);
          }
        }
      ]
    );
  };

  const canSubmit = !!doc && progress >= 100;

 const submit = async () => {
    if (!canSubmit) return;
    
    try {
      // Get the profile ID from AsyncStorage
      const profileId = await getProfileId();
      
      if (!profileId) {
        Alert.alert("Error", "Profile ID not found. Please create a profile first.");
        return;
      }

      if (!doc) {
        Alert.alert("Error", "No document selected.");
        return;
      }

      // Prepare document data for upload
      const documentData = {
        profileId: profileId.toString(),
        document: {
          uri: doc.uri,
          type: doc.mime,
          fileName: doc.name,
        },
        documentType: "cac", // You can make this dynamic if needed
      };

      // Call the upload document API
      const response = await uploadDocument(documentData);
      
      // Show success message and receipt
      setShowReceipt(true);
      
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "Failed to upload document. Please try again.");
    }
  };

  const closeReceipt = () => setShowReceipt(false);

  const finishReceipt = () => {
    setShowReceipt(false);
    // mark this step as done and go back to hub
    navigation.navigate("CreateBusinessProfile", { markDone: "businessVerification" });
  };


  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={HS}>
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Business Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.body}>
        <Text style={s.label}>Upload Business Document</Text>
        <Text style={s.helper}>
          Upload CAC certificate, business registration, or other business documents
        </Text>
        <Text style={s.supportedFormats}>
          Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
        </Text>

        {!doc ? (
          <TouchableOpacity style={s.drop} activeOpacity={0.8} onPress={pickDocument}>
            <Text style={s.plus}>＋</Text>
            <Text style={s.dropTitle}>Select Document</Text>
            <Text style={s.dropHint}>Tap to browse your files</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.fileRow}>
            <View style={[s.fileBadge, { backgroundColor: `${getFileTypeColor(doc.mime)}20` }]}>
              <Text style={[s.fileBadgeTxt, { color: getFileTypeColor(doc.mime) }]}>
                {doc.type}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.fileName} numberOfLines={1}>
                {doc.name.replace(/\.(pdf|jpg|jpeg|png|doc|docx)$/i, "")}
              </Text>
              <Text style={s.fileSub}>
                {doc.sizeKB}KB {uploading ? `- ${progress}% uploaded` : "- Ready"}
              </Text>
            </View>
            {uploading ? (
              <View style={s.progressWrap}>
                <ActivityIndicator size="small" color={BLUE} />
                <Text style={s.progressText}>{progress}%</Text>
              </View>
            ) : progress >= 100 ? (
              <View style={s.actionButtons}>
                <TouchableOpacity style={s.doneBadge} onPress={removeDocument} hitSlop={HS}>
                  <Text style={s.doneTick}>✓</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={s.removeBtn} onPress={removeDocument} hitSlop={HS}>
                <Text style={s.removeTxt}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {doc && (
          <TouchableOpacity style={s.changeDocBtn} onPress={pickDocument} activeOpacity={0.8}>
            <Text style={s.changeDocTxt}>Change Document</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={submit}
          activeOpacity={0.9}
        >
          <Text style={[s.submitTxt, !canSubmit && s.submitTxtDisabled]}>
            Submit Document
          </Text>
        </TouchableOpacity>
      </View>

      <ReceiptModal
        visible={showReceipt}
        onClose={closeReceipt}
        onContinue={finishReceipt}
      />
    </SafeAreaView>
  );
}

/* ---------- Receipt Modal ---------- */
function ReceiptModal({
  visible,
  onClose,
  onContinue,
}: {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalSheet}>
          <TouchableOpacity onPress={onClose} style={s.modalClose} hitSlop={HS}>
            <Text style={s.modalCloseTxt}>×</Text>
          </TouchableOpacity>

          {/* Concentric rings success indicator */}
          <View style={s.ring3}>
            <View style={s.ring2}>
              <View style={s.ring1}>
                <View style={s.core}>
                  <Text style={s.tick}>✓</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={s.modalTitle}>Document Submitted Successfully</Text>
          <Text style={s.modalSub}>
            Your business document has been received and is now being validated. 
            This process typically takes 10–15 minutes. We'll notify you once verification is complete.
          </Text>

          <TouchableOpacity style={s.modalBtn} onPress={onContinue} activeOpacity={0.9}>
            <Text style={s.modalBtnTxt}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- styles ---------- */
const HS = { top: 8, bottom: 8, left: 8, right: 8 };

const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E6ECF5";
const BG_SOFT = "#F3F6FA";
const BLUE = "#0145FE";
const BLUE_SOFT = "#DDE6FF";
const GREEN = "#16A34A";
const WHITE = "#FFFFFF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  header: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backArrow: { fontSize: 26, color: TEXT, marginTop: Platform.OS === "ios" ? -2 : 0 },
  headerTitle: { color: TEXT, fontSize: 16, fontFamily: "RCB-SemiBold" },

  body: { padding: 16, flex: 1 },
  label: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },
  helper: { 
    color: MUTED, 
    marginTop: 4, 
    marginBottom: 4, 
    fontFamily: "RCB-Regular",
    lineHeight: 20 
  },
  supportedFormats: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "RCB-Regular",
    marginBottom: 16,
  },

  drop: {
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#C9D4E6",
    backgroundColor: BG_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  plus: { fontSize: 32, color: "#6D7D96", marginBottom: 8 },
  dropTitle: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16, marginBottom: 4 },
  dropHint: { color: MUTED, fontSize: 14, fontFamily: "RCB-Regular" },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F6FE",
    borderWidth: 1,
    borderColor: BLUE_SOFT,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  fileBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileBadgeTxt: { fontFamily: "RCB-SemiBold", fontSize: 12 },
  fileName: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 15 },
  fileSub: { color: MUTED, fontSize: 13, marginTop: 2, fontFamily: "RCB-Regular" },
  
  progressWrap: { 
    alignItems: "center", 
    justifyContent: "center",
    minWidth: 40,
  },
  progressText: {
    color: BLUE,
    fontSize: 11,
    fontFamily: "RCB-SemiBold",
    marginTop: 2,
  },

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  doneBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E7F6EC",
    alignItems: "center",
    justifyContent: "center",
  },
  doneTick: { color: GREEN, fontSize: 18, fontWeight: "700" },

  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFE5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  removeTxt: { color: "#D32F2F", fontSize: 18, fontWeight: "600" },

  changeDocBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: BLUE_SOFT,
  },
  changeDocTxt: {
    color: BLUE,
    fontFamily: "RCB-SemiBold",
    fontSize: 14,
  },

  footer: { padding: 16 },
  submitBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: { backgroundColor: "#BFD0FF" },
  submitTxt: { color: WHITE, fontFamily: "RCB-SemiBold", fontSize: 16 },
  submitTxtDisabled: { color: "#8FA4D3" },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseTxt: { fontSize: 22, lineHeight: 22, color: "#657A9A" },

  // Concentric green rings
  ring3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16,185,129,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  ring2: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(16,185,129,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  ring1: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(16,185,129,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    color: WHITE,
    fontSize: 22,
    lineHeight: Platform.OS === "ios" ? 22 : 24,
    fontWeight: "800",
  },

  modalTitle: {
    textAlign: "center",
    color: TEXT,
    fontFamily: "RCB-SemiBold",
    fontSize: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  modalSub: {
    textAlign: "center",
    color: MUTED,
    fontFamily: "RCB-Regular",
    lineHeight: 22,
    marginHorizontal: 8,
    marginBottom: 18,
  },
  modalBtn: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnTxt: { color: WHITE, fontFamily: "RCB-SemiBold", fontSize: 16 },
});