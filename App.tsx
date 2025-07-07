import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeMode } from './src/theme/ThemeContext';
import { View } from 'react-native';

import { setupDatabase } from './src/db';
import RootNavigation from './src/navigation/BottomTabs';

export default function App() {
  useEffect(() => {
    // Run DB migrations/initialisation at startup.
    setupDatabase().catch((err) => console.error('DB setup failed', err));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function InnerApp() {
  const { paperTheme } = useThemeMode();
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
          <RootNavigation />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}
