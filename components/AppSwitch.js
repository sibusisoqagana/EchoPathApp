import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {C} from '../theme/colours';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function AppSwitch({title, subtitle, value, onChange}) {
  function handle(v) {
    tap();
    say(`${title} ${v ? 'on' : 'off'}`);
    onChange?.(v);
  }

  return (
    <View style={styles.row}>
      <View style={{flex: 1, paddingRight: 12}}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={handle}
        trackColor={{true: C.cyan, false: C.border}}
        thumbColor={C.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  title: {color: C.white, fontSize: 14, fontWeight: '700'},
  sub: {color: C.muted, fontSize: 11, marginTop: 3, lineHeight: 15},
});