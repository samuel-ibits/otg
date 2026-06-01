// screens/business/BusinessAnalyticsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function BusinessAnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your business performance</Text>
        </View>

        <View style={styles.timeFilter}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>30 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>90 Days</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartTitle}>Profile Views</Text>
          <View style={styles.chartArea}>
            <Text style={styles.chartPlaceholderText}>Chart visualization would go here</Text>
            <Text style={styles.chartNumber}>+23%</Text>
            <Text style={styles.chartSubtext}>vs last period</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>342</Text>
            <Text style={styles.metricLabel}>Total Visits</Text>
            <Text style={styles.metricChange}>+12%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>28</Text>
            <Text style={styles.metricLabel}>New Reviews</Text>
            <Text style={styles.metricChange}>+5%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>4.7</Text>
            <Text style={styles.metricLabel}>Avg Rating</Text>
            <Text style={styles.metricChange}>+0.2</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>156</Text>
            <Text style={styles.metricLabel}>Bookmarks</Text>
            <Text style={styles.metricChange}>+8%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Content</Text>
          <View style={styles.contentItem}>
            <Text style={styles.contentTitle}>Business Photos</Text>
            <Text style={styles.contentStats}>89 views • 12 likes</Text>
          </View>
          <View style={styles.contentItem}>
            <Text style={styles.contentTitle}>Menu Updates</Text>
            <Text style={styles.contentStats}>67 views • 8 likes</Text>
          </View>
          <View style={styles.contentItem}>
            <Text style={styles.contentTitle}>Special Offers</Text>
            <Text style={styles.contentStats}>45 views • 15 likes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'RCB-Bold',
    color: '#0A1220',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
  },
  timeFilter: {
    flexDirection: 'row',
    backgroundColor: '#F5F8FE',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#0145FE',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'RCB-SemiBold',
    color: '#6C7A92',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  chartPlaceholder: {
    backgroundColor: '#F5F8FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8EEF7',
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    marginBottom: 16,
  },
  chartArea: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
    marginBottom: 8,
  },
  chartNumber: {
    fontSize: 24,
    fontFamily: 'RCB-Bold',
    color: '#16A34A',
  },
  chartSubtext: {
    fontSize: 12,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F5F8FE',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EEF7',
  },
  metricNumber: {
    fontSize: 24,
    fontFamily: 'RCB-Bold',
    color: '#0145FE',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontFamily: 'RCB-SemiBold',
    color: '#16A34A',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    marginBottom: 16,
  },
  contentItem: {
    backgroundColor: '#EEF2F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    marginBottom: 4,
  },
  contentStats: {
    fontSize: 14,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
  },
});