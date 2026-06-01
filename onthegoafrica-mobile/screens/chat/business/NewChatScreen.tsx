// screens/NewChatScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
} from "react-native";
import UpgradeToPremiumModal from "../../../component/UpgradeToPremiumModal"; // adjust path if needed

type Contact = {
  id: string;
  name: string;
  city: string;
  visits: number;
  lastSeen: string; // e.g., "visited 2 mins ago"
  avatar?: string;  // remote url optional
};

const BACK_ICON = require("../../../assets/icons/back.png");
const CHECK_ICON = require("../../../assets/icons/checkmark.png");

const DATA: Contact[] = [
  {
    id: "1",
    name: "Jane Doe",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Tommy Gbese",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=256&q=80&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Dan Nithingale",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
  },
  {
    id: "4",
    name: "Mariam Bolade",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=256&q=80&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Adeola Bukola",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Susan Obinna",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80&auto=format&fit=crop",
  },
  {
    id: "7",
    name: "Ada Sike",
    city: "Ikeja, Lagos",
    visits: 10,
    lastSeen: "visited 2 mins ago",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80&auto=format&fit=crop",
  },
];

export default function NewChatScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isCreatingBroadcast, setIsCreatingBroadcast] = useState(false);
  const [broadcastName, setBroadcastName] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return DATA;
    return DATA.filter((c) => c.name.toLowerCase().includes(t));
  }, [q]);

  const onPressMessage = () => {
    setShowUpgrade(true);
  };

  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const startBroadcastCreation = () => {
    if (DATA.length === 0) {
      Alert.alert("No contacts", "You need to have contacts to create a broadcast");
      return;
    }
    setIsCreatingBroadcast(true);
  };

  const createBroadcast = () => {
    if (!broadcastName.trim()) {
      Alert.alert("Error", "Please enter a broadcast name");
      return;
    }
    
    if (selectedContacts.length === 0) {
      Alert.alert("Error", "Please select at least one contact");
      return;
    }
    
    // Here you would typically save the broadcast and navigate
    Alert.alert(
      "Broadcast Created", 
      `Broadcast "${broadcastName}" created with ${selectedContacts.length} contacts`
    );
    
    // Reset and go back
    setSelectedContacts([]);
    setBroadcastName("");
    setIsCreatingBroadcast(false);
    navigation.goBack();
  };

  const cancelBroadcastCreation = () => {
    setSelectedContacts([]);
    setBroadcastName("");
    setIsCreatingBroadcast(false);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        selectedContacts.includes(item.id) && styles.selectedCard
      ]}
      onPress={() => isCreatingBroadcast && toggleContactSelection(item.id)}
      activeOpacity={isCreatingBroadcast ? 0.7 : 1}
    >
      <View style={styles.row}>
        {/* Selection checkbox (only shown when creating broadcast) */}
        {isCreatingBroadcast && (
          <View style={[
            styles.checkbox,
            selectedContacts.includes(item.id) && styles.checkboxSelected
          ]}>
            {selectedContacts.includes(item.id) && (
              <Image source={CHECK_ICON} style={styles.checkIcon} />
            )}
          </View>
        )}

        {/* Avatar */}
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitials}>{initials(item.name)}</Text>
          </View>
        )}

        {/* Main */}
        <View style={styles.main}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.city}</Text>
          <Text style={styles.meta}>{plural(item.visits, "visit")}</Text>
        </View>

        {/* Right column */}
        <View style={styles.right}>
          <Text style={styles.seen}>{item.lastSeen}</Text>
          {!isCreatingBroadcast && (
            <TouchableOpacity style={styles.msgBtn} activeOpacity={0.9} onPress={onPressMessage}>
              <Text style={styles.msgText}>Message</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (isCreatingBroadcast) {
            cancelBroadcastCreation();
          } else {
            navigation.goBack();
          }
        }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={BACK_ICON} style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isCreatingBroadcast ? "New Broadcast" : "New chat"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Broadcast name input (only shown when creating broadcast) */}
      {isCreatingBroadcast && (
        <View style={styles.broadcastNameContainer}>
          <TextInput
            value={broadcastName}
            onChangeText={setBroadcastName}
            placeholder="Enter broadcast name"
            placeholderTextColor="#A8B2C3"
            style={styles.broadcastNameInput}
            autoCapitalize="words"
          />
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="type a name"
          placeholderTextColor="#A8B2C3"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {/* New Broadcast button or Create button */}
      {!isCreatingBroadcast ? (
        <TouchableOpacity 
          style={styles.broadcastBtn} 
          activeOpacity={0.9}
          onPress={startBroadcastCreation}
        >
          <Text style={styles.plus}>＋</Text>
          <Text style={styles.broadcastText}>New Broadcast</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.broadcastActions}>
          <Text style={styles.selectedCount}>
            {selectedContacts.length} {selectedContacts.length === 1 ? 'contact' : 'contacts'} selected
          </Text>
          <TouchableOpacity 
            style={[
              styles.createBroadcastBtn, 
              selectedContacts.length === 0 && styles.createBroadcastBtnDisabled
            ]} 
            activeOpacity={0.9}
            onPress={createBroadcast}
            disabled={selectedContacts.length === 0}
          >
            <Text style={styles.createBroadcastText}>Create Broadcast</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Upgrade Modal */}
      <UpgradeToPremiumModal
        visible={showUpgrade}
        onUpgrade={() => {
          setShowUpgrade(false);
          // TODO: Navigate to a premium/checkout screen if available, e.g. navigation.navigate("Premium");
        }}
        onLater={() => setShowUpgrade(false)}
        onClose={() => setShowUpgrade(false)}
      />
    </SafeAreaView>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  back: { width: 22, height: 22, resizeMode: "contain" },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "#0A1220",
    fontWeight: "700",
  },

  broadcastNameContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  broadcastNameInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E6EF",
    backgroundColor: "#F7F9FD",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#0A1220",
  },

  searchWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E6EF",
    backgroundColor: "#F7F9FD",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#0A1220" },

  broadcastBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE4F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  plus: { fontSize: 20, color: "#1A57FF", marginRight: 8 },
  broadcastText: {
    fontSize: 16,
    color: "#1A57FF",
    fontWeight: "600",
  },

  broadcastActions: {
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCount: {
    fontSize: 14,
    color: "#5A6579",
    fontWeight: "500",
  },
  createBroadcastBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#1A57FF",
    alignItems: "center",
    justifyContent: "center",
  },
  createBroadcastBtnDisabled: {
    backgroundColor: "#A8B2C3",
  },
  createBroadcastText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6ECF5",
    padding: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  selectedCard: {
    backgroundColor: "#F0F7FF",
    borderColor: "#1A57FF",
  },
  row: { flexDirection: "row", alignItems: "center" },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#D9DFEA",
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#1A57FF",
    borderColor: "#1A57FF",
  },
  checkIcon: {
    width: 12,
    height: 9,
    tintColor: "#FFFFFF",
  },

  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#EEE" },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF2FF",
  },
  avatarInitials: { color: "#3B82F6", fontWeight: "700" },

  main: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, color: "#0A1220", fontWeight: "700" },
  meta: { fontSize: 13, color: "#8A94A6", marginTop: 2 },

  right: { alignItems: "flex-end" },
  seen: { fontSize: 12, color: "#8A94A6", marginBottom: 8 },
  msgBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#EDF3FF",
    borderWidth: 1,
    borderColor: "#BDD1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  msgText: { color: "#1A57FF", fontWeight: "700", fontSize: 14 },
});