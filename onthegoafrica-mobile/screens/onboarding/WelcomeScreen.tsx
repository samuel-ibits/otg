import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Get WiFi Anywhere, On the Go!",
    description:
      "Gain access to our extensive network of free wifi locations, across your city.",
    image: require("../../assets/onboarding/welcome/slide1.png"),
  },
  {
    id: 2,
    title: "Earn Rewards From Your Feedback",
    description:
      "Whether you prefer a serene space or a lively atmosphere, OTG got you covered.",
    image: require("../../assets/onboarding/welcome/slide2.png"),
  },
  {
    id: 3,
    title: "Join or Create Your Own Community",
    description:
      "Find and chat with users just like you. Share spots, get tips, and stay connected.",
    image: require("../../assets/onboarding/welcome/slide3.png"),
  },
  {
    id: 4,
    title: "Monetise Your Wi-Fi and Grow Your Sales",
    description:
      "Sell your products, attract customers, and earn from your Wi-Fi with access real-time insights.",
    image: require("../../assets/onboarding/welcome/slide4.png"),
  },
  {
    id: 5,
    title: "Sell Out your Next Event Faster",
    description:
      "List events and manage ticket sales seamlessly through your OTG business dashboard.",
    image: require("../../assets/onboarding/welcome/slide5.png"),
  },
];

interface WelcomeScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSignUp,
  onSignIn,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={slide.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            <View style={styles.contentContainer}>
              {/* Pagination Dots */}
              <View style={styles.pagination}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, currentIndex === i && styles.activeDot]}
                  />
                ))}
              </View>

              {/* Text Content */}
              <View style={styles.textContent}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onSignUp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Get started</Text>
                </TouchableOpacity>

                <View style={styles.loginRow}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={onSignIn}>
                    <Text style={styles.loginLink}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
  },
  imageContainer: {
    width: "94%",
    height: height * 0.6,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#0066FF",
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#0066FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 14,
    color: "#0066FF",
    fontWeight: "600",
  },
});

export default WelcomeScreen;
