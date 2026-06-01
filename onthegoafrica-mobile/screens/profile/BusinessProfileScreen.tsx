// screens/business/BusinessProfileScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchBranchDetails, filterBranchProducts } from "../../api/api";

const { width } = Dimensions.get("window");
const HERO_H = Math.round(width * 0.58);

type Tag = {
  icon: "wifi" | "coffee" | "ambience" | "cowork";
  label: string;
  value: string;
};
type Service = {
  id: string;
  title: string;
  price: string;
  photo: string;
  currency?: string;
  name?: string;
};
type Review = {
  id: string;
  user: {
    name: string;
    initials?: string;
    avatarUri?: string;
    location: string;
  };
  writtenAt: string;
  title: string;
  body: string;
  visited?: string;
  rating: number;
  photoUri?: string;
  helpful?: number;
};
type Business = {
  id?: string | number;
  name: string;
  distance?: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  photos?: string[];
  tags?: Tag[];
  services?: Service[];
  products?: any[];
  about?: string;
  mapImage?: string;
  reviews?: Review[];
  openingHours?: { dayOfWeek: string; openTime: string; closeTime: string }[];
  wifi?: { ssid: string; password?: string };
  wifiPlans?: Service[];
  businessId?: string | number;
};

const BACK_PNG = require("../../assets/icons/arrow-right.png");
const MORE_PNG = require("../../assets/feed/more.png");
const STAR_PNG = require("../../assets/feed/star.png");
const WIFI_PNG = require("../../assets/feed/wifi.png");
const COFFEE_PNG = require("../../assets/feed/coffee.png");
const AMBIENCE_PNG = require("../../assets/feed/ambience.png");
const COWORK_PNG = require("../../assets/feed/cowork.png");
const CHEVRON_RIGHT = require("../../assets/icons/chev-right.png"); // replace with chevron if you have it

export default function BusinessProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Safe defaults - EMPTY to avoid dummy data
  const fallback: Required<Business> = useMemo(
    () => ({
      id: "0",
      businessId: 0,
      name: "",
      distance: "",
      rating: 0,
      reviewsCount: 0,
      address: "",
      photos: [],
      tags: [],
      services: [],
      about: "",
      mapImage: "", // Maybe keep a placeholder image or empty
      reviews: [],
      products: [],
      openingHours: [],
      wifi: { ssid: '', password: '' },
      wifiPlans: [],
    }),
    []
  );

  // Initial params from navigation
  const params: Business | undefined = route.params?.business;
  const initialBusiness: Required<Business> = {
    ...fallback,
    ...(params ?? {}),
    // Ensure all required fields have a value or fallback
    photos: params?.photos ?? fallback.photos,
    tags: params?.tags ?? fallback.tags,
    services: params?.services ?? fallback.services,
    reviews: params?.reviews ?? fallback.reviews,
    address: params?.address ?? fallback.address,
    distance: params?.distance ?? fallback.distance,
    rating: params?.rating ?? fallback.rating,
    reviewsCount: params?.reviewsCount ?? fallback.reviewsCount,
    about: params?.about ?? fallback.about,
    mapImage: params?.mapImage ?? fallback.mapImage,
    name: params?.name ?? fallback.name,
    id: params?.id ?? fallback.id,
  };

  const [businessData, setBusinessData] = useState<Required<Business>>(initialBusiness);
  const [loading, setLoading] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [actionsForReview, setActionsForReview] = useState<Review | null>(null);
  const [openingStatus, setOpeningStatus] = useState<{ label: string; time: string }>({
    label: 'Closed',
    time: 'Opens 9:00AM',
  });

  const [hoursModalVisible, setHoursModalVisible] = useState(false);
  const [wifiModalVisible, setWifiModalVisible] = useState(false);

  // Fetch real data if we have an ID
  useEffect(() => {
    const fetchRealData = async () => {
      const branchId = params?.id || route.params?.id;
      if (!branchId) return;

      try {
        setLoading(true);

        // 1. Fetch branch details (public endpoint)
        let branchRes: any = null;
        try {
          branchRes = await fetchBranchDetails(branchId);
        } catch (e) {
          console.log('fetchBranchDetails failed:', e);
        }

        // 2. Fetch featured products & Plans
        let featuredRes: any = null;
        try {
          // Featured for preview (returns { products: [], wifi: [] })
          featuredRes = await filterBranchProducts({ branchId, limit: 20 });
          console.log("fetch featured", featuredRes);
        } catch (e) {
          console.log('filterBranchProducts failed:', e);
        }

        const b = branchRes || {};

        // --- About ---
        const aboutText =
          params?.about || b.description || b.metaDescription || b.about || '';

        // --- Photos ---
        const photos =
          (b.images?.length ? b.images : null) ||
          (b.coverPhotos?.length ? b.coverPhotos : null) ||
          fallback.photos;

        // --- Opening hours ---
        const hours = b.openingHours || b.hours;
        if (hours && Array.isArray(hours)) {
          const today = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
          const todayHours = hours.find(
            (h: any) => h.dayOfWeek?.toLowerCase() === today
          );
          if (todayHours && todayHours.openTime && todayHours.closeTime) {
            const now = new Date();
            const [oh, om] = todayHours.openTime.split(':').map(Number);
            const [ch, cm] = todayHours.closeTime.split(':').map(Number);
            const openMin = oh * 60 + (om || 0);
            const closeMin = ch * 60 + (cm || 0);
            const nowMin = now.getHours() * 60 + now.getMinutes();
            if (nowMin >= openMin && nowMin < closeMin) {
              setOpeningStatus({ label: 'Open', time: `Closes ${todayHours.closeTime}` });
            } else {
              setOpeningStatus({ label: 'Closed', time: `Opens ${todayHours.openTime}` });
            }
          }
        }

        const businessId = params?.businessId || route.params?.businessId || b.businessId || b.business_id || b.business?.id || b.companyId || b.company_id || 0;
        console.log("businessId", businessId);
        const mappedBusiness: Business = {
          id: b.id || branchId,
          businessId,
          name: b.name || b.businessName || fallback.name,
          address: b.address || b.location || fallback.address,
          rating: b.rating || 0,
          reviewsCount: b.reviewsCount || b.reviews?.length || 0,
          about: aboutText || fallback.about,
          photos,
          tags: fallback.tags,
          mapImage: fallback.mapImage,
          reviews: fallback.reviews,
          products: [],
          openingHours: hours && Array.isArray(hours) ? hours : [],
          wifi: b.wifi || null,
          wifiPlans: [],
        };

        // --- Featured Services ---
        const productList = featuredRes?.products || featuredRes?.data?.products || featuredRes?.data || featuredRes;

        if (productList && Array.isArray(productList) && productList.length > 0) {
          mappedBusiness.services = productList.map((p: any) => ({
            id: String(p.id),
            title: p.name || p.title || 'Untitled',
            name: p.name || p.title,
            price: p.price != null ? `${p.currency || '₦'} ${Number(p.price).toLocaleString()}` : '',
            currency: p.currency,
            photo: p.image || p.photo || (p.images && p.images[0]) || (p.media && p.media[0]) || '',
          }));
          mappedBusiness.products = mappedBusiness.services;
        }

        // --- WiFi Plans ---
        // --- WiFi Plans ---
        // The API returns wifi plans in the 'wifi' key of the response
        const plansList = featuredRes?.wifi || featuredRes?.data?.wifi;
        if (plansList && Array.isArray(plansList) && plansList.length > 0) {
          mappedBusiness.wifiPlans = plansList.map((p: any) => ({
            id: String(p.id),
            title: p.name || p.title || 'Untitled',
            name: p.name || p.title,
            price: p.price != null ? `${p.currency || '₦'} ${Number(p.price).toLocaleString()}` : '',
            currency: p.currency,
            photo: p.image || p.photo || (p.images && p.images[0]) || (p.media && p.media[0]) || '',
          }));
        }

        setBusinessData(prev => ({ ...prev, ...mappedBusiness }));

      } catch (error) {
        console.error('Failed to load business details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [params?.id, route.params?.id]);

  const tagIcon = (t: Tag["icon"]) =>
  ({
    wifi: WIFI_PNG,
    coffee: COFFEE_PNG,
    ambience: AMBIENCE_PNG,
    cowork: COWORK_PNG,
  }[t]);

  return (
    <View style={s.container}>
      {/* Header */}
      <SafeAreaView>
        <View style={s.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={BACK_PNG}
              style={[s.backIcon, { transform: [{ rotate: "180deg" }] }]}
            />
          </TouchableOpacity>
          <Text style={s.title}>{businessData.name}</Text>
          <View style={s.appBarRight}></View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero carousel */}
        <View style={s.heroWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) =>
              setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            scrollEventThrottle={16}
          >
            {(businessData.photos ?? []).map((uri, i) => (
              <ImageBackground
                key={i}
                source={{ uri }}
                style={s.hero}
                imageStyle={{ borderRadius: 12 }}
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.25)"]}
                  style={s.heroGrad}
                />
                <View style={s.heroBadge}>
                  <Text style={s.heroBadgeTxt}>
                    {i + 1}/{businessData.photos.length}
                  </Text>
                </View>
              </ImageBackground>
            ))}
          </ScrollView>
          {businessData.photos.length > 1 && (
            <View style={s.dots}>
              {businessData.photos.map((_, i) => (
                <View
                  key={i}
                  style={[s.dot, i === imgIndex && s.dotActive]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Header card */}
        <View style={s.card}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={s.placeName} numberOfLines={1}>
                {businessData.name} <Text style={s.distance}>{businessData.distance}</Text>
              </Text>
            </View>
            <View style={s.ratingWrap}>
              <Stars value={Math.round(businessData.rating)} />
              <Text style={s.revCount}>{businessData.reviewsCount}</Text>
            </View>
          </View>
          <View style={{ marginTop: 8 }}>
            <RowTags tags={businessData.tags} tagIcon={tagIcon} />
          </View>
        </View>

        {/* Featured services */}
        <View style={[s.sectionPad, { paddingTop: 8 }]}>
          <View style={s.rowBetween}>
            <Text style={s.h2}>Featured services</Text>
            {loading && <ActivityIndicator size="small" color="#0145FE" />}
          </View>
          {(businessData.products ?? []).slice(0, 3).map((sv) => (
            <TouchableOpacity
              key={sv.id}
              style={s.serviceRow}
              activeOpacity={0.9}
            >
              <Image source={{ uri: sv.photo }} style={s.serviceImg} />
              <View style={{ flex: 1 }}>
                <Text style={s.serviceTitle}>{sv.title || sv.name}</Text>
                <Text style={s.servicePrice}>{sv.price}</Text>
                <Text style={s.serviceLink}>Show Details</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={s.seeAllRow}>
            <TouchableOpacity onPress={() => navigation.navigate("FeaturePlan", { branchId: businessData.id, services: businessData.services })}>
              <Text style={s.link}>See all</Text>
            </TouchableOpacity>
            <View style={s.arrowCircle}>
              <Image
                source={CHEVRON_RIGHT}
                style={{ width: 14, height: 14, tintColor: "#fff" }}
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={[s.sectionPad, { paddingTop: 0 }]}>
          <View style={s.aboutHeader}>
            <Text style={s.h2}>About</Text>
            <TouchableOpacity
              onPress={() => setAboutExpanded((x) => !x)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.chevTxt}>{aboutExpanded ? "▾" : "▸"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.about} numberOfLines={aboutExpanded ? 0 : 6}>
            {businessData.about}
          </Text>

          <View style={s.inlineLinks}>
            <TouchableOpacity>
              <Text style={s.link}>Claim Business</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={s.link}>Leave a review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opening hours */}
        <CardRow
          icon="⏰"
          title="Opening hours"
          subtitle={
            <Text style={openingStatus.label === 'Open' ? s.link : s.closed}>
              {openingStatus.label || "Check hours"}
            </Text>
          }
          trailing={openingStatus.time}
          onPress={businessData.openingHours?.length ? () => setHoursModalVisible(true) : undefined}
        />
        {/* WiFi */}
        <CardRow
          icon="📶"
          title="WiFi"
          subtitle={
            <Text style={businessData.wifi ? s.link : s.muted}>
              {businessData.wifi ? "Available" : "Not connected"}
            </Text>
          }
          subtitle={
            <Text style={businessData.wifi ? s.link : s.muted}>
              {businessData.wifi ? "Available" : "Not connected"}
            </Text>
          }
          onPress={() => setWifiModalVisible(true)}
        />

        {/* Location */}
        <View style={[s.sectionPad, { marginTop: 2 }]}>
          <Text style={s.h2}>Location</Text>
          <Text style={s.addr}>{businessData.address}</Text>
          <Image source={{ uri: businessData.mapImage }} style={s.mapImg} />
        </View>

        {/* Visit + tabs */}
        <View style={[s.sectionPad, s.rowBetween, { marginTop: 8 }]}>
          <Text style={s.h2}>Have you visited here?</Text>
          <TouchableOpacity style={s.postBtn}>
            <Text style={s.postBtnTxt}>Make a Post</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.sectionPad, { paddingTop: 0 }]}>
          <View style={s.tabs}>
            <TouchableOpacity style={s.tab}>
              <Text style={s.tabTxtMuted}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.tab, s.tabActive]}>
              <Text style={s.tabTxtActive}>Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* rating summary */}
          <View style={{ marginTop: 8 }}>
            <View style={s.rowCenter}>
              <Text style={s.bigScore}>{(businessData.rating ?? 0).toFixed(1)}</Text>
              <View style={{ marginLeft: 10 }}>
                <Stars value={Math.round(businessData.rating)} />
                <Text style={s.smallMuted}>{businessData.reviewsCount} reviews</Text>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              {[
                { label: "Amazing", pct: 100 },
                { label: "Very good", pct: 24 },
                { label: "Good", pct: 8 },
                { label: "Poor", pct: 6 },
                { label: "Terrible", pct: 12 },
              ].map((b, i) => (
                <Bar key={i} label={b.label} pct={b.pct} />
              ))}
            </View>
          </View>

          {/* Sort / Filter */}
          <View style={s.pillsRow}>
            <Pill>Sort</Pill>
            <Pill>Filter</Pill>
          </View>
        </View>

        {/* Reviews */}
        <View style={{ paddingHorizontal: 16 }}>
          {(businessData.reviews ?? []).map((r) => (
            <View key={r.id} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <View style={s.reviewUserRow}>
                  <Avatar user={r.user} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={s.revName}>{r.user.name}</Text>
                    <Text style={s.revPlace}>{r.user.location}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Stars value={r.rating} small />
                  <Text style={s.revDate}>{r.writtenAt}</Text>
                </View>
              </View>

              <Text style={s.revTitle}>{r.title}</Text>
              {!!r.visited && <Text style={s.revVisited}>{r.visited}</Text>}
              <Text style={s.revBody} numberOfLines={3}>
                {r.body}
              </Text>
              <TouchableOpacity>
                <Text style={s.link}>Read more</Text>
              </TouchableOpacity>

              {!!r.photoUri && (
                <Image source={{ uri: r.photoUri }} style={s.revPhoto} />
              )}

              <View style={s.revFooter}>
                {!!r.helpful && (
                  <TouchableOpacity style={s.helpBtn}>
                    <Text style={s.helpTxt}>
                      Helpful ({r.helpful.toLocaleString()})
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => setActionsForReview(r)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Image
                    source={MORE_PNG}
                    style={{
                      width: 16,
                      height: 16,
                      tintColor: "#6C7A92",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* View all reviews */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity style={s.viewAllBtn}>
            <Text style={s.viewAllTxt}>View 96 reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Actions bottom-sheet */}
      <ActionsModal
        visible={!!actionsForReview}
        onClose={() => setActionsForReview(null)}
        onComplainSupport={() => setActionsForReview(null)}
        onBlockUser={() => setActionsForReview(null)}
        onReportPost={() => setActionsForReview(null)}

      />

      {/* Opening Hours Modal */}
      <HoursModal
        visible={hoursModalVisible}
        onClose={() => setHoursModalVisible(false)}
        hours={businessData.openingHours || []}
      />

      {/* WiFi Modal */}
      <WifiModal
        visible={wifiModalVisible}
        onClose={() => setWifiModalVisible(false)}
        wifi={businessData.wifi}
        plans={businessData.wifiPlans || []}
        onSelectPlan={(plan) => {
          setWifiModalVisible(false);
          // Navigate to checkout
          (navigation as any).navigate('ServiceDetails', { service: plan, branchId: businessData.id, businessId: businessData.businessId });
        }}
      />
    </View>
  );
}

/* ---------- small components ---------- */

function Stars({ value, small }: { value: number; small?: boolean }) {
  const items = [0, 1, 2, 3, 4];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale: small ? 0.9 : 1 }] }}>
      {items.map(i => (
        <Image key={i} source={STAR_PNG}
          style={{ width: 14, height: 14, marginLeft: i === 0 ? 0 : 4, tintColor: i < value ? '#FFC107' : '#E3E9F3' }} />
      ))}
    </View>
  );
}

function RowTags({ tags, tagIcon }: { tags: Tag[]; tagIcon: (x: Tag['icon']) => any }) {
  const row1 = (tags ?? []).slice(0, 2);
  const row2 = (tags ?? []).slice(2);
  const Row = ({ list }: { list: Tag[] }) => (
    <View style={s.tagsRow}>
      {list.map((t, i) => (
        <React.Fragment key={t.label + i}>
          {i > 0 && <View style={s.midDot} />}
          <View style={s.tagItem}>
            <Image source={tagIcon(t.icon)} style={s.tagIcon} />
            <Text style={s.tagTxt}>{t.label} <Text style={{ color: '#6C7A92' }}>{t.value}</Text></Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
  return (
    <View>
      <Row list={row1} />
      {row2.length > 0 && <Row list={row2} />}
    </View>
  );
}

function CardRow({
  icon,
  title,
  subtitle,
  trailing,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: React.ReactNode;
  trailing?: string;
  onPress?: () => void;
}) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={s.cardRow} onPress={onPress} activeOpacity={0.7}>
      <View style={s.cardRowL}>
        <Text style={s.cardEmoji}>{icon}</Text>
        <View>
          <Text style={s.cardTitle}>{title}</Text>
          {subtitle ? <View style={{ marginTop: 2 }}>{subtitle}</View> : null}
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!!trailing && <Text style={s.trailing}>{trailing}</Text>}
        <Image
          source={CHEVRON_RIGHT}
          style={{ width: 14, height: 14, marginLeft: 8, tintColor: "#1F2533" }}
        />
      </View>
    </Container>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <View style={s.barRow}>
      <Text style={s.barLabel}>{label}</Text>
      <View style={s.barBg}><View style={[s.barFill, { width: `${Math.min(100, Math.max(0, pct))}%` }]} /></View>
      <Text style={s.barCount}>{pct}</Text>
    </View>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <View style={s.pill}><Text style={s.pillTxt}>{children}</Text></View>;
}

function Avatar({ user }: { user: Review['user'] }) {
  if (user.avatarUri) return <Image source={{ uri: user.avatarUri }} style={s.avatar} />;
  return (
    <View style={[s.avatar, { backgroundColor: '#E6ECF5', alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: '#5B6B83', fontWeight: '700' }}>{user.initials ?? user.name.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

/* actions sheet */
function ActionsModal({ visible, onClose, onComplainSupport, onBlockUser, onReportPost }:
  { visible: boolean; onClose?: () => void; onComplainSupport?: () => void; onBlockUser?: () => void; onReportPost?: () => void; }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={sa.overlay}>
        <View style={sa.sheet}>
          <TouchableOpacity onPress={onClose} style={sa.close}><Text style={sa.closeX}>×</Text></TouchableOpacity>
          <Text style={sa.title}>More options</Text>
          <View style={sa.list}>
            <Action emoji="🛟" title="Complain to support" desc="Tell support what went wrong" onPress={onComplainSupport} />
            <Divider />
            <Action emoji="🚫" title="Block user" desc="Hide posts and messages from this user" onPress={onBlockUser} danger />
            <Divider />
            <Action emoji="🚩" title="Report post" desc="Flag this post for review" onPress={onReportPost} danger />
          </View>
          <TouchableOpacity style={sa.primary} onPress={onClose}><Text style={sa.primaryTxt}>Cancel</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
function Action({ emoji, title, desc, onPress, danger }:
  { emoji: string; title: string; desc?: string; onPress?: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={sa.row} onPress={onPress} activeOpacity={0.9}>
      <Text style={sa.emoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[sa.rowTitle, danger && { color: '#B91C1C' }]}>{title}</Text>
        {!!desc && <Text style={sa.rowDesc}>{desc}</Text>}
      </View>
    </TouchableOpacity>
  );
}
function Divider() { return <View style={sa.divider} />; }

function HoursModal({ visible, onClose, hours }: { visible: boolean; onClose: () => void; hours: { dayOfWeek: string; openTime: string; closeTime: string }[] }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={sa.overlay}>
        <View style={sa.sheet}>
          <TouchableOpacity onPress={onClose} style={sa.close}><Text style={sa.closeX}>×</Text></TouchableOpacity>
          <Text style={sa.title}>Opening Hours</Text>
          <View style={[sa.list, { padding: 12 }]}>
            {hours.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#666', padding: 10 }}>No opening hours available.</Text>
            ) : (
              hours.map((h, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i < hours.length - 1 ? 1 : 0, borderBottomColor: '#EEE' }}>
                  <Text style={{ textTransform: 'capitalize', color: '#333', fontFamily: 'RCB-SemiBold' }}>{h.dayOfWeek}</Text>
                  <Text style={{ color: '#666', fontFamily: 'RCB-Regular' }}>{h.openTime} - {h.closeTime}</Text>
                </View>
              ))
            )}
          </View>
          <TouchableOpacity style={sa.primary} onPress={onClose}><Text style={sa.primaryTxt}>Close</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}



function WifiModal({ visible, onClose, wifi, plans, onSelectPlan }: { visible: boolean; onClose: () => void; wifi?: { ssid: string; password?: string }; plans: Service[]; onSelectPlan: (s: Service) => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={sa.overlay}>
        <View style={sa.sheet}>
          <TouchableOpacity onPress={onClose} style={sa.close}><Text style={sa.closeX}>×</Text></TouchableOpacity>
          <Text style={sa.title}>WiFi & Plans</Text>

          <ScrollView style={[sa.list, { maxHeight: 400 }]}>
            <View style={{ padding: 16 }}>
              {/* Credentials */}
              {wifi ? (
                <View style={{ backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#64748B', fontSize: 12 }}>Network Name</Text>
                    <Text style={{ color: '#0F172A', fontSize: 16, fontFamily: 'RCB-Bold' }}>{wifi.ssid}</Text>
                  </View>
                  <View>
                    <Text style={{ color: '#64748B', fontSize: 12 }}>Password</Text>
                    <Text style={{ color: '#0F172A', fontSize: 16, fontFamily: 'RCB-Bold' }}>{wifi.password || 'No password'}</Text>
                  </View>
                </View>
              ) : (
                <Text style={{ color: '#64748B', marginBottom: 16 }}>No WiFi credentials available.</Text>
              )}

              <Text style={{ fontSize: 16, fontFamily: 'RCB-Bold', color: '#0F172A', marginBottom: 10 }}>Available Plans</Text>
              {plans.length === 0 ? (
                <Text style={{ color: '#64748B' }}>No plans available.</Text>
              ) : (
                plans.map((plan) => (
                  <TouchableOpacity
                    key={plan.id}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
                    onPress={() => onSelectPlan(plan)}
                  >
                    <Image source={{ uri: plan.photo || 'https://via.placeholder.com/50' }} style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#EEE', marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontFamily: 'RCB-SemiBold' }}>{plan.title}</Text>
                      <Text style={{ color: '#64748B', fontSize: 12 }}>Click to purchase</Text>
                    </View>
                    <Text style={{ color: '#0F172A', fontFamily: 'RCB-Bold' }}>{plan.price}</Text>
                    <Image source={CHEVRON_RIGHT} style={{ width: 14, height: 14, marginLeft: 8, tintColor: '#94A3B8' }} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>

          <TouchableOpacity style={sa.primary} onPress={onClose}><Text style={sa.primaryTxt}>Close</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* styles */

const BLUE = '#0145FE', TEXT = '#0A1220', MUTED = '#6C7A92', BORDER = '#E6ECF5';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  appBar: { height: 52, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { width: 20, height: 20, tintColor: '#0F172A' },
  title: { fontSize: 16, color: '#0F172A', fontFamily: 'RCB-Bold' },
  appBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F6FF', alignItems: 'center', justifyContent: 'center' },
  iconTxt: { fontSize: 14 },

  heroWrap: { paddingHorizontal: 12, paddingTop: 8 },
  hero: { width: width - 24, height: HERO_H, justifyContent: 'flex-end' },
  heroGrad: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '35%' },
  heroBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#111827D0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  heroBadgeTxt: { color: '#fff', fontSize: 12 },
  dots: { flexDirection: 'row', alignSelf: 'center', marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D8DEEA', marginHorizontal: 3 },
  dotActive: { width: 18, borderRadius: 3, backgroundColor: '#4B5563' },

  card: { marginTop: 10, marginHorizontal: 12, borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placeName: { fontSize: 18, color: '#111827', fontFamily: 'RCB-Bold' },
  distance: { color: '#5E8BFF', fontFamily: 'RCB-SemiBold', fontSize: 14 },
  ratingWrap: { flexDirection: 'row', alignItems: 'center' },
  revCount: { marginLeft: 6, color: '#111827', fontFamily: 'RCB-SemiBold', fontSize: 16 },

  tagsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  midDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#36465F', marginHorizontal: 10 },
  tagItem: { flexDirection: 'row', alignItems: 'center' },
  tagIcon: { width: 16, height: 16, marginRight: 6 },
  tagTxt: { color: '#334155', fontFamily: 'RCB-Medium', fontSize: 15 },

  sectionPad: { paddingHorizontal: 16, paddingTop: 12 },
  h2: { fontSize: 16, color: TEXT, fontFamily: 'RCB-Bold', marginBottom: 6 },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chevTxt: { fontSize: 18, color: '#0F172A' },
  about: { color: '#334155', fontFamily: 'RCB-Regular', lineHeight: 20 },
  inlineLinks: { flexDirection: 'row', gap: 16, marginTop: 10 },
  link: { color: BLUE, fontFamily: 'RCB-SemiBold' },

  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F8' },
  serviceImg: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#EEE' },
  serviceTitle: { color: TEXT, fontFamily: 'RCB-SemiBold' },
  servicePrice: { color: TEXT, fontFamily: 'RCB-Bold', marginTop: 2 },
  serviceLink: { color: '#64748B', fontFamily: 'RCB-Medium', marginTop: 2, fontSize: 12 },
  seeAllRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', marginTop: 8 },
  arrowCircle: { width: 30, height: 30, borderRadius: 15, marginLeft: 10, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },

  cardRow: { marginHorizontal: 16, marginTop: 10, borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardRowL: { flexDirection: 'row', alignItems: 'center' },
  cardEmoji: { fontSize: 18, marginRight: 10 },
  cardTitle: { color: TEXT, fontFamily: 'RCB-SemiBold', fontSize: 15 },
  trailing: { color: '#64748B', fontFamily: 'RCB-Medium' },
  closed: { color: '#B91C1C', fontFamily: 'RCB-SemiBold' },
  muted: { color: MUTED, fontFamily: 'RCB-Regular' },

  addr: { color: TEXT, fontFamily: 'RCB-Regular', marginBottom: 10 },
  mapImg: { width: '100%', height: 180, borderRadius: 12, marginTop: 6 },

  postBtn: { height: 34, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0A1220', alignItems: 'center', justifyContent: 'center' },
  postBtnTxt: { color: '#0A1220', fontFamily: 'RCB-SemiBold' },

  tabs: { flexDirection: 'row', gap: 18, marginTop: 8 },
  tab: { paddingVertical: 6 },
  tabTxtMuted: { color: '#64748B', fontFamily: 'RCB-SemiBold' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: BLUE },
  tabTxtActive: { color: BLUE, fontFamily: 'RCB-SemiBold' },

  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  bigScore: { fontSize: 28, color: TEXT, fontFamily: 'RCB-Bold' },
  smallMuted: { color: MUTED, fontFamily: 'RCB-Regular' },

  barRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  barLabel: { width: 80, color: TEXT, fontFamily: 'RCB-Regular', fontSize: 13 },
  barBg: { flex: 1, height: 6, backgroundColor: '#E6ECF5', borderRadius: 3, marginRight: 8 },
  barFill: { height: 6, backgroundColor: '#3B82F6', borderRadius: 3 },
  barCount: { width: 24, textAlign: 'right', color: TEXT, fontFamily: 'RCB-Medium', fontSize: 12 },

  reviewCard: { borderTopWidth: 1, borderTopColor: '#EEF2F7', paddingTop: 14, marginBottom: 18 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewUserRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEE' },
  revName: { color: TEXT, fontFamily: 'RCB-SemiBold' },
  revPlace: { color: MUTED, fontFamily: 'RCB-Regular', fontSize: 12 },
  revDate: { color: MUTED, fontFamily: 'RCB-Regular', fontSize: 12, marginTop: 4 },
  revTitle: { marginTop: 10, color: TEXT, fontFamily: 'RCB-Bold' },
  revVisited: { marginTop: 2, color: MUTED, fontFamily: 'RCB-Regular', fontSize: 12 },
  revBody: { marginTop: 6, color: '#27364B', fontFamily: 'RCB-Regular', lineHeight: 20 },
  revPhoto: { width: 120, height: 120, borderRadius: 12, marginTop: 10 },
  revFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  helpBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F1F5FF', borderWidth: 1, borderColor: '#D8E0FF' },
  helpTxt: { color: '#1F2A56', fontFamily: 'RCB-SemiBold', fontSize: 13 },

  viewAllBtn: { height: 48, borderWidth: 1, borderColor: '#0A1220', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  viewAllTxt: { color: '#0A1220', fontFamily: 'RCB-SemiBold' },
});

const sa = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 18, paddingBottom: 18, paddingHorizontal: 18 },
  close: {
    position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#EFF4FB', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  closeX: { fontSize: 24, lineHeight: Platform.OS === 'ios' ? 24 : 26, color: '#617291' },
  title: { color: TEXT, fontFamily: 'RCB-Bold', fontSize: 18, textAlign: 'center', marginTop: 6, marginBottom: 8 },
  list: { backgroundColor: '#F8FAFF', borderRadius: 16, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 14, paddingVertical: 14 },
  emoji: { fontSize: 18, marginRight: 10 },
  rowTitle: { color: TEXT, fontFamily: 'RCB-SemiBold', fontSize: 15 },
  rowDesc: { color: MUTED, fontFamily: 'RCB-Regular', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: BORDER },
  primary: { marginTop: 14, height: 48, borderRadius: 24, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  primaryTxt: { color: '#FFF', fontFamily: 'RCB-SemiBold', fontSize: 16 },
});
