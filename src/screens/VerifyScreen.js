import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Mail} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {useApp} from '../context/AppContext';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../theme/useTheme';
import {say} from '../utils/speech';

export default function VerifyScreen() {
  const {dispatch} = useApp();
  const {user, resendVerification, refreshUser, logOut} = useAuth();
  const {theme} = useTheme();
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function handleResend() {
    try {
      await resendVerification();
      setSent(true);
      say('Verification email sent again');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCheck() {
    setChecking(true);
    setError('');
    try {
      const verified = await refreshUser();
      if (verified) {
        say('Email verified. Welcome');
        dispatch({type: 'login', user: {email: user.email, name: user.displayName || user.email.split('@')[0]}});
      } else {
        say('Not verified yet. Check your inbox');
        setError('Email not verified yet. Check your inbox (and spam folder).');
      }
    } finally {
      setChecking(false);
    }
  }

  async function handleLogout() {
    await logOut();
    dispatch({type: 'logout'});
  }

  return (
    <AppScreen title="Check your email" subtitle={'We sent a link to ' + (user?.email || 'your email') + '.'}>
      <AppCard glow accent={theme.primary} style={styles.card}>
        <View style={[styles.orb, {borderColor: theme.primary, backgroundColor: theme.primary + '15'}]}>
          <Mail size={48} color={theme.primary} />
        </View>
        <Text style={[styles.instructions, {color: theme.muted}]}>
          Open the email, tap the verification link, then come back here and tap the button below.
        </Text>
      </AppCard>

      {error ? <Text style={[styles.error, {color: theme.danger}]}>{error}</Text> : null}

      <AppButton title="I'VE VERIFIED MY EMAIL" onPress={handleCheck} loading={checking} />
      <AppButton title={sent ? 'EMAIL RESENT' : 'RESEND VERIFICATION EMAIL'} variant="ghost" onPress={handleResend} />
      <AppButton title="USE A DIFFERENT ACCOUNT" variant="ghost" onPress={handleLogout} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {alignItems: 'center', paddingVertical: 40},
  orb: {width: 100, height: 100, borderRadius: 50, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 22},
  instructions: {fontSize: 14, textAlign: 'center', lineHeight: 21},
  error: {fontSize: 13, fontWeight: '700', textAlign: 'center', marginBottom: 12, paddingHorizontal: 10},
});
