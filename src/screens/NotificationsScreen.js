import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {ChevronLeft, Bell, Footprints, Award, Trophy, Sparkles, Trash2} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';
import {tap} from '../utils/haptics';

const ICONS = {
  session: Footprints,
  level: Sparkles,
  award: Trophy,
  welcome: Bell,
};

export default function NotificationsScreen() {
  const {state, dispatch} = useApp();
  const {theme} = useTheme();
  const notifications = state.notifications || [];

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    const days = Math.floor(hours / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  return (
    <AppScreen title="Notifications" subtitle={notifications.length === 0 ? 'Nothing yet' : notifications.length + ' updates'}>
      <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />

      {notifications.length === 0 ? (
        <AppCard glow accent={theme.primary} style={styles.emptyCard}>
          <View style={[styles.emptyOrb, {borderColor: theme.primary, backgroundColor: theme.primary + '15'}]}>
            <Bell size={44} color={theme.primary} />
          </View>
          <Text style={[styles.emptyTitle, {color: theme.white}]}>All quiet</Text>
          <Text style={[styles.emptySub, {color: theme.muted}]}>
            Session summaries, level-ups and badge unlocks will appear here.
          </Text>
        </AppCard>
      ) : (
        <>
          {notifications.map(n => {
            const Icon = ICONS[n.type] || Bell;
            const colour = n.type === 'level' ? theme.warning
              : n.type === 'award' ? theme.magenta
              : n.type === 'session' ? theme.primary
              : theme.secondary;
            return (
              <View
                key={n.id}
                style={[styles.notif, {backgroundColor: theme.surface, borderColor: theme.border, opacity: n.read ? 0.65 : 1}]}>
                <View style={[styles.notifIcon, {backgroundColor: colour + '20', borderColor: colour + '50'}]}>
                  <Icon size={22} color={colour} />
                </View>
                <View style={{flex: 1}}>
                  <View style={styles.notifTop}>
                    <Text style={[styles.notifTitle, {color: theme.white}]}>{n.title}</Text>
                    {!n.read && <View style={[styles.unreadDot, {backgroundColor: colour}]} />}
                  </View>
                  <Text style={[styles.notifBody, {color: theme.muted}]}>{n.body}</Text>
                  <Text style={[styles.notifTime, {color: theme.muted}]}>{timeAgo(n.time)}</Text>
                </View>
              </View>
            );
          })}
          <AppButton
            title="CLEAR ALL"
            variant="ghost"
            icon={Trash2}
            onPress={() => { tap(); dispatch({type: 'clearNotifications'}); }}
          />
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  emptyCard: {alignItems: 'center', paddingVertical: 50},
  emptyOrb: {width: 100, height: 100, borderRadius: 50, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 22},
  emptyTitle: {fontSize: 22, fontWeight: '800', marginBottom: 8},
  emptySub: {fontSize: 13, textAlign: 'center', lineHeight: 19, maxWidth: 260},
  notif: {flexDirection: 'row', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1, marginBottom: 10, alignItems: 'flex-start'},
  notifIcon: {width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center'},
  notifTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4},
  notifTitle: {fontSize: 14, fontWeight: '800'},
  unreadDot: {width: 8, height: 8, borderRadius: 4},
  notifBody: {fontSize: 12, lineHeight: 17},
  notifTime: {fontSize: 10, marginTop: 6, letterSpacing: 0.5},
});
