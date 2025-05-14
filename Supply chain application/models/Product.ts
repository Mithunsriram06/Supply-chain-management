export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  manufacturingDate: string;
  expiryDate: string;
  batchNumber: string;
  description: string;
  image: string;
  qrCode: string;
  lowStockThreshold: number;
}

export type ProductCategory = 
  | 'Electronics' 
  | 'Food' 
  | 'Clothing' 
  | 'Furniture' 
  | 'Home Appliances' 
  | 'Toys' 
  | 'Books' 
  | 'Health & Beauty'
  | 'Sports & Outdoors'
  | 'Automotive';

export interface DeliveryRequest {
  id: string;
  customerId: string;
  customerName: string;
  productIds: string[];
  status: 'pending' | 'assigned' | 'in-progress' | 'delivered' | 'cancelled';
  address: string;
  requestDate: string;
  deliveryDate: string | null;
  deliveryPersonId: string | null;
  paymentStatus: 'pending' | 'completed';
  totalAmount: number;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  availabilityStatus: 'available' | 'busy' | 'offline';
  currentDeliveryId: string | null;
}

export interface Rating {
  id: string;
  deliveryId: string;
  customerId: string;
  deliveryPersonId: string;
  rating: number;
  comment: string;
  date: string;
}