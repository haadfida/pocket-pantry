// External libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Button } from 'react-native-paper';

// Internal modules
import CollapsibleFlatList from '../components/CollapsibleFlatList';
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from '../components/LargeTopAppBar';
import { CookNowStackParamList } from '../navigation/CookNowStack';
import { spacing } from '../theme';
import { useThemeMode } from '../theme/ThemeContext';
import { t } from '../i18n';
import { getCookableRecipes } from '../data/recipes';
import { Recipe } from '../models';
import { UI, COLORS } from '../constants';

type Props = NativeStackScreenProps<CookNowStackParamList, 'CookNow'>;

export default function CookNowScreen({ navigation }: Props) {
  const { paperTheme } = useThemeMode();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getCookableRecipes().then(setRecipes).catch(console.error);
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getCookableRecipes().then(setRecipes).catch(console.error);
    setRefreshing(false);
  };

  if (recipes.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
        <LargeTopAppBar title={t('cook')} />
        <View style={[styles.container, styles.empty, { paddingTop: LARGE_TOP_APP_BAR_HEIGHT }]}> 
          <Text style={styles.emptyText}>{t('noData')}</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={{ flex: 1, alignItems: 'center', marginVertical: spacing.l }}>
      <Card
        mode="elevated"
        style={[
          styles.card,
          {
            backgroundColor: paperTheme.colors.surfaceVariant,
            borderRadius: UI.borderRadius.xlarge + 8,
            shadowColor: paperTheme.colors.primary,
            shadowOpacity: 0.13,
            shadowRadius: 14,
            elevation: 5,
            width: '98%',
            maxWidth: 340,
            minWidth: 170,
          },
        ]}
        onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      >
        <ImageBackground
          source={item.image_uri ? { uri: item.image_uri } : require('../../assets/icon.png')}
          style={{ height: 200, justifyContent: 'flex-end', borderTopLeftRadius: UI.borderRadius.xlarge + 8, borderTopRightRadius: UI.borderRadius.xlarge + 8, overflow: 'hidden' }}
          imageStyle={{ borderTopLeftRadius: UI.borderRadius.xlarge + 8, borderTopRightRadius: UI.borderRadius.xlarge + 8 }}
        >
          <View style={{ flex: 1 }} />
        </ImageBackground>
        <View style={{
          backgroundColor: paperTheme.colors.surface + 'ee',
          paddingHorizontal: UI.component.chipPadding,
          paddingVertical: UI.component.chipPadding,
          borderBottomLeftRadius: UI.borderRadius.xlarge + 8,
          borderBottomRightRadius: UI.borderRadius.xlarge + 8,
          alignItems: 'center',
        }}>
          <Text style={{ color: paperTheme.colors.primary, fontSize: UI.text.xlarge + 2, fontWeight: '800', marginBottom: spacing.s, textAlign: 'center' }} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Button
            mode="contained"
            style={{ borderRadius: UI.borderRadius.xlarge + 2, backgroundColor: paperTheme.colors.primary, minWidth: 110, paddingVertical: spacing.s }}
            labelStyle={{ color: paperTheme.colors.onPrimary, fontWeight: '700', fontSize: UI.text.xlarge, letterSpacing: 0.2 }}
            onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
          >
            Cook
          </Button>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
      <LargeTopAppBar title={t('cook')} />
      <CollapsibleFlatList
        title={t('cook')}
        data={recipes}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-evenly', paddingHorizontal: spacing.l, alignItems: 'flex-start' }}
        contentContainerStyle={{ paddingTop: spacing.l, paddingBottom: spacing.l * 2 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.s },
  card: { width: '48%', marginVertical: spacing.l },
  thumbnail: {
    width: UI.image.thumbnail,
    height: UI.image.thumbnail,
    borderRadius: UI.borderRadius.small,
    marginRight: spacing.s,
    backgroundColor: COLORS.placeholder,
  },
  title: { fontSize: UI.text.xlarge, flexShrink: 1, fontWeight: '500' },
  empty: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  emptyText: { color: COLORS.textSecondary },
  cardTitle: { color: COLORS.white, fontSize: UI.text.small + 2, fontWeight: '600' },
}); 