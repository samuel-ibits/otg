import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";

/* Onboarding */
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import BusinessOnboardingScreen from "../screens/onboarding/BusinessOnboardingScreen";
import AccountTypeScreen from "../screens/onboarding/AccountTypeScreen";

/* Registration */
import RegisterScreen from "../screens/registration/RegisterScreen";
import LoginScreen from "../screens/registration/LoginScreen";
import EmailSignupScreen from "../screens/registration/emailSignup";
import VerifyEmailScreen from "../screens/registration/VerifyEmailScreen";
// removed: CreatePasswordScreen
import CreateProfileScreen from "../screens/registration/CreateProfileScreen";
import InterestsSelectionScreen from "../screens/registration/InterestsSelectionScreen";
import LocationEnableScreen from "../screens/registration/LocationEnableScreen";

/* Business profile setup */
import BusinessProfileSetupScreen from "../screens/registration/business/BusinessProfileSetupScreen";
import BusinessDetailsScreen from "../screens/registration/business/BusinessDetailsScreen";
import BusinessVerification from "../screens/registration/business/BusinessVerificationScreen";
import BusinessHoursScreen from "../screens/registration/business/BusinessHoursScreen";
import BusinessSocialsScreen from "../screens/registration/business/BusinessSocialsScreen";
import BusinessWifiScreen from "../screens/registration/business/BusinessWifiScreen";
import BusinessRewardsScreen from "../screens/registration/business/BusinessRewardsScreen";
import {
  SmeBusinessInformationScreen,
  AmenitiesScreen,
} from "../screens/onboarding/stage3/Sme";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import {
  BusinessNameScreen,
  BusinessLocationScreen,
  BusinessCACScreen,
  BusinessLogoScreen,
  BusinessLogoConfirmScreen,
  HeadOfficeAddressScreen,
  BusinessCategoryScreen,
} from "../screens/onboarding/BusinessOnboardingScreen2";

type RNFile = { uri: string; name: string; type: string };

type DraftProfile = {
  userName: string;
  bio?: string;
  profession: string;
  skills: string[];
  gender?: string;
  profileType: "personal";
  picture?: RNFile;
};

type Interest = {
  id: string;
  label: string;
  emoji: string;
  category: "hobby" | "place";
};

export type OnboardingStackParamList = {
  AccountType: undefined;
  Welcome: undefined;
  OnboardingMain: undefined;
  BusinessOnboardingMain: undefined;
  BusinessOnboarding2: undefined;
  BusinessName: undefined;
  BusinessLocation: undefined;
  BusinessCAC: undefined;
  BusinessLogoConfirm: undefined;
  BusinessLogo: undefined;
  RegisterMain: undefined;
  Login: undefined;
  EmailSignup: undefined;
  VerifyEmail: { email?: string } | undefined;
  HeadOfficeAddress: undefined;
  BusinessCategory: undefined;
  // removed: CreatePassword
  CreateProfile: undefined;
  CreateBusinessProfile: undefined;
  BusinessDetails: undefined;
  BusinessVerification: undefined;
  BusinessHours: undefined;
  BusinessSocials: undefined;
  BusinessWifi: undefined;
  BusinessRewards: undefined;
  InterestsSelection: undefined;
  LocationEnable: { isLocationEnabled?: boolean } | undefined;
  //stage 2
  SmeBusinessInformation: undefined;
  Amenities: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack({
  onFinished,
}: {
  onFinished?: () => void;
}) {
  const [acctType, setAcctType] = React.useState<
    "individual" | "business" | null
  >(null);

  // hold data from CreateProfile until interests are chosen
  const [draftProfile, setDraftProfile] = React.useState<DraftProfile | null>(
    null
  );

  // const submitAll = async (selected: Interest[], navigation: any) => {
  //   if (!draftProfile) return;
  //   console.log("draftProfile");

  //   const hobbies = selected
  //     .filter((i) => i.category === "hobby")
  //     .map((i) => i.label);
  //   const places = selected
  //     .filter((i) => i.category === "place")
  //     .map((i) => i.label);

  //   await createUserProfile({
  //     userName: draftProfile.userName,
  //     bio: draftProfile.bio || "",
  //     profession: draftProfile.profession,
  //     skills: draftProfile.skills,
  //     gender: draftProfile.gender || "",
  //     profileType: draftProfile.profileType,
  //     picture: draftProfile.picture,
  //     // use hobbies key expected by backend; keep interests alias handled in API too
  //     hobbies,
  //     places,
  //   });
  //   navigation.navigate("LocationEnable", { isLocationEnabled: true });
  // };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            onSignUp={() => navigation.navigate("EmailSignup")}
            onSignIn={() => navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AccountType">
        {({ navigation }) => (
          <AccountTypeScreen
            onChooseIndividual={() => {
              setAcctType("individual");
              navigation.replace("CreateProfile");
            }}
            onChooseBusiness={() => {
              setAcctType("business");
              navigation.replace("BusinessCategory");
            }}
            onSignIn={() => navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="OnboardingMain">
        {({ navigation }) => (
          <OnboardingScreen
            onSignUp={() => navigation.navigate("EmailSignup")}
            onSignIn={() => navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BusinessOnboardingMain">
        {({ navigation }) => (
          <BusinessOnboardingScreen
            onSignUp={() => navigation.navigate("EmailSignup")}
            onSignIn={() => navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="RegisterMain">
        {({ navigation }) => (
          <RegisterScreen
            {...({
              onApple: () => {},
              onInstagram: () => {},
              onGoogle: () => {},
              onEmailOrPhone: () => navigation.navigate("EmailSignup"),
              onTerms: () => {},
              onPrivacy: () => {},
            } as any)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            {...({
              onBack: () => navigation.goBack(),
              onLogin: () => {
                const rootNav = navigation.getParent?.();
                if (rootNav?.navigate) rootNav.navigate("MainTabs" as never);
                else onFinished?.();
              },
              onUsePhoneNumber: () => {},
              onForgotPassword: () => navigation.navigate("EmailSignup"),
              onApple: () => {},
              onInstagram: () => {},
              onGoogle: () => {},
              onSignUp: () => navigation.replace("EmailSignup"),
            } as any)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EmailSignup">
        {({ navigation }) => (
          <EmailSignupScreen
            onContinue={(d: { emailAddress: string }) =>
              navigation.navigate("VerifyEmail", { email: d.emailAddress })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="VerifyEmail">
        {({ route, navigation }) => (
          <VerifyEmailScreen
            email={route.params?.email}
            // after verification, go straight to profile based on account type
            onAccountCreated={() => {
              navigation.replace("AccountType");

              // if (acctType === "business")
              //   // navigation.replace("CreateBusinessProfile");
              //   // navigation.replace("BusinessOnboarding2");
              //   navigation.replace("BusinessName");
              // else navigation.replace("CreateProfile");
            }}
          />
        )}
      </Stack.Screen>

      {/* Collect profile core details only. Do not submit yet. */}
      <Stack.Screen name="CreateProfile">
        {({ navigation }) => (
          <CreateProfileScreen
            onContinue={(data: {
              username: string;
              bio: string;
              gender: string;
              profession: string;
              skills: { id: string; name: string }[];
              profileImage: string | null;
            }) => {
              const file: RNFile | undefined = data.profileImage
                ? {
                    uri: data.profileImage,
                    name: `profile-${Date.now()}.jpg`,
                    type: "image/jpeg",
                  }
                : undefined;

              setDraftProfile({
                userName: data.username.trim(),
                bio: data.bio.trim(),
                profession: data.profession.trim(),
                skills: data.skills.map((s) => s.name),
                gender: data.gender?.toLowerCase(),
                profileType: "personal",
                picture: file,
              });

              navigation.navigate("InterestsSelection", {
                profileData: draftProfile,
              });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="BusinessCategory"
        component={BusinessCategoryScreen}
      />
      <Stack.Screen
        name="HeadOfficeAddress"
        component={HeadOfficeAddressScreen}
      />
      <Stack.Screen name="BusinessName" component={BusinessNameScreen} />
      <Stack.Screen
        name="BusinessLocation"
        component={BusinessLocationScreen}
      />
      <Stack.Screen name="BusinessCAC" component={BusinessCACScreen} />
      <Stack.Screen name="BusinessLogo" component={BusinessLogoScreen} />
      <Stack.Screen
        name="BusinessLogoConfirm"
        component={BusinessLogoConfirmScreen}
      />
      <Stack.Screen
        name="CreateBusinessProfile"
        component={BusinessProfileSetupScreen}
      />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen
        name="BusinessVerification"
        component={BusinessVerification}
      />
      <Stack.Screen name="BusinessHours" component={BusinessHoursScreen} />
      <Stack.Screen name="BusinessSocials" component={BusinessSocialsScreen} />
      <Stack.Screen name="BusinessWifi" component={BusinessWifiScreen} />
      <Stack.Screen name="BusinessRewards" component={BusinessRewardsScreen} />
      <Stack.Screen
        name="SmeBusinessInformation"
        component={SmeBusinessInformationScreen}
      />
      <Stack.Screen name="Amenities" component={AmenitiesScreen} />

      {/* After interests are chosen, submit everything, then continue */}
      <Stack.Screen name="InterestsSelection">
        {({ navigation }) => (
          <InterestsSelectionScreen
            {...({
              onBack: () => navigation.goBack(),
              onContinue: async (selected: Interest[]) => {
                try {
                  console.log("draftProfile");
                  // await submitAll(selected, navigation);
                } catch (e: any) {
                  alert(e?.message || "Failed to create profile");
                }
              },
            } as any)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="LocationEnable">
        {({ route, navigation }) => (
          <LocationEnableScreen
            onBack={() => navigation.goBack()}
            onContinue={() => {
              const rootNav = navigation.getParent?.();
              if (rootNav?.navigate) {
                rootNav.navigate("MainTabs" as never);
                return;
              }
              if (typeof onFinished === "function") {
                onFinished();
                return;
              }
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "MainTabs" as never }],
                })
              );
            }}
            onEnableLocation={() => {}}
            isLocationEnabled={route.params?.isLocationEnabled ?? true}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
