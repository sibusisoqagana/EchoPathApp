import React, {useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet, View} from 'react-native';
import {Check, AlertCircle} from 'lucide-react-native';
import {C, radius} from '../theme/colours';

export default function AppToast({message, type = 'success', visible, onHide}) {
  const slide = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slide, {toValue: 60, useNativeDriver: true, friction: 7}),
        Animated.timing(opacity, {toValue: 1, duration: 250, useNativeDriver: true}),
      ]).start();
      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slide, {toValue: -100, duration: 250, useNativeDriver: true}),
          Animated.timing(opacity, {toValue: 0, duration: 250, useNativeDriver: true}),
        ]).start(() => onHide?.());
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const colour = type === 'error' ? C.rose : C.lime;
  const Icon = type === 'error' ? AlertCircle : Check;

  return (
    <Animated.View style={[styles.wrap, {transform: [{translateY: slide}], opacity}]}>
      <View style={[styles.inner, {borderColor: colour + '80', shadowColor: colour}]}>
        <Icon size={20} color={colour} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {position: 'absolute', left: 20, right: 20, zIndex: 999},
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface2,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 6},
    elevation: 10,
  },
  text: {color: C.white, fontSize: 14, fontWeight: '700', flex: 1},
});
