import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, Pressable} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Volume2, Eye, Award, ArrowRight} from 'lucide-react-native';
import AppButton from '../components/AppButton';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

const {width} = Dimensions.get('window');

const SLIDES = [
  {
    key: 'welcome',
    icon: Volume2,
    title: 'Welcome to EchoPath',
    body: 'A companion that helps you navigate the world using sound. No account needed to explore.',
    accent: 'primary',
  },
  {
    key: 'how',
    icon: Eye,
    title: 'It sees, then speaks',
    body: 'Point your camera forward. EchoPath spots obstacles and tells you where they are — left ear, right ear, or both.',
    accent: 'secondary',
  },
  {
    key: 'progress',
    icon: Award,
    title: 'Every walk counts',
    body: 'Rate walks, earn XP, unlock badges, and watch your streak grow. Built for the long game.',
    accent: 'warning',
  },
];

export default function OnboardingScreen() {
  const {dispatch} = useApp();
  const {theme} = useTheme();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  function next() {
    tap();
    if (index < SLIDES.length - 1) {
      const nextIndex = index + 1;
      scrollRef.current?.scrollTo({x: nextIndex * width, animated: true});
      setIndex(nextIndex);
      say(SLIDES[nextIndex].title);
    } else {
      say('Welcome to EchoPath');
      dispatch({type: 'screen', screen: 'signup'});
    }
  }

  function skip() {
    tap();
    say('Skipped');
    dispatch({type: 'screen', screen: 'signup'});
  }

  function onScroll(e) {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) {
      setIndex(i);
      say(SLIDES[i].title);
    }
  }

  return (
    <View style={[styles.screen, {backgroundColor: theme.void}]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable onPress={skip} style={styles.skipBtn}>
          <Text style={[styles.skipText, {color: theme.muted}]}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        style={styles.carousel}>
        {SLIDES.map(s => {
          const Icon = s.icon;
          const accent = theme[s.accent];
          return (
            <View key={s.key} style={[styles.slide, {width}]}>
              <View style={[styles.orb, {borderColor: accent, backgroundColor: accent + '15', shadowColor: accent}]}>
                <Icon size={72} color={accent} />
              </View>
              <Text style={[styles.title, {color: theme.white}]}>{s.title}</Text>
              <Text style={[styles.body, {color: theme.muted}]}>{s.body}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {backgroundColor: i === index ? theme.primary : theme.border},
              i === index && {width: 26},
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title={index === SLIDES.length - 1 ? 'GET STARTED' : 'NEXT'}
          icon={ArrowRight}
          onPress={next}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  header: {paddingTop: 60, paddingHorizontal: 24, alignItems: 'flex-end'},
  skipBtn: {paddingVertical: 8, paddingHorizontal: 12},
  skipText: {fontSize: 14, fontWeight: '700'},
  carousel: {flex: 1},
  slide: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40},
  orb: {width: 180, height: 180, borderRadius: 90, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 40, shadowOpacity: 0.7, shadowRadius: 30, shadowOffset: {width: 0, height: 8}},
  title: {fontSize: 30, fontWeight: '800', textAlign: 'center', marginBottom: 16, letterSpacing: -0.4},
  body: {fontSize: 16, textAlign: 'center', lineHeight: 24, maxWidth: 320},
  dotsRow: {flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30},
  dot: {width: 8, height: 8, borderRadius: 4},
  footer: {paddingHorizontal: 24, paddingBottom: 40},
});
