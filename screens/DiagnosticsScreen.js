import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ChevronLeft, Activity, Cpu, Zap, Radio, Layers, Database} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {C} from '../theme/colours';
import {useApp} from '../context/AppContext';

export default function DiagnosticsScreen() {
  const {state, dispatch} = useApp();

  const rows = [
    {icon: Cpu, label: 'MODEL', value: 'COCO-SSD', colour: C.lime},
    {icon: Zap, label: 'FPS', value: '28', colour: C.cyan},
    {icon: Radio, label: 'CONFIDENCE', value: `${Math.round(state.settings.confidence * 100)}%`, colour: C.violet},
    {icon: Activity, label: 'FEEDBACK', value: state.settings.feedbackMode, colour: C.magenta},
    {icon: Layers, label: 'OBSTACLES', value: String(state.obstacleCount || 0), colour: C.amber},
    {icon: Database, label: 'SESSIONS', value: String(state.sessions.length), colour: C.cyan},
    {icon: Activity, label: 'STATUS', value: 'Active', colour: C.lime},
  ];

  return (
    <AppScreen num={11} title="System telemetry." subtitle="Live status of the app.">
      <AppButton
        title="BACK"
        variant="ghost"
        icon={ChevronLeft}
        onPress={() => dispatch({type: 'screen', screen: 'home'})}
      />

      <AppCard glow accent={C.lime}>
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <View
              key={row.label}
              style={[styles.row, i === rows.length - 1 && {borderBottomWidth: 0}]}>
              <View style={styles.left}>
                <Icon size={16} color={row.colour} />
                <Text style={styles.label}>{row.label}</Text>
              </View>
              <Text style={[styles.value, {color: row.colour}]}>{row.value}</Text>
            </View>
          );
        })}
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  left: {flexDirection: 'row', alignItems: 'center', gap: 10},
  label: {color: C.muted, fontSize: 12, fontWeight: '900', letterSpacing: 1.4},
  value: {fontSize: 14, fontWeight: '900', letterSpacing: 0.6},
});