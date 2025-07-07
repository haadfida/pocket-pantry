// External libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-paper';

// Internal modules
import CollapsibleFlatList from '../components/CollapsibleFlatList';
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from '../components/LargeTopAppBar';
import { getPantry } from '../data/pantry';
import { PantryItem } from '../models';
import { t } from '../i18n';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

export default function PantryScreen() {
  const [items, setItems] = useState<PantryItem[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      getPantry().then(setItems).catch(console.error);
    }, []),
  );

  if (items.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <LargeTopAppBar title={t('pantry')} />
        <SafeAreaView style={[styles.container, styles.empty, { paddingTop: LARGE_TOP_APP_BAR_HEIGHT }]}>
          <Text style={styles.emptyText}>{t('noStockYet')}</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <LargeTopAppBar title={t('pantry')} />
      <CollapsibleFlatList
        title={t('pantry')}
        data={items}
        keyExtractor={(i) => String(i.ingredient_id)}
        contentContainerStyle={{ paddingTop: spacing.s, paddingBottom: spacing.l }}
        renderItem={({ item }) => (
          <View style={[styles.rowFront, { backgroundColor: COLORS.purpleLight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.s + 6, paddingHorizontal: spacing.m }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.pastelPalette[0] + '33', alignItems: 'center', justifyContent: 'center', marginRight: spacing.m }}>
                <Text style={{ fontSize: UI.text.xlarge + 2, fontWeight: '700', color: COLORS.chart.text }}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={{ fontSize: UI.text.xxlarge, fontWeight: '600', color: COLORS.chart.text, flex: 1 }}>{item.name}</Text>
              <Text style={{ fontSize: UI.text.xlarge, fontWeight: '700', color: COLORS.chart.text, marginLeft: spacing.s }}>
                {item.quantity} {item.unit ?? ''}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.s,
    marginHorizontal: spacing.m,
    marginVertical: spacing.xs,
    backgroundColor: COLORS.white,
    borderRadius: UI.borderRadius.medium,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: { fontSize: UI.text.xlarge },
  qty: { fontSize: UI.text.xlarge, fontWeight: '500' },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: UI.text.xlarge,
    fontWeight: '500',
  },
  card: { marginHorizontal: spacing.m, marginVertical: spacing.xs },
  rowFront: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    borderRadius: UI.borderRadius.xlarge,
    overflow: 'hidden',
  },
}); 