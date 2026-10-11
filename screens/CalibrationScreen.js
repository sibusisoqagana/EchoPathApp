import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Target, ChevronLeft} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {C, gradients} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say} from '../utils/speech';

export default function CalibrationScreen() {
  const {state, dispatch} = useApp();
  const step = state.calibrationStep || 1;

  const steps = {
    1: {title: 'Set your baseline.', sub: 'Hold the phone at chest height, pointing forward.'},
    2: {title: 'Point at open space.', sub: 'Aim the camera at a clear area in front of you.'},
    3: {title: 'Stay still.', sub: 'Hold the position for three seconds while we measure.'},
  };

  function handleNext() {
    if (step < 3) {
      dispatch({type: 'setCalibration', step: step + 1});
      say(`Step ${step + 1} of 3`);
    } else {
      dispatch({type: 'setCalibration', step: 1});
      say('Calibration complete');
      dispatch({type: 'screen', screen: 'home'});
    }
  }

  const labels = ['BEGIN CALIBRATION', 'NEXT STEP', 'COMPLETE CALIBRATION'];
  const buttonLabel = labels[step - 1];
  const progressPct = (step / 3) * 100;

  return (
    <AppScreen num={4} title={steps[step].title} subtitle={steps[step].sub}>
      <AppButton
        title="BACK"
        variant="ghost"
        icon={ChevronLeft}
        onPress={() => {
          dispatch({type: 'setCalibration', step: 1});
          dispatch({type: 'screen', screen: 'home'});
        }}
      />

      <AppCard glow accent={C.cyan} style={styles.card}>
        <View style={styles.orbOuter}>
          <LinearGradient
            colors={['rgba(0,229,255,0.25)', 'rgba(139,92,246,0.25)']}
            style={styles.orbInner}>
            <Target size={48} color={C.cyan} />
          </LinearGradient>
        </View>
        <Text style={styles.stepLabel}>Step {step} of 3</Text>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={gradients.primary}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.progressFill, {width: `${progressPct}%`}]}
          />
        </View>
      </AppCard>

      <AppButton title={buttonLabel} onPress={handleNext} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {alignItems: 'center', paddingVertical: 40},
  orbOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: C.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.cyan,
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  orbInner: {
    width: 115,
    height: 115,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {color: C.muted, fontSize: 13, fontWeight: '700', marginTop: 22, letterSpacing: 1},
  progressTrack: {
    width: '80%',
    height: 8,
    backgroundColor: C.surface2,
    borderRadius: 4,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', borderRadius: 4},
});