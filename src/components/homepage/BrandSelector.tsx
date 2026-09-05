import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';
import { BRANDS } from '../../data/mockData';

export const BrandSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName: string) => {
    navigate(`/phones?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="py-16 border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/40">
              Curated Flagship OEMs
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#0A0A0A] mt-1">
              Shop by Brand
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/phones')}
            className="text-xs font-bold text-[#0A0A0A] hover:opacity-70 flex items-center gap-1.5 group font-mono uppercase tracking-wider"
          >
            <span>View all brands</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Brand Selector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => handleBrandClick(brand.name)}
              className="group relative bg-[#F5F4F0] hover:bg-[#0A0A0A] rounded-none p-5 border border-black/10 hover:border-black transition-all duration-200 flex flex-col items-center justify-center text-center"
            >
              <div className="w-12 h-12 rounded-none bg-white group-hover:bg-[#1a1a1a] flex items-center justify-center mb-3 transition-colors border border-black/5">
                <Smartphone className="w-5 h-5 text-[#0A0A0A] group-hover:text-[#C0FF00] transition-colors" />
              </div>
              <span className="font-display font-bold text-sm text-[#0A0A0A] group-hover:text-white transition-colors">
                {brand.name}
              </span>
              <span className="text-[10px] font-mono text-black/40 group-hover:text-[#C0FF00]/80 mt-0.5">
                {brand.count}+ models
              </span>

              {/* Accent dot indicator on hover */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-none bg-[#C0FF00] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
