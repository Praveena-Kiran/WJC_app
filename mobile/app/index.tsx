/**
 * index.tsx — Welcome / landing screen
 *
 * First screen shown to unauthenticated users. Returning logged-in users are
 * automatically redirected to (tabs) by the root _layout.tsx before this
 * screen finishes rendering, so they never see the welcome screen.
 *
 * Buttons:
 *  - "Get Started" → /(auth)/register
 *  - "Sign In"     → /(auth)/login
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

// Floating orb component for ambient background animation.
function FloatingOrb({ style, delay = 0 }: { style: object; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  return <Animated.View style={[style, { transform: [{ translateY }] }]} />;
}

export default function WelcomeScreen() {
  const router = useRouter();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, delay: 100, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Ambient floating orbs */}
      <FloatingOrb delay={0}    style={[styles.orb, styles.orb1]} />
      <FloatingOrb delay={1500} style={[styles.orb, styles.orb2]} />
      <FloatingOrb delay={800}  style={[styles.orb, styles.orb3]} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* ── Brand ─────────────────────────────────────────── */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoKanji}>禅語</Text>
              <View style={styles.logoDot} />
            </View>
            <Text style={styles.appName}>Zengo</Text>
            <Text style={styles.tagline}>Master Japanese, one character at a time.</Text>
          </View>

          {/* ── Feature pills ──────────────────────────────────── */}
          <View style={styles.pillsRow}>
            {['JLPT N5 → N1', 'Kanji + Kana', 'AI Quizzes', 'Spaced Repetition'].map((label) => (
              <View key={label} style={styles.pill}>
                <Text style={styles.pillText}>{label}</Text>
              </View>
            ))}
          </View>

          {/* ── CTA Buttons ─────────────────────────────────────── */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/register' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Get Started  →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/login' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer ──────────────────────────────────────────── */}
          <Text style={styles.footer}>Free to start • No credit card required</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const ORB_SIZE = 280;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: height * 0.08,
    paddingBottom: 32,
  },

  // ── Orbs ──
  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
  },
  orb1: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    top: -80,
    right: -100,
  },
  orb2: {
    backgroundColor: 'rgba(129, 140, 248, 0.12)',
    bottom: height * 0.25,
    left: -140,
  },
  orb3: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    bottom: -60,
    right: -60,
  },

  // ── Brand ──
  brandSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoKanji: {
    fontSize: 72,
    color: '#a5b4fc',
    textShadowColor: 'rgba(99, 102, 241, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  logoDot: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6366f1',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 240,
  },

  // ── Pills ──
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  pill: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Buttons ──
  buttons: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.35)',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
  },
  secondaryButtonText: {
    color: '#a5b4fc',
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Footer ──
  footer: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
