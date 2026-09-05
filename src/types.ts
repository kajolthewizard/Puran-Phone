export type DeviceCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Damaged';

export interface Product {
  id: string;
  slug: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  colorHex: string;
  availableColors: { name: string; hex: string }[];
  condition: DeviceCondition;
  conditionDescription: string;
  batteryHealth: number; // percentage, e.g. 94
  unlockedStatus: string; // e.g. "Factory Unlocked (All SIMs)"
  currentPrice: number; // in BDT ৳
  originalPrice: number; // New retail price in BDT ৳
  savingsPercentage: number;
  warrantyMonths: number; // e.g. 12
  seller: {
    id: string;
    name: string;
    location: string;
    rating: number;
    verified: boolean;
    salesCount: number;
  };
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  specs: {
    screen: string;
    processor: string;
    camera: string;
    os: string;
    sim: string;
    charging: string;
  };
  inspectionPassed: boolean;
  inspectionDate: string;
  imeiVerified: boolean;
  featured?: boolean;
  releaseYear: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  extendedWarranty: boolean; // extra 12 months (+৳2,500)
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  division: string;
  city: string;
  area: string;
  addressLine: string;
  isDefault?: boolean;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'cod';

export type OrderStatus = 'Processing' | 'Inspected' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderTimelineStep {
  status: string;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Demo Approved';
  shippingAddress: Address;
  status: OrderStatus;
  timeline: OrderTimelineStep[];
  trackingNumber: string;
  warrantyExpiresAt: string;
}

export interface TradeInChecklist {
  powersOn: boolean;
  touchscreenWorking: boolean;
  camerasWorking: boolean;
  biometricsWorking: boolean; // Face ID or Fingerprint
  batteryHealthy: boolean;
  screenCracked: boolean;
  backGlassDamaged: boolean;
  isUnlocked: boolean;
  liquidDamage: boolean;
}

export interface TradeInQuote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  brand: string;
  model: string;
  storage: string;
  condition: DeviceCondition;
  checklist: TradeInChecklist;
  estimatedValue: number;
  estimatedRangeMin: number;
  estimatedRangeMax: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  pickupAddress?: string;
  paymentMethodPref?: 'bKash' | 'Nagad' | 'Bank Transfer';
  status: 'Draft' | 'Submitted' | 'Device Received' | 'Inspected' | 'Paid' | 'Declined';
}

export interface InventoryItem {
  id: string;
  sku: string;
  imei: string;
  model: string;
  storage: string;
  color: string;
  condition: DeviceCondition;
  batteryHealth: number;
  purchaseCost: number;
  sellingPrice: number;
  sellerName: string;
  location: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Inspection' | 'Repair' | 'Refurbishing';
  dateAdded: string;
}

export interface Seller {
  id: string;
  name: string;
  hub: string; // e.g. "Motaleb Plaza, Hatirpool, Dhaka"
  rating: number;
  reviewCount: number;
  verified: boolean;
  activeListings: number;
  totalSales: number;
  payoutPending: number;
  joinDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'seller' | 'admin';
  avatarUrl?: string;
  savedAddresses: Address[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  batteryReported: number;
  conditionBought: DeviceCondition;
}
