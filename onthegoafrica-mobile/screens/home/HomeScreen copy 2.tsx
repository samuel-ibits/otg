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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeModal from "../../component/WelcomeModal";
import { useCopilot, CopilotStep, walkthroughable } from "react-native-copilot";
import CustomTooltip from "../../component/CustomTooltip";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { fetchBusinessProfiles } from "../../api/api";
import * as Location from "expo-location";

const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchable = walkthroughable(TouchableOpacity);

const { width, height } = Dimensions.get("window");
const CARD_W = width * 0.86;

type Quick = { id: string; label: string; icon: any };
type Venue = {
  id: string;
  title: string;
  distance: string;
  address: string;
  reviews: number;
  rating: number;
  photo: any;
};

const quick: Quick[] = [
  {
    id: "otg",
    label: "OTG Partner",
    icon: require("../../assets/home/icon-work.png"),
  },
  {
    id: "work",
    label: "Working Spaces",
    icon: require("../../assets/home/icon-work.png"),
  },
  {
    id: "coffee",
    label: "Coffee",
    icon: require("../../assets/home/icon-coffee.png"),
  },
  { id: "gym", label: "Gym", icon: require("../../assets/home/icon-gym.png") },
  { id: "fun", label: "Fun", icon: require("../../assets/home/icon-fun.png") },
];

// const venues: Venue[] = [
//   {
//     id: "1",
//     title: "The Impact Hub",
//     distance: "2km away",
//     address: "22 Glover Rd, Ikoyi",
//     reviews: 10,
//     rating: 4.7,
//     photo: require("../../assets/home/card1.png"),
//   },
//   {
//     id: "2",
//     title: "Civic Hive",
//     distance: "3.5km away",
//     address: "S/W Ikoyi, Lagos",
//     reviews: 23,
//     rating: 4.6,
//     photo: require("../../assets/home/card1.png"),
//   },
// ];

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
  const handleLocation = async () => {
    try {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied", status);
        return;
      }
      console.log("Permission granted, fetching location..", status);
      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log("Current location:", latitude, longitude);
      // Use it to fetch nearby venues
      await handleSearch({
        location: `${latitude},${longitude}`,
        type: "business",
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const handleSearch = async (params: {
    search?: string;
    type?: string;
    location?: String;
  }) => {
    try {
      setIsSearching(true);
      const response = await fetchBusinessProfiles({
        search: params.search,
        type: "business",
        location: params.location,
        limit: 10,
        offset: 0,
      });
      console.log("✅ Fetched business profiles:", response);
      if (response?.profiles) {
        setSearchResults(response.profiles);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("❌ Error fetching business profiles:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const onSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    handleSearch({ search: searchQuery });
  };

  useEffect(() => {
    loadUserData();
  }, []);

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
    handleLocation();
  }, []);

  const loadUserData = async () => {
    try {
      const authUserData = await AsyncStorage.getItem("authUser");
      if (authUserData) {
        setUserData(JSON.parse(authUserData));
        setLoading(false);
        return;
      }
      const userProfileData = await AsyncStorage.getItem("userProfile");

      console.log("Loaded user profile data:", userProfileData);
      if (userProfileData) {
        console.log("got profile");
        setUserData(JSON.parse(userProfileData));
        setLoading(false);
        return;
      } else {
        console.log("didnt get profile");
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

  // 🚀 Start guided tour for first-time users
  useEffect(() => {
    const runTour = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem("hasSeenHomeGuide");
        if (!hasSeen) {
          console.log("🎯 Starting tour...");
          setTimeout(() => {
            start();
          }, 1000);
          await AsyncStorage.setItem("hasSeenHomeGuide", "true");
        } else {
          console.log("✅ User has already seen tour");
        }
      } catch (err) {
        console.log("⚠️ Tour error:", err);
      }
    };
    runTour();
  }, []);

  const goProfile = () => navigation.navigate("Profile");
  const goLoyalty = () => navigation.navigate("Loyalty");
  const goReward = () => navigation.navigate("Reward");
  const goMap = () => navigation.navigate("Map");
  const goTransaction = () => navigation.navigate("WifiTransaction");
  const goAffiliateList = () => navigation.navigate("AffliList");

  const onQuickPress = (q: Quick) => {
    if (q.id === "otg") return goAffiliateList();
    handleSearch({ search: q.id });
  };

  const goBusiness = (v: Venue) =>
    navigation.navigate("BusinessProfile", {
      business: {
        name: v.title,
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
            <View style={s.userSection}>
              <TouchableOpacity onPress={goProfile}>
                <Image source={getUserAvatar()} style={s.avatar} />
              </TouchableOpacity>
              <View style={s.userInfo}>
                <Text style={s.name}>
                  {loading ? "Loading..." : getDisplayName()}
                </Text>
                <TouchableOpacity onPress={goLoyalty}>
                  <View style={s.badgePill}>
                    <Image
                      source={require("../../assets/home/badge.png")}
                      style={s.badgeIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* 🎁 Tooltip Step: Voucher */}
            <CopilotStep
              text="Check your earned vouchers here — redeem them anytime."
              order={2}
              name="voucher"
            >
              <WalkthroughableTouchable style={s.roundIcon} onPress={goReward}>
                <Image
                  source={require("../../assets/home/wallet.png")}
                  style={{ width: 20, height: 20 }}
                />
              </WalkthroughableTouchable>
            </CopilotStep>

            <View style={{ width: 10 }} />
            <RoundIcon
              source={require("../../assets/icons/wifi.png")}
              onPress={goTransaction}
            />
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
                placeholder="Where do you want to visit?"
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
                      {item.name}
                    </Text>
                    <Text style={{ color: "#666" }}>
                      {item.address || "No address available"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
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
                <Image source={q.icon} style={s.chipIcon} />
                <Text style={s.chipText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={s.chip} onPress={handleLocation}>
            {" "}
            <Text style={s.chipText}>test</Text>
          </TouchableOpacity>
          <View style={s.headerRow}>
            <Text style={s.sectionTitle}>Wifi spots near you</Text>
            <TouchableOpacity onPress={goMap}>
              <Text style={s.link}>View all</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={s.wifiSpotsContainer}>
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
          />
        </View>
      </View>

      {/* 💬 Tooltip Step: Post Button */}
      <CopilotStep
        text="Share your feedback or post your experience here."
        order={3}
        name="post"
      >
        <WalkthroughableTouchable style={s.floatingPostButton}>
          <View style={s.postInner} />
        </WalkthroughableTouchable>
      </CopilotStep>

      <WelcomeModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
}

// 🔘 Round Button
function RoundIcon({ source, onPress }: { source: any; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.roundIcon} activeOpacity={0.8}>
      <Image
        source={source}
        style={{ width: 20, height: 20 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

// 🏠 Venue Card
function VenueCard({ v, onPress }: { v: Venue; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={s.card} onPress={onPress}>
      <ImageBackground
        source={v.photo}
        style={s.cardBg}
        imageStyle={s.cardBgImg}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={s.cardGradient}
        />
        <View style={s.cardInfo}>
          <Text style={s.cardMeta}>{v.distance}</Text>
          <Text style={s.cardTitle}>{v.title}</Text>
          <Text style={s.cardSub}>{v.address}</Text>
          <View style={s.ratingRow}>
            <Image
              source={require("../../assets/home/star.png")}
              style={s.star}
            />
            <Text style={s.ratingText}>{v.rating.toFixed(1)}</Text>
            <Text style={s.reviewText}>{`  •  ${v.reviews} reviews`}</Text>
          </View>
        </View>
      </ImageBackground>
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
  },
  userSection: { flexDirection: "column", alignItems: "flex-start", flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: BLUE,
  },
  userInfo: { marginTop: 6, justifyContent: "center", flexDirection: "row" },
  name: { fontFamily: "RCB-Bold", fontSize: 20, color: TEXT },
  badgePill: {
    marginTop: 4,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 10,
  },
  badgeIcon: { width: 45, height: 20, marginRight: 6, objectFit: "contain" },
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
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  chipIcon: { width: 20, height: 20, marginRight: 8 },
  chipText: { fontFamily: "RCB-Medium", color: "#334155" },
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
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  star: { width: 14, height: 14, marginRight: 6 },
  ratingText: { color: "#FFD166", fontFamily: "RCB-SemiBold" },
  reviewText: { color: "#D8DEE9", fontFamily: "RCB-Regular" },
  floatingPostButton: { position: "absolute", bottom: 30, alignSelf: "center" },
  postInner: { width: 52, height: 52, backgroundColor: BLUE, borderRadius: 26 },
});

export default HomeScreen;
