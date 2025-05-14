import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockProducts, { generateMockProducts } from '@/data/products';
import { mockDeliveryRequests, mockDeliveryPersons, mockRatings } from '@/data/deliveries';
import { Product, DeliveryRequest, DeliveryPerson, Rating } from '@/models/Product';

interface MockDataContextType {
  products: Product[];
  deliveryRequests: DeliveryRequest[];
  deliveryPersons: DeliveryPerson[];
  ratings: Rating[];
  updateProduct: (product: Product) => Promise<void>;
  updateProductQuantity: (productId: string, quantity: number) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  addDeliveryRequest: (request: Omit<DeliveryRequest, 'id'>) => Promise<DeliveryRequest>;
  updateDeliveryStatus: (id: string, status: DeliveryRequest['status']) => Promise<void>;
  addRating: (rating: Omit<Rating, 'id' | 'date'>) => Promise<void>;
  getProductsForDelivery: (productIds: string[]) => Product[];
  registerDeliveryPerson: (person: Omit<DeliveryPerson, 'id' | 'rating' | 'totalDeliveries' | 'availabilityStatus' | 'currentDeliveryId'>) => Promise<DeliveryPerson>;
  isLoading: boolean;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Storage keys
const PRODUCTS_STORAGE_KEY = 'logistics_products';
const DELIVERY_REQUESTS_STORAGE_KEY = 'logistics_delivery_requests';
const DELIVERY_PERSONS_STORAGE_KEY = 'logistics_delivery_persons';
const RATINGS_STORAGE_KEY = 'logistics_ratings';

export default function MockDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage or initialize with mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        const loadedDeliveryRequests = await AsyncStorage.getItem(DELIVERY_REQUESTS_STORAGE_KEY);
        const loadedDeliveryPersons = await AsyncStorage.getItem(DELIVERY_PERSONS_STORAGE_KEY);
        const loadedRatings = await AsyncStorage.getItem(RATINGS_STORAGE_KEY);
        
        setProducts(loadedProducts ? JSON.parse(loadedProducts) : mockProducts);
        setDeliveryRequests(loadedDeliveryRequests ? JSON.parse(loadedDeliveryRequests) : mockDeliveryRequests);
        setDeliveryPersons(loadedDeliveryPersons ? JSON.parse(loadedDeliveryPersons) : mockDeliveryPersons);
        setRatings(loadedRatings ? JSON.parse(loadedRatings) : mockRatings);
      } catch (error) {
        console.error('Error loading mock data', error);
        // Fallback to mock data
        setProducts(mockProducts);
        setDeliveryRequests(mockDeliveryRequests);
        setDeliveryPersons(mockDeliveryPersons);
        setRatings(mockRatings);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(DELIVERY_REQUESTS_STORAGE_KEY, JSON.stringify(deliveryRequests));
    }
  }, [deliveryRequests, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(DELIVERY_PERSONS_STORAGE_KEY, JSON.stringify(deliveryPersons));
    }
  }, [deliveryPersons, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    }
  }, [ratings, isLoading]);

  const updateProduct = async (product: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === product.id ? product : p)
    );
  };

  const updateProductQuantity = async (productId: string, quantity: number) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === productId ? { ...p, quantity } : p)
    );
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.quantity <= p.lowStockThreshold);
  };

  const addDeliveryRequest = async (request: Omit<DeliveryRequest, 'id'>) => {
    const newRequest: DeliveryRequest = {
      ...request,
      id: `request-${Date.now()}`
    };
    
    setDeliveryRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const updateDeliveryStatus = async (id: string, status: DeliveryRequest['status']) => {
    setDeliveryRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status } : r)
    );
  };

  const addRating = async (ratingData: Omit<Rating, 'id' | 'date'>) => {
    const newRating: Rating = {
      ...ratingData,
      id: `rating-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    setRatings(prev => [...prev, newRating]);
    
    // Update delivery person's rating
    setDeliveryPersons(prev => {
      return prev.map(person => {
        if (person.id === ratingData.deliveryPersonId) {
          // Get all ratings for this person
          const personRatings = [...ratings, newRating].filter(
            r => r.deliveryPersonId === person.id
          );
          
          // Calculate average rating
          const averageRating = 
            personRatings.reduce((sum, r) => sum + r.rating, 0) / personRatings.length;
          
          return {
            ...person,
            rating: Number(averageRating.toFixed(1))
          };
        }
        return person;
      });
    });
  };

  const getProductsForDelivery = (productIds: string[]) => {
    return products.filter(product => productIds.includes(product.id));
  };

  const registerDeliveryPerson = async (personData: Omit<DeliveryPerson, 'id' | 'rating' | 'totalDeliveries' | 'availabilityStatus' | 'currentDeliveryId'>) => {
    const newPerson: DeliveryPerson = {
      ...personData,
      id: `deliverer-${Date.now()}`,
      rating: 0,
      totalDeliveries: 0,
      availabilityStatus: 'available',
      currentDeliveryId: null
    };
    
    setDeliveryPersons(prev => [...prev, newPerson]);
    return newPerson;
  };

  const value: MockDataContextType = {
    products,
    deliveryRequests,
    deliveryPersons,
    ratings,
    updateProduct,
    updateProductQuantity,
    getProductById,
    getLowStockProducts,
    addDeliveryRequest,
    updateDeliveryStatus,
    addRating,
    getProductsForDelivery,
    registerDeliveryPerson,
    isLoading
  };

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};