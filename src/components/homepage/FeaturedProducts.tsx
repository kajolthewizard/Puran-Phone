import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from '../shared/QuickViewModal';

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(StoreService.getProducts());
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'apple') return p.brand === 'Apple';
    if (activeTab === 'samsung') return p.brand === 'Samsung';
    if (activeTab === 'google') return p.brand === 'Google';
    if (activeTab === 'oneplus') return p.brand === 'OnePlus';
    if (activeTab === 'nothing') return p.brand === 'Nothing';
    if (activeTab === 'under50k') return p.currentPrice < 50000;
    return true;
  });

  const TABS = [
    { id: 'all', label: 'All Refurbished' },
    { id: 'apple', label: 'iPhones' },
    { id: 'samsung', label: 'Galaxy' },
    { id: 'google', label: 'Pixels' },
    { id: 'oneplus', label: 'OnePlus' },
    { id: 'nothing', label: 'Nothing' },
    { id: 'under50k', label: 'Under ৳50,000' },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C0FF00]" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-black/40">
                Guaranteed Pre-Owned Stock
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#0A0A0A] tracking-tight">
              Featured Devices
            </h2>
            <p className="text-sm text-black/60 mt-1 max-w-md">
              Each unit individually photographed, battery calibrated, and covered by our Dhaka replacement guarantee.
            </p>
          </div>

          <Link
            to="/phones"
            className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-[#0A0A0A] hover:opacity-70 self-start md:self-end border-b border-black pb-0.5"
          >
            <span>Browse all 14+ phones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0A0A0A] text-[#C0FF00] border border-[#0A0A0A]'
                  : 'bg-[#F5F4F0] text-black/70 border border-black/10 hover:border-black hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid: 12+ Seed Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-8 rounded-none bg-[#F5F4F0] border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-display font-bold text-[#0A0A0A]">
              Can't find the exact storage or color you want?
            </h3>
            <p className="text-xs text-black/60 mt-1">
              Our Motaleb Plaza & Bashundhara City certified refurbishers restock over 40+ phones daily.
            </p>
          </div>
          <Link
            to="/phones"
            className="px-8 py-4 rounded-none bg-[#0A0A0A] text-white hover:bg-black font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors"
          >
            Open Complete Marketplace
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
};
