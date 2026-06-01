// screens/profile/ProfileScreen.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UpgradeToPremiumModal from "../../../component/UpgradeToPremiumModal"; // adjust if needed

const { width } = Dimensions.get("window");
const IMG_H = Math.round(width * 0.66);

// demo assets; replace with your own as needed
const COVER = { uri: "https://images.unsplash.com/photo-1543770580-5ab180d1a357?w=640&q=80&auto=format&fit=crop" };
const MAP = { uri: "https://maps.googleapis.com/maps/api/staticmap?center=6.4433,3.4213&zoom=16&size=640x320&maptype=roadmap&markers=color:red|6.4433,3.4213" };
const PHOTO = require("../../../assets/feed/user1.png");

type TabKey = "Overview" | "Posts" | "Customers" | "Reviews";

type Visit = {
  id: string;
  name: string;
  area: string;
  city: string;
  thumb: any;
  stars: number;
  reviews: number;
  wifi: string;
};

type Contact = {
  id: string;
  name: string;
  city: string;
  visits: number;
  lastSeen: string;
  avatar?: string;
};

type Post = {
  id: string;
  author: string;
  photos: any[];
  text: string;
  likes: number;
  comments: number;
  rating: number;
  distance: string;
  tags: { icon: "wifi" | "coffee" | "ambience" | "cowork"; label: string; value?: string }[];
  reviewsCount: number;
  timeAgo: string;
};

const VISITS: Visit[] = [
  { id: "v1", name: "Westend Sports Bar", area: "Akowonjo", city: "Lagos", thumb: PHOTO, stars: 5, reviews: 150, wifi: "Wifi unavailable" },
  { id: "v2", name: "The Freaky bar", area: "Ikeja", city: "Lagos", thumb: PHOTO, stars: 5, reviews: 150, wifi: "Wifi unavailable" },
  { id: "v3", name: "Bar ON", area: "Ikeja", city: "Lagos", thumb: PHOTO, stars: 5, reviews: 150, wifi: "Wifi unavailable" },
];

const BASE_TAGS: Post["tags"] = [
  { icon: "wifi", label: "Wifi", value: "(4.5)" },
  { icon: "coffee", label: "Coffee", value: "(5.0)" },
  { icon: "ambience", label: "Ambience", value: "(2.5)" },
  { icon: "cowork", label: "Co-working space", value: "(5.0)" },
];

const POSTS: Post[] = [
  {
    id: "p1",
    author: "Cafe One Chevron",
    photos: [PHOTO, PHOTO, PHOTO],
    text: "This has one of the best cover ever. A place away from home. I could always go back again.",
    likes: 23,
    comments: 23,
    rating: 5,
    distance: "(1.2km)",
    tags: BASE_TAGS,
    reviewsCount: 150,
    timeAgo: "5 minutes ago",
  },
  {
    id: "p2",
    author: "Cornerstone Cafe",
    photos: [PHOTO, PHOTO],
    text: "Outdoor seating and steady power. Solid coffee and great staff.",
    likes: 87,
    comments: 11,
    rating: 4,
    distance: "(2.4km)",
    tags: BASE_TAGS,
    reviewsCount: 96,
    timeAgo: "30 minutes ago",
  },
];

const CUSTOMERS: Contact[] = [
  { id: "1", name: "Jane Doe", city: "Ikeja, Lagos", visits: 10, lastSeen: "visited 2 mins ago", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80&auto=format&fit=crop" },
  { id: "2", name: "Tommy Gbese", city: "Ikeja, Lagos", visits: 10, lastSeen: "visited 2 mins ago", avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=128&q=80&auto=format&fit=crop" },
  { id: "3", name: "Dan Nithingale", city: "Ikeja, Lagos", visits: 10, lastSeen: "visited 2 mins ago" },
  { id: "4", name: "Mariam Bolade", city: "Ikeja, Lagos", visits: 10, lastSeen: "visited 2 mins ago", avatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=128&q=80&auto=format&fit=crop" },
  { id: "5", name: "Adeola Bukola", city: "Ikeja, Lagos", visits: 10, lastSeen: "visited 2 mins ago", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&q=80&auto=format&fit=crop" },
  { id: "6", name: "Susan Obinna", city: "Ikeja, Lagos", visits: 10, lastSeen: "visited 2 mins ago", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&q=80&auto=format&fit=crop" },
];

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const DARK = "#111827";
const DIST = "#5E8BFF";
const BORDER = "#E6ECF5";

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const [tab, setTab] = useState<TabKey>("Overview");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const tabs: TabKey[] = useMemo(() => ["Overview", "Posts", "Customers", "Reviews"], []);
  const idx = useMemo(() => tabs.indexOf(tab), [tab, tabs]);

  const openUpgrade = () => setShowUpgrade(true);
  const closeUpgrade = () => setShowUpgrade(false);

  return (
    <SafeAreaView style={s.root}>
      <FlatList
        data={idx === 1 ? POSTS : idx === 2 ? CUSTOMERS : idx === 3 ? [] : [{ id: "head" } as any]}
        keyExtractor={(x: any) => x.id ?? "head"}
        ListHeaderComponent={
          <>
            {/* FIX: pass navigation prop */}
            <Header navigation={navigation} />
            <BusinessHeader active={tab} onChange={setTab} navigation={navigation} />
            {idx === 0 && <Overview />}
          </>
        }
        renderItem={({ item }: any) =>
          idx === 1 ? (
            <PostCard post={item as Post} />
          ) : idx === 2 ? (
            <CustomerRow item={item as Contact} onMessage={openUpgrade} />
          ) : idx === 3 ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
              <Text style={{ color: "#8EA0BB", textAlign: "center" }}>No reviews yet.</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={idx === 3 ? null : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <UpgradeToPremiumModal
        visible={showUpgrade}
        onUpgrade={closeUpgrade}
        onLater={closeUpgrade}
        onClose={closeUpgrade}
      />
    </SafeAreaView>
  );
}

/* header blocks */

function Header({ navigation }: { navigation: any }) {
  return (
    <View style={s.topRow}>
      <Text style={s.screenTitle}>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("More")}>
        <Text style={s.more}>
          <Text style={{ fontSize: 22 }}>≡</Text> More
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function BusinessHeader({
  active,
  onChange,
  navigation,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  navigation: any;
}) {
  return (
    <View>
      {/* business card */}
      <View style={s.bizCard}>
        <Image source={COVER} style={s.bizImage} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={s.bizName}>Cafe One</Text>
            <Text style={{ fontSize: 16 }}> 🔶</Text>
          </View>
          <Text style={s.bizType}>Co-working space</Text>
          <Text style={s.bizStats}>
            <Text style={s.statStrong}>60</Text> Following{"  "}
            <Text style={s.statStrong}>960</Text> Followers
          </Text>
          <TouchableOpacity
            style={s.editBtn}
            onPress={() => navigation.navigate("BusinessProfile")}
            activeOpacity={0.9}
          >
            <Text style={s.editTxt}>Edit Business details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Tabs tabs={["Overview", "Posts", "Customers", "Reviews"]} active={active} onChange={onChange} />
    </View>
  );
}

/* Overview */

function Overview() {
  return (
    <View>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={s.sectionTitle}>About</Text>
        <Text style={s.about}>
          Mimosa is a one-of-a-kind sensory experience, designed to take the viewer on a journey to connect with Mayan
          cosmology, with Mexico&apos;s most impressive nature sanctuaries…
        </Text>

        <Text style={[s.sectionTitle, { marginTop: 16 }]}>Opening hours</Text>
        <View style={s.rowBetween}>
          <Text style={s.hours}>Closed . Opens 9:00AM</Text>
          <Text style={s.linkArrow}>→</Text>
        </View>

        <Text style={[s.sectionTitle, { marginTop: 16 }]}>Location</Text>
        <Text style={s.address}>24, Admiralty road, Lekki Phase 1</Text>
        <Image source={MAP} style={s.map} />
      </View>

      <RecentVisits />
    </View>
  );
}

/* recent visits */

function RecentVisits() {
  return (
    <View style={{ paddingTop: 6, paddingBottom: 10 }}>
      <View style={s.headerRow}>
        <Text style={s.subTitle}>Your recent visits</Text>
        <TouchableOpacity>
          <Text style={s.link}>View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={VISITS}
        keyExtractor={(x) => x.id}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => <VisitCard v={item} />}
      />
    </View>
  );
}

function VisitCard({ v }: { v: Visit }) {
  return (
    <View style={s.visitCard}>
      <Image source={v.thumb} style={s.visitImg} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
        <TouchableOpacity>
          <Text style={s.reviewLink}>Review</Text>
        </TouchableOpacity>
        <Text style={{ color: "#9FB7FF", fontFamily: "RCB-SemiBold" }}>›</Text>
      </View>
      <Text style={s.visitName} numberOfLines={1}>
        {v.name}
      </Text>
      <Text style={s.visitArea}>
        {v.area}, {v.city}
      </Text>
      <View style={s.visitMetaRow}>
        <Stars value={v.stars} small />
        <Text style={s.visitMetaTxt}>{v.reviews} reviews</Text>
      </View>
      <View style={s.visitMetaRow}>
        <Text style={s.visitWifi}>📶 {v.wifi}</Text>
      </View>
    </View>
  );
}

/* tabs */

function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active?: string;
  onChange?: (t: any) => void;
}) {
  return (
    <View style={s.tabsRow}>
      {tabs.map((t) => {
        const is = t === active;
        return (
          <TouchableOpacity key={t} onPress={() => onChange?.(t)} style={s.tabBtn}>
            <Text style={[s.tabTxt, is && s.tabTxtActive]}>{t}</Text>
            {is && <View style={[s.tabUnderline, { width: 24 }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* item rows */

function CustomerRow({ item, onMessage }: { item: Contact; onMessage?: () => void }) {
  return (
    <View style={s.cardList}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Text style={s.avatarInitials}>{initials(item.name)}</Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.meta}>{item.city}</Text>
          <Text style={s.meta}>{plural(item.visits, "visit")}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={s.seen}>{item.lastSeen}</Text>
          <TouchableOpacity style={s.msgBtn} activeOpacity={0.9} onPress={onMessage}>
            <Text style={s.msgText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* post card */

function PostCard({ post }: { post: Post }) {
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const fmt = (n: number) => {
    if (n < 1000) return String(n);
    if (n < 10000) return (n / 1000).toFixed(1) + "k";
    return Math.round(n / 1000) + "k";
  };

  const onScroll = (e: any) => {
    const off = e.nativeEvent.contentOffset.x;
    setIdx(Math.round(off / width));
  };

  return (
    <View style={s.card}>
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {post.photos.map((p, i) => (
            <ImageBackground key={i} source={p} style={s.image} imageStyle={s.imageRadius}>
              <TouchableOpacity style={s.bookmarkBtn}>
                <Image source={require("../../../assets/feed/bookmark.png")} style={{ width: 18, height: 18, tintColor: "#1F2533" }} />
              </TouchableOpacity>
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)"]} style={s.imgGradient} />
            </ImageBackground>
          ))}
        </ScrollView>

        {post.photos.length > 1 && (
          <View style={s.dotsRow}>
            {post.photos.map((_, i) => (
              <View key={i} style={[s.dot, i === idx && s.dotActive]} />
            ))}
          </View>
        )}
      </View>

      <View style={s.actionsRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconText icon={require("../../../assets/feed/like.png")} label={fmt(post.likes)} />
          <View style={{ width: 18 }} />
          <IconText icon={require("../../../assets/feed/comment.png")} label={fmt(post.comments)} />
        </View>
        <Stars value={post.rating} />
      </View>

      <Text style={s.text}>{post.text}</Text>

      <View style={s.detailCard}>
        <View style={s.topRow}>
          <View style={{ flexShrink: 1, paddingRight: 8 }}>
            <Text style={s.titleDark} numberOfLines={1}>
              {post.author}
            </Text>
            <Text style={s.distanceBlue}>{post.distance}</Text>
          </View>
          <View style={s.ratingRight}>
            <Stars value={post.rating} />
            <Text style={s.countDark}>{post.reviewsCount}</Text>
          </View>
        </View>

        <TagRows tags={post.tags} />

        <View style={s.visitRow}>
          <View />
          <TouchableOpacity>
            <Text style={s.visitLink}>Visit profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.time}>{post.timeAgo}</Text>
    </View>
  );
}

function TagRows({
  tags,
}: {
  tags: { icon: "wifi" | "coffee" | "ambience" | "cowork"; label: string; value?: string }[];
}) {
  const first = tags.slice(0, 2);
  const second = tags.slice(2);

  return (
    <View style={{ marginTop: 8 }}>
      <View style={s.tagRowInline}>
        {first.map((t, i) => (
          <React.Fragment key={`r1-${t.label}-${i}`}>
            {i > 0 && <View style={s.bulletDot} />}
            <TagItem t={t} />
          </React.Fragment>
        ))}
      </View>
      {second.length > 0 && (
        <View style={[s.tagRowInline, { marginTop: 6 }]}>
          {second.map((t, i) => (
            <React.Fragment key={`r2-${t.label}-${i}`}>
              {i > 0 && <View style={s.bulletDot} />}
              <TagItem t={t} />
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

function TagItem({
  t,
}: {
  t: { icon: "wifi" | "coffee" | "ambience" | "cowork"; label: string; value?: string };
}) {
  const map: { [k in "wifi" | "coffee" | "ambience" | "cowork"]: any } = {
    wifi: require("../../../assets/feed/wifi.png"),
    coffee: require("../../../assets/feed/coffee.png"),
    ambience: require("../../../assets/feed/ambience.png"),
    cowork: require("../../../assets/feed/cowork.png"),
  };

  return (
    <View style={s.tagInline}>
      <Image source={map[t.icon]} style={s.tagIconGreen} />
      <Text style={s.tagTextDark}>
        {t.label} {t.value ?? ""}
      </Text>
    </View>
  );
}

/* atoms */

function Stars({ value, small }: { value: number; small?: boolean }) {
  const items = [0, 1, 2, 3, 4];
  return (
    <View style={[s.starsRow, small && { transform: [{ scale: 0.9 }] }]}>
      {items.map((i) => (
        <Image
          key={i}
          source={require("../../../assets/feed/star.png")}
          style={[s.star, { tintColor: i < value ? "#FFC107" : "#E3E9F3" }]}
        />
      ))}
    </View>
  );
}

function IconText({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={s.iconText}>
      <Image source={icon} style={[s.icon, { tintColor: "#A5B1C6" }]} />
      <Text style={s.iconLabel}>{label}</Text>
    </View>
  );
}

/* utils */

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/* styles */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  /* header */
  topRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  screenTitle: { fontSize: 24, color: "#0A1220", fontWeight: "700" },
  more: { fontSize: 16, color: "#44536B" },

  /* business card */
  bizCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  bizImage: { width: 78, height: 78, borderRadius: 12 },
  bizName: { fontSize: 18, color: TEXT, fontWeight: "700" },
  bizType: { fontSize: 13, color: "#8A94A6", marginTop: 2 },
  bizStats: { fontSize: 13, color: "#8A94A6", marginTop: 6 },
  statStrong: { color: TEXT, fontWeight: "700" },
  editBtn: {
    marginTop: 10,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#EDF3FF",
    borderWidth: 1,
    borderColor: "#BDD1FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  editTxt: { color: BLUE, fontWeight: "700" },

  /* tabs */
  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    gap: 18,
    marginTop: 14,
    marginBottom: 8,
  },
  tabBtn: { paddingBottom: 6 },
  tabTxt: { color: "#62718C", fontSize: 16, fontWeight: "700" },
  tabTxtActive: { color: TEXT },
  tabUnderline: { marginTop: 6, height: 3, backgroundColor: BLUE, borderRadius: 2 },

  /* overview */
  sectionTitle: { fontSize: 16, fontWeight: "700", color: TEXT, marginHorizontal: 16, marginTop: 8 },
  about: { fontSize: 14, color: "#44536B", marginHorizontal: 16, marginTop: 6, lineHeight: 20 },
  rowBetween: {
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hours: { fontSize: 14, color: TEXT },
  linkArrow: { fontSize: 16, color: TEXT },
  address: { fontSize: 14, color: TEXT, marginHorizontal: 16, marginTop: 6 },
  map: { marginHorizontal: 16, marginTop: 10, width: "100%", height: 180, borderRadius: 12, backgroundColor: "#EAF0FA" },

  /* recent visits */
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: { color: TEXT, fontSize: 18, fontWeight: "700" },
  link: { color: BLUE, fontWeight: "700" },

  visitCard: {
    width: Math.round(width * 0.55),
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6EDF7",
    padding: 10,
  },
  visitImg: { width: "100%", height: 94, borderRadius: 8 },
  reviewLink: { color: BLUE, fontWeight: "700" },
  visitName: { color: TEXT, fontWeight: "700", marginTop: 6 },
  visitArea: { color: "#7D8CA7", marginTop: 2 },
  visitMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  visitMetaTxt: { color: "#7D8CA7", marginLeft: 6 },
  visitWifi: { color: "#7D8CA7" },

  /* post card */
  card: { backgroundColor: "#fff", marginHorizontal: 12, marginBottom: 18, borderRadius: 16 },
  image: { width: width - 24, height: IMG_H, justifyContent: "flex-end" },
  imageRadius: { borderRadius: 12 },
  bookmarkBtn: {
    position: "absolute",
    right: 14,
    top: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFFDD",
    alignItems: "center",
    justifyContent: "center",
  },
  imgGradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: 120 },
  dotsRow: { position: "absolute", bottom: 10, alignSelf: "center", flexDirection: "row", gap: 6, left: 0, right: 0, justifyContent: "center" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D8DEEA" },
  dotActive: { width: 18, borderRadius: 3, backgroundColor: "#FFFFFF" },

  actionsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginTop: 10, justifyContent: "space-between" },
  iconText: { flexDirection: "row", alignItems: "center" },
  icon: { width: 18, height: 18, tintColor: "#A5B1C6", marginRight: 6 },
  iconLabel: { color: "#94A3B8" },

  text: { color: "#334155", fontSize: 13.5, lineHeight: 20, marginTop: 10, marginHorizontal: 12 },

  detailCard: {
    marginTop: 10,
    alignSelf: "stretch",
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  titleDark: { color: DARK, fontSize: 18, fontWeight: "700" },
  distanceBlue: { marginTop: 2, color: DIST, fontSize: 14, fontWeight: "700" },
  ratingRight: { flexDirection: "row", alignItems: "center" },
  countDark: { marginLeft: 6, color: DARK, fontSize: 16, fontWeight: "700" },

  tagRowInline: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#36465F", marginHorizontal: 10 },
  tagInline: { flexDirection: "row", alignItems: "center" },
  tagIconGreen: { width: 16, height: 16, marginRight: 6, resizeMode: "contain" },
  tagTextDark: { color: "#334155", fontSize: 15, fontWeight: "500" },

  visitRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  visitLink: { color: "#36465F", fontSize: 16, fontWeight: "700", textDecorationLine: "underline" },

  time: { color: "#92A2BA", fontSize: 12, marginTop: 8, marginHorizontal: 12, marginBottom: 6 },

  /* customer list */
  cardList: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginTop: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#EEE" },
  avatarFallback: { alignItems: "center", justifyContent: "center", backgroundColor: "#EDF2FF" },
  avatarInitials: { color: "#3B82F6", fontWeight: "700" },
  name: { fontSize: 16, color: TEXT, fontWeight: "700" },
  meta: { fontSize: 13, color: "#8A94A6", marginTop: 2 },
  seen: { fontSize: 12, color: "#8A94A6", marginBottom: 8, textAlign: "right" },
  msgBtn: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#EDF3FF",
    borderWidth: 1,
    borderColor: "#BDD1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  msgText: { color: BLUE, fontWeight: "700", fontSize: 13 },

  /* stars */
  starsRow: { flexDirection: "row", alignItems: "center" },
  star: { width: 16, height: 16, marginRight: 2 },
});
