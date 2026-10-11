import * as Location from 'expo-location';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import * as Camera from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {ChevronLeft} from 'lucide-react-native';
import AppButton from '../components/AppButton';
import {C, radius} from '../theme/colours';
import {useApp} from '../context/AppContext';
import {say, stop as stopSpeech} from '../utils/speech';

export default function NavigationScreen() {
  const {state, dispatch} = useApp();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [detections, setDetections] = useState([]);
  const [modelReady, setModelReady] = useState(false);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const processingRef = useRef(false);
  const lastSpeakRef = useRef(0);

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
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!modelReady || !permission?.granted || state.paused) return;

    const interval = setInterval(async () => {
      if (processingRef.current || !cameraRef.current) return;
      processingRef.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: false,
          quality: 0.3,
          skipProcessing: true,
        });
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
          const mapped = predictions.slice(0, 3).map((p, i) => {
            const [x, y, width, height] = p.bbox;
            const centerX = (x + width / 2) / 300;
            const direction = centerX < 0.34 ? 'LEFT' : centerX > 0.66 ? 'RIGHT' : 'CENTER';
            const sizeRatio = (width * height) / (300 * 300);
            const distanceM = Math.max(0.5, Math.min(6, (1 / Math.sqrt(sizeRatio)) * 0.4)).toFixed(1);
            const urgency = distanceM < 1.5 ? 'red' : distanceM < 3 ? 'amber' : 'cyan';
            return {
              id: `${p.class}-${i}-${now}`,
              label: p.class.toUpperCase(),
              direction,
              distanceM,
              score: Math.round(p.score * 100),
              urgency,
            };
          });

          setDetections(mapped);

          if (mapped.length > 0) {
            dispatch({type: 'obstacle'});
            if (now - lastSpeakRef.current > 2500) {
              lastSpeakRef.current = now;
              say(`${mapped[0].label}, ${mapped[0].distanceM} metres, ${mapped[0].direction.toLowerCase()}`);
            }
          }
        }
      } catch (e) {
        // ignore frame errors
      }
      processingRef.current = false;
    }, 1500);

    return () => clearInterval(interval);
  }, [modelReady, permission, state.paused]);
  
    useEffect(() => {
    let sub;
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync(
        {accuracy: Location.Accuracy.High, distanceInterval: 5},
        (loc) => {
          dispatch({
            type: 'addRoutePoint',
            point: {latitude: loc.coords.latitude, longitude: loc.coords.longitude},
          });
        }
      );
    })();
    return () => sub?.remove();
  }, []);

  if (!permission) return <View style={styles.screen} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <StatusBar style="light" />
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permSub}>
          EchoPath uses the camera to detect real obstacles ahead.
        </Text>
        <AppButton title="ALLOW CAMERA" onPress={requestPermission} />
        <AppButton
          title="BACK"
          variant="ghost"
          icon={ChevronLeft}
          onPress={() => dispatch({type: 'screen', screen: 'home'})}
        />
      </View>
    );
  }

  return (
    <View style={styles.cameraWrap}>
      <StatusBar style="light" />
      <Camera.CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
      />

      <View style={styles.topPill}>
        <Text style={styles.pillText}>
          {state.paused ? '⏸ PAUSED' : '● LIVE SCANNING'}
        </Text>
        <Text style={[styles.pillText, {color: C.cyan}]}>
          {modelReady ? 'AI ACTIVE' : 'LOADING MODEL...'}
        </Text>
      </View>

      <View style={styles.reticle} />

      <View style={styles.dets}>
        {detections.length === 0 && modelReady ? (
          <View style={[styles.det, {borderColor: C.lime + '80'}]}>
            <Text style={styles.detName}>CLEAR PATH</Text>
            <Text style={[styles.detMeta, {color: C.lime}]}>No obstacles detected</Text>
          </View>
        ) : detections.length === 0 ? (
          <View style={[styles.det, {borderColor: C.amber + '80'}]}>
            <Text style={styles.detName}>LOADING</Text>
            <Text style={[styles.detMeta, {color: C.amber}]}>Analysing environment...</Text>
          </View>
        ) : (
          detections.map(x => {
            const colour = x.urgency === 'red' ? C.rose : x.urgency === 'amber' ? C.amber : C.cyan;
            return (
              <View key={x.id} style={[styles.det, {borderColor: colour + '80'}]}>
                <Text style={styles.detName}>{x.label}</Text>
                <Text style={[styles.detMeta, {color: colour}]}>
                  {x.direction} · {x.distanceM}M · {x.score}%
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.navControls}>
        <AppButton
          title={state.paused ? 'RESUME' : 'PAUSE'}
          variant="ghost"
          onPress={() => dispatch({type: 'pause'})}
        />
        <AppButton
          title="END SESSION"
          variant="danger"
          onPress={() => {
            stopSpeech();
            dispatch({type: 'end'});
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#000'},
  cameraWrap: {flex: 1, backgroundColor: '#000'},
  permissionScreen: {
    flex: 1,
    backgroundColor: C.void,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permTitle: {color: C.white, fontSize: 28, fontWeight: '900', marginBottom: 12, textAlign: 'center'},
  permSub: {color: C.muted, fontSize: 14, textAlign: 'center', marginBottom: 24},
  topPill: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(5,2,20,0.85)',
    borderWidth: 1,
    borderColor: C.border,
  },
  pillText: {color: C.white, fontWeight: '900', fontSize: 12, letterSpacing: 1.2},
  reticle: {
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: C.cyan,
    borderStyle: 'dashed',
    shadowColor: C.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 22,
  },
  dets: {position: 'absolute', bottom: 140, left: 20, right: 20},
  det: {
    backgroundColor: 'rgba(5,2,20,0.92)',
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 8,
  },
  detName: {color: C.white, fontWeight: '900', fontSize: 16, letterSpacing: 1.2},
  detMeta: {fontSize: 12, marginTop: 4, fontWeight: '800', letterSpacing: 1},
  navControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
});