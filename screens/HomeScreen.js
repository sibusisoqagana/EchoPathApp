import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Play, Target, Clock, Settings as SettingsIcon, Volume2, User, Activity} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppTile from '../components/AppTile';
import {C} from '../theme/colours';
import {useApp} from '../context/AppContext';

export default function HomeScreen() {
  const {state, dispatch} = useApp();

  return (
    <AppScreen num={3} title="Move with awareness." subtitle="Offline-first AI navigation for the visually impaired.">
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>SYSTEM READY</Text>
      </View>

      <AppButton
        title="START NAVIGATION"
        icon={Play}
        onPress={() => dispatch({type: 'start'})}
      />
      <AppButton
        title="CALIBRATE"
        variant="ghost"
        icon={Target}
        onPress={() => {
          dispatch({type: 'setCalibration', step: 1});
          dispatch({type: 'screen', screen: 'calibration'});
        }}
      />

      <View style={styles.grid}>
        <AppTile
          icon={Clock}
          colour={C.cyan}
          title="History"
          sub={`${state.sessions.length} sessions`}
          onPress={() => dispatch({type: 'screen', screen: 'history'})}
        />
        <AppTile
          icon={SettingsIcon}
          colour={C.violet}
          title="Settings"
          sub="Voice · cues"
          onPress={() => dispatch({type: 'screen', screen: 'settings'})}
        />
        <AppTile
          icon={Volume2}
          colour={C.magenta}
          title="How It Works"
          sub="Detection flow"
          onPress={() => dispatch({type: 'screen', screen: 'about'})}
        />
        <AppTile
          icon={User}
          colour={C.lime}
          title="Accessibility"
          sub="Display · feedback"
          onPress={() => dispatch({type: 'screen', screen: 'accessibility'})}
        />
      </View>

      <AppButton
        title="PROFILE"
        variant="ghost"
        icon={User}
        onPress={() => dispatch({type: 'screen', screen: 'profile'})}
      />
      <AppButton
        title="DIAGNOSTICS"
        variant="ghost"
        icon={Activity}
        onPress={() => dispatch({type: 'screen', screen: 'diagnostics'})}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 22},
  statusDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: C.lime},
  statusText: {color: C.lime, fontWeight: '900', fontSize: 12, letterSpacing: 2},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 14,
  },
});