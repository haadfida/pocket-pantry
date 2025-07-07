// External libraries
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Internal modules
import RecipesStack from './RecipesStack';
import GroceryStack from './GroceryStack';
import CookNowStack from './CookNowStack';
import StatsStack from './StatsStack';
import PantryScreen from '../screens/PantryScreen';
import SettingsStack from './SettingsStack';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator();

export default function RootNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          if (route.name === 'Recipes') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Groceries') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Cook') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Pantry') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Recipes" component={RecipesStack} />
      <Tab.Screen name="Groceries" component={GroceryStack} />
      <Tab.Screen name="Cook" component={CookNowStack} />
      <Tab.Screen name="Stats" component={StatsStack} />
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
} 