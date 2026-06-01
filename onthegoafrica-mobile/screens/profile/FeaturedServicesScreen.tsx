// screens/business/FeaturedServicesScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { filterBranchProducts } from '../../api/api';

type Service = { id: string; title: string; price: string; photo: string; name?: string };

const BACK_PNG = require('../../assets/icons/arrow-right.png');

const FALLBACK_SERVICES: Service[] = [];

export default function FeaturedServicesScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const branchId: string | number | undefined = route.params?.branchId;
  const passedServices: Service[] | undefined = route.params?.services;

  const [services, setServices] = useState<Service[]>(passedServices ?? FALLBACK_SERVICES);
  const [loading, setLoading] = useState(false);

  // If we have a branchId, fetch ALL featured products (not just the top 5 preview)
  useEffect(() => {
    if (!branchId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await filterBranchProducts({ branchId, limit: 50 });
        console.log("fetch all", res);
        const products = res?.products || res;

        if (products && Array.isArray(products) && products.length > 0) {
          const mapped: Service[] = products.map((p: any) => ({
            id: String(p.id),
            title: p.name || p.title || 'Untitled',
            name: p.name || p.title,
            price: p.price != null ? `${p.currency || '₦'} ${Number(p.price).toLocaleString()}` : '',
            photo:
              p.image || p.photo || (p.images && p.images[0]) || (p.media && p.media[0]) ||
              (FALLBACK_SERVICES[0]?.photo ?? ''),
          }));
          setServices(mapped);
        }
      } catch (err) {
        console.error('FeaturedServicesScreen: failed to fetch products', err);
        // keep whatever we already have (passedServices or fallback)
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [branchId]);

  const renderItem = ({ item, index }: { item: Service; index: number }) => (
    <View>
      <TouchableOpacity
        activeOpacity={0.9}
        style={s.row}
        onPress={() => (navigation as any).navigate('ServiceDetails', { service: item, branchId })}
      >
        <Image source={{ uri: item.photo }} style={s.thumb} />
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={s.title} numberOfLines={2}>
            {item.title || item.name}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.price}>{item.price}</Text>
          <Text style={s.details}>Show Details</Text>
        </View>
      </TouchableOpacity>
      {index !== services.length - 1 ? <View style={s.sep} /> : null}
    </View>
  );

  return (
    <View style={s.container}>
      <SafeAreaView />
      <View style={s.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={BACK_PNG} style={[s.backIcon, { transform: [{ rotate: '180deg' }] }]} />
        </TouchableOpacity>
        <Text style={s.header}>Featured Services</Text>
        <View style={{ width: 36 }}>
          {loading && <ActivityIndicator size="small" color="#0145FE" />}
        </View>
      </View>

      {loading && services.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0145FE" />
          <Text style={{ marginTop: 12, color: '#6C7A92', fontFamily: 'RCB-Regular' }}>Loading services…</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(x) => x.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ color: '#6C7A92', fontFamily: 'RCB-Regular' }}>No featured services available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

/* styles */

const TEXT = '#0F172A';
const MUTED = '#6C7A92';
const BORDER = '#EDEFF4';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  appBar: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { width: 20, height: 20, tintColor: TEXT },
  header: { fontSize: 20, color: '#1F2A44', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  thumb: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#EEE', marginRight: 14 },
  title: { color: TEXT, fontSize: 18, lineHeight: 22, fontWeight: '600' },
  price: { color: TEXT, fontSize: 18, fontWeight: '700' },
  details: { color: MUTED, marginTop: 6 },

  sep: { height: 1, backgroundColor: BORDER, marginLeft: 86 },
});
