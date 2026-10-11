import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {ChevronLeft, Trash2, Check, Star} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppStat from '../components/AppStat';
import RouteMap from '../components/RouteMap';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';
import {tap, success} from '../utils/haptics';

export default function SessionDetailScreen() {
  const {state, dispatch} = useApp();
  const sel = state.selectedSession;
  const [note, setNote] = useState(sel?.note || '');
  const [rating, setRating] = useState(sel?.rating || 0);
  if (!sel) return null;
  function handleRating(n) { tap(); say(n + ' stars'); setRating(n); }
  return (
    <AppScreen num={8} title={sel.date} subtitle="Session details and notes.">
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'history'})} />
      <RouteMap coordinates={sel.route || []} />
      <AppCard>
        <View style={styles.statsRow}>
          <AppStat value={sel.duration + 'm'} label="DURATION" colour={C.cyan} />
          <AppStat value={String(sel.obstacles)} label="OBSTACLES" colour={C.magenta} />
          <AppStat value="1" label="NEAR MISS" colour={C.rose} />
        </View>
      </AppCard>
      <Text style={styles.label}>RATE THIS SESSION</Text>
      <View style={styles.starsRow}>
        {[1,2,3,4,5].map(n => (
          <Pressable key={n} onPress={() => handleRating(n)} style={styles.starWrap}>
            <Star size={36} color={n <= rating ? C.amber : C.border} fill={n <= rating ? C.amber : 'transparent'} />
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>NOTES</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="Add a note about this session" placeholderTextColor={C.muted} style={styles.input} multiline />
      <AppButton title="SAVE CHANGES" icon={Check} onPress={() => { success(); say('Note updated'); dispatch({type: 'updateSession', id: sel.id, patch: {note, rating}}); }} />
      <AppButton title="DELETE SESSION" variant="danger" icon={Trash2} onPress={() => { say('Session deleted'); dispatch({type: 'deleteSession', id: sel.id}); }} />
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  statsRow: {flexDirection: 'row', justifyContent: 'space-around'},
  label: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginTop: 14, marginBottom: 10},
  starsRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 10},
  starWrap: {padding: 4},
  input: {backgroundColor: C.surface2, borderWidth: 1.5, borderColor: C.border, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: C.white, fontSize: 15, fontWeight: '600', minHeight: 90, textAlignVertical: 'top', marginBottom: 20},
});
