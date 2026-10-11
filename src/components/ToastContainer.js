import React, {useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet, View} from 'react-native';
import {Check, AlertCircle, Info, Award} from 'lucide-react-native';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';

function Toast({toast, onDone}) {
  const {theme} = useTheme();
  const slide = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, {toValue: 0, useNativeDriver: true, friction: 8}),
      Animated.timing(opacity, {toValue: 1, duration: 220, useNativeDriver: true}),
    ]).start();

    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slide, {toValue: -120, duration: 220, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0, duration: 220, useNativeDriver: true}),
      ]).start(() => onDone(toast.id));
    }, 2600);

    return () => clearTimeout(t);
  }, []);

  const typeConfig = {
    success: {colour: theme.success, Icon: Check},
    error: {colour: theme.danger, Icon: AlertCircle},
    info: {colour: theme.primary, Icon: Info},
    award: {colour: theme.warning, Icon: Award},
  };

  const conf = typeConfig[toast.type] || typeConfig.info;
  const Icon = conf.Icon;

  return (
    <Animated.View style={[styles.wrap, {transform: [{translateY: slide}], opacity}]}>
      <View style={[styles.inner, {backgroundColor: theme.surface, borderColor: conf.colour + '80', shadowColor: conf.colour}]}>
        <View style={[styles.iconWrap, {backgroundColor: conf.colour + '22'}]}>
          <Icon size={18} color={conf.colour} />
        </View>
        <View style={{flex: 1}}>
          {toast.title ? <Text style={[styles.title, {color: theme.white}]}>{toast.title}</Text> : null}
          {toast.message ? <Text style={[styles.msg, {color: theme.muted}]}>{toast.message}</Text> : null}
        </View>
      </View>
    </Animated.View>
  );
}

export default function ToastContainer() {
  const {state, dispatch} = useApp();
  const toasts = state.toasts || [];

  if (!toasts.length) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDone={(id) => dispatch({type: 'dismissToast', id})} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {position: 'absolute', top: 40, left: 0, right: 0, zIndex: 9999, paddingHorizontal: 20},
  wrap: {marginBottom: 10},
  inner: {flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 16, shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: {width:0,height:6}, elevation: 10},
  iconWrap: {width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'},
  title: {fontWeight: '900', fontSize: 14, letterSpacing: 0.3},
  msg: {fontSize: 12, marginTop: 3, lineHeight: 16},
});
