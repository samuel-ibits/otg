import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchBusinessProfiles, createReviewPost } from "../../api/api"; // Adjust import path as needed

type AmenityKey = "wifi" | "coffee" | "ambience" | "cowork";

type FormState = {
  locationName: string;
  locationAddress: string;
  details: string;
  overallRating: number; // 0..5
  reviewText: string;
  images: string[]; // uri list
  amenities: Record<AmenityKey, number>;
  selectedBusinessId?: string;
  selectedBusinessAmenities?: BusinessAmenity[];
};

type BusinessAmenity = {
  id: number;
  businessId: number;
  name: string;
  rating: number;
  meta: any;
  createdAt: string;
  updatedAt: string;
};

type BusinessProfile = {
  id: number;
  userId: number;
  profileType: string;
  businessType: string;
  userName: string;
  picture: string | null;
  bio: string;
  interests: string[];
  profession: string | null;
  skills: string[];
  gender: string | null;
  isStudent: boolean;
  university: string | null;
  address: string;
  geoLocation: [number, number];
  socialLinks: Record<string, string>;
  followers: number;
  following: number;
  rating: number;
  placesVisited: string[];
  createdAt: string;
  updatedAt: string;
  amenities: BusinessAmenity[];
};

const INITIAL: FormState = {
  locationName: "",
  locationAddress: "",
  details: "",
  overallRating: 0,
  reviewText: "",
  images: [],
  amenities: {
    wifi: 0,
    coffee: 0,
    ambience: 0,
    cowork: 0,
  },
};

// Map business amenities to our amenity keys
const amenityMapping: Record<string, AmenityKey> = {
  "wifi": "wifi",
  "wi-fi": "wifi",
  "wireless": "wifi",
  "coffee": "coffee",
  "cafe": "coffee",
  "ambience": "ambience",
  "atmosphere": "ambience",
  "vibe": "ambience",
  "cowork": "cowork",
  "coworking": "cowork",
  "workspace": "cowork",
  "working space": "cowork"
};

export default function CreatePostScreen() {
  const [form, setForm] = useState<FormState>({ ...INITIAL });
  const [showNamePicker, setShowNamePicker] = useState(false);
  const [businessSuggestions, setBusinessSuggestions] = useState<BusinessProfile[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Search businesses when location name changes
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (form.locationName.trim().length > 2) {
      const timeout = setTimeout(() => {
        searchBusinesses(form.locationName);
      }, 500); // Debounce search by 500ms

      setSearchTimeout(timeout);
    } else {
      setBusinessSuggestions([]);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [form.locationName]);

  const searchBusinesses = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setBusinessSuggestions([]);
      return;
    }

    setLoadingBusinesses(true);
    try {
      const result = await fetchBusinessProfiles({
        search: searchTerm,
        type: "business",
        offset: 0,
        limit: 10
      });
      
      setBusinessSuggestions(result.profiles || []);
    } catch (error) {
      console.error("Error searching businesses:", error);
      // Don't show error to user for search, just clear suggestions
      setBusinessSuggestions([]);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleBusinessSelect = (business: BusinessProfile) => {
    // Map business amenities to our amenity structure
    const mappedAmenities: Record<AmenityKey, number> = { ...INITIAL.amenities };
    
    if (business.amenities && business.amenities.length > 0) {
      business.amenities.forEach(amenity => {
        const normalizedAmenity = amenity.name.toLowerCase().trim();
        const amenityKey = amenityMapping[normalizedAmenity];
        if (amenityKey) {
          mappedAmenities[amenityKey] = 0; // Initialize with 0 rating
        }
      });
    }

    setForm({
      ...form,
      locationName: business.userName,
      locationAddress: business.address,
      selectedBusinessId: business.id.toString(),
      selectedBusinessAmenities: business.amenities,
      amenities: mappedAmenities
    });
    setShowNamePicker(false);
    setBusinessSuggestions([]);
  };

  // const pickImages = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert("Permission needed", "Allow photo library access to upload.");
  //     return;
  //   }
  //   const res = await ImagePicker.launchImageLibraryAsync({
  //     allowsMultipleSelection: true,
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     selectionLimit: 10,
  //     quality: 0.9,
  //     videoMaxDuration: 30,
  //   });
  //   if (res.canceled) return;
  //   const uris = res.assets?.map((a) => a.uri) ?? [];
  //   setForm((f) => ({ ...f, images: [...f.images, ...uris].slice(0, 12) }));
  // };
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("status:");
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to upload.");
      return;
    }
  
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
  
    console.log("Picker result:", res);
  
    if (!res.canceled) {
      const uri = res.uri || res.assets?.[0]?.uri;
      if (uri) {
        setForm((f) => ({ ...f, images: [...f.images, uri] }));
      }
    }
  };
  
  const removeImage = (index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const next = [...f.images];
      const j = index + dir;
      if (j < 0 || j >= next.length) return f;
      const tmp = next[index];
      next[index] = next[j];
      next[j] = tmp;
      return { ...f, images: next };
    });
  };

  const saveDraft = () => {
    Alert.alert("Saved", "Draft saved locally.");
  };

const submit = async () => {
  if (!form.locationName.trim()) {
    Alert.alert("Missing info", "Enter a location name.");
    return;
  }
  
  if (!form.selectedBusinessId) {
    Alert.alert("Missing business", "Please select a business from the suggestions.");
    return;
  }

  if (!form.images.length) {
    Alert.alert("Missing media", "Add at least one photo.");
    return;
  }

  try {
    const mediaFiles = form.images.map((uri, index) => {
      const type = guessMimeType(uri);
      const fileName = buildFilenameFromUri(uri, index);
      return { uri, type, fileName };
    });

    // strip amenities that were not rated
    const filteredAmenities = Object.fromEntries(
      Object.entries(form.amenities).filter(([, v]) => typeof v === "number" && v > 0)
    );

    // build payload without amenities when none were rated
    const reviewData: any = {
      body: form.reviewText || form.details || `Review for ${form.locationName}`,
      reviewTarget: form.selectedBusinessId,
      media: mediaFiles,
      postType: 'review',
      rating: form.overallRating,
      ratingDescription: form.reviewText || form.details || '',
    };
    if (Object.keys(filteredAmenities).length > 0) {
      reviewData.amenities = filteredAmenities;
    }

    const result = await createReviewPost(reviewData);

    Alert.alert("Posted", "Your review has been created successfully!");
    setForm({ ...INITIAL });
  } catch (error: any) {
    console.error("Error creating post:", error);
    Alert.alert("Post Failed", error.message || "Failed to create post. Please try again.");
  }
};


  const isEmpty = form.images.length === 0;

  function guessMimeType(uri: string): string {
    const lower = uri.split('?')[0].toLowerCase();
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.gif')) return 'image/gif';
    if (lower.endsWith('.mov')) return 'video/quicktime';
    if (lower.endsWith('.mp4')) return 'video/mp4';
    if (lower.endsWith('.m4v')) return 'video/x-m4v';
    return 'application/octet-stream';
  }

  function buildFilenameFromUri(uri: string, index: number): string {
    const base = uri.split('/').pop() || `media-${index}`;
    const hasExt = base.includes('.');
    if (hasExt) return base;
    const mime = guessMimeType(uri);
    const ext = mime.startsWith('image/') ? 'jpg' : (mime.startsWith('video/') ? 'mp4' : 'bin');
    return `${base}-${Date.now()}.${ext}`;
  }

  // Get available amenities from selected business
  const availableAmenities = useMemo(() => {
    const amenities: AmenityKey[] = [];
    
    if (form.selectedBusinessAmenities && form.selectedBusinessAmenities.length > 0) {
      form.selectedBusinessAmenities.forEach(amenity => {
        const normalizedAmenity = amenity.name.toLowerCase().trim();
        const amenityKey = amenityMapping[normalizedAmenity];
        if (amenityKey && !amenities.includes(amenityKey)) {
          amenities.push(amenityKey);
        }
      });
    }
    
    return amenities;
  }, [form.selectedBusinessAmenities]);

  const renderBusinessSuggestion = ({ item }: { item: BusinessProfile }) => {
    // Extract amenity names from the amenities array
    const amenityNames = item.amenities && item.amenities.length > 0 
      ? item.amenities.map(a => a.name).join(", ")
      : null;

    return (
      <TouchableOpacity
        style={s.suggestionRow}
        onPress={() => handleBusinessSelect(item)}
      >
        <View style={s.businessInfo}>
          <Text style={s.businessName}>{item.userName}</Text>
          <Text style={s.businessAddress} numberOfLines={1}>
            {item.address}
          </Text>
          <Text style={s.businessType}>{item.businessType}</Text>
          {amenityNames && (
            <View style={s.amenityChipsContainer}>
              {item.amenities.map((amenity, index) => (
                <View key={amenity.id} style={s.amenityChip}>
                  <Text style={s.amenityChipText}>{amenity.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.h1}>Create a Post</Text>

          {/* Location Name */}
          <SectionLabel>Location name</SectionLabel>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowNamePicker(true)}
          >
            <TextInput
              style={s.input}
              placeholder="Search for a business..."
              placeholderTextColor="#9BA8BD"
              value={form.locationName}
              onChangeText={(t) => {
                setForm((f) => ({ ...f, locationName: t }));
                setShowNamePicker(true);
              }}
              onFocus={() => setShowNamePicker(true)}
            />
          </TouchableOpacity>

          {showNamePicker && (
            <View style={s.namePicker}>
              <TouchableOpacity
                style={s.currentLocRow}
                onPress={() => {
                  setForm((f) => ({ ...f, locationName: "Current location" }));
                  setShowNamePicker(false);
                }}
              >
                <Image
                  source={require("../../assets/icons/location-pin.png")}
                  style={[s.locIcon, { tintColor: "#1F66FF" }]}
                />
                <Text style={s.currentLocText}>Use current location</Text>
              </TouchableOpacity>

              {loadingBusinesses && (
                <View style={s.loadingContainer}>
                  <ActivityIndicator size="small" color="#1F66FF" />
                  <Text style={s.loadingText}>Searching businesses...</Text>
                </View>
              )}

              {!loadingBusinesses && businessSuggestions.length > 0 && (
                <FlatList
                  data={businessSuggestions}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => <View style={s.sep} />}
                  renderItem={renderBusinessSuggestion}
                  style={s.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              )}

              {!loadingBusinesses && form.locationName.length > 2 && businessSuggestions.length === 0 && (
                <View style={s.noResults}>
                  <Text style={s.noResultsText}>No businesses found</Text>
                </View>
              )}
            </View>
          )}

          {/* Address - Auto-populated when business is selected */}
          <SectionLabel style={{ marginTop: 16 }}>Location address</SectionLabel>
          <TextInput
            style={s.input}
            placeholder="Street, area"
            placeholderTextColor="#9BA8BD"
            value={form.locationAddress}
            onChangeText={(t) =>
              setForm((f) => ({ ...f, locationAddress: t }))
            }
            editable={!form.selectedBusinessId} // Make editable only if no business selected
          />

          {/* Upload */}
          <SectionLabel style={{ marginTop: 16 }}>Upload Media</SectionLabel>
          <View style={[s.uploadRow, isEmpty && s.uploadRowEmpty]}>
            <TouchableOpacity
              style={[s.addBox, isEmpty && s.addBoxFull]}
              onPress={pickImages}
            >
              <Text style={s.plus}>＋</Text>
              <Text style={[s.addHelp, isEmpty && { maxWidth: 260 }]}>
                Upload photos and videos{"\n"}Video limit: 30 secs per video
              </Text>
            </TouchableOpacity>

            {!isEmpty &&
              form.images.map((uri, idx) => (
                <View key={uri + idx} style={s.thumbWrap}>
                  {/* For simplicity, show images; videos will not preview here */}
                  <Image source={{ uri }} style={s.thumb} />
                  <TouchableOpacity
                    style={s.thumbClose}
                    onPress={() => removeImage(idx)}
                  >
                    <Text style={s.thumbCloseTxt}>×</Text>
                  </TouchableOpacity>
                  <View style={s.reorder}>
                    <TouchableOpacity onPress={() => moveImage(idx, -1)}>
                      <Text style={s.reorderBtn}>◀︎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => moveImage(idx, +1)}>
                      <Text style={s.reorderBtn}>▶︎</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Guidelines", "Keep it respectful and relevant.")
            }
          >
            <Text style={s.guidelines}>See image/video guidelines</Text>
          </TouchableOpacity>

          {/* Details */}
          <SectionLabel style={{ marginTop: 18 }}>
            Share some details about your post <Text style={s.optional}>(optional)</Text>
          </SectionLabel>
          <TextInput
            style={s.textArea}
            multiline
            placeholder="Add a caption"
            placeholderTextColor="#9BA8BD"
            value={form.details}
            onChangeText={(t) => setForm((f) => ({ ...f, details: t }))}
          />

          {/* Review */}
          <SectionLabel style={{ marginTop: 12 }}>Review</SectionLabel>
          <Text style={s.subtle}>Overall rating</Text>
          <StarRating
            value={form.overallRating}
            onChange={(v) => setForm((f) => ({ ...f, overallRating: v }))}
            size={22}
          />
          <TextInput
            style={[s.textArea, { marginTop: 10 }]}
            multiline
            placeholder="How was your experience?"
            placeholderTextColor="#9BA8BD"
            value={form.reviewText}
            onChangeText={(t) => setForm((f) => ({ ...f, reviewText: t }))}
          />

          {/* Amenities */}
          <View style={{ marginTop: 8 }}>
            <SectionLabel>
              Amenities <Text style={s.optional}>(Rate the amenities available at this location)</Text>
            </SectionLabel>

            {availableAmenities.length > 0 ? (
              availableAmenities.map((amenityKey) => {
                const amenityLabels: Record<AmenityKey, string> = {
                  wifi: "Wifi",
                  coffee: "Coffee",
                  ambience: "Ambience",
                  cowork: "Co-working space"
                };

                return (
                  <AmenityRow
                    key={amenityKey}
                    label={amenityLabels[amenityKey]}
                    icon={amenityKey}
                    value={form.amenities[amenityKey]}
                    onChange={(v) =>
                      setForm((f) => ({ 
                        ...f, 
                        amenities: { ...f.amenities, [amenityKey]: v } 
                      }))
                    }
                  />
                );
              })
            ) : (
              <Text style={s.noAmenitiesText}>
                {form.selectedBusinessId 
                  ? "No specific amenities listed for this business"
                  : "Select a business to rate amenities"}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.draftBtn} onPress={saveDraft}>
              <Text style={s.draftTxt}>Save draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.postBtn} onPress={submit}>
              <Text style={s.postTxt}>Post</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- UI bits ---------- */

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return <Text style={[s.label, style]}>{children}</Text>;
}

function StarRating({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={s.starRow}>
      {stars.map((i) => (
        <TouchableOpacity key={i} onPress={() => onChange(i)}>
          <Image
            source={require("../../assets/feed/star.png")}
            style={{
              width: size,
              height: size,
              marginHorizontal: 3,
              tintColor: i <= value ? "#FFC107" : "#D9E2EF",
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AmenityRow({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: AmenityKey;
  value: number;
  onChange: (v: number) => void;
}) {
  const iconMap: Record<AmenityKey, any> = {
    wifi: require("../../assets/feed/like.png"),
    coffee: require("../../assets/feed/coffee.png"),
    ambience: require("../../assets/feed/ambience.png"),
    cowork: require("../../assets/feed/cowork.png"),
  };

  return (
    <View style={s.amenityRow}>
      <View style={s.amenityLeft}>
        <Image source={iconMap[icon]} style={s.amenityIcon} />
        <Text style={s.amenityText}>{label}</Text>
      </View>
      <StarRating value={value} onChange={onChange} />
    </View>
  );
}

/* ---------- styles ---------- */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40 },

  h1: {
    fontSize: 28,
    color: "#0A1220",
    fontFamily: "RCB-Bold",
    marginBottom: 10,
  },

  label: {
    color: "#2B3A55",
    fontSize: 14,
    fontFamily: "RCB-SemiBold",
    marginBottom: 8,
  },
  optional: { color: "#9BA8BD", fontFamily: "RCB-Regular", fontSize: 12 },

  input: {
    backgroundColor: "#EEF3F9",
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    color: "#0A1220",
    fontFamily: "RCB-Regular",
    borderWidth: 1,
    borderColor: "#E5EDF7",
  },

  namePicker: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8F0FB",
    paddingTop: 10,
    maxHeight: 300,
  },
  currentLocRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locIcon: { width: 18, height: 18, objectFit: 'contain', marginRight: 8 },
  currentLocText: { color: "#0A1220", fontFamily: "RCB-SemiBold" },
  sep: { height: 1, backgroundColor: "#EEF3F9", marginVertical: 8 },
  suggestionRow: { 
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: { 
    color: "#0A1220", 
    fontFamily: "RCB-SemiBold", 
    fontSize: 15,
    marginBottom: 2,
  },
  businessAddress: {
    color: "#7A8AA7",
    fontFamily: "RCB-Regular",
    fontSize: 13,
    marginBottom: 2,
  },
  businessType: {
    color: "#1F66FF",
    fontFamily: "RCB-Regular",
    fontSize: 12,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  amenityChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  amenityChip: {
    backgroundColor: '#E8F3FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#C9E0F9',
  },
  amenityChipText: {
    color: '#1F66FF',
    fontFamily: 'RCB-Medium',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  loadingText: {
    color: "#7A8AA7",
    fontFamily: "RCB-Regular",
    fontSize: 14,
    marginLeft: 8,
  },
  noResults: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  noResultsText: {
    color: "#7A8AA7",
    fontFamily: "RCB-Regular",
    fontSize: 14,
  },
  noAmenitiesText: {
    color: "#7A8AA7",
    fontFamily: "RCB-Regular",
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },

  uploadRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  uploadRowEmpty: {
    flexWrap: "nowrap",
  },
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
  addBoxFull: {
    width: "100%",
    height: 180,
  },
  plus: { fontSize: 24, color: "#1F66FF", marginBottom: 6 },
  addHelp: {
    color: "#7A8AA7",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  guidelines: {
    marginTop: 6,
    color: "#E54B4B",
    fontSize: 12,
    fontFamily: "RCB-SemiBold",
  },

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

  textArea: {
    backgroundColor: "#EEF3F9",
    borderRadius: 14,
    minHeight: 90,
    padding: 12,
    color: "#0A1220",
    fontFamily: "RCB-Regular",
    borderWidth: 1,
    borderColor: "#E5EDF7",
  },

  subtle: {
    color: "#0A1220",
    opacity: 0.8,
    fontFamily: "RCB-Regular",
    marginBottom: 6,
  },

  starRow: { flexDirection: "row", alignItems: "center" },

  amenityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF3F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5EDF7",
  },
  amenityLeft: { flexDirection: "row", alignItems: "center" },
  amenityIcon: { width: 16, height: 16, tintColor: "#7A8AA7", marginRight: 10 },
  amenityText: { color: "#0A1220", fontFamily: "RCB-SemiBold", fontSize: 16 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 28,
  },
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
  postTxt: { color: "#fff", fontFamily: "RCB-SemiBold", fontSize: 16 },
});