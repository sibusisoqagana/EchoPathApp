import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {Volume2} from 'lucide-react-native';
import {C} from '../theme/colours';
import {useApp} from '../context/AppContext';

export default function SplashScreen() {
  const {dispatch} = useApp();

  useEffect(() => {
    const t = setTimeout(() => dispatch({type: 'screen', screen: 'login'}), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient colors={[C.void, C.surface, C.void]} style={StyleSheet.absoluteFill} />
      <View style={styles.orbOuter}>
        <LinearGradient
          colors={['rgba(0,229,255,0.2)', 'rgba(139,92,246,0.2)']}
          style={styles.orbGradient}>
          <Volume2 size={64} color={C.cyan} />
        </LinearGradient>
      </View>
      <Text style={styles.brand}>EchoPath</Text>
      <Text style={styles.tag}>Hear what you can't see.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: C.void, justifyContent: 'center', alignItems: 'center'},
  orbOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: C.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 20,
  },
  orbGradient: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {color: C.white, fontSize: 52, fontWeight: '900', marginTop: 34, letterSpacing: -1.5},
  tag: {color: C.cyan, fontSize: 15, marginTop: 10, fontWeight: '600', letterSpacing: 0.5},
});