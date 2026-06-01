// screens/PostScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createPost } from "../../api/api"; // Adjust the import path as needed

export default function PostScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to upload.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      selectionLimit: 10,
      quality: 0.9,
    });
    if (res.canceled) return;
    const uris = res.assets?.map((a) => a.uri) ?? [];
    setImages((prev) => [...prev, ...uris].slice(0, 12));
  };

  const removeAt = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const swap = (i: number, j: number) =>
    setImages((prev) => {
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const saveDraft = () => Alert.alert("Saved", "Draft saved locally.");

  const postNow = async () => {
    if (!images.length) {
      Alert.alert("Missing media", "Add at least one file.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare media files for API
      const mediaFiles = images.map((uri, index) => ({
        uri,
        type: 'image/jpeg',
        fileName: `post-image-${Date.now()}-${index}.jpg`,
      }));

      // Prepare post data for API
      const postData = {
        body: caption || "Business post", // Use caption or default text
        postType: "normal",
        reviewTarget: null,
        media: mediaFiles,
      };

      // Call the API
      const result = await createPost(postData);
      
      Alert.alert("Success", "Your post has been created successfully!");
      setImages([]);
      setCaption("");
      
    } catch (error: any) {
      console.error("Post creation error:", error);
      Alert.alert(
        "Post Failed", 
        error.message || "Failed to create post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----- render ----- */

  const EmptyUpload = () => (
    <TouchableOpacity 
      style={[styles.addBox, styles.addBoxFull]} 
      onPress={pickImages} 
      activeOpacity={0.9}
      disabled={isSubmitting}
    >
      <Text style={styles.plus}>＋</Text>
      <Text style={styles.addHelp}>
        Upload photos and videos{"\n"}Video limit: 30 secs per video
      </Text>
    </TouchableOpacity>
  );

  const Thumb = ({ uri, index }: { uri: string; index: number }) => (
    <View style={styles.thumbWrap}>
      <Image source={{ uri }} style={styles.thumb} />
      <TouchableOpacity 
        style={styles.thumbClose} 
        onPress={() => removeAt(index)}
        disabled={isSubmitting}
      >
        <Text style={styles.thumbCloseTxt}>×</Text>
      </TouchableOpacity>

      {/* reorder helpers */}
      <View style={styles.reorder}>
        <TouchableOpacity 
          onPress={() => swap(index, index - 1)}
          disabled={isSubmitting}
        >
          <Text style={styles.reorderBtn}>◀︎</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => swap(index, index + 1)}
          disabled={isSubmitting}
        >
          <Text style={styles.reorderBtn}>▶︎</Text>
        </TouchableOpacity>
      </View>

      {/* one-time hint overlay on the second slot */}
      {index === 1 && (
        <View style={styles.hintOverlay}>
          <Text style={styles.hintText}>Drag left/right to sort</Text>
        </View>
      )}
    </View>
  );

  const UploadRow = () => (
    <View>
      <FlatList
        data={["__add__", ...images]}
        keyExtractor={(item, i) => item + i}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item, index }) =>
          item === "__add__" ? (
            <TouchableOpacity 
              style={styles.addBox} 
              onPress={pickImages} 
              activeOpacity={0.9}
              disabled={isSubmitting}
            >
              <Text style={styles.plus}>＋</Text>
            </TouchableOpacity>
          ) : (
            <Thumb uri={item} index={index - 1} />
          )
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.h1}>Create a Post</Text>

          <Text style={styles.label}>Upload Image</Text>
          {images.length === 0 ? <EmptyUpload /> : <UploadRow />}

          <TouchableOpacity 
            onPress={() => Alert.alert("Guidelines", "Keep it respectful and relevant.")}
            disabled={isSubmitting}
          >
            <Text style={styles.guidelines}>See image/video guidelines</Text>
          </TouchableOpacity>

          <Text style={[styles.label, { marginTop: 16 }]}>
            Share some details about your post <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Add a caption"
            placeholderTextColor="#9BA8BD"
            value={caption}
            onChangeText={setCaption}
            editable={!isSubmitting}
          />

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.draftBtn} 
              onPress={saveDraft}
              disabled={isSubmitting}
            >
              <Text style={styles.draftTxt}>Save draft</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.postBtn, isSubmitting && styles.postBtnDisabled]} 
              onPress={postNow}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.postTxt}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40 },

  h1: { fontSize: 28, color: "#0A1220", fontFamily: "RCB-Bold", marginBottom: 10 },

  label: { color: "#2B3A55", fontSize: 14, fontFamily: "RCB-SemiBold", marginBottom: 8 },
  optional: { color: "#9BA8BD", fontFamily: "RCB-Regular", fontSize: 12 },

  /* upload */
  addBox: {
    width: 132,
    height: 132,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C9D7EE",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F7FD",
  },
  addBoxFull: { width: "100%", height: 180 },
  plus: { fontSize: 24, color: "#1F66FF", marginBottom: 6 },
  addHelp: { color: "#7A8AA7", fontSize: 12, textAlign: "center", lineHeight: 16, maxWidth: 260 },

  guidelines: { marginTop: 6, color: "#E54B4B", fontSize: 12, fontFamily: "RCB-SemiBold" },

  thumbWrap: { width: 132, height: 132, borderRadius: 12, overflow: "hidden" },
  thumb: { width: "100%", height: "100%" },
  thumbClose: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#00000080",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbCloseTxt: { color: "#fff", fontSize: 18, lineHeight: 18 },

  reorder: {
    position: "absolute",
    left: 6,
    bottom: 6,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#00000055",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reorderBtn: { color: "#fff", fontSize: 14 },

  hintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: { color: "#fff", fontFamily: "RCB-SemiBold" },

  /* text area */
  textArea: {
    backgroundColor: "#EEF3F9",
    borderRadius: 14,
    minHeight: 120,
    padding: 12,
    color: "#0A1220",
    fontFamily: "RCB-Regular",
    borderWidth: 1,
    borderColor: "#E5EDF7",
  },

  /* actions */
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 22, marginBottom: 28 },
  draftBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF3F9",
    borderWidth: 1,
    borderColor: "#E5EDF7",
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  draftTxt: { color: "#0A1220", fontFamily: "RCB-SemiBold", fontSize: 16 },
  postBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A59FF",
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  postBtnDisabled: {
    backgroundColor: "#9BA8BD",
  },
  postTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },
});