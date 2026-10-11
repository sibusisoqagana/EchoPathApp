import React, {createContext, useContext, useEffect, useReducer} from 'react';
import * as storage from '../utils/storage';

const AppContext = createContext(null);

const initialState = {
  ready: false,
  screen: 'splash',
  user: null,
  paused: false,
  selectedSession: null,
  sessions: [],
  navStartTime: null,
  obstacleCount: 0,
  calibrationStep: 1,
  settings: {
    confidence: 0.48,
    cueInterval: 1.7,
    voiceRate: 0.92,
    haptics: true,
    voice: true,
    feedbackMode: 'speech',
    largeText: false,
    highContrast: true,
    screenReader: true,
    autoSpeak: true,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ready':
      return {...state, ready: true};
    case 'screen':
      return {...state, screen: action.screen};
    case 'login':
      return {...state, user: action.user, screen: 'home'};
    case 'logout':
      return {...state, user: null, screen: 'login', sessions: []};
    case 'set':
      return {...state, settings: {...state.settings, ...action.patch}};
    case 'setCalibration':
      return {...state, calibrationStep: action.step};
    case 'start':
      return {
        ...state,
        screen: 'navigation',
        paused: false,
        navStartTime: Date.now(),
        obstacleCount: 0,
      };
    case 'pause':
      return {...state, paused: !state.paused};
    case 'obstacle':
      return {...state, obstacleCount: (state.obstacleCount || 0) + 1};
    case 'end': {
      const started = state.navStartTime || Date.now();
      const durationMin = Math.max(1, Math.round((Date.now() - started) / 60000));
      const newSession = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-ZA', {day: 'numeric', month: 'short', year: 'numeric'}),
        time: new Date().toLocaleTimeString('en-ZA', {hour: '2-digit', minute: '2-digit'}),
        duration: durationMin,
        obstacles: state.obstacleCount || 0,
        note: '',
        rating: 0,
      };
      return {
        ...state,
        screen: 'home',
        paused: false,
        sessions: [newSession, ...state.sessions],
        navStartTime: null,
        obstacleCount: 0,
      };
    }
    case 'select':
      return {...state, selectedSession: action.session, screen: 'sessionDetail'};
    case 'deleteSession':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.id),
        selectedSession: null,
        screen: 'history',
      };
    case 'updateSession':
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.id ? {...s, ...action.patch} : s,
        ),
        selectedSession: null,
        screen: 'history',
      };
    case 'load':
      return {...state, ...action.payload, ready: true};
    default:
      return state;
  }
}

export function AppProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const saved = await storage.load();
      if (saved) {
        dispatch({
          type: 'load',
          payload: {
            ...saved,
            screen: 'login',
            paused: false,
            navStartTime: null,
            calibrationStep: 1,
          },
        });
      } else {
        dispatch({type: 'ready'});
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    storage.save({
      sessions: state.sessions,
      settings: state.settings,
      user: state.user,
    });
  }, [state.sessions, state.settings, state.user, state.ready]);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}