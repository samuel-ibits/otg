// screens/registration/emailSignup.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../api/api";

type Props = {
  onContinue?: (data: FormData) => void;
};

type FormData = {
  firstName: string;
  lastName: string;
  phone_number: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
};

// Enhanced email validation
const validateEmail = (
  email: string
): { isValid: boolean; message?: string } => {
  if (!email.trim()) {
    return { isValid: false, message: "Email address is required" };
  }

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  // Check for common typos in domains
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  const suspiciousDomains = ["gmial.com", "yahooo.com", "gmai.com"];

  if (suspiciousDomains.includes(domain)) {
    return {
      isValid: false,
      message: "Please check your email domain for typos",
    };
  }

  // Check for multiple @ symbols
  if ((email.match(/@/g) || []).length > 1) {
    return {
      isValid: false,
      message: "Email address cannot contain multiple @ symbols",
    };
  }

  // Check for spaces
  if (email.includes(" ")) {
    return { isValid: false, message: "Email address cannot contain spaces" };
  }

  // Check minimum length
  if (email.length < 5) {
    return { isValid: false, message: "Email address is too short" };
  }

  return { isValid: true };
};

// Enhanced password validation
const validatePassword = (
  password: string
): { isValid: boolean; message?: string; strength?: string } => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: "Password is too long (maximum 128 characters)",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message:
        "Password must contain at least one special character (!@#$%^&*...)",
    };
  }

  // Check for common weak passwords
  const weakPasswords = [
    "password",
    "password123",
    "12345678",
    "qwerty123",
    "abc123456",
  ];
  if (weakPasswords.includes(password.toLowerCase())) {
    return {
      isValid: false,
      message: "This password is too common. Please choose a stronger password",
    };
  }

  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    return {
      isValid: false,
      message:
        "Password should not contain repeated characters (e.g., 'aaa', '111')",
    };
  }

  // Calculate strength
  let strength = "Strong";
  if (
    password.length >= 12 &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    )
  ) {
    strength = "Very Strong";
  }

  return { isValid: true, strength };
};

export default function PersonalDetailsScreen({ onContinue }: Props) {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone_number: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update password strength in real-time
    if (field === "password") {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength || "");
    }
  };

  const validateForm = (): boolean => {
    // First name validation
    if (!formData.firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }
    if (formData.firstName.trim().length < 2) {
      Alert.alert("Error", "First name must be at least 2 characters long");
      return false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }
    if (formData.lastName.trim().length < 2) {
      Alert.alert("Error", "Last name must be at least 2 characters long");
      return false;
    }

    // Phone number validation
    if (!formData.phone_number.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(formData.phone_number.trim())) {
      Alert.alert(
        "Error",
        "Please enter a valid phone number (at least 10 digits)"
      );
      return false;
    }

    // Email validation
    const emailValidation = validateEmail(formData.emailAddress);
    if (!emailValidation.isValid) {
      Alert.alert(
        "Email Error",
        emailValidation.message || "Invalid email address"
      );
      return false;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      Alert.alert(
        "Password Error",
        passwordValidation.message || "Invalid password"
      );
      return false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      Alert.alert("Error", "Please confirm your password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.emailAddress.trim().toLowerCase(),
        password: formData.password,
        phone_number: formData.phone_number.trim(),
      };

      const result = await registerUser(registrationData);

      if (result && result.message && result.data) {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email for verification code.",
          [
            {
              text: "Verify Email",
              onPress: () => {
                navigation.navigate(
                  "VerifyEmail" as never,
                  { email: formData.emailAddress.trim().toLowerCase() } as never
                );
              },
            },
          ]
        );
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || "Registration failed. Please try again.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Personal Details</Text>
            <Text style={styles.subtitle}>
              Create an account or login to get started
            </Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="First Name"
              placeholder="Enter First name"
              value={formData.firstName}
              onChangeText={(text) => updateField("firstName", text)}
            />
            <InputField
              label="Last Name"
              placeholder="Enter Last name"
              value={formData.lastName}
              onChangeText={(text) => updateField("lastName", text)}
            />
            <InputField
              label="Phone number"
              placeholder="Enter Phone number"
              value={formData.phone_number}
              onChangeText={(text) => updateField("phone_number", text)}
              keyboardType="phone-pad"
            />
            <InputField
              label="Email Address"
              placeholder="Enter email address"
              value={formData.emailAddress}
              onChangeText={(text) => updateField("emailAddress", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PasswordField
              label="Password"
              placeholder="Enter password (min. 8 characters)"
              value={formData.password}
              onChangeText={(text) => updateField("password", text)}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              strength={passwordStrength}
            />
            <PasswordField
              label="Confirm password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField("confirmPassword", text)}
              showPassword={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueBtn, loading && { opacity: 0.7 }]}
              onPress={handleContinue}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueBtnText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#0145FE";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";
const PLACEHOLDER = "#A8B5C8";
const INPUT_BG = "#F5F7FA";
const INPUT_BORDER = "#E8EDF5";
const TEXT_DARK = "#111827";
const GREEN = "#10B981";
const ORANGE = "#F59E0B";

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "words",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  showPassword,
  onToggleVisibility,
  strength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  strength?: string;
}) {
  const getStrengthColor = () => {
    if (strength === "Very Strong") return GREEN;
    if (strength === "Strong") return BLUE;
    return ORANGE;
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onToggleVisibility}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/icons/eye.png")}
            style={styles.eyeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {strength && value.length > 0 && (
        <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
          Password Strength: {strength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  closeIcon: {
    fontSize: 24,
    color: TEXT_DARK,
    fontWeight: "300",
  },
  header: { paddingTop: 20, paddingBottom: 32 },
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: TEXT_DARK,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: MUTED,
    fontFamily: "RCB-Regular",
  },
  form: { flex: 1 },
  inputContainer: { marginBottom: 24 },
  inputLabel: {
    fontSize: 14,
    color: TEXT,
    fontFamily: "RCB-Medium",
    marginBottom: 8,
  },
  textInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: TEXT,
    fontFamily: "RCB-Regular",
  },
  passwordContainer: { position: "relative" },
  passwordInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: TEXT,
    fontFamily: "RCB-Regular",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 0,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
  },
  eyeIcon: { width: 20, height: 20, tintColor: MUTED },
  strengthText: {
    fontSize: 12,
    fontFamily: "RCB-Medium",
    marginTop: 6,
  },
  footer: { paddingVertical: 32 },
  continueBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "RCB-SemiBold",
  },
});
