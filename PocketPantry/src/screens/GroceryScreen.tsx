// External libraries
// Internal modules
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from '../components/LargeTopAppBar';
import { UI, COLORS } from '../constants';
import { getGroceryList, toggleGroceryChecked, deleteGroceryItem } from '../data/groceries';
import { t } from '../i18n';
import { GroceryItem } from '../models';
import { GroceryStackParamList } from '../navigation/GroceryStack';
import { spacing } from '../theme';
import { useThemeMode } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { List, Checkbox, FAB, Card } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';

type Props = NativeStackScreenProps<GroceryStackParamList, 'Grocery'>;

export default function GroceryScreen({ navigation }: Props) {
  const { paperTheme } = useThemeMode();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [showInCart, setShowInCart] = useState(true);

  const load = () => getGroceryList().then(setItems).catch(console.error);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, []),
  );

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={[styles.rowFront, { backgroundColor: COLORS.purpleLight }]}>
      <Card
        mode="elevated"
        style={[
          styles.card,
          {
            width: '100%',
            backgroundColor: 'transparent',
            borderRadius: 0,
            margin: 0,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.l }}>
          <View style={{ marginRight: spacing.m }}>
            <Checkbox
              status={item.checked ? 'checked' : 'unchecked'}
              onPress={async () => {
                await toggleGroceryChecked(item.id, !item.checked);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                load();
              }}
              color={paperTheme.colors.primary}
              uncheckedColor={paperTheme.colors.outline}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: UI.text.xxlarge,
                color: item.checked ? paperTheme.colors.outline : paperTheme.colors.onSurface,
                fontWeight: '600',
              }}
            >
              {item.name}
            </Text>
            <View style={{ height: spacing.xs }} />
            <View
              style={{
                height: 2,
                backgroundColor: paperTheme.colors.primary + '22',
                borderRadius: 1,
                marginVertical: 2,
                width: '40%',
              }}
            />
            <Text
              style={{
                fontSize: UI.text.large,
                color: paperTheme.colors.onSurfaceVariant,
                fontWeight: '400',
                marginTop: 2,
              }}
            >
              {item.quantity} {item.unit ?? ''}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const renderHiddenItem = ({ item }: { item: GroceryItem }) => (
    <View style={[styles.rowBack, { backgroundColor: COLORS.delete }]}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={async () => {
          await deleteGroceryItem(item.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          load();
        }}
      >
        <Ionicons name="trash" size={UI.icon.medium} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <LargeTopAppBar title={t('groceries')} />
        <View style={[styles.container, styles.empty, { paddingTop: LARGE_TOP_APP_BAR_HEIGHT }]}>
          <LottieView
            source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_jxzswihb.json' }}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.emptyText}>{t('allSet')}</Text>
        </View>
      </View>
    );
  }

  const sections = [
    { title: t('toBuy'), data: items.filter((i) => !i.checked) },
    { title: t('inCart'), data: showInCart ? items.filter((i) => i.checked) : [] },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <LargeTopAppBar title={t('groceries')} />
      <View style={{ flex: 1, paddingTop: 8 }}>
        {sections.map((section, idx) =>
          section.data.length > 0 ? (
            <View key={section.title} style={{ marginBottom: spacing.l }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: spacing.m,
                  marginBottom: spacing.s,
                }}
              >
                <View
                  style={{
                    backgroundColor: paperTheme.colors.primary,
                    borderRadius: UI.borderRadius.xlarge + 2,
                    paddingHorizontal: UI.component.chipPadding,
                    paddingVertical: 7,
                    marginRight: spacing.s,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: paperTheme.colors.onPrimary,
                      fontWeight: '700',
                      fontSize: UI.text.large,
                    }}
                  >
                    {section.title}
                  </Text>
                  {section.title === t('inCart') && (
                    <TouchableOpacity
                      onPress={() => setShowInCart((prev) => !prev)}
                      style={{ marginLeft: spacing.xs }}
                    >
                      <Ionicons
                        name={showInCart ? 'chevron-up' : 'chevron-down'}
                        size={UI.icon.small + 2}
                        color={paperTheme.colors.onPrimary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <SwipeListView
                data={section.data}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingBottom: spacing.l }}
              />
            </View>
          ) : null,
        )}
      </View>
      <FAB
        icon="plus"
        style={[
          styles.fab,
          {
            backgroundColor: paperTheme.colors.primary,
            shadowColor: paperTheme.colors.primary,
            ...UI.shadow.heavy,
          },
        ]}
        color={paperTheme.colors.onPrimary}
        onPress={() => navigation.navigate('AddGrocery')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: COLORS.textSecondary, marginTop: spacing.m },
  card: {
    width: '100%',
    borderRadius: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  fab: {
    position: 'absolute',
    right: spacing.m,
    bottom: spacing.m,
  },
  rowFront: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    borderRadius: UI.borderRadius.xlarge,
    overflow: 'hidden',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: COLORS.delete,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    borderRadius: UI.borderRadius.xlarge,
    overflow: 'hidden',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: COLORS.delete,
    right: 0,
    borderTopRightRadius: UI.borderRadius.xlarge,
    borderBottomRightRadius: UI.borderRadius.xlarge,
  },
});
