import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ChevronLeft, Lock, LogOut, User as UserIcon} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppStat from '../components/AppStat';
import {C} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';

export default function ProfileScreen() {
  const {state, dispatch} = useApp();

  const initials = (state.user?.name || 'Guest')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AppScreen
      num={9}
      title={state.user?.name || 'Guest'}
      subtitle={state.user?.email || 'Not signed in'}
    >
      <AppButton
        title="BACK"
        variant="ghost"
        icon={ChevronLeft}
        onPress={() => dispatch({type: 'screen', screen: 'home'})}
      />

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
          <AppStat
            value={String(state.sessions.reduce((a, b) => a + b.obstacles, 0))}
            label="AVOIDED"
            colour={C.magenta}
          />
        </View>
      </AppCard>

      <AppCard>
        <View style={styles.lockRow}>
          <View style={styles.lockIcon}>
            <Lock size={22} color={C.lime} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.lockTitle}>Private by design</Text>
            <Text style={styles.lockSub}>Your data never leaves this device.</Text>
          </View>
        </View>
      </AppCard>

      <AppButton
        title="LOG OUT"
        variant="danger"
        icon={LogOut}
        onPress={() => {
          say('Signed out');
          dispatch({type: 'logout'});
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatarCard: {alignItems: 'center', paddingVertical: 30},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderWidth: 2,
    borderColor: C.violet,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: C.violet,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {color: C.violet, fontSize: 36, fontWeight: '900', letterSpacing: 1},
  name: {color: C.white, fontSize: 22, fontWeight: '900'},
  email: {color: C.muted, fontSize: 13, marginTop: 6},
  statsRow: {flexDirection: 'row', justifyContent: 'space-around'},
  lockRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  lockIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16,249,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,249,129,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockTitle: {color: C.white, fontWeight: '900', fontSize: 14},
  lockSub: {color: C.muted, fontSize: 12, marginTop: 3, lineHeight: 16},
});