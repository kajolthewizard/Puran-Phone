import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { DeviceCondition } from '../../types';

interface GradeCard {
  grade: DeviceCondition;
  title: string;
  badgeColor: string;
  screenState: string;
  bodyState: string;
  batteryPromise: string;
  savingsRange: string;
  summary: string;
}

const GRADES: GradeCard[] = [
  {
    grade: 'Like New',
    title: 'Flawless Condition',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    screenState: 'Pristine, zero micro-scratches or signs of use.',
    bodyState: 'Immaculate chassis and rails, no marks even under bright light.',
    batteryPromise: '95% to 100% original capacity.',
    savingsRange: 'Save 25% – 35%',
    summary: 'Feels like opening a brand-new retail box at a fraction of the showroom price.',
  },
  {
    grade: 'Excellent',
    title: 'Near-Mint Condition',
    badgeColor: 'bg-lime-100 text-lime-900 border-lime-300',
    screenState: 'Clean display. Invisible micro-wear visible only at angle.',
    bodyState: 'Very slight handling signs on corners, no dents or deep gouges.',
    batteryPromise: '90% to 96% original capacity.',
    savingsRange: 'Save 35% – 45%',
    summary: 'Our most popular choice: unbeatable sweet spot of cosmetic beauty and high savings.',
  },
  {
    grade: 'Good',
    title: 'Light Daily Wear',
    badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
    screenState: 'May have minor hairline marks invisible when screen is on.',
    bodyState: 'Noticeable cosmetic scuffs on bezels or back from normal case friction.',
    batteryPromise: '88% to 92% original capacity.',
    savingsRange: 'Save 45% – 55%',
    summary: '100% functionally perfect. Put a phone case on it and nobody can tell the difference.',
  },
  {
    grade: 'Fair',
    title: 'Honest Budget Hero',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    screenState: 'Visible micro-scratches that do not impede touch or visibility.',
    bodyState: 'Small nicks or paint wear around perimeter. Zero cracks or structural damage.',
    batteryPromise: '85% to 90% original capacity.',
    savingsRange: 'Save 50% – 65%',
    summary: 'Maximum possible savings for flagship performance on a tight budget.',
  },
];

export const GradingGuide: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<DeviceCondition>('Excellent');

  const activeGrade = GRADES.find((g) => g.grade === selectedGrade) || GRADES[1];

  return (
    <section id="grading" className="py-20 border-t border-black/10 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-[#C0FF00] text-[#0A0A0A] text-[10px] font-mono font-bold tracking-widest uppercase rounded-none mb-2">
            Transparency First
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0A0A0A] mt-2 tracking-tight">
            Our Honest Grading Standard
          </h2>
          <p className="text-sm text-black/60 mt-2">
            Unlike informal marketplaces where "fresh condition" means whatever the seller wants, RE:PHONE applies rigorous laboratory cosmetic standards.
          </p>
        </div>

        {/* Grade Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          {GRADES.map((item) => (
            <button
              key={item.grade}
              type="button"
              onClick={() => setSelectedGrade(item.grade)}
              className={`p-4 rounded-none border text-center transition-all ${
                selectedGrade === item.grade
                  ? 'bg-[#0A0A0A] text-white border-black shadow-sm'
                  : 'bg-[#FDFCF9] text-black/70 border-black/10 hover:border-black hover:bg-white'
              }`}
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider">
                {item.grade}
              </div>
              <div
                className={`text-[11px] font-mono font-bold mt-1 ${
                  selectedGrade === item.grade ? 'text-[#C0FF00]' : 'text-black/60'
                }`}
              >
                {item.savingsRange}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Grade Spotlight Card */}
        <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-8 shadow-none max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/10">
            <div>
              <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-1 bg-[#C0FF00] text-[#0A0A0A] uppercase tracking-wider mb-2 border border-black/10">
                GRADE: {activeGrade.grade}
              </span>
              <h3 className="text-2xl font-display font-extrabold text-[#0A0A0A]">
                {activeGrade.title}
              </h3>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-mono text-black/40 block uppercase">Expected Average Savings</span>
              <span className="text-2xl font-display font-black text-[#0A0A0A]">
                {activeGrade.savingsRange}
              </span>
            </div>
          </div>

          {/* Detailed Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <div className="p-4 rounded-none bg-[#F5F4F0] border border-black/5">
              <div className="text-[10px] font-mono uppercase font-bold text-black/40 mb-1">
                Display Quality
              </div>
              <p className="text-xs text-black/80 leading-relaxed font-medium">
                {activeGrade.screenState}
              </p>
            </div>

            <div className="p-4 rounded-none bg-[#F5F4F0] border border-black/5">
              <div className="text-[10px] font-mono uppercase font-bold text-black/40 mb-1">
                Frame & Back Glass
              </div>
              <p className="text-xs text-black/80 leading-relaxed font-medium">
                {activeGrade.bodyState}
              </p>
            </div>

            <div className="p-4 rounded-none bg-[#F5F4F0] border border-black/5">
              <div className="text-[10px] font-mono uppercase font-bold text-black/40 mb-1">
                Battery Health Guarantee
              </div>
              <p className="text-xs text-black/80 leading-relaxed font-medium font-mono">
                {activeGrade.batteryPromise}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-black/60 italic font-serif">
              "{activeGrade.summary}"
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-black/60">
              <span className="flex items-center gap-1.5 text-[#0A0A0A] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#C0FF00]" /> 100% Functionally Flawless
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#0A0A0A] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#C0FF00]" /> 12-Month Warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
