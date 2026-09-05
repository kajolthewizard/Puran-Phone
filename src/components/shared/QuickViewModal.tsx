import React from 'react';
import { Link } from 'react-router-dom';
import { X, Battery, ShieldCheck, Star, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatBDT } from '../../services/storeService';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-[#FDFCF9] rounded-none shadow-2xl border border-black overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-none bg-[#F5F4F0] border border-black/10 text-black hover:bg-[#0A0A0A] hover:text-[#C0FF00] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image Stage */}
        <div className="w-full md:w-1/2 bg-[#F5F4F0] p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-black/10">
          <img
            src={product.images[0]}
            alt={product.model}
            className="max-h-72 w-auto object-contain mix-blend-multiply drop-shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-black/60 font-mono uppercase tracking-wider">
            <span>IMEI: Verified</span>
            <span className="text-[#0A0A0A] font-bold bg-[#C0FF00] px-1.5 py-0.5">{product.batteryHealth}% Battery</span>
          </div>
        </div>

        {/* Right Column: Key Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-black/50 tracking-wider">{product.brand}</span>
              <span className="text-[10px] px-2 py-0.5 bg-[#0A0A0A] text-[#C0FF00] font-bold font-mono uppercase tracking-wider">
                {product.condition}
              </span>
            </div>

            <h3 className="text-2xl font-display font-black text-[#0A0A0A] tracking-tight">{product.model}</h3>

            <div className="flex items-center gap-2 mt-1 text-xs font-mono text-black/60">
              <span>{product.storage}</span>
              <span>•</span>
              <span>{product.color}</span>
              <span>•</span>
              <div className="flex items-center text-black">
                <Star className="w-3.5 h-3.5 fill-black" />
                <span className="font-bold text-[#0A0A0A] ml-1">{product.rating}</span>
                <span className="text-black/40 ml-0.5">({product.reviewCount})</span>
              </div>
            </div>

            {/* Condition Description */}
            <p className="text-xs text-black/70 mt-3 p-3 bg-[#F5F4F0] rounded-none border border-black/10 leading-relaxed font-mono">
              {product.conditionDescription}
            </p>

            {/* Transparent Savings Breakdown */}
            <div className="mt-4 p-4 bg-[#FDFCF9] rounded-none border border-black/10">
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-[10px] uppercase font-bold text-black/50 tracking-wider">RE:PHONE Price:</span>
                <span className="text-2xl font-display font-black text-[#0A0A0A]">
                  {formatBDT(product.currentPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1 font-mono text-black/50">
                <span>Original New:</span>
                <span className="line-through">{formatBDT(product.originalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1 font-mono text-[#0A0A0A] font-bold">
                <span>You Save:</span>
                <span className="bg-[#C0FF00] px-1.5 py-0.5 text-[#0A0A0A]">
                  {formatBDT(product.originalPrice - product.currentPrice)} ({product.savingsPercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-black/10 flex items-center gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 py-3 px-4 rounded-none text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-black ${
                added
                  ? 'bg-[#C0FF00] text-[#0A0A0A]'
                  : 'bg-[#0A0A0A] text-[#C0FF00] hover:bg-black'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            <Link
              to={`/phones/${product.slug}`}
              onClick={onClose}
              className="py-3 px-4 rounded-none border border-black hover:bg-[#F5F4F0] text-[#0A0A0A] text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>3D View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
