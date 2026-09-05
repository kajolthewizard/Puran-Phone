import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  Shield,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { StoreService, formatBDT } from '../services/storeService';
import { Order, Product } from '../types';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';
  const [orders, setOrders] = useState<Order[]>([]);
  const [claimSubmitted, setClaimSubmitted] = useState<string | null>(null);

  useEffect(() => {
    setOrders(StoreService.getOrders());
  }, []);

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleClaimWarranty = (orderId: string) => {
    setClaimSubmitted(orderId);
    setTimeout(() => setClaimSubmitted(null), 3500);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header Card */}
      <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-none bg-[#0A0A0A] text-[#C0FF00] border border-black flex items-center justify-center font-display font-black text-2xl">
            {user?.name.charAt(0) || 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-black text-[#0A0A0A] uppercase">{user?.name}</h1>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-none bg-[#0A0A0A] text-[#C0FF00]">
                {user?.role}
              </span>
            </div>
            <p className="text-xs font-mono text-black/60 mt-0.5">{user?.email} · {user?.phone}</p>
            <div className="flex items-center gap-2 text-xs text-black/60 mt-2 font-mono">
              <MapPin className="w-3.5 h-3.5 text-black/40" />
              <span>Dhanmondi, Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Quick Hub Indicator */}
        <div className="flex items-center gap-4 bg-[#F5F4F0] p-3 rounded-none border border-black/10 text-xs font-mono">
          <div>
            <span className="text-[10px] text-black/40 uppercase block">Preferred Lab Hub</span>
            <span className="font-bold text-[#0A0A0A]">Motaleb Plaza, Hatirpool</span>
          </div>
          <div className="h-6 w-px bg-black/10" />
          <div>
            <span className="text-[10px] text-black/40 uppercase block">Active Warranties</span>
            <span className="font-bold text-[#0A0A0A] bg-[#C0FF00] px-1">{orders.length} Phones</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-4 mb-8 overflow-x-auto font-mono">
        {[
          { id: 'orders', label: 'My Orders & Tracking', icon: Package },
          { id: 'warranty', label: '12-Month Warranty Hub', icon: Shield },
          { id: 'wishlist', label: `Saved Wishlist (${wishlistItems.length})`, icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                  : 'text-black/60 border-transparent hover:text-black hover:bg-[#F5F4F0]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-12 text-center font-mono">
              <Package className="w-12 h-12 text-black/30 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-[#0A0A0A] uppercase">No orders yet</h3>
              <p className="text-xs text-black/50 mt-1">
                Your purchased phones and delivery status will appear here.
              </p>
              <Link
                to="/phones"
                className="mt-4 inline-block px-6 py-2.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] border border-black text-xs font-bold uppercase"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 sm:p-8 space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0A0A0A] text-sm">
                      {order.orderNumber || order.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-none bg-[#C0FF00] text-[#0A0A0A] font-bold border border-black text-[10px] uppercase">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-black/60 text-[11px]">
                    <span>Placed: {new Date(order.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-bold text-[#0A0A0A]">Total: {formatBDT(order.total)}</span>
                  </div>
                </div>

                {/* 5-Step Fulfillment Timeline */}
                <div className="p-4 rounded-none bg-[#F5F4F0] border border-black/10">
                  <div className="flex items-center justify-between text-xs font-mono text-black/60 mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-[#0A0A0A] uppercase text-[10px]">
                      <Truck className="w-4 h-4 text-[#0A0A0A]" />
                      Courier: RedX / Steadfast BD
                    </span>
                    <span className="text-[10px]">Tracking: {order.trackingNumber}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-3 text-center font-mono">
                    {['Ordered', 'Lab Checked', 'Dispatched', 'In Transit', 'Delivered'].map(
                      (stepName, sIdx) => {
                        const isDone = sIdx <= 3; // Simulated progression
                        const isCurrent = sIdx === 3;
                        return (
                          <div key={stepName} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-bold mb-1 border ${
                                isCurrent
                                  ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                                  : isDone
                                  ? 'bg-[#0A0A0A] text-white border-black'
                                  : 'bg-[#F5F4F0] text-black/40 border-black/10'
                              }`}
                            >
                              {sIdx + 1}
                            </div>
                            <span
                              className={`text-[10px] uppercase ${
                                isCurrent
                                  ? 'font-bold text-[#0A0A0A]'
                                  : isDone
                                  ? 'text-black/70 font-medium'
                                  : 'text-black/40'
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Devices in this order */}
                <div className="space-y-3 font-mono">
                  {order.items.map((it, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex items-center justify-between p-3 rounded-none bg-[#F5F4F0] border border-black/10 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.model}
                          className="w-12 h-12 object-contain mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <Link
                            to={`/phones/${it.product.slug}`}
                            className="font-display font-bold text-[#0A0A0A] hover:underline text-sm block"
                          >
                            {it.product.model}
                          </Link>
                          <div className="text-[10px] text-black/50 mt-0.5">
                            {it.product.storage} · {it.product.condition} · {it.product.color}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-[#0A0A0A]">
                          {formatBDT(it.product.currentPrice * it.quantity)}
                        </div>
                        <span className="text-[10px] text-black/60 bg-[#C0FF00] px-1 font-bold">
                          12-Mo Warranty Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-3 border-t border-black/10 text-xs font-mono">
                  <span className="text-black/60">
                    Est. Arrival: <strong className="text-[#0A0A0A]">Tomorrow by 6:00 PM</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleClaimWarranty(order.id)}
                    className="font-bold text-[#0A0A0A] hover:underline uppercase text-[11px]"
                  >
                    Request Warranty Support →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: 12-MONTH WARRANTY CLAIM CENTER */}
      {activeTab === 'warranty' && (
        <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-8 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#0A0A0A] bg-[#C0FF00] px-1.5 py-0.5">
              Coverage Shield
            </span>
            <h2 className="text-2xl font-display font-black text-[#0A0A0A] uppercase mt-2">
              Active Warranty Protections
            </h2>
            <p className="text-xs sm:text-sm text-black/60 font-mono mt-1">
              Every phone purchased through RE:PHONE is backed by a 12-month hardware guarantee. If your display, battery, or logic board develops an unforeseen issue, our lab technicians will repair or replace it free of charge.
            </p>
          </div>

          {claimSubmitted && (
            <div className="p-4 rounded-none bg-[#F5F4F0] border border-black text-[#0A0A0A] text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0A0A0A] shrink-0" />
              <span>
                Warranty claim ticket initiated for order {claimSubmitted}! A service engineer from our Motaleb Plaza lab will contact your phone number.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            {orders.flatMap((o) => o.items).map((it, idx) => (
              <div
                key={idx}
                className="p-5 rounded-none bg-[#F5F4F0] border border-black/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.model}
                      className="w-10 h-10 object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#0A0A0A]">{it.product.model}</h4>
                      <span className="text-[10px] text-black/50">IMEI: 354892019284710 (Clean)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold">
                    ACTIVE (11 Mos Left)
                  </span>
                </div>

                <div className="text-xs text-black/70 pt-2 border-t border-black/10 flex justify-between items-center">
                  <span className="text-[10px]">Coverage: Screen, Logic Board, Battery & Sensors</span>
                  <button
                    type="button"
                    onClick={() => handleClaimWarranty(`WARRANTY-${idx + 101}`)}
                    className="px-3 py-1 bg-[#0A0A0A] text-[#C0FF00] border border-black rounded-none text-[10px] font-bold uppercase hover:bg-black"
                  >
                    File Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-12 text-center font-mono">
              <Heart className="w-12 h-12 text-black/30 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-[#0A0A0A] uppercase">Your wishlist is empty</h3>
              <p className="text-xs text-black/50 mt-1">
                Save phones you're watching for price drops or condition restocks.
              </p>
              <Link
                to="/phones"
                className="mt-4 inline-block px-6 py-2.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] border border-black text-xs font-bold uppercase"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FDFCF9] rounded-none border border-black/10 p-5 flex flex-col justify-between font-mono"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase text-black/50 tracking-wider">
                        {product.brand}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-xs text-black/50 hover:text-black uppercase text-[10px] font-bold"
                      >
                        Remove
                      </button>
                    </div>

                    <Link
                      to={`/phones/${product.slug}`}
                      className="h-40 flex items-center justify-center mb-3 bg-[#F5F4F0] border border-black/5 p-2"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.model}
                        className="max-h-36 object-contain mix-blend-multiply hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </Link>

                    <Link
                      to={`/phones/${product.slug}`}
                      className="font-display font-bold text-base text-[#0A0A0A] hover:underline block uppercase"
                    >
                      {product.model}
                    </Link>
                    <div className="text-[10px] text-black/60 mt-0.5">
                      {product.storage} · {product.condition} · {product.batteryHealth}% Battery
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                    <div>
                      <div className="font-display font-black text-base text-[#0A0A0A]">
                        {formatBDT(product.currentPrice)}
                      </div>
                      <span className="text-[10px] bg-[#C0FF00] px-1 text-[#0A0A0A] font-bold">
                        Save {product.savingsPercentage}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="p-2.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] hover:bg-black border border-black transition-colors"
                      title="Add to bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
