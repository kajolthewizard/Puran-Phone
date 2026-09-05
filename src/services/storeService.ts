import { Product, Order, TradeInQuote, InventoryItem, Review, Seller, DeviceCondition } from '../types';
import { INITIAL_PRODUCTS, SELLERS, INITIAL_INVENTORY, SEED_ORDERS, SAMPLE_REVIEWS } from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'rephone_products_v1',
  ORDERS: 'rephone_orders_v1',
  TRADE_INS: 'rephone_tradeins_v1',
  INVENTORY: 'rephone_inventory_v1',
  REVIEWS: 'rephone_reviews_v1',
  SELLERS: 'rephone_sellers_v1',
};

// Safe local storage helpers
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage quota or error:', e);
  }
}

export const formatBDT = (amount: number): string => {
  return `৳${amount.toLocaleString('en-IN')}`;
};

export class StoreService {
  // PRODUCTS
  static getProducts(): Product[] {
    return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug || p.id === slug);
  }

  static saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...products];
      updated[index] = product;
    } else {
      updated = [product, ...products];
    }
    saveToStorage(STORAGE_KEYS.PRODUCTS, updated);
    return product;
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  // ORDERS
  static getOrders(): Order[] {
    return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  }

  static getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id);
  }

  static createOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    saveToStorage(STORAGE_KEYS.ORDERS, updated);
    return order;
  }

  static updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders().map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status };
      }
      return ord;
    });
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }

  // TRADE-IN
  static getTradeIns(): TradeInQuote[] {
    return getFromStorage<TradeInQuote[]>(STORAGE_KEYS.TRADE_INS, []);
  }

  static saveTradeIn(quote: TradeInQuote): TradeInQuote {
    const tradeIns = this.getTradeIns();
    const existingIdx = tradeIns.findIndex((t) => t.id === quote.id);
    let updated: TradeInQuote[];
    if (existingIdx >= 0) {
      updated = [...tradeIns];
      updated[existingIdx] = quote;
    } else {
      updated = [quote, ...tradeIns];
    }
    saveToStorage(STORAGE_KEYS.TRADE_INS, updated);
    return quote;
  }

  // INVENTORY
  static getInventory(): InventoryItem[] {
    return getFromStorage<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  }

  static saveInventoryItem(item: InventoryItem): InventoryItem {
    const inv = this.getInventory();
    const idx = inv.findIndex((i) => i.id === item.id);
    let updated: InventoryItem[];
    if (idx >= 0) {
      updated = [...inv];
      updated[idx] = item;
    } else {
      updated = [item, ...inv];
    }
    saveToStorage(STORAGE_KEYS.INVENTORY, updated);
    return item;
  }

  // REVIEWS
  static getReviews(productId?: string): Review[] {
    const all = getFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, SAMPLE_REVIEWS);
    if (!productId) return all;
    return all.filter((r) => r.productId === productId);
  }

  static addReview(review: Review): void {
    const all = this.getReviews();
    saveToStorage(STORAGE_KEYS.REVIEWS, [review, ...all]);
  }

  // SELLERS
  static getSellers(): Seller[] {
    return getFromStorage<Seller[]>(STORAGE_KEYS.SELLERS, SELLERS);
  }

  // VALUATION CALCULATOR (STEP 4)
  static calculateDeviceQuote(
    brand: string,
    model: string,
    storage: string,
    condition: DeviceCondition,
    checklist: Record<string, boolean>
  ): { estimatedValue: number; rangeMin: number; rangeMax: number } {
    // Realistic base market rates in BDT for popular models
    let baseValue = 45000;
    const modelLower = model.toLowerCase();

    if (modelLower.includes('15 pro max')) baseValue = 92000;
    else if (modelLower.includes('15 pro')) baseValue = 75000;
    else if (modelLower.includes('14 pro')) baseValue = 58000;
    else if (modelLower.includes('13 pro') || modelLower.includes('15')) baseValue = 48000;
    else if (modelLower.includes('13')) baseValue = 38000;
    else if (modelLower.includes('12')) baseValue = 28000;
    else if (modelLower.includes('s24 ultra')) baseValue = 88000;
    else if (modelLower.includes('s23 ultra')) baseValue = 65000;
    else if (modelLower.includes('s23')) baseValue = 39000;
    else if (modelLower.includes('pixel 8 pro')) baseValue = 52000;
    else if (modelLower.includes('pixel 7')) baseValue = 30000;
    else if (modelLower.includes('oneplus 12')) baseValue = 54000;
    else if (modelLower.includes('nothing')) baseValue = 36000;
    else if (modelLower.includes('xiaomi 14')) baseValue = 52000;

    // Storage modifier
    if (storage.includes('512GB') || storage.includes('1TB')) baseValue *= 1.15;
    else if (storage.includes('256GB')) baseValue *= 1.08;

    // Condition multiplier
    const conditionMultipliers: Record<DeviceCondition, number> = {
      'Like New': 1.05,
      'Excellent': 1.0,
      'Good': 0.85,
      'Fair': 0.7,
      'Damaged': 0.45,
    };
    baseValue *= conditionMultipliers[condition] || 0.8;

    // Deductions from checklist
    if (!checklist.powersOn) baseValue *= 0.3;
    if (!checklist.touchscreenWorking) baseValue *= 0.7;
    if (!checklist.camerasWorking) baseValue *= 0.75;
    if (!checklist.biometricsWorking) baseValue *= 0.85;
    if (!checklist.batteryHealthy) baseValue *= 0.9;
    if (checklist.screenCracked) baseValue *= 0.65;
    if (checklist.backGlassDamaged) baseValue *= 0.8;
    if (checklist.liquidDamage) baseValue *= 0.4;
    if (!checklist.isUnlocked) baseValue *= 0.85;

    const finalVal = Math.max(5000, Math.round(baseValue / 500) * 500);
    const rangeMin = Math.round((finalVal * 0.92) / 500) * 500;
    const rangeMax = Math.round((finalVal * 1.08) / 500) * 500;

    return {
      estimatedValue: finalVal,
      rangeMin,
      rangeMax,
    };
  }
}
