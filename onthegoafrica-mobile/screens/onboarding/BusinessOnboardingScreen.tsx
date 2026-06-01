// screens/onboarding/BusinessOnboardingScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Slide = {
  image: any;
  pills: string[];
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    // replace with your asset path
    image: require('../../assets/onboarding/business1.png'),
    pills: ['Learn how customers feel about your services'],
    title: 'Gain real insights into\ncustomer behaviors!',
    subtitle:
      'Receive detailed reports on customer trends & how they relate to your business.',
  },
  {
    image: require('../../assets/onboarding/business2.png'),
    pills: ['23 new customers this week', 'Create activities and meetups', 'Make new friends!'],
    title: 'Free analytics\nfor your business',
    subtitle:
      'Learn about what your customers actually want and respond to.',
  },
  {
    image: require('../../assets/onboarding/business3.png'),
    pills: ['Get traffic to your location'],
    title: 'Gain new customers',
    subtitle: 'And keep the regulars coming back.',
  },
];

export default function BusinessOnboardingScreen({
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
        onScroll={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) setIndex(i);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((s, i) => (
          <View key={i} style={{ width, height }}>
            <ImageBackground source={s.image} style={styles.bg} resizeMode="cover">
              {/* Bubbles */}
              <View style={styles.pillsWrap}>
                {s.pills.map((p, j) => (
                  <View key={j} style={styles.pill}>
                    <Text style={styles.pillText}>{p}</Text>
                  </View>
                ))}
              </View>

              {/* Bottom gradient + content */}
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.9)', '#FFFFFF']}
                locations={[0.45, 0.7, 1]}
                style={styles.gradient}
              />
              <View style={styles.bottomCard}>
                <Text style={styles.title}>{s.title}</Text>
                <Text style={styles.subtitle}>{s.subtitle}</Text>

                {/* Dots */}
                <View style={styles.dotsRow}>
                  {slides.map((_, di) => (
                    <View key={di} style={[styles.dot, di === index && styles.dotActive]} />
                  ))}
                </View>

                {/* CTA */}
                <TouchableOpacity onPress={onSignUp} activeOpacity={0.9} style={styles.cta}>
                  <Text style={styles.ctaText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.signIn}>
                  I have an Account,{' '}
                  <Text style={styles.signInLink} onPress={onSignIn} suppressHighlighting>
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

const BLUE = '#0145FE';
const TEXT_DARK = '#0A1220';
const TEXT_MUTED = '#6C7A92';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  bg: { flex: 1, justifyContent: 'flex-end' },

  pillsWrap: {
    position: 'absolute',
    top: height * 0.36,
    right: 18,
    left: 18,
    gap: 14,
  },
  pill: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  pillText: { fontSize: 14, color: TEXT_DARK, fontFamily: 'RCB-Medium' },

  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 1 },

  bottomCard: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 18 },

  title: {
    fontSize: 28,
    lineHeight: 34,
    color: TEXT_DARK,
    textAlign: 'center',
    fontFamily: 'RCB-Bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: 'center',
    fontFamily: 'RCB-Regular',
    lineHeight: 22,
    marginHorizontal: 6,
  },

  dotsRow: { marginTop: 18, marginBottom: 14, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D7DEEA' },
  dotActive: { width: 22, borderRadius: 4, backgroundColor: BLUE },

  cta: { marginTop: 6, backgroundColor: BLUE, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 18, fontFamily: 'RCB-SemiBold' },

  signIn: { textAlign: 'center', marginTop: 14, color: TEXT_MUTED, fontFamily: 'RCB-Regular' },
  signInLink: { color: BLUE, fontFamily: 'RCB-SemiBold' },
});
