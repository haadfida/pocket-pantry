import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GroceryScreen from '../screens/GroceryScreen';
import AddGroceryScreen from '../screens/AddGroceryScreen';

export type GroceryStackParamList = {
  Grocery: undefined;
  AddGrocery: { code?: string } | undefined;
  ScanBarcode: undefined;
  EditGrocery: { itemId: number };
};

const Stack = createNativeStackNavigator<GroceryStackParamList>();

export default function GroceryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Grocery" component={GroceryScreen} options={{ title: 'Groceries' }} />
      <Stack.Screen
        name="AddGrocery"
        component={AddGroceryScreen}
        options={{ title: 'Add Item', presentation: 'modal' }}
      />
      <Stack.Screen name="ScanBarcode" component={require('../screens/BarcodeScannerScreen').default} options={{ title: 'Scan', presentation: 'modal' }} />
      <Stack.Screen
        name="EditGrocery"
        component={require('../screens/EditGroceryScreen').default}
        options={{ title: 'Edit Item', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
} 