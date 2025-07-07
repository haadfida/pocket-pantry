import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CookNowScreen from '../screens/CookNowScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

export type CookNowStackParamList = {
  CookNow: undefined;
  RecipeDetail: { id: number };
};

const Stack = createNativeStackNavigator<CookNowStackParamList>();

export default function CookNowStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CookNow" component={CookNowScreen} options={{ title: 'Cook Now' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe' }} />
    </Stack.Navigator>
  );
} 