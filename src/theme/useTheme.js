import {useApp} from '../context/AppContext';
import {darkPalette, lightPalette} from './colours';

export function useTheme() {
  const {state} = useApp();
  const mode = state.settings?.darkMode === false ? 'light' : 'dark';
  return {
    mode,
    theme: mode === 'light' ? lightPalette : darkPalette,
    isDark: mode === 'dark',
  };
}
