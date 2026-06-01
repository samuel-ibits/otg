// screens/business/BusinessProfileSetupScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import BusinessSetupCompletedModal from "./../../../component/BusinessSetupCompletedModal";

const CHEVRON = require("../../../assets/icons/Right.png");

type StepKey =
  | "businessDetails"
  | "businessVerification"
  | "hours"
  | "socials"
  | "wifi"
  | "rewards";

type RouteParams = {
  /** child screens can set this before navigating back */
  markDone?: StepKey;
};

export default function BusinessProfileSetupScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // local completion state
  const [completed, setCompleted] = React.useState<Record<StepKey, boolean>>({
    businessDetails: false,
    businessVerification: false,
    hours: false,
    socials: false,
    wifi: false,
    rewards: false,
  });

  // modal state
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  // when returning from a child, mark that step as done and all preceding steps
  useFocusEffect(
    React.useCallback(() => {
      const params: RouteParams | undefined = route.params;
      if (params?.markDone) {
        setCompleted((prev) => {
          const completedStepIndex = steps.findIndex((s) => s.key === params.markDone);
          if (completedStepIndex === -1) return prev;
          
          // Create new state with current step and all preceding steps marked as done
          const newCompleted = { ...prev };
          for (let i = 0; i <= completedStepIndex; i++) {
            newCompleted[steps[i].key] = true;
          }
          
          return newCompleted;
        });
        // clear the param so it doesn't re-trigger
        navigation.setParams({ markDone: undefined });
      }
    }, [navigation, route.params, steps])
  );

  // single source of truth for steps + navigation targets
  const steps: { key: StepKey; title: string; target: string }[] = [
    { key: "businessDetails",      title: "Business Details",           target: "BusinessDetails" },
    { key: "businessVerification", title: "Business Verification",      target: "BusinessVerification" },
    { key: "hours",                title: "Opening and closing time",   target: "BusinessHours" },
    { key: "socials",              title: "Socials",                    target: "BusinessSocials" },
    { key: "wifi",                 title: "WiFi Details",               target: "BusinessWifi" },
    { key: "rewards",              title: "Reward voucher",             target: "BusinessRewards" },
  ];

  const allDone = steps.every((s) => completed[s.key]);

  const go = (target: string, step: StepKey) => {
    // navigate to the specific editor screen
    // child screen should call:
    // navigation.navigate('BusinessProfileSetup', { markDone: stepKey })
    navigation.navigate(target, { stepKey: step });
  };

  const handleSubmit = () => {
    if (allDone) {
      // Show success modal instead of navigating immediately
      setShowSuccessModal(true);
    }
  };

  const handleModalDone = () => {
    setShowSuccessModal(false);
    // Navigate to business navigator/main app
    navigation.navigate("BusinessNavigator");
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Setup your Business profile</Text>
        <Text style={s.sub}>Complete your business profile</Text>
        {allDone && (
          <Text style={s.completionText}>All steps completed! You can now submit your profile.</Text>
        )}
      </View>

      <FlatList
        data={steps}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const done = completed[item.key];
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[s.row, done && s.rowDone]}
              onPress={() => go(item.target, item.key)}
            >
              <View style={[s.badge, done && s.badgeDone]}>
                <Text style={[s.badgeTxt, done && s.badgeTxtDone]}>
                  {done ? "✓" : index + 1}
                </Text>
              </View>

              <Text style={[s.rowTitle]}>{item.title}</Text>

              <Image source={CHEVRON} style={s.chev} resizeMode="contain" />
            </TouchableOpacity>
          );
        }}
      />

      <View style={s.footer}>
        <TouchableOpacity
          style={s.laterBtn}
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.laterTxt}>Continue later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.submitBtn, !allDone && s.submitBtnDisabled]}
          activeOpacity={allDone ? 0.9 : 1}
          disabled={!allDone}
          onPress={handleSubmit}
        >
          <Text style={[s.submitTxt, !allDone && s.submitTxtDisabled]}>
            {allDone ? "Submit Profile" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <BusinessSetupCompletedModal
        visible={showSuccessModal}
        onDone={handleModalDone}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}

/* styles */
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const BORDER = "#E8EEF7";
const BG_SOFT = "#F5F8FE";
const BLUE = "#0145FE";
const BLUE_SOFT = "#DDE6FF";
const GREEN = "#16A34A";
const WHITE = "#FFFFFF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  title: { color: TEXT, fontSize: 22, lineHeight: 28, fontFamily: "RCB-Bold" },
  sub: { color: MUTED, fontSize: 14, marginTop: 6, fontFamily: "RCB-Regular" },
  completionText: { 
    color: GREEN, 
    fontSize: 14, 
    marginTop: 8, 
    fontFamily: "RCB-SemiBold",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: BG_SOFT,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
  },
  rowDone: {
    backgroundColor: "#F2FBF4",
    borderColor: "#DDF3E3",
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeDone: { backgroundColor: "#E8F6EE" },
  badgeTxt: { color: MUTED, fontFamily: "RCB-SemiBold", fontSize: 13 },
  badgeTxtDone: { color: GREEN, fontSize: 16 },

  rowTitle: { flex: 1, color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 15 },

  chev: { width: 22, tintColor: "#7B8AAA" },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  laterBtn: {
    flex: 1,
    height: 56,
    marginRight: 10,
    borderRadius: 999,
    backgroundColor: "#EEF2F8",
    alignItems: "center",
    justifyContent: "center",
  },
  laterTxt: { color: TEXT, fontFamily: "RCB-SemiBold" },

  submitBtn: {
    flex: 1,
    height: 56,
    marginLeft: 10,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: { backgroundColor: BLUE_SOFT },
  submitTxt: { color: WHITE, fontFamily: "RCB-SemiBold" },
  submitTxtDisabled: { color: "#A7B6F6" },
});