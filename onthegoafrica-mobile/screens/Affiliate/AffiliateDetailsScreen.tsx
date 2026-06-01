// screens/affiliate/AffiliateDetailsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';

const BACK = require('../../assets/icons/back.png'); // PNG back icon

const { height } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.round(height * 0.45);

type Partner = {
  name: string;
  category?: string;
  description?: string;
  logo?: string;         // uri
  discount?: string;     // e.g., "10% Off"
  discountCode: string;  // code to render as QR
};

const AffiliateDetailsScreen = ({ route }: { route: { params: { partner: Partner } } }) => {
  const { partner } = route.params;
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      {/* Top Image */}
      <Image
        source={partner.logo ? { uri: partner.logo } : require('../../assets/feed/user1.png')}
        style={s.topImage}
      />

      {/* Back button on image */}
      <SafeAreaView style={s.header}>
        <TouchableOpacity
          style={s.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={BACK} style={s.backIcon} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Sheet Content */}
      <View style={s.sheet}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.name}>{partner.name}</Text>
          {!!partner.category && <Text style={s.category}>{partner.category}</Text>}
          {!!partner.description && <Text style={s.description}>{partner.description}</Text>}

          <View style={s.qrCard}>
            <Text style={s.codeLabel}>
              Your {partner.discount ?? 'Discount'} Code
            </Text>
            <Text style={s.code}>{partner.discountCode}</Text>
            <View style={s.qrBox}>
              <QRCode value={partner.discountCode} size={160} />
            </View>
            <Text style={s.scanNote}>
              Show or scan this at the business to get your discount.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topImage: { width: '100%', height: IMAGE_HEIGHT, resizeMode: 'cover' },
  header: {
    position: 'absolute',
    top: Platform.select({ ios: 48, android: 24 }),
    left: 16,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 10,
  },
  backIcon: { width: 20, height: 20, tintColor: '#0F172A' },

  sheet: {
    position: 'absolute',
    top: IMAGE_HEIGHT - 30,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 30,
    // Android shadow
    elevation: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
  },
  scroll: { paddingBottom: 50 },

  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 },
  category: { fontSize: 13, color: '#0145FE', fontWeight: '600', marginBottom: 10 },
  description: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 20,
  },

  qrCard: {
    width: '100%',
    backgroundColor: '#F5F7FA',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  codeLabel: { fontSize: 16, color: '#0A1220', fontWeight: '600', marginBottom: 6 },
  code: { fontSize: 22, color: '#0145FE', fontWeight: '700', marginBottom: 16 },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  scanNote: {
    marginTop: 14,
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
});

export default AffiliateDetailsScreen;
