// screens/home/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeModal from "../../component/WelcomeModal";
import { useCopilot, CopilotStep, walkthroughable } from "react-native-copilot";
import CustomTooltip from "../../component/CustomTooltip";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { fetchBusinessProfiles, fetchProfile, performGlobalSearch, discoverSearch } from "../../api/api";
import * as Location from "expo-location";

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchable = walkthroughable(TouchableOpacity);

const { width, height } = Dimensions.get("window");
const CARD_W = width * 0.86;

type Quick = { id: string; label: string; icon: any; emoji: string };
type Venue = {
  id: string;
  distance: string;
  address: string;
  reviews: number;
  rating: number;
  picture: any;
  userName?: string;
  businessId?: string | number;
};

const quick: Quick[] = [
  {
    id: "otg",
    label: "OTG Partner",
    icon: require("../../assets/home/icon-work.png"),
    emoji: "🏢",
  },
  {
    id: "work",
    label: "Workspaces",
    icon: require("../../assets/home/icon-work.png"),
    emoji: "💼",
  },
  {
    id: "coffee",
    label: "Coffee",
    icon: require("../../assets/home/icon-coffee.png"),
    emoji: "☕",
  },
  {
    id: "food",
    label: "Food & Drinks",
    icon: require("../../assets/home/icon-fun.png"),
    emoji: "🍔",
  },
  {
    id: "gym",
    label: "Gym",
    icon: require("../../assets/home/icon-gym.png"),
    emoji: "🏋️",
  },
  {
    id: "beach",
    label: "Beach",
    icon: require("../../assets/home/icon-fun.png"),
    emoji: "🏖️",
  },
];

type UserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  profilePicture?: string;
};

function HomeScreen({ navigation }: any) {
  const { start } = useCopilot();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  // 🔍 SEARCH STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [venues, setVenues] = useState<any[]>([]);
  const [topRatedVenues, setTopRatedVenues] = useState<any[]>([]);
  const [noWifiFound, setNoWifiFound] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isWifiLoading, setIsWifiLoading] = useState(false);

  // Pagination for Venues
  const [venuesOffset, setVenuesOffset] = useState(0);
  const [hasMoreVenues, setHasMoreVenues] = useState(true);
  const [loadingMoreVenues, setLoadingMoreVenues] = useState(false);
  const VENUES_LIMIT = 10;

  // 📡 FETCH: NEARBY WI-FI (Amenity = wifi)
  const fetchNearbyWifi = async (isLoadMore = false) => {
    try {
      if (isLoadMore && (!hasMoreVenues || loadingMoreVenues)) return;

      if (!isLoadMore) {
        setLoadingMoreVenues(true);
        setIsWifiLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setNoWifiFound(true);
          setLoadingMoreVenues(false);
          setIsWifiLoading(false);
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const currentOffset = isLoadMore ? venuesOffset : 0;

      // Use discoverSearch for "Wi-Fi spots near you"
      const response = await discoverSearch({
        type: "business",
        amenity: "wifi",
        lat: latitude,
        lng: longitude,
        near_me: true,
        // Backend might not support limit/offset on discover yet, but if it does:
        // limit: VENUES_LIMIT,
        // offset: currentOffset,
      });

      const rawData = response?.data || [];

      // Map API response to Venue type with proper field names
      const mappedData = rawData.map((item: any) => ({
        id: item.id,
        userName: item.userName || item.businessName || item.name || "Unknown Business",
        address: item.address || item.location || "No address available",
        rating: item.rating || 0,
        reviews: item.reviews || item.reviewsCount || 0,
        distance: item.distance || "",
        businessId: item.businessId || item.business_id || item.companyId || item.company_id || 0,
        picture: item.picture || item.profilePicture || item.image || require("../../assets/icons/cafe.jpeg"),
      }));

      if (isLoadMore) {
        setVenues((prev) => [...prev, ...mappedData]);
        setVenuesOffset((prev) => prev + mappedData.length);
      } else {
        setVenues(mappedData);
        setVenuesOffset(mappedData.length);
        setNoWifiFound(mappedData.length === 0);
      }

      setHasMoreVenues(mappedData.length === VENUES_LIMIT);
      setIsOffline(false);
    } catch (error) {
      console.error("Error fetching nearby wifi:", error);
      if (!isLoadMore) setIsOffline(true);
    } finally {
      setLoadingMoreVenues(false);
      setIsWifiLoading(false);
    }
  };

  // 📡 FETCH: TOP RATED (Sort = rating)
  const fetchTopRated = async () => {
    try {
      const response = await discoverSearch({
        type: "business",
        sort: "latest",
        // lat: latitude,
        // lng: longitude,
        // near_me: true,
      });

      const rawData = response?.data || [];

      // Map API response to Venue type with proper field names
      const mappedData = rawData.map((item: any) => {
        const m = {
          id: item.id,
          userName: item.userName || item.businessName || item.name || "Unknown Business",
          address: item.fullAddress || item.location || "No address available",
          rating: item.ratingCount || 0,
          reviews: item.reviewsCount || 0,
          distance: item.distance || "",
          businessId: item.profile.id || item.businessId || item.business_id || item.companyId || item.company_id || item.company_profile_id || item.companyProfileId || 0,
          picture: item.picture || item.profilePicture || item.image || require("../../assets/icons/cafe.jpeg"),
        };
        console.log('[DEBUG] Raw item:', { id: item.id, bId: m.businessId, b_id: item.business_id, cId: item.companyId, cpId: item.company_profile_id });
        return m;
      });

      setTopRatedVenues(mappedData);
    } catch (error) {
      console.error("Error fetching top rated:", error);
    }
  };

  // 🔍 SEARCH: GLOBAL SEARCH (Header Bar Only)
  const handleSearch = async (text: string) => {
    if (!text.trim()) return;
    setIsSearching(true);
    try {
      const response = await performGlobalSearch({ q: text, limit: 20, offset: 0 });
      // Handle potentially different response structures
      const results = response?.data?.profiles || response?.profiles || response?.data || [];
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const onSearchSubmit = () => {
    handleSearch(searchQuery);
  };

  const onQuickPress = async (q: Quick) => {
    if (q.id === "otg") return goAffiliateList();

    setIsSearching(true);
    try {
      // Use discoverSearch for quick pills
      const response = await discoverSearch({
        type: "business",
        amenity: q.id, // e.g., "coffee", "gym"
        // near_me: true, // optional: depends if we want strictly nearby or global by category
      });
      const results = response?.data || [];
      setSearchResults(results);
    } catch (error) {
      console.error("Quick search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const runTour = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenHomeGuide");
      if (!hasSeen) {
        setTimeout(() => {
          start();
        }, 1000);
        await AsyncStorage.setItem("hasSeenHomeGuide", "true");
      }
    };
    runTour();
    fetchNearbyWifi();
    fetchTopRated();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Try to get fresh data from API first
      try {
        const profileData = await fetchProfile();
        console.log("Fetched fresh profile data from API:", profileData);
        if (profileData.profile) {
          setUserData(profileData.profile);
          setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.log("Failed to fetch fresh profile from API, falling back to local storage:", apiErr);
      }

      // Fallback to local storage
      const authUserData = await AsyncStorage.getItem("authUser");
      if (authUserData) {
        setUserData(JSON.parse(authUserData));
        setLoading(false);
        return;
      }
      const userProfileData = await AsyncStorage.getItem("userProfile");

      console.log("Loaded user profile data from storage:", userProfileData);
      if (userProfileData) {
        console.log("got profile from storage");
        setUserData(JSON.parse(userProfileData));
        setLoading(false);
        return;
      } else {
        console.log("didnt get profile at all");
        const tabNav = navigation.getParent?.();
        const rootNav = tabNav?.getParent?.();
        if (rootNav) {
          rootNav.navigate("OnboardingFlow", { screen: "CreateProfile" });
          return;
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "OnboardingFlow",
                params: { screen: "CreateProfile" } as any,
              },
            ],
          })
        );
      }

      setUserData(null);
      setLoading(false);
    } catch (error) {
      console.error("🚨 Error loading user data:", error);
      setUserData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const goProfile = () => navigation.navigate("Profile");
  const goLoyalty = () => navigation.navigate("Loyalty");
  const goReward = () => navigation.navigate("Reward");
  const goMap = () => navigation.navigate("Map");
  const goTransaction = () => navigation.navigate("WifiTransaction");
  const goAffiliateList = () => navigation.navigate("AffliList");



  const goBusiness = (v: Venue) =>
    navigation.navigate("BusinessProfile", {
      business: {
        id: v.id,
        businessId: v.businessId,
        name: v.userName,
        distance: v.distance,
        address: v.address,
        rating: v.rating,
        reviewsCount: v.reviews,
      },
    });

  const getDisplayName = () => {
    if (!userData) return "Guest User";
    if (userData.firstName && userData.lastName)
      return `${userData.firstName} ${userData.lastName}`;
    if (userData.userName) return userData.userName;
    if (userData.firstName) return userData.firstName;
    return "Guest User";
  };

  const getUserAvatar = () => {
    if (userData?.profilePicture) return { uri: userData.profilePicture };
    return require("../../assets/feed/user1.png");
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Row */}
          <View style={s.topRow}>
            {/* Complete Profile Banner (Conditional) */}
            {!userData?.userName && (
              <TouchableOpacity style={s.completeProfileBanner} onPress={goProfile}>
                <Text style={s.completeProfileText}>Complete your profile →</Text>
                <Text style={s.completeProfilePercent}>60%</Text>
              </TouchableOpacity>
            )}

            <View style={[s.headerContent, !userData?.userName && { marginTop: 10 }]}>
              <View style={s.userSection}>
                <TouchableOpacity onPress={goProfile}>
                  <Image source={getUserAvatar()} style={s.avatar} />
                </TouchableOpacity>
                <View style={s.userInfo}>
                  <Text style={s.greeting}>
                    Hi, {loading ? "..." : getDisplayName().split(" ")[0]}
                  </Text>
                  <TouchableOpacity onPress={goLoyalty} style={s.badgeRow}>
                    <Text style={s.badgeText}>🥉 Bronze {'>'} </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={s.topIcons}>
                <TouchableOpacity style={s.iconBtn} onPress={() => { }}>
                  <Image source={require("../../assets/home/history.png")} style={s.topIconImg} />
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtn} onPress={goReward}>
                  <Image source={require("../../assets/home/gift.png")} style={s.topIconImg} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 🔍 Tooltip Step: Search */}
          <CopilotStep
            text="Search for cafés, gyms or coworking spaces near you."
            order={1}
            name="search"
          >
            <WalkthroughableView style={s.searchWrap}>
              <Image
                source={require("../../assets/home/search.png")}
                style={s.searchIcon}
              />
              <TextInput
                placeholder="Search for places, Wi-Fi or amenities"
                placeholderTextColor="#9AA6BD"
                style={s.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={onSearchSubmit}
                returnKeyType="search"
              />
            </WalkthroughableView>
          </CopilotStep>

          {isSearching && (
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#555" }}>Searching...</Text>
            </View>
          )}

          <Text style={s.sectionTitle}>Quick search</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.quickRow}
          >
            {quick.map((q) => (
              <TouchableOpacity
                key={q.id}
                style={s.chip}
                activeOpacity={0.9}
                onPress={() => onQuickPress(q)}
              >
                <Text style={s.chipEmoji}>{q.emoji}</Text>
                <Text style={s.chipText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.headerRow}>
            <Text style={s.sectionTitle}>Wi-Fi spots near you</Text>
            <TouchableOpacity onPress={goMap}>
              <Text style={s.link}>View all</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={s.wifiSpotsContainer}>
          {!isSearching && searchResults.length > 0 && (
            <View style={{ marginTop: 10, paddingHorizontal: 16 }}>
              <Text style={s.sectionTitle}>Search results</Text>
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) =>
                  item.id?.toString() || index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#eee",
                      borderRadius: 12,
                      marginVertical: 6,
                    }}
                    onPress={() =>
                      navigation.navigate("BusinessProfile", { business: item })
                    }
                  >
                    <Text style={{ fontFamily: "RCB-Bold", fontSize: 16 }}>
                      {item.userName}
                    </Text>
                    <Text style={{ color: "#666" }}>
                      {item.address || "No address available"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Loading State */}
          {isWifiLoading && !isSearching && venues.length === 0 && (
             <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={BLUE} />
                <Text style={{ marginTop: 10, color: '#64748B' }}>Finding Wi-Fi spots near you...</Text>
             </View>
          )}

          {/* Empty State - No Wi-Fi Found */}
          {!isWifiLoading && noWifiFound && !isSearching && venues.length === 0 && (
            <View style={s.emptyState}>
              <View style={s.emptyIconContainer}>
                <Image
                  source={require("../../assets/home/search.png")}
                  style={s.emptyIcon}
                />
                <Text style={s.emptyIconWifi}>📶</Text>
              </View>
              <Text style={s.emptyTitle}>No Wi-Fi found in your location</Text>
              <Text style={s.emptySubtitle}>
                If you want OTG in your location,{" "}
                <Text style={s.emptyLink}>click here</Text>
              </Text>
              <TouchableOpacity
                style={s.tryAgainButton}
                onPress={() => fetchNearbyWifi()}
              >
                <Text style={s.tryAgainText}>Try again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty State - Offline */}
          {isOffline && !isSearching && (
            <View style={s.emptyState}>
              <View style={s.emptyIconContainer}>
                <Text style={s.emptyIconWifiLarge}>📶</Text>
              </View>
              <Text style={s.emptyTitle}>It seems you're offline</Text>
              <TouchableOpacity
                style={s.tryAgainButton}
                onPress={() => fetchNearbyWifi()}
              >
                <Text style={s.tryAgainText}>Try again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Venues List */}
          {!noWifiFound && !isOffline && venues.length > 0 && (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={venues}
              keyExtractor={(v) => v.id}
              renderItem={({ item }) => (
                <VenueCard v={item} onPress={() => goBusiness(item)} />
              )}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
              onEndReached={() => fetchNearbyWifi(true)}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMoreVenues ? (
                  <View style={{ justifyContent: "center", paddingHorizontal: 10 }}>
                    <ActivityIndicator size="small" color="#0145FE" />
                  </View>
                ) : null
              }
            />
          )}

          {/* 🏆 Top Rated Section */}
          <View style={s.headerRow}>
            <Text style={s.sectionTitle}>Top rated spots near you</Text>
            <TouchableOpacity onPress={goMap}>
              <Text style={s.link}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={topRatedVenues}
            keyExtractor={(v) => v.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <VenueCard v={item} onPress={() => goBusiness(item)} />
            )}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          />
        </View>
      </View>

      <WelcomeModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
}

// 🏠 Venue Card
function VenueCard({ v, onPress }: { v: Venue; onPress: () => void }) {
  const [imageError, setImageError] = React.useState(false);
  const placeholderImage = require("../../assets/icons/cafe.jpeg");

  // Determine image source
  const imageSource = imageError
    ? placeholderImage
    : (typeof v.picture === 'string' && v.picture.startsWith('http'))
      ? { uri: v.picture }
      : v.picture || placeholderImage;

  return (
    <TouchableOpacity style={s.venueCard} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={imageSource}
        defaultSource={placeholderImage}
        style={s.venueImage}
        onError={() => setImageError(true)}
      />
      <View style={s.venueInfo}>
        <Text style={s.venueName} numberOfLines={1}>
          {v.userName || "Unknown Venue"}
        </Text>

        <Text style={s.venueAddress} numberOfLines={1}>
          {v.address || "No address available"}
        </Text>

        <View style={s.venueMetaRow}>
          <Text style={s.venueDistance}>{v.distance || "0km away"}</Text>
          <Text style={s.dot}> • </Text>
          <Text style={s.venueWifi}>Free Wi-Fi</Text>
          <Text style={s.dot}> • </Text>
          <Text style={s.venueOpen}>Open</Text>
        </View>

        <View style={s.ratingRow}>
          <Image
            source={require("../../assets/home/star.png")}
            style={s.starIcon}
          />
          <Text style={s.ratingText}>{v.rating || "0.0"}</Text>
          <Text style={s.reviewCount}>{`  (${v.reviews || 0} reviews)`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const BORDER = "#E6ECF5";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  mainContainer: { flex: 1 },
  scrollContainer: { paddingBottom: 20 },
  wifiSpotsContainer: {
    flex: 1,
    minHeight: height * 0.5,
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  userSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: BLUE,
  },
  userInfo: { marginLeft: 12, justifyContent: "center" },
  greeting: { fontFamily: "RCB-Bold", fontSize: 18, color: TEXT },
  name: { fontFamily: "RCB-Bold", fontSize: 20, color: TEXT },
  badgePill: {
    marginTop: 2,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIcon: { width: 50, height: 16, objectFit: "contain" },
  topIcons: { flexDirection: "row", alignItems: "center" },
  roundIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  searchWrap: {
    marginTop: 14,
    marginHorizontal: 16,
    height: 48,
    backgroundColor: "#F1F5FB",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E7EEF8",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: { width: 18, height: 18, tintColor: "#9AA6BD" },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "RCB-Regular",
    color: TEXT,
  },
  sectionTitle: {
    marginTop: 18,
    marginHorizontal: 16,
    fontFamily: "RCB-Bold",
    fontSize: 20,
    color: TEXT,
  },
  headerRow: {
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  link: { color: BLUE, fontFamily: "RCB-SemiBold" },
  quickRow: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chipEmoji: { fontSize: 18, marginRight: 8 },
  chipIcon: { width: 20, height: 20, marginRight: 8 },
  chipText: { fontFamily: "RCB-Medium", fontSize: 14, color: "#334155" },
  card: {
    width: CARD_W,
    height: "100%",
    marginRight: 14,
    borderRadius: 18,
    overflow: "hidden",
  },
  cardBg: { flex: 1 },
  cardBgImg: { borderRadius: 18 },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  cardInfo: { position: "absolute", left: 14, right: 14, bottom: 12 },
  cardMeta: {
    color: "#FFE08A",
    fontFamily: "RCB-SemiBold",
    fontSize: 12,
    marginBottom: 2,
  },
  cardTitle: { color: "#fff", fontFamily: "RCB-Bold", fontSize: 20 },
  cardSub: {
    color: "#E6EDF3",
    fontFamily: "RCB-Regular",
    fontSize: 13,
    marginTop: 2,
  },
  // ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  star: { width: 14, height: 14, marginRight: 6 },
  ratingText: { color: "#FFD166", fontFamily: "RCB-SemiBold" },
  // reviewText: { color: "#D8DEE9", fontFamily: "RCB-Regular" },
  floatingPostButton: { position: "absolute", bottom: 30, alignSelf: "center" },
  postInner: { width: 52, height: 52, backgroundColor: BLUE, borderRadius: 26 },

  // Empty States
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  emptyIcon: {
    width: 40,
    height: 40,
    tintColor: "#94A3B8",
  },
  emptyIconWifi: {
    fontSize: 32,
    position: "absolute",
    bottom: 10,
    right: 10,
    opacity: 0.6,
  },
  emptyIconWifiLarge: {
    fontSize: 48,
    opacity: 0.5,
  },
  emptyTitle: {
    fontFamily: "RCB-Bold",
    fontSize: 18,
    color: "#475569",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "RCB-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyLink: {
    color: BLUE,
    fontFamily: "RCB-SemiBold",
  },
  tryAgainButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: BLUE,
    borderRadius: 24,
  },
  tryAgainText: {
    fontFamily: "RCB-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  venueCard: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginRight: 12,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E6ECF5",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  venueImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  venueInfo: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  venueName: {
    fontFamily: "RCB-Bold",
    fontSize: 16,
    color: "#0A1220",
  },

  venueAddress: {
    fontFamily: "RCB-Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },

  venueMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  venueDistance: {
    fontFamily: "RCB-Regular",
    fontSize: 13,
    color: "#64748B",
  },

  venueWifi: {
    fontFamily: "RCB-Regular",
    fontSize: 13,
    color: "#22C55E",
  },

  venueOpen: {
    fontFamily: "RCB-Regular",
    fontSize: 13,
    color: "#22C55E",
  },

  dot: {
    fontSize: 14,
    color: "#CBD5E1",
    marginHorizontal: 4,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  starIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },

  ratingText: {
    fontFamily: "RCB-SemiBold",
    color: "#FBBF24",
    fontSize: 14,
  },

  reviewCount: {
    fontFamily: "RCB-Regular",
    fontSize: 13,
    color: "#64748B",
  },

  // NEW STYLES
  completeProfileBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completeProfileText: {
    fontFamily: "RCB-Bold",
    color: "#fff",
    fontSize: 14,
  },
  completeProfilePercent: {
    fontFamily: "RCB-Bold",
    color: "#fff",
    fontSize: 14,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  badgeText: {
    fontFamily: "RCB-Medium",
    color: "#D97706", // Bronze-ish
    fontSize: 13,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  topIconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#334155'
  },
});

export default HomeScreen;
