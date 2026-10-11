import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ChevronLeft, Clock, Edit3, TrendingUp, TrendingDown} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppStat from '../components/AppStat';
import {C, gradients, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

function getWeekComparison(sessions) {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const thisWeek = sessions.filter(s => now - s.id < week);
  const lastWeek = sessions.filter(s => now - s.id >= week && now - s.id < week * 2);
  const current = thisWeek.reduce((a, b) => a + b.obstacles, 0);
  const previous = lastWeek.reduce((a, b) => a + b.obstacles, 0);
  const diff = current - previous;
  const pct = previous === 0 ? (current > 0 ? 100 : 0) : Math.round((diff / previous) * 100);
  return {current, previous, diff, pct};
}

export default function HistoryScreen() {
  const {state, dispatch} = useApp();
  const totalObs = state.sessions.reduce((a, b) => a + b.obstacles, 0);
  const totalMin = state.sessions.reduce((a, b) => a + b.duration, 0);
  const maxObs = Math.max(...state.sessions.map(s => s.obstacles), 1);
  const recent = state.sessions.slice(0, 6);
  const week = getWeekComparison(state.sessions);
  const isUp = week.diff > 0;

  if (state.sessions.length === 0) {
    return (
      <AppScreen title="Your sessions." subtitle="No sessions yet.">
        <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />
        <AppCard glow accent={C.primary} style={styles.emptyCard}>
          <View style={styles.emptyOrb}><Clock size={44} color={C.primary} /></View>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptySub}>Start a navigation session and it will appear here.</Text>
        </AppCard>
        <AppButton title="START FIRST SESSION" onPress={() => dispatch({type: 'start'})} />
      </AppScreen>
    );
  }

  return (
    <AppScreen title="Your sessions." subtitle="Every walk is saved on your device.">
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />

      <AppCard glow accent={C.primary}>
        <View style={styles.statsRow}>
          <AppStat value={String(state.sessions.length)} label="SESSIONS" colour={C.primary} />
          <AppStat value={String(totalObs)} label="OBSTACLES" colour={C.secondary} />
          <AppStat value={totalMin + 'm'} label="TIME" colour={C.success} />
        </View>
      </AppCard>

      <AppCard>
        <View style={styles.weekHeader}>
          <View>
            <Text style={styles.weekLabel}>THIS WEEK</Text>
            <Text style={styles.weekValue}>{week.current} obstacles</Text>
          </View>
          <View style={[styles.weekBadge, {backgroundColor: isUp ? C.warning + '20' : C.success + '20'}]}>
            {isUp ? <TrendingUp size={14} color={C.warning} /> : <TrendingDown size={14} color={C.success} />}
            <Text style={[styles.weekBadgeText, {color: isUp ? C.warning : C.success}]}>
              {week.previous === 0 ? 'First week' : (isUp ? '+' : '') + week.pct + '%'}
            </Text>
          </View>
        </View>
      </AppCard>

      <Text style={styles.sectionLabel}>OBSTACLES PER SESSION</Text>
      <AppCard>
        <View style={styles.chart}>
          {recent.slice().reverse().map(s => {
            const heightPct = Math.min((s.obstacles / maxObs) * 100, 85);
            return (
              <View key={s.id} style={styles.barWrap}>
                <LinearGradient
                  colors={gradients.primary}
                  start={{x:0,y:1}}
                  end={{x:0,y:0}}
                  style={[styles.bar, {height: Math.max(heightPct, 12) + '%'}]}
                />
                <Text style={styles.barValue}>{s.obstacles}</Text>
              </View>
            );
          })}
        </View>
      </AppCard>

      <Text style={styles.sectionLabel}>RECENT</Text>
      {state.sessions.map(x => (
        <Pressable key={x.id} onPress={() => { tap(); say(x.date); dispatch({type: 'select', session: x}); }} style={styles.sessionRow}>
          <View style={styles.sessionBarAccent} />
          <View style={{flex: 1}}>
            <Text style={styles.sessionDate}>{x.date}</Text>
            <Text style={styles.sessionMeta}>{x.time}  |  {x.duration} min  |  {x.obstacles} obstacles</Text>
          </View>
          <Edit3 size={18} color={C.muted} />
        </Pressable>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  statsRow: {flexDirection: 'row', justifyContent: 'space-around'},
  weekHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  weekLabel: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.6, marginBottom: 6},
  weekValue: {color: C.white, fontSize: 22, fontWeight: '900'},
  weekBadge: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999},
  weekBadgeText: {fontSize: 11, fontWeight: '900', letterSpacing: 0.5},
  sectionLabel: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginTop: 8, marginBottom: 10},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingTop: 30, gap: 8},
  barWrap: {flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%'},
  bar: {width: '70%', borderRadius: 8, minHeight: 12},
  barValue: {color: C.primary, fontSize: 11, fontWeight: '900', marginTop: 10},
  sessionRow: {flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: C.surface, borderRadius: radius.md, marginBottom: 10, borderWidth: 1.5, borderColor: C.border},
  sessionBarAccent: {width: 4, height: 40, borderRadius: 2, marginRight: 14, backgroundColor: C.primary},
  sessionDate: {color: C.white, fontWeight: '900', fontSize: 14},
  sessionMeta: {color: C.muted, fontSize: 12, marginTop: 4},
  emptyCard: {alignItems: 'center', paddingVertical: 40},
  emptyOrb: {width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20, backgroundColor: C.primary + '15'},
  emptyTitle: {color: C.white, fontSize: 20, fontWeight: '900', marginBottom: 8},
  emptySub: {color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 19},
});
