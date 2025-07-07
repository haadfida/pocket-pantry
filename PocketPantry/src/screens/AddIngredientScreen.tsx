// External libraries
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Internal modules
import { RecipesStackParamList } from '../navigation/RecipesStack';
import { addIngredientToRecipe } from '../data/recipes';
import { t } from '../i18n';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

type Props = NativeStackScreenProps<RecipesStackParamList, 'AddIngredient'>;

interface FormValues {
  name: string;
  quantity: string;
  unit: string;
}

export default function AddIngredientScreen({ route, navigation }: Props) {
  const { recipeId } = route.params;
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { name: '', quantity: '', unit: '' },
  });

  const onSubmit = async (data: FormValues) => {
    await addIngredientToRecipe(
      recipeId,
      data.name.trim(),
      parseFloat(data.quantity) || 0,
      data.unit.trim() || null,
    );
    navigation.goBack();
  };

  const nameVal = watch('name');
  const quantityVal = watch('quantity');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('item')}</Text>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Text style={styles.label}>{t('quantity')}</Text>
      <Controller
        name="quantity"
        control={control}
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
        name="unit"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Button title={t('save')} onPress={handleSubmit(onSubmit)} disabled={!nameVal.trim() || !quantityVal.trim()} />
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
}); 