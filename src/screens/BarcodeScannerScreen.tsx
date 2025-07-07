// External libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Internal modules
import { GroceryStackParamList } from '../navigation/GroceryStack';
import { t } from '../i18n';

type Props = NativeStackScreenProps<GroceryStackParamList, 'ScanBarcode'>;

export default function BarcodeScannerScreen({ navigation }: Props) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>{t('requestingCameraPermission')}</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>{t('noAccessToCamera')}</Text>
        <Button title={t('close')} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleBarCodeScanned = (result: any) => {
    if (scanned) return;
    const data = result?.data;
    setScanned(true);
    navigation.replace('AddGrocery', { code: data });
  };

  return (
    <CameraView style={StyleSheet.absoluteFillObject} onBarcodeScanned={handleBarCodeScanned} />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 