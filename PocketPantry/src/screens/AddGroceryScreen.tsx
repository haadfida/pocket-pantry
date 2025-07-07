// External libraries
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Internal modules
import { GroceryStackParamList } from '../navigation/GroceryStack';
import { addGroceryItem } from '../data/groceries';
import { t } from '../i18n';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

type Props = NativeStackScreenProps<GroceryStackParamList, 'AddGrocery'>;

interface FormValues {
  name: string;
  quantity: string;
  unit: string;
}

export default function AddGroceryScreen({ route, navigation }: Props) {
  const scannedCode = route.params?.code ?? '';
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { name: scannedCode, quantity: '', unit: '' },
  });

  const onSubmit = async (data: FormValues) => {
    await addGroceryItem(data.name.trim(), parseFloat(data.quantity) || 0, data.unit.trim() || null);
    navigation.goBack();
  };

  const nameVal = watch('name');
  const quantityVal = watch('quantity');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('ScanBarcode')} style={styles.scanBtn}>
        <Text style={{ color: COLORS.blue }}>{t('scanBarcode')}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{t('item')}</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />
      <Text style={styles.label}>{t('quantity')}</Text>
      <Controller
        control={control}
        name="quantity"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
      />
      <Text style={styles.label}>{t('unitOptional')}</Text>
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Button
        title={t('save')}
        onPress={handleSubmit(onSubmit)}
        disabled={!nameVal.trim() || !quantityVal.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
  },
  label: {
    marginTop: spacing.s,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: UI.component.imageBorderWidth,
    borderColor: COLORS.textSecondary,
    borderRadius: UI.borderRadius.xs,
    padding: spacing.s,
  },
  scanBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.s,
  },
}); 