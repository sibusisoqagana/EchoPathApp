import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {AppProvider, useApp} from './src/context/AppContext';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import ToastContainer from './src/components/ToastContainer';
import {darkPalette} from './src/theme/colours';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import HomeScreen from './src/screens/HomeScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import CelebrationScreen from './src/screens/CelebrationScreen';
import CalibrationScreen from './src/screens/CalibrationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AccessibilityScreen from './src/screens/AccessibilityScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SessionDetailScreen from './src/screens/SessionDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AboutScreen from './src/screens/AboutScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

function Router() {
  const {state} = useApp();
  const {loading} = useAuth();

  if (!state.ready || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={darkPalette.primary} />
      </View>
    );
  }

  switch (state.screen) {
    case 'splash': return <SplashScreen />;
    case 'onboarding': return <OnboardingScreen />;
    case 'login': return <LoginScreen />;
    case 'signup': return <SignUpScreen />;
    case 'verify': return <VerifyScreen />;
    case 'home': return <HomeScreen />;
    case 'navigation': return <NavigationScreen />;
    case 'celebration': return <CelebrationScreen />;
    case 'calibration': return <CalibrationScreen />;
    case 'settings': return <SettingsScreen />;
    case 'accessibility': return <AccessibilityScreen />;
    case 'history': return <HistoryScreen />;
    case 'sessionDetail': return <SessionDetailScreen />;
    case 'profile': return <ProfileScreen />;
    case 'about': return <AboutScreen />;
    case 'diagnostics': return <DiagnosticsScreen />;
    case 'achievements': return <AchievementsScreen />;
    case 'notifications': return <NotificationsScreen />;
    default: return <SplashScreen />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router />
        <ToastContainer />
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {flex: 1, backgroundColor: darkPalette.void, justifyContent: 'center', alignItems: 'center'},
});
