import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  image: any;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Welcome to OTG Africa",
    description:
      "Discover free & shared WiFi around you. Let's show you how to get started.",
    buttonLabel: "Discover",
    image: require("../assets/onboarding1.png"),
  },
  {
    id: "2",
    title: "Find WiFi",
    description: "Tap Discover to see all WiFi-enabled locations near you.",
    buttonLabel: "Discover",
    image: require("../assets/onboarding2.png"),
  },
  {
    id: "3",
    title: "Connect Easily",
    description: "Select a spot, walk in, and connect seamlessly to WiFi.",
    buttonLabel: "Discover a WiFi spot",
    image: require("../assets/onboarding3.png"),
  },
  {
    id: "4",
    title: "Earn Rewards",
    description:
      "Leave a quick review after your visit and get instant vouchers for your next use.",
    buttonLabel: "Review a business now",
    image: require("../assets/onboarding4.png"),
  },
];

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export default function WelcomeModal({ visible, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onClose?.();
    }
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Close button */}
          <TouchableOpacity
            style={s.close}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Slides */}
          <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View style={[s.slide, { width }]}>
                <Image
                  source={item.image}
                  style={s.image}
                  resizeMode="contain"
                />
                <Text style={s.title}>{item.title}</Text>
                <Text style={s.body}>{item.description}</Text>

                <TouchableOpacity style={s.cta} onPress={handleNext}>
                  <Text style={s.ctaText}>{item.buttonLabel}</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Pagination Dots */}
          <View style={s.pagination}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[s.dot, currentIndex === i && s.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- styles ---------------- */
const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingBottom: 36,
    alignItems: "center",
  },
  close: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  closeX: {
    fontSize: 24,
    lineHeight: Platform.OS === "ios" ? 24 : 26,
    color: "#617291",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  image: {
    width: 220,
    height: 180,
    marginBottom: 20,
  },
  title: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  body: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
    marginBottom: 24,
  },
  cta: {
    backgroundColor: BLUE,
    borderRadius: 27,
    height: 52,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D6E0",
  },
  dotActive: {
    backgroundColor: BLUE,
  },
});
