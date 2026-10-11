import React from 'react';
import {Pressable, Text, StyleSheet, ActivityIndicator, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {C, gradients, radius} from '../theme/colours';
import {say} from '../utils/speech';
import {tap} from '../utils/haptics';

export default function AppButton({title, onPress, variant = 'primary', loading = false, icon: Icon, speak = true, disabled = false}) {
  const gradient = variant === 'danger' ? gradients.danger : variant === 'ghost' ? null : gradients.primary;

  function handle() {
    if (disabled || loading) return;
    tap();
    if (speak) say(title);
    onPress?.();
  }

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : C.white} />
      ) : (
        <>
          {Icon ? (
            <Icon
              size={20}
              color={variant === 'primary' ? '#000' : C.white}
              style={{marginRight: 10}}
            />
          ) : null}
          <Text
            style={[
              styles.text,
              variant === 'primary' && {color: '#000'},
              variant === 'ghost' && {color: C.cyan},
            ]}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (gradient) {
    return (
      <Pressable onPress={handle} disabled={disabled || loading} style={styles.wrap}>
        <LinearGradient
          colors={gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.base, variant === 'primary' && styles.glow]}>
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handle}
      disabled={disabled || loading}
      style={[styles.wrap, styles.base, styles.ghost, disabled && {opacity: 0.5}]}>
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: 12},
  base: {
    minHeight: 60,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  glow: {
    shadowColor: C.cyan,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  ghost: {backgroundColor: 'transparent', borderColor: C.violet},
  text: {fontWeight: '900', fontSize: 15, letterSpacing: 1.2, color: C.white},
});