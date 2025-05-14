import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { useMockData } from '@/providers/MockDataProvider';
import { QrCode, Camera, Circle as XCircle, TriangleAlert as AlertTriangle, Info } from 'lucide-react-native';

export default function QRScannerScreen() {
  const { products, getProductById } = useMockData();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Request camera permissions when scanner is activated
    if (scannerActive) {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [scannerActive]);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Extract product ID from QR code data 
    // Format: "product-<id>"
    const productIdMatch = data.match(/product-(\d+)/);
    
    if (productIdMatch && productIdMatch[1]) {
      const productId = productIdMatch[1];
      const product = getProductById(productId);
      
      if (product) {
        setScannedProduct(product);
        setError(null);
      } else {
        setError(`Product with ID ${productId} not found.`);
        setScannedProduct(null);
      }
    } else {
      setError('Invalid QR code format. Please scan a valid product QR code.');
      setScannedProduct(null);
    }
  };

  const handleStartScanning = () => {
    setScanned(false);
    setScannedProduct(null);
    setError(null);
    setScannerActive(true);
  };

  const handleCancelScanning = () => {
    setScannerActive(false);
    setScanned(false);
  };

  const renderScanner = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.centeredContainer}>
          <Info size={48} color={COLORS.primary} />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      );
    }
    
    if (hasPermission === false) {
      return (
        <View style={styles.centeredContainer}>
          <AlertTriangle size={48} color={COLORS.warning} />
          <Text style={styles.permissionText}>Camera permission not granted</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={handleStartScanning}
          >
            <Text style={styles.permissionButtonText}>Request Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
        
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerTargetCorner} />
          <View style={[styles.scannerTargetCorner, styles.topRight]} />
          <View style={[styles.scannerTargetCorner, styles.bottomLeft]} />
          <View style={[styles.scannerTargetCorner, styles.bottomRight]} />
        </View>
        
        <View style={styles.scannerControls}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelScanning}
          >
            <XCircle size={24} color={COLORS.surface} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {scanned && (
            <TouchableOpacity 
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainButtonText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderProductDetails = () => {
    if (!scannedProduct) return null;
    
    return (
      <View style={styles.productContainer}>
        <Image source={{ uri: scannedProduct.image }} style={styles.productImage} />
        
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{scannedProduct.name}</Text>
          <Text style={styles.productCategory}>{scannedProduct.category}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>${scannedProduct.price.toFixed(2)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>In Stock</Text>
              <Text style={styles.detailValue}>{scannedProduct.quantity}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Batch Number</Text>
              <Text style={styles.detailValue}>{scannedProduct.batchNumber}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Manufacturing Date</Text>
              <Text style={styles.detailValue}>{scannedProduct.manufacturingDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>{scannedProduct.expiryDate}</Text>
            </View>
          </View>
          
          <Text style={styles.productDescription}>{scannedProduct.description}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={() => {
            setScannedProduct(null);
            setScanned(false);
          }}
        >
          <Text style={styles.scanAgainButtonText}>Scan Another Product</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={() => {
            setError(null);
            setScanned(false);
          }}
        >
          <Text style={styles.scanAgainButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR Code Scanner</Text>
        <Text style={styles.headerSubtitle}>
          Scan product QR codes to view detailed information
        </Text>
      </View>

      {scannerActive ? (
        renderScanner()
      ) : scannedProduct ? (
        renderProductDetails()
      ) : error ? (
        renderError()
      ) : (
        <View style={styles.startScanContainer}>
          <View style={styles.qrIconContainer}>
            <QrCode size={100} color={COLORS.primary} />
          </View>
          <Text style={styles.startScanTitle}>Ready to Scan</Text>
          <Text style={styles.startScanDescription}>
            Position the QR code within the frame to scan and view product details.
          </Text>
          <TouchableOpacity 
            style={styles.startScanButton}
            onPress={handleStartScanning}
          >
            <Camera size={24} color={COLORS.surface} />
            <Text style={styles.startScanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
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
    padding: SPACING.l,
    flexGrow: 1,
  },
  header: {
    marginBottom: SPACING.xl,
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
  },
  startScanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  qrIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  startScanTitle: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  startScanDescription: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  startScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
  },
  startScanButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
    marginLeft: SPACING.s,
  },
  scannerContainer: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.medium,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTargetCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.surface,
    top: 100,
    left: 100,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    left: undefined,
    right: 100,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    top: undefined,
    bottom: 100,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    top: undefined,
    left: undefined,
    bottom: 100,
    right: 100,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scannerControls: {
    position: 'absolute',
    bottom: SPACING.l,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: 20,
  },
  cancelButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.s,
    color: COLORS.surface,
    marginLeft: SPACING.xs,
  },
  scanAgainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: SPACING.l,
  },
  scanAgainButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
  },
  productContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productDetails: {
    padding: SPACING.l,
  },
  productName: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  productCategory: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.primary,
    marginBottom: SPACING.m,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING.m,
  },
  detailItem: {
    width: '50%',
    marginBottom: SPACING.m,
  },
  detailLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
  },
  productDescription: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: SPACING.m,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.l,
    marginBottom: SPACING.l,
  },
});