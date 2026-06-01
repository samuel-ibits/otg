// screens/affiliate/AffiliateListScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// PNG back icon. Replace path if yours differs.
const BACK_PNG = require('../../assets/icons/arrow-right.png');

const placeholderPartners = [
  {
    id: '1',
    name: 'OTG',
    description: 'OTG business.',
    logo: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    discountCode: 'OTG20-JOE',
    category: 'Teche',
    discount: '20%',
    rating: 4.8,
    reviews: 1250,
    validUntil: '2024-12-31',
    featured: true,
  },
  {
    id: '2',
    name: '03 Capital',
    description: '03 Capital.',
    logo: 'https://res.cloudinary.com/doefjylyu/image/upload/v1758207081/WhatsApp_Image_2025-09-17_at_9.46.56_pm_qzmncf.jpg',
    discountCode: '03-Captial-JOE',
    category: 'Teche',
    discount: '20%',
    rating: 3.8,
    reviews: 150,
    validUntil: '2024-12-31',
    featured: true,
  },
];

const AffiliateListScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, item.featured && styles.featuredCard]}
      onPress={() => navigation.navigate('AffilDetails' as never, { partner: item } as never)}
      activeOpacity={0.9}
    >
      <View style={styles.cardTop}>
        <View style={styles.logoSection}>
          <Image source={{ uri: item.logo }} style={styles.logo} />
          <View style={styles.badgeOverlay}>
            <Text style={styles.badgeText}>{item.discount}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>{'★'.repeat(Math.floor(item.rating))}</Text>
            <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
          </View>

          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Code:</Text>
            <Text style={styles.codeValue}>{item.discountCode}</Text>
          </View>

          {/* <Text style={styles.validity}>
            Valid until {new Date(item.validUntil).toLocaleDateString()}
          </Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {/* Rotate right-arrow to point left */}
            <Image source={BACK_PNG} style={{ width: 20, height: 20, tintColor: '#E5EDFF', transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Partner Offers</Text>
            <Text style={styles.headerSubtitle}>Exclusive deals for you</Text>
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={placeholderPartners}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const BLUE = '#0145FE';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F6F8FC';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  headerContainer: {
    backgroundColor: BLUE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16, // SIZES.medium
    paddingVertical: 20,   // SIZES.large
    paddingTop: Platform.OS === 'ios' ? 12 : 20, // iOS/Android tune
  },
  backButton: {
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20, // extraLarge
    fontWeight: '700', // BOLD
    color: WHITE,
  },
  headerSubtitle: {
    fontSize: 14, // medium
    fontWeight: '400', // REGULAR
    color: 'rgba(255,255,255,0.85)',
  },
  listContainer: { padding: 16 },

  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  cardTop: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    alignItems: 'flex-start',
  },
  logoSection: {
    position: 'relative',
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  logo: { width: '100%', height: '100%', borderRadius: 10 },
  badgeOverlay: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    backgroundColor: BLUE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 10,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  infoSection: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: BLUE,
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  description: { fontSize: 13, color: '#333', marginVertical: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingStars: { fontSize: 14, color: '#FFD700', marginRight: 4 },
  ratingText: { fontSize: 12, color: '#444', fontWeight: '500' },

  codeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  codeLabel: { fontSize: 13, color: '#222', marginRight: 6, fontWeight: '600' },
  codeValue: { fontSize: 13, color: BLUE, fontWeight: '700' },

  validity: { fontSize: 12, color: '#666', marginTop: 4 },
});

export default AffiliateListScreen;
