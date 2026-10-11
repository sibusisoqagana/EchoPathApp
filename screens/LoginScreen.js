import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function LoginScreen() {
  const {dispatch} = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    tap();
    if (!email || !password) {
      setError('Please enter your email and password');
      say('Please enter your email and password');
      return;
    }
    say('Signing in');
    dispatch({type: 'login', user: {email, name: email.split('@')[0]}});
  }

  return (
    <AppScreen num={1} title="Sign in." subtitle="Welcome back to EchoPath.">
      <View style={styles.inputWrap}>
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={C.muted}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor={C.muted}
          style={styles.input}
          secureTextEntry
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title="SIGN IN" onPress={handleLogin} />
      <AppButton title="CREATE AN ACCOUNT" variant="ghost" onPress={() => dispatch({type: 'screen', screen: 'signup'})} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  inputWrap: {marginBottom: 16},
  label: {color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.8, marginBottom: 8},
  input: {
    backgroundColor: C.surface2,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: C.white,
    fontSize: 15,
    fontWeight: '600',
  },
  error: {color: C.rose, fontSize: 13, fontWeight: '700', marginBottom: 12, textAlign: 'center'},
});