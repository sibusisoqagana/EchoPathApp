import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {C, gradients, radius} from '../theme/colours';

export default function AppScreen({children, num, title, subtitle, scroll = true}) {
  const content = (
    <>
      {num ? (
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>SCREEN {num}/13</Text>
        </View>
      ) : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[C.void, C.surface, C.void]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content}>{content}</ScrollView>
      ) : (
        <View style={styles.content}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: C.void},
  content: {padding: 24, paddingTop: 60, paddingBottom: 60},
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,229,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 18,
  },
  badgeDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: C.cyan},
  badgeText: {
    color: C.cyan,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 2,
  },
  title: {
    color: C.white,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
});