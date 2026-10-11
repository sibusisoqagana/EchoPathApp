import React from 'react';
import {Pressable, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {radius} from '../theme/colours';
import {useTheme} from '../theme/useTheme';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function AppButton({title, onPress, variant = 'primary', loading = false, icon: Icon, disabled = false}) {
  const {theme} = useTheme();

  const gradients = {
    primary: [theme.primary, theme.secondary],
    danger: [theme.danger, theme.magenta],
    success: [theme.success, theme.primary],
  };

  function handle() {
    if (disabled || loading) return;
    tap();
    say(title);
    onPress?.();
  }

  const inner = loading ? (
    <ActivityIndicator color={variant === 'primary' ? '#000' : theme.white} />
  ) : (
    <>
      {Icon ? <Icon size={20} color={variant === 'primary' ? '#000' : theme.white} style={{marginRight: 10}} /> : null}
      <Text style={[styles.text, {color: variant === 'primary' ? '#000' : theme.white}, variant === 'ghost' && {color: theme.primary}]}>{title}</Text>
    </>
  );

  if (variant === 'ghost') {
    return (
      <Pressable onPress={handle} disabled={disabled || loading} style={[styles.wrap, styles.base, {borderColor: theme.secondary, backgroundColor: 'transparent'}, disabled && {opacity: 0.5}]}>
        {inner}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handle} disabled={disabled || loading} style={styles.wrap}>
      <LinearGradient
        colors={gradients[variant] || gradients.primary}
        start={{x:0,y:0}} end={{x:1,y:0}}
        style={[styles.base, variant === 'primary' && {shadowColor: theme.primary, shadowOpacity: 0.5, shadowRadius: 18, shadowOffset: {width:0,height:4}, elevation: 8}]}>
        {inner}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: 12},
  base: {minHeight: 60, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 22, borderWidth: 1.5},
  text: {fontWeight: '900', fontSize: 15, letterSpacing: 1.2},
});
