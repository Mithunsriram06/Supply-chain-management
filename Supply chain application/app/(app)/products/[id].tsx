import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { useMockData } from '@/providers/MockDataProvider';
import { ArrowLeft, Minus, Plus, CreditCard as Edit2, Save, X, Package, Calendar, Tag, ShoppingCart } from 'lucide-react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById, updateProduct, updateProductQuantity } = useMockData();
  
  const product = getProductById(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  
  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Not Found</Text>
        </View>
        <Text style={styles.notFoundText}>The product you're looking for doesn't exist.</Text>
      </View>
    );
  }

  const handleQuantityChange = async (change: number) => {
    if (product.quantity + change >= 0) {
      await updateProductQuantity(product.id, product.quantity + change);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedProduct(product);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (editedProduct) {
      await updateProduct(editedProduct);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [field]: value
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Product' : 'Product Details'}
        </Text>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
          {isEditing ? (
            <X size={22} color={COLORS.error} />
          ) : (
            <Edit2 size={22} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      {!isEditing ? (
        // View Mode
        <>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>${product.price.toFixed(2)}</Text>
            </View>
            
            <View style={styles.stockContainer}>
              <Text style={styles.stockLabel}>Current Stock:</Text>
              <View style={styles.stockControls}>
                <TouchableOpacity 
                  style={styles.stockButton}
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Minus size={18} color={COLORS.primary} />
                </TouchableOpacity>
                
                <Text style={styles.stockValue}>{product.quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.stockButton}
                  onPress={() => handleQuantityChange(1)}
                >
                  <Plus size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.bulkActionContainer}>
              <TouchableOpacity 
                style={styles.bulkActionButton}
                onPress={() => handleQuantityChange(-5)}
              >
                <Text style={styles.bulkActionText}>-5</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bulkActionButton}
                onPress={() => handleQuantityChange(-10)}
              >
                <Text style={styles.bulkActionText}>-10</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bulkActionButton}
                onPress={() => handleQuantityChange(5)}
              >
                <Text style={styles.bulkActionText}>+5</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bulkActionButton}
                onPress={() => handleQuantityChange(10)}
              >
                <Text style={styles.bulkActionText}>+10</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Package size={20} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Batch Number</Text>
                  <Text style={styles.detailValue}>{product.batchNumber}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Calendar size={20} color={COLORS.success} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Manufacturing Date</Text>
                  <Text style={styles.detailValue}>{product.manufacturingDate}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Calendar size={20} color={COLORS.error} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Expiry Date</Text>
                  <Text style={styles.detailValue}>{product.expiryDate}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Tag size={20} color={COLORS.warning} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Low Stock Threshold</Text>
                  <Text style={styles.detailValue}>{product.lowStockThreshold} units</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
            
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeLabel}>Product QR Code</Text>
              <Image source={{ uri: product.qrCode }} style={styles.qrCodeImage} />
              <Text style={styles.qrCodeHelp}>
                Scan this QR code to quickly access product details.
              </Text>
            </View>
          </View>
        </>
      ) : (
        // Edit Mode
        <>
          <View style={styles.editImageContainer}>
            <Image source={{ uri: editedProduct?.image }} style={styles.editProductImage} />
            <View style={styles.editImageOverlay}>
              <Text style={styles.editImageText}>Edit Image URL</Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.name || ''}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Product Name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.category || ''}
                onChangeText={(value) => handleInputChange('category', value)}
                placeholder="Category"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.price.toString() || ''}
                onChangeText={(value) => handleInputChange('price', parseFloat(value) || 0)}
                placeholder="Price"
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.quantity.toString() || ''}
                onChangeText={(value) => handleInputChange('quantity', parseInt(value) || 0)}
                placeholder="Quantity"
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Manufacturing Date</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.manufacturingDate || ''}
                onChangeText={(value) => handleInputChange('manufacturingDate', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.expiryDate || ''}
                onChangeText={(value) => handleInputChange('expiryDate', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Batch Number</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.batchNumber || ''}
                onChangeText={(value) => handleInputChange('batchNumber', value)}
                placeholder="Batch Number"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Low Stock Threshold</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.lowStockThreshold.toString() || ''}
                onChangeText={(value) => handleInputChange('lowStockThreshold', parseInt(value) || 0)}
                placeholder="Low Stock Threshold"
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                value={editedProduct?.image || ''}
                onChangeText={(value) => handleInputChange('image', value)}
                placeholder="Image URL"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProduct?.description || ''}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Product Description"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Save size={20} color={COLORS.surface} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.l,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  productInfo: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: SPACING.l,
    ...SHADOWS.medium,
  },
  productName: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  productCategory: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.primary,
    marginBottom: SPACING.l,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  priceLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginRight: SPACING.s,
  },
  priceValue: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  stockLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
  },
  stockControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockValue: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.l,
    color: COLORS.text,
    paddingHorizontal: SPACING.m,
    minWidth: 50,
    textAlign: 'center',
  },
  bulkActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  bulkActionButton: {
    flex: 1,
    backgroundColor: COLORS.primaryLight + '30',
    padding: SPACING.s,
    margin: SPACING.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  bulkActionText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.primary,
  },
  detailsContainer: {
    marginVertical: SPACING.l,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  detailLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
  },
  descriptionContainer: {
    marginBottom: SPACING.l,
  },
  descriptionLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  descriptionText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    lineHeight: 22,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: SPACING.l,
  },
  qrCodeLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: SPACING.m,
  },
  qrCodeHelp: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  notFoundText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.l,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  editImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  editProductImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: SPACING.m,
  },
  editImageText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.surface,
    textAlign: 'center',
  },
  formContainer: {
    padding: SPACING.l,
  },
  formGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.m,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: 8,
    marginTop: SPACING.l,
  },
  saveButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
    marginLeft: SPACING.s,
  },
});