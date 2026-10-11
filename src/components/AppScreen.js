import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useTheme} from '../theme/useTheme';

export default function AppScreen({children, title, subtitle, eyebrow}) {
  const {theme, isDark} = useTheme();

  return (
    <View style={[styles.screen, {backgroundColor: theme.void}]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {eyebrow ? <Text style={[styles.eyebrow, {color: theme.primary}]}>{eyebrow}</Text> : null}
        {title ? <Text style={[styles.title, {color: theme.white}]}>{title}</Text> : null}
        {subtitle ? <Text style={[styles.subtitle, {color: theme.muted}]}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {padding: 24, paddingTop: 60, paddingBottom: 80},
  eyebrow: {fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 8},
  title: {fontSize: 32, fontWeight: '800', lineHeight: 38, marginBottom: 8, letterSpacing: -0.4},
  subtitle: {fontSize: 15, lineHeight: 22, marginBottom: 24},
});
