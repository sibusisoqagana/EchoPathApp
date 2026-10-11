import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Play, Target, Clock, Settings as SettingsIcon, Volume2, User, Activity, ChevronRight, Flame, Bell, Trophy, Zap} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import XpBar from '../components/XpBar';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Winding down';
}

function getStreak(sessions) {
  if (!sessions.length) return 0;
  const dates = sessions.map(s => new Date(s.id).toDateString());
  const unique = [...new Set(dates)];
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = Math.round((new Date(unique[i - 1]) - new Date(unique[i])) / (1000 * 60 * 60 * 24));
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export default function HomeScreen() {
  const {state, dispatch} = useApp();
  const {theme} = useTheme();
  const name = state.user?.name?.split(' ')[0] || state.user?.email?.split('@')[0] || 'friend';
  const streak = getStreak(state.sessions);
  const hasWalked = state.sessions.length > 0;
  const unread = (state.notifications || []).filter(n => !n.read).length;

  function go(screen, label) {
    tap();
    if (label) say(label);
    dispatch({type: 'screen', screen});
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <Text style={[styles.greeting, {color: theme.muted}]}>{getGreeting()},</Text>
          <Text style={[styles.name, {color: theme.white}]}>{name}.</Text>
        </View>
        <Pressable
          onPress={() => go('notifications', 'Notifications')}
          style={[styles.bellBtn, {backgroundColor: theme.surface, borderColor: theme.border}]}>
          <Bell size={22} color={theme.white} />
          {unread > 0 && (
            <View style={[styles.bellBadge, {backgroundColor: theme.danger}]}>
              <Text style={styles.bellBadgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <Text style={[styles.subGreeting, {color: theme.muted}]}>
        {hasWalked
          ? streak >= 2
            ? `You're on a ${streak}-day streak. Ready for a walk?`
            : `Welcome back. Ready for a walk?`
          : `EchoPath helps you move through the world with sound. Let's get you set up.`}
      </Text>

      <View style={styles.bigActionWrap}>
        <Pressable
          onPress={() => { tap(); say('Start navigation'); dispatch({type: 'start'}); }}
          style={[styles.bigAction, {backgroundColor: theme.primary, shadowColor: theme.primary}]}>
          <View style={styles.bigIconCircle}>
            <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.bigTitle}>Start a walk</Text>
            <Text style={styles.bigSub}>Point your camera forward and listen</Text>
          </View>
          <ChevronRight size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <XpBar />

      <View style={styles.duoRow}>
        <Pressable
          onPress={() => go('achievements', 'Achievements')}
          style={[styles.duoCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
          <View style={[styles.duoIcon, {backgroundColor: theme.warning + '22'}]}>
            <Trophy size={22} color={theme.warning} />
          </View>
          <Text style={[styles.duoTitle, {color: theme.white}]}>Achievements</Text>
          <Text style={[styles.duoSub, {color: theme.muted}]}>Badges & progress</Text>
        </Pressable>

        <Pressable
          onPress={() => go('history', 'Your walk history')}
          style={[styles.duoCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
          <View style={[styles.duoIcon, {backgroundColor: theme.primary + '22'}]}>
            <Clock size={22} color={theme.primary} />
          </View>
          <Text style={[styles.duoTitle, {color: theme.white}]}>History</Text>
          <Text style={[styles.duoSub, {color: theme.muted}]}>{state.sessions.length} walks saved</Text>
        </Pressable>
      </View>

      {hasWalked && (
        <View style={[styles.streakCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
          <View style={[styles.streakIcon, {backgroundColor: theme.warning + '22'}]}>
            <Flame size={22} color={theme.warning} />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.streakTitle, {color: theme.white}]}>
              {streak} {streak === 1 ? 'day' : 'days'} in a row
            </Text>
            <Text style={[styles.streakSub, {color: theme.muted}]}>
              {state.sessions.reduce((a, b) => a + b.obstacles, 0)} obstacles avoided so far
            </Text>
          </View>
          <View style={[styles.streakLevel, {backgroundColor: theme.warning + '22'}]}>
            <Zap size={12} color={theme.warning} fill={theme.warning} />
            <Text style={[styles.streakLevelText, {color: theme.warning}]}>L{state.level || 1}</Text>
          </View>
        </View>
      )}

      <Text style={[styles.sectionTitle, {color: theme.white}]}>Everything else</Text>
      <Text style={[styles.sectionSub, {color: theme.muted}]}>Tap any card to see what it does.</Text>

      <FeatureRow
        icon={Target} colour={theme.secondary} title="Calibrate"
        description="Hold your phone at chest height so the camera points the right way"
        onPress={() => { dispatch({type: 'setCalibration', step: 1}); go('calibration', 'Calibrate'); }}
        theme={theme}
      />
      <FeatureRow
        icon={SettingsIcon} colour={theme.violet} title="Settings"
        description="Change the theme, voice speed, and how EchoPath talks to you"
        onPress={() => go('settings', 'Settings')}
        theme={theme}
      />
      <FeatureRow
        icon={Volume2} colour={theme.magenta} title="How it works"
        description="A short explanation of what EchoPath actually does"
        onPress={() => go('about', 'How it works')}
        theme={theme}
      />
      <FeatureRow
        icon={User} colour={theme.success} title="Your profile"
        description="Your name, email, and account settings"
        onPress={() => go('profile', 'Your profile')}
        theme={theme}
      />
      <FeatureRow
        icon={Activity} colour={theme.muted} title="System status"
        description="Technical info about the AI model and live detection"
        onPress={() => go('diagnostics', 'System status')}
        theme={theme}
      />
    </AppScreen>
  );
}

function FeatureRow({icon: Icon, colour, title, description, onPress, theme}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, {backgroundColor: theme.surface, borderColor: theme.border}]}>
      <View style={[styles.rowIcon, {backgroundColor: colour + '18'}]}>
        <Icon size={22} color={colour} />
      </View>
      <View style={{flex: 1}}>
        <Text style={[styles.rowTitle, {color: theme.white}]}>{title}</Text>
        <Text style={[styles.rowDesc, {color: theme.muted}]}>{description}</Text>
      </View>
      <ChevronRight size={20} color={theme.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  greeting: {fontSize: 15, fontWeight: '600'},
  name: {fontSize: 40, fontWeight: '800', letterSpacing: -1},
  bellBtn: {width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center'},
  bellBadge: {position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4},
  bellBadgeText: {color: '#FFFFFF', fontSize: 10, fontWeight: '900'},
  subGreeting: {fontSize: 15, lineHeight: 22, marginBottom: 26},
  bigActionWrap: {marginBottom: 20},
  bigAction: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 22, paddingHorizontal: 20, borderRadius: radius.xl, shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: {width: 0, height: 8}, elevation: 10},
  bigIconCircle: {width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center'},
  bigTitle: {color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: -0.2},
  bigSub: {color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 3, fontWeight: '500'},
  duoRow: {flexDirection: 'row', gap: 12, marginBottom: 14},
  duoCard: {flex: 1, padding: 16, borderRadius: radius.lg, borderWidth: 1, gap: 8},
  duoIcon: {width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  duoTitle: {fontSize: 14, fontWeight: '800', letterSpacing: -0.2},
  duoSub: {fontSize: 11, lineHeight: 15},
  streakCard: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: radius.lg, borderWidth: 1, marginBottom: 26},
  streakIcon: {width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center'},
  streakTitle: {fontSize: 16, fontWeight: '800'},
  streakSub: {fontSize: 13, marginTop: 3},
  streakLevel: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999},
  streakLevelText: {fontSize: 11, fontWeight: '900', letterSpacing: 0.6},
  sectionTitle: {fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4},
  sectionSub: {fontSize: 13, marginBottom: 16},
  row: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1, marginBottom: 10},
  rowIcon: {width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  rowTitle: {fontSize: 15, fontWeight: '700', marginBottom: 3},
  rowDesc: {fontSize: 12, lineHeight: 17},
});
