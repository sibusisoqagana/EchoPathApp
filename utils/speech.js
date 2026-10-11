import * as Speech from 'expo-speech';

export function say(text, rate = 0.95) {
  if (!text) return;
  Speech.stop();
  Speech.speak(text, {rate, pitch: 1.0});
}

export function stop() {
  Speech.stop();
}