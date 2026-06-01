// screens/WiFiConnectionsScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

const BACK_ICON = require("../../assets/icons/back.png");

export default function WiFiConnectionsScreen({navigation}) {
  const [selectedPeriod, setSelectedPeriod] = useState('This week');

  const wifiData = [
    { day: 'Mon', value: 38, height: 60 },
    { day: 'Tue', value: 75, height: 120 },
    { day: 'Wed', value: 15, height: 24 },
    { day: 'Thu', value: 52, height: 84 },
    { day: 'Fri', value: 63, height: 100 },
    { day: 'Sat', value: 25, height: 40 },
    { day: 'Sun', value: 26, height: 42 },
  ];

  const people = [
    { id: 1, name: 'Jane Doe', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 2, name: 'Tommy Gbese', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 3, name: 'Dan Nithingale', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago', initials: 'DN' },
    { id: 4, name: 'Mariam Bolade', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 5, name: 'Adeola Bukola', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 6, name: 'Susan Obinna', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 7, name: 'Ada Sike', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
  ];

  const renderBarChart = () => {
    const maxValue = Math.max(...wifiData.map(item => item.value));
    const chartHeight = 160;

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>No. of connections</Text>
        <View style={styles.chartContainer}>
          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.yAxisLabel}>120</Text>
            <Text style={styles.yAxisLabel}>100</Text>
            <Text style={styles.yAxisLabel}>80</Text>
            <Text style={styles.yAxisLabel}>60</Text>
            <Text style={styles.yAxisLabel}>40</Text>
            <Text style={styles.yAxisLabel}>20</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>
          
          {/* Chart area */}
          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {wifiData.map((item, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (item.value / maxValue) * (chartHeight - 40),
                        backgroundColor: '#333333'
                      }
                    ]} 
                  />
                  <Text style={styles.dayLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
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
        <Text style={styles.headerTitle}>WiFi connections</Text>
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

        {/* WiFi Connections Chart */}
        {renderBarChart()}

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
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 180,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginRight: 12,
    height: 160,
  },
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    width: 30,
  },
  chartArea: {
    flex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    backgroundColor: '#333333',
    width: 24,
    borderRadius: 2,
    marginBottom: 8,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
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
    color: '#999999',
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