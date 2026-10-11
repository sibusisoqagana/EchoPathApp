import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {Sparkles, Trophy, Footprints, Star} from 'lucide-react-native';
import AppButton from '../components/AppButton';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {say} from '../utils/speech';
import {success} from '../utils/haptics';

export default function CelebrationScreen() {
  const {state, dispatch} = useApp();
  const {theme} = useTheme();
  const lastSession = state.sessions[0];
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    success();
    say('Walk complete. You earned experience points.');
    Animated.parallel([
      Animated.spring(scale, {toValue: 1, useNativeDriver: true, friction: 5}),
      Animated.timing(fade, {toValue: 1, duration: 600, useNativeDriver: true}),
    ]).start();
  }, []);

  const earnedXp = lastSession ? 20 + lastSession.obstacles * 5 + lastSession.duration * 2 : 0;

  return (
    <View style={[styles.screen, {backgroundColor: theme.void}]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[theme.warning + '30', theme.primary + '20', theme.void]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.content, {opacity: fade}]}>
        <Animated.View style={[styles.orb, {borderColor: theme.warning, backgroundColor: theme.warning + '25', shadowColor: theme.warning, transform: [{scale}]}]}>
          <Sparkles size={72} color={theme.warning} />
        </Animated.View>

        <Text style={[styles.title, {color: theme.white}]}>Walk complete</Text>
        <Text style={[styles.sub, {color: theme.muted}]}>
          Here's what you did just now.
        </Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
            <Footprints size={22} color={theme.primary} />
            <Text style={[styles.statValue, {color: theme.white}]}>{lastSession?.obstacles || 0}</Text>
            <Text style={[styles.statLabel, {color: theme.muted}]}>OBSTACLES</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
            <Star size={22} color={theme.warning} />
            <Text style={[styles.statValue, {color: theme.white}]}>{lastSession?.duration || 0}m</Text>
            <Text style={[styles.statLabel, {color: theme.muted}]}>DURATION</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
            <Trophy size={22} color={theme.success} />
            <Text style={[styles.statValue, {color: theme.white}]}>+{earnedXp}</Text>
            <Text style={[styles.statLabel, {color: theme.muted}]}>XP</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <AppButton title="BACK TO HOME" onPress={() => { say('Home'); dispatch({type: 'screen', screen: 'home'}); }} />
        <AppButton
          title="VIEW SESSION"
          variant="ghost"
          onPress={() => { say('Session details'); dispatch({type: 'select', session: lastSession}); }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24},
  orb: {width: 160, height: 160, borderRadius: 80, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 40, shadowOpacity: 0.8, shadowRadius: 30, shadowOffset: {width: 0, height: 8}},
  title: {fontSize: 34, fontWeight: '900', letterSpacing: -0.6, textAlign: 'center', marginBottom: 12},
  sub: {fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 40, maxWidth: 300},
  statsRow: {flexDirection: 'row', gap: 10},
  statCard: {flex: 1, alignItems: 'center', paddingVertical: 18, paddingHorizontal: 10, borderRadius: 18, borderWidth: 1, gap: 6},
  statValue: {fontSize: 22, fontWeight: '900', letterSpacing: -0.4},
  statLabel: {fontSize: 9, fontWeight: '900', letterSpacing: 1.2},
  footer: {padding: 24, paddingBottom: 40},
});
