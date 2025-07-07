// External libraries
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Internal modules
import { RecipesStackParamList } from '../navigation/RecipesStack';
import { addRecipe } from '../data/recipes';
import { t } from '../i18n';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

type Props = NativeStackScreenProps<RecipesStackParamList, 'AddRecipe'>;

interface FormValues {
  title: string;
  portions: string;
  notes: string;
}

export default function AddRecipeScreen({ navigation }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { title: '', portions: '1', notes: '' },
  });

  const onSubmit = async (data: FormValues) => {
    await addRecipe({
      title: data.title.trim(),
      portions: parseInt(data.portions, 10) || 1,
      notes: data.notes.trim() || null,
      image_uri: null,
    });
    navigation.goBack();
  };

  const titleValue = watch('title');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('title')}</Text>
      <Controller
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Text style={styles.label}>{t('serves')}</Text>
      <Controller
        control={control}
        name="portions"
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

      <Text style={styles.label}>{t('notes')}</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
          />
        )}
      />

      <Button title={t('save')} onPress={handleSubmit(onSubmit)} disabled={!titleValue.trim()} />
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
    fontWeight: '600',
  },
  input: {
    borderWidth: UI.component.imageBorderWidth,
    borderColor: COLORS.textSecondary,
    borderRadius: UI.borderRadius.xs,
    padding: spacing.s,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 