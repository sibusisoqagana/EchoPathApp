import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ChevronLeft, Footprints, Eye, Flame, Trophy, Award, Target, Crown, Star} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';

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

export default function AchievementsScreen() {
  const {state, dispatch} = useApp();
  const {theme} = useTheme();
  const sessions = state.sessions || [];
  const totalObs = sessions.reduce((a, b) => a + b.obstacles, 0);
  const streak = getStreak(sessions);
  const totalMin = sessions.reduce((a, b) => a + b.duration, 0);

  const badges = [
    {id: 'first', label: 'First Walk', description: 'Complete one walk', icon: Footprints, colour: theme.primary, progress: Math.min(sessions.length, 1), goal: 1},
    {id: 'five', label: 'Five Walks', description: 'Complete five walks', icon: Footprints, colour: theme.secondary, progress: Math.min(sessions.length, 5), goal: 5},
    {id: 'tenobs', label: 'Ten Avoided', description: 'Avoid ten obstacles', icon: Eye, colour: theme.magenta, progress: Math.min(totalObs, 10), goal: 10},
    {id: 'fiftyobs', label: 'Fifty Avoided', description: 'Avoid fifty obstacles', icon: Trophy, colour: theme.warning, progress: Math.min(totalObs, 50), goal: 50},
    {id: 'streak3', label: 'Three Day Streak', description: 'Walk three days in a row', icon: Flame, colour: theme.danger, progress: Math.min(streak, 3), goal: 3},
    {id: 'streak7', label: 'Week Warrior', description: 'Walk seven days in a row', icon: Crown, colour: theme.warning, progress: Math.min(streak, 7), goal: 7},
    {id: 'hour', label: 'One Hour', description: 'Walk a total of 60 minutes', icon: Target, colour: theme.primary, progress: Math.min(totalMin, 60), goal: 60},
    {id: 'master', label: 'Master', description: 'Ten walks and fifty avoided', icon: Award, colour: theme.violet, progress: Math.min(Math.floor((sessions.length / 10 + totalObs / 50) / 2 * 100), 100), goal: 100},
  ];

  const unlocked = badges.filter(b => b.progress >= b.goal).length;

  return (
    <AppScreen title="Achievements" subtitle={`${unlocked} of ${badges.length} unlocked`}>
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />

      <AppCard glow accent={theme.warning} style={styles.hero}>
        <LinearGradient
          colors={[theme.warning + '25', theme.primary + '10']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroContent}>
          <View style={[styles.heroIcon, {backgroundColor: theme.warning + '25', borderColor: theme.warning + '60'}]}>
            <Trophy size={40} color={theme.warning} />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.heroTitle, {color: theme.white}]}>{unlocked} unlocked</Text>
            <Text style={[styles.heroSub, {color: theme.muted}]}>
              {unlocked === 0 ? 'Start walking to earn your first badge' : `Keep going to unlock all ${badges.length}`}
            </Text>
          </View>
          <View style={[styles.levelPill, {backgroundColor: theme.warning}]}>
            <Star size={12} color="#000" fill="#000" />
            <Text style={styles.levelText}>LEVEL {state.level || 1}</Text>
          </View>
        </View>
      </AppCard>

      {badges.map(b => {
        const Icon = b.icon;
        const isUnlocked = b.progress >= b.goal;
        const pct = (b.progress / b.goal) * 100;
        return (
          <View
            key={b.id}
            style={[
              styles.badge,
              {backgroundColor: theme.surface, borderColor: isUnlocked ? b.colour : theme.border},
              isUnlocked && {shadowColor: b.colour, shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: {width: 0, height: 4}},
            ]}>
            <View style={[styles.badgeIcon, {backgroundColor: isUnlocked ? b.colour + '25' : theme.surface2, borderColor: isUnlocked ? b.colour + '60' : theme.border}]}>
              <Icon size={26} color={isUnlocked ? b.colour : theme.muted} />
            </View>
            <View style={{flex: 1}}>
              <View style={styles.badgeTop}>
                <Text style={[styles.badgeTitle, {color: isUnlocked ? theme.white : theme.muted}]}>{b.label}</Text>
                {isUnlocked && <Text style={[styles.badgeDone, {color: b.colour}]}>?</Text>}
              </View>
              <Text style={[styles.badgeDesc, {color: theme.muted}]}>{b.description}</Text>
              {!isUnlocked && (
                <View style={styles.progressWrap}>
                  <View style={[styles.progressTrack, {backgroundColor: theme.surface2}]}>
                    <View style={[styles.progressFill, {width: Math.max(pct, 3) + '%', backgroundColor: b.colour}]} />
                  </View>
                  <Text style={[styles.progressText, {color: theme.muted}]}>
                    {b.goal === 100 ? Math.round(pct) + '%' : b.progress + '/' + b.goal}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {padding: 0, overflow: 'hidden'},
  heroContent: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20},
  heroIcon: {width: 64, height: 64, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center'},
  heroTitle: {fontSize: 22, fontWeight: '800', letterSpacing: -0.3},
  heroSub: {fontSize: 12, marginTop: 4, lineHeight: 16},
  levelPill: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999},
  levelText: {fontSize: 10, fontWeight: '900', letterSpacing: 0.8, color: '#000'},
  badge: {flexDirection: 'row', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1.5, marginBottom: 10, alignItems: 'center'},
  badgeIcon: {width: 56, height: 56, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center'},
  badgeTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3},
  badgeTitle: {fontSize: 15, fontWeight: '800'},
  badgeDone: {fontSize: 18, fontWeight: '900'},
  badgeDesc: {fontSize: 12, lineHeight: 16},
  progressWrap: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8},
  progressTrack: {flex: 1, height: 6, borderRadius: 3, overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: 3},
  progressText: {fontSize: 10, fontWeight: '800', letterSpacing: 0.5},
});
