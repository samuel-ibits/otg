// screens/profile/AboutScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const BACK_ICON = require("../../assets/icons/back.png");
const OTG_LOGO = require("../../assets/brand/otg-africa.png"); // OnTheGo Africa logo

export default function AboutScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.root}>
      {/* Top Bar */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={BACK_ICON} style={s.back} />
        </TouchableOpacity>
        <Text style={s.title}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Image source={OTG_LOGO} style={s.logo} />

        <Text style={s.sectionH}>What is OTG?</Text>
        <Text style={s.body}>
          Egestas odio integer nisl curabitur diam eget. Varius cursus vivamus sed diam enim. Porttitor urna risus neque
          sed sapien morbi lacinia fringilla fusce. Et duis iaculis amet facilisis enim egestas non. Aliquam lectus arcu
          proin ornare vitae amet varius sed. Pretium risus.
        </Text>
        <Text style={s.body}>
          Egestas odio integer nisl curabitur diam eget. Varius cursus vivamus sed diam enim. Porttitor urna risus neque
          sed sapien morbi lacinia fringilla fusce. Et duis iaculis amet facilisis enim egestas non. Aliquam lectus arcu
          proin ornare vitae amet varius sed. Pretium risus.
        </Text>

        <Text style={[s.sectionH, { marginTop: 18 }]}>How to use OTG</Text>
        <Text style={s.body}>
          Egestas odio integer nisl curabitur diam eget. Varius cursus vivamus sed diam enim. Porttitor urna risus neque
          sed sapien morbi lacinia fringilla fusce. Et duis iaculis amet facilisis enim egestas non. Aliquam lectus arcu
          proin ornare vitae amet varius sed. Pretium risus.
        </Text>
        <Text style={s.body}>
          Egestas odio integer nisl curabitur diam eget. Varius cursus vivamus sed diam enim. Porttitor urna risus neque
          sed sapien morbi lacinia fringilla fusce. Et duis iaculis amet facilisis enim egestas non. Aliquam lectus arcu
          proin ornare vitae amet varius sed. Pretium risus.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* styles */
const TEXT = "#0A1220";
const BORDER = "#E6ECF5";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  back: { width: 22, height: 22, tintColor: TEXT, resizeMode: "contain" },
  title: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 18 },

  container: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28 },
  logo: { width: '100%', height: 56, resizeMode: "contain", marginHorizontal:'auto',marginBottom: 18 },
  sectionH: { color: TEXT, fontFamily: "RCB-Bold", fontSize: 18, marginBottom: 6 },
  body: {
    color: "#617089",
    fontFamily: "RCB-Regular",
    lineHeight: 20,
    marginBottom: 12,
  },
});
