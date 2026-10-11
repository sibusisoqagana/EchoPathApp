import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {useTheme} from '../theme/useTheme';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function AppSwitch({title, subtitle, value, onChange}) {
  const {theme} = useTheme();

  function handle(v) {
    tap();
    say(title + ' ' + (v ? 'on' : 'off'));
    onChange?.(v);
  }

  return (
    <View style={[styles.row, {borderColor: theme.border}]}>
      <View style={{flex: 1, paddingRight: 12}}>
        <Text style={[styles.title, {color: theme.white}]}>{title}</Text>
        {subtitle ? <Text style={[styles.sub, {color: theme.muted}]}>{subtitle}</Text> : null}
      </View>
      <Switch value={value} onValueChange={handle} trackColor={{true: theme.primary, false: theme.border}} thumbColor="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1},
  title: {fontSize: 14, fontWeight: '700'},
  sub: {fontSize: 11, marginTop: 3, lineHeight: 15},
});
