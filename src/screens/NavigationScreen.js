import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {ChevronLeft} from 'lucide-react-native';
import AppButton from '../components/AppButton';
import {useApp} from '../context/AppContext';
import {useTheme} from '../theme/useTheme';
import {radius} from '../theme/colours';
import {say, stop as stopSpeech} from '../utils/speech';
import {tap, warning as warnHaptic} from '../utils/haptics';

// ---- Web Audio stereo tone ----
let audioCtxRef = null;
function playStereoTone(direction, urgency) {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtxRef) {
      audioCtxRef = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    const pan = direction === 'LEFT' ? -0.9 : direction === 'RIGHT' ? 0.9 : 0;
    const freq = urgency === 'red' ? 900 : urgency === 'amber' ? 660 : 440;
    osc.frequency.value = freq;
    osc.type = 'sine';
    panner.pan.value = pan;
    gain.gain.value = 0.12;
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

export default function NavigationScreen() {
  const {state, dispatch} = useApp();
  const {theme} = useTheme();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [detections, setDetections] = useState([]);
  const [modelReady, setModelReady] = useState(false);
  const [fps, setFps] = useState(0);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const processingRef = useRef(false);
  const lastSpeakRef = useRef(0);
  const lastToneRef = useRef(0);
  const lastHapticRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsTimerRef = useRef(Date.now());

  // Pulsing reticle
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.12, duration: 1400, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1, duration: 1400, useNativeDriver: true}),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Load model
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await tf.ready();
        const model = await cocoSsd.load({base: 'lite_mobilenet_v2'});
        if (mounted) {
          modelRef.current = model;
          setModelReady(true);
          say('Scanner ready');
        }
      } catch (e) {
        console.log('Model error:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // GPS tracking
  useEffect(() => {
    let sub;
    (async () => {
      try {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        sub = await Location.watchPositionAsync(
          {accuracy: Location.Accuracy.High, distanceInterval: 5},
          (loc) => {
            dispatch({type: 'addRoutePoint', point: {latitude: loc.coords.latitude, longitude: loc.coords.longitude}});
          }
        );
      } catch (e) {}
    })();
    return () => sub?.remove();
  }, []);

  // Frame processing loop
  useEffect(() => {
    if (!modelReady || !permission?.granted || state.paused) return;

    const interval = setInterval(async () => {
      if (processingRef.current || !cameraRef.current) return;
      processingRef.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({base64: false, quality: 0.3, skipProcessing: true});
        if (photo?.uri && modelRef.current) {
          const response = await fetch(photo.uri);
          const blob = await response.blob();
          const bitmap = await createImageBitmap(blob);
          const canvas = document.createElement('canvas');
          canvas.width = 300;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(bitmap, 0, 0, 300, 300);
          const predictions = await modelRef.current.detect(canvas);

          const now = Date.now();
          frameCountRef.current++;
          if (now - fpsTimerRef.current > 1000) {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
            fpsTimerRef.current = now;
          }

          const mapped = predictions.slice(0, 4).map((p, i) => {
            const [x, y, width, height] = p.bbox;
            const centerX = (x + width / 2) / 300;
            const direction = centerX < 0.34 ? 'LEFT' : centerX > 0.66 ? 'RIGHT' : 'CENTER';
            const sizeRatio = (width * height) / (300 * 300);
            const distanceM = Math.max(0.5, Math.min(6, (1 / Math.sqrt(sizeRatio)) * 0.4)).toFixed(1);
            const urgency = parseFloat(distanceM) < 1 ? 'red' : parseFloat(distanceM) < 2.5 ? 'amber' : 'cyan';
            return {
              id: p.class + '-' + i + '-' + now,
              label: p.class.toUpperCase(),
              direction,
              distanceM,
              score: Math.round(p.score * 100),
              urgency,
              bbox: {x, y, width, height},
            };
          });

          setDetections(mapped);

          if (mapped.length > 0) {
            dispatch({type: 'obstacle'});

            // Stereo tone every 700ms
            if (now - lastToneRef.current > 700) {
              lastToneRef.current = now;
              playStereoTone(mapped[0].direction, mapped[0].urgency);
            }

            // Strong haptic for close obstacles every 1.5s
            if (mapped[0].urgency === 'red' && state.settings.haptics && now - lastHapticRef.current > 1500) {
              lastHapticRef.current = now;
              warnHaptic();
            }

            // Voice every 2.5s
            if (now - lastSpeakRef.current > 2500) {
              lastSpeakRef.current = now;
              say(mapped[0].label + ', ' + mapped[0].distanceM + ' metres, ' + mapped[0].direction.toLowerCase());
            }
          }
        }
      } catch (e) {}
      processingRef.current = false;
    }, 1400);

    return () => clearInterval(interval);
  }, [modelReady, permission, state.paused, state.settings.haptics]);

  if (!permission) return <View style={styles.screen} />;

  if (!permission.granted) {
    return (
      <View style={[styles.permissionScreen, {backgroundColor: theme.void}]}>
        <StatusBar style="light" />
        <Text style={[styles.permTitle, {color: theme.white}]}>Camera access needed</Text>
        <Text style={[styles.permSub, {color: theme.muted}]}>
          EchoPath uses the camera to detect real obstacles ahead.
        </Text>
        <AppButton title="ALLOW CAMERA" onPress={requestPermission} />
        <AppButton title="BACK" variant="ghost" icon={ChevronLeft} onPress={() => dispatch({type: 'screen', screen: 'home'})} />
      </View>
    );
  }

  const hasClose = detections.some(d => d.urgency === 'red');

  return (
    <View style={styles.wrap}>
      <StatusBar style="light" />
      <Camera.CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      {/* Danger overlay when obstacle is very close */}
      {hasClose && (
        <View style={[StyleSheet.absoluteFill, styles.dangerOverlay]} pointerEvents="none" />
      )}

      {/* Top status pill */}
      <View style={styles.topPill}>
        <View style={styles.topLeft}>
          <View style={[styles.liveDot, {backgroundColor: state.paused ? theme.warning : theme.danger}]} />
          <Text style={styles.topText}>{state.paused ? 'PAUSED' : 'SCANNING'}</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.fpsText}>{fps} FPS</Text>
          <Text style={styles.aiText}>{modelReady ? 'AI ACTIVE' : 'LOADING'}</Text>
        </View>
      </View>

      {/* Reticle with pulse */}
      <Animated.View
        pointerEvents="none"
        style={[styles.reticle, {transform: [{scale: pulseAnim}], borderColor: hasClose ? theme.danger : theme.primary}]}
      />

      {/* Bounding boxes */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {detections.map(d => {
          const colour = d.urgency === 'red' ? '#FF5252' : d.urgency === 'amber' ? '#FFB74D' : '#4DD0E1';
          return (
            <View
              key={d.id}
              style={[
                styles.bbox,
                {
                  left: ((d.bbox.x / 300) * 100) + '%',
                  top: ((d.bbox.y / 300) * 100) + '%',
                  width: ((d.bbox.width / 300) * 100) + '%',
                  height: ((d.bbox.height / 300) * 100) + '%',
                  borderColor: colour,
                  shadowColor: colour,
                },
              ]}>
              <View style={[styles.bboxLabel, {backgroundColor: colour}]}>
                <Text style={styles.bboxLabelText}>{d.label} · {d.distanceM}m</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Bottom info strip */}
      <View style={styles.bottomStrip}>
        <View style={styles.directionRow}>
          <View style={[styles.dirBox, detections[0]?.direction === 'LEFT' && styles.dirBoxActive]}>
            <Text style={styles.dirLabel}>LEFT</Text>
          </View>
          <View style={[styles.dirBox, detections[0]?.direction === 'CENTER' && styles.dirBoxActive]}>
            <Text style={styles.dirLabel}>CENTRE</Text>
          </View>
          <View style={[styles.dirBox, detections[0]?.direction === 'RIGHT' && styles.dirBoxActive]}>
            <Text style={styles.dirLabel}>RIGHT</Text>
          </View>
        </View>
        <Text style={styles.bottomSummary}>
          {detections.length === 0 && modelReady ? 'Clear path ahead' : detections.length === 0 ? 'Starting scanner...' : detections[0].label + ' · ' + detections[0].distanceM + 'm · ' + detections[0].direction.toLowerCase()}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <AppButton title={state.paused ? 'RESUME' : 'PAUSE'} variant="ghost" onPress={() => { tap(); dispatch({type: 'pause'}); }} />
        <AppButton title="END WALK" variant="danger" onPress={() => { stopSpeech(); tap(); dispatch({type: 'end'}); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#000'},
  wrap: {flex: 1, backgroundColor: '#000'},
  permissionScreen: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24},
  permTitle: {fontSize: 26, fontWeight: '800', marginBottom: 12, textAlign: 'center'},
  permSub: {fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20},
  dangerOverlay: {backgroundColor: 'rgba(255, 61, 61, 0.18)', borderWidth: 6, borderColor: 'rgba(255,61,61,0.7)'},
  topPill: {position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.65)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)'},
  topLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  topRight: {flexDirection: 'row', alignItems: 'center', gap: 12},
  liveDot: {width: 10, height: 10, borderRadius: 5},
  topText: {color: '#FFFFFF', fontWeight: '800', fontSize: 12, letterSpacing: 1.4},
  fpsText: {color: '#4DD0E1', fontWeight: '800', fontSize: 12, letterSpacing: 0.8},
  aiText: {color: '#81C784', fontWeight: '800', fontSize: 11, letterSpacing: 1},
  reticle: {position: 'absolute', top: '38%', alignSelf: 'center', width: 190, height: 190, borderRadius: 95, borderWidth: 2, borderStyle: 'dashed'},
  bbox: {position: 'absolute', borderWidth: 2.5, borderRadius: 12, shadowOpacity: 0.9, shadowRadius: 12},
  bboxLabel: {position: 'absolute', top: -26, left: -2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6},
  bboxLabelText: {color: '#000', fontWeight: '900', fontSize: 11, letterSpacing: 0.6},
  bottomStrip: {position: 'absolute', bottom: 130, left: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 16},
  directionRow: {flexDirection: 'row', gap: 8, marginBottom: 12},
  dirBox: {flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'},
  dirBoxActive: {backgroundColor: 'rgba(77, 208, 225, 0.25)', borderColor: '#4DD0E1'},
  dirLabel: {color: '#FFFFFF', fontWeight: '800', fontSize: 10, letterSpacing: 1.4},
  bottomSummary: {color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center', letterSpacing: 0.2},
  controls: {position: 'absolute', bottom: 20, left: 16, right: 16, flexDirection: 'row', gap: 10},
});
