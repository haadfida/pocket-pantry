import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipesScreen from '../screens/RecipesScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddIngredientScreen from '../screens/AddIngredientScreen';

export type RecipesStackParamList = {
  Recipes: undefined;
  AddRecipe: undefined;
  RecipeDetail: { id: number };
  AddIngredient: { recipeId: number };
};

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export default function RecipesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Recipes" component={RecipesScreen} options={{ title: 'Recipes' }} />
      <Stack.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{ title: 'Add Recipe', presentation: 'modal' }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe' }}
      />
      <Stack.Screen
        name="AddIngredient"
        component={AddIngredientScreen}
        options={{ title: 'Add Ingredient', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
} 