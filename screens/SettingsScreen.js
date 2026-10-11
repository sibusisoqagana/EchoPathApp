import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppSwitch from '../components/AppSwitch';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function SettingsScreen() {
  const {state, dispatch} = useApp();
  const c = state.settings;

  function set(patch) {
    tap();
    dispatch({type: 'set', patch});
  }

  return (
    <AppScreen num={5} title="Tune it." subtitle="Adjust how EchoPath behaves.">
      <AppButton
        title="BACK"
        variant="ghost"
        icon={ChevronLeft}
        onPress={() => dispatch({type: 'screen', screen: 'home'})}
      />

      <AppCard>
        <Text style={styles.label}>
          MINIMUM CONFIDENCE · {Math.round(c.confidence * 100)}%
        </Text>
        <View style={styles.dotsRow}>
          {[0.4, 0.48, 0.55, 0.62, 0.7].map(v => (
            <Pressable
              key={v}
              onPress={() => {
                tap();
                say(`${Math.round(v * 100)} percent`);
                dispatch({type: 'set', patch: {confidence: v}});
              }}
              style={[styles.dot, v === c.confidence && styles.dotOn]}
            />
          ))}
        </View>

        <Text style={styles.label}>FEEDBACK MODE</Text>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              tap();
              say('Tone mode');
              dispatch({type: 'set', patch: {feedbackMode: 'tone'}});
            }}
            style={[styles.choice, c.feedbackMode === 'tone' && styles.choiceOn]}>
            <Text style={styles.choiceText}>Tone</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              tap();
              say('Speech mode');
              dispatch({type: 'set', patch: {feedbackMode: 'speech'}});
            }}
            style={[styles.choice, c.feedbackMode === 'speech' && styles.choiceOn]}>
            <Text style={styles.choiceText}>Speech</Text>
          </Pressable>
        </View>
      </AppCard>

      <AppCard>
        <AppSwitch
          title="Haptic warnings"
          subtitle="Vibrate when close obstacle"
          value={c.haptics}
          onChange={v => set({haptics: v})}
        />
        <AppSwitch
          title="Voice cues"
          subtitle="Spoken obstacle descriptions"
          value={c.voice}
          onChange={v => set({voice: v})}
        />
        <AppSwitch
          title="Auto-speak on tap"
          subtitle="Read every button out loud"
          value={c.autoSpeak}
          onChange={v => set({autoSpeak: v})}
        />
      </AppCard>

      <AppButton
        title="SAVE SETTINGS"
        onPress={() => {
          say('Settings saved');
          dispatch({type: 'screen', screen: 'home'});
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 16,
    marginBottom: 12,
  },
  dotsRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6},
  dot: {width: 26, height: 26, borderRadius: 13, backgroundColor: C.surface2},
  dotOn: {
    backgroundColor: C.cyan,
    shadowColor: C.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 8,
  },
  row: {flexDirection: 'row', gap: 10, marginBottom: 4},
  choice: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: radius.md,
    padding: 15,
    alignItems: 'center',
    backgroundColor: C.surface2,
  },
  choiceOn: {
    borderColor: C.cyan,
    backgroundColor: 'rgba(0,229,255,0.12)',
    shadowColor: C.cyan,
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  choiceText: {color: C.white, fontWeight: '900', fontSize: 13, letterSpacing: 0.8},
});