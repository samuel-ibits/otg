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
import { useNavigation } from "@react-navigation/native";

import SkillsBlock from "./SkillsBlock";
import HobbiesBlock from "./HobbiesBlock";
import PlacesToVisitBlock from "./PlacesToVisitBlock";

const { width } = Dimensions.get("window");
const IMG_H = Math.round(width * 0.66);

const PHOTO = require("../../assets/feed/photo1.png");

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

const VISITS: Visit[] = [
  { id: "v1", name: "Westend Sports Bar", area: "Akowonjo", city: "Lagos", thumb: PHOTO, stars: 5, reviews: 150, wifi: "Wifi unavailable" },
  { id: "v2", name: "The Freaky bar", area: "Ikeja", city: "Lagos", thumb: PHOTO, stars: 5, reviews: 150, wifi: "Wifi unavailable" },
  { id: "v3", name: "Bar ON", area: "Ikeja", city: "Lagos", thumb: PHOTO, stars: 5, reviews: 150, wifi: "Wifi unavailable" },
];

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

const BASE_TAGS = [
  { icon: "wifi" as const, label: "Wifi", value: "(4.5)" },
  { icon: "coffee" as const, label: "Coffee", value: "(5.0)" },
  { icon: "ambience" as const, label: "Ambience", value: "(2.5)" },
  { icon: "cowork" as const, label: "Co-working space", value: "(5.0)" },
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
  {
    id: "p3",
    author: "The Rooftop Bar",
    photos: [PHOTO],
    text: "Sunset views. Loud music after 8pm, plan accordingly.",
    likes: 12,
    comments: 4,
    rating: 4,
    distance: "(4.1km)",
    tags: BASE_TAGS,
    reviewsCount: 58,
    timeAgo: "1 hour ago",
  },
];

const BOOKMARKS: Post[] = [
  {
    id: "b1",
    author: "Latte Lane",
    photos: [PHOTO, PHOTO],
    text: "Quiet, good Wi-Fi. My go-to for deep work.",
    likes: 245,
    comments: 38,
    rating: 5,
    distance: "(900m)",
    tags: BASE_TAGS,
    reviewsCount: 312,
    timeAgo: "Yesterday",
  },
];

export default function ProfileScreen() {
  const [tab, setTab] = useState<"Posts" | "Reviews" | "Skills & Hobbies" | "Bookmarks">("Posts");
  const tabs = useMemo(() => ["Posts", "Reviews", "Skills & Hobbies", "Bookmarks"] as const, []);

  const renderSkillsAndHobbies = () => (
    <View style={{ paddingHorizontal: 16, gap: 16, marginTop: 6 }}>
      <SkillsBlock items={["SEO Marketing", "MS Word"]} onEdit={() => {}} />
      <HobbiesBlock items={["Singing 🎤", "Running 🏃🏻‍♂️", "Cooking 🥘", "Food tasting 👅"]} onEdit={() => {}} />
      <PlacesToVisitBlock items={["Cafe ☕", "Co-workspace 🧳", "Beach house 🏖️", "Hotel 🏢", "Bar 🍺"]} onEdit={() => {}} />
    </View>
  );

  const listData = tab === "Posts" ? POSTS : tab === "Bookmarks" ? BOOKMARKS : [];

  return (
    <SafeAreaView style={s.root}>
      {tab === "Skills & Hobbies" ? (
        <FlatList
          data={[{ id: "head" }]}
          keyExtractor={(x: any) => x.id}
          ListHeaderComponent={
            <>
              <Header />
              <ProfileHeader />
              <RecentVisits />
              <Tabs tabs={tabs as any} active={tab} onChange={setTab as any} />
            </>
          }
          renderItem={() => renderSkillsAndHobbies()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(x) => (x as any).id}
          ListHeaderComponent={
            <>
              <Header />
              <ProfileHeader />
              <RecentVisits />
              <Tabs tabs={tabs as any} active={tab} onChange={setTab as any} />
            </>
          }
          renderItem={({ item }) => <PostCard post={item as Post} />}
          ListEmptyComponent={
            tab === "Reviews" ? (
              <View style={{ padding: 24 }}>
                <Text style={{ color: "#8EA0BB", textAlign: "center" }}>No reviews yet.</Text>
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

/* header blocks */

function Header() {
  const navigation = useNavigation();
  return (
    <View style={s.topRow}>
      <Text style={s.screenTitle}>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("More" as never)}>
        <Text style={s.more}>
          <Text style={{ fontSize: 22 }}>≡</Text> More
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileHeader() {
  const navigation = useNavigation();
  return (
    <View style={s.profWrap}>
      <Image source={PHOTO} style={s.profCover} />
      <View style={{ marginTop: 12 }}>
        <Text style={s.fullName}>Jane Doe</Text>
        <View style={s.followRow}>
          <Text style={s.followNum}>60</Text>
          <Text style={s.followLbl}>Following</Text>
          <Text style={s.followNum}> 960</Text>
          <Text style={s.followLbl}> Followers</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("EditProfile" as never)} style={s.editBtn}>
          <Text style={s.editTxt}>Edit Profile</Text>
        </TouchableOpacity>

        <Text style={s.bio}>
          "Lorem ipsum dolor sit amet consectetur. Nam eget purus aliquet justo. Id cras eget convallis".
        </Text>

        <InfoRow icon="💼" text="Digital Marketer" />
        <InfoRow icon="📍" text="Lagos, Nigeria" />
        <InfoRow icon="⏰" text="Joined Jan 2024" />

        <View style={s.divider} />
      </View>
    </View>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoIcon}>{icon}</Text>
      <Text style={s.infoText}>{text}</Text>
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
  active: string;
  onChange: (t: any) => void;
}) {
  return (
    <View style={s.tabsRow}>
      {tabs.map((t) => {
        const is = t === active;
        return (
          <TouchableOpacity key={t} onPress={() => onChange(t)} style={s.tabBtn}>
            <Text style={[s.tabTxt, is && s.tabTxtActive]}>{t}</Text>
            {is && <View style={s.tabUnderline} />}
          </TouchableOpacity>
        );
      })}
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
                <Image source={require("../../assets/feed/bookmark.png")} style={{ width: 18, height: 18, tintColor: "#1F2533" }} />
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
          <IconText icon={require("../../assets/feed/like.png")} label={fmt(post.likes)} />
          <View style={{ width: 18 }} />
          <IconText icon={require("../../assets/feed/comment.png")} label={fmt(post.comments)} />
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
    wifi: require("../../assets/feed/wifi.png"),
    coffee: require("../../assets/feed/coffee.png"),
    ambience: require("../../assets/feed/ambience.png"),
    cowork: require("../../assets/feed/cowork.png"),
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
          source={require("../../assets/feed/star.png")}
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

/* styles */

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const DARK = "#111827";
const DIST = "#5E8BFF";
const BORDER = "#E6ECF5";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  topRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenTitle: { color: "#0F1929", fontFamily: "RCB-Bold", fontSize: 30 },
  more: { color: "#3B64FF", fontFamily: "RCB-SemiBold", fontSize: 18 },

  profWrap: { paddingHorizontal: 16, paddingTop: 6 },
  profCover: { width: 96, height: 96, borderRadius: 48 },
  fullName: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 22, marginTop: 10 },
  followRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  followNum: { color: TEXT, fontFamily: "RCB-Bold" },
  followLbl: { color: "#5B6B86", fontFamily: "RCB-Medium" },
  editBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D9E4FF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editTxt: { color: BLUE, fontFamily: "RCB-SemiBold" },
  bio: { color: "#5B6B86", fontFamily: "RCB-Regular", marginTop: 12, lineHeight: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  infoIcon: { width: 20, textAlign: "center", marginRight: 8 },
  infoText: { color: TEXT, fontFamily: "RCB-Medium" },
  divider: { marginTop: 14, height: 1, backgroundColor: BORDER },

  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 18 },
  link: { color: "#3B64FF", fontFamily: "RCB-SemiBold" },

  visitCard: {
    width: Math.round(width * 0.55),
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6EDF7",
    padding: 10,
  },
  visitImg: { width: "100%", height: 94, borderRadius: 8 },
  reviewLink: { color: "#3B64FF", fontFamily: "RCB-SemiBold" },
  visitName: { color: TEXT, fontFamily: "RCB-SemiBold", marginTop: 6 },
  visitArea: { color: "#7D8CA7", fontFamily: "RCB-Regular", marginTop: 2 },
  visitMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  visitMetaTxt: { color: "#7D8CA7", marginLeft: 6, fontFamily: "RCB-Regular" },
  visitWifi: { color: "#7D8CA7", fontFamily: "RCB-Regular" },

  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    gap: 18,
    marginTop: 4,
    marginBottom: 10,
  },
  tabBtn: { paddingBottom: 6 },
  tabTxt: { color: "#62718C", fontFamily: "RCB-SemiBold", fontSize: 18 },
  tabTxtActive: { color: TEXT },
  tabUnderline: { marginTop: 6, height: 3, backgroundColor: "#3B64FF", borderRadius: 2 },

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
  dotsRow: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D8DEEA" },
  dotActive: { width: 18, borderRadius: 3, backgroundColor: "#FFFFFF" },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 10,
    justifyContent: "space-between",
  },
  iconText: { flexDirection: "row", alignItems: "center" },
  icon: { width: 18, height: 18, tintColor: "#A5B1C6", marginRight: 6 },
  iconLabel: { color: "#94A3B8", fontFamily: "RCB-Medium" },

  text: {
    color: "#334155",
    fontFamily: "RCB-Regular",
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 10,
    marginHorizontal: 12,
  },

  detailCard: {
    marginTop: 10,
    alignSelf: "stretch",
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E6ECF5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  titleDark: { color: DARK, fontFamily: "RCB-Bold", fontSize: 18 },
  distanceBlue: { marginTop: 2, color: DIST, fontFamily: "RCB-SemiBold", fontSize: 14 },
  ratingRight: { flexDirection: "row", alignItems: "center" },
  countDark: { marginLeft: 6, color: DARK, fontFamily: "RCB-SemiBold", fontSize: 16 },

  tagRowInline: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#36465F", marginHorizontal: 10 },
  tagInline: { flexDirection: "row", alignItems: "center" },
  tagIconGreen: { width: 16, height: 16, marginRight: 6, resizeMode: "contain" },
  tagTextDark: { color: "#334155", fontFamily: "RCB-Medium", fontSize: 15 },

  visitRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  visitLink: {
    color: "#36465F",
    fontFamily: "RCB-SemiBold",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  time: { color: "#92A2BA", fontFamily: "RCB-Regular", fontSize: 12, marginTop: 8, marginHorizontal: 12, marginBottom: 6 },

  starsRow: { flexDirection: "row", alignItems: "center" },
  star: { width: 14, height: 14, marginLeft: 4 },
});
