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
  currentRoute: [],
  xp: 0,
  level: 1,
  toasts: [],
  notifications: [],
  dailyChallenge: null,
  settings: {
    confidence: 0.48,
    voiceRate: 0.92,
    haptics: true,
    voice: true,
    feedbackMode: 'speech',
    largeText: false,
    highContrast: true,
    screenReader: true,
    autoSpeak: true,
    darkMode: true,
    notifications: true,
  },
};

const LEVEL_XP = 100;

function levelFromXp(xp) {
  return Math.max(1, Math.floor(xp / LEVEL_XP) + 1);
}

function reducer(state, action) {
  switch (action.type) {
    case 'ready': return {...state, ready: true};
    case 'screen': return {...state, screen: action.screen};
    case 'login': return {...state, user: action.user, screen: 'home'};
    case 'logout': return {...state, user: null, screen: 'login', sessions: [], xp: 0, level: 1};
    case 'set': return {...state, settings: {...state.settings, ...action.patch}};
    case 'setCalibration': return {...state, calibrationStep: action.step};
    case 'start': return {...state, screen: 'navigation', paused: false, navStartTime: Date.now(), obstacleCount: 0};
    case 'pause': return {...state, paused: !state.paused};
    case 'obstacle': return {...state, obstacleCount: (state.obstacleCount || 0) + 1};
    case 'addRoutePoint': return {...state, currentRoute: [...(state.currentRoute || []), action.point]};

    case 'toast': {
      const id = Date.now();
      return {...state, toasts: [...state.toasts, {id, ...action.toast}]};
    }
    case 'dismissToast': return {...state, toasts: state.toasts.filter(t => t.id !== action.id)};

    case 'notify': {
      const n = {id: Date.now(), time: new Date().toISOString(), read: false, ...action.notification};
      return {...state, notifications: [n, ...state.notifications].slice(0, 30)};
    }
    case 'markAllRead': return {...state, notifications: state.notifications.map(n => ({...n, read: true}))};
    case 'clearNotifications': return {...state, notifications: []};

    case 'setDailyChallenge': return {...state, dailyChallenge: action.challenge};
    case 'completeDailyChallenge': return {...state, dailyChallenge: {...state.dailyChallenge, completed: true}};

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
        route: state.currentRoute || [],
      };
      const earnedXp = 20 + (state.obstacleCount || 0) * 5 + durationMin * 2;
      const newXp = (state.xp || 0) + earnedXp;
      const newLevel = levelFromXp(newXp);
      const leveledUp = newLevel > (state.level || 1);
      const newSessions = [newSession, ...state.sessions];
      const notifications = [...state.notifications];
      notifications.unshift({id: Date.now() + 1, time: new Date().toISOString(), read: false, type: 'session', title: 'Walk complete', body: 'You avoided ' + newSession.obstacles + ' obstacles and earned ' + earnedXp + ' XP.'});
      if (leveledUp) {
        notifications.unshift({id: Date.now() + 2, time: new Date().toISOString(), read: false, type: 'level', title: 'Level up!', body: 'You reached level ' + newLevel + '. Keep going.'});
      }
      return {
        ...state,
        screen: 'celebration',
        paused: false,
        sessions: newSessions,
        navStartTime: null,
        obstacleCount: 0,
        currentRoute: [],
        xp: newXp,
        level: newLevel,
        notifications,
      };
    }
    case 'select': return {...state, selectedSession: action.session, screen: 'sessionDetail'};
    case 'deleteSession': return {...state, sessions: state.sessions.filter(s => s.id !== action.id), selectedSession: null, screen: 'history'};
    case 'updateSession': return {...state, sessions: state.sessions.map(s => s.id === action.id ? {...s, ...action.patch} : s), selectedSession: null, screen: 'history'};
    case 'load': return {...state, ...action.payload, ready: true};
    default: return state;
  }
}

export function AppProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const saved = await storage.load();
      if (saved) {
        dispatch({type: 'load', payload: {...saved, screen: 'login', paused: false, navStartTime: null, calibrationStep: 1, currentRoute: [], toasts: []}});
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
      xp: state.xp,
      level: state.level,
      notifications: state.notifications,
    });
  }, [state.sessions, state.settings, state.user, state.xp, state.level, state.notifications, state.ready]);

  return <AppContext.Provider value={{state, dispatch}}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}


