  // App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { CopilotProvider } from "react-native-copilot";

// nav
import TabNavigator from "./navigation/TabNavigator";
import OnboardingStack from "./navigation/OnboardingStack";
import BusinessTabNavigator from "./navigation/BusinessTabNavigator";

// ui
import CustomHeader from "./component/CustomHeader";
import WiFiLocationsModal from "./component/WiFiLocationsModal";

// movement tracking
import { MovementTrackingService } from "./services/MovementTrackingService";
import {
  MovementTrackingEvents,
  MovementActivity,
} from "./services/MovementTrackingService";

// push
import {
  setNotificationHandlers,
  registerForPushNotificationsAsync,
  localNotify,
  sendRemotePush,
} from "./services/pushNotifications";

// wifi scan (Android)
import { WifiScanService, WifiScanEvents } from "./services/WifiScanService";
import WifiManager from "react-native-wifi-reborn";

SplashScreen.preventAutoHideAsync().catch(() => {});
setNotificationHandlers();

type RootParamList = {
  OnboardingFlow: undefined;
  MainTabs: undefined;
  BusinessNavigator: undefined;
};

const RootStack = createStackNavigator<RootParamList>();

export default function App() {
  const [loaded] = useFonts({
    "RCB-Regular": require("./fonts/RadioCanadaBig-Regular.ttf"),
    "RCB-Medium": require("./fonts/RadioCanadaBig-Medium.ttf"),
    "RCB-SemiBold": require("./fonts/RadioCanadaBig-SemiBold.ttf"),
    "RCB-Bold": require("./fonts/RadioCanadaBig-Bold.ttf"),
  });

  const [expoPushToken, setExpoPushToken] = React.useState<string | null>(null);

  // Wi-Fi modal state
  const [wifiModalVisible, setWifiModalVisible] = React.useState(false);
  const [wifiModalNetworks, setWifiModalNetworks] = React.useState<
    { id: string; name: string; verified: boolean; locked: boolean }[]
  >([]);

  React.useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // Register for push once
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = await registerForPushNotificationsAsync();
      if (!cancelled) setExpoPushToken(t);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Movement tracking + push
  React.useEffect(() => {
    if (!loaded) return;

    let cancelled = false;
    let unsubscribeActivity: (() => void) | null = null;

    (async () => {
      try {
        await MovementTrackingService.configure({
          apiUrl: "https://your.api/track", // replace
          apiHeaders: { Authorization: "Bearer <token>" }, // optional
          windowOnMs: 3 * 60 * 1000,
          windowOffMs: 2 * 60 * 1000,
          distanceMeters: 5,
          timeIntervalMs: Platform.select({ ios: 5000, android: 5000 })!,
          androidNotificationTitle: "Tracking movement",
          androidNotificationBody: "Collecting location for analytics",
        });

        if (!cancelled) {
          await MovementTrackingService.startAsync();

          unsubscribeActivity = MovementTrackingEvents.onActivity(
            async (a: MovementActivity) => {
              const title = "Movement tracking";
              const body = a.message ?? a.type;

              await localNotify(title, body, { type: a.type, meta: a.meta });
              if (expoPushToken) {
                await sendRemotePush(expoPushToken, title, body, {
                  type: a.type,
                  meta: a.meta,
                });
              }
            }
          );
        }
      } catch (e) {
        console.warn("MovementTrackingService start failed:", e);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribeActivity?.();
      MovementTrackingService.stopAsync().catch(() => {});
    };
  }, [loaded, expoPushToken]);

  // Wi-Fi scanning + push + modal (Android)
  React.useEffect(() => {
    if (!loaded) return;
    if (Platform.OS !== "android") return;

    let unsub: (() => void) | null = null;

    (async () => {
      // Reduced interval to 5s and include all results
      await WifiScanService.configure({
        intervalMs: 60000 * 3,
        announceNewOnly: true,
      });
      await WifiScanService.startAsync();

      unsub = WifiScanEvents.onActivity(async (a) => {
        if (a.type !== "new_networks") return;

        const list = a.meta?.new ?? [];
        if (!list.length) return;

        const mapped = list.map((n: any, idx: number) => ({
          id: `wifi-${n.bssid || n.ssid || "unknown"}-${idx}-${Date.now()}`,
          name: n.ssid || "Hidden SSID",
          verified: false,
          locked: !!n.secure,
        }));

        try {
          const current = await WifiManager.getCurrentWifiSSID();
          if (current && !mapped.find((x) => x.name === current)) {
            mapped.unshift({
              id: `connected:${current}-${Date.now()}`,
              name: current,
              verified: true,
              locked: true,
            });
          }
        } catch (error) {
          console.log("[DEBUG] Could not get current WiFi SSID:", error);
        }

        setWifiModalNetworks(mapped);
        setWifiModalVisible(true);

        const first = mapped[0];
        const title = "Nearby Wi-Fi";
        const body =
          mapped.length === 1
            ? `${first.name} • ${first.locked ? "Locked" : "Open"}`
            : `${mapped.length} networks detected`;

        await localNotify(title, body, { kind: "wifi", total: mapped.length });
        if (expoPushToken) {
          await sendRemotePush(expoPushToken, title, body, {
            kind: "wifi",
            total: mapped.length,
          });
        }
      });
    })();

    return () => {
      unsub?.();
      WifiScanService.stopAsync().catch(() => {});
    };
  }, [loaded, expoPushToken]);

  if (!loaded) return null;

  const initialRouteName: keyof RootParamList = "OnboardingFlow";

  return (
    <CopilotProvider>
      <View style={{ flex: 1 }}>
        <CustomHeader />
        <NavigationContainer>
          <RootStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialRouteName}
          >
            <RootStack.Screen
              name="OnboardingFlow"
              component={OnboardingStack}
            />
            <RootStack.Screen name="MainTabs" component={TabNavigator} />
            <RootStack.Screen
              name="BusinessNavigator"
              component={BusinessTabNavigator}
            />
          </RootStack.Navigator>
        </NavigationContainer>

        <WiFiLocationsModal
          visible={wifiModalVisible}
          networks={wifiModalNetworks}
          onClose={() => setWifiModalVisible(false)}
          onNetworkSelect={() => setWifiModalVisible(false)}
        />
      </View>
    </CopilotProvider>
  );
}
