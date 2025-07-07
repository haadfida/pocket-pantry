import { MD3LightTheme as PaperLight, MD3DarkTheme as PaperDark } from 'react-native-paper';

export const lightTheme = {
  ...PaperLight,
  colors: {
    ...PaperLight.colors,
    primary: '#b39ddb',
    secondary: '#ede7f6',
    surfaceVariant: '#ede7f6',
    outline: '#d1c4e9',
    onPrimary: '#fff',
    onSurface: '#222',
    onSurfaceVariant: '#6d5c7c',
    chipSelected: '#9575cd',
  },
};

export const darkTheme = {
  ...PaperDark,
  colors: {
    ...PaperDark.colors,
    primary: '#b39ddb',
    secondary: '#2a223a',
    surfaceVariant: '#2a223a',
    outline: '#6d5c7c',
    onPrimary: '#fff',
    onSurface: '#fff',
    onSurfaceVariant: '#b39ddb',
    chipSelected: '#9575cd',
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
}; 