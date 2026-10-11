import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Zap} from 'lucide-react-native';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';

const LEVEL_XP = 100;

export default function XpBar() {
  const {state} = useApp();
  const {theme} = useTheme();
  const xp = state.xp || 0;
  const level = state.level || 1;
  const xpInLevel = xp % LEVEL_XP;
  const pct = (xpInLevel / LEVEL_XP) * 100;

  return (
    <View style={[styles.wrap, {backgroundColor: theme.surface, borderColor: theme.border}]}>
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <Zap size={14} color={theme.warning} fill={theme.warning} />
          <Text style={[styles.levelText, {color: theme.white}]}>LEVEL {level}</Text>
        </View>
        <Text style={[styles.xpText, {color: theme.muted}]}>{xpInLevel} / {LEVEL_XP} XP</Text>
      </View>
      <View style={[styles.track, {backgroundColor: theme.surface2}]}>
        <LinearGradient
          colors={[theme.warning, theme.danger]}
          start={{x:0,y:0}} end={{x:1,y:0}}
          style={[styles.fill, {width: Math.max(pct, 2) + '%'}]}
        />
      </View>
      <Text style={[styles.totalXp, {color: theme.muted}]}>Total: {xp} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {borderWidth: 1, borderRadius: radius.lg, padding: 16, marginBottom: 14},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  levelBadge: {flexDirection: 'row', alignItems: 'center', gap: 6},
  levelText: {fontWeight: '900', fontSize: 13, letterSpacing: 1.2},
  xpText: {fontSize: 11, fontWeight: '800', letterSpacing: 0.6},
  track: {height: 8, borderRadius: 4, overflow: 'hidden'},
  fill: {height: '100%', borderRadius: 4},
  totalXp: {fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 8, textAlign: 'right'},
});
