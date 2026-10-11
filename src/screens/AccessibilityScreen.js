import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {ChevronLeft, Music, MessageSquare} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppSwitch from '../components/AppSwitch';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function AccessibilityScreen() {
  const {state, dispatch} = useApp();
  const c = state.settings;
  function set(patch) { tap(); dispatch({type: 'set', patch}); }
  return (
    <AppScreen num={6} title="Make it yours." subtitle="Choose how EchoPath communicates with you.">
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />
      <Text style={styles.label}>FEEDBACK STYLE</Text>
      <View style={styles.row}>
        <Pressable onPress={() => { tap(); say('Tone mode'); dispatch({type: 'set', patch: {feedbackMode: 'tone'}}); }} style={[styles.modeCard, c.feedbackMode === 'tone' && {borderColor: C.cyan, backgroundColor: 'rgba(0,229,255,0.1)'}]}>
          <Music size={34} color={C.cyan} />
          <Text style={styles.modeTitle}>Tone</Text>
          <Text style={styles.modeDesc}>Abstract sounds for position</Text>
        </Pressable>
        <Pressable onPress={() => { tap(); say('Speech mode'); dispatch({type: 'set', patch: {feedbackMode: 'speech'}}); }} style={[styles.modeCard, c.feedbackMode === 'speech' && {borderColor: C.magenta, backgroundColor: 'rgba(236,72,153,0.1)'}]}>
          <MessageSquare size={34} color={C.magenta} />
          <Text style={styles.modeTitle}>Speech</Text>
          <Text style={styles.modeDesc}>Spoken obstacle descriptions</Text>
        </Pressable>
      </View>
      <AppCard>
        <AppSwitch title="Large text" subtitle="Increase font sizes" value={c.largeText} onChange={v => set({largeText: v})} />
        <AppSwitch title="High contrast" subtitle="Maximum visibility" value={c.highContrast} onChange={v => set({highContrast: v})} />
        <AppSwitch title="Screen reader" subtitle="VoiceOver support" value={c.screenReader} onChange={v => set({screenReader: v})} />
      </AppCard>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  label: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginTop: 4, marginBottom: 12},
  row: {flexDirection: 'row', gap: 12, marginBottom: 20},
  modeCard: {flex: 1, borderWidth: 2, borderColor: C.border, borderRadius: radius.lg, padding: 20, alignItems: 'center', backgroundColor: C.surface, minHeight: 150, justifyContent: 'center'},
  modeTitle: {color: C.white, fontWeight: '900', fontSize: 15, marginTop: 12},
  modeDesc: {color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 6, lineHeight: 15},
});
