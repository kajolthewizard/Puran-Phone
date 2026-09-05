import React, { useState } from 'react';
import {
  Store,
  Plus,
  Package,
  TrendingUp,
  ShieldCheck,
  Battery,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  X,
} from 'lucide-react';
import { StoreService, formatBDT } from '../services/storeService';
import { Product, DeviceCondition } from '../types';

export const SellerPortalPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(StoreService.getProducts());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding new phone listing
  const [newBrand, setNewBrand] = useState('Apple');
  const [newModel, setNewModel] = useState('');
  const [newStorage, setNewStorage] = useState('256GB');
  const [newColor, setNewColor] = useState('Natural Titanium');
  const [newCondition, setNewCondition] = useState<DeviceCondition>('Excellent');
  const [newBattery, setNewBattery] = useState(92);
  const [newPrice, setNewPrice] = useState(85000);
  const [newOriginalPrice, setNewOriginalPrice] = useState(130000);
  const [newImei, setNewImei] = useState('358920194829104');

  const sellerProducts = products.filter((p) => p.seller.id === 'seller-dhaka-prime' || true);

  const totalInventoryValue = sellerProducts.reduce((acc, p) => acc + p.currentPrice * p.stock, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.trim()) return;

    const slug = `${newBrand.toLowerCase()}-${newModel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const savingsPercent = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);

    const created: Product = {
      id: `prod-${Date.now()}`,
      slug,
      brand: newBrand,
      model: newModel,
      storage: newStorage,
      color: newColor,
      colorHex: '#1c1c1e',
      availableColors: [{ name: newColor, hex: '#1c1c1e' }],
      condition: newCondition,
      conditionDescription: `${newCondition} condition verified by Dhaka Prime Gadgets technician.`,
      batteryHealth: newBattery,
      unlockedStatus: 'Factory Unlocked (All SIMs)',
      currentPrice: newPrice,
      originalPrice: newOriginalPrice,
      savingsPercentage: savingsPercent,
      warrantyMonths: 12,
      seller: {
        id: 'seller-dhaka-prime',
        name: 'Dhaka Prime Gadgets',
        rating: 4.9,
        verified: true,
        location: 'Motaleb Plaza, Dhaka',
        salesCount: 382,
      },
      rating: 4.9,
      reviewCount: 1,
      stock: 1,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        screen: '6.7-inch Super Retina XDR / AMOLED 120Hz',
        processor: 'Flagship Bionic / Snapdragon Gen 3',
        camera: 'Triple 48MP Pro System + 5x Telephoto',
        os: 'Official OS (Full BTRC & OTA Support)',
        sim: 'Physical Nano-SIM + eSIM Dual Standby',
        charging: 'Fast USB-C / MagSafe Fast Wireless',
      },
      inspectionPassed: true,
      inspectionDate: 'Today',
      imeiVerified: true,
      featured: true,
      releaseYear: 2023,
    };

    StoreService.saveProduct(created);
    setProducts(StoreService.getProducts());
    setIsAddModalOpen(false);
    setNewModel('');
  };

  const handleDelete = (id: string) => {
    StoreService.deleteProduct(id);
    setProducts(StoreService.getProducts());
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Seller Portal Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-2xl border border-blue-200">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-black text-neutral-950">
                Dhaka Prime Gadgets
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                CERTIFIED MERCHANT
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Shop 402, Level 4, Motaleb Plaza, Hatirpool, Dhaka · Merchant ID: DP-9482
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-neutral-950 hover:bg-black text-[#ccff00] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>List Phone for Inspection</span>
        </button>
      </div>

      {/* Seller KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200">
          <span className="text-xs font-mono uppercase text-neutral-500">Live Inventory Value</span>
          <div className="text-2xl font-display font-black text-neutral-950 mt-1">
            {formatBDT(totalInventoryValue)}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {sellerProducts.length} certified units
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200">
          <span className="text-xs font-mono uppercase text-neutral-500">Lifetime Payout</span>
          <div className="text-2xl font-display font-black text-emerald-700 mt-1">
            {formatBDT(3480000)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Paid directly via bKash & Bank
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200">
          <span className="text-xs font-mono uppercase text-neutral-500">Merchant Quality Score</span>
          <div className="text-2xl font-display font-black text-neutral-950 mt-1">
            4.9 / 5.0 ★
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            382 customer deliveries
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200">
          <span className="text-xs font-mono uppercase text-neutral-500">Inspection Pass Rate</span>
          <div className="text-2xl font-display font-black text-[#ccff00] bg-neutral-900 px-3 py-1 rounded-xl w-fit mt-1">
            99.2%
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Dhaka lab benchmark
          </span>
        </div>
      </div>

      {/* Merchant Inventory Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-950">
              Active Stock & Diagnostic Status
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Phones certified and published to the RE:PHONE Bangladesh marketplace.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-500">
            {sellerProducts.length} Items Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-6">Phone Model</th>
                <th className="py-3 px-6">Grade</th>
                <th className="py-3 px-6">Battery</th>
                <th className="py-3 px-6">Listing Price</th>
                <th className="py-3 px-6">Original</th>
                <th className="py-3 px-6">Inspection Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sellerProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.model}
                        className="w-10 h-10 object-contain mix-blend-multiply bg-neutral-50 rounded-lg p-1"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-neutral-900 block">{p.model}</span>
                        <span className="text-neutral-500 text-[11px]">
                          {p.brand} · {p.storage} · {p.color}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold font-mono text-[11px]">
                      {p.condition}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <Battery className="w-4 h-4" />
                      <span>{p.batteryHealth}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-neutral-950 text-sm">
                    {formatBDT(p.currentPrice)}
                  </td>

                  <td className="py-4 px-6 font-mono text-neutral-400 line-through">
                    {formatBDT(p.originalPrice)}
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> 30/30 Certified
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-xl font-display font-bold text-neutral-950">
                  List Smartphone for Inspection
                </h3>
                <p className="text-xs text-neutral-500">
                  Submit device specs for the Motaleb Plaza diagnostic queue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Brand</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  >
                    {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing'].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Storage</label>
                  <select
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  >
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Battery Health %</label>
                  <input
                    type="number"
                    min="80"
                    max="100"
                    value={newBattery}
                    onChange={(e) => setNewBattery(parseInt(e.target.value, 10))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Selling Price (৳)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value, 10))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">New Retail Price (৳)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(parseInt(e.target.value, 10))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-semibold text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  15-Digit IMEI Number (Checked with BTRC)
                </label>
                <input
                  type="text"
                  required
                  value={newImei}
                  onChange={(e) => setNewImei(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-mono text-neutral-900"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-neutral-950 text-white font-bold hover:bg-black"
                >
                  Publish to RE:PHONE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
