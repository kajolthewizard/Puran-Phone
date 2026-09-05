import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Smartphone, Banknote, ShieldCheck, Zap } from 'lucide-react';
import { formatBDT } from '../../services/storeService';

export const TradeInTeaser: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedModel, setSelectedModel] = useState('iPhone 13');
  const navigate = useNavigate();

  const ESTIMATES: Record<string, number> = {
    'iPhone 15 Pro': 75000,
    'iPhone 14 Pro': 58000,
    'iPhone 13': 38000,
    'iPhone 12': 28000,
    'Galaxy S24 Ultra': 88000,
    'Galaxy S23': 39000,
    'Galaxy S22 Ultra': 48000,
    'Pixel 8 Pro': 52000,
    'Pixel 7a': 26000,
    'OnePlus 12': 54000,
  };

  const currentEst = ESTIMATES[selectedModel] || 38000;

  const handleStartFullValuation = () => {
    navigate(`/sell?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}`);
  };

  return (
    <section className="py-20 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0A0A] text-white rounded-none p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-black">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C0FF00] text-[#0A0A0A] text-[10px] font-mono font-bold uppercase tracking-wider rounded-none">
                <Sparkles className="w-3.5 h-3.5" />
                Zero-Hassle Trade-In & Buyback
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white leading-tight">
                Turn your drawer phone into instant Taka.
              </h2>

              <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
                Get a transparent instant quote in 60 seconds. Free doorstep courier pickup anywhere in Dhaka and major cities, instant payment via bKash, Nagad or bank transfer after diagnostic test.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-white/80 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0FF00]" />
                  <span>Free Pickup in Dhaka</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0FF00]" />
                  <span>Instant bKash Payout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0FF00]" />
                  <span>Certified Data Wipe</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Valuation Quick Calculator Card */}
            <div className="lg:col-span-5 bg-[#141414] border border-white/10 p-6 sm:p-8 rounded-none shadow-xl">
              <span className="text-[10px] font-mono text-white/40 block mb-3 uppercase tracking-wider">
                Quick Valuation Simulator
              </span>

              {/* Brand Selector */}
              <div className="mb-4">
                <label className="text-[11px] font-mono text-white/60 uppercase font-semibold mb-1.5 block">Select Brand</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Apple', 'Samsung', 'Google'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setSelectedBrand(b);
                        if (b === 'Apple') setSelectedModel('iPhone 13');
                        if (b === 'Samsung') setSelectedModel('Galaxy S23');
                        if (b === 'Google') setSelectedModel('Pixel 8 Pro');
                      }}
                      className={`py-2.5 px-3 rounded-none text-xs font-mono font-bold uppercase transition-all border ${
                        selectedBrand === b
                          ? 'bg-[#C0FF00] text-[#0A0A0A] border-[#C0FF00]'
                          : 'bg-black text-white/70 border-white/10 hover:border-white/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Dropdown */}
              <div className="mb-6">
                <label className="text-[11px] font-mono text-white/60 uppercase font-semibold mb-1.5 block">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-black border border-white/20 text-white rounded-none px-4 py-2.5 text-xs font-mono font-semibold outline-none focus:border-[#C0FF00]"
                >
                  {selectedBrand === 'Apple' && (
                    <>
                      <option value="iPhone 15 Pro">iPhone 15 Pro (256GB)</option>
                      <option value="iPhone 14 Pro">iPhone 14 Pro (128GB)</option>
                      <option value="iPhone 13">iPhone 13 (128GB)</option>
                      <option value="iPhone 12">iPhone 12 (128GB)</option>
                    </>
                  )}
                  {selectedBrand === 'Samsung' && (
                    <>
                      <option value="Galaxy S24 Ultra">Galaxy S24 Ultra (512GB)</option>
                      <option value="Galaxy S23">Galaxy S23 (256GB)</option>
                      <option value="Galaxy S22 Ultra">Galaxy S22 Ultra (256GB)</option>
                    </>
                  )}
                  {selectedBrand === 'Google' && (
                    <>
                      <option value="Pixel 8 Pro">Pixel 8 Pro (128GB)</option>
                      <option value="Pixel 7a">Pixel 7a (128GB)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Dynamic Value Box */}
              <div className="p-4 rounded-none bg-black border border-white/15 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 font-mono block uppercase">Estimated Cash Value</span>
                  <span className="text-2xl sm:text-3xl font-display font-black text-[#C0FF00]">
                    {formatBDT(currentEst)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#C0FF00] bg-white/5 px-2 py-0.5 rounded-none border border-[#C0FF00]/30 font-mono">
                    Direct bKash/Nagad
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartFullValuation}
                className="w-full py-4 px-6 rounded-none bg-[#C0FF00] hover:bg-white text-[#0A0A0A] font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all group"
              >
                <span>Complete 60s Diagnostic Flow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
