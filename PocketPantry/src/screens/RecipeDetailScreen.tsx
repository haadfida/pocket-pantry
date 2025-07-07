// External libraries
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Internal modules
import { RecipesStackParamList } from '../navigation/RecipesStack';
import { getRecipeById, getIngredientsForRecipe, canCook, cookRecipe } from '../data/recipes';
import { getPantry } from '../data/pantry';
import { Recipe, RecipeIngredient } from '../models';
import { t } from '../i18n';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [cookable, setCookable] = useState(false);
  const [pantryMap, setPantryMap] = useState<Record<number, number>>({});

  const load = () => {
    getRecipeById(id).then(setRecipe).catch(console.error);
    getIngredientsForRecipe(id).then(setIngredients).catch(console.error);
    canCook(id).then(setCookable).catch(console.error);
    getPantry().then((items) => {
      const map: Record<number, number> = {};
      items.forEach((it) => (map[it.ingredient_id] = it.quantity));
      setPantryMap(map);
    }).catch(console.error);
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [id]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddIngredient', { recipeId: id })} style={{ marginRight: spacing.s }}>
          <AntDesign name="plus" size={UI.icon.small + 6} color={COLORS.blue} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, id]);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Image
        source={
          recipe.image_uri
            ? { uri: recipe.image_uri }
            : require('../../assets/icon.png')
        }
        style={styles.hero}
        resizeMode="cover"
      />

      <View style={styles.container}>
        <Text style={styles.title}>{recipe.title}</Text>
        {recipe.notes ? <Text style={styles.notes}>{recipe.notes}</Text> : null}

        <Text style={styles.sectionHeader}>{t('ingredients')}</Text>
        {ingredients.length === 0 ? (
          <Text style={styles.emptyText}>{t('noIngredientsYet')}</Text>
        ) : (
          <View style={styles.card}>
            {ingredients.map((item) => (
              <View key={item.ingredient_id} style={styles.ingredientRow}>
                <Text style={styles.ingName}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.ingQty}>
                    {item.quantity} {item.unit ?? ''}
                  </Text>
                  {pantryMap[item.ingredient_id] && pantryMap[item.ingredient_id] >= item.quantity ? (
                    <Ionicons name="checkmark-circle" size={UI.icon.small + 2} color={COLORS.success} style={{ marginLeft: spacing.xs }} />
                  ) : (
                    <Ionicons name="alert-circle" size={UI.icon.small + 2} color={COLORS.warning} style={{ marginLeft: spacing.xs }} />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={[styles.cookBtn, !cookable && { opacity: 0.4 }]}
          disabled={!cookable}
          onPress={async () => {
            await cookRecipe(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            load();
          }}
        >
          <Text style={styles.cookBtnText}>{cookable ? t('cookNow') : t('missingIngredients')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
  },
  hero: { width: '100%', height: 220 },
  title: {
    fontSize: UI.text.xlarge + 8,
    fontWeight: '700',
    marginBottom: spacing.s,
  },
  notes: {
    marginBottom: spacing.m,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: UI.text.xlarge + 2,
    fontWeight: '600',
    marginTop: spacing.s,
    marginBottom: spacing.s,
  },
  emptyText: { color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: UI.borderRadius.medium,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
    shadowColor: COLORS.textSecondary,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  ingName: { fontSize: UI.text.xlarge },
  ingQty: { fontSize: UI.text.xlarge, fontWeight: '500' },
  cookBtn: {
    marginTop: spacing.l,
    backgroundColor: COLORS.blue,
    paddingVertical: spacing.s + 6,
    borderRadius: UI.borderRadius.small,
    alignItems: 'center',
  },
  cookBtnText: { color: COLORS.white, fontSize: UI.text.xlarge, fontWeight: '600' },
}); 