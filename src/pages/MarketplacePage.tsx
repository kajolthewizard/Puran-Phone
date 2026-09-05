import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Smartphone,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Battery,
} from 'lucide-react';
import { StoreService, formatBDT } from '../services/storeService';
import { Product, DeviceCondition } from '../types';
import { ProductCard } from '../components/homepage/ProductCard';
import { QuickViewModal } from '../components/shared/QuickViewModal';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Read filters from URL params
  const searchQuery = searchParams.get('search') || '';
  const selectedBrand = searchParams.get('brand') || 'all';
  const selectedCondition = searchParams.get('condition') || 'all';
  const selectedStorage = searchParams.get('storage') || 'all';
  const minBattery = parseInt(searchParams.get('battery') || '0', 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || '160000', 10);
  const sortBy = searchParams.get('sort') || 'recommended';
  const dealsOnly = searchParams.get('filter') === 'deals';

  // Load products
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(StoreService.getProducts());
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Update query param helpers
  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '0') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.model.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.storage.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
          return false;
        }

        // Storage filter
        if (selectedStorage !== 'all' && !p.storage.includes(selectedStorage)) {
          return false;
        }

        // Battery min
        if (minBattery > 0 && p.batteryHealth < minBattery) {
          return false;
        }

        // Price ceiling
        if (p.currentPrice > maxPrice) {
          return false;
        }

        // Deals only (discount > 35%)
        if (dealsOnly && p.savingsPercentage < 35) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.currentPrice - b.currentPrice;
        if (sortBy === 'price-high') return b.currentPrice - a.currentPrice;
        if (sortBy === 'discount') return b.savingsPercentage - a.savingsPercentage;
        if (sortBy === 'battery') return b.batteryHealth - a.batteryHealth;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Recommended
      });
  }, [
    products,
    searchQuery,
    selectedBrand,
    selectedCondition,
    selectedStorage,
    minBattery,
    maxPrice,
    sortBy,
    dealsOnly,
  ]);

  const BRANDS_LIST = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing', 'Motorola'];
  const CONDITIONS_LIST: DeviceCondition[] = ['Like New', 'Excellent', 'Good', 'Fair'];
  const STORAGES_LIST = ['128GB', '256GB', '512GB'];

  const hasActiveFilters =
    searchQuery ||
    selectedBrand !== 'all' ||
    selectedCondition !== 'all' ||
    selectedStorage !== 'all' ||
    minBattery > 0 ||
    maxPrice < 160000 ||
    dealsOnly;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-black/50 font-mono tracking-widest uppercase mb-1">
            <span>HOME</span>
            <span>/</span>
            <span className="text-[#0A0A0A] font-bold">ALL REFURBISHED PHONES</span>
            {dealsOnly && <span className="text-[#0A0A0A] bg-[#C0FF00] px-1 font-bold">/ FLASH DEALS</span>}
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#0A0A0A] tracking-tight">
            Smartphone Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-black/60 mt-1">
            Showing {filteredProducts.length} verified devices with 30-point inspection and Dhaka warranty
          </p>
        </div>

        {/* Search Bar + Mobile Filter Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search model, color, storage..."
              className="w-full bg-white border border-black/20 rounded-none pl-9 pr-8 py-2.5 text-xs font-mono font-medium text-[#0A0A0A] placeholder:text-black/40 focus:outline-none focus:border-black"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter('search', null)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-white border border-black/20 rounded-none px-4 py-2.5 text-xs font-mono font-bold text-[#0A0A0A] focus:outline-none cursor-pointer appearance-none pr-8 uppercase tracking-wider"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount %</option>
              <option value="battery">Best Battery Health</option>
              <option value="rating">Top Customer Rating</option>
              <option value="newest">Newest Release</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-black/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden p-2.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] flex items-center justify-center shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid with Left Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP FILTER PANEL (Left Column) */}
        <aside className="hidden lg:block lg:col-span-3 bg-[#FDFCF9] p-6 rounded-none border border-black/10 sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0A0A0A]" />
              <span className="font-display font-bold text-sm text-[#0A0A0A] uppercase tracking-wider">Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-mono font-bold uppercase"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-black/40 block mb-2 tracking-wider">
              Brand
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => updateFilter('brand', 'all')}
                className={`w-full text-left px-3 py-1.5 rounded-none text-xs font-mono transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-[#0A0A0A] text-[#C0FF00] font-bold'
                    : 'text-black/70 hover:bg-[#F5F4F0]'
                }`}
              >
                All Brands
              </button>
              {BRANDS_LIST.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => updateFilter('brand', b)}
                  className={`w-full text-left px-3 py-1.5 rounded-none text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedBrand.toLowerCase() === b.toLowerCase()
                      ? 'bg-[#0A0A0A] text-[#C0FF00] font-bold'
                      : 'text-black/70 hover:bg-[#F5F4F0]'
                  }`}
                >
                  <span>{b}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="pt-4 border-t border-black/10">
            <label className="text-[10px] font-mono uppercase font-bold text-black/40 block mb-2 tracking-wider">
              Condition Grade
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {CONDITIONS_LIST.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    updateFilter('condition', selectedCondition === c ? null : c)
                  }
                  className={`px-3 py-2 rounded-none text-xs font-mono font-bold border transition-all text-center uppercase ${
                    selectedCondition === c
                      ? 'bg-[#0A0A0A] text-[#C0FF00] border-[#0A0A0A]'
                      : 'bg-[#F5F4F0] text-black/70 border-black/10 hover:border-black'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Capacity */}
          <div className="pt-4 border-t border-black/10">
            <label className="text-[10px] font-mono uppercase font-bold text-black/40 block mb-2 tracking-wider">
              Storage
            </label>
            <div className="flex items-center gap-1.5">
              {STORAGES_LIST.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateFilter('storage', selectedStorage === s ? null : s)}
                  className={`flex-1 py-1.5 rounded-none text-xs font-mono font-bold border transition-colors ${
                    selectedStorage === s
                      ? 'bg-[#0A0A0A] text-[#C0FF00] border-[#0A0A0A]'
                      : 'bg-[#F5F4F0] text-black/70 border-black/10 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Battery Health Threshold */}
          <div className="pt-4 border-t border-black/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase font-bold text-black/40 tracking-wider">
                Min. Battery Health
              </label>
              <span className="text-xs font-bold text-[#0A0A0A] font-mono">
                {minBattery > 0 ? `${minBattery}%+` : 'Any (≥85%)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 90, 95].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateFilter('battery', val === 0 ? null : val.toString())}
                  className={`py-1.5 rounded-none text-xs font-mono font-bold border transition-colors ${
                    minBattery === val
                      ? 'bg-[#0A0A0A] text-[#C0FF00] border-[#0A0A0A]'
                      : 'bg-[#F5F4F0] text-black/70 border-black/10 hover:border-black'
                  }`}
                >
                  {val === 0 ? 'All' : `${val}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-black/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase font-bold text-black/40 tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold text-[#0A0A0A] font-mono">
                {formatBDT(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="30000"
              max="160000"
              step="5000"
              value={maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-full accent-[#0A0A0A] cursor-pointer"
            />
          </div>
        </aside>

        {/* PRODUCT GRID & RESULTS (Right Column) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FDFCF9] rounded-none border border-black/10 text-xs font-mono">
              <span className="text-black/50 font-bold uppercase text-[10px]">Active Filters:</span>
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold text-[11px]">
                  Brand: {selectedBrand}
                  <button type="button" onClick={() => updateFilter('brand', null)}>
                    <X className="w-3 h-3 text-[#C0FF00] hover:text-white" />
                  </button>
                </span>
              )}
              {selectedCondition !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold text-[11px]">
                  Condition: {selectedCondition}
                  <button type="button" onClick={() => updateFilter('condition', null)}>
                    <X className="w-3 h-3 text-[#C0FF00] hover:text-white" />
                  </button>
                </span>
              )}
              {selectedStorage !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold text-[11px]">
                  Storage: {selectedStorage}
                  <button type="button" onClick={() => updateFilter('storage', null)}>
                    <X className="w-3 h-3 text-[#C0FF00] hover:text-white" />
                  </button>
                </span>
              )}
              {minBattery > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold text-[11px]">
                  Battery: ≥{minBattery}%
                  <button type="button" onClick={() => updateFilter('battery', null)}>
                    <X className="w-3 h-3 text-[#C0FF00] hover:text-white" />
                  </button>
                </span>
              )}
              {maxPrice < 160000 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold text-[11px]">
                  Max: {formatBDT(maxPrice)}
                  <button type="button" onClick={() => updateFilter('maxPrice', null)}>
                    <X className="w-3 h-3 text-[#C0FF00] hover:text-white" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold text-[11px]">
                  Search: "{searchQuery}"
                  <button type="button" onClick={() => updateFilter('search', null)}>
                    <X className="w-3 h-3 text-[#C0FF00] hover:text-white" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-rose-600 hover:underline uppercase font-bold ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
          {/* Loading Skeletons State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 h-96 animate-pulse flex flex-col justify-between"
                >
                  <div className="w-20 h-5 bg-black/5 rounded-none" />
                  <div className="w-36 h-36 bg-[#F5F4F0] rounded-none mx-auto" />
                  <div className="space-y-2">
                    <div className="w-28 h-4 bg-black/5 rounded-none" />
                    <div className="w-48 h-6 bg-black/10 rounded-none" />
                    <div className="w-32 h-5 bg-black/5 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          ) : (
            /* Empty / No Results State */
            <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-16 h-16 bg-[#F5F4F0] rounded-none flex items-center justify-center mx-auto mb-4 text-[#0A0A0A] border border-black/5">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-[#0A0A0A]">
                No matching phones found
              </h3>
              <p className="text-xs text-black/60 mt-2 max-w-sm mx-auto leading-relaxed">
                We couldn't find any refurbished units matching your active filter criteria. Try expanding your price range or clearing some filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 px-8 py-3 rounded-none bg-[#0A0A0A] text-white text-xs font-mono font-bold uppercase hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE ANIMATED FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-h-[85vh] bg-[#FDFCF9] rounded-none border-t border-black p-6 overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0A0A0A]" />
                <span className="font-display font-bold text-base text-[#0A0A0A] uppercase tracking-wider">Filters</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-none text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Brand Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/40 block mb-2 tracking-wider">
                Brand
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateFilter('brand', 'all')}
                  className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold uppercase transition-all ${
                    selectedBrand === 'all'
                      ? 'bg-[#0A0A0A] text-[#C0FF00]'
                      : 'bg-[#F5F4F0] text-black/70 border border-black/10'
                  }`}
                >
                  All
                </button>
                {BRANDS_LIST.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => updateFilter('brand', b)}
                    className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold uppercase transition-all ${
                      selectedBrand.toLowerCase() === b.toLowerCase()
                        ? 'bg-[#0A0A0A] text-[#C0FF00]'
                        : 'bg-[#F5F4F0] text-black/70 border border-black/10'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Condition */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/40 block mb-2 tracking-wider">
                Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONDITIONS_LIST.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateFilter('condition', selectedCondition === c ? null : c)}
                    className={`py-2 rounded-none text-xs font-mono font-bold uppercase border transition-all ${
                      selectedCondition === c
                        ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                        : 'bg-[#F5F4F0] text-black/70 border-black/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="pt-4 border-t border-black/10 flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-3 text-xs font-mono font-bold uppercase text-black/70 bg-[#F5F4F0] border border-black/10 rounded-none"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-2 py-3 text-xs font-mono font-bold uppercase text-[#0A0A0A] bg-[#C0FF00] rounded-none hover:bg-black hover:text-white transition-colors"
              >
                View {filteredProducts.length} Phones
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
