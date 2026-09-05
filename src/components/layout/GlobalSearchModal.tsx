import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Smartphone, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreService, formatBDT } from '../../services/storeService';
import { Product } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(StoreService.getProducts());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by caller if global listener is attached
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.model.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.color.toLowerCase().includes(query.toLowerCase()) ||
          p.condition.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 5);

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/phones/${slug}`);
  };

  const handleBrandClick = (brand: string) => {
    onClose();
    navigate(`/phones?brand=${brand}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#FDFCF9] rounded-none shadow-2xl border border-black overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-black/10">
          <Search className="w-5 h-5 text-black/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search iPhone, Galaxy, Pixel, condition, or storage..."
            className="w-full bg-transparent text-lg text-[#0A0A0A] placeholder:text-black/40 outline-none font-display font-bold"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-none text-black/50 hover:text-black hover:bg-[#F5F4F0]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-mono font-bold px-2.5 py-1 bg-[#F5F4F0] border border-black/10 text-[#0A0A0A] rounded-none hover:bg-[#0A0A0A] hover:text-[#C0FF00]"
          >
            ESC
          </button>
        </div>

        {/* Quick Brands Suggestions */}
        {!query && (
          <div className="px-6 py-3 bg-[#F5F4F0] border-b border-black/10 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-black/50 font-bold uppercase tracking-wider shrink-0 text-[10px]">Popular:</span>
            {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing'].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleBrandClick(b)}
                className="px-3 py-1 rounded-none bg-white border border-black/10 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#C0FF00] font-bold text-[10px] uppercase tracking-wider shrink-0 transition-colors"
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item.slug)}
                className="flex items-center justify-between p-3 rounded-none hover:bg-[#F5F4F0] transition-colors cursor-pointer border border-transparent hover:border-black/10 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-[#F5F4F0] rounded-none overflow-hidden p-1.5 shrink-0 flex items-center justify-center border border-black/10">
                    <img
                      src={item.images[0]}
                      alt={item.model}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-[#0A0A0A] text-sm group-hover:text-black">
                        {item.model}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-mono font-bold uppercase">
                        {item.condition}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-black/50 mt-0.5">
                      <span>{item.storage}</span>
                      <span>•</span>
                      <span>{item.color}</span>
                      <span>•</span>
                      <span className="text-[#0A0A0A] font-bold">{item.batteryHealth}% Battery</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="font-bold text-sm text-[#0A0A0A]">{formatBDT(item.currentPrice)}</div>
                  <div className="text-[10px] text-[#0A0A0A] bg-[#C0FF00] px-1 py-0.2 font-bold inline-block mt-0.5">
                    Save {item.savingsPercentage}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-black/50 font-mono">
              <Smartphone className="w-10 h-10 mx-auto text-black/30 mb-2" />
              <p className="font-bold text-[#0A0A0A]">No phones matching "{query}"</p>
              <p className="text-xs text-black/50 mt-1">
                Try searching for iPhone 15, Samsung S24, Pixel, or 256GB
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#F5F4F0] border-t border-black/10 flex items-center justify-between text-xs font-mono text-black/60 px-6">
          <span className="text-[11px]">All phones include 12-month warranty & 30-point inspection</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(query ? `/phones?search=${encodeURIComponent(query)}` : '/phones');
            }}
            className="font-bold text-[#0A0A0A] hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
          >
            Browse all phones <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
