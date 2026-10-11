import React from 'react';
import {View, StyleSheet} from 'react-native';
import {radius} from '../theme/colours';
import {useTheme} from '../theme/useTheme';

export default function AppCard({children, style, glow, accent}) {
  const {theme} = useTheme();
  const accentColour = accent || theme.primary;

  return (
    <View
      style={[
        styles.base,
        {backgroundColor: theme.surface, borderColor: theme.border},
        glow && {
          borderColor: accentColour + '80',
          shadowColor: accentColour,
          shadowOpacity: 0.35,
          shadowRadius: 20,
          shadowOffset: {width:0,height:4},
          elevation: 6,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {borderWidth: 1, borderRadius: radius.lg, padding: 20, marginBottom: 14},
});
