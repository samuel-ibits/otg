// screens/wifi/WifiCheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { createOrder, checkoutOrder, verifyPayment, getCurrentUser } from '../../api/api';

const { width, height } = Dimensions.get('window');
const BACK_PNG = require('../../assets/icons/arrow-right.png');

type Service = { id: string; title: string; price: string; photo: string; name?: string; description?: string };

export default function ServiceDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const service = route.params?.service as Service;
  const branchId = route.params?.branchId;

  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);

  if (!service) {
    return (
      <View style={s.container}>
        <SafeAreaView />
        <View style={s.center}>
          <Text style={s.errorTxt}>Service not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtnSimple}>
            <Text style={s.backTxt}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Parse price string to number (e.g., "₦ 3,000" -> 3000)
  const getPriceValue = (priceStr: string) => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user?.email) {
        Alert.alert('Error', 'Please login or update your profile with an email address.');
        setLoading(false);
        return;
      }

      const amount = getPriceValue(service.price);
      if (amount <= 0) {
        Alert.alert('Error', 'Invalid price.');
        setLoading(false);
        return;
      }

      // 1. Create Order
      // Using arbitrary logic for branchId since it might not be passed directly in service object
      // Ideally service object should have branchId or we pass it in params. 
      // Falling back to 0 or handling on backend if needed.
      // Assuming route.params.branchId exists if passed from previous screen, otherwise logic needs improvement.
      const branchId = route.params?.branchId || 0;
      const businessId = route.params?.businessId || 0;

      console.log('Creating order with:', {
        businessId,
        branchId,
        items: [{ productId: service.id, quantity: 1 }],
      });

      if (!branchId) {
        Alert.alert('Error', 'Branch ID is missing.');
        setLoading(false);
        return;
      }

      const orderRes = await createOrder({
        businessId,
        branchId,
        items: [{ productId: service.id, quantity: 1 }],
      });

      console.log('Order response:', JSON.stringify(orderRes, null, 2));

      if (!orderRes) {
        throw new Error("Failed to create order: No response");
      }

      // Check for data property if it's nested
      const orderData = orderRes.data || orderRes;
      const orderId = orderData.id || orderData.orderId || orderData.uuid || orderData.data?.id;

      console.log('Extracted orderId:', orderId);

      if (!orderId) {
        throw new Error("Order ID not found in response. Response: " + JSON.stringify(orderRes));
      }

      // 2. Initialize Payment via Checkout
      const initRes = await checkoutOrder(orderId);
      console.log('Checkout response:', JSON.stringify(initRes, null, 2));

      const paymentData = initRes?.data || initRes;
      const finalPaymentUrl = paymentData?.paymentUrl || paymentData?.authorization_url;
      const finalReference = paymentData?.reference;

      if (finalPaymentUrl) {
        setPaymentRef(finalReference);
        setPaymentUrl(finalPaymentUrl);
      } else {
        throw new Error("Failed to initialize payment: Invalid response structure. " + JSON.stringify(initRes));
      }

    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const onWebStateChange = (navState: any) => {
    const { url } = navState;
    console.log('WebView URL:', url);
    // Broadening the detection for success/callback URLs
    if (
      url.includes('tranzaction/verify') ||
      url.includes('close') ||
      url.includes('callback') ||
      url.includes('checkout-success') ||
      url.includes('success')
    ) {
      // Close modal and verify
      setPaymentUrl(null);
      if (paymentRef) {
        doVerify(paymentRef);
        // We DON'T clear paymentRef here yet, in case verification fails and needs a retry
      }
    }
  };

  const doVerify = async (ref: string) => {
    try {
      setLoading(true);
      const res = await verifyPayment(ref);
      console.log('Verification response:', JSON.stringify(res, null, 2));

      const isSuccess = res?.success === true || res?.status === true || res?.data?.status === 'success' || res?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        Alert.alert('Success', 'Payment successful!');
        setPaymentRef(null); // Clear ref ON SUCCESS
        navigation.navigate('WifiTransaction');
      } else {
        Alert.alert('Payment Status', res?.message || 'Transaction was not successful.');
      }
    } catch (error: any) {
      console.error('Verification error:', error);

      const errorMsg = error.message || "";
      // Specifically handle the "commit" error as success
      if (errorMsg.includes("finished with state: commit")) {
        Alert.alert('Success', 'Payment confirmed!');
        setPaymentRef(null); // Clear ref ON SUCCESS
        navigation.navigate('WifiTransaction');
        return;
      }

      if (errorMsg.includes("Network Error")) {
        Alert.alert(
          'Network Error',
          'We couldn\'t reach the server to verify your payment. Your payment might have been successful. Please click "Verify Payment" to try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', errorMsg || 'Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <ImageBackground source={{ uri: service.photo }} style={s.hero}>
        <SafeAreaView>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Image source={BACK_PNG} style={[s.backIcon, { transform: [{ rotate: '180deg' }] }]} />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      <View style={s.sheet}>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title}>{service.title || service.name}</Text>
          <Text style={s.price}>{service.price}</Text>

          <View style={s.divider} />

          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.desc}>
            {service.description || "No description available for this service. Enjoy premium quality and service."}
          </Text>
        </ScrollView>

        <View style={s.footer}>
          {paymentRef ? (
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                style={s.payBtn}
                onPress={() => doVerify(paymentRef)}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.payTxt}>Verify Payment</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.payBtn, { backgroundColor: '#F1F5F9' }]}
                onPress={() => {
                  setPaymentRef(null);
                  handlePay();
                }}
                disabled={loading}
              >
                <Text style={[s.payTxt, { color: '#64748B' }]}>Try Payment Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={s.payBtn} onPress={handlePay} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.payTxt}>Pay Now</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={!!paymentUrl} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => {
              setPaymentUrl(null);
              if (paymentRef) {
                doVerify(paymentRef);
                setPaymentRef(null);
              }
            }}>
              <Text style={s.closeTxt}>Close</Text>
            </TouchableOpacity>
          </View>
          {paymentUrl && (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={onWebStateChange}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                  <ActivityIndicator size="large" color="#0145FE" />
                  <Text style={{ marginTop: 10, color: '#64748B' }}>Securing your connection...</Text>
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { width: '100%', height: height * 0.4 },
  backBtn: {
    marginTop: 16, marginLeft: 16, width: 40, height: 40,
    borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center'
  },
  backIcon: { width: 20, height: 20, tintColor: '#fff' },

  sheet: {
    flex: 1,
    marginTop: -24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  content: { padding: 24, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  price: { fontSize: 20, fontWeight: '700', color: '#0145FE' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 12 },
  desc: { fontSize: 16, lineHeight: 24, color: '#64748B' },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  payBtn: {
    backgroundColor: '#0145FE',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorTxt: { fontSize: 18, color: '#64748B', marginBottom: 16 },
  backBtnSimple: { padding: 12 },
  backTxt: { color: '#0145FE', fontSize: 16, fontWeight: '600' },

  modalHeader: { padding: 16, alignItems: 'flex-end', borderBottomWidth: 1, borderColor: '#eee' },
  closeTxt: { color: '#0145FE', fontSize: 16, fontWeight: '600' },
});
