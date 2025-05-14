import { DeliveryRequest, DeliveryPerson, Rating } from '@/models/Product';

export const mockDeliveryRequests: DeliveryRequest[] = [
  {
    id: '1',
    customerId: 'customer1',
    customerName: 'John Doe',
    productIds: ['1', '5', '10'],
    status: 'pending',
    address: '123 Main St, New York, NY 10001',
    requestDate: '2023-10-15',
    deliveryDate: null,
    deliveryPersonId: null,
    paymentStatus: 'pending',
    totalAmount: 245.98
  },
  {
    id: '2',
    customerId: 'customer2',
    customerName: 'Jane Smith',
    productIds: ['3', '7'],
    status: 'assigned',
    address: '456 Elm St, Los Angeles, CA 90001',
    requestDate: '2023-10-14',
    deliveryDate: null,
    deliveryPersonId: 'deliverer1',
    paymentStatus: 'completed',
    totalAmount: 132.50
  },
  {
    id: '3',
    customerId: 'customer3',
    customerName: 'Robert Johnson',
    productIds: ['12', '15', '18'],
    status: 'in-progress',
    address: '789 Oak St, Chicago, IL 60007',
    requestDate: '2023-10-13',
    deliveryDate: null,
    deliveryPersonId: 'deliverer2',
    paymentStatus: 'completed',
    totalAmount: 189.75
  },
  {
    id: '4',
    customerId: 'customer4',
    customerName: 'Emily Davis',
    productIds: ['22', '25'],
    status: 'delivered',
    address: '101 Pine St, Miami, FL 33101',
    requestDate: '2023-10-10',
    deliveryDate: '2023-10-12',
    deliveryPersonId: 'deliverer1',
    paymentStatus: 'completed',
    totalAmount: 75.99
  },
  {
    id: '5',
    customerId: 'customer5',
    customerName: 'Michael Wilson',
    productIds: ['30', '35', '40'],
    status: 'delivered',
    address: '202 Maple St, Seattle, WA 98101',
    requestDate: '2023-10-08',
    deliveryDate: '2023-10-11',
    deliveryPersonId: 'deliverer3',
    paymentStatus: 'completed',
    totalAmount: 312.45
  },
  {
    id: '6',
    customerId: 'customer1',
    customerName: 'John Doe',
    productIds: ['2', '8'],
    status: 'cancelled',
    address: '123 Main St, New York, NY 10001',
    requestDate: '2023-10-05',
    deliveryDate: null,
    deliveryPersonId: null,
    paymentStatus: 'pending',
    totalAmount: 99.50
  }
];

export const mockDeliveryPersons: DeliveryPerson[] = [
  {
    id: 'deliverer1',
    name: 'David Thompson',
    email: 'david.t@logistics.com',
    phone: '555-1234',
    rating: 4.8,
    totalDeliveries: 157,
    availabilityStatus: 'busy',
    currentDeliveryId: '2'
  },
  {
    id: 'deliverer2',
    name: 'Sarah Rodriguez',
    email: 'sarah.r@logistics.com',
    phone: '555-5678',
    rating: 4.5,
    totalDeliveries: 123,
    availabilityStatus: 'busy',
    currentDeliveryId: '3'
  },
  {
    id: 'deliverer3',
    name: 'Kevin Chen',
    email: 'kevin.c@logistics.com',
    phone: '555-9012',
    rating: 4.9,
    totalDeliveries: 89,
    availabilityStatus: 'available',
    currentDeliveryId: null
  },
  {
    id: 'deliverer4',
    name: 'Michelle Lee',
    email: 'michelle.l@logistics.com',
    phone: '555-3456',
    rating: 4.7,
    totalDeliveries: 72,
    availabilityStatus: 'offline',
    currentDeliveryId: null
  },
  {
    id: 'deliverer5',
    name: 'James Brown',
    email: 'james.b@logistics.com',
    phone: '555-7890',
    rating: 4.6,
    totalDeliveries: 54,
    availabilityStatus: 'available',
    currentDeliveryId: null
  }
];

export const mockRatings: Rating[] = [
  {
    id: 'rating1',
    deliveryId: '4',
    customerId: 'customer4',
    deliveryPersonId: 'deliverer1',
    rating: 5,
    comment: 'Very professional and delivered on time!',
    date: '2023-10-12'
  },
  {
    id: 'rating2',
    deliveryId: '5',
    customerId: 'customer5',
    deliveryPersonId: 'deliverer3',
    rating: 4,
    comment: 'Good service, but was slightly late.',
    date: '2023-10-11'
  }
];