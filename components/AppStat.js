import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {C} from '../theme/colours';

export default function AppStat({value, label, colour = C.cyan}) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.value, {color: colour}]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', flex: 1},
  value: {fontSize: 26, fontWeight: '900', letterSpacing: -0.5},
  label: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginTop: 6,
  },
});