import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {useAuth} from '../context/AuthContext';
import {say} from '../utils/speech';
import {tap, error as errorHaptic} from '../utils/haptics';

export default function SignUpScreen() {
  const {dispatch} = useApp();
  const {signUp} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    tap();
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields');
      say('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      say('Password too short');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      say('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      say('Account created. Check your email to verify');
      dispatch({type: 'login', user: {email, name: name.trim()}});
      dispatch({type: 'screen', screen: 'verify'});
    } catch (err) {
      errorHaptic();
      const msg = err.code === 'auth/email-already-in-use' ? 'That email is already registered'
        : err.code === 'auth/invalid-email' ? 'That email address is invalid'
        : err.code === 'auth/weak-password' ? 'Password is too weak'
        : err.message.replace('Firebase: ', '');
      setError(msg);
      say(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen num={2} title="Join EchoPath." subtitle="Create your account to start navigating with sound.">
      <View style={styles.inputWrap}><Text style={styles.label}>FULL NAME</Text><TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={C.muted} style={styles.input} /></View>
      <View style={styles.inputWrap}><Text style={styles.label}>EMAIL</Text><TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={C.muted} style={styles.input} keyboardType="email-address" autoCapitalize="none" /></View>
      <View style={styles.inputWrap}><Text style={styles.label}>PASSWORD</Text><TextInput value={password} onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor={C.muted} style={styles.input} secureTextEntry /></View>
      <View style={styles.inputWrap}><Text style={styles.label}>CONFIRM PASSWORD</Text><TextInput value={confirm} onChangeText={setConfirm} placeholder="Type it again" placeholderTextColor={C.muted} style={styles.input} secureTextEntry /></View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title="CREATE ACCOUNT" onPress={handleSignUp} loading={loading} />
      <AppButton title="BACK TO SIGN IN" variant="ghost" onPress={() => dispatch({type: 'screen', screen: 'login'})} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  inputWrap: {marginBottom: 16},
  label: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginBottom: 8},
  input: {backgroundColor: C.surface2, borderWidth: 1.5, borderColor: C.border, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 15, color: C.white, fontSize: 15, fontWeight: '600'},
  error: {color: C.rose, fontSize: 13, fontWeight: '700', marginBottom: 12, textAlign: 'center'},
});

