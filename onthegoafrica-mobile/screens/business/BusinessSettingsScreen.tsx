// screens/business/BusinessSettingsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';

export default function BusinessSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoReply, setAutoReply] = React.useState(false);
  const [publicProfile, setPublicProfile] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your business preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Profile</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Edit Business Details</Text>
              <Text style={styles.settingDescription}>Update name, address, contact info</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Business Hours</Text>
              <Text style={styles.settingDescription}>Set opening and closing times</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Photos & Media</Text>
              <Text style={styles.settingDescription}>Manage business photos and videos</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Public Profile</Text>
              <Text style={styles.settingDescription}>Make your business discoverable</Text>
            </View>
            <Switch
              value={publicProfile}
              onValueChange={setPublicProfile}
              trackColor={{ false: '#E8EEF7', true: '#0145FE' }}
              thumbColor={publicProfile ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get notified about reviews and messages</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E8EEF7', true: '#0145FE' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Email Preferences</Text>
              <Text style={styles.settingDescription}>Configure email notifications</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Interaction</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-Reply Messages</Text>
              <Text style={styles.settingDescription}>Automatically respond to common questions</Text>
            </View>
            <Switch
              value={autoReply}
              onValueChange={setAutoReply}
              trackColor={{ false: '#E8EEF7', true: '#0145FE' }}
              thumbColor={autoReply ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Review Management</Text>
              <Text style={styles.settingDescription}>Set up review response templates</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Customer Support</Text>
              <Text style={styles.settingDescription}>Configure support channels</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>View our privacy policy</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Text style={styles.settingDescription}>Read terms and conditions</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get help with your account</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, styles.dangerText]}>Sign Out</Text>
              <Text style={[styles.settingDescription, styles.dangerDescription]}>Sign out of your business account</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F5F8FE',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8EEF7',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
  },
  chevron: {
    fontSize: 20,
    color: '#9AA6BD',
    fontFamily: 'RCB-Regular',
  },
  dangerItem: {
    backgroundColor: '#FEF5F5',
    borderColor: '#FECACA',
  },
  dangerText: {
    color: '#DC2626',
  },
  dangerDescription: {
    color: '#DC2626',
    opacity: 0.8,
  },
});