// screens/loyalty/RewardsMarketplaceScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";

const BACK_ICON = require("../../assets/icons/back.png");
const GALLERY_ICON = require("../../assets/icons/gallery.png");
const SEARCH_ICON = require("../../assets/icons/search.png");
const INTERIOR_ICON = require("../../assets/icons/interior.png");
const FOOD_ICON = require("../../assets/icons/food.png");
const FASHION_ICON = require("../../assets/icons/fashion.png");
const TICKET_ICON = require("../../assets/icons/fashion.png");
const BRAND_AVATAR = require("../../assets/icons/cafe.jpeg");

type Category = "Interior" | "Food & Drinks" | "Fashion" | "Tickets";

type MarketplaceReward = {
  id: string;
  percent: number;
  brand: string;
  validDays: string;
  category: Category;
  available: boolean;
};

const MARKETPLACE_REWARDS: MarketplaceReward[] = [
  {
    id: "mp-1",
    percent: 10,
    brand: "Hayes - Block",
    validDays: "Mondays, Wednesdays, Fridays",
    category: "Interior",
    available: true,
  },
  {
    id: "mp-2",
    percent: 10,
    brand: "Nolan and Sons",
    validDays: "Mondays, Wednesdays, Fridays",
    category: "Food & Drinks",
    available: true,
  },
  {
    id: "mp-3",
    percent: 10,
    brand: "Becker - Littel",
    validDays: "Mondays, Wednesdays, Fridays",
    category: "Fashion",
    available: true,
  },
  {
    id: "mp-4",
    percent: 10,
    brand: "Becker - Littel",
    validDays: "Mondays, Wednesdays, Fridays",
    category: "Interior",
    available: true,
  },
  {
    id: "mp-5",
    percent: 15,
    brand: "Hudson Group",
    validDays: "Weekdays only",
    category: "Food & Drinks",
    available: true,
  },
  {
    id: "mp-6",
    percent: 20,
    brand: "Queen's Place",
    validDays: "Daily",
    category: "Fashion",
    available: true,
  },
  {
    id: "mp-7",
    percent: 15,
    brand: "Cinema Plus",
    validDays: "Weekends only",
    category: "Tickets",
    available: true,
  },
  {
    id: "mp-8",
    percent: 25,
    brand: "Concert Hall",
    validDays: "Daily",
    category: "Tickets",
    available: true,
  },
  {
    id: "mp-9",
    percent: 10,
    brand: "Sports Arena",
    validDays: "Match days",
    category: "Tickets",
    available: true,
  },
];

const CATEGORIES: { name: Category; icon: any }[] = [
  { name: "Interior", icon: INTERIOR_ICON },
  { name: "Food & Drinks", icon: FOOD_ICON },
  { name: "Fashion", icon: FASHION_ICON },
  { name: "Tickets", icon: TICKET_ICON },
];

export default function RewardsMarketplaceScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredRewards = useMemo(() => {
    let filtered = MARKETPLACE_REWARDS;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((reward) =>
        reward.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((reward) => reward.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleRequestExchange = (reward: MarketplaceReward) => {
    if (reward.category === "Tickets") {
      // Navigate to ticket purchase screen
      console.log("Buy ticket for:", reward);
      navigation.navigate("BuyTicket", { ticket: reward });
    } else {
      // Navigate to exchange confirmation or handle exchange request
      console.log("Request exchange for:", reward);
      navigation.navigate("Exchange", { targetReward: reward });
    }
  };

  const handleTrends = () => {
    // Navigate to trends screen without needing a specific reward
    console.log("Navigate to trends");
    navigation.navigate("Trend");
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={BACK_ICON} style={s.backIcon} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Rewards marketplace</Text>
        <TouchableOpacity
          onPress={handleTrends}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={GALLERY_ICON} style={s.galleryIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={s.headerContent}>
            {/* Search Bar */}
            <View style={s.searchContainer}>
              <Image source={SEARCH_ICON} style={s.searchIcon} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
                placeholderTextColor="#8CA0BE"
                style={s.searchInput}
              />
            </View>

            {/* Quick Search Categories */}
            <Text style={s.sectionTitle}>Quick search</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.categoriesContainer}
              contentContainerStyle={s.categoriesContent}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    s.categoryButton,
                    selectedCategory === category.name && s.categoryButtonActive,
                  ]}
                  onPress={() => handleCategoryPress(category.name)}
                >
                  <Image
                    source={category.icon}
                    style={[
                      s.categoryIcon,
                      selectedCategory === category.name && s.categoryIconActive,
                    ]}
                  />
                  <Text
                    style={[
                      s.categoryText,
                      selectedCategory === category.name && s.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        data={filteredRewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MarketplaceRewardCard
            reward={item}
            onRequestExchange={() => handleRequestExchange(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={s.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Text style={s.emptyText}>No rewards found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function MarketplaceRewardCard({
  reward,
  onRequestExchange,
}: {
  reward: MarketplaceReward;
  onRequestExchange: () => void;
}) {
  const isTicket = reward.category === "Tickets";
  
  return (
    <View style={s.rewardCard}>
      <View style={s.cardHeader}>
        <Text style={s.percentText}>{reward.percent}% OFF</Text>
        <TouchableOpacity
          style={[s.requestButton, isTicket && s.buyButton]}
          onPress={onRequestExchange}
          activeOpacity={0.8}
        >
          <Text style={s.requestButtonText}>
            {isTicket ? "Buy ticket" : "Request exchange"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.brandContainer}>
        <View style={s.brandInfo}>
          <Image source={BRAND_AVATAR} style={s.brandImage} />
          <Text style={s.brandName} numberOfLines={1}>
            {reward.brand}
          </Text>
        </View>
      </View>

      <View style={s.divider} />
      <Text style={s.validityText}>Validity - {reward.validDays}</Text>
    </View>
  );
}

const TEXT = "#0A1220";
const SUB = "#6B7C97";
const BLUE = "#0A59FF";
const BORDER = "#D6E1FF";
const CARD_BG = "#F3F6FF";

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 52,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7EAF3",
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: TEXT,
    resizeMode: "contain",
  },
  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  galleryIcon: {
    width: 22,
    height: 22,
    tintColor: TEXT,
    resizeMode: "contain",
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#DFE7F3",
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 24,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: SUB,
    marginRight: 12,
    resizeMode: "contain",
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    backgroundColor: BLUE,
  },
  categoryIcon: {
    width: 16,
    height: 16,
    tintColor: SUB,
    marginRight: 6,
    resizeMode: "contain",
  },
  categoryIconActive: {
    tintColor: "#FFFFFF",
  },
  categoryText: {
    color: SUB,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  rewardCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  percentText: {
    color: BLUE,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  requestButton: {
    backgroundColor: "#0E1730",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  buyButton: {
    backgroundColor: BLUE,
  },
  requestButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  brandContainer: {
    backgroundColor: "#EAF0FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFD0FF",
    padding: 12,
    marginBottom: 12,
  },
  brandInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  brandName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  divider: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#BFD0FF",
    marginBottom: 8,
    borderRadius: 1,
  },
  validityText: {
    color: SUB,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: SUB,
    fontSize: 16,
  },
});