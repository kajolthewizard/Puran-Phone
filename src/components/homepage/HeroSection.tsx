import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Battery, RefreshCw, Cpu, Layers } from 'lucide-react';
import { HeroPhone3D } from '../3d/HeroPhone3D';

export const HeroSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [explodedState, setExplodedState] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = 800;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C0FF00]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Editorial Eyebrow Tag */}
            <div className="inline-block px-3 py-1 bg-[#C0FF00] text-[10px] font-bold uppercase tracking-widest text-[#0A0A0A]">
              Verified Pre-Owned
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-[90px] xl:text-[106px] leading-[0.9] font-extrabold tracking-tighter text-[#0A0A0A]">
              OLD PHONE.
              <br />
              NEW LIFE.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-black/60 max-w-md leading-relaxed font-normal">
              Verified smartphones without the brand-new price. Every device undergoes a 30-point inspection in our Dhaka lab.
            </p>

            {/* Editorial CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/phones"
                className="bg-[#0A0A0A] text-white px-8 py-4 text-sm font-bold tracking-wide rounded-none hover:bg-black/90 flex items-center justify-center gap-3 transition-colors"
              >
                <span>SHOP PHONES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/grading"
                className="border border-black px-8 py-4 text-sm font-bold tracking-wide rounded-none text-[#0A0A0A] hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                HOW IT WORKS
              </Link>
            </div>

            {/* Micro Editorial Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-black/10 pt-8">
              <div>
                <div className="text-2xl font-bold font-display text-[#0A0A0A]">৳79,990</div>
                <div className="text-[10px] uppercase tracking-wider text-black/40 mt-0.5">iPhone 15 Pro Max</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-[#0A0A0A]">৳45,500</div>
                <div className="text-[10px] uppercase tracking-wider text-black/40 mt-0.5">Pixel 8 Pro</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-[#C0FF00] bg-black px-2 inline-block">Save 35%</div>
                <div className="text-[10px] uppercase tracking-wider text-black/40 mt-0.5">Avg. Savings</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Smartphone Experience in Editorial Stage */}
          <div className="lg:col-span-5 bg-[#F5F4F0] border border-black/10 p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute top-10 right-10 w-72 h-72 bg-[#C0FF00]/15 rounded-full blur-[90px] pointer-events-none" />

            <HeroPhone3D
              scrollProgress={scrollProgress}
              onInspectToggle={(exploded) => setExplodedState(exploded)}
            />

            {/* Editorial Inspection Report Card */}
            <div className="mt-4 bg-white/90 backdrop-blur-md border border-black/10 p-5 shadow-xs">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-0.5">
                    Inspection Report
                  </div>
                  <div className="text-base sm:text-lg font-black tracking-tight text-[#0A0A0A]">
                    GRADE: {explodedState ? 'HARDWARE DECOMPOSED' : 'EXCELLENT'}
                  </div>
                </div>
                <div className="text-[#C0FF00] bg-black px-2 py-1 text-xs font-bold font-mono">
                  94% BATT.
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] font-bold text-[#0A0A0A]">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-black text-[#C0FF00] flex items-center justify-center text-[9px] font-bold">✓</span>
                  <span>DISPLAY PIXEL CHECK PASSED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-black text-[#C0FF00] flex items-center justify-center text-[9px] font-bold">✓</span>
                  <span>MOTHERBOARD DIAGNOSTICS CLEAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
