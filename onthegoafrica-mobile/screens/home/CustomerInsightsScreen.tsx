// screens/CustomerInsightsScreen.tsx
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

export default function CustomerInsightsScreen({navigation}) {
  const [selectedHobby, setSelectedHobby] = useState('Photography');

  const hobbies = [
    'Photography',
    'Swimming', 
    'Shopping',
    'Travel',
    'Reading',
    'Basketball',
    'Gardening',
    'Music',
    'Cooking',
    'Fitness'
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
        <Text style={styles.headerTitle}>Customer insights</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>See your customers hobby</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedHobby}</Text>
            <Text style={styles.dropdownArrow}>⌄</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  filterLabel: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 16,
    lineHeight: 22,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#666666',
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
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});