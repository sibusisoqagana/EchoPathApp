import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ChevronLeft, Eye, Brain, Volume2, Lock} from 'lucide-react-native';
import AppScreen from '../components/AppScreen';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {C} from '../theme/colours';
import {useApp} from '../context/AppContext';

const STEPS = [
  {
    num: '01',
    title: 'SEE',
    body: 'The rear camera captures frames locally at a throttled interval while the user walks.',
    icon: Eye,
    colour: C.cyan,
  },
  {
    num: '02',
    title: 'UNDERSTAND',
    body: 'An on-device AI model identifies obstacles in each frame and ranks them by urgency.',
    icon: Brain,
    colour: C.violet,
  },
  {
    num: '03',
    title: 'GUIDE',
    body: 'Directional audio and haptics tell the user exactly where obstacles are — left, centre, or right.',
    icon: Volume2,
    colour: C.magenta,
  },
];

export default function AboutScreen() {
  const {dispatch} = useApp();

  return (
    <AppScreen num={10} title="Three layers. One local loop." subtitle="How EchoPath works.">
      <AppButton
        title="BACK"
        variant="ghost"
        icon={ChevronLeft}
        onPress={() => dispatch({type: 'screen', screen: 'home'})}
      />

      {STEPS.map(step => {
        const Icon = step.icon;
        return (
          <AppCard key={step.num} glow accent={step.colour}>
            <View style={styles.row}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: step.colour + '22',
                    borderColor: step.colour + '50',
                  },
                ]}>
                <Icon size={24} color={step.colour} />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.num, {color: step.colour}]}>{step.num}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </View>
          </AppCard>
        );
      })}

      <AppCard glow accent={C.lime}>
        <View style={styles.row}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: 'rgba(16,249,129,0.15)',
                borderColor: 'rgba(16,249,129,0.5)',
              },
            ]}>
            <Lock size={24} color={C.lime} />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.num, {color: C.lime}]}>PRIVACY</Text>
            <Text style={styles.stepTitle}>Nothing leaves your phone</Text>
            <Text style={styles.stepBody}>All inference runs on-device.</Text>
          </View>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 16, alignItems: 'flex-start'},
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 4},
  stepTitle: {color: C.white, fontSize: 17, fontWeight: '900', letterSpacing: 0.8, marginBottom: 6},
  stepBody: {color: C.muted, fontSize: 13, lineHeight: 19},
});