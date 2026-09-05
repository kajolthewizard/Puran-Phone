import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Recycle,
  Sparkles,
  Users,
  Search,
  Check,
} from 'lucide-react';
import { StoreService, formatBDT } from '../services/storeService';
import { Product } from '../types';

interface InspectionItem {
  id: string;
  device: string;
  seller: string;
  hub: string;
  imei: string;
  batteryTested: number;
  cosmeticsGrade: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  btrcCheck: boolean;
}

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(StoreService.getProducts());
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory' | 'sustainability'>('queue');

  // Inspection Queue Data
  const [queue, setQueue] = useState<InspectionItem[]>([
    {
      id: 'INSP-4091',
      device: 'Apple iPhone 15 Pro (256GB - Blue Titanium)',
      seller: 'Dhaka Prime Gadgets (Motaleb Plaza)',
      hub: 'Motaleb Plaza Lab',
      imei: '359482019482710',
      batteryTested: 96,
      cosmeticsGrade: 'Like New',
      status: 'Pending',
      btrcCheck: true,
    },
    {
      id: 'INSP-4092',
      device: 'Samsung Galaxy S24 Ultra (512GB - Titanium Gray)',
      seller: 'Bashundhara Phone Hub',
      hub: 'Bashundhara City Lab',
      imei: '351982740192847',
      batteryTested: 98,
      cosmeticsGrade: 'Excellent',
      status: 'Pending',
      btrcCheck: true,
    },
    {
      id: 'INSP-4093',
      device: 'Google Pixel 8 Pro (128GB - Bay Blue)',
      seller: 'Trade-in Direct (Dhanmondi Pickup)',
      hub: 'Central Diagnostics Lab',
      imei: '352981048192039',
      batteryTested: 89,
      cosmeticsGrade: 'Good',
      status: 'Pending',
      btrcCheck: true,
    },
  ]);

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-mono">
      {/* Admin Operations Banner */}
      <div className="bg-[#0A0A0A] text-white rounded-none border border-black p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-none bg-[#1A1A1A] border border-white/20 text-[#C0FF00] flex items-center justify-center font-bold text-2xl">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                RE:PHONE Operations Central
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-none bg-[#C0FF00] text-black font-extrabold uppercase">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5 font-mono">
              Nationwide Bangladesh smartphone verification, BTRC compliance & merchant governance.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#1A1A1A] border border-white/20 rounded-none text-xs font-mono">
            <span className="text-white/40 block text-[10px] uppercase">Active Hubs</span>
            <span className="font-bold text-[#C0FF00]">Dhaka (2) · Ctg (1)</span>
          </div>
          <div className="px-3.5 py-2 bg-[#1A1A1A] border border-white/20 rounded-none text-xs font-mono">
            <span className="text-white/40 block text-[10px] uppercase">BTRC Sync</span>
            <span className="font-bold text-[#C0FF00]">100% ONLINE</span>
          </div>
        </div>
      </div>

      {/* Platform Analytics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-none bg-[#FDFCF9] border border-black/10">
          <span className="text-xs font-mono uppercase text-black/50">Gross Marketplace GMV</span>
          <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
            ৳1,48,20,000
          </div>
          <span className="text-[10px] text-black/70 font-bold bg-[#C0FF00] px-1 mt-1 inline-block">
            +28% month-over-month
          </span>
        </div>

        <div className="p-5 rounded-none bg-[#FDFCF9] border border-black/10">
          <span className="text-xs font-mono uppercase text-black/50">Circular E-Waste Diverted</span>
          <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
            12.4 Tons
          </div>
          <span className="text-[10px] text-black/60 mt-1 block">
            18,420 phones refurbished
          </span>
        </div>

        <div className="p-5 rounded-none bg-[#FDFCF9] border border-black/10">
          <span className="text-xs font-mono uppercase text-black/50">Buyer Savings Delivered</span>
          <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
            ৳4.2 Crore
          </div>
          <span className="text-[10px] text-black/60 mt-1 block">
            Avg. 38.4% off brand new
          </span>
        </div>

        <div className="p-5 rounded-none bg-[#FDFCF9] border border-black/10">
          <span className="text-xs font-mono uppercase text-black/50">Warranty Claim Rate</span>
          <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
            0.6%
          </div>
          <span className="text-[10px] text-black/70 font-bold bg-[#C0FF00] px-1 mt-1 inline-block">
            Industry best (under 2.0% target)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-3 overflow-x-auto">
        {[
          { id: 'queue', label: `Inspection Diagnostic Queue (${queue.filter((q) => q.status === 'Pending').length} Pending)` },
          { id: 'inventory', label: `Published Inventory (${products.length})` },
          { id: 'sustainability', label: 'E-Waste & CO2 Reporting' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-none text-xs font-bold uppercase transition-all whitespace-nowrap border ${
              activeTab === t.id
                ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                : 'text-black/60 border-transparent hover:text-black hover:bg-[#F5F4F0]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INSPECTION QUEUE */}
      {activeTab === 'queue' && (
        <div className="bg-[#FDFCF9] rounded-none border border-black/10 overflow-hidden">
          <div className="p-6 border-b border-black/10">
            <h3 className="font-display font-black text-lg text-[#0A0A0A] uppercase">
              Lab Diagnostic Submissions
            </h3>
            <p className="text-xs text-black/60 mt-0.5 font-mono">
              Devices submitted by verified merchants awaiting 30-point benchmark authorization.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F5F4F0] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-black/50">{item.id}</span>
                    <span className="font-display font-bold text-sm text-[#0A0A0A] uppercase">
                      {item.device}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-bold">
                      {item.cosmeticsGrade}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-black/60">
                    <span>Seller: <strong className="text-[#0A0A0A]">{item.seller}</strong></span>
                    <span>•</span>
                    <span>IMEI: <code className="font-mono bg-[#F5F4F0] px-1 border border-black/10">{item.imei}</code></span>
                    <span>•</span>
                    <span className="text-[#0A0A0A] font-bold bg-[#C0FF00] px-1">Battery: {item.batteryTested}%</span>
                    <span>•</span>
                    <span className="text-black font-semibold">BTRC PTA: Passed</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'Pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReject(item.id)}
                        className="px-3.5 py-2 rounded-none border border-black/30 text-black/70 hover:bg-black hover:text-white text-xs font-bold uppercase transition-colors"
                      >
                        Reject Device
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="px-4 py-2 rounded-none bg-[#0A0A0A] hover:bg-black text-[#C0FF00] border border-black text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Authorize & Publish</span>
                      </button>
                    </>
                  ) : item.status === 'Approved' ? (
                    <span className="px-3 py-1.5 bg-[#C0FF00] text-[#0A0A0A] border border-black text-xs font-bold rounded-none flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4" /> Published to Marketplace
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-[#F5F4F0] text-[#0A0A0A] border border-black text-xs font-bold rounded-none flex items-center gap-1.5 uppercase">
                      <XCircle className="w-4 h-4" /> Returned to Merchant
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGER */}
      {activeTab === 'inventory' && (
        <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-lg text-[#0A0A0A] uppercase">
              Live Bangladesh Marketplace Catalog
            </h3>
            <span className="text-xs font-mono text-black/50">{products.length} Units Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 rounded-none bg-[#F5F4F0] border border-black/10 text-xs font-mono">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#0A0A0A] uppercase">{p.model}</span>
                  <span className="font-bold text-[#0A0A0A]">{formatBDT(p.currentPrice)}</span>
                </div>
                <div className="text-black/60 flex justify-between">
                  <span>{p.condition} · {p.batteryHealth}% Battery</span>
                  <span className="text-[#0A0A0A] bg-[#C0FF00] px-1 font-bold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUSTAINABILITY */}
      {activeTab === 'sustainability' && (
        <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-[#0A0A0A] text-[#C0FF00] border border-black flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-[#0A0A0A] uppercase">
                Bangladesh Circular Smartphone Ledger
              </h3>
              <p className="text-xs text-black/60 font-mono">
                Tracking environmental metrics aligned with UN Sustainable Development Goals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="p-5 bg-[#F5F4F0] rounded-none border border-black/10">
              <span className="text-xs text-black/50 block uppercase">Toxic Metals Diverted</span>
              <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
                480 kg
              </div>
              <p className="text-xs text-black/60 mt-1">
                Lead, mercury, and arsenic kept out of Dhaka landfills.
              </p>
            </div>

            <div className="p-5 bg-[#F5F4F0] rounded-none border border-black/10">
              <span className="text-xs text-black/50 block uppercase">CO₂ Footprint Avoided</span>
              <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
                1,450 Metric Tons
              </div>
              <p className="text-xs text-black/60 mt-1">
                Equivalent to removing 315 petrol cars from Mirpur road for a full year.
              </p>
            </div>

            <div className="p-5 bg-[#F5F4F0] rounded-none border border-black/10">
              <span className="text-xs text-black/50 block uppercase">Water Consumption Saved</span>
              <div className="text-2xl font-display font-black text-[#0A0A0A] mt-1">
                2.4 Million Liters
              </div>
              <p className="text-xs text-black/60 mt-1">
                Freshwater spared from semiconductor silicon wafer etching.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
