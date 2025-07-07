// External libraries
// Internal modules
import CollapsibleFlatList from '../components/CollapsibleFlatList';
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from '../components/LargeTopAppBar';
import { UI, COLORS } from '../constants';
import { getAllRecipes, deleteRecipe, getIngredientsForRecipe } from '../data/recipes';
import { t } from '../i18n';
import { Recipe } from '../models';
import { RecipesStackParamList } from '../navigation/RecipesStack';
import { spacing } from '../theme';
import { useThemeMode } from '../theme/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { FAB, Searchbar, Chip, Card } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';

type Props = NativeStackScreenProps<RecipesStackParamList, 'Recipes'>;

export default function RecipesScreen({ navigation }: Props) {
  const { paperTheme } = useThemeMode();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [ingredientsMap, setIngredientsMap] = useState<Record<number, string[]>>({});

  useFocusEffect(
    React.useCallback(() => {
      getAllRecipes().then(setRecipes).catch(console.error);
    }, []),
  );

  useEffect(() => {
    const loadIngredients = async () => {
      const map: Record<number, string[]> = {};
      await Promise.all(
        recipes.map(async (r) => {
          const ings = await getIngredientsForRecipe(r.id);
          map[r.id] = ings.map((i) => i.name);
        }),
      );
      setIngredientsMap(map);
    };
    if (recipes.length > 0) {
      loadIngredients().catch(console.error);
    }
  }, [recipes]);

  const categories = useMemo(() => {
    return ['All'];
  }, [recipes]);

  const listHeader = (
    <View style={{ marginBottom: spacing.l, marginTop: spacing.s }}>
      <Searchbar
        placeholder={t('recipes')}
        value={query}
        onChangeText={setQuery}
        style={{
          marginHorizontal: spacing.l,
          marginBottom: spacing.s,
          borderRadius: UI.borderRadius.large,
          backgroundColor: paperTheme.colors.surfaceVariant,
          elevation: 0,
        }}
        inputStyle={{ fontSize: UI.text.xlarge }}
        iconColor={paperTheme.colors.primary}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: spacing.l, marginBottom: spacing.s }}
      >
        {categories.map((cat) => (
          <Chip
            key={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              marginRight: spacing.s,
              backgroundColor:
                selectedCategory === cat
                  ? paperTheme.colors.chipSelected
                  : paperTheme.colors.surfaceVariant,
              borderRadius: UI.borderRadius.xlarge,
              height: UI.height.chip,
              elevation: 0,
            }}
            textStyle={{
              color:
                selectedCategory === cat ? paperTheme.colors.onPrimary : paperTheme.colors.primary,
              fontWeight: '600',
            }}
            showSelectedOverlay={false}
          >
            {cat}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All';
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }: { item: Recipe }) => (
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
        <TouchableOpacity
          style={[styles.itemRow, { paddingVertical: spacing.l, paddingHorizontal: spacing.m }]}
          onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
        >
          <Image
            source={item.image_uri ? { uri: item.image_uri } : require('../../assets/icon.png')}
            style={{
              width: UI.image.thumbnail,
              height: UI.image.thumbnail,
              borderRadius: UI.borderRadius.medium,
              marginRight: UI.component.imageMargin,
              backgroundColor: paperTheme.colors.surfaceVariant,
              borderWidth: UI.component.imageBorderWidth,
              borderColor: paperTheme.colors.outline,
            }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: UI.text.xxlarge,
                fontWeight: '600',
                color: paperTheme.colors.onSurface,
                marginBottom: 2,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: UI.text.medium,
                color: paperTheme.colors.onSurfaceVariant,
                marginBottom: 4,
              }}
            >
              {t('serves')} {item.portions}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 2 }}>
              {(ingredientsMap[item.id] ?? []).slice(0, 3).map((name) => (
                <Chip
                  key={name}
                  style={{
                    marginRight: UI.component.chipMargin,
                    height: UI.height.chip,
                    backgroundColor:
                      selectedCategory === 'All'
                        ? paperTheme.colors.surfaceVariant
                        : paperTheme.colors.chipSelected,
                    borderRadius: UI.borderRadius.xlarge,
                    elevation: 0,
                    minWidth: 0,
                    paddingHorizontal: UI.component.chipPadding,
                    justifyContent: 'center',
                  }}
                  textStyle={{
                    color:
                      selectedCategory === 'All'
                        ? paperTheme.colors.onSurface
                        : paperTheme.colors.onPrimary,
                    fontWeight: '700',
                    fontSize: UI.text.large,
                  }}
                >
                  {name}
                </Chip>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );

  const renderHiddenItem = ({ item }: { item: Recipe }) => (
    <View style={styles.rowBack}>
      <View style={styles.deleteArea}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(t('delete'), t('deleteRecipeConfirm'), [
              { text: t('cancel'), style: 'cancel' },
              {
                text: t('delete'),
                style: 'destructive',
                onPress: async () => {
                  await deleteRecipe(item.id);
                  const updated = await getAllRecipes();
                  setRecipes(updated);
                },
              },
            ]);
          }}
        >
          <AntDesign name="delete" size={UI.icon.medium} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (recipes.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <CollapsibleFlatList
          title={t('recipes')}
          data={[]}
          keyExtractor={() => 'empty'}
          renderItem={() => null}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <View style={[styles.container, styles.empty]}>
              <Text style={styles.emptyText}>{t('noRecipesYet')}</Text>
            </View>
          }
          contentContainerStyle={{
            paddingTop: LARGE_TOP_APP_BAR_HEIGHT,
            paddingBottom: spacing.l,
            flex: 1,
          }}
        />
        <FAB
          icon="plus"
          style={[
            styles.fab,
            {
              backgroundColor: paperTheme.colors.primary,
              shadowColor: paperTheme.colors.primary,
              ...UI.shadow.medium,
              margin: spacing.l,
            },
          ]}
          color={paperTheme.colors.onPrimary}
          onPress={() => navigation.navigate('AddRecipe')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <LargeTopAppBar title={t('recipes')} />
      <View style={{ flex: 1, paddingTop: LARGE_TOP_APP_BAR_HEIGHT }}>
        {listHeader}
        <SwipeListView
          data={filteredRecipes}
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
      <FAB
        icon="plus"
        style={[
          styles.fab,
          {
            backgroundColor: paperTheme.colors.primary,
            shadowColor: paperTheme.colors.primary,
            ...UI.shadow.medium,
            margin: spacing.l,
          },
        ]}
        color={paperTheme.colors.onPrimary}
        onPress={() => navigation.navigate('AddRecipe')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.s },
  card: {
    width: '100%',
    borderRadius: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  thumbnail: {
    width: UI.image.thumbnail,
    height: UI.image.thumbnail,
    borderRadius: UI.borderRadius.small,
    marginRight: spacing.s,
    backgroundColor: COLORS.placeholder,
  },
  title: { fontSize: UI.text.xlarge, flexShrink: 1, fontWeight: '500' },
  subtitle: { fontSize: UI.text.small, color: COLORS.textSecondary },
  chip: { height: UI.height.chip },
  deleteButton: {
    backgroundColor: COLORS.delete,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    marginVertical: spacing.xs,
    borderTopRightRadius: UI.borderRadius.medium,
    borderBottomRightRadius: UI.borderRadius.medium,
  },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: COLORS.textSecondary },
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    borderRadius: UI.borderRadius.xlarge,
    overflow: 'hidden',
  },
  deleteArea: {
    width: 75,
    height: '100%',
    backgroundColor: COLORS.delete,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: UI.borderRadius.xlarge,
    borderBottomRightRadius: UI.borderRadius.xlarge,
  },
});
