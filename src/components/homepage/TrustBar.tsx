import React from 'react';
import { ShieldCheck, Battery, CheckCircle2, Shield, RotateCcw } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const TRUST_ITEMS = [
    {
      icon: ShieldCheck,
      title: '30-point inspection',
      subtitle: 'Rigorous lab diagnostics',
    },
    {
      icon: Battery,
      title: 'Battery health shown',
      subtitle: 'Guaranteed 88%-99% capacity',
    },
    {
      icon: CheckCircle2,
      title: 'IMEI verified',
      subtitle: 'BTRC & PTA clean certification',
    },
    {
      icon: Shield,
      title: '12-Mo warranty included',
      subtitle: 'Nationwide parts & service',
    },
    {
      icon: RotateCcw,
      title: '7-day easy returns',
      subtitle: '100% money back guarantee',
    },
  ];

  return (
    <section className="w-full bg-[#0A0A0A] text-white py-4 sm:py-5 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 group transition-transform hover:-translate-y-0.5"
              >
                <div className="w-2 h-2 rounded-full bg-[#C0FF00] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-white/50 font-mono mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
