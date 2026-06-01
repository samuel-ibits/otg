import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

type Props = {
  onBack?: () => void;
  onContinue?: () => void;
  onEnableLocation?: () => void;
  isLocationEnabled?: boolean;
};

export default function LocationEnableScreen({
  onBack,
  onContinue,
  onEnableLocation,
  isLocationEnabled = true,
}: Props) {
  const handleContinue = () => {
    onContinue?.();
  };

  const handleEnableLocation = () => {
    onEnableLocation?.();
  };

  if (!isLocationEnabled) {
    // Location not enabled state
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.locationIcon}>
                <Image
                  source={require('../../assets/icons/cross.png')}
                  style={styles.locationPinIcon}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={styles.titleDisabled}>Location not enabled</Text>
            <Text style={styles.subtitleDisabled}>
              Some features would not be available without your location
            </Text>
          </View>

          <TouchableOpacity
            style={styles.enableBtn}
            onPress={handleEnableLocation}
            activeOpacity={0.9}
          >
            <Text style={styles.enableBtnText}>Enable location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Location enabled state
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.locationIcon}>
              <Image
                source={require('../../assets/icons/location-pin.png')}
                style={styles.locationPinIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.title}>Enable Locations</Text>
          <Text style={styles.subtitle}>
            You need to turn on "Location" to use OTG. This allows us find places you can get free WiFi On the go!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#0145FE';
const TEXT = '#0A1220';
const MUTED = '#6C7A92';
const RED = '#FF3B30';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: TEXT,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 100,
  },

  iconContainer: {
    marginBottom: 40,
  },
  locationIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  locationPinIcon: {
    width: 40,
    height: 40,
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
    color: TEXT,
    fontFamily: 'RCB-Bold',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleDisabled: {
    fontSize: 24,
    lineHeight: 32,
    color: TEXT,
    fontFamily: 'RCB-Bold',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    fontFamily: 'RCB-Regular',
    textAlign: 'center',
    maxWidth: 300,
  },
  subtitleDisabled: {
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    fontFamily: 'RCB-Regular',
    textAlign: 'center',
    maxWidth: 280,
  },

  continueBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
    fontWeight: '600',
  },

  enableBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  enableBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
    fontWeight: '600',
  },
});