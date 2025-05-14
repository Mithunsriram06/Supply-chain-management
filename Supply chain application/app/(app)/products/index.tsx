import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { useMockData } from '@/providers/MockDataProvider';
import { Search, Filter, Package, Grid2x2 as Grid, List, Import as SortAsc, Dessert as SortDesc } from 'lucide-react-native';

export default function ProductsScreen() {
  const { products, isLoading } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!isLoading) {
      let result = [...products];
      
      // Apply search filter
      if (searchQuery) {
        result = result.filter(
          product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        result = result.filter(product => product.category === selectedCategory);
      }
      
      // Apply sorting
      result.sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'price') {
          return sortOrder === 'asc' 
            ? a.price - b.price
            : b.price - a.price;
        } else { // quantity
          return sortOrder === 'asc' 
            ? a.quantity - b.quantity
            : b.quantity - a.quantity;
        }
      });
      
      setFilteredProducts(result);
    }
  }, [isLoading, products, searchQuery, selectedCategory, sortOrder, sortBy]);

  // Get unique categories
  const categories = products.reduce((acc: string[], product) => {
    if (!acc.includes(product.category)) {
      acc.push(product.category);
    }
    return acc;
  }, []);

  const renderListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Warehouse Products</Text>
      <Text style={styles.headerSubtitle}>
        {filteredProducts.length} products in inventory
      </Text>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text 
              style={[
                styles.categoryButtonText,
                !selectedCategory && styles.categoryButtonTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.optionsContainer}>
        <View style={styles.sortOptions}>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => {
              setSortBy('name');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            <Text 
              style={[
                styles.sortButtonText,
                sortBy === 'name' && styles.sortButtonTextActive
              ]}
            >
              Name
            </Text>
            {sortBy === 'name' && (
              sortOrder === 'asc' ? 
                <SortAsc size={16} color={COLORS.primary} /> : 
                <SortDesc size={16} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => {
              setSortBy('price');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            <Text 
              style={[
                styles.sortButtonText,
                sortBy === 'price' && styles.sortButtonTextActive
              ]}
            >
              Price
            </Text>
            {sortBy === 'price' && (
              sortOrder === 'asc' ? 
                <SortAsc size={16} color={COLORS.primary} /> : 
                <SortDesc size={16} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => {
              setSortBy('quantity');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            <Text 
              style={[
                styles.sortButtonText,
                sortBy === 'quantity' && styles.sortButtonTextActive
              ]}
            >
              Quantity
            </Text>
            {sortBy === 'quantity' && (
              sortOrder === 'asc' ? 
                <SortAsc size={16} color={COLORS.primary} /> : 
                <SortDesc size={16} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.viewOptions}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'grid' && styles.viewButtonActive
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Grid 
              size={18} 
              color={viewMode === 'grid' ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'list' && styles.viewButtonActive
            ]}
            onPress={() => setViewMode('list')}
          >
            <List 
              size={18} 
              color={viewMode === 'list' ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderGridItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => router.push(`/products/${item.id}`)}
    >
      <View style={styles.gridImageContainer}>
        <Image source={{ uri: item.image }} style={styles.gridImage} />
      </View>
      
      <View style={styles.gridContent}>
        <Text style={styles.gridItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gridItemCategory}>{item.category}</Text>
        
        <View style={styles.gridItemDetails}>
          <Text style={styles.gridItemPrice}>${item.price.toFixed(2)}</Text>
          <Text 
            style={[
              styles.gridItemStock,
              item.quantity <= item.lowStockThreshold ? styles.lowStockText : null
            ]}
          >
            {item.quantity <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}: {item.quantity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => router.push(`/products/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      
      <View style={styles.listItemContent}>
        <Text style={styles.listItemName}>{item.name}</Text>
        <Text style={styles.listItemCategory}>{item.category}</Text>
        
        <View style={styles.listItemDetails}>
          <Text style={styles.listItemPrice}>${item.price.toFixed(2)}</Text>
          <Text 
            style={[
              styles.listItemStock,
              item.quantity <= item.lowStockThreshold ? styles.lowStockText : null
            ]}
          >
            {item.quantity <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}: {item.quantity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderListHeader}
        data={filteredProducts}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when switching view modes
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Additional imports needed
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.l,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginBottom: SPACING.l,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.l,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SPACING.s,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    paddingVertical: SPACING.m,
  },
  filtersContainer: {
    marginBottom: SPACING.l,
  },
  categoriesScrollContainer: {
    paddingRight: SPACING.l,
  },
  categoryButton: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.s,
    ...SHADOWS.small,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.text,
  },
  categoryButtonTextActive: {
    color: COLORS.surface,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  sortButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  sortButtonTextActive: {
    color: COLORS.primary,
  },
  viewOptions: {
    flexDirection: 'row',
  },
  viewButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    marginLeft: SPACING.xs,
    ...SHADOWS.small,
  },
  viewButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  gridItem: {
    flex: 1,
    margin: SPACING.s,
    marginTop: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  gridImageContainer: {
    width: '100%',
    height: 120,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridContent: {
    padding: SPACING.m,
  },
  gridItemName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  gridItemCategory: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  gridItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItemPrice: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
  },
  gridItemStock: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
  },
  listItem: {
    flexDirection: 'row',
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  listItemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  listItemContent: {
    flex: 1,
    padding: SPACING.m,
  },
  listItemName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  listItemCategory: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  listItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemPrice: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
  },
  listItemStock: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
  },
  lowStockText: {
    color: COLORS.error,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
});