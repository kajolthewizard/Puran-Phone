import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight,
  Check,
  Smartphone,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StoreService, formatBDT } from '../services/storeService';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState(user?.name || 'Rafiqul Islam');
  const [phone, setPhone] = useState(user?.phone || '01711223344');
  const [email, setEmail] = useState(user?.email || 'rafiqul@gmail.com');
  const [district, setDistrict] = useState('Dhaka');
  const [city, setCity] = useState('Dhanmondi, Dhaka');
  const [address, setAddress] = useState('House 42, Road 9/A, Dhanmondi');
  const [postalCode, setPostalCode] = useState('1209');

  // Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'cod'>('bkash');
  const [bkashNumber, setBkashNumber] = useState('01711223344');
  const [bkashTrxId, setBkashTrxId] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const shippingCost = shippingMethod === 'express' ? 250 : totalAmount >= 25000 ? 0 : 120;
  const orderTotal = totalAmount + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `RP-BD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        orderNumber: orderId,
        date: new Date().toISOString(),
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          extendedWarranty: false,
        })),
        subtotal: totalAmount,
        discount: 0,
        shippingFee: shippingCost,
        total: orderTotal,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        shippingAddress: {
          fullName,
          phone,
          division: district,
          city: district,
          area: city,
          addressLine: address,
        },
        status: 'Processing',
        timeline: [
          { status: 'Ordered', date: 'Just now', description: 'Order received & verified', completed: true, current: true },
          { status: 'Inspected', date: 'Pending', description: 'Pre-dispatch check in Dhaka hub', completed: false },
          { status: 'Shipped', date: 'Pending', description: 'Handed to courier', completed: false },
          { status: 'Out for Delivery', date: 'Pending', description: 'Courier on the way', completed: false },
          { status: 'Delivered', date: 'Pending', description: 'Received by customer', completed: false },
        ],
        trackingNumber: `BDEXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        warrantyExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      StoreService.createOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setCreatedOrder(newOrder);
    }, 1200);
  };

  // If order is completed, show the high-trust Order Confirmation screen
  if (createdOrder) {
    return (
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFCF9] rounded-none border border-black p-8 sm:p-12 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#C0FF00] text-[#0A0A0A] border border-black rounded-none flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C0FF00] bg-[#0A0A0A] px-3 py-1 rounded-none">
              ORDER CONFIRMED & PACKED
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A0A0A] tracking-tight uppercase mt-4">
              Thank you, {fullName.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-black/60 font-mono mt-1">
              Your refurbished flagship is being pre-cleared at our Dhaka diagnostic hub.
            </p>
          </div>

          {/* Tracking Bar Box */}
          <div className="bg-[#F5F4F0] border border-black/10 rounded-none p-5 text-left text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="text-black/50 uppercase tracking-wider text-[10px]">Order Reference:</span>
              <span className="font-bold text-[#0A0A0A]">{createdOrder.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="text-black/50 uppercase tracking-wider text-[10px]">Courier Tracking ID:</span>
              <span className="font-bold text-[#0A0A0A] bg-[#C0FF00] px-1.5 py-0.5">{createdOrder.trackingNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="text-black/50 uppercase tracking-wider text-[10px]">Delivery Address:</span>
              <span className="font-medium text-[#0A0A0A] text-right truncate max-w-[240px]">
                {createdOrder.shippingAddress.addressLine}, {createdOrder.shippingAddress.city}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="text-black/50 uppercase tracking-wider text-[10px]">Payment Channel:</span>
              <span className="font-bold text-[#0A0A0A] uppercase">
                {createdOrder.paymentMethod} ({createdOrder.paymentStatus})
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="font-bold uppercase text-[11px] text-black/60">Total Amount:</span>
              <span className="font-display font-black text-[#0A0A0A] text-xl">
                {formatBDT(createdOrder.total)}
              </span>
            </div>
          </div>

          {/* Device List In Order */}
          <div className="space-y-2 text-left font-mono">
            <span className="text-[10px] uppercase font-bold text-black/50 tracking-wider block">
              Purchased Devices ({createdOrder.items.length})
            </span>
            {createdOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#F5F4F0] rounded-none border border-black/10 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.model}
                    className="w-10 h-10 object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-display font-bold text-[#0A0A0A] block">{item.product.model}</span>
                    <span className="text-black/50 text-[10px]">
                      {item.product.storage} · {item.product.condition} · {item.product.color}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-[#0A0A0A]">
                  {formatBDT(item.product.currentPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Next Action Links */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/account"
              className="w-full sm:w-auto px-6 py-3 rounded-none bg-[#0A0A0A] hover:bg-black text-[#C0FF00] border border-black text-xs font-display font-bold uppercase tracking-wider"
            >
              Track Order Status
            </Link>
            <Link
              to="/phones"
              className="w-full sm:w-auto px-6 py-3 rounded-none border border-black text-[#0A0A0A] hover:bg-[#F5F4F0] text-xs font-display font-bold uppercase tracking-wider"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If no items in cart, redirect back to cart
  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center pt-24 text-center px-4 font-mono">
        <p className="text-black/60 mb-4 text-sm">No devices in cart to checkout.</p>
        <Link to="/phones" className="px-6 py-2.5 bg-[#0A0A0A] text-[#C0FF00] border border-black rounded-none text-xs font-bold uppercase">
          Browse Phones
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-6 border-b border-black/10 mb-8 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-black/50 mb-1 flex items-center gap-1.5 uppercase">
            <Lock className="w-3 h-3 text-[#0A0A0A]" />
            <span>256-BIT ENCRYPTED CHECKOUT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A0A0A] tracking-tight uppercase">
            Checkout & Delivery
          </h1>
        </div>
        <Link to="/cart" className="text-xs font-mono font-bold uppercase tracking-wider text-black/60 hover:text-black">
          ← Back to Bag
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact & Shipping Address */}
          <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#0A0A0A] uppercase tracking-wider pb-2 border-b border-black/10 flex items-center gap-2">
              <span>1. Customer & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div>
                <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                  Contact Phone (for Courier OTP)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="font-mono">
              <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div>
                <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
                >
                  {[
                    'Dhaka',
                    'Chittagong',
                    'Sylhet',
                    'Rajshahi',
                    'Khulna',
                    'Barisal',
                    'Rangpur',
                    'Mymensingh',
                    'Gazipur',
                    'Narayanganj',
                    'Comilla',
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Area / Thana</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhanmondi, Gulshan, Uttara"
                  className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="font-mono">
              <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                Detailed Street Address
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Block/Sector, Landmark"
                className="w-full bg-[#F5F4F0] border border-black/15 rounded-none p-3 text-xs font-medium text-[#0A0A0A] outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Section 2: Delivery Speed */}
          <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 space-y-3 font-mono">
            <h3 className="font-display font-bold text-base text-[#0A0A0A] uppercase tracking-wider pb-2 border-b border-black/10">
              2. Shipping Speed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShippingMethod('standard')}
                className={`p-4 rounded-none border text-left transition-all ${
                  shippingMethod === 'standard'
                    ? 'bg-[#0A0A0A] text-white border-black'
                    : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                }`}
              >
                <div className="flex justify-between items-center font-bold text-xs">
                  <span>Standard Insured Courier</span>
                  <span className={shippingMethod === 'standard' ? 'text-[#C0FF00]' : 'text-[#0A0A0A]'}>
                    {totalAmount >= 25000 ? 'FREE' : '৳120'}
                  </span>
                </div>
                <p
                  className={`text-[10px] mt-1 ${
                    shippingMethod === 'standard' ? 'text-white/60' : 'text-black/50'
                  }`}
                >
                  Delivery in 24-48 hours with live SMS tracking
                </p>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod('express')}
                className={`p-4 rounded-none border text-left transition-all ${
                  shippingMethod === 'express'
                    ? 'bg-[#0A0A0A] text-white border-black'
                    : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                }`}
              >
                <div className="flex justify-between items-center font-bold text-xs">
                  <span>Dhaka Same-Day Express</span>
                  <span className={shippingMethod === 'express' ? 'text-[#C0FF00]' : 'text-[#0A0A0A]'}>৳250</span>
                </div>
                <p
                  className={`text-[10px] mt-1 ${
                    shippingMethod === 'express' ? 'text-white/60' : 'text-black/50'
                  }`}
                >
                  Guaranteed delivery within 6 hours inside Dhaka city
                </p>
              </button>
            </div>
          </div>

          {/* Section 3: Bangladesh Payment Gateway */}
          <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 space-y-4 font-mono">
            <h3 className="font-display font-bold text-base text-[#0A0A0A] uppercase tracking-wider pb-2 border-b border-black/10">
              3. Payment Channel
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bkash', label: 'bKash', note: 'Direct Mobile Wallet' },
                { id: 'nagad', label: 'Nagad', note: 'Direct Mobile Wallet' },
                { id: 'card', label: 'Cards / SSL', note: 'Visa / Mastercard' },
                { id: 'cod', label: 'Cash on Delivery', note: 'Pay at Doorstep' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-none border text-left transition-all ${
                    paymentMethod === m.id
                      ? 'bg-[#0A0A0A] text-white border-black'
                      : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                  }`}
                >
                  <div className="font-bold text-xs">{m.label}</div>
                  <div
                    className={`text-[9px] mt-0.5 uppercase ${
                      paymentMethod === m.id ? 'text-[#C0FF00]' : 'text-black/50'
                    }`}
                  >
                    {m.note}
                  </div>
                </button>
              ))}
            </div>

            {/* bKash Specific Simulator Box */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 rounded-none bg-[#F5F4F0] border border-black/15 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#0A0A0A] font-bold">
                  <span className="uppercase text-[10px] tracking-wider">bKash Merchant Payment Gateway</span>
                  <span className="text-[10px] bg-[#0A0A0A] text-[#C0FF00] px-1.5 py-0.5">Merchant: REPHONE BD</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-black/60 uppercase font-bold block mb-1">
                      Your bKash Number
                    </label>
                    <input
                      type="text"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="w-full bg-white border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-black/60 uppercase font-bold block mb-1">
                      bKash Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9J8A7B2X"
                      value={bkashTrxId}
                      onChange={(e) => setBkashTrxId(e.target.value)}
                      className="w-full bg-white border border-black/15 rounded-none px-3 py-2 text-xs font-semibold text-[#0A0A0A] uppercase"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-black/60">
                  Clicking "Place Order" will securely simulate verification with the bKash API.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 bg-[#FDFCF9] rounded-none border border-black/10 p-6 space-y-6 sticky top-24">
          <h3 className="font-display font-black text-lg text-[#0A0A0A] uppercase tracking-wider pb-3 border-b border-black/10">
            Order Review ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h3>

          {/* Mini items list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 font-mono">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.model}
                    className="w-12 h-12 object-contain mix-blend-multiply bg-[#F5F4F0] border border-black/10 rounded-none p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-display font-bold text-[#0A0A0A] block">{item.product.model}</span>
                    <span className="text-[10px] text-black/50">
                      Qty: {item.quantity} · {item.product.storage} · {item.product.condition}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-[#0A0A0A]">
                  {formatBDT(item.product.currentPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculation */}
          <div className="space-y-2 pt-4 border-t border-black/10 text-xs text-black/70 font-mono">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#0A0A0A]">{formatBDT(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold">
                {shippingCost === 0 ? <span className="text-[#0A0A0A] bg-[#C0FF00] px-1">FREE</span> : formatBDT(shippingCost)}
              </span>
            </div>
            <div className="pt-2 border-t border-black/10 flex justify-between items-baseline text-sm font-bold text-[#0A0A0A]">
              <span className="uppercase text-[11px] text-black/50">Total Payable</span>
              <span className="text-2xl font-display font-black text-[#0A0A0A]">
                {formatBDT(orderTotal)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-none bg-[#C0FF00] hover:bg-white text-[#0A0A0A] font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-black disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Verifying & Packing Device...</span>
            ) : (
              <>
                <span>Confirm Order · {formatBDT(orderTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Trust points */}
          <div className="pt-3 border-t border-black/10 space-y-2 text-[11px] text-black/60 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>12-Month Replacement Warranty certificate generated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0A0A0A]" />
              <span>BTRC IMEI verification record included in box</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
