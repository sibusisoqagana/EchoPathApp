// Warm, human palette inspired by morning light and earth tones
export const darkPalette = {
  void: '#1A1614',
  surface: '#252019',
  surface2: '#2F2820',
  border: '#3A322A',
  white: '#F5F0E8',
  muted: '#A89B8A',
  primary: '#FF8A65',
  secondary: '#81C784',
  success: '#81C784',
  warning: '#FFB74D',
  danger: '#E57373',
  cyan: '#4DD0E1',
  violet: '#BA68C8',
  magenta: '#F06292',
  lime: '#81C784',
  amber: '#FFB74D',
  rose: '#E57373',
};

export const lightPalette = {
  void: '#FAF6F0',
  surface: '#FFFFFF',
  surface2: '#F5EFE6',
  border: '#DDD3C2',
  white: '#2D2620',
  muted: '#6B5F50',
  primary: '#FF7A5C',
  secondary: '#66BB6A',
  success: '#66BB6A',
  warning: '#FFA726',
  danger: '#E57373',
  cyan: '#26C6DA',
  violet: '#AB47BC',
  magenta: '#EC407A',
  lime: '#66BB6A',
  amber: '#FFA726',
  rose: '#E57373',
};

export const gradients = {
  primary: ['#FF8A65', '#FFB74D'],
  success: ['#81C784', '#4DB6AC'],
  danger: ['#E57373', '#F06292'],
};

export const getGradients = (mode) => mode === 'light' ? {
  primary: ['#FF7A5C', '#FFA726'],
  success: ['#66BB6A', '#26C6DA'],
  danger: ['#E57373', '#EC407A'],
} : gradients;

export const spacing = {xs: 6, sm: 12, md: 18, lg: 24, xl: 32};
export const radius = {sm: 12, md: 20, lg: 28, xl: 36, pill: 999};

export const C = darkPalette;


