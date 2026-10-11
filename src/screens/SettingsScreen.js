import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {ChevronLeft, Moon, Sun} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppSwitch from '../components/AppSwitch';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function SettingsScreen() {
  const {state, dispatch} = useApp();
  const {theme, isDark} = useTheme();
  const c = state.settings;

  function set(patch) {
    tap();
    dispatch({type: 'set', patch});
  }

  return (
    <AppScreen num={5} title="Tune it." subtitle="Adjust how EchoPath behaves.">
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />

      <Text style={[styles.sectionLabel, {color: theme.muted}]}>APPEARANCE</Text>
      <AppCard>
        <View style={styles.themeRow}>
          <Pressable
            onPress={() => { tap(); say('Dark mode'); dispatch({type: 'set', patch: {darkMode: true}}); }}
            style={[styles.themeCard, {borderColor: isDark ? theme.primary : theme.border, backgroundColor: isDark ? theme.primary + '15' : theme.surface2}]}>
            <Moon size={26} color={isDark ? theme.primary : theme.muted} />
            <Text style={[styles.themeTitle, {color: isDark ? theme.white : theme.muted}]}>Dark</Text>
          </Pressable>
          <Pressable
            onPress={() => { tap(); say('Light mode'); dispatch({type: 'set', patch: {darkMode: false}}); }}
            style={[styles.themeCard, {borderColor: !isDark ? theme.primary : theme.border, backgroundColor: !isDark ? theme.primary + '15' : theme.surface2}]}>
            <Sun size={26} color={!isDark ? theme.primary : theme.muted} />
            <Text style={[styles.themeTitle, {color: !isDark ? theme.white : theme.muted}]}>Light</Text>
          </Pressable>
        </View>
      </AppCard>

      <Text style={[styles.sectionLabel, {color: theme.muted}]}>DETECTION</Text>
      <AppCard>
        <Text style={[styles.label, {color: theme.muted}]}>MINIMUM CONFIDENCE | {Math.round(c.confidence * 100)}%</Text>
        <View style={styles.dotsRow}>
          {[0.4, 0.48, 0.55, 0.62, 0.7].map(v => (
            <Pressable
              key={v}
              onPress={() => { tap(); say(Math.round(v * 100) + ' percent'); dispatch({type: 'set', patch: {confidence: v}}); }}
              style={[styles.dot, {backgroundColor: v === c.confidence ? theme.primary : theme.surface2}, v === c.confidence && {shadowColor: theme.primary, shadowOpacity: 0.9, shadowRadius: 14, elevation: 8}]}
            />
          ))}
        </View>

        <Text style={[styles.label, {color: theme.muted}]}>FEEDBACK MODE</Text>
        <View style={styles.row}>
          <Pressable
            onPress={() => { tap(); say('Tone mode'); dispatch({type: 'set', patch: {feedbackMode: 'tone'}}); }}
            style={[styles.choice, {borderColor: c.feedbackMode === 'tone' ? theme.primary : theme.border, backgroundColor: c.feedbackMode === 'tone' ? theme.primary + '18' : theme.surface2}]}>
            <Text style={[styles.choiceText, {color: theme.white}]}>Tone</Text>
          </Pressable>
          <Pressable
            onPress={() => { tap(); say('Speech mode'); dispatch({type: 'set', patch: {feedbackMode: 'speech'}}); }}
            style={[styles.choice, {borderColor: c.feedbackMode === 'speech' ? theme.primary : theme.border, backgroundColor: c.feedbackMode === 'speech' ? theme.primary + '18' : theme.surface2}]}>
            <Text style={[styles.choiceText, {color: theme.white}]}>Speech</Text>
          </Pressable>
        </View>
      </AppCard>

      <Text style={[styles.sectionLabel, {color: theme.muted}]}>FEEDBACK</Text>
      <AppCard>
        <AppSwitch title="Haptic warnings" subtitle="Vibrate when close obstacle" value={c.haptics} onChange={v => set({haptics: v})} />
        <AppSwitch title="Voice cues" subtitle="Spoken obstacle descriptions" value={c.voice} onChange={v => set({voice: v})} />
        <AppSwitch title="Auto-speak on tap" subtitle="Read every button out loud" value={c.autoSpeak} onChange={v => set({autoSpeak: v})} />
        <AppSwitch title="Notifications" subtitle="Session summaries and level-ups" value={c.notifications} onChange={v => set({notifications: v})} />
      </AppCard>

      <AppButton title="SAVE SETTINGS" onPress={() => { say('Settings saved'); dispatch({type: 'screen', screen: 'home'}); }} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginTop: 8, marginBottom: 10},
  themeRow: {flexDirection: 'row', gap: 12},
  themeCard: {flex: 1, borderWidth: 2, borderRadius: radius.md, paddingVertical: 20, alignItems: 'center', gap: 10},
  themeTitle: {fontSize: 13, fontWeight: '900', letterSpacing: 1},
  label: {fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginTop: 6, marginBottom: 12},
  dotsRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12},
  dot: {width: 26, height: 26, borderRadius: 13},
  row: {flexDirection: 'row', gap: 10},
  choice: {flex: 1, borderWidth: 1.5, borderRadius: radius.md, padding: 15, alignItems: 'center'},
  choiceText: {fontWeight: '900', fontSize: 13},
});
