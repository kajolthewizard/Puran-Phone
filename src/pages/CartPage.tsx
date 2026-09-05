import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Tag,
  Check,
  Smartphone,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatBDT } from '../services/storeService';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalAmount, totalSavings, totalItemCount } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'REPHONE1000' || code === 'DHAKA500') {
      const discount = code === 'REPHONE1000' ? 1000 : 500;
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid coupon code. Try REPHONE1000 or DHAKA500');
    }
  };

  const finalTotal = Math.max(0, totalAmount - promoDiscount);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center">
        <div className="w-16 h-16 bg-[#F5F4F0] border border-black/10 rounded-none flex items-center justify-center mb-4 text-[#0A0A0A]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-display font-black text-[#0A0A0A] tracking-tight uppercase">Your Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-black/60 mt-2 max-w-sm leading-relaxed font-mono">
          You haven't added any verified refurbished smartphones yet. Explore our inspected devices with 12-month Dhaka warranty.
        </p>
        <Link
          to="/phones"
          className="mt-6 px-8 py-3.5 rounded-none bg-[#0A0A0A] hover:bg-black text-[#C0FF00] border border-black text-xs font-display font-bold uppercase tracking-wider transition-colors"
        >
          Explore Refurbished Phones
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-black/10 mb-8">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-black/50 mb-1 uppercase">
            SHOPPING BAG ({totalItemCount} {totalItemCount === 1 ? 'DEVICE' : 'DEVICES'})
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A0A0A] tracking-tight uppercase">
            Review Your Bag
          </h1>
        </div>
        <Link
          to="/phones"
          className="text-xs font-mono font-bold uppercase tracking-wider text-black/70 hover:text-black hidden sm:inline"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Free Delivery Bar in Bangladesh */}
      <div className="mb-8 p-3.5 rounded-none bg-[#F5F4F0] border border-black/10 flex items-center justify-between text-xs text-[#0A0A0A] font-mono">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#0A0A0A]" />
          <span>
            {totalAmount >= 25000
              ? 'You unlocked FREE Express Doorstep Delivery in Dhaka & nationwide!'
              : 'Add devices over ৳25,000 for FREE express courier across Bangladesh.'}
          </span>
        </div>
        <span className="font-bold text-[#0A0A0A] bg-[#C0FF00] px-2 py-0.5 hidden sm:inline">100% INSURED</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-none bg-[#FDFCF9] border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-black/30"
            >
              <div className="flex items-center gap-4">
                <Link
                  to={`/phones/${item.product.slug}`}
                  className="w-20 h-20 rounded-none bg-[#F5F4F0] p-2 flex items-center justify-center shrink-0 border border-black/10"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.model}
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-black/50">
                      {item.product.brand}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold font-mono uppercase">
                      {item.product.condition}
                    </span>
                  </div>

                  <Link
                    to={`/phones/${item.product.slug}`}
                    className="font-display font-bold text-[#0A0A0A] text-base hover:underline block"
                  >
                    {item.product.model}
                  </Link>

                  <div className="flex items-center gap-2 text-xs font-mono text-black/50 mt-1">
                    <span>{item.product.storage}</span>
                    <span>•</span>
                    <span>{item.product.color}</span>
                    <span>•</span>
                    <span className="text-[#0A0A0A] font-bold">
                      {item.product.batteryHealth}% Battery
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-black/50 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />
                    <span>12-Mo Warranty Included</span>
                  </div>
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-black/10 font-mono">
                {/* Quantity modifier */}
                <div className="flex items-center border border-black/20 rounded-none p-1 bg-[#F5F4F0]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-none flex items-center justify-center text-black/70 hover:bg-[#eae8e2]"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#0A0A0A]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-none flex items-center justify-center text-black/70 hover:bg-[#eae8e2]"
                    title="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="font-display font-black text-base text-[#0A0A0A]">
                    {formatBDT(item.product.currentPrice * item.quantity)}
                  </div>
                  <div className="text-[10px] text-[#0A0A0A] bg-[#C0FF00] px-1 font-bold inline-block">
                    Save {formatBDT((item.product.originalPrice - item.product.currentPrice) * item.quantity)}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-black/40 hover:text-rose-600 rounded-none transition-colors"
                  title="Remove device"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Environmental Savings Summary */}
          <div className="p-5 rounded-none bg-[#0A0A0A] text-white border border-black flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#C0FF00] shrink-0" />
              <div>
                <span className="font-display font-bold uppercase tracking-wider text-white block">Environmental Impact of This Order</span>
                <span className="text-white/60 font-mono text-[11px]">
                  You are diverting ~{(items.length * 195).toFixed(0)}g of electronic waste and saving ~{(items.length * 79).toFixed(0)}kg CO₂ emissions.
                </span>
              </div>
            </div>
            <span className="text-[#0A0A0A] bg-[#C0FF00] font-mono font-bold px-2 py-1 text-[10px] shrink-0 hidden sm:inline uppercase tracking-widest">
              CIRCULAR ECONOMY
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 bg-[#FDFCF9] rounded-none border border-black/10 p-6 space-y-6 sticky top-24">
          <h3 className="font-display font-black text-lg text-[#0A0A0A] uppercase tracking-wider pb-3 border-b border-black/10">
            Order Summary
          </h3>

          {/* Line items */}
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-black/70">
              <span>Subtotal ({totalItemCount} items)</span>
              <span className="font-bold text-[#0A0A0A]">{formatBDT(totalAmount)}</span>
            </div>

            <div className="flex justify-between text-black font-bold">
              <span>Refurbished Savings</span>
              <span className="bg-[#C0FF00] px-1">- {formatBDT(totalSavings)}</span>
            </div>

            <div className="flex justify-between text-black/70">
              <span>Standard Delivery</span>
              <span className="font-bold text-[#0A0A0A]">
                {totalAmount >= 25000 ? 'FREE' : '৳120'}
              </span>
            </div>

            {promoApplied && (
              <div className="flex justify-between text-black font-bold">
                <span>Promo Discount ({promoCode.toUpperCase()})</span>
                <span>- {formatBDT(promoDiscount)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-black/10 flex justify-between items-baseline">
              <span className="text-xs uppercase font-bold text-black/50">Total Payable</span>
              <span className="text-2xl font-display font-black text-[#0A0A0A]">
                {formatBDT(finalTotal)}
              </span>
            </div>
          </div>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyPromo} className="pt-2 border-t border-black/10 font-mono">
            <label className="text-[10px] uppercase font-bold text-black/50 block mb-1.5 tracking-wider">
              Promo or Voucher Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try REPHONE1000"
                className="flex-1 bg-[#F5F4F0] border border-black/15 rounded-none px-3 py-2 text-xs font-bold uppercase text-[#0A0A0A] outline-none focus:border-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0A0A0A] text-[#C0FF00] rounded-none text-xs font-bold uppercase hover:bg-black transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <div className="text-[10px] text-[#0A0A0A] font-bold mt-1 flex items-center gap-1 bg-[#C0FF00] p-1">
                <Check className="w-3 h-3" /> Coupon applied! ৳{promoDiscount} discount added.
              </div>
            )}
            {promoError && (
              <div className="text-[10px] text-rose-600 font-bold mt-1">{promoError}</div>
            )}
          </form>

          {/* Checkout CTA */}
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-none bg-[#C0FF00] hover:bg-white text-[#0A0A0A] font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-black"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Guarantees */}
          <div className="pt-3 border-t border-black/10 space-y-2 text-[11px] text-black/60 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>12-Month Replacement Warranty included</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>7-Day No-Questions Return Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>bKash, Nagad & Cash on Delivery accepted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
