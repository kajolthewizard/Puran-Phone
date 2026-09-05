import React from 'react';
import { HeroSection } from '../components/homepage/HeroSection';
import { TrustBar } from '../components/homepage/TrustBar';
import { BrandSelector } from '../components/homepage/BrandSelector';
import { FeaturedProducts } from '../components/homepage/FeaturedProducts';
import { ExplodedInspection3D } from '../components/3d/ExplodedInspection3D';
import { GradingGuide } from '../components/homepage/GradingGuide';
import { TradeInTeaser } from '../components/homepage/TradeInTeaser';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* 1. Hero Section with 3D Smartphone & Scroll Story */}
      <HeroSection />

      {/* 2. Trust Bar (Dark section with lime accents) */}
      <TrustBar />

      {/* 3. Shop by Brand */}
      <BrandSelector />

      {/* 4. Featured Products (12+ Refurbished Models) */}
      <FeaturedProducts />

      {/* 5. Condition / Inspection Experience (3D Exploded Engineering Showroom) */}
      <section className="py-20 bg-[#F5F4F0] border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 bg-[#C0FF00] text-[10px] font-mono font-bold tracking-widest uppercase text-[#0A0A0A] mb-2">
              Inside Our Dhaka Engineering Lab
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#0A0A0A] mt-2 tracking-tight">
              The 30-Point Inspection Architecture
            </h2>
            <p className="text-sm text-black/60 mt-2 max-w-xl mx-auto leading-relaxed">
              We never ship a phone with aftermarket compromises. Every subsystem is disassembled, bench-tested with diagnostic hardware, and calibrated before entering inventory.
            </p>
          </div>

          <ExplodedInspection3D />
        </div>
      </section>

      {/* 6. Honest Grading Standard (Like New, Excellent, Good, Fair) */}
      <GradingGuide />

      {/* 7. Sell Your Phone / Trade-In Valuation Teaser */}
      <TradeInTeaser />
    </div>
  );
};
