import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Battery,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Cpu,
  Layers,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { ExplodedInspection3D } from '../components/3d/ExplodedInspection3D';
import { GradingGuide } from '../components/homepage/GradingGuide';

export const GradingPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] text-[10px] font-mono font-bold uppercase tracking-widest border border-black">
          <ShieldCheck className="w-3.5 h-3.5" />
          The RE:PHONE Laboratory Standard
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black text-[#0A0A0A] tracking-tight uppercase">
          How We Inspect & Grade Every Smartphone
        </h1>

        <p className="text-sm sm:text-base text-black/60 font-mono leading-relaxed max-w-2xl mx-auto">
          Unlike ordinary classified portals where condition terms are vague and risky, RE:PHONE operates dedicated engineering inspection hubs in Dhaka (Motaleb Plaza & Bashundhara City).
        </p>
      </div>

      {/* 3D Exploded Inspection Lab Experience */}
      <div>
        <div className="mb-6 text-center">
          <span className="text-[10px] font-mono text-black/50 uppercase tracking-widest font-bold">
            Interactive Hardware Showroom
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0A0A0A] uppercase mt-1">
            Explore the 30-Point Subsystem Diagnostics
          </h2>
        </div>
        <ExplodedInspection3D />
      </div>

      {/* The 6 Trust Pillars for Bangladesh */}
      <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-2xl font-display font-black text-[#0A0A0A] uppercase tracking-tight">
            Our 6 Customer Trust Commitments
          </h3>
          <p className="text-xs text-black/60 font-mono mt-1">
            Built from the ground up for transparent pre-owned tech ownership in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-mono text-[#0A0A0A]">
          <div className="p-6 rounded-none bg-[#F5F4F0] border border-black/10">
            <CheckCircle2 className="w-5 h-5 text-[#0A0A0A] mb-2" />
            <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">1. 100% Functionally Flawless</h4>
            <p className="leading-relaxed text-black/70">
              No matter the cosmetic grade, internal components (processors, RAM, modem, cameras) function at 100% factory specifications.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#F5F4F0] border border-black/10">
            <Battery className="w-5 h-5 text-[#0A0A0A] mb-2" />
            <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">2. Minimum 85%-99% Battery Health</h4>
            <p className="leading-relaxed text-black/70">
              We reject and replace degraded batteries. Every phone lists verified battery capacity directly in the specs.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#F5F4F0] border border-black/10">
            <ShieldCheck className="w-5 h-5 text-[#0A0A0A] mb-2" />
            <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">3. BTRC White-List & Clean IMEI</h4>
            <p className="leading-relaxed text-black/70">
              All devices are cross-checked against Bangladesh BTRC database and international blacklists to ensure legal, non-stolen status.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#F5F4F0] border border-black/10">
            <Smartphone className="w-5 h-5 text-[#0A0A0A] mb-2" />
            <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">4. Factory Unlocked Networks</h4>
            <p className="leading-relaxed text-black/70">
              Ready for any SIM: Grameenphone, Banglalink, Robi, Airtel, Teletalk, or international travel eSIMs without bypasses.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#F5F4F0] border border-black/10">
            <ShieldCheck className="w-5 h-5 text-[#0A0A0A] mb-2" />
            <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">5. 12-Month Hardware Warranty</h4>
            <p className="leading-relaxed text-black/70">
              Comprehensive repair or device replacement guarantee serviced directly by our certified technicians in Dhaka.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#F5F4F0] border border-black/10">
            <RotateCcw className="w-5 h-5 text-[#0A0A0A] mb-2" />
            <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">6. 7-Day Money Back Guarantee</h4>
            <p className="leading-relaxed text-black/70">
              Try the phone in person for a full week. If the ergonomic feel or cosmetics don't meet your standard, return it hassle-free.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Cosmetic Grading Breakdown */}
      <GradingGuide />

      {/* CTA Box */}
      <div className="bg-[#0A0A0A] text-white rounded-none border border-black p-8 sm:p-12 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
          Ready to experience verified pre-owned excellence?
        </h3>
        <p className="text-xs sm:text-sm text-white/60 font-mono max-w-lg mx-auto">
          Save up to 53% on Apple, Samsung, Google, and OnePlus flagships with complete peace of mind.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/phones"
            className="px-8 py-3.5 rounded-none bg-[#C0FF00] text-[#0A0A0A] font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors border border-black"
          >
            Browse Inspected Phones
          </Link>
        </div>
      </div>
    </div>
  );
};
