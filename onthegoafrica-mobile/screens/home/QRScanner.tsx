// screens/QRScanner.tsx
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { redeemVoucher } from '../../api/api';

type RootStackParamList = {
  QRScanner: { onScannedRoute?: string } | undefined;
  // Example target screen:
  // QRResult: { data: string };
};

type Nav = StackNavigationProp<RootStackParamList, 'QRScanner'>;

export default function QRScanner() {
  // Hooks must be called unconditionally and in the same order every render.
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const params = (route.params as { onScannedRoute?: string } | undefined) || {};
  const onScannedRoute = params.onScannedRoute;

  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const lockedRef = useRef(false);

  const handleScanned = useCallback(
    async (result: { data: string; type: string }) => {
      if (lockedRef.current) return;
      const value = String(result?.data || '').trim();
      if (!value) return;

      lockedRef.current = true;

      // Check for voucher redemption format
      if (value.startsWith('voucher:')) {
        const voucherCodeOrId = value.split('voucher:')[1];
        if (voucherCodeOrId) {
          try {
            // Determine if it's an ID (numeric) or Code (alphanumeric)
            const isId = /^\d+$/.test(voucherCodeOrId);
            const payload = isId ? { voucherId: voucherCodeOrId } : { code: voucherCodeOrId };
            
            Alert.alert(
              "Redeeming Voucher",
              "Please wait...",
              [],
              { cancelable: false }
            );
            
            const response = await redeemVoucher(payload);
            
            if (response && response.success) {
              Alert.alert(
                "Success", 
                response.message || "Voucher redeemed successfully!",
                [{ text: "OK", onPress: () => {
                  lockedRef.current = false;
                  navigation.goBack();
                }}]
              );
            } else {
               Alert.alert(
                "Redemption Failed", 
                response?.message || "Could not redeem voucher.",
                [{ text: "OK", onPress: () => lockedRef.current = false }]
              );
            }
          } catch (error) {
             Alert.alert(
              "Error", 
              "An error occurred while redeeming.",
              [{ text: "OK", onPress: () => lockedRef.current = false }]
            );
          }
          return;
        }
      }

      if (onScannedRoute) {
        // @ts-ignore ensure the route exists in your stack
        navigation.replace(onScannedRoute as never, { data: value } as never);
      } else {
        Alert.alert('Scanned', value, [{ text: 'OK', onPress: () => {
           lockedRef.current = false;
           navigation.goBack();
        }}]);
      }
    },
    [navigation, onScannedRoute]
  );

  const allowAnother = useCallback(() => {
    lockedRef.current = false;
  }, []);

  // Render branches AFTER all hooks are declared.
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.status}>Checking camera permission…</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.status}>Camera access is required to scan QR codes.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>Grant permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Close scanner"
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.iconTxt}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Toggle flashlight"
          onPress={() => setTorchOn(v => !v)}
          style={styles.iconBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.iconTxt}>{torchOn ? '🔦' : '💡'}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Camera */}
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleScanned}
      />

      {/* Footer */}
      <SafeAreaView style={styles.footer}>
        <Text style={styles.hint}>Align the QR inside the frame</Text>
        <TouchableOpacity onPress={allowAnother} style={styles.secondaryBtnSmall}>
          <Text style={styles.secondaryBtnSmallText}>Allow another scan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  camera: { flex: 1 },
  footer: { backgroundColor: '#000', alignItems: 'center', paddingVertical: 12 },
  hint: { color: '#A3A3A3', fontSize: 13, marginBottom: 6 },
  primaryBtn: {
    marginTop: 16, backgroundColor: '#2563EB',
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10,
  },
  primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  secondaryBtn: {
    marginTop: 10, backgroundColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
  },
  secondaryBtnText: { color: '#111827', fontSize: 14, fontWeight: '700' },
  secondaryBtnSmall: {
    marginTop: 6, backgroundColor: '#111827',
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
  },
  secondaryBtnSmallText: { color: '#E5E7EB', fontSize: 12, fontWeight: '700' },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#000',
  },
  status: { color: '#FFF', textAlign: 'center', fontSize: 14, lineHeight: 20 },
});
