// screens/loyalty/RewardVouchersScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { VoucherOptionsModal, GiftVoucherModal } from "../../component/VoucherShareModals";
import RedeemQrModal from "../../component/RedeemQrModal";
import { fetchMyVouchers } from "../../api/api";

const BACK_ICON = require("../../assets/icons/back.png");
const STORE_ICON = require("../../assets/icons/store.png");
const AVATAR = require("../../assets/icons/cafe.jpeg");

type Section = "Unused" | "Used" | "Received" | "Requests" | "Transferred";
type RequestFilter = "Pending" | "Actions";
type RequestStatus = "pending" | "accepted" | "rejected";

type Voucher = {
  id: string;
  percent: number;
  brand: string;
  month: string;
  validDays: string;
  isValidNow: boolean;
  isExpired: boolean;
  section: Section;
  code?: string;
};

type ExchangeRequest = {
  id: string;
  fromVoucher: {
    id: string;
    percent: number;
    brand: string;
    validDays: string;
  };
  toVoucher: {
    id: string;
    percent: number;
    brand: string;
    validDays: string;
  };
  status: RequestStatus;
  requestedBy: string;
  requestedAt: string;
};

const ALL_VOUCHERS: Voucher[] = [
  { id: "u-f1", percent: 10, brand: "Cafe One Chevron", month: "February", validDays: "Mondays, Wednesdays, Fridays", isValidNow: false, section: "Unused" },
  { id: "u-f2", percent: 10, brand: "Cafe One Chevron", month: "February", validDays: "Mondays, Wednesdays, Fridays", isValidNow: true, section: "Unused" },
  { id: "u-m1", percent: 10, brand: "Cafe One Chevron", month: "March", validDays: "Mondays, Wednesdays, Fridays", isValidNow: true, section: "Unused" },
  { id: "used-f1", percent: 10, brand: "Cafe One Chevron", month: "February", validDays: "Mondays, Wednesdays, Fridays", isValidNow: true, section: "Used" },
  { id: "used-m1", percent: 10, brand: "Cafe One Chevron", month: "March", validDays: "Mondays, Wednesdays, Fridays", isValidNow: true, section: "Used" },
  { id: "rec-f1", percent: 10, brand: "Cafe One Chevron", month: "February", validDays: "Daily", isValidNow: true, section: "Received" },
  { id: "req-m1", percent: 10, brand: "Cafe One Chevron", month: "March", validDays: "Weekdays", isValidNow: false, section: "Requests" },
  { id: "tr-f1", percent: 10, brand: "Cafe One Chevron", month: "February", validDays: "Weekends", isValidNow: true, section: "Transferred" },
];

// Sample exchange requests data
const EXCHANGE_REQUESTS: ExchangeRequest[] = [
  {
    id: "req-1",
    fromVoucher: {
      id: "v1",
      percent: 10,
      brand: "Cafe One Chevron",
      validDays: "Mondays, Wednesdays, Fridays"
    },
    toVoucher: {
      id: "v2",
      percent: 10,
      brand: "Havens place",
      validDays: "Daily"
    },
    status: "pending",
    requestedBy: "John Doe",
    requestedAt: "2 hours ago"
  },
  {
    id: "req-2",
    fromVoucher: {
      id: "v3",
      percent: 10,
      brand: "Cafe One Chevron",
      validDays: "Weekdays"
    },
    toVoucher: {
      id: "v4",
      percent: 10,
      brand: "Havens place",
      validDays: "Weekends"
    },
    status: "pending",
    requestedBy: "Jane Smith",
    requestedAt: "5 hours ago"
  },
  {
    id: "req-3",
    fromVoucher: {
      id: "v5",
      percent: 10,
      brand: "Cafe One Chevron",
      validDays: "Daily"
    },
    toVoucher: {
      id: "v6",
      percent: 10,
      brand: "Havens place",
      validDays: "Mondays, Wednesdays, Fridays"
    },
    status: "accepted",
    requestedBy: "Mike Johnson",
    requestedAt: "1 day ago"
  }
];


const TABS: Section[] = ["Unused", "Used", "Received", "Requests", "Transferred"];

export default function RewardVouchersScreen({ navigation }: any) {
  const [tab, setTab] = useState<Section>("Unused");
  const [requestFilter, setRequestFilter] = useState<RequestFilter>("Pending");
  const [showOptions, setShowOptions] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
  const [requests, setRequests] = useState<ExchangeRequest[]>(EXCHANGE_REQUESTS);
  
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetchMyVouchers(100); // Fetch more initially
      if (response && response.vouchers) {
        const mappedVouchers: Voucher[] = response.vouchers.map((apiVoucher: any) => {
          const validFromDate = new Date(apiVoucher.validFrom);
          const month = validFromDate.toLocaleString('default', { month: 'long' });
          
          const now = new Date();
          const validUntilDate = new Date(apiVoucher.validUntil);
          let isValidNow = apiVoucher.status === 'UNUSED' && now >= validFromDate && now <= validUntilDate;
          const isExpired = apiVoucher.status === 'UNUSED' && now > validUntilDate;

          if (isValidNow && Array.isArray(apiVoucher.validityDays)) {
            const daysMap: {[key: string]: number} = {
              "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6
            };
            const currentDay = now.getDay();
            const validDaysIndices = apiVoucher.validityDays.map((d: string) => daysMap[d]).filter((d: number) => d !== undefined);
            
            if (validDaysIndices.length > 0 && !validDaysIndices.includes(currentDay)) {
              isValidNow = false;
            }
          }
          
          // Map section based on status
          let section: Section = "Unused";
          if (apiVoucher.status === "USED") {
            section = "Used";
          }
          // TODO: Logic for "Received", "Transferred" if API supports it

          return {
            id: apiVoucher.id.toString(),
            percent: apiVoucher.value,
            brand: apiVoucher.branch?.name || apiVoucher.rule?.name || "Unknown Brand",
            month: month,
            validDays: Array.isArray(apiVoucher.validityDays) ? apiVoucher.validityDays.join(", ") : "Daily",
            isValidNow: isValidNow,
            isExpired: isExpired,
            section: section,
            code: apiVoucher.code
          };
        });
        setVouchers(mappedVouchers);
      }
    } catch (error) {
      console.error("Error loading vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const items = vouchers.filter((v) => v.section === tab);
    // Group by month
    const groups: { [key: string]: Voucher[] } = {};
    items.forEach(v => {
      if (!groups[v.month]) {
        groups[v.month] = [];
      }
      groups[v.month].push(v);
    });
    
    return Object.entries(groups).map(([title, items]) => ({ title, items }));
  }, [tab, vouchers]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (requestFilter === "Pending") {
        return req.status === "pending";
      } else {
        return req.status !== "pending";
      }
    });
  }, [requests, requestFilter]);

  const openOptions = (v: Voucher) => {
    setActiveVoucher(v);
    setShowOptions(true);
  };

  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "accepted" as RequestStatus } : req
    ));
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "rejected" as RequestStatus } : req
    ));
  };

  return (
    <SafeAreaView style={s.root}>
      <VoucherOptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onGift={() => {
          setShowOptions(false);
          setShowGift(true);
        }}
        onExchange={() => {
          setShowOptions(false);
          navigation.navigate('ExchangeRewardScreen', { voucher: activeVoucher });
        }}
      />
      <GiftVoucherModal
        visible={showGift}
        onClose={() => setShowGift(false)}
        onShareChoice={() => setShowGift(false)}
      />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={BACK_ICON} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>Rewards</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RewardMarket')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={STORE_ICON} style={s.shop} />
        </TouchableOpacity>
      </View>

      <View style={s.tabsRow}>
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={s.tabBtn}>
              <Text style={[s.tabTxt, active && s.tabTxtActive]}>{t}</Text>
              {active && <View style={s.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {tab === "Requests" && (
        <View style={s.requestFilters}>
          <TouchableOpacity
            style={[s.filterBtn, requestFilter === "Pending" && s.filterBtnActive]}
            onPress={() => setRequestFilter("Pending")}
          >
            <Text style={[s.filterTxt, requestFilter === "Pending" && s.filterTxtActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.filterBtn, requestFilter === "Actions" && s.filterBtnActive]}
            onPress={() => setRequestFilter("Actions")}
          >
            <Text style={[s.filterTxt, requestFilter === "Actions" && s.filterTxtActive]}>
              Actions
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="large" color={BLUE} />
          </View>
        ) : tab === "Requests" ? (
          <RequestsContent 
            requests={filteredRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        ) : (
          <>
            {grouped.length === 0 ? (
              <View style={{ padding: 16 }}>
                <Text style={s.empty}>No vouchers in "{tab}".</Text>
              </View>
            ) : (
              grouped.map((g) => (
                <View key={g.title} style={{ paddingHorizontal: 16, marginBottom: 6 }}>
                  <Text style={s.month}>{g.title}</Text>
                  {g.items.map((v, idx) => (
                    <VoucherCard
                      key={v.id}
                      v={v}
                      first={idx === 0}
                      dim={tab !== "Unused"}
                      statusLabel={statusFromSection(tab, v.isValidNow, v.isExpired)}
                      onMore={() => openOptions(v)}
                    />
                  ))}
                </View>
              ))
            )}
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RequestsContent({ 
  requests, 
  onAccept, 
  onReject 
}: { 
  requests: ExchangeRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (requests.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={s.empty}>No exchange requests found.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16 }}>
      {requests.map((request) => (
        <ExchangeRequestCard
          key={request.id}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </View>
  );
}

function ExchangeRequestCard({
  request,
  onAccept,
  onReject
}: {
  request: ExchangeRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const handleAccept = () => {
    onAccept(request.id);
    setShowActions(false);
  };

  const handleReject = () => {
    onReject(request.id);
    setShowActions(false);
  };

  return (
    <View style={s.requestCard}>
      <View style={s.requestCardContent}>
        {/* Left voucher */}
        <View style={s.voucherSide}>
          <Text style={s.requestPercent}>{request.fromVoucher.percent}% OFF</Text>
          <View style={s.requestBrand}>
            <Image source={AVATAR} style={s.requestBrandImg} />
            <Text style={s.requestBrandText} numberOfLines={1}>
              {request.fromVoucher.brand}
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <View style={s.arrowContainer}>
          <Text style={s.arrow}>⇄</Text>
        </View>

        {/* Right voucher */}
        <View style={s.voucherSide}>
          <Text style={s.requestPercent}>{request.toVoucher.percent}% OFF</Text>
          <View style={s.requestBrand}>
            <Image source={AVATAR} style={s.requestBrandImg} />
            <Text style={s.requestBrandText} numberOfLines={1}>
              {request.toVoucher.brand}
            </Text>
          </View>
        </View>
      </View>

      {/* Action section */}
      {request.status === "pending" && (
        <>
          {!showActions ? (
            <TouchableOpacity
              style={s.actionTrigger}
              onPress={() => setShowActions(true)}
            >
              <Text style={s.actionTriggerText}>Accept request?</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.actionButtons}>
              <Text style={s.actionQuestion}>Accept request?</Text>
              <View style={s.actionButtonsRow}>
                <TouchableOpacity
                  style={s.acceptBtn}
                  onPress={handleAccept}
                >
                  <Text style={s.actionBtnText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.rejectBtn}
                  onPress={handleReject}
                >
                  <Text style={s.actionBtnText}>✗</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}

      {request.status === "accepted" && (
        <View style={s.statusContainer}>
          <Text style={[s.statusText, s.acceptedText]}>Accepted</Text>
        </View>
      )}

      {request.status === "rejected" && (
        <View style={s.statusContainer}>
          <Text style={[s.statusText, s.rejectedText]}>Rejected</Text>
        </View>
      )}
    </View>
  );
}

function statusFromSection(tab: Section, isValidNow: boolean, isExpired: boolean) {
  switch (tab) {
    case "Unused":
      if (isExpired) return "Expired";
      return isValidNow ? "Redeem" : "Not Active";
    case "Used":
      return "Used";
    case "Received":
      return "Redeem";
    case "Requests":
      return "Pending";
    case "Transferred":
      return "Transferred";
  }
}

function VoucherCard({
  v,
  first,
  dim,
  statusLabel,
  onMore,
}: {
  v: Voucher;
  first?: boolean;
  dim?: boolean;
  statusLabel: string | null;
  onMore: () => void;
}) {
  // QR modal state is local to the card
  const [showQR, setShowQR] = useState(false);

  const handleRedeem = () => {
    setShowQR(true); // open modal
  };

  return (
    <View style={[s.card, first && { marginTop: 8 }, dim && { opacity: 0.5 }]}>
      {/* QR modal */}
      <RedeemQrModal 
        visible={showQR} 
        value={v.code ? `voucher:${v.code}` : `voucher:${v.id}`} 
        onClose={() => setShowQR(false)} 
      />

      <View style={s.cardTop}>
        <Text style={s.percent}>{v.percent}% OFF</Text>
        <TouchableOpacity onPress={onMore} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.more}>•••</Text>
        </TouchableOpacity>
      </View>

      <View style={s.brandRow}>
        <View style={s.brandInner}>
          <Image source={AVATAR} style={s.brandImg} />
          <Text style={s.brandName} numberOfLines={1}>
            {v.brand}
          </Text>
        </View>

        {statusLabel === "Redeem" ? (
          <TouchableOpacity style={s.redeemBtn} onPress={handleRedeem}>
            <Text style={s.redeemTxt}>Redeem</Text>
          </TouchableOpacity>
        ) : statusLabel ? (
          <View style={[s.redeemBtn, { backgroundColor: statusLabel === 'Expired' ? '#EF4444' : "#94A3B8" }]}>
            <Text style={s.redeemTxt}>{statusLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={s.dashed} />

      {v.isValidNow ? (
        <Text style={s.validity}>Validity - {v.validDays}</Text>
      ) : (
        <Text style={s.notValid}>
          {v.isExpired 
            ? "This voucher has expired." 
            : "This voucher is not valid yet."} <Text style={s.why}>Why?</Text>
        </Text>
      )}
    </View>
  );
}

/* styles */
const TEXT = "#0A1220";
const SUB = "#6B7C97";
const BLUE = "#0A59FF";
const GREEN = "#22C55E";
const RED = "#EF4444";
const CARD_BG = "#EAF0FF";
const BORDER = "#D6E1FF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 52,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7EAF3",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  shop: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },

  tabsRow: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7EAF3",
  },
  tabBtn: { paddingVertical: 12, paddingHorizontal: 12, alignItems: "center" },
  tabTxt: { color: SUB, fontFamily: "RCB-SemiBold" },
  tabTxtActive: { color: BLUE },
  tabUnderline: { marginTop: 8, height: 3, width: "100%", backgroundColor: BLUE, borderRadius: 2 },

  requestFilters: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterBtnActive: {
    backgroundColor: BLUE,
  },
  filterTxt: {
    color: SUB,
    fontSize: 14,
    fontWeight: "600",
  },
  filterTxtActive: {
    color: "#FFFFFF",
  },

  content: { backgroundColor: "#FFFFFF", paddingTop: 8 },

  month: {
    color: TEXT,
    fontFamily: "RCB-Bold",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#F3F6FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 14,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  percent: { color: BLUE, fontFamily: "RCB-Black", fontSize: 26, letterSpacing: 0.3 },
  more: { color: "#1E293B", fontSize: 18 },

  brandRow: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFD0FF",
    backgroundColor: CARD_BG,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandInner: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 },
  brandImg: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  brandName: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 15, flexShrink: 1 },

  redeemBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#0E1730",
    alignItems: "center",
    justifyContent: "center",
  },
  redeemTxt: { color: "#fff", fontFamily: "RCB-Bold" },

  dashed: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#BFD0FF",
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 1,
  },

  validity: { color: SUB, fontFamily: "RCB-SemiBold" },
  notValid: { color: SUB, fontFamily: "RCB-SemiBold" },
  why: { color: BLUE, textDecorationLine: "underline" },

  empty: { color: SUB, textAlign: "center" },

  // Request card styles
  requestCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    overflow: "hidden",
  },
  requestCardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  voucherSide: {
    flex: 1,
    alignItems: "center",
  },
  requestPercent: {
    color: BLUE,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  requestBrand: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 100,
    justifyContent: "center",
  },
  requestBrandImg: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  requestBrandText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  arrow: {
    fontSize: 18,
    color: SUB,
  },
  actionTrigger: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  actionTriggerText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionQuestion: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  acceptBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  acceptedText: {
    color: GREEN,
  },
  rejectedText: {
    color: RED,
  },
});