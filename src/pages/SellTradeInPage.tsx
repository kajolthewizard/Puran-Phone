import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Banknote,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
  QrCode,
  Layers,
} from 'lucide-react';
import { formatBDT } from '../services/storeService';

export const SellTradeInPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Multi-step form state
  const [step, setStep] = useState<number>(1);
  const [brand, setBrand] = useState<string>(searchParams.get('brand') || 'Apple');
  const [model, setModel] = useState<string>(searchParams.get('model') || 'iPhone 13');
  const [storage, setStorage] = useState<string>('128GB');

  // Condition assessment
  const [screenState, setScreenState] = useState<'flawless' | 'light-scratches' | 'cracked'>('flawless');
  const [bodyState, setBodyState] = useState<'flawless' | 'light-wear' | 'dents'>('light-wear');
  const [functionalState, setFunctionalState] = useState<'all-working' | 'battery-low' | 'camera-issue'>('all-working');

  // Payout & Contact info
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad' | 'bank' | 'credit'>('bkash');
  const [accountNumber, setAccountNumber] = useState<string>('01711223344');
  const [customerName, setCustomerName] = useState<string>('Rafiqul Islam');
  const [customerPhone, setCustomerPhone] = useState<string>('01711223344');
  const [pickupAddress, setPickupAddress] = useState<string>('House 42, Road 9/A, Dhanmondi, Dhaka');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Base values for estimation
  const BASE_PRICES: Record<string, number> = {
    'iPhone 15 Pro': 92000,
    'iPhone 14 Pro': 72000,
    'iPhone 13': 46000,
    'iPhone 12': 34000,
    'Galaxy S24 Ultra': 98000,
    'Galaxy S23': 48000,
    'Galaxy S22 Ultra': 55000,
    'Pixel 8 Pro': 62000,
    'Pixel 7a': 32000,
    'OnePlus 12': 60000,
  };

  // Dynamic Valuation Calculation
  const calculateValuation = () => {
    let base = BASE_PRICES[model] || 42000;

    // Storage modifier
    if (storage === '256GB') base += 5000;
    if (storage === '512GB') base += 10000;

    // Screen
    if (screenState === 'light-scratches') base *= 0.88;
    if (screenState === 'cracked') base *= 0.65;

    // Body
    if (bodyState === 'light-wear') base *= 0.94;
    if (bodyState === 'dents') base *= 0.82;

    // Functional
    if (functionalState === 'battery-low') base -= 3500;
    if (functionalState === 'camera-issue') base -= 6000;

    return Math.round(base / 100) * 100;
  };

  const estimatedValue = calculateValuation();
  const storeCreditBonus = 1500;
  const storeCreditValue = estimatedValue + storeCreditBonus;

  const handleSubmitBuyback = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `RP-SELL-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedId(generatedId);
    setStep(4);
  };

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-[#0A0A0A] text-[#C0FF00] border border-black text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3 h-3 text-[#C0FF00]" />
          Certified Instant Buyback
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#0A0A0A] tracking-tight uppercase">
          Sell Your Smartphone in 60 Seconds
        </h1>
        <p className="text-xs sm:text-sm text-black/60 font-mono mt-2">
          Get transparent market valuation, free doorstep pickup in Dhaka, certified data wipe, and same-day payment via bKash, Nagad or bank.
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      {!submittedId && (
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto px-4">
          {[
            { num: 1, label: 'Device Model' },
            { num: 2, label: 'Physical Condition' },
            { num: 3, label: 'Payout & Pickup' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 font-mono">
              <div
                className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold transition-all border ${
                  step === s.num
                    ? 'bg-[#0A0A0A] text-[#C0FF00] border-black scale-105'
                    : step > s.num
                    ? 'bg-[#0A0A0A] text-white border-black'
                    : 'bg-[#F5F4F0] text-black/40 border-black/10'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span
                className={`text-[11px] uppercase tracking-wider hidden sm:inline ${
                  step === s.num ? 'text-[#0A0A0A] font-bold' : 'text-black/40'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="bg-[#FDFCF9] rounded-none border border-black/10 p-6 sm:p-10">
        {/* STEP 1: MODEL & STORAGE SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/50 tracking-wider block mb-2">
                1. Select Device Brand
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBrand(b);
                      if (b === 'Apple') setModel('iPhone 13');
                      if (b === 'Samsung') setModel('Galaxy S23');
                      if (b === 'Google') setModel('Pixel 8 Pro');
                      if (b === 'OnePlus') setModel('OnePlus 12');
                      if (b === 'Xiaomi') setModel('Xiaomi 14');
                      if (b === 'Nothing') setModel('Nothing Phone (2)');
                    }}
                    className={`py-3 px-2 rounded-none text-xs font-mono font-bold border transition-all text-center uppercase tracking-wider ${
                      brand === b
                        ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                        : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/50 tracking-wider block mb-2">
                2. Select Specific Model
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {brand === 'Apple' && (
                  <>
                    {['iPhone 15 Pro', 'iPhone 14 Pro', 'iPhone 13', 'iPhone 12'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModel(m)}
                        className={`p-3 rounded-none text-xs font-mono font-bold border transition-all text-left uppercase ${
                          model === m
                            ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                            : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </>
                )}
                {brand === 'Samsung' && (
                  <>
                    {['Galaxy S24 Ultra', 'Galaxy S23', 'Galaxy S22 Ultra'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModel(m)}
                        className={`p-3 rounded-none text-xs font-mono font-bold border transition-all text-left uppercase ${
                          model === m
                            ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                            : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </>
                )}
                {brand === 'Google' && (
                  <>
                    {['Pixel 8 Pro', 'Pixel 7a'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModel(m)}
                        className={`p-3 rounded-none text-xs font-mono font-bold border transition-all text-left uppercase ${
                          model === m
                            ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                            : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </>
                )}
                {!['Apple', 'Samsung', 'Google'].includes(brand) && (
                  <button
                    type="button"
                    className="p-3 rounded-none text-xs font-mono font-bold bg-[#0A0A0A] text-[#C0FF00] border border-black"
                  >
                    {model}
                  </button>
                )}
              </div>
            </div>

            {/* Storage Selection */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/50 tracking-wider block mb-2">
                3. Storage Capacity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['128GB', '256GB', '512GB'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStorage(st)}
                    className={`py-3 rounded-none text-xs font-mono font-bold border transition-all uppercase ${
                      storage === st
                        ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                        : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1 Next Button */}
            <div className="pt-6 border-t border-black/10 flex items-center justify-between font-mono">
              <div className="text-xs text-black/60">
                Est. Baseline: <strong className="text-[#0A0A0A]">{formatBDT(estimatedValue)}</strong>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-none bg-[#0A0A0A] hover:bg-black text-[#C0FF00] text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 border border-black transition-colors"
              >
                <span>Continue to Physical Condition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PHYSICAL & FUNCTIONAL CONDITION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Screen State */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/60 tracking-wider block mb-2">
                1. Screen & Display Quality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'flawless', label: 'Flawless', desc: 'Zero scratches, perfect touch' },
                  { id: 'light-scratches', label: 'Light Scratches', desc: 'Hairlines only, no cracks' },
                  { id: 'cracked', label: 'Cracked Glass', desc: 'Glass cracked, but touch functions' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScreenState(s.id as any)}
                    className={`p-4 rounded-none border text-left transition-all ${
                      screenState === s.id
                        ? 'bg-[#0A0A0A] text-white border-black'
                        : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="font-display font-bold text-xs uppercase">{s.label}</div>
                    <div
                      className={`text-[10px] font-mono mt-1 ${
                        screenState === s.id ? 'text-white/60' : 'text-black/50'
                      }`}
                    >
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chassis / Body */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/60 tracking-wider block mb-2">
                2. Body & Frame Cosmetics
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'flawless', label: 'Pristine (No Dents)', desc: 'Looks like it lived in a case' },
                  { id: 'light-wear', label: 'Minor Scuffs', desc: 'Slight rubbing on corners' },
                  { id: 'dents', label: 'Heavy Scratches / Dents', desc: 'Noticeable drop marks' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBodyState(b.id as any)}
                    className={`p-4 rounded-none border text-left transition-all ${
                      bodyState === b.id
                        ? 'bg-[#0A0A0A] text-white border-black'
                        : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="font-display font-bold text-xs uppercase">{b.label}</div>
                    <div
                      className={`text-[10px] font-mono mt-1 ${
                        bodyState === b.id ? 'text-white/60' : 'text-black/50'
                      }`}
                    >
                      {b.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Functional Status */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/60 tracking-wider block mb-2">
                3. Functional Systems (Cameras, Battery, Face ID)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'all-working', label: '100% Fully Functional', desc: 'All cameras, Face ID, mics work' },
                  { id: 'battery-low', label: 'Low Battery (<80%)', desc: 'Discharges quickly' },
                  { id: 'camera-issue', label: 'Camera / Speaker Issue', desc: 'Minor hardware defect' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFunctionalState(f.id as any)}
                    className={`p-4 rounded-none border text-left transition-all ${
                      functionalState === f.id
                        ? 'bg-[#0A0A0A] text-white border-black'
                        : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="font-display font-bold text-xs uppercase">{f.label}</div>
                    <div
                      className={`text-[10px] font-mono mt-1 ${
                        functionalState === f.id ? 'text-white/60' : 'text-black/50'
                      }`}
                    >
                      {f.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Valuation Box */}
            <div className="p-5 rounded-none bg-[#0A0A0A] text-white border border-black flex items-center justify-between font-mono">
              <div>
                <span className="text-[10px] text-[#C0FF00] block uppercase tracking-widest font-bold">
                  Updated Live Valuation
                </span>
                <span className="text-2xl font-display font-black text-white">
                  {formatBDT(estimatedValue)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 block uppercase">Or Store Credit</span>
                <span className="text-sm font-bold text-[#C0FF00]">
                  {formatBDT(storeCreditValue)} (+৳1,500 bonus)
                </span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-black/10 flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-none border border-black text-xs font-bold text-[#0A0A0A] hover:bg-[#F5F4F0] flex items-center gap-2 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-none bg-[#0A0A0A] hover:bg-black text-[#C0FF00] text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 border border-black transition-colors"
              >
                <span>Continue to Payout & Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYOUT METHOD & PICKUP DETAILS */}
        {step === 3 && (
          <form onSubmit={handleSubmitBuyback} className="space-y-6 animate-in fade-in duration-200">
            {/* Payout Options */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-black/60 tracking-wider block mb-2">
                1. How do you want to receive payment?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                {[
                  { id: 'bkash', label: 'bKash Wallet', note: 'Instant transfer' },
                  { id: 'nagad', label: 'Nagad Wallet', note: 'Instant transfer' },
                  { id: 'bank', label: 'Bank Transfer', note: 'Direct NEFT/EFTN' },
                  { id: 'credit', label: 'RE:PHONE Credit', note: '+৳1,500 bonus' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayoutMethod(p.id as any)}
                    className={`p-3 rounded-none border text-left transition-all ${
                      payoutMethod === p.id
                        ? 'bg-[#0A0A0A] text-white border-black'
                        : 'bg-[#F5F4F0] text-[#0A0A0A] border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="font-bold text-xs">{p.label}</div>
                    <div
                      className={`text-[9px] mt-0.5 uppercase ${
                        payoutMethod === p.id ? 'text-[#C0FF00]' : 'text-black/50'
                      }`}
                    >
                      {p.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Number Input */}
            <div className="font-mono">
              <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">
                {payoutMethod === 'bkash' && 'bKash Mobile Number'}
                {payoutMethod === 'nagad' && 'Nagad Mobile Number'}
                {payoutMethod === 'bank' && 'Bank Account & Branch Details'}
                {payoutMethod === 'credit' && 'RE:PHONE Account Email / Phone'}
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 017XXXXXXXX"
                className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
              />
            </div>

            {/* Contact & Doorstep Pickup Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div>
                <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#F5F4F0] border border-black/15 rounded-none px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="font-mono">
              <label className="text-[10px] font-bold uppercase text-black/60 block mb-1">
                Dhaka Doorstep Pickup Address
              </label>
              <textarea
                required
                rows={2}
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full bg-[#F5F4F0] border border-black/15 rounded-none p-3 text-xs font-medium text-[#0A0A0A] outline-none focus:border-black"
              />
              <span className="text-[10px] text-black/50 mt-1 block">
                Our courier will call to schedule a pickup window. You can also drop it off at Motaleb Plaza or Bashundhara City hubs.
              </span>
            </div>

            {/* Device Preparation Instructions Checklist */}
            <div className="p-4 rounded-none bg-[#F5F4F0] border border-black/15 space-y-2 text-xs text-[#0A0A0A] font-mono">
              <span className="font-bold block uppercase text-[10px] tracking-wider">
                Before handing over your phone:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-black/70">
                <li>Back up your photos & contacts to cloud or PC</li>
                <li>Sign out of Apple ID / iCloud or Google Account & disable Find My</li>
                <li>Remove your SIM card and external memory card</li>
              </ul>
            </div>

            {/* Final Submit Button */}
            <div className="pt-6 border-t border-black/10 flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-none border border-black text-xs font-bold text-[#0A0A0A] hover:bg-[#F5F4F0] flex items-center gap-2 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="submit"
                className="py-3.5 px-8 rounded-none bg-[#C0FF00] hover:bg-white text-[#0A0A0A] text-xs font-display font-black uppercase tracking-wider flex items-center gap-2 border border-black transition-colors"
              >
                <span>Confirm Buyback · {formatBDT(payoutMethod === 'credit' ? storeCreditValue : estimatedValue)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUBMITTED CONFIRMATION */}
        {step === 4 && submittedId && (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#C0FF00] text-[#0A0A0A] border border-black rounded-none flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-[#C0FF00] bg-[#0A0A0A] px-3 py-1 rounded-none uppercase tracking-widest border border-black">
                Buyback Booking Confirmed
              </span>
              <h2 className="text-3xl font-display font-black text-[#0A0A0A] uppercase mt-4">
                Your Pickup is Scheduled!
              </h2>
              <p className="text-xs sm:text-sm text-black/60 font-mono mt-2 max-w-md mx-auto">
                Tracking Reference: <strong className="text-[#0A0A0A] bg-[#C0FF00] px-1">{submittedId}</strong>.
                Our logistics representative will contact {customerPhone} within 2 hours.
              </p>
            </div>

            {/* Order Recap Box */}
            <div className="bg-[#F5F4F0] border border-black/10 p-6 rounded-none max-w-md mx-auto text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-black/50 uppercase text-[10px]">Device:</span>
                <span className="font-bold text-[#0A0A0A]">{brand} {model} ({storage})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50 uppercase text-[10px]">Pickup Address:</span>
                <span className="font-medium text-[#0A0A0A] text-right truncate max-w-[200px]">{pickupAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50 uppercase text-[10px]">Payment Channel:</span>
                <span className="font-bold uppercase text-[#0A0A0A]">{payoutMethod} ({accountNumber})</span>
              </div>
              <div className="border-t border-black/10 pt-2 flex justify-between text-sm">
                <span className="font-bold uppercase text-[11px] text-black/60">Expected Payout:</span>
                <span className="font-display font-black text-[#0A0A0A] text-lg">
                  {formatBDT(payoutMethod === 'credit' ? storeCreditValue : estimatedValue)}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/phones"
                className="w-full sm:w-auto px-6 py-3 rounded-none bg-[#0A0A0A] text-[#C0FF00] font-display font-bold text-xs uppercase tracking-wider border border-black"
              >
                Browse Upgrades on RE:PHONE
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSubmittedId(null);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-none border border-black text-[#0A0A0A] hover:bg-[#F5F4F0] font-display font-bold text-xs uppercase tracking-wider"
              >
                Sell Another Phone
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Re:Phone Buyback Guarantees */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono text-[#0A0A0A]">
        <div className="p-5 bg-[#FDFCF9] rounded-none border border-black/10">
          <ShieldCheck className="w-5 h-5 text-[#0A0A0A] mb-2" />
          <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">NIST-800 Certified Data Wipe</h4>
          <p className="leading-relaxed text-black/60">
            Every phone undergoes high-security binary zero-filling so zero personal trace remains.
          </p>
        </div>
        <div className="p-5 bg-[#FDFCF9] rounded-none border border-black/10">
          <Banknote className="w-5 h-5 text-[#0A0A0A] mb-2" />
          <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">No Haggling at Your Door</h4>
          <p className="leading-relaxed text-black/60">
            The quote generated online is the price you receive as long as the phone matches your selections.
          </p>
        </div>
        <div className="p-5 bg-[#FDFCF9] rounded-none border border-black/10">
          <Truck className="w-5 h-5 text-[#0A0A0A] mb-2" />
          <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1 uppercase">100% Free Doorstep Courier</h4>
          <p className="leading-relaxed text-black/60">
            Zero transit cost. If you change your mind after the lab diagnostic, we return the phone free.
          </p>
        </div>
      </div>
    </div>
  );
};
