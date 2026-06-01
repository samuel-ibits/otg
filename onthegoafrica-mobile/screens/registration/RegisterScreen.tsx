// screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SocialAuthModal from '../../component/SocialAuthModal';
import TermsModal from '../../component/TermsModal';
import PrivacyPolicyModal from '../../component/PrivacyPolicyModal';

type Provider = 'apple' | 'instagram' | 'google';

type Props = {
  onApple?: () => void;
  onInstagram?: () => void;
  onGoogle?: () => void;
  onEmailOrPhone?: () => void; // navigate to EmailSignup
};

export default function RegisterScreen({
  onApple,
  onInstagram,
  onGoogle,
  onEmailOrPhone,
}: Props) {
  const [socialVisible, setSocialVisible] = useState(false);
  const [socialProvider, setSocialProvider] = useState<Provider | null>(null);

  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  const openSocial = (p: Provider) => {
    setSocialProvider(p);
    setSocialVisible(true);
  };

  const confirmSocial = (p: Provider) => {
    setSocialVisible(false);
    if (p === 'apple' && onApple) return onApple();
    if (p === 'instagram' && onInstagram) return onInstagram();
    if (p === 'google' && onGoogle) return onGoogle();
    Alert.alert('Social signup', `Proceed with ${p}`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Create an account or login to get started</Text>
        </View>

        <View style={styles.authSection}>
          <AuthButton
            label="Continue with Apple"
            icon={require('../../assets/icons/apple.png')}
            onPress={() => openSocial('apple')}
          />
          <View style={{ height: 12 }} />
          <AuthButton
            label="Continue with Instagram"
            icon={require('../../assets/icons/instagram.png')}
            onPress={() => openSocial('instagram')}
          />
          <View style={{ height: 12 }} />
          <AuthButton
            label="Continue with Google"
            icon={require('../../assets/icons/google.png')}
            onPress={() => openSocial('google')}
          />

          <View style={{ height: 32 }} />

          <Divider label="Or" />

          <View style={{ height: 24 }} />

          <TouchableOpacity style={styles.primaryCta} onPress={onEmailOrPhone} activeOpacity={0.9}>
            <Text style={styles.primaryCtaText}>Continue with email or phone number</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />

          {/* Use touchables instead of nested Text for reliable presses */}
          <View style={styles.legalWrap}>
            <Text style={styles.legalText}>By signing up, you agree to our </Text>
            <TouchableOpacity
              onPress={() => setTermsVisible(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.link}>Terms and Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.legalText}>.</Text>
          </View>

          <View style={styles.legalWrap}>
            <Text style={styles.legalText}>See how we use your data in our </Text>
            <TouchableOpacity
              onPress={() => setPrivacyVisible(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalText}>.</Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </View>

      {/* Modals */}
      <SocialAuthModal
        visible={socialVisible}
        provider={socialProvider}
        onClose={() => setSocialVisible(false)}
        onConfirm={confirmSocial}
      />
      <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
      <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
    </SafeAreaView>
  );
}

function AuthButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.authBtn} onPress={onPress} activeOpacity={0.9}>
      <Image source={icon} style={styles.authIcon} resizeMode="contain" />
      <Text style={styles.authText}>{label}</Text>
      <View style={{ width: 24 }} />
    </TouchableOpacity>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.divider} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const BLUE = '#0145FE';
const BORDER = '#CBD6F3';
const TEXT = '#0A1220';
const MUTED = '#6C7A92';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: { paddingTop: 40 },
  title: { fontSize: 24, lineHeight: 30, color: TEXT, fontFamily: 'RCB-Bold' },
  subtitle: { marginTop: 6, fontSize: 14, color: MUTED, fontFamily: 'RCB-Regular' },

  authSection: { flex: 1, justifyContent: 'center' },
  spacer: { flex: 0.3 },

  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  authIcon: { width: 22, height: 22, marginRight: 10 },
  authText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: TEXT,
    fontFamily: 'RCB-SemiBold',
  },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 6 },
  divider: { flex: 1, height: 1, backgroundColor: '#E3E9F3' },
  dividerLabel: { color: MUTED, fontFamily: 'RCB-Regular' },

  primaryCta: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'RCB-SemiBold' },

  legalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  legalText: {
    textAlign: 'center',
    fontSize: 12,
    color: MUTED,
    lineHeight: 18,
    fontFamily: 'RCB-Regular',
  },
  link: { color: BLUE, fontFamily: 'RCB-SemiBold', fontSize: 12, lineHeight: 18 },
});
