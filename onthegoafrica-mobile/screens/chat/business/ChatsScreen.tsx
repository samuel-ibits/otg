// screens/ChatsScreen.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { ChatStackParamList } from "../../navigators/ChatStack";

const CHAT = require("../../../assets/icons/no-chat.png");

const TABS = ["Broadcasts", "Chats"] as const;
type TabKey = (typeof TABS)[number];

// Dummy broadcast data for testing
const dummyBroadcasts = [
  {
    id: "1",
    title: "Summer Sale Announcement",
    recipients: 125,
    date: "2 hours ago",
    status: "Delivered",
  },
];

export default function ChatsScreen() {
  const [tab, setTab] = useState<TabKey>("Broadcasts");
  const idx = useMemo(() => TABS.indexOf(tab), [tab]);
  const width = Dimensions.get("window").width;
  const indicator = useRef(new Animated.Value(idx)).current;

  const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();

  const onTab = (t: TabKey) => {
    setTab(t);
    Animated.spring(indicator, {
      toValue: TABS.indexOf(t),
      useNativeDriver: false,
      stiffness: 180,
      damping: 22,
      mass: 0.6,
    }).start();
  };

  const indicatorLeft = indicator.interpolate({
    inputRange: [0, 1],
    outputRange: [16, width / 2 + 16],
  });

  const isBroadcasts = tab === "Broadcasts";
  const ctaLabel = isBroadcasts ? "Start a broadcast" : "Start a chat";

  // TODO: Replace navigation target with a real Broadcast compose screen when available.
  const onPressCTA = () => navigation.navigate("DirectChat");

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Chats</Text>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabsRow}>
            {TABS.map((t) => {
              const active = t === tab;
              return (
                <TouchableOpacity
                  key={t}
                  style={styles.tabBtn}
                  onPress={() => onTab(t)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      active ? styles.tabTextActive : styles.tabTextInactive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.track} />
          <Animated.View style={[styles.indicator, { left: indicatorLeft }]} />
        </View>

        {/* Content */}
        {isBroadcasts ? (
          dummyBroadcasts.length > 0 ? (
            <BroadcastsList broadcasts={dummyBroadcasts} />
          ) : (
            <BroadcastsEmpty />
          )
        ) : (
          <ChatsEmpty />
        )}
      </ScrollView>

      {/* Bottom CTA (sticky) */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.ctaBtn} onPress={onPressCTA}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BroadcastsList({ broadcasts }: { broadcasts: typeof dummyBroadcasts }) {
  return (
    <View style={styles.broadcastsList}>
      {broadcasts.map((broadcast) => (
        <View key={broadcast.id} style={styles.broadcastItem}>
          <View style={styles.broadcastHeader}>
            <Text style={styles.broadcastTitle}>{broadcast.title}</Text>
            <Text style={styles.broadcastDate}>{broadcast.date}</Text>
          </View>
          <View style={styles.broadcastDetails}>
            <Text style={styles.broadcastRecipients}>
              {broadcast.recipients} recipients
            </Text>
            <View style={[
              styles.broadcastStatus,
              { backgroundColor: broadcast.status === "Delivered" ? "#E6F4EE" : "#FFF2E6" }
            ]}>
              <Text style={[
                styles.broadcastStatusText,
                { color: broadcast.status === "Delivered" ? "#0C3C2F" : "#FF8A00" }
              ]}>
                {broadcast.status}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function ChatsEmpty() {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.illusCircle}>
        <Image source={CHAT} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
      </View>
      <Text style={styles.emptyTitle}>No chats</Text>
      <Text style={styles.emptySub}>Create a new chat with your customers</Text>
    </View>
  );
}

function BroadcastsEmpty() {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.illusCircle}>
        <Image source={CHAT} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
      </View>
      <Text style={styles.emptyTitle}>No broadcasts</Text>
      <Text style={styles.emptySub}>Send one message to many customers at once</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },

  title: { fontSize: 32, color: "#0A1220", fontFamily: "RCB-Bold", marginBottom: 8 },

  tabsWrap: { marginBottom: 8 },
  tabsRow: { flexDirection: "row" },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { fontSize: 18, fontFamily: "RCB-SemiBold" },
  tabTextActive: { color: "#0C3C2F" },
  tabTextInactive: { color: "#8A94A6" },
  track: {
    height: 2,
    backgroundColor: "#D9DFEA",
    marginTop: 6,
    marginHorizontal: 16,
    borderRadius: 1,
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    width: Dimensions.get("window").width / 2 - 32,
    height: 3,
    backgroundColor: "#1A57FF",
    borderRadius: 2,
  },

  emptyWrap: { alignItems: "center", marginTop: 64, paddingHorizontal: 24 },
  illusCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontFamily: "RCB-Bold", color: "#0A1220", marginBottom: 6 },
  emptySub: { fontSize: 14, fontFamily: "RCB-Regular", color: "#9AA6BF" },

  broadcastsList: {
    marginTop: 16,
  },
  broadcastItem: {
    backgroundColor: "#F8F9FC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  broadcastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  broadcastTitle: {
    fontSize: 16,
    fontFamily: "RCB-SemiBold",
    color: "#0A1220",
    flex: 1,
    marginRight: 8,
  },
  broadcastDate: {
    fontSize: 12,
    fontFamily: "RCB-Regular",
    color: "#8A94A6",
  },
  broadcastDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  broadcastRecipients: {
    fontSize: 14,
    fontFamily: "RCB-Regular",
    color: "#5A6579",
  },
  broadcastStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  broadcastStatusText: {
    fontSize: 12,
    fontFamily: "RCB-Medium",
  },

  ctaWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    paddingHorizontal: 16,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A59FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  ctaText: { color: "#FFFFFF", fontSize: 16, fontFamily: "RCB-SemiBold" },
});