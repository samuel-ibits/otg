import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Slide = {
  image: any;
  pills: string[];
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    image: require("../../assets/onboarding/slide1.png"),
    pills: [
      "Next cafe has great reviews",
      "23 free wifi locations found nearby",
    ],
    title: "Get free wifi\nOn the Go!",
    subtitle:
      "Join and gain access to our extensive network of free wifi locations, across your city.",
  },
  {
    image: require("../../assets/onboarding/slide2.png"),
    pills: ["Find your ideal spot"],
    title: "Find the best spaces to work and connect.",
    subtitle: "Serene or lively—find your ideal spot with OTG.",
  },
  {
    image: require("../../assets/onboarding/slide3.png"),
    pills: ["Chat!", "Create activities and meetups", "Make new friends!"],
    title: "A community for everyone",
    subtitle:
      "Connect with interesting people. No matter who you are or what you do, there's a community just for you.",
  },
];

export default function OnboardingScreen({
  onSignUp,
  onSignIn,
}: {
  onSignUp?: () => void;
  onSignIn?: () => void;
}) {
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) setIndex(i);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((s, i) => (
          <View key={i} style={{ width, height }}>
            <ImageBackground
              source={s.image}
              style={styles.bg}
              resizeMode="cover"
            >
              {/* Speech bubbles */}
              <View style={styles.pillsWrap}>
                {s.pills.map((p, j) => (
                  <View key={j} style={styles.pill}>
                    <Text style={styles.pillText}>{p}</Text>
                  </View>
                ))}
              </View>

              {/* Bottom gradient + content */}
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.9)", "#FFFFFF"]}
                locations={[0.45, 0.7, 1]}
                style={styles.gradient}
              />
              <View style={styles.bottomCard}>
                <Text style={styles.title}>{s.title}</Text>
                <Text style={styles.subtitle}>{s.subtitle}</Text>

                {/* Dots */}
                <View style={styles.dotsRow}>
                  {slides.map((_, di) => (
                    <View
                      key={di}
                      style={[styles.dot, di === index && styles.dotActive]}
                    />
                  ))}
                </View>

                {/* CTA */}
                <TouchableOpacity
                  onPress={onSignUp}
                  activeOpacity={0.9}
                  style={styles.cta}
                >
                  <Text style={styles.ctaText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.signIn}>
                  I have an Account,{" "}
                  <Text
                    style={styles.signInLink}
                    onPress={onSignIn}
                    suppressHighlighting
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const BLUE = "#0145FE";
const TEXT_DARK = "#0A1220";
const TEXT_MUTED = "#6C7A92";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  bg: { flex: 1, justifyContent: "flex-end" },
  pillsWrap: {
    position: "absolute",
    top: height * 0.36,
    right: 18,
    left: 18,
    gap: 14,
  },
  pill: {
    alignSelf: "flex-end",
    backgroundColor: "#F1EFF8",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },
  pillText: { fontSize: 16, color: TEXT_DARK, fontFamily: "RCB-Medium" },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 1,
  },
  bottomCard: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 18,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: TEXT_DARK,
    textAlign: "center",
    fontFamily: "RCB-Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: "center",
    fontFamily: "RCB-Regular",
    lineHeight: 22,
    marginHorizontal: 6,
  },
  dotsRow: {
    marginTop: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D7DEEA",
  },
  dotActive: {
    width: 22,
    borderRadius: 4,
    backgroundColor: BLUE,
  },
  cta: {
    marginTop: 6,
    backgroundColor: BLUE,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "RCB-SemiBold",
  },
  signIn: {
    textAlign: "center",
    marginTop: 14,
    color: TEXT_MUTED,
    fontFamily: "RCB-Regular",
  },
  signInLink: {
    color: BLUE,
    fontFamily: "RCB-SemiBold",
  },
});
