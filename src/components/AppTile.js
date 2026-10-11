import React from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {radius} from '../theme/colours';
import {useTheme} from '../theme/useTheme';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function AppTile({icon: Icon, colour, title, sub, onPress}) {
  const {theme} = useTheme();
  const accent = colour || theme.primary;

  function handle() {
    tap();
    say(title);
    onPress?.();
  }

  return (
    <Pressable onPress={handle} style={[styles.tile, {backgroundColor: theme.surface, borderColor: accent + '60', shadowColor: accent}]}>
      <View style={[styles.iconWrap, {backgroundColor: accent + '22', borderColor: accent + '50'}]}>
        <Icon size={22} color={accent} />
      </View>
      <Text style={[styles.title, {color: theme.white}]}>{title}</Text>
      <Text style={[styles.sub, {color: theme.muted}]}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {width: '48%', borderWidth: 1.5, borderRadius: radius.lg, padding: 16, minHeight: 135, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: {width:0,height:4}, elevation: 4},
  iconWrap: {width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 14},
  title: {fontWeight: '900', fontSize: 15},
  sub: {fontSize: 11, marginTop: 4, lineHeight: 15},
});
