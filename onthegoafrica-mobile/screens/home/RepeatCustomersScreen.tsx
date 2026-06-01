// screens/RepeatCustomersScreen.tsx
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
import Svg, { Circle } from 'react-native-svg';

const BACK_ICON = require("../../assets/icons/back.png");

export default function RepeatCustomersScreen({navigation}) {
  const [selectedPeriod, setSelectedPeriod] = useState('This week');

  const people = [
    { id: 1, name: 'Jane Doe', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 2, name: 'Tommy Gbese', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 3, name: 'Dan Nithingale', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago', initials: 'DN' },
    { id: 4, name: 'Mariam Bolade', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 5, name: 'Adeola Bukola', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 6, name: 'Susan Obinna', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
    { id: 7, name: 'Ada Sike', location: 'Ikeja, Lagos', avatar: null, time: '2 mins ago' },
  ];

  const CircularProgress = () => {
    const size = 200;
    const strokeWidth = 16;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    
    // Different progress values for multiple rings
    const progress1 = 0.75; // 75%
    const progress2 = 0.60; // 60%
    const progress3 = 0.45; // 45%
    
    const strokeDasharray1 = `${circumference * progress1} ${circumference}`;
    const strokeDasharray2 = `${circumference * progress2} ${circumference}`;
    const strokeDasharray3 = `${circumference * progress3} ${circumference}`;

    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size} style={styles.progressSvg}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#F0F0F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Outer ring - darkest blue */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#2E5BBA"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray1}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          
          {/* Middle ring - medium blue */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 20}
            stroke="#4A7BC8"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray2}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          
          {/* Inner ring - lightest blue */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 40}
            stroke="#87CEEB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray3}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
        </Svg>
        
        <View style={styles.progressCenter}>
          <Text style={styles.progressNumber}>108</Text>
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
        <Text style={styles.headerTitle}>Repeat customers</Text>
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

        {/* Circular Progress Chart */}
        <View style={styles.chartSection}>
          <CircularProgress />
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
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
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
  chartSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  progressCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
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