import { Product, ProductCategory } from '@/models/Product';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const generateRandomBatchNumber = () => {
  return `BATCH-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
};

const generateRandomPrice = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

const CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Food',
  'Clothing',
  'Furniture',
  'Home Appliances',
  'Toys',
  'Books',
  'Health & Beauty',
  'Sports & Outdoors',
  'Automotive'
];

const PRODUCT_NAMES = {
  Electronics: [
    'Smartphone', 'Smart Watch', 'Laptop', 'Tablet', 'Headphones',
    'Bluetooth Speaker', 'Power Bank', 'USB Drive', 'Wireless Mouse',
    'Keyboard', 'Monitor', 'Camera', 'Printer', 'External Hard Drive'
  ],
  Food: [
    'Apple', 'Banana', 'Orange', 'Milk', 'Bread',
    'Eggs', 'Cheese', 'Cereal', 'Pasta', 'Rice',
    'Chocolate', 'Coffee Beans', 'Tea Bags', 'Honey'
  ],
  Clothing: [
    'T-shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater',
    'Socks', 'Underwear', 'Hat', 'Gloves', 'Scarf',
    'Shoes', 'Sandals', 'Belt', 'Sunglasses'
  ],
  Furniture: [
    'Chair', 'Table', 'Sofa', 'Bed', 'Bookshelf',
    'Desk', 'Drawer', 'Lamp', 'Mirror', 'Cabinet',
    'Wardrobe', 'Ottoman', 'Nightstand', 'Dining Set'
  ],
  'Home Appliances': [
    'Refrigerator', 'Microwave', 'Toaster', 'Blender', 'Coffee Maker',
    'Mixer Grinder', 'Air Conditioner', 'Vacuum Cleaner', 'Iron', 'Washing Machine',
    'Dishwasher', 'Air Purifier', 'Food Processor', 'Electric Kettle'
  ],
  Toys: [
    'Action Figure', 'Doll', 'Board Game', 'Puzzle', 'Teddy Bear',
    'Toy Car', 'Building Blocks', 'Remote Control Car', 'Toy Train', 'Kite',
    'Toy Robot', 'Art Set', 'Toy Kitchen', 'Educational Toy'
  ],
  Books: [
    'Novel', 'Textbook', 'Cookbook', 'Biography', 'Self-Help Book',
    'Children\'s Book', 'Comic Book', 'Dictionary', 'Magazine', 'Encyclopedia',
    'Travel Guide', 'Art Book', 'Science Book', 'History Book'
  ],
  'Health & Beauty': [
    'Shampoo', 'Conditioner', 'Toothpaste', 'Soap', 'Face Wash',
    'Moisturizer', 'Perfume', 'Deodorant', 'Makeup Kit', 'Hairdryer',
    'Razor', 'Trimmer', 'Face Mask', 'Hand Sanitizer'
  ],
  'Sports & Outdoors': [
    'Basketball', 'Football', 'Tennis Racket', 'Golf Club', 'Bicycle',
    'Yoga Mat', 'Dumbbells', 'Running Shoes', 'Swim Goggles', 'Tent',
    'Sleeping Bag', 'Fishing Rod', 'Cricket Bat', 'Hockey Stick'
  ],
  Automotive: [
    'Car Battery', 'Engine Oil', 'Tire', 'Windshield Wiper', 'Car Seat Cover',
    'Air Freshener', 'Car Charger', 'GPS Navigator', 'Car Cleaning Kit', 'Jumper Cable',
    'Fuel Additive', 'Car Polish', 'Floor Mat', 'Steering Wheel Cover'
  ]
};

const generateProductImage = (category: ProductCategory, productName: string) => {
  const normalizedName = productName.toLowerCase().replace(/\s+/g, '-');
  const categoryMap: Record<ProductCategory, string> = {
    'Electronics': 'gadgets',
    'Food': 'food',
    'Clothing': 'fashion',
    'Furniture': 'furniture',
    'Home Appliances': 'home',
    'Toys': 'toys',
    'Books': 'books',
    'Health & Beauty': 'beauty',
    'Sports & Outdoors': 'sports',
    'Automotive': 'auto'
  };
  
  const categorySlug = categoryMap[category];
  return `https://source.unsplash.com/featured/?${categorySlug},${normalizedName}`;
};

export const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  CATEGORIES.forEach(category => {
    const productNames = PRODUCT_NAMES[category];
    
    productNames.forEach(name => {
      const today = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(today.getFullYear() - 3);
      
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(today.getFullYear() + 2);
      
      const manufacturingDate = generateRandomDate(threeYearsAgo, today);
      const expiryDate = generateRandomDate(today, twoYearsFromNow);
      
      const product: Product = {
        id: id.toString(),
        name,
        category,
        quantity: Math.floor(Math.random() * 100) + 5,
        price: generateRandomPrice(10, 1000),
        manufacturingDate,
        expiryDate,
        batchNumber: generateRandomBatchNumber(),
        description: `High-quality ${name.toLowerCase()} for your needs.`,
        image: generateProductImage(category, name),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=product-${id}`,
        lowStockThreshold: 10
      };
      
      products.push(product);
      id++;
    });
  });

  return products;
};

export default generateMockProducts();