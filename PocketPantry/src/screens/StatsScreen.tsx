// External libraries
import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { BarChart, PieChart } from 'react-native-chart-kit';

// Internal modules
import CollapsibleScrollView from '../components/CollapsibleScrollView';
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from '../components/LargeTopAppBar';
import { getPantry } from '../data/pantry';
import { t } from '../i18n';
import { spacing } from '../theme';
import { UI, COLORS } from '../constants';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [data, setData] = useState<{ labels: string[]; quantities: number[] }>({ labels: [], quantities: [] });

  useFocusEffect(
    React.useCallback(() => {
      getPantry().then((items) => {
        const labels = items.map((i) => i.name);
        const quantities = items.map((i) => i.quantity);
        setData({ labels, quantities });
      });
    }, []),
  );

  if (data.labels.length === 0) {
    return (
      <View style={{ flex:1 }}>
        <LargeTopAppBar title={t('stats')} />
        <View style={[styles.container, { paddingTop: LARGE_TOP_APP_BAR_HEIGHT }]}>
          <Text>{t('noData')}</Text>
        </View>
      </View>
    );
  }

  const pastelPalette = COLORS.pastelPalette;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.chart.background }}>
      <CollapsibleScrollView title={t('stats')} style={styles.container}>
        <View style={{ height: LARGE_TOP_APP_BAR_HEIGHT + 40, backgroundColor: COLORS.chart.cardBackground, marginBottom: spacing.s }} />
        <Text style={{ fontSize: UI.text.xlarge + 2, fontWeight: '700', marginBottom: spacing.s, marginLeft: spacing.xs, color: COLORS.chart.text }}>{t('pantryStockBar')}</Text>
        <Card style={styles.card}>
          <BarChart
            data={{ labels: data.labels, datasets: [{ data: data.quantities }] }}
            width={screenWidth - 48}
            height={200}
            fromZero
            chartConfig={{
              backgroundGradientFrom: COLORS.chart.cardBackground,
              backgroundGradientTo: COLORS.chart.cardBackground,
              color: (opacity = 1) => COLORS.pastelPalette[0],
              fillShadowGradient: COLORS.pastelPalette[0],
              fillShadowGradientOpacity: 0.7,
              decimalPlaces: 0,
              labelColor: () => COLORS.chart.text,
              propsForBackgroundLines: { stroke: COLORS.chart.border, strokeDasharray: '4' },
            }}
            yAxisLabel=""
            yAxisSuffix=""
            style={{ marginVertical: spacing.s, borderRadius: UI.borderRadius.xlarge, alignSelf: 'center', backgroundColor: 'transparent' }}
          />
        </Card>

        <Text style={{ fontSize: UI.text.xlarge + 2, fontWeight: '700', marginTop: spacing.l, marginBottom: spacing.s, marginLeft: spacing.xs, color: COLORS.chart.text }}>{t('pantryDistributionPie')}</Text>
        <Card style={styles.card}>
          <PieChart
            data={data.labels.map((label, idx) => ({
              name: label,
              population: data.quantities[idx],
              color: pastelPalette[idx % pastelPalette.length],
                          legendFontColor: COLORS.chart.text,
            legendFontSize: UI.text.large,
            }))}
            width={screenWidth - 48}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
            style={{ marginVertical: spacing.s, alignSelf: 'center', backgroundColor: 'transparent' }}
            chartConfig={{
              color: () => COLORS.textSecondary
            }}
            hasLegend={true}
          />
        </Card>
      </CollapsibleScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.m },
  card: {
    backgroundColor: COLORS.chart.cardBackground,
    borderRadius: UI.borderRadius.xlarge + 2,
    marginBottom: UI.borderRadius.xlarge + 2,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.xs,
    shadowColor: COLORS.pastelPalette[0],
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
}); 