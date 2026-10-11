import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ChevronLeft, Clock, Edit3} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppStat from '../components/AppStat';
import {C, gradients, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function HistoryScreen() {
  const {state, dispatch} = useApp();

  const totalObs = state.sessions.reduce((a, b) => a + b.obstacles, 0);
  const totalMin = state.sessions.reduce((a, b) => a + b.duration, 0);
  const maxObs = Math.max(...state.sessions.map(s => s.obstacles), 1);

  const recent = state.sessions.slice(0, 6);

  if (state.sessions.length === 0) {
    return (
      <AppScreen num={7} title="Your sessions." subtitle="No sessions yet.">
        <AppButton
          title="BACK"
          variant="ghost"
          icon={ChevronLeft}
          onPress={() => dispatch({type: 'screen', screen: 'home'})}
        />
        <AppCard glow accent={C.cyan} style={styles.emptyCard}>
          <View style={styles.emptyOrb}>
            <Clock size={44} color={C.cyan} />
          </View>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptySub}>
            Start a navigation session and it will appear here.
          </Text>
        </AppCard>
        <AppButton
          title="START FIRST SESSION"
          onPress={() => dispatch({type: 'start'})}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen num={7} title="Your sessions." subtitle="Every walk is saved on your device.">
      <AppButton
        title="BACK"
        variant="ghost"
        icon={ChevronLeft}
        onPress={() => dispatch({type: 'screen', screen: 'home'})}
      />

      <AppCard glow accent={C.cyan}>
        <View style={styles.statsRow}>
          <AppStat value={String(state.sessions.length)} label="SESSIONS" colour={C.cyan} />
          <AppStat value={String(totalObs)} label="OBSTACLES" colour={C.magenta} />
          <AppStat value={`${totalMin}m`} label="TIME" colour={C.violet} />
        </View>
      </AppCard>

      <Text style={styles.sectionLabel}>OBSTACLES PER SESSION</Text>
      <AppCard>
        <View style={styles.chart}>
          {recent.slice().reverse().map((s, i) => {
            const heightPct = (s.obstacles / maxObs) * 100;
            return (
              <View key={s.id} style={styles.barWrap}>
                <LinearGradient
                  colors={gradients.primary}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}
                  style={[
                    styles.bar,
                    {height: `${Math.max(heightPct, 8)}%`},
                  ]}
                />
                <Text style={styles.barValue}>{s.obstacles}</Text>
              </View>
            );
          })}
        </View>
      </AppCard>

      <Text style={styles.sectionLabel}>RECENT</Text>
      {state.sessions.map(x => (
        <Pressable
          key={x.id}
          onPress={() => {
            tap();
            say(x.date);
            dispatch({type: 'select', session: x});
          }}
          style={styles.sessionRow}>
          <View style={styles.sessionBarAccent} />
          <View style={{flex: 1}}>
            <Text style={styles.sessionDate}>{x.date}</Text>
            <Text style={styles.sessionMeta}>
              {x.time || ''} · {x.duration} min · {x.obstacles} obstacles
            </Text>
          </View>
          <Edit3 size={18} color={C.muted} />
        </Pressable>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  statsRow: {flexDirection: 'row', justifyContent: 'space-around'},
  sectionLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 4,
    marginBottom: 10,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 20,
    gap: 8,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: '70%',
    borderRadius: 6,
    minHeight: 8,
  },
  barValue: {
    color: C.cyan,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 8,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: C.surface,
    borderRadius: radius.md,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  sessionBarAccent: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 14,
    backgroundColor: C.cyan,
  },
  sessionDate: {color: C.white, fontWeight: '900', fontSize: 14, letterSpacing: 0.3},
  sessionMeta: {color: C.muted, fontSize: 12, marginTop: 4},
  emptyCard: {alignItems: 'center', paddingVertical: 40},
  emptyOrb: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: C.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,229,255,0.06)',
  },
  emptyTitle: {color: C.white, fontSize: 20, fontWeight: '900', marginBottom: 8},
  emptySub: {color: C.muted, fontSize: 13, textAlign: 'center', lineHeight: 19},
});