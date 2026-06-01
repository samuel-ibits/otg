// screens/ProfileVisitsScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const BACK_ICON = require("../../assets/icons/back.png");

export default function ProfileVisitsScreen({navigation}) {
  const [selectedPeriod, setSelectedPeriod] = useState('This week');

  const profileClicksData = [
    { time: '17:24', value: 20 },
    { time: '09:00', value: 40 },
    { time: '10:00', value: 8 },
    { time: '11:00', value: 28 },
    { time: '12:00', value: 35 },
    { time: '13:00', value: 15 },
  ];

  const storeVisitsData = [
    { time: '14:00', value: 45 },
    { time: '15:00', value: 28 },
    { time: '16:00', value: 15 },
    { time: '17:00', value: 25 },
    { time: '18:00', value: 8 },
    { time: '19:00', value: 15 },
  ];

  const people = [
    { id: 1, name: 'Jane Doe', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 2, name: 'Tommy Gbese', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 3, name: 'Dan Nithingale', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago', initials: 'DN' },
    { id: 4, name: 'Mariam Bolade', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 5, name: 'Adeola Bukola', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 6, name: 'Susan Obinna', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
  ];

  const renderBarChart = (data, maxValue = 60) => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>60k</Text>
          <Text style={styles.yAxisLabel}>50k</Text>
          <Text style={styles.yAxisLabel}>40k</Text>
          <Text style={styles.yAxisLabel}>30k</Text>
          <Text style={styles.yAxisLabel}>20k</Text>
          <Text style={styles.yAxisLabel}>10k</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>
        <View style={styles.chartArea}>
          <View style={styles.barsContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: (item.value / maxValue) * 120 }
                  ]} 
                />
                <Text style={styles.timeLabel}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
               <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={BACK_ICON} style={styles.backIcon} />
        </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Visits</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['This week', 'This month', 'Custom'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
                period === 'Custom' && styles.customButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              {period === 'Custom' && <Text style={styles.calendarIcon}>📅</Text>}
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                  period === 'Custom' && styles.customButtonText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Stat */}
        <View style={styles.searchStat}>
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </View>
          <Text style={styles.searchText}>You appeared in 25 searches this week</Text>
        </View>

        {/* Profile Clicks Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Profile clicks</Text>
            <View style={styles.statContainer}>
              <Text style={styles.statNumber}>456</Text>
              <Text style={styles.statChange}>+47%</Text>
            </View>
          </View>
          {renderBarChart(profileClicksData)}
        </View>

        {/* Store Visits Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Store visits</Text>
            <View style={styles.statContainer}>
              <Text style={styles.statNumber}>380</Text>
              <Text style={styles.statChangePositive}>+32%</Text>
            </View>
          </View>
          {renderBarChart(storeVisitsData)}
        </View>

        {/* People Section */}
        <View style={styles.peopleSection}>
          <Text style={styles.sectionTitle}>People</Text>
          {people.map((person) => (
            <View key={person.id} style={styles.personItem}>
              <View style={styles.personInfo}>
                <View style={styles.avatarContainer}>
                  {person.initials ? (
                    <View style={styles.initialsAvatar}>
                      <Text style={styles.initialsText}>{person.initials}</Text>
                    </View>
                  ) : (
                    <View style={styles.avatar} />
                  )}
                </View>
                <View style={styles.personDetails}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personLocation}>{person.location}</Text>
                </View>
              </View>
              <View style={styles.personActions}>
                <Text style={styles.timeText}>{person.time}</Text>
                <TouchableOpacity style={styles.messageButton}>
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 20,
    color: '#000000',
  },
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 24,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  customButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  customButtonText: {
    color: '#666666',
  },
  calendarIcon: {
    fontSize: 14,
  },
  searchStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconText: {
    fontSize: 16,
  },
  searchText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 40,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  statChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  statChangePositive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 160,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginRight: 12,
    height: 140,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    backgroundColor: '#007AFF',
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
  },
  peopleSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  personItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  initialsAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  personLocation: {
    fontSize: 14,
    color: '#666666',
  },
  personActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#999999',
  },
  messageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 4,
  },
  messageButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});