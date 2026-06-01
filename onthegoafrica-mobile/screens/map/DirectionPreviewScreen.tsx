// screens/maps/DirectionPreviewScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Image,
  Modal,
  FlatList,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { discoverSearch } from "../../api/api";

/* Assets */
const BACK = require("../../assets/icons/back.png");
const CLOSE = require("../../assets/icons/close.png");
const WIFI_ICON = require("../../assets/icons/wifi.png");
const PIN_BUSINESS = require("../../assets/icons/location-pin.png");
const STAR = require("../../assets/home/star.png");

type Coord = { latitude: number; longitude: number };

type WifiSpot = {
  id: string;
  ssid: string;
  password: string;
  provider: string;
  coordinate: Coord;
};

type Biz = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  coordinate: Coord;
  category: string;
  address: string;
  photo: string;
};

const CURRENT: Coord = { latitude: 6.4414, longitude: 3.4976 };

/* Seeded data */
const WIFI_SPOTS: WifiSpot[] = [
  { id: "w1", ssid: "CafeOne_Guest", password: "cafeone-2025", provider: "Cafe One Chevron", coordinate: { latitude: 6.44195, longitude: 3.4997 } },
  { id: "w2", ssid: "OTG_Free_WiFi", password: "otg-free", provider: "OTG Africa Hub", coordinate: { latitude: 6.4427, longitude: 3.4972 } },
  { id: "w3", ssid: "Public_Library", password: "library09", provider: "Lekki Library", coordinate: { latitude: 6.4402, longitude: 3.4949 } },
  { id: "w4", ssid: "Mall_FreeNet", password: "shop&surf", provider: "Chevron Mall", coordinate: { latitude: 6.4434, longitude: 3.5008 } },
  { id: "w5", ssid: "ParkWiFi", password: "greengrass", provider: "View Park", coordinate: { latitude: 6.439, longitude: 3.498 } },
  { id: "w6", ssid: "BusStop_Wifi", password: "ride2025", provider: "Jakande Bus Stop", coordinate: { latitude: 6.4436, longitude: 3.4962 } },
];

const BUSINESSES: Biz[] = [
  {
    id: "b1",
    name: "Cafe One Chevron",
    rating: 4.6,
    reviews: 150,
    distanceKm: 1.2,
    category: "Cafe",
    address: "Chevron Drive, Lekki",
    coordinate: { latitude: 6.44195, longitude: 3.4997 },
    photo: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600",
  },
  {
    id: "b2",
    name: "Zorkle",
    rating: 4.3,
    reviews: 98,
    distanceKm: 0.8,
    category: "Restaurant",
    address: "Lekki Phase 1",
    coordinate: { latitude: 6.4406, longitude: 3.4966 },
    photo: "https://images.unsplash.com/photo-1543357480-c60d7509f607?q=80&w=600",
  },
  {
    id: "b3",
    name: "Esorae Living",
    rating: 4.1,
    reviews: 73,
    distanceKm: 1.6,
    category: "Home & Living",
    address: "Admiralty Way",
    coordinate: { latitude: 6.443, longitude: 3.5019 },
    photo: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=600",
  },
  {
    id: "b4",
    name: "IFitness Gym",
    rating: 4.7,
    reviews: 212,
    distanceKm: 2.1,
    category: "Gym",
    address: "Lekki Phase 1",
    coordinate: { latitude: 6.4442, longitude: 3.4979 },
    photo: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=600",
  },
  {
    id: "b5",
    name: "Blue Roof Co-working",
    rating: 4.5,
    reviews: 62,
    distanceKm: 0.9,
    category: "Co-working",
    address: "Freedom Way",
    coordinate: { latitude: 6.4401, longitude: 3.4994 },
    photo: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=600",
  },
  {
    id: "b6",
    name: "Bar ON",
    rating: 4.0,
    reviews: 44,
    distanceKm: 1.8,
    category: "Bar",
    address: "Elegushi",
    coordinate: { latitude: 6.4393, longitude: 3.4953 },
    photo: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600",
  },
  {
    id: "b7",
    name: "Westend Sports Bar",
    rating: 4.2,
    reviews: 132,
    distanceKm: 1.1,
    category: "Sports Bar",
    address: "Oniru",
    coordinate: { latitude: 6.4423, longitude: 3.4992 },
    photo: "https://images.unsplash.com/photo-1508087624303-e3de49ba902e?q=80&w=600",
  },
  {
    id: "b8",
    name: "Roast & Grind",
    rating: 4.8,
    reviews: 260,
    distanceKm: 2.6,
    category: "Cafe",
    address: "Victoria Island",
    coordinate: { latitude: 6.4451, longitude: 3.4987 },
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
  },
];

export default function DirectionPreviewScreen({ navigation }: any) {
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coord>(CURRENT);
  const [wifiSpots, setWifiSpots] = useState<WifiSpot[]>([]);
  const [businesses, setBusinesses] = useState<Biz[]>([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const newLocation = { latitude, longitude };
        setCurrentLocation(newLocation);

        // Fetch Wifi Spots
        const wifiRes = await discoverSearch({
          type: "business",
          amenity: "wifi",
          lat: latitude,
          lng: longitude,
          near_me: true,
        });
        const wifiData = wifiRes?.data || [];
        const mappedWifi = wifiData.map((item: any) => ({
           id: item.id.toString(),
           ssid: item.wifiName || item.wifi_ssid || item.userName || "Unknown Wifi",
           password: item.wifiPassword || item.wifi_password || "********",
           provider: item.userName || item.name || "Unknown Provider",
           coordinate: {
             latitude: parseFloat(item.latitude) || latitude + (Math.random() - 0.5) * 0.01,
             longitude: parseFloat(item.longitude) || longitude + (Math.random() - 0.5) * 0.01,
           }
        }));
        setWifiSpots(mappedWifi);

        // Fetch Businesses (Top rated or nearby)
        const bizRes = await discoverSearch({
          type: "business",
          lat: latitude,
          lng: longitude,
          near_me: true,
          limit: 10
        });
        const bizData = bizRes?.data || [];
        const mappedBiz = bizData.map((item: any) => ({
           id: item.id.toString(),
           name: item.userName || item.name || "Unknown Business",
           rating: parseFloat(item.rating) || 0,
           reviews: parseInt(item.reviews) || 0,
           distanceKm: parseFloat(item.distance) || 0,
           category: item.businessCategory || "Business",
           address: item.address || "No address",
           coordinate: {
             latitude: parseFloat(item.latitude) || latitude + (Math.random() - 0.5) * 0.01,
             longitude: parseFloat(item.longitude) || longitude + (Math.random() - 0.5) * 0.01,
           },
           photo: item.picture || item.image,
        }));
        setBusinesses(mappedBiz);
        
      } catch (e) {
        console.error("Error fetching map data:", e);
      }
    })();
  }, []);

  const region: Region = useMemo(
    () => ({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    }),
    [currentLocation]
  );

  /* Wi-Fi ad / reveal */
  const [wifiOpen, setWifiOpen] = useState(false);
  const [wifiTimer, setWifiTimer] = useState(5);
  const [wifiReveal, setWifiReveal] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState<WifiSpot | null>(null);

  /* Business modal */
  const [bizOpen, setBizOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<Biz | null>(null);

  useEffect(() => {
    if (!wifiOpen) return;
    setWifiReveal(false);
    setWifiTimer(5);
    const id = setInterval(() => {
      setWifiTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setWifiReveal(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [wifiOpen]);

  const openNativeDirections = (coord: Coord, label: string) => {
    const lat = coord.latitude;
    const lng = coord.longitude;
    const q = encodeURIComponent(label);
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?daddr=${lat},${lng}&q=${q}`,
        android: `geo:0,0?q=${lat},${lng}(${q})`,
      }) || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleMapReady = () => {
    setMapReady(true);
    // Fit map to show all markers
    setTimeout(() => {
      if (mapRef.current) {
        const allCoords = [...wifiSpots.map(w => w.coordinate), ...businesses.map(b => b.coordinate), currentLocation];
        if (allCoords.length > 1) {
          mapRef.current.fitToCoordinates(allCoords, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
        }
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
          {Image.resolveAssetSource(BACK)?.uri ? (
            <Image source={BACK} style={s.backIcon} />
          ) : (
            <Text style={s.backTxt}>‹</Text>
          )}
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nearby Wi-Fi & Businesses</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={s.map}
        initialRegion={region}
        onMapReady={handleMapReady}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        loadingEnabled={true}
        mapType="standard"
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {/* Current location marker */}
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor="blue"
          tracksViewChanges={false}
        />

        {/* Wi-Fi markers - custom emoji markers */}
        {wifiSpots.map((w) => (
          <Marker
            key={w.id}
            coordinate={w.coordinate}
            title={w.ssid}
            description={w.provider}
            onPress={() => {
              setSelectedWifi(w);
              setWifiOpen(true);
            }}
          >
            <View style={s.wifiMarkerContainer}>
              <Text style={s.wifiMarkerEmoji}>📶</Text>
            </View>
          </Marker>
        ))}

        {/* Business markers - simplified first */}
        {businesses.map((b) => (
          <Marker
            key={b.id}
            coordinate={b.coordinate}
            title={b.name}
            description={b.category}
            pinColor="red"
            onPress={() => {
              setSelectedBiz(b);
              setBizOpen(true);
            }}
          />
        ))}
      </MapView>

      {/* Wi-Fi modal */}
      <Modal transparent visible={wifiOpen} animationType="fade" onRequestClose={() => setWifiOpen(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <TouchableOpacity style={s.close} onPress={() => setWifiOpen(false)} activeOpacity={0.8}>
              {Image.resolveAssetSource(CLOSE)?.uri ? (
                <Image source={CLOSE} style={s.closeIcon} />
              ) : (
                <Text style={s.closeX}>×</Text>
              )}
            </TouchableOpacity>

            {/* Concentric badge with Wi-Fi icon */}
            <View style={s.badgeOuter2}>
              <View style={s.badgeOuter1}>
                <View style={s.badgeCore}>
                  {Image.resolveAssetSource(WIFI_ICON)?.uri ? (
                    <Image source={WIFI_ICON} style={s.badgeWifi} />
                  ) : (
                    <Text style={s.badgeTxt}>📶</Text>
                  )}
                </View>
              </View>
            </View>

            {!wifiReveal ? (
              <>
                <Text style={s.title}>Watch short ad to reveal Wi-Fi</Text>
                <Text style={s.bodyCenter}>Provider: <Text style={s.bodyBold}>{selectedWifi?.provider}</Text></Text>

                <View style={s.fakeAd}>
                  <Text style={s.fakeAdTxt}>Ad plays here</Text>
                </View>

                <Text style={s.countdown}>Reveals in {wifiTimer}s</Text>
              </>
            ) : (
              <>
                <Text style={s.title}>Wi-Fi details</Text>
                <Text style={s.bodyCenter}>Tap Done to copy later from history.</Text>

                <View style={s.fieldBox}>
                  <Text style={s.fieldLabel}>SSID</Text>
                  <Text style={s.fieldValue}>{selectedWifi?.ssid}</Text>
                </View>
                <View style={s.fieldBox}>
                  <Text style={s.fieldLabel}>Password</Text>
                  <Text style={s.fieldValue}>{selectedWifi?.password}</Text>
                </View>

                <TouchableOpacity style={s.cta} onPress={() => setWifiOpen(false)} activeOpacity={0.9}>
                  <Text style={s.ctaText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Business modal */}
      <Modal transparent visible={bizOpen} animationType="fade" onRequestClose={() => setBizOpen(false)}>
        <View style={s.overlay}>
          <View style={[s.sheet, { paddingBottom: 18 }]}>
            <TouchableOpacity style={s.close} onPress={() => setBizOpen(false)} activeOpacity={0.8}>
              {Image.resolveAssetSource(CLOSE)?.uri ? (
                <Image source={CLOSE} style={s.closeIcon} />
              ) : (
                <Text style={s.closeX}>×</Text>
              )}
            </TouchableOpacity>

            {/* Photo badge */}
            <View style={s.badgeOuter2}>
              <View style={s.badgeOuter1}>
                <View style={[s.badgeCore, { padding: 0 }]}>
                  {selectedBiz?.photo ? (
                    <Image source={{ uri: selectedBiz.photo }} style={s.badgePhoto} />
                  ) : (
                    <View style={s.badgePhotoFallback} />
                  )}
                </View>
              </View>
            </View>

            <Text style={s.title}>{selectedBiz?.name}</Text>
            <Text style={s.bodyCenter}>
              {selectedBiz?.category} • {selectedBiz?.address}
            </Text>

            <View style={{ height: 8 }} />

            <View style={s.ratingRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Image key={i} source={STAR} style={[s.star, { opacity: i + 0.5 <= (selectedBiz?.rating || 0) ? 1 : 0.25 }]} />
              ))}
              <Text style={s.bodyMuted}>
                {" "}{selectedBiz?.rating?.toFixed(1)} • {selectedBiz?.reviews} reviews
              </Text>
            </View>
            <Text style={s.bodyMuted}>{selectedBiz?.distanceKm} km away</Text>

            <View style={{ height: 14 }} />

            <View style={s.rowBtns}>
              <TouchableOpacity
                style={[s.secondary, { flex: 1, marginRight: 8 }]}
                onPress={() => {
                  setBizOpen(false);
                  navigation.navigate("BusinessProfile", { id: selectedBiz?.id });
                }}
                activeOpacity={0.9}
              >
                <Text style={s.secondaryTxt}>Visit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.cta, { flex: 1, marginLeft: 8 }]}
                onPress={() => {
                  if (selectedBiz) openNativeDirections(selectedBiz.coordinate, selectedBiz.name);
                }}
                activeOpacity={0.9}
              >
                <Text style={s.ctaText}>Get directions</Text>
              </TouchableOpacity>
            </View>

            <Text style={[s.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>Nearby free Wi-Fi</Text>
            
            <View style={s.wifiListContainer}>
              {wifiSpots.slice(0, 3).map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={s.rowWifi}
                    onPress={() => {
                      setSelectedWifi(item);
                      setBizOpen(false);
                      setWifiOpen(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={s.wifiIconContainer}>
                      {Image.resolveAssetSource(WIFI_ICON)?.uri ? (
                        <Image source={WIFI_ICON} style={s.rowWifiIcon} />
                      ) : (
                        <Text style={s.rowWifiEmojiIcon}>📶</Text>
                      )}
                    </View>
                    <View style={s.wifiTextContainer}>
                      <Text style={s.rowWifiTitle} numberOfLines={1}>{item.ssid}</Text>
                      <Text style={s.subDarkMini} numberOfLines={1}>{item.provider}</Text>
                    </View>
                    <TouchableOpacity style={s.wifiViewBtn} activeOpacity={0.8}>
                      <Text style={s.rowWifiCta}>View</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  {index < 2 && <View style={s.wifiSeparator} />}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* styles */
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BLUE = "#0A59FF";
const GREEN = "#1FB767";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7EAF3",
    zIndex: 5,
  },
  headerTitle: { color: TEXT, fontSize: 16, fontWeight: "800" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  backIcon: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  backTxt: { fontSize: 28, color: TEXT },

  map: { flex: 1 },

  /* wifi marker container */
  wifiMarkerContainer: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  wifiMarkerEmoji: {
    fontSize: 16,
    color: '#fff',
  },

  /* business marker visuals with photo inside pin */
  bizMarker: { alignItems: "center" },
  pinImg: { width: 40, height: 48, resizeMode: "contain" },
  pinFallback: { width: 40, height: 48, backgroundColor: BLUE, borderRadius: 12, opacity: 0.9 },
  pinAvatar: {
    position: "absolute",
    top: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#fff",
  },

  /* Shared bottom-sheet modal styles */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 22,
    minHeight: 420,
    alignItems: "center",
  },

  // floating close button
  close: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  closeIcon: { width: 16, height: 16, tintColor: "#617291" },
  closeX: { fontSize: 24, color: "#617291" },

  // concentric badge shell
  badgeOuter2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(31,183,103,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  badgeOuter1: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "rgba(31,183,103,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCore: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
    padding: 8,
  },
  badgeWifi: { width: 30, height: 30, tintColor: "#fff" },
  badgeTxt: { color: "#fff", fontSize: 26, fontWeight: "800" },

  badgePhoto: { width: 64, height: 64, borderRadius: 32 },
  badgePhotoFallback: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#D9E3F4" },

  title: {
    color: TEXT,
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 8,
    fontWeight: "800",
  },
  bodyCenter: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 320,
  },
  bodyBold: { color: TEXT, fontWeight: "800" },
  bodyMuted: { color: "#6C7A92", fontWeight: "600" },

  fakeAd: {
    height: 150,
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  fakeAdTxt: { color: "#fff", fontWeight: "800" },
  countdown: { color: MUTED, marginBottom: 2, marginTop: 4, fontWeight: "800" },

  fieldBox: {
    marginTop: 10,
    alignSelf: "stretch",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F5F7FB",
    borderWidth: 1,
    borderColor: "#E6EDF7",
  },
  fieldLabel: { color: MUTED, fontWeight: "700" },
  fieldValue: { color: TEXT, fontWeight: "900", fontSize: 16, marginTop: 2 },

  ratingRow: { flexDirection: "row", alignItems: "center" },
  star: { width: 16, height: 16, marginRight: 2, tintColor: "#F6B30D" },

  rowBtns: { flexDirection: "row", alignSelf: "stretch" },

  secondary: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EFF3FB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E3EAF5",
  },
  secondaryTxt: { color: TEXT, fontSize: 16, fontWeight: "800" },

  cta: {
    backgroundColor: BLUE,
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  ctaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },

  sectionTitle: { 
    color: TEXT, 
    fontWeight: "900", 
    fontSize: 16, 
    alignSelf: "stretch" 
  },

  wifiListContainer: {
    alignSelf: "stretch",
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5EDF8",
    overflow: "hidden",
  },

  wifiSeparator: {
    height: 1,
    backgroundColor: "#E5EDF8",
    marginLeft: 48,
  },

  wifiIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    marginRight: 12,
  },

  wifiTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  wifiViewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  subDarkMini: { 
    color: "#8A94A6", 
    fontWeight: "500", 
    fontSize: 13,
    marginTop: 2,
  },

  rowWifi: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 68,
  },

  rowWifiIcon: { 
    width: 20, 
    height: 20, 
    tintColor: BLUE 
  },

  rowWifiEmojiIcon: {
    fontSize: 18,
    color: BLUE,
  },

  rowWifiTitle: { 
    color: TEXT, 
    fontWeight: "700",
    fontSize: 15,
  },

  rowWifiCta: { 
    color: BLUE, 
    fontWeight: "700",
    fontSize: 14,
  },
});