import React from "react";
import { Image, TouchableOpacity, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

export default function OnboardingScreen2({ onSignUp, onSignIn }): {
  onSignUp?: () => void;
  onSignIn?: () => void;
} {
  const [index, setIndex] = React.useState(0);
  return (
    <Onboarding
      bottomBarHighlight={false}
      showSkip={false}
      onDone={onSignUp}
      onSkip={onSignIn}
      nextLabel="Next"
      DoneButtonComponent={() => (
        <TouchableOpacity
          style={{
            backgroundColor: "#0a84ff",
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderRadius: 20,
          }}
          onPress={onSignUp}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Get Started</Text>
        </TouchableOpacity>
      )}
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/onboarding1.png")}
              style={{ width: 250, height: 250, resizeMode: "contain" }}
            />
          ),
          title: "Welcome to OTG Africa",
          subtitle:
            "Discover free & shared WiFi around you. Let’s show you how to get started.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/onboarding2.png")}
              style={{ width: 250, height: 250, resizeMode: "contain" }}
            />
          ),
          title: "Find WiFi",
          subtitle: "Tap Discover to see all WiFi-enabled locations near you.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/onboarding3.png")}
              style={{ width: 250, height: 250, resizeMode: "contain" }}
            />
          ),
          title: "Connect Easily",
          subtitle: "Select a spot, walk in, and connect seamlessly to WiFi.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("../../assets/onboarding4.png")}
              style={{ width: 250, height: 250, resizeMode: "contain" }}
            />
          ),
          title: "Earn Rewards",
          subtitle:
            "Leave a quick review after your visit and get instant vouchers for your next use.",
        },
      ]}
    />
  );
}
