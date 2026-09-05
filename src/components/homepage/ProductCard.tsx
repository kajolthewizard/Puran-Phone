import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Battery, ShieldCheck, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatBDT } from '../../services/storeService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Condition badge color styling
  const conditionBadgeStyles = {
    'Like New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Excellent: 'bg-lime-100 text-lime-900 border-lime-300',
    Good: 'bg-blue-50 text-blue-800 border-blue-200',
    Fair: 'bg-amber-50 text-amber-800 border-amber-200',
    Damaged: 'bg-rose-50 text-rose-800 border-rose-200',
  }[product.condition];

  return (
    <div className="group relative bg-[#FDFCF9] border border-black/10 hover:border-black/30 transition-all duration-200 flex flex-col justify-between overflow-hidden rounded-none">
      {/* Top Bar: Condition & Wishlist Button */}
      <div className="p-4 pb-0 flex items-center justify-between z-10">
        <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 bg-[#C0FF00] text-[#0A0A0A] uppercase tracking-widest rounded-none border border-black/10">
          {product.condition}
        </span>

        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`p-2 rounded-none border transition-all ${
            isFavorited
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-black/10 text-black/50 hover:text-black hover:border-black/30'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Main Image Stage */}
      <Link
        to={`/phones/${product.slug}`}
        className="relative mx-4 my-3 bg-[#F5F4F0] border border-black/5 flex items-center justify-center h-52 overflow-hidden"
      >
        <img
          src={product.images[0]}
          alt={`${product.brand} ${product.model}`}
          className="max-h-44 w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Floating Quick Action Overlay on desktop hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2 inset-x-6 py-2 bg-[#0A0A0A] text-[#C0FF00] text-xs font-bold font-mono uppercase tracking-wider rounded-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-sm hover:bg-black"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick Inspect
          </button>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 pt-1 border-t border-black/5 flex flex-col flex-1 justify-between bg-[#FDFCF9]">
        <div>
          {/* Brand & Model */}
          <div className="flex items-center justify-between text-xs text-black/50 mb-1">
            <span className="font-mono font-medium uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 text-[#0A0A0A]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-xs">{product.rating}</span>
              <span className="text-[10px] text-black/40">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/phones/${product.slug}`}>
            <h3 className="font-display font-extrabold text-[#0A0A0A] text-base group-hover:underline line-clamp-1 tracking-tight">
              {product.model}
            </h3>
          </Link>

          {/* Specs Pill List */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-black/60">
            <span className="font-mono font-semibold bg-[#F5F4F0] px-2 py-0.5 rounded-none text-[11px] border border-black/5">
              {product.storage}
            </span>
            <span className="text-black/30">•</span>
            <span className="truncate max-w-[110px] text-black/60 text-[11px]">
              {product.color}
            </span>
          </div>

          {/* Battery Health & Inspection Bar */}
          <div className="mt-3 flex items-center justify-between p-2 rounded-none bg-[#F5F4F0] border border-black/5 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-[#0A0A0A] font-mono">
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.batteryHealth}% Battery</span>
            </div>
            <div className="flex items-center gap-1 text-black/50 font-mono text-[10px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>30-pt passed</span>
            </div>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-xl text-[#0A0A0A]">
                {formatBDT(product.currentPrice)}
              </span>
              <span className="text-xs text-black/40 line-through font-mono">
                {formatBDT(product.originalPrice)}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#C0FF00] bg-[#0A0A0A] px-2 py-0.5 rounded-none inline-block mt-1">
              Save {product.savingsPercentage}%
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`p-3 rounded-none transition-all duration-200 flex items-center justify-center ${
              addedAnimation
                ? 'bg-[#C0FF00] text-[#0A0A0A]'
                : 'bg-[#0A0A0A] text-white hover:bg-black active:scale-95'
            }`}
            title="Add to cart"
          >
            {addedAnimation ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
