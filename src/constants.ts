// UI Constants
export const UI = {
  // Border radius
  borderRadius: {
    xs: 4,
    small: 8,
    medium: 10,
    large: 14,
    xlarge: 16,
  },
  
  // Image sizes
  image: {
    thumbnail: 56,
    avatar: 40,
  },
  
  // Component heights
  height: {
    chip: 32,
    searchBar: 48,
  },
  
  // Shadow properties
  shadow: {
    light: {
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    heavy: {
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  // Icon sizes
  icon: {
    small: 16,
    medium: 24,
    large: 32,
  },
  
  // Text sizes
  text: {
    small: 12,
    medium: 13,
    large: 15,
    xlarge: 16,
    xxlarge: 17,
  },
  
  // Spacing for specific components
  component: {
    chipMargin: 6,
    chipPadding: 18,
    imageMargin: 14,
    imageBorderWidth: 1,
  },
} as const;

// Colors (for hardcoded colors that aren't in theme)
export const COLORS = {
  white: '#fff',
  delete: '#ff3b30',
  deleteSoft: '#FFB3B3',
  placeholder: '#eaeaea',
  textSecondary: '#666',
  blue: '#007aff',
  purpleLight: '#ede7f6',
  // Status colors
  success: '#4caf50',
  warning: '#ffb300',
  // Chart colors
  chart: {
    background: '#f7f6fb',
    cardBackground: '#ede7f6',
    text: '#5e548e',
    border: '#d1c4e9',
  },
  // Pastel palette for charts
  pastelPalette: [
    '#b39ddb',
    '#90caf9',
    '#a5d6a7',
    '#ffe082',
    '#ffab91',
    '#f48fb1',
    '#ce93d8',
    '#80cbc4',
    '#ffd54f',
    '#bcaaa4',
  ],
} as const; 