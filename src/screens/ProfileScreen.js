import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ChevronLeft, Lock, LogOut, Award, Footprints, Eye, Flame, Trophy} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppStat from '../components/AppStat';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';

function getAchievements(sessions) {
  const totalObs = sessions.reduce((a, b) => a + b.obstacles, 0);
  return [
    {id: 'first', label: 'First Walk', unlocked: sessions.length >= 1, icon: Footprints, colour: C.cyan},
    {id: 'five', label: '5 Walks', unlocked: sessions.length >= 5, icon: Footprints, colour: C.violet},
    {id: 'tenobs', label: '10 Avoided', unlocked: totalObs >= 10, icon: Eye, colour: C.magenta},
    {id: 'fiftyobs', label: '50 Avoided', unlocked: totalObs >= 50, icon: Trophy, colour: C.amber},
    {id: 'streak', label: '3-Day Streak', unlocked: sessions.length >= 3, icon: Flame, colour: C.lime},
    {id: 'master', label: '10 Walks', unlocked: sessions.length >= 10, icon: Award, colour: C.cyan},
  ];
}

export default function ProfileScreen() {
  const {state, dispatch} = useApp();
  const initials = (state.user?.name || 'Guest').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const achievements = getAchievements(state.sessions);
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <AppScreen num={9} title={state.user?.name || 'Guest'} subtitle={state.user?.email || 'Not signed in'}>
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />

      <AppCard glow accent={C.violet} style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{state.user?.name || 'Guest'}</Text>
        <Text style={styles.email}>{state.user?.email || 'Not signed in'}</Text>
      </AppCard>

      <AppCard>
        <View style={styles.statsRow}>
          <AppStat value={String(state.sessions.length)} label="SESSIONS" colour={C.cyan} />
          <AppStat value={String(state.sessions.reduce((a, b) => a + b.obstacles, 0))} label="AVOIDED" colour={C.magenta} />
          <AppStat value={unlocked + '/' + achievements.length} label="BADGES" colour={C.amber} />
        </View>
      </AppCard>

      <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
      <View style={styles.badgesGrid}>
        {achievements.map(a => {
          const Icon = a.icon;
          return (
            <View key={a.id} style={[styles.badge, a.unlocked && {borderColor: a.colour, backgroundColor: a.colour + '12'}]}>
              <View style={[styles.badgeIcon, {backgroundColor: a.unlocked ? a.colour + '25' : C.surface2}]}>
                <Icon size={22} color={a.unlocked ? a.colour : C.muted} />
              </View>
              <Text style={[styles.badgeLabel, a.unlocked && {color: C.white}]}>{a.label}</Text>
            </View>
          );
        })}
      </View>

      <AppCard>
        <View style={styles.lockRow}>
          <View style={styles.lockIcon}><Lock size={22} color={C.lime} /></View>
          <View style={{flex: 1}}>
            <Text style={styles.lockTitle}>Private by design</Text>
            <Text style={styles.lockSub}>Your data never leaves this device.</Text>
          </View>
        </View>
      </AppCard>

      <AppButton title="LOG OUT" variant="danger" icon={LogOut} onPress={() => { say('Signed out'); dispatch({type: 'logout'}); }} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatarCard: {alignItems: 'center', paddingVertical: 30},
  avatar: {width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(139,92,246,0.15)', borderWidth: 2, borderColor: C.violet, alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: C.violet, shadowOpacity: 0.6, shadowRadius: 20, elevation: 10},
  avatarText: {color: C.violet, fontSize: 36, fontWeight: '900'},
  name: {color: C.white, fontSize: 22, fontWeight: '900'},
  email: {color: C.muted, fontSize: 13, marginTop: 6},
  statsRow: {flexDirection: 'row', justifyContent: 'space-around'},
  sectionLabel: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginTop: 8, marginBottom: 10},
  badgesGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16},
  badge: {width: '31%', borderWidth: 1.5, borderColor: C.border, borderRadius: radius.md, padding: 12, alignItems: 'center', backgroundColor: C.surface},
  badgeIcon: {width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10},
  badgeLabel: {color: C.muted, fontSize: 10, fontWeight: '900', letterSpacing: 0.6, textAlign: 'center'},
  lockRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  lockIcon: {width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(16,249,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,249,129,0.4)', alignItems: 'center', justifyContent: 'center'},
  lockTitle: {color: C.white, fontWeight: '900', fontSize: 14},
  lockSub: {color: C.muted, fontSize: 12, marginTop: 3},
});
