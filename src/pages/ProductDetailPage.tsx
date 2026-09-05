import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Battery,
  CheckCircle2,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  Box,
  Store,
  Star,
  Zap,
  Info,
  ChevronRight,
  Check,
  AlertCircle,
  Clock,
  ThumbsUp,
  Cpu,
  Camera,
  Smartphone,
  Wifi,
  Package,
} from 'lucide-react';
import { StoreService, formatBDT } from '../services/storeService';
import { Product, DeviceCondition } from '../types';
import { ProductViewer3D } from '../components/3d/ProductViewer3D';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'inspection' | 'reviews'>('overview');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Dynamic selectors
  const [selectedCondition, setSelectedCondition] = useState<DeviceCondition>('Excellent');
  const [selectedStorage, setSelectedStorage] = useState<string>('256GB');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (slug) {
      const found = StoreService.getProductBySlug(slug);
      if (found) {
        setProduct(found);
        setSelectedCondition(found.condition);
        setSelectedStorage(found.storage);
        setSelectedColor(found.color);
        setSelectedImageIdx(0);
      }
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-28 text-center px-4">
        <Smartphone className="w-12 h-12 text-neutral-300 mb-3" />
        <h2 className="text-2xl font-display font-bold text-neutral-900">Product not found</h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          The requested refurbished phone is currently out of stock or may have been unlisted.
        </p>
        <Link
          to="/phones"
          className="mt-6 px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-black"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Price adjustment simulation based on condition grade selection
  const conditionMultipliers: Record<DeviceCondition, number> = {
    'Like New': 1.08,
    Excellent: 1.0,
    Good: 0.88,
    Fair: 0.76,
    Damaged: 0.5,
  };

  const dynamicPrice = Math.round((product.currentPrice * (conditionMultipliers[selectedCondition] || 1)) / 100) * 100;
  const dynamicSavings = product.originalPrice - dynamicPrice;
  const dynamicSavingsPercent = Math.round((dynamicSavings / product.originalPrice) * 100);

  const dynamicBattery = {
    'Like New': 98,
    Excellent: product.batteryHealth,
    Good: Math.max(88, product.batteryHealth - 4),
    Fair: 86,
    Damaged: 78,
  }[selectedCondition];

  const handleAddToCart = () => {
    // Create an updated product instance reflecting the selected condition/storage/price
    const itemToAdd: Product = {
      ...product,
      condition: selectedCondition,
      storage: selectedStorage,
      color: selectedColor || product.color,
      currentPrice: dynamicPrice,
      savingsPercentage: dynamicSavingsPercent,
      batteryHealth: dynamicBattery,
    };
    addToCart(itemToAdd, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[10px] text-black/50 font-mono tracking-widest uppercase mb-6">
        <Link to="/" className="hover:text-black">
          HOME
        </Link>
        <span>/</span>
        <Link to="/phones" className="hover:text-black">
          PHONES
        </Link>
        <span>/</span>
        <Link to={`/phones?brand=${product.brand}`} className="hover:text-black">
          {product.brand.toUpperCase()}
        </Link>
        <span>/</span>
        <span className="text-[#0A0A0A] font-bold truncate max-w-[200px]">
          {product.model}
        </span>
      </div>

      {/* Main Grid: 3D Stage / Gallery (Left) + Purchase Architecture (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Visual Presentation & 3D Interactive Viewer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Frame */}
          <div className="relative bg-[#FDFCF9] rounded-none border border-black/10 p-6 overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-20 relative">
              {/* 3D vs Photos Switcher */}
              <div className="flex items-center p-1 bg-[#F5F4F0] rounded-none border border-black/10">
                <button
                  type="button"
                  onClick={() => setIs3DMode(false)}
                  className={`px-3 py-1 rounded-none text-xs font-mono font-bold uppercase transition-all ${
                    !is3DMode
                      ? 'bg-[#0A0A0A] text-[#C0FF00]'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  HD Studio Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setIs3DMode(true)}
                  className={`px-3 py-1 rounded-none text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all ${
                    is3DMode
                      ? 'bg-[#0A0A0A] text-[#C0FF00]'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#C0FF00]" />
                  3D Orbit Showroom
                </button>
              </div>

              {/* Wishlist & Share buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-none border border-black/20 hover:bg-[#F5F4F0] text-[#0A0A0A] transition-colors"
                  title="Share link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#0A0A0A]" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-none border transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-400 text-rose-600'
                      : 'border-black/20 hover:bg-[#F5F4F0] text-[#0A0A0A]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Stage Body */}
            <div className="py-6 flex items-center justify-center min-h-[420px]">
              {is3DMode ? (
                <div className="w-full">
                  <ProductViewer3D color={selectedColor || product.color} model={product.model} />
                </div>
              ) : (
                <div className="relative group w-full flex items-center justify-center">
                  <img
                    src={product.images[selectedImageIdx] || product.images[0]}
                    alt={`${product.model} - view ${selectedImageIdx + 1}`}
                    className="max-h-[380px] w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-2 text-[10px] font-mono uppercase bg-[#0A0A0A] text-[#C0FF00] px-2 py-0.5 rounded-none border border-black">
                    Certified Physical Device Photo
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (When in 2D mode) */}
            {!is3DMode && product.images.length > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-black/10">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-none p-1.5 border transition-all overflow-hidden ${
                      selectedImageIdx === idx
                        ? 'border-[#0A0A0A] ring-2 ring-[#0A0A0A]/20 bg-[#F5F4F0] scale-105'
                        : 'border-black/15 hover:border-black bg-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-full h-full object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Environmental Savings Statement (CO2 & E-Waste Diverted) */}
          <div className="p-6 rounded-none bg-[#0A0A0A] text-white border border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-none bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#C0FF00]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Circular Impact: 79kg CO₂e & 195g E-Waste Prevented
                </h4>
                <p className="text-xs text-white/60 mt-0.5 max-w-md">
                  Choosing this refurbished {product.model} avoids the heavy mining of lithium, cobalt, and gold required for a brand-new retail unit.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#0A0A0A] bg-[#C0FF00] px-3 py-1.5 rounded-none shrink-0 uppercase tracking-widest">
              ECO CERTIFIED
            </span>
          </div>

          {/* What's In The Box Section */}
          <div className="p-6 bg-[#FDFCF9] rounded-none border border-black/10">
            <div className="flex items-center gap-2 mb-4">
              <Box className="w-5 h-5 text-[#0A0A0A]" />
              <h3 className="font-display font-bold text-base text-[#0A0A0A] uppercase tracking-wider">
                What's in the RE:PHONE Box
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-black/80 font-mono font-bold uppercase">
              <div className="p-3 bg-[#F5F4F0] rounded-none border border-black/5 text-center">
                <Smartphone className="w-5 h-5 mx-auto text-[#0A0A0A] mb-1" />
                <span>{product.model}</span>
              </div>
              <div className="p-3 bg-[#F5F4F0] rounded-none border border-black/5 text-center">
                <Zap className="w-5 h-5 mx-auto text-[#0A0A0A] mb-1" />
                <span>Braided Fast Cable</span>
              </div>
              <div className="p-3 bg-[#F5F4F0] rounded-none border border-black/5 text-center">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#0A0A0A] mb-1" />
                <span>30-pt Lab Certificate</span>
              </div>
              <div className="p-3 bg-[#F5F4F0] rounded-none border border-black/5 text-center">
                <Package className="w-5 h-5 mx-auto text-[#0A0A0A] mb-1" />
                <span>Recycled Packaging</span>
              </div>
            </div>
            <p className="text-[10px] text-black/50 mt-3 font-mono text-center uppercase">
              Notice: Wall charging adapter sold separately to eliminate electronic waste duplication.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Selection Architecture & Checkout Trigger */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Title & Rating */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/50">
                {product.brand}
              </span>
              <span className="text-black/30">•</span>
              <span className="text-[10px] font-mono text-[#0A0A0A] font-bold bg-[#C0FF00] px-2 py-0.5 rounded-none uppercase">
                IMEI Clean & BTRC White-Listed
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A0A0A] tracking-tight">
              {product.model}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs font-mono">
              <div className="flex items-center gap-1 text-black">
                <Star className="w-4 h-4 fill-black" />
                <span className="font-bold text-[#0A0A0A]">{product.rating}</span>
                <span className="text-black/50">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-black/30">•</span>
              <span className="text-black/60">
                In Stock: <strong className="text-[#0A0A0A]">{product.stock} units</strong>
              </span>
            </div>
          </div>

          {/* Transparent Savings Price Card */}
          <div className="p-6 rounded-none bg-[#FDFCF9] border border-black/10 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-mono font-bold text-black/50 uppercase tracking-widest">
                RE:PHONE Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-black text-[#0A0A0A]">
                  {formatBDT(dynamicPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-black/60 border-t border-black/10 font-mono">
              <span>Brand New Retail Price:</span>
              <span className="line-through">{formatBDT(product.originalPrice)}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-[#0A0A0A] font-bold font-mono">
              <span>Transparent Savings:</span>
              <span className="bg-[#C0FF00] px-1.5 py-0.5 text-[#0A0A0A]">
                Save {formatBDT(dynamicSavings)} ({dynamicSavingsPercent}%)
              </span>
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase font-bold text-black/50 tracking-wider">
                1. Select Condition Grade
              </label>
              <Link to="/grading" className="text-[11px] font-mono text-[#0A0A0A] underline uppercase font-bold">
                Grading Guide
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['Like New', 'Excellent', 'Good', 'Fair'] as DeviceCondition[]).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setSelectedCondition(cond)}
                  className={`p-3 rounded-none border text-left transition-all ${
                    selectedCondition === cond
                      ? 'bg-[#0A0A0A] text-[#C0FF00] border-[#0A0A0A]'
                      : 'bg-[#FDFCF9] text-black/80 border-black/10 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono uppercase">{cond}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        selectedCondition === cond ? 'text-[#C0FF00]' : 'text-black/50'
                      }`}
                    >
                      {cond === 'Like New' && 'Pristine'}
                      {cond === 'Excellent' && 'Popular'}
                      {cond === 'Good' && 'Best Value'}
                      {cond === 'Fair' && 'Deepest Sav'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Condition Guarantee info pill */}
            <div className="mt-2.5 p-3 rounded-none bg-[#F5F4F0] border border-black/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 font-bold text-[#0A0A0A]">
                <Battery className="w-4 h-4 text-[#0A0A0A]" />
                <span>Guaranteed {dynamicBattery}% Battery Health</span>
              </div>
              <span className="text-[10px] text-black/50 uppercase">30-pt passed</span>
            </div>
          </div>

          {/* Storage Capacity Selector */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-black/50 block mb-2 tracking-wider">
              2. Internal Storage
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['128GB', '256GB', '512GB'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStorage(st)}
                  className={`py-2.5 rounded-none text-xs font-mono font-bold uppercase border transition-all ${
                    selectedStorage === st
                      ? 'bg-[#0A0A0A] text-[#C0FF00] border-[#0A0A0A]'
                      : 'bg-[#FDFCF9] text-black/70 border-black/10 hover:border-black'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase font-bold text-black/50 tracking-wider">
                3. Color Finish
              </label>
              <span className="text-xs font-mono text-black/70 font-semibold">
                {selectedColor || product.color}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: 'Natural Titanium', hex: '#888580' },
                { name: 'Midnight Black', hex: '#1c1e21' },
                { name: 'Starlight Silver', hex: '#e3e4e5' },
                { name: 'Deep Blue', hex: '#263445' },
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-none border text-xs font-mono font-semibold transition-all ${
                    (selectedColor || product.color) === c.name
                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-[#C0FF00]'
                      : 'border-black/15 bg-white text-[#0A0A0A] hover:border-black'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-none border border-black/20 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] truncate max-w-[90px]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart & Buy Now Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 rounded-none font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 border border-black ${
                addedAnimation
                  ? 'bg-[#C0FF00] text-[#0A0A0A]'
                  : 'bg-[#0A0A0A] text-[#C0FF00] hover:bg-black'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · {formatBDT(dynamicPrice)}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
              className="w-full py-3.5 px-6 rounded-none bg-[#C0FF00] hover:bg-white text-[#0A0A0A] font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-black"
            >
              <Zap className="w-4 h-4" />
              <span>Instant Checkout (bKash / COD)</span>
            </button>
          </div>

          {/* Re:Phone Trust Card for Bangladesh */}
          <div className="p-5 rounded-none bg-[#FDFCF9] border border-black/10 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold font-display uppercase tracking-wider text-[#0A0A0A]">12-Month Replacement Warranty</span>
                <p className="text-black/60 mt-0.5 text-[11px]">
                  Hardware fault repairs & battery coverage honored at our Dhaka inspection labs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold font-display uppercase tracking-wider text-[#0A0A0A]">7-Day No-Questions Return Policy</span>
                <p className="text-black/60 mt-0.5 text-[11px]">
                  Full refund or model exchange if device cosmetics or ergonomics don't delight you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold font-display uppercase tracking-wider text-[#0A0A0A]">Express Delivery in 64 BD Districts</span>
                <p className="text-black/60 mt-0.5 text-[11px]">
                  Dhaka same-day / 24-hr delivery; outside Dhaka in 48-72 hrs with live parcel tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Certified Merchant Profile */}
          <div className="p-4 rounded-none bg-[#FDFCF9] border border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#0A0A0A] text-[#C0FF00] flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#0A0A0A] font-mono uppercase">{product.seller.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-black/50 mt-0.5">
                  <span>{product.seller.location}</span>
                  <span>•</span>
                  <span className="font-bold text-[#0A0A0A]">{product.seller.rating} ★</span>
                  <span>•</span>
                  <span>{product.seller.salesCount}+ phones sold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS FOR DEEP-DIVE: Overview, Specs, 30-Point Inspection, Verified Reviews */}
      <div className="mt-20 border-t border-black/10 pt-10">
        <div className="flex items-center gap-2 border-b border-black/10 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Device Overview' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'inspection', label: '30-Point Diagnostic Report' },
            { id: 'reviews', label: `Customer Reviews (${product.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#0A0A0A] text-[#C0FF00]'
                  : 'text-black/60 hover:text-black hover:bg-[#F5F4F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Overview */}
        {activeTab === 'overview' && (
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-black text-[#0A0A0A] tracking-tight uppercase">
                Engineered for Peak Performance
              </h3>
              <p className="text-sm text-black/70 leading-relaxed">
                {product.model} delivers world-class computational speed, cinematic camera sensors, and all-day battery efficiency. When certified by RE:PHONE, every internal sensor is individually tested to meet factory performance levels without compromise.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
                <div className="p-3 bg-[#F5F4F0] rounded-none border border-black/10">
                  <span className="text-[10px] text-black/50 uppercase block">Operating System</span>
                  <span className="text-xs font-bold text-[#0A0A0A]">{product.specs.os}</span>
                </div>
                <div className="p-3 bg-[#F5F4F0] rounded-none border border-black/10">
                  <span className="text-[10px] text-black/50 uppercase block">Network Lock</span>
                  <span className="text-xs font-bold text-[#0A0A0A]">100% Factory Unlocked</span>
                </div>
              </div>
            </div>
            <div className="bg-[#FDFCF9] p-6 rounded-none border border-black/10 font-mono">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A0A0A] mb-3">Certified Inspection Outcome</h4>
              <p className="text-xs text-black/70 mb-4">{product.inspectionNotes}</p>
              <div className="text-[11px] text-black/50 flex items-center justify-between border-t border-black/10 pt-3">
                <span>Lab Test Date: {product.inspectionDate}</span>
                <span className="text-[#0A0A0A] bg-[#C0FF00] px-2 py-0.5 font-bold">STATUS: PASSED</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Technical Specifications */}
        {activeTab === 'specs' && (
          <div className="py-8 max-w-4xl">
            <h3 className="text-xl font-display font-black text-[#0A0A0A] uppercase tracking-wider mb-6">
              Complete Hardware Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FDFCF9] rounded-none border border-black/10 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-black/50 block">Display</span>
                  <span className="text-sm font-semibold text-[#0A0A0A]">{product.specs.display}</span>
                </div>
              </div>
              <div className="p-4 bg-[#FDFCF9] rounded-none border border-black/10 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-black/50 block">Processor</span>
                  <span className="text-sm font-semibold text-[#0A0A0A]">{product.specs.processor}</span>
                </div>
              </div>
              <div className="p-4 bg-[#FDFCF9] rounded-none border border-black/10 flex items-start gap-3">
                <Camera className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-black/50 block">Camera Array</span>
                  <span className="text-sm font-semibold text-[#0A0A0A]">{product.specs.camera}</span>
                </div>
              </div>
              <div className="p-4 bg-[#FDFCF9] rounded-none border border-black/10 flex items-start gap-3">
                <Battery className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-black/50 block">Battery Spec</span>
                  <span className="text-sm font-semibold text-[#0A0A0A]">{product.specs.battery}</span>
                </div>
              </div>
              <div className="p-4 bg-[#FDFCF9] rounded-none border border-black/10 flex items-start gap-3">
                <Wifi className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-black/50 block">Connectivity</span>
                  <span className="text-sm font-semibold text-[#0A0A0A]">{product.specs.network}</span>
                </div>
              </div>
              <div className="p-4 bg-[#FDFCF9] rounded-none border border-black/10 flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#0A0A0A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-black/50 block">OS & Updates</span>
                  <span className="text-sm font-semibold text-[#0A0A0A]">{product.specs.os}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: 30-Point Diagnostic Report */}
        {activeTab === 'inspection' && (
          <div className="py-8 max-w-4xl space-y-6">
            <div className="p-6 bg-[#0A0A0A] text-white rounded-none border border-black">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-[#C0FF00] uppercase font-bold tracking-wider">
                    Official Hardware Certification
                  </span>
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                    Dhaka Engineering Center Diagnostic Summary
                  </h3>
                </div>
                <span className="px-3 py-1 bg-white/10 text-[#C0FF00] border border-[#C0FF00]/40 rounded-none text-xs font-mono font-bold">
                  30/30 PASSED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-neutral-300 font-mono">
                {[
                  'Display Multi-Touch Grid',
                  'Digitizer Dead-Pixel Scan',
                  'TrueTone Calibration',
                  'Battery Thermal Dissipation',
                  'Battery Charging Cycle Curve',
                  'Face ID / Fingerprint Biometrics',
                  'Logic Board Solder Continuity',
                  'Liquid Ingress Contact Indicator',
                  '5G / 4G Sub-6 Antenna Reception',
                  'Wi-Fi 6E & Bluetooth Range',
                  'Microphone Stereo Array',
                  'Earpiece & Loudspeaker Acoustics',
                  'Camera Autofocus Actuator',
                  'Sensor-Shift OIS Gyroscope',
                  'Flash & LiDAR Sensor',
                  'Proximity & Ambient Light Sensor',
                  'Accelerometer & Gyroscope',
                  'Vibration Taptic Engine',
                  'NFC Transit & Apple Pay / G-Pay',
                  'Qi Wireless Charging Induction',
                  'USB-C Port Pin Integrity',
                  'SIM Card Tray Contact Gasket',
                  'Torsional Chassis Rigidity',
                  'BTRC / IMEI Global Blacklist',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-900 border border-neutral-800 rounded-none">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C0FF00] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-8 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-black text-[#0A0A0A] uppercase tracking-wider">
                  Verified Owner Feedback
                </h3>
                <p className="text-xs font-mono text-black/50">
                  All reviews from authenticated buyers in Bangladesh with verified IMEIs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-black text-black" />
                <span className="font-display font-black text-2xl text-[#0A0A0A]">
                  {product.rating}
                </span>
                <span className="text-xs font-mono text-black/50">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  author: 'Tanvir Hossain',
                  location: 'Dhanmondi, Dhaka',
                  rating: 5,
                  condition: 'Excellent',
                  date: '3 days ago',
                  comment:
                    'Bought this expecting some scratches, but honestly it looks indistinguishable from new! Battery came at 95% health as promised. Delivery arrived within 24 hours to Dhanmondi. Super impressed.',
                },
                {
                  author: 'Farhana Akter',
                  location: 'Uttara, Dhaka',
                  rating: 5,
                  condition: 'Like New',
                  date: '1 week ago',
                  comment:
                    'Checked the IMEI on BTRC portal immediately and it was 100% authentic and white-listed. Saved over ৳45,000 compared to Jamuna Future Park shops. Will definitely buy my next upgrade from RE:PHONE.',
                },
                {
                  author: 'Nafis Chowdhury',
                  location: 'Chittagong GEC',
                  rating: 4,
                  condition: 'Good',
                  date: '2 weeks ago',
                  comment:
                    'Chose the "Good" grade for budget reasons. Has a tiny rub on the bottom corner that disappeared as soon as I put a case on. Everything works flawlessly, 120Hz display is buttery smooth.',
                },
              ].map((rev, idx) => (
                <div key={idx} className="p-6 bg-[#FDFCF9] rounded-none border border-black/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0A0A0A] font-mono">{rev.author}</span>
                        <span className="text-[10px] bg-[#C0FF00] text-[#0A0A0A] font-bold px-1.5 py-0.5 font-mono uppercase">
                          Verified Buyer
                        </span>
                        <span className="text-[10px] font-mono text-black/50">
                          Grade: {rev.condition}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-black/50">{rev.location}</span>
                    </div>

                    <div className="flex items-center text-black">
                      {[...Array(rev.rating)].map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-black/75 leading-relaxed">{rev.comment}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-black/50">
                    <span>{rev.date}</span>
                    <button type="button" className="flex items-center gap-1 hover:text-black">
                      <ThumbsUp className="w-3 h-3" /> Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
