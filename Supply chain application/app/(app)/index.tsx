import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/providers/MockDataProvider';
import { Package, TrendingUp, TrendingDown, CircleAlert as AlertCircle, Truck, Users, ShoppingCart } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { products, deliveryRequests, deliveryPersons, getLowStockProducts, isLoading } = useMockData();
  const [greeting, setGreeting] = useState('');
  const lowStockItems = getLowStockProducts();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const totalProducts = products.length;
  const totalProductsQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalPendingDeliveries = deliveryRequests.filter(
    (delivery) => delivery.status === 'pending' || delivery.status === 'assigned' || delivery.status === 'in-progress'
  ).length;
  const totalCompletedDeliveries = deliveryRequests.filter(
    (delivery) => delivery.status === 'delivered'
  ).length;
  const totalDeliveryPersons = deliveryPersons.length;

  const renderStatCard = (icon: React.ReactNode, title: string, value: number | string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        {icon}
      </View>
      <View style={styles.statContentContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );
  
  const renderCategoryItem = ({ item }: { item: { category: string; count: number; color: string } }) => (
    <View style={[styles.categoryItem, { backgroundColor: item.color + '20' }]}>
      <Text style={styles.categoryName}>{item.category}</Text>
      <Text style={[styles.categoryCount, { color: item.color }]}>{item.count}</Text>
    </View>
  );

  const renderLowStockItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.lowStockItem}
      onPress={() => router.push(`/products/${item.id}`)}
    >
      <View style={styles.lowStockImageContainer}>
        <Image source={{ uri: item.image }} style={styles.lowStockImage} />
      </View>
      <View style={styles.lowStockContent}>
        <Text style={styles.lowStockName}>{item.name}</Text>
        <Text style={styles.lowStockCategory}>{item.category}</Text>
        <View style={styles.lowStockInfo}>
          <Text style={styles.lowStockQuantity}>
            Qty: <Text style={{ color: COLORS.error }}>{item.quantity}</Text> / {item.lowStockThreshold}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Aggregate products by category
  const categories = products.reduce((acc, product) => {
    const existingCategory = acc.find((cat) => cat.category === product.category);
    if (existingCategory) {
      existingCategory.count += 1;
    } else {
      const colors = ['#3B82F6', '#F97316', '#10B981', '#6D28D9', '#EF4444', '#F59E0B'];
      acc.push({
        category: product.category,
        count: 1,
        color: colors[acc.length % colors.length]
      });
    }
    return acc;
  }, [] as { category: string; count: number; color: string }[]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.role}>{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {renderStatCard(
          <Package size={24} color={COLORS.primary} />,
          'Total Products',
          totalProducts,
          COLORS.primary
        )}
        
        {renderStatCard(
          <ShoppingCart size={24} color="#10B981" />,
          'Items in Stock',
          totalProductsQuantity,
          '#10B981'
        )}
        
        {renderStatCard(
          <Truck size={24} color="#F97316" />,
          'Pending Deliveries',
          totalPendingDeliveries,
          '#F97316'
        )}
        
        {renderStatCard(
          <Users size={24} color="#6D28D9" />,
          'Delivery Personnel',
          totalDeliveryPersons,
          '#6D28D9'
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Product Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.category}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Low Stock Items</Text>
          <Text style={styles.sectionCount}>{lowStockItems.length} items</Text>
        </View>
        
        {lowStockItems.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <TrendingUp size={32} color={COLORS.success} />
            <Text style={styles.emptyStateText}>All products are well-stocked!</Text>
          </View>
        ) : (
          <FlatList
            data={lowStockItems}
            renderItem={renderLowStockItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lowStockList}
          />
        )}
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/scanner')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <QrCode size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionTitle}>Scan Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/deliveries/request')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <Truck size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.quickActionTitle}>Request Delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/products')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' + '20' }]}>
              <Package size={24} color="#10B981" />
            </View>
            <Text style={styles.quickActionTitle}>View Products</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/deliveries')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#6D28D9' + '20' }]}>
              <TruckDelivery size={24} color="#6D28D9" />
            </View>
            <Text style={styles.quickActionTitle}>View Deliveries</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Additional imports for icons not declared at the top
import { Truck as TruckDelivery, QrCode } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  greeting: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.l,
    color: COLORS.textSecondary,
  },
  userName: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  role: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginRight: SPACING.m,
  },
  statContentContainer: {
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  statTitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.l,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  sectionCount: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
  },
  categoryList: {
    paddingRight: SPACING.m,
  },
  categoryItem: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: 12,
    marginRight: SPACING.m,
    ...SHADOWS.small,
  },
  categoryName: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  categoryCount: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
  },
  lowStockList: {
    paddingRight: SPACING.m,
  },
  lowStockItem: {
    width: 200,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginRight: SPACING.m,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  lowStockImageContainer: {
    width: '100%',
    height: 100,
  },
  lowStockImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lowStockContent: {
    padding: SPACING.m,
  },
  lowStockName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
  },
  lowStockCategory: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  lowStockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  lowStockQuantity: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.text,
  },
  emptyStateContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  emptyStateText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
  quickActionsContainer: {
    marginBottom: SPACING.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  quickActionTitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    textAlign: 'center',
  },
});