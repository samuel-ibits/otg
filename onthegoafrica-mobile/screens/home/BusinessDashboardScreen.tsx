// screens/business/BusinessDashboardScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DashboardStackParamList } from '../../navigation/DashboardStack';

type Nav = StackNavigationProp<DashboardStackParamList>;

export default function BusinessDashboardScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoIcon} />
          </View>
          <Text style={styles.logoText}>ONTHEGO</Text>
          <Text style={styles.logoSubtext}>AFRICA</Text>
        </View>

        {/* Camera button -> open QR scanner */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Open QR code scanner"
          style={styles.cameraButton}
          onPress={() => navigation.navigate('QRScanner')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.cameraIcon}>
            <View style={styles.cameraTop} />
            <View style={styles.cameraLens} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>My Dashboard</Text>
          <Text style={styles.pageSubtitle}>See the summary of all gathered data on the platform</Text>
        </View>

        {/* Profile Visits Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ProfileVisits')}
          style={styles.largeCard}
        >
          <View style={styles.cardHeader}>
            <View style={styles.leftContent}>
              <Text style={styles.largeNumber}>235</Text>
              <Text style={styles.cardTitle}>Total profile visits</Text>
              <View style={styles.decreaseRow}>
                <Text style={styles.decreaseText}>↓ -5.2% decrease since last week</Text>
              </View>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartLine} />
                <View style={[styles.chartLine, { marginTop: 20 }]} />
              </View>
            </View>
          </View>
          <Text style={styles.viewAnalytics}>View Analytics</Text>
        </TouchableOpacity>

        {/* Two Column Stats */}
        <View style={styles.rowContainer}>
          {/* Gender split → CustomerInsights */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CustomerInsights')}
            style={styles.smallCard}
          >
            <Text style={styles.mediumNumber}>99</Text>
            <Text style={styles.cardTitle}>Gender split</Text>
            <View style={styles.pieChart}>
              <View style={styles.pieContainer}>
                <View style={[styles.pieSlice, styles.maleSlice]} />
                <View style={[styles.pieSlice, styles.femaleSlice]} />
                <View style={styles.pieCenter} />
              </View>
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.maleDot]} />
                <Text style={styles.legendText}>Male</Text>
                <Text style={styles.legendNumber}>50</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.femaleDot]} />
                <Text style={styles.legendText}>Female</Text>
                <Text style={styles.legendNumber}>500</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Repeat customers */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('RepeatCustomers')}
            style={styles.smallCard}
          >
            <View style={styles.cardHeaderRow}>
              <View className="leftContent" style={styles.leftContent}>
                <Text style={styles.mediumNumber}>108</Text>
                <Text style={styles.cardTitle}>Repeat customers</Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => navigation.navigate('RepeatCustomers')}
              >
                <Text style={styles.infoIcon}>ℹ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.circularProgress}>
              <View style={styles.progressRing}>
                <View style={styles.progressFill} />
                <View style={styles.progressCenter}>
                  <Text style={styles.progressNumber}>108</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* WiFi and Posts Row */}
        <View style={styles.rowContainer}>
          {/* WiFi connections */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('WiFiConnections')}
            style={styles.smallCard}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.leftContent}>
                <Text style={styles.mediumNumber}>78</Text>
                <Text style={styles.cardTitle}>No. of WIFI connections</Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => navigation.navigate('WiFiConnections')}
              >
                <Text style={styles.infoIcon}>ℹ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.barChart}>
              {Array.from({ length: 7 }).map((_, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, { height: Math.random() * 40 + 20 }]} />
                  <Text style={styles.barLabel}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* Posts */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PostsAnalytics')}
            style={styles.smallCard}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.leftContent}>
                <Text style={styles.cardTitle}>Posts</Text>
                <Text style={styles.cardSubtitle}>See how your posts are doing</Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => navigation.navigate('PostsAnalytics')}
              >
                <Text style={styles.infoIcon}>ℹ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartLine} />
                <View style={[styles.chartLine, { marginTop: 15 }]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Reviews and Vouchers Row */}
        <View style={styles.rowContainer}>
          {/* Reviews */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CafeReviews')}
            style={styles.smallCard}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.leftContent}>
                <Text style={styles.mediumNumber}>78</Text>
                <Text style={styles.cardTitle}>No. of reviews</Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => navigation.navigate('CafeReviews')}
              >
                <Text style={styles.infoIcon}>ℹ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingNumber}>4.5</Text>
              <View style={styles.starsContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Text key={index} style={styles.star}>
                    {index < 4 ? '★' : '☆'}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Vouchers */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Vouchers')}
            style={styles.smallCard}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.leftContent}>
                <Text style={styles.mediumNumber}>100</Text>
                <Text style={styles.cardTitle}>No. of vouchers</Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => navigation.navigate('Vouchers')}
              >
                <Text style={styles.infoIcon}>ℹ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.voucherChart}>
              <View style={styles.voucherProgress}>
                <View style={styles.voucherUsed} />
                <View style={styles.voucherCenter}>
                  <Text style={styles.voucherNumber}>100</Text>
                </View>
              </View>
              <View style={styles.voucherLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.usedDot]} />
                  <Text style={styles.legendText}>Used</Text>
                  <Text style={styles.legendNumber}>79</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.unusedDot]} />
                  <Text style={styles.legendText}>Unused</Text>
                  <Text style={styles.legendNumber}>21</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Customer Insight */}
        <View style={styles.insightCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.insightTitle}>Customer insight</Text>
            <TouchableOpacity
              style={styles.analyticsButton}
              onPress={() => navigation.navigate('CustomerInsights')}
            >
              <Text style={styles.viewAnalytics}>View Analytics</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {[
              ['73', 'Photography'],
              ['13', 'Swimming'],
              ['16', 'Shopping'],
              ['9', 'Travel'],
              ['22', 'Reading'],
              ['13', 'Basketball'],
              ['13', 'Gardening'],
            ].map(([n, label]) => (
              <TouchableOpacity
                key={label}
                style={styles.tag}
                onPress={() => navigation.navigate('CustomerInsights')}
                activeOpacity={0.7}
              >
                <Text style={styles.tagNumber}>{n}</Text>
                <Text style={styles.tagText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#0145FE',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 24, height: 24, marginRight: 8 },
  logoIcon: { width: 24, height: 24, backgroundColor: '#FFFFFF', borderRadius: 4 },
  logoText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'RCB-Bold', marginRight: 4 },
  logoSubtext: { color: '#FFFFFF', fontSize: 12, fontFamily: 'RCB-Regular', opacity: 0.8 },

  /* Camera button + icon */
  cameraButton: { padding: 8 },
  cameraIcon: {
    width: 24,
    height: 16,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraTop: {
    position: 'absolute',
    top: -5,
    left: 4,
    width: 10,
    height: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  cameraLens: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 },
  titleSection: { marginBottom: 24 },
  pageTitle: { fontSize: 32, fontFamily: 'RCB-Bold', color: '#2D3748', marginBottom: 8 },
  pageSubtitle: { fontSize: 16, fontFamily: 'RCB-Regular', color: '#718096', lineHeight: 22 },
  largeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, justifyContent: 'space-between' },
  leftContent: { flex: 1, minWidth: 0 },
  infoButton: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  infoIcon: { fontSize: 16, fontFamily: 'RCB-Bold', color: '#4A5568', textAlign: 'center' },
  largeNumber: { fontSize: 48, fontFamily: 'RCB-Bold', color: '#2D3748', marginBottom: 4 },
  mediumNumber: { fontSize: 32, fontFamily: 'RCB-Bold', color: '#2D3748', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontFamily: 'RCB-SemiBold', color: '#4A5568', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, fontFamily: 'RCB-Regular', color: '#718096' },
  decreaseRow: { flexDirection: 'row', alignItems: 'center' },
  decreaseText: { fontSize: 12, fontFamily: 'RCB-Regular', color: '#E53E3E' },
  chartContainer: { flex: 1, marginLeft: 20 },
  chartPlaceholder: { height: 80, position: 'relative' },
  chartLine: { height: 2, backgroundColor: '#E2E8F0', borderRadius: 1, position: 'absolute', width: '100%' },
  chartDays: { position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  dayText: { fontSize: 10, fontFamily: 'RCB-Regular', color: '#A0AEC0' },
  viewAnalytics: { fontSize: 12, fontFamily: 'RCB-SemiBold', color: '#3182CE', textDecorationLine: 'underline' },
  rowContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  smallCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pieChart: { alignItems: 'center', marginVertical: 16 },
  pieContainer: { width: 80, height: 80, borderRadius: 40, position: 'relative', overflow: 'hidden' },
  pieSlice: { position: 'absolute', width: 80, height: 80, borderRadius: 40 },
  maleSlice: { backgroundColor: '#3182CE', transform: [{ rotate: '0deg' }] },
  femaleSlice: { backgroundColor: '#E53E3E', transform: [{ rotate: '180deg' }] },
  pieCenter: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF' },
  legend: { gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  maleDot: { backgroundColor: '#3182CE' },
  femaleDot: { backgroundColor: '#E53E3E' },
  usedDot: { backgroundColor: '#3182CE' },
  unusedDot: { backgroundColor: '#CBD5E0' },
  legendText: { fontSize: 12, fontFamily: 'RCB-Regular', color: '#4A5568', flex: 1 },
  legendNumber: { fontSize: 12, fontFamily: 'RCB-SemiBold', color: '#2D3748' },
  circularProgress: { alignItems: 'center', marginTop: 16 },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#E2E8F0',
    borderTopColor: '#3182CE',
    borderRightColor: '#3182CE',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#3182CE',
    transform: [{ rotate: '45deg' }],
  },
  progressCenter: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  progressNumber: { fontSize: 18, fontFamily: 'RCB-Bold', color: '#2D3748' },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, marginTop: 16 },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { width: 12, backgroundColor: '#4A5568', borderRadius: 2, marginBottom: 4 },
  barLabel: { fontSize: 10, fontFamily: 'RCB-Regular', color: '#A0AEC0' },
  ratingContainer: { alignItems: 'center', marginTop: 16 },
  ratingNumber: { fontSize: 48, fontFamily: 'RCB-Bold', color: '#2D3748', marginBottom: 8 },
  starsContainer: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 20, color: '#F6D55C' },
  voucherChart: { alignItems: 'center', marginTop: 16 },
  voucherProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  voucherUsed: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#3182CE',
    borderRightColor: '#3182CE',
    borderBottomColor: '#3182CE',
    transform: [{ rotate: '270deg' }],
  },
  voucherCenter: { justifyContent: 'center', alignItems: 'center' },
  voucherNumber: { fontSize: 16, fontFamily: 'RCB-Bold', color: '#2D3748' },
  voucherLegend: { gap: 8 },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightTitle: { fontSize: 18, fontFamily: 'RCB-SemiBold', color: '#2D3748' },
  analyticsButton: { flexShrink: 0, marginLeft: 4, paddingLeft: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagNumber: { fontSize: 14, fontFamily: 'RCB-Bold', color: '#3182CE' },
  tagText: { fontSize: 14, fontFamily: 'RCB-Regular', color: '#4A5568' },
});
