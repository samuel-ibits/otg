// component/CheckoutModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CartItem = {
  id: string;
  name: string;
  price: number;       // unit price in minor units or float; here assume float
  quantity: number;
  thumbnail?: any;     // ImageSourcePropType
};

type PaymentMethod = 'card' | 'apple' | 'google';

type Props = {
  visible: boolean;
  items?: CartItem[];
  currency?: string;           // e.g. "USD", "NGN"
  onClose?: () => void;
  onCheckout?: (payload: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    method: PaymentMethod;
    coupon?: string;
  }) => Promise<void> | void;
  onApplyCoupon?: (code: string) => Promise<{ ok: boolean; amountOff: number }> | { ok: boolean; amountOff: number };
  defaultPayment?: PaymentMethod;
};

export default function CheckoutModal({
  visible,
  items = [],
  currency = 'USD',
  onClose,
  onCheckout,
  onApplyCoupon,
  defaultPayment = 'card',
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>(defaultPayment);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!visible) {
      setExpanded(false);
      setCoupon('');
      setDiscount(0);
      setMethod(defaultPayment);
      setApplying(false);
      setPaying(false);
    }
  }, [visible, defaultPayment]);

  const showViewAll = items.length > 3 && !expanded;
  const data = useMemo(() => (expanded ? items : items.slice(0, 3)), [expanded, items]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );
  const total = Math.max(0, subtotal - discount);

  const fmt = (n: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);

  const empty = items.length === 0;

  async function applyCoupon() {
    if (!coupon.trim() || !onApplyCoupon) return;
    try {
      setApplying(true);
      const res = await Promise.resolve(onApplyCoupon(coupon.trim()));
      if (res?.ok) setDiscount(res.amountOff);
      else setDiscount(0);
    } finally {
      setApplying(false);
    }
  }

  async function handlePay() {
    if (empty || paying) return;
    setPaying(true);
    try {
      await Promise.resolve(
        onCheckout?.({
          items,
          subtotal,
          discount,
          total,
          method,
          coupon: coupon.trim() || undefined,
        })
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <SafeAreaView edges={['bottom']} style={[s.sheet, expanded ? s.sheetExpanded : undefined]}>
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Close checkout">
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={s.title}>Checkout</Text>

          <FlatList
            data={data}
            keyExtractor={(it) => it.id}
            contentContainerStyle={data.length ? undefined : s.empty}
            renderItem={({ item }) => (
              <View style={s.row} accessibilityRole="summary">
                <View style={s.left}>
                  {item.thumbnail ? (
                    <Image source={item.thumbnail} style={s.thumb} />
                  ) : (
                    <View style={[s.thumb, s.thumbFallback]}>
                      <Text style={s.thumbText}>{item.name?.[0]?.toUpperCase() || '?'}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={s.meta}>
                      Qty {item.quantity} · {fmt(item.price)}
                    </Text>
                  </View>
                </View>
                <Text style={s.linePrice}>{fmt(item.price * item.quantity)}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={s.emptyText}>Your cart is empty</Text>}
          />

          {showViewAll ? (
            <TouchableOpacity style={s.viewAll} onPress={() => setExpanded(true)} activeOpacity={0.8}>
              <Text style={s.viewAllText}>View all items</Text>
            </TouchableOpacity>
          ) : null}

          {/* Coupon */}
          <View style={s.couponRow}>
            <TextInput
              placeholder="Coupon code"
              placeholderTextColor={MUTED}
              value={coupon}
              onChangeText={setCoupon}
              style={s.input}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[s.applyBtn, !coupon.trim() && s.btnDisabled]}
              onPress={applyCoupon}
              activeOpacity={0.8}
              disabled={!coupon.trim() || applying}
            >
              {applying ? <ActivityIndicator /> : <Text style={s.applyText}>Apply</Text>}
            </TouchableOpacity>
          </View>

          {/* Totals */}
          <View style={s.totals}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Subtotal</Text>
              <Text style={s.totalValue}>{fmt(subtotal)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Discount</Text>
              <Text style={[s.totalValue, discount ? s.negative : undefined]}>
                {discount ? `- ${fmt(discount)}` : fmt(0)}
              </Text>
            </View>
            <View style={[s.totalRow, s.grandRow]}>
              <Text style={s.grandLabel}>Total</Text>
              <Text style={s.grandValue}>{fmt(total)}</Text>
            </View>
          </View>

          {/* Payment methods */}
          <View style={s.methods}>
            <Text style={s.methodsLabel}>Pay with</Text>
            <View style={s.methodRow}>
              <MethodPill
                label="Card"
                active={method === 'card'}
                onPress={() => setMethod('card')}
                icon={require('../assets/icons/checkmark.png')}
              />
              <MethodPill
                label="Apple Pay"
                active={method === 'apple'}
                onPress={() => setMethod('apple')}
                icon={require('../assets/icons/checkmark.png')}
              />
              <MethodPill
                label="Google Pay"
                active={method === 'google'}
                onPress={() => setMethod('google')}
                icon={require('../assets/icons/checkmark.png')}
              />
            </View>
          </View>

          {/* Pay button */}
          <TouchableOpacity
            style={[s.payBtn, (empty || paying) && s.btnDisabled]}
            onPress={handlePay}
            disabled={empty || paying}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Confirm payment"
          >
            {paying ? (
              <ActivityIndicator />
            ) : (
              <Text style={s.payText}>
                {empty ? 'Add items to continue' : `Pay ${fmt(total)}`}
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function MethodPill({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[pillStyles.pill, active ? pillStyles.pillActive : undefined]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {icon ? <Image source={icon} style={[pillStyles.icon, active && pillStyles.iconActive]} /> : null}
      <Text style={[pillStyles.label, active ? pillStyles.labelActive : undefined]}>{label}</Text>
    </TouchableOpacity>
  );
}

const TEXT = '#0A1220';
const MUTED = '#6C7A92';
const BLUE = '#0145FE';
const CARD = '#F6F8FB';
const BORDER = '#E8EDF5';
const GREEN = '#16A34A';

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
    maxHeight: '65%',
  },
  sheetExpanded: { maxHeight: '85%' },
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
  thumb: { width: 36, height: 36, borderRadius: 8, backgroundColor: BORDER, objectFit: 'cover' as any },
  thumbFallback: { backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  thumbText: { color: TEXT, fontWeight: '700' },
  name: { color: TEXT, fontSize: 16, fontWeight: '600', maxWidth: 220 },
  meta: { color: MUTED, fontSize: 12, marginTop: 3 },
  linePrice: { color: TEXT, fontWeight: '700' },

  viewAll: { alignItems: 'center', paddingVertical: 8 },
  viewAllText: { color: BLUE, fontWeight: '600' },

  empty: { paddingVertical: 28, alignItems: 'center' },
  emptyText: { color: MUTED },

  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER,
    color: TEXT,
  },
  applyBtn: {
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#fff', fontWeight: '700' },

  totals: { marginTop: 8, paddingHorizontal: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  totalLabel: { color: MUTED },
  totalValue: { color: TEXT, fontWeight: '600' },
  negative: { color: '#DC2626', fontWeight: '700' },
  grandRow: { marginTop: 4 },
  grandLabel: { color: TEXT, fontWeight: '800', fontSize: 16 },
  grandValue: { color: TEXT, fontWeight: '800', fontSize: 16 },

  methods: { marginTop: 10 },
  methodsLabel: { color: TEXT, fontWeight: '700', marginBottom: 6 },
  methodRow: { flexDirection: 'row', gap: 8 },

  payBtn: {
    marginTop: 12,
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payText: { color: '#fff', fontWeight: '800' },

  btnDisabled: { opacity: 0.6 },
});

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  pillActive: {
    borderColor: BLUE,
    backgroundColor: '#EEF3FF',
  },
  icon: { width: 18, height: 18, tintColor: MUTED, objectFit: 'contain' as any },
  iconActive: { tintColor: BLUE },
  label: { color: TEXT, fontWeight: '600' },
  labelActive: { color: BLUE, fontWeight: '700' },
});
