// screens/loyalty/TrendsScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const BACK_ICON = require("../../assets/icons/back.png");
const DOWN_ARROW = require("../../assets/icons/down-arrow.png");

/**
 * We now use placeholder avatars from ui-avatars.com for all company logos.
 * Nothing is read from the local /assets/brands folder anymore.
 * Example builder returns a rounded PNG for a brand name.
 */
const avatar = (name: string) =>
  ({
    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=E2E8F0&color=111827&size=96&rounded=true`,
  } as const);

type FilterType = "Most traded" | "Most used" | "Least used";
type TrendDirection = "up" | "down" | "neutral";

type BrandTrend = {
  id: string;
  name: string;
  location: string;
  logo: { uri: string };
  volume: number;
  changePercent: number;
  direction: TrendDirection;
  chartData: number[];
};

type TopTraded = {
  brand: string;
  logo: { uri: string };
  chartData: number[];
};

const TOP_TRADED: TopTraded = {
  brand: "Hayes - Block",
  logo: avatar("Hayes - Block"),
  chartData: [20, 35, 25, 40, 30, 45, 35, 50, 40, 45, 35, 40],
};

const BRAND_TRENDS: BrandTrend[] = [
  {
    id: "1",
    name: "Zorkle",
    location: "Lekki, Lagos",
    logo: avatar("Zorkle"),
    volume: 561,
    changePercent: 2.35,
    direction: "up",
    chartData: [20, 25, 30, 28, 35, 40, 45],
  },
  {
    id: "2",
    name: "Esorae",
    location: "Mattress & Beddings",
    logo: avatar("Esorae"),
    volume: 319,
    changePercent: -5.8,
    direction: "down",
    chartData: [45, 40, 35, 30, 25, 20, 15],
  },
  {
    id: "3",
    name: "IFITNESS",
    location: "Lagos, State",
    logo: avatar("IFITNESS"),
    volume: 291,
    changePercent: -1.52,
    direction: "down",
    chartData: [35, 32, 28, 25, 22, 20, 18],
  },
  {
    id: "4",
    name: "Cafe one",
    location: "Chevron, Lekki",
    logo: avatar("Cafe one"),
    volume: 206,
    changePercent: 8.4,
    direction: "up",
    chartData: [15, 18, 22, 25, 28, 32, 35],
  },
  {
    id: "5",
    name: "SBUX",
    location: "Starbucks",
    logo: avatar("SBUX"),
    volume: 206,
    changePercent: 8.4,
    direction: "up",
    chartData: [18, 20, 25, 28, 30, 33, 35],
  },
  {
    id: "6",
    name: "SBUX",
    location: "Starbucks",
    logo: avatar("SBUX"),
    volume: 206,
    changePercent: 8.4,
    direction: "up",
    chartData: [16, 19, 23, 26, 29, 31, 34],
  },
];

const FILTERS: FilterType[] = ["Most traded", "Most used", "Least used"];

export default function TrendsScreen({ navigation }: any) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("Most traded");
  const [timeFilter] = useState("This week");

  const getSortedBrands = () => {
    const sorted = [...BRAND_TRENDS];
    switch (selectedFilter) {
      case "Most traded":
      case "Most used":
        return sorted.sort((a, b) => b.volume - a.volume);
      case "Least used":
        return sorted.sort((a, b) => a.volume - b.volume);
      default:
        return sorted;
    }
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
        <Text style={s.headerTitle}>Trends</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top traded */}
        <View style={s.topSection}>
          <View style={s.topHeader}>
            <View>
              <Text style={s.topTitle}>Top traded reward voucher</Text>
              <View style={s.brandRow}>
                <Image source={TOP_TRADED.logo} style={s.topBrandLogo} />
                <Text style={s.topBrandName}>{TOP_TRADED.brand}</Text>
              </View>
            </View>
            <View style={s.timeFilter}>
              <Text style={s.timeFilterText}>{timeFilter}</Text>
              <Image source={DOWN_ARROW} style={s.dropdownIcon} />
            </View>
          </View>

          <View style={s.chartContainer}>
            <MiniChart data={TOP_TRADED.chartData} color="#4F8EFF" />
          </View>
        </View>

        {/* Filters */}
        <View style={s.filtersContainer}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.filterButton, selectedFilter === f && s.filterButtonActive]}
              onPress={() => setSelectedFilter(f)}
            >
              <Text style={[s.filterText, selectedFilter === f && s.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <View style={s.listContainer}>
          <View style={s.listHeader}>
            <Text style={s.listTitle}>Top traded</Text>
            <TouchableOpacity>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {getSortedBrands().map((brand) => (
            <BrandTrendItem key={brand.id} brand={brand} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BrandTrendItem({ brand }: { brand: BrandTrend }) {
  const isPositive = brand.direction === "up";
  const changeColor = isPositive ? "#22C55E" : "#EF4444";
  const chartColor = isPositive ? "#22C55E" : "#EF4444";

  return (
    <View style={s.brandItem}>
      <View style={s.brandInfo}>
        <Image source={brand.logo} style={s.brandLogo} />
        <View style={s.brandDetails}>
          <Text style={s.brandName}>{brand.name}</Text>
          <Text style={s.brandLocation}>{brand.location}</Text>
        </View>
      </View>

      <View style={s.brandStats}>
        <View style={s.chartWrapper}>
          <MiniChart data={brand.chartData} color={chartColor} />
        </View>
        <View style={s.statsNumbers}>
          <Text style={s.volume}>{brand.volume}</Text>
          <Text style={[s.change, { color: changeColor }]}>
            {isPositive ? "▲" : "▼"} {Math.abs(brand.changePercent)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = Math.max(1, maxValue - minValue);

  const chartWidth = 60;
  const chartHeight = 30;
  const pointWidth = chartWidth / (data.length - 1);

  return (
    <View style={[s.miniChart, { width: chartWidth, height: chartHeight }]}>
      {data.map((v, i) => {
        const x = i * pointWidth;
        const y = chartHeight - ((v - minValue) / range) * chartHeight;
        return (
          <View key={i} style={[s.chartDot, { left: x - 1, top: y - 1, backgroundColor: color }]} />
        );
      })}
      {data.slice(0, -1).map((v, i) => {
        const x1 = i * pointWidth;
        const y1 = chartHeight - ((v - minValue) / range) * chartHeight;
        const x2 = (i + 1) * pointWidth;
        const y2 = chartHeight - ((data[i + 1] - minValue) / range) * chartHeight;
        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        return (
          <View
            key={`line-${i}`}
            style={[
              s.chartLine,
              { left: x1, top: y1, width: length, backgroundColor: color, transform: [{ rotate: `${angle}deg` }] },
            ]}
          />
        );
      })}
    </View>
  );
}

const TEXT = "#0A1220";
const SUB = "#6B7C97";
const BLUE = "#0A59FF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
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
  backIcon: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  headerTitle: { color: TEXT, fontSize: 18, fontWeight: "600" },

  topSection: { backgroundColor: "#E8F0FF", margin: 16, borderRadius: 16, padding: 16 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  topTitle: { color: TEXT, fontSize: 14, fontWeight: "600", marginBottom: 8 },
  brandRow: { flexDirection: "row", alignItems: "center" },
  topBrandLogo: { width: 20, height: 20, borderRadius: 10, marginRight: 8 },
  topBrandName: { color: TEXT, fontSize: 16, fontWeight: "700" },
  timeFilter: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  timeFilterText: { color: TEXT, fontSize: 12, fontWeight: "600", marginRight: 4 },
  dropdownIcon: { width: 12,  tintColor: TEXT },

  chartContainer: { height: 80, justifyContent: "center", alignItems: "center" },

  filtersContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 24 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F1F5F9", marginRight: 12 },
  filterButtonActive: { backgroundColor: TEXT },
  filterText: { color: SUB, fontSize: 14, fontWeight: "600" },
  filterTextActive: { color: "#FFFFFF" },

  listContainer: { paddingHorizontal: 16 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  listTitle: { color: TEXT, fontSize: 18, fontWeight: "700" },
  viewAll: { color: BLUE, fontSize: 14, fontWeight: "600" },

  brandItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#F1F5F9" },
  brandInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  brandLogo: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  brandDetails: { flex: 1 },
  brandName: { color: TEXT, fontSize: 16, fontWeight: "700", marginBottom: 2 },
  brandLocation: { color: SUB, fontSize: 12, fontWeight: "500" },

  brandStats: { flexDirection: "row", alignItems: "center" },
  chartWrapper: { marginRight: 16 },
  miniChart: { position: "relative" },
  chartDot: { position: "absolute", width: 2, height: 2, borderRadius: 1 },
  chartLine: { position: "absolute", height: 1, transformOrigin: "left center" },
  statsNumbers: { alignItems: "flex-end" },
  volume: { color: TEXT, fontSize: 16, fontWeight: "700", marginBottom: 2 },
  change: { fontSize: 12, fontWeight: "600" },
});
