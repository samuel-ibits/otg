// component/WiFiLocationsModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WiFiNetwork = { id: string; name: string; verified: boolean; locked: boolean };

type Props = {
  visible: boolean;
  onClose?: () => void;
  onNetworkSelect?: (n: WiFiNetwork) => void;
  networks?: WiFiNetwork[];
};

export default function WiFiLocationsModal({
  visible,
  onClose,
  onNetworkSelect,
  networks = [],
}: Props) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!visible) setExpanded(false);
  }, [visible]);

  const showViewAll = networks.length > 3 && !expanded;
  const data = useMemo(
    () => (expanded ? networks : networks.slice(0, 3)),
    [expanded, networks]
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <SafeAreaView
          edges={['bottom']}
          style={[s.sheet, expanded ? s.sheetExpanded : undefined]}
        >
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.7}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>Nearby Wi-Fi</Text>

          <FlatList
            data={data}
            keyExtractor={(it) => it.id}
            contentContainerStyle={data.length ? undefined : s.empty}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.row}
                onPress={() => onNetworkSelect?.(item)}
                activeOpacity={0.8}
              >
                <View style={s.left}>
                  <Image
                    source={require('../assets/icons/wifi.png')}
                    style={s.wifi}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={s.name} numberOfLines={1}>
                      {item.name || 'Hidden SSID'}
                    </Text>
                    <Text style={s.meta}>
                      {item.locked ? 'Requires password' : 'Open network'}
                    </Text>
                  </View>
                </View>

                <Image
                  source={
                    item.locked
                      ? require('../assets/icons/lock.png')
                      : require('../assets/icons/unlock.png')
                  }
                  style={[s.lockIcon, !item.locked && s.unlockTint]}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={s.emptyText}>No networks found</Text>}
          />

          {showViewAll ? (
            <TouchableOpacity
              style={s.viewAll}
              onPress={() => setExpanded(true)}
              activeOpacity={0.8}
            >
              <Text style={s.viewAllText}>View all</Text>
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const TEXT = '#0A1220';
const MUTED = '#6C7A92';
const BLUE = '#0145FE';
const CARD = '#F6F8FB';
const BORDER = '#E8EDF5';

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    maxHeight: '55%',
  },
  sheetExpanded: {
    maxHeight: '85%',
  },
  close: { alignSelf: 'flex-end', padding: 6 },
  closeX: { fontSize: 24, color: MUTED },
  title: {
    fontSize: 18,
    color: TEXT,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: CARD,
    borderRadius: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  wifi: { width: 20, height: 20, tintColor: TEXT },
  name: { color: TEXT, fontSize: 16, fontWeight: '600', maxWidth: 220 },
  meta: { color: MUTED, fontSize: 12, marginTop: 3 },

  lockIcon: { width: 18, height: 18, tintColor: MUTED, objectFit:'contain',marginLeft: 8 },
  unlockTint: { tintColor: '#16A34A' },

  viewAll: { alignItems: 'center', paddingVertical: 12 },
  viewAllText: { color: BLUE, fontWeight: '600' },

  empty: { paddingVertical: 28, alignItems: 'center' },
  emptyText: { color: MUTED },
});
