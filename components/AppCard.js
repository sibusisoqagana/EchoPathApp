import React from 'react';
import {View, StyleSheet} from 'react-native';
import {C, radius} from '../theme/colours';

export default function AppCard({children, style, glow, accent = C.cyan}) {
  return (
    <View
      style={[
        styles.base,
        glow && {
          borderColor: accent + '80',
          shadowColor: accent,
          shadowOpacity: 0.35,
          shadowRadius: 20,
          shadowOffset: {width: 0, height: 4},
          elevation: 6,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 14,
  },
});