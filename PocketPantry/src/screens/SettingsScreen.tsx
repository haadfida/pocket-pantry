// External libraries

// Internal modules
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from '../components/LargeTopAppBar';
import { db } from '../db';
import { t } from '../i18n';
import { spacing } from '../theme';
import { useThemeMode } from '../theme/ThemeContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { View, Button, StyleSheet, Alert, DevSettings, Platform } from 'react-native';
import { List, Switch } from 'react-native-paper';

export default function SettingsScreen() {
  const { mode, setMode } = useThemeMode();

  const exportDb = async () => {
    try {
      const dbPath = `${FileSystem.documentDirectory}SQLite/pocket_pantry.db`;
      const exists = await FileSystem.getInfoAsync(dbPath);
      if (!exists.exists) {
        Alert.alert('Database not found');
        return;
      }
      await Sharing.shareAsync(dbPath);
    } catch (e) {
      Alert.alert(t('error'), String(e));
    }
  };

  const importDb = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (!res.assets || res.assets.length === 0) return;
      const uri = res.assets[0].uri;
      const destPath = `${FileSystem.documentDirectory}SQLite/pocket_pantry.db`;

      try {
        db.closeSync();
      } catch {}

      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
        intermediates: true,
      });

      await FileSystem.copyAsync({ from: uri, to: destPath });

      Alert.alert(t('importComplete'), t('importCompleteMsg'), [
        {
          text: t('ok'),
          onPress: () => {
            if (Platform.OS !== 'web') {
              DevSettings.reload();
            }
          },
        },
      ]);
    } catch (e) {
      Alert.alert(t('error'), String(e));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LargeTopAppBar title={t('settings')} />
      <View style={[styles.container, { paddingTop: LARGE_TOP_APP_BAR_HEIGHT }]}>
        <List.Section>
          <List.Item
            title={t('darkMode')}
            right={() => (
              <Switch
                value={mode === 'dark'}
                onValueChange={(val) => setMode(val ? 'dark' : 'system')}
              />
            )}
          />
        </List.Section>

        <Button title={t('exportDb')} onPress={exportDb} />
        <View style={{ marginTop: spacing.s }}>
          <Button title={t('importDb')} onPress={importDb} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.m },
});
