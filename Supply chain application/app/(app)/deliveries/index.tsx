import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { useMockData } from '@/providers/MockDataProvider';
import { useAuth } from '@/hooks/useAuth';
import { Truck as TruckDelivery, Package, Star, Clock, MapPin, CircleCheck as CheckCircle2, User, CirclePlus as PlusCircle } from 'lucide-react-native';

export default function DeliveriesScreen() {
  const { user } = useAuth();
  const { deliveryRequests, deliveryPersons, getProductsForDelivery, isLoading } = useMockData();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'delivered'>('all');
  
  const isCustomer = user?.role === 'customer';
  const isDeliverer = user?.role === 'deliverer';
  
  // Filter deliveries based on user role and active tab
  const filteredDeliveries = deliveryRequests.filter(delivery => {
    // Filter by user role
    if (isCustomer && delivery.customerId !== user?.id) {
      return false;
    }
    
    if (isDeliverer && delivery.deliveryPersonId !== user?.id) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'pending') {
      return delivery.status === 'pending';
    } else if (activeTab === 'in-progress') {
      return delivery.status === 'assigned' || delivery.status === 'in-progress';
    } else if (activeTab === 'delivered') {
      return delivery.status === 'delivered';
    }
    
    return true; // 'all' tab
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'assigned':
        return COLORS.secondary;
      case 'in-progress':
        return COLORS.primary;
      case 'delivered':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };
  
  const getDeliveryPersonName = (deliveryPersonId: string | null) => {
    if (!deliveryPersonId) return 'Not Assigned';
    const person = deliveryPersons.find(p => p.id === deliveryPersonId);
    return person ? person.name : 'Unknown';
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'assigned':
        return 'Assigned';
      case 'in-progress':
        return 'In Progress';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  const renderDeliveryItem = ({ item }: { item: any }) => {
    const statusColor = getStatusColor(item.status);
    const productDetails = getProductsForDelivery(item.productIds);
    const productImages = productDetails.slice(0, 3).map(p => p.image);
    
    return (
      <TouchableOpacity 
        style={styles.deliveryCard}
        onPress={() => router.push(`/deliveries/${item.id}`)}
      >
        <View style={styles.deliveryHeader}>
          <View style={styles.deliveryIdContainer}>
            <TruckDelivery size={16} color={COLORS.primary} />
            <Text style={styles.deliveryId}>Order #{item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        
        <View style={styles.deliveryInfoRow}>
          <Clock size={16} color={COLORS.textSecondary} />
          <Text style={styles.deliveryInfoText}>
            Requested: {item.requestDate}
          </Text>
        </View>
        
        <View style={styles.deliveryInfoRow}>
          <MapPin size={16} color={COLORS.textSecondary} />
          <Text style={styles.deliveryInfoText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        
        <View style={styles.deliveryInfoRow}>
          <User size={16} color={COLORS.textSecondary} />
          <Text style={styles.deliveryInfoText}>
            Customer: {item.customerName}
          </Text>
        </View>
        
        <View style={styles.deliveryInfoRow}>
          <Star size={16} color={COLORS.textSecondary} />
          <Text style={styles.deliveryInfoText}>
            Delivery Person: {getDeliveryPersonName(item.deliveryPersonId)}
          </Text>
        </View>
        
        <View style={styles.productPreviewContainer}>
          <Text style={styles.productPreviewTitle}>
            Products ({item.productIds.length})
          </Text>
          <View style={styles.productImagesContainer}>
            {productImages.map((image, index) => (
              <Image 
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
              />
            ))}
            {item.productIds.length > 3 && (
              <View style={styles.moreProductsContainer}>
                <Text style={styles.moreProductsText}>
                  +{item.productIds.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.deliveryFooter}>
          <Text style={styles.deliveryTotal}>
            Total: ${item.totalAmount.toFixed(2)}
          </Text>
          <View style={[
            styles.paymentStatusBadge, 
            { backgroundColor: item.paymentStatus === 'completed' ? COLORS.success + '20' : COLORS.warning + '20' }
          ]}>
            <Text style={[
              styles.paymentStatusText, 
              { color: item.paymentStatus === 'completed' ? COLORS.success : COLORS.warning }
            ]}>
              {item.paymentStatus === 'completed' ? 'Paid' : 'Pending Payment'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading deliveries...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deliveries</Text>
        <TouchableOpacity 
          style={styles.newDeliveryButton}
          onPress={() => router.push('/deliveries/request')}
        >
          <PlusCircle size={18} color={COLORS.surface} />
          <Text style={styles.newDeliveryButtonText}>New Request</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'in-progress' && styles.activeTab]}
          onPress={() => setActiveTab('in-progress')}
        >
          <Text style={[styles.tabText, activeTab === 'in-progress' && styles.activeTabText]}>
            In Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]}
          onPress={() => setActiveTab('delivered')}
        >
          <Text style={[styles.tabText, activeTab === 'delivered' && styles.activeTabText]}>
            Delivered
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredDeliveries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No deliveries found</Text>
          <TouchableOpacity
            style={styles.createDeliveryButton}
            onPress={() => router.push('/deliveries/request')}
          >
            <Text style={styles.createDeliveryButtonText}>Create Delivery Request</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredDeliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.l,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
  },
  newDeliveryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: 20,
  },
  newDeliveryButtonText: {
    fontFamily: FONTS.buttonMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.surface,
    marginLeft: SPACING.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.l,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.s,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: SPACING.l,
    paddingTop: 0,
  },
  deliveryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    ...SHADOWS.medium,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  deliveryIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryId: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.xs,
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  deliveryInfoText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.text,
    marginLeft: SPACING.s,
    flex: 1,
  },
  productPreviewContainer: {
    marginTop: SPACING.m,
    marginBottom: SPACING.m,
  },
  productPreviewTitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  productImagesContainer: {
    flexDirection: 'row',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: SPACING.s,
  },
  moreProductsContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight + '50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreProductsText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.primary,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.s,
    paddingTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deliveryTotal: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
  },
  paymentStatusBadge: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.l,
    color: COLORS.textSecondary,
    marginTop: SPACING.l,
    marginBottom: SPACING.l,
  },
  createDeliveryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
  },
  createDeliveryButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
  },
});