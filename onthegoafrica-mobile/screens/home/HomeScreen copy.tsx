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

const HomeScreen = ({ navigation }: any) => {
  const { start } = useCopilot();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);

  const handleLocation = async () => {
    try {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

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
    location?: string;
  }) => {
    try {
      const response = await fetchBusinessProfiles({
        search: params.search,
        location: params.location,
        type: "business",
        limit: 10,
        offset: 0,
      });

      if (response?.profiles) {
        setVenues(response.profiles); // Set venues data after fetching
      } else {
        setVenues([]);
      }
    } catch (error) {
      console.error("❌ Error fetching business profiles:", error);
      setVenues([]);
    }
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
    handleLocation(); // Fetch location and populate venues when the app loads
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
      if (userProfileData) {
        setUserData(JSON.parse(userProfileData));
        setLoading(false);
        return;
      }

      // Navigate to profile creation if no data found
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
            { name: "OnboardingFlow", params: { screen: "CreateProfile" } },
          ],
        })
      );

      setUserData(null);
      setLoading(false);
    } catch (error) {
      console.error("🚨 Error loading user data:", error);
      setUserData(null);
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (!userData) return "Guest User";
    if (userData.firstName && userData.lastName)
      return `${userData.firstName} ${userData.lastName}`;
    if (userData.userName) return userData.userName;
    if (userData.firstName) return userData.firstName;
    return "Guest User";
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
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image
                  source={require("../../assets/feed/user1.png")}
                  style={s.avatar}
                />
              </TouchableOpacity>
              <View style={s.userInfo}>
                <Text style={s.name}>
                  {loading ? "Loading..." : getDisplayName()}
                </Text>
              </View>
            </View>
          </View>

          <Text style={s.sectionTitle}>Quick search</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.quickRow}
          >
            {/* Your quick search content */}
          </ScrollView>

          <View style={s.headerRow}>
            <Text style={s.sectionTitle}>Wifi spots near you</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Map")}>
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("BusinessProfile", { business: item })
                }
              >
                {/* Venue card rendering logic */}
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Your styles and other components go here...

{
  /* // 🔘 Round Button */
}
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

{
  /* // 🏠 Venue Card */
}
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
