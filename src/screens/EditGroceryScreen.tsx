// External libraries
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Internal modules
import { t } from '../i18n';
import { GroceryStackParamList } from '../navigation/GroceryStack';
import { updateGroceryItem, deleteGroceryItem, getGroceryList } from '../data/groceries';
import { GroceryItem } from '../models';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

type Props = NativeStackScreenProps<GroceryStackParamList, 'EditGrocery'>;

interface FormValues {
  quantity: string;
  unit: string;
}

export default function EditGroceryScreen({ route, navigation }: Props) {
  const { itemId } = route.params;
  const item = React.useRef<GroceryItem | null>(null);

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { quantity: '', unit: '' },
  });

  React.useEffect(() => {
    getGroceryList().then((list) => {
      const it = list.find((i) => i.id === itemId);
      if (it) {
        item.current = it;
        setValue('quantity', String(it.quantity));
        setValue('unit', it.unit ?? '');
      }
    });
  }, [itemId]);

  const onSubmit = async (data: FormValues) => {
    await updateGroceryItem(itemId, parseFloat(data.quantity) || 0, data.unit.trim() || null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.current?.name ?? ''}</Text>

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

      <Text style={styles.label}>{t('unit')}</Text>
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Button title={t('save')} onPress={handleSubmit(onSubmit)} />
      <View style={{ marginTop: spacing.s }}>
        <Button
          title={t('delete')}
          color={COLORS.delete}
          onPress={async () => {
            await deleteGroceryItem(itemId);
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
  },
  title: {
    fontSize: UI.text.xlarge + 2,
    fontWeight: '600',
    marginBottom: spacing.s,
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
}); 