import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Recycle, CheckCircle2, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand & Mission Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-[#C0FF00] text-[#0A0A0A] flex items-center justify-center font-display font-black text-lg">
                R
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                RE:PHONE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#C0FF00] bg-[#C0FF00]/10 px-2 py-0.5 rounded-none border border-[#C0FF00]/30 uppercase">
                puranphone.com
              </span>
            </div>

            <p className="text-xl font-display font-bold text-white tracking-tight">
              OLD PHONE. NEW LIFE.
            </p>

            <p className="text-sm text-white/60 max-w-md leading-relaxed">
              Verified pre-owned smartphones without the brand-new price tag. Each device undergoes an exhaustive 30-point engineering inspection in our Dhaka lab, with transparent battery calibration and 12-month nationwide warranty.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-white/80 font-mono">
                <Recycle className="w-4 h-4 text-[#C0FF00]" />
                <span>12.4 Tons E-Waste Diverted</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5 text-xs text-white/80 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#C0FF00]" />
                <span>BTRC IMEI Verified</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C0FF00]">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/phones" className="hover:text-white transition-colors">
                  All Refurbished Phones
                </Link>
              </li>
              <li>
                <Link to="/phones?brand=Apple" className="hover:text-white transition-colors">
                  Used iPhones
                </Link>
              </li>
              <li>
                <Link to="/phones?brand=Samsung" className="hover:text-white transition-colors">
                  Samsung Galaxy Deals
                </Link>
              </li>
              <li>
                <Link to="/phones?brand=Google" className="hover:text-white transition-colors">
                  Google Pixel Series
                </Link>
              </li>
              <li>
                <Link to="/phones?filter=deals" className="hover:text-white transition-colors text-[#C0FF00] font-medium">
                  Flash Discounts (Up to 53%)
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C0FF00]">
              Trust & Quality
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/grading" className="hover:text-white transition-colors">
                  30-Point Inspection
                </Link>
              </li>
              <li>
                <Link to="/grading" className="hover:text-white transition-colors">
                  Grading Criteria
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-white transition-colors">
                  Sell / Instant Trade-In
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Warranty Claim Center
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C0FF00]">
              Bangladesh HQ & Hubs
            </h4>
            <div className="space-y-2 text-xs text-white/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C0FF00] shrink-0 mt-0.5" />
                <span>
                  <strong>Dhaka Hub:</strong> Level 4, Motaleb Plaza, Hatirpool & Level 5, Bashundhara City, Dhaka.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C0FF00] shrink-0" />
                <span>+880 9612-REPHONE (737466)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C0FF00] shrink-0" />
                <span>support@puranphone.com</span>
              </div>
            </div>

            {/* Merchant / Admin Links */}
            <div className="pt-2 flex items-center gap-2 font-mono">
              <Link
                to="/seller"
                className="text-xs text-[#C0FF00] hover:underline flex items-center gap-1"
              >
                Seller Portal <ArrowUpRight className="w-3 h-3" />
              </Link>
              <span className="text-white/30">•</span>
              <Link
                to="/admin"
                className="text-xs text-[#C0FF00] hover:underline flex items-center gap-1"
              >
                Admin Ops <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial Trust Markers & System Version */}
        <div className="py-6 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C0FF00]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white">12-Month Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C0FF00]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white">30-Point Check</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C0FF00]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white">Free Dhaka Delivery</span>
            </div>
          </div>

          <div className="text-[10px] opacity-40 font-mono tracking-wider uppercase">
            RE:PHONE SYSTEMS // VERSION 2.04B - DHAKA, BD
          </div>
        </div>

        {/* Bottom Payment Methods & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>
            © {new Date().getFullYear()} RE:PHONE (puranphone.com) · All rights reserved. Registered under Bangladesh E-Commerce Guild.
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/50 font-mono">Supported Payments:</span>
            <div className="flex items-center gap-1.5 font-bold font-mono text-[10px]">
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-none text-white">
                bKash
              </span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-none text-white">
                Nagad
              </span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-none text-white">
                VISA / MC
              </span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-none text-white">
                Cash On Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
