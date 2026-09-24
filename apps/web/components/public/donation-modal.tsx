'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Heart,
  CheckCircle2,
  CreditCard,
  Shield,
  Sparkles,
  ChevronDown,
  ArrowRight,
  DollarSign,
  Users,
  Target,
} from 'lucide-react';
import { useSubmitDonation, useSettingsMap } from '@/hooks/use-api';

interface DonationContext {
  type: 'project' | 'general' | 'vulnerable' | 'referral';
  projectName?: string;
  projectSlug?: string;
  projectImage?: string;
  raised?: number;
  goal?: number;
}

interface DonationModalContextType {
  isOpen: boolean;
  context: DonationContext;
  openModal: (ctx?: DonationContext) => void;
  closeModal: () => void;
}

const DonationModalContext = createContext<DonationModalContextType>({
  isOpen: false,
  context: { type: 'general' },
  openModal: () => {},
  closeModal: () => {},
});

export function useDonationModal() {
  return useContext(DonationModalContext);
}

const presetAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

const frequencyOptions = ['One-time', 'Monthly', 'Quarterly', 'Annually'];

const impactLevels = [
  { amount: 5000, impact: 'Provides counselling for 1 person' },
  { amount: 10000, impact: 'Funds a community workshop session' },
  { amount: 25000, impact: 'Supports a month of peer support group' },
  { amount: 50000, impact: 'Trains 10 community health workers' },
  { amount: 100000, impact: 'Sponsors a month of outreach programme' },
  { amount: 250000, impact: 'Funds a full school mental health programme' },
];

export function DonationModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<DonationContext>({ type: 'general' });

  const openModal = useCallback((ctx?: DonationContext) => {
    if (ctx) setContext(ctx);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DonationModalContext.Provider value={{ isOpen, context, openModal, closeModal }}>
      {children}
      {isOpen && <DonationModal />}
    </DonationModalContext.Provider>
  );
}

function DonationModal() {
  const { context, closeModal } = useDonationModal();
  const { submit: submitDonation, error: donationError } = useSubmitDonation();
  const [step, setStep] = useState<'amount' | 'info' | 'payment' | 'success'>('amount');
  const [amount, setAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('One-time');
  const [showFrequency, setShowFrequency] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const effectiveAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const currentImpact = [...impactLevels].reverse().find((l) => effectiveAmount >= l.amount) || impactLevels[0];

  const pct = context.raised && context.goal ? Math.round((context.raised / context.goal) * 100) : null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [closeModal]);

  const handleDonate = async () => {
    setIsProcessing(true);
    const donorName = `${formData.firstName} ${formData.lastName}`.trim();
    const ok = await submitDonation({
      donorName,
      donorEmail: formData.email,
      amount: effectiveAmount,
      currency: 'NGN',
      frequency: frequency.toLowerCase().replace('-', '_'),
      method: 'bank_transfer',
      projectId: context.type === 'project' ? context.projectSlug : undefined,
    });
    setIsProcessing(false);
    if (ok) {
      setStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1A2332]/60 shadow-sm transition-all hover:bg-white hover:text-[#1A2332]"
        >
          <X className="h-4 w-4" />
        </button>

        {step === 'success' ? (
          <SuccessStep context={context} amount={effectiveAmount} onClose={closeModal} />
        ) : (
          <>
            {/* Header with context */}
            <div className="relative overflow-hidden bg-[#1A2332] p-6 pb-8">
              {context.type === 'project' && context.projectImage && (
                <div className="absolute inset-0 opacity-20">
                  <Image src={context.projectImage} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-semibold text-primary">
                  <Shield className="h-3 w-3" />
                  100% Secure Donation
                </div>
                <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl">
                  {context.type === 'project' && context.projectName
                    ? `Support: ${context.projectName}`
                    : 'Support Our Cause'}
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                  {context.type === 'project'
                    ? 'Your donation directly supports this project and helps us reach more people.'
                    : 'Help our organisation by donating today. Donations go to making a difference for our cause.'}
                </p>

                {/* Progress bar for project donations */}
                {pct !== null && context.raised !== undefined && context.goal !== undefined && (
                  <div className="mt-4 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-heading text-primary">₦{(context.raised / 1000000).toFixed(1)}M</p>
                        <p className="text-[10px] text-gray-400">Raised</p>
                      </div>
                      <div>
                        <p className="text-lg font-heading text-white">{pct}%</p>
                        <p className="text-[10px] text-gray-400">Funded</p>
                      </div>
                      <div>
                        <p className="text-lg font-heading text-white">₦{(context.goal / 1000000).toFixed(1)}M</p>
                        <p className="text-[10px] text-gray-400">Goal</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {step === 'amount' && (
                <AmountStep
                  amount={amount}
                  setAmount={setAmount}
                  customAmount={customAmount}
                  setCustomAmount={setCustomAmount}
                  frequency={frequency}
                  setFrequency={setFrequency}
                  showFrequency={showFrequency}
                  setShowFrequency={setShowFrequency}
                  impact={currentImpact}
                  onNext={() => setStep('info')}
                />
              )}
              {step === 'info' && (
                <InfoStep
                  formData={formData}
                  setFormData={setFormData}
                  amount={effectiveAmount}
                  frequency={frequency}
                  context={context}
                  onBack={() => setStep('amount')}
                  onNext={() => setStep('payment')}
                />
              )}
{step === 'payment' && (
        <PaymentStep
          amount={effectiveAmount}
          frequency={frequency}
          context={context}
          isProcessing={isProcessing}
          error={donationError}
          onBack={() => setStep('info')}
          onDonate={handleDonate}
        />
      )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AmountStep({
  amount,
  setAmount,
  customAmount,
  setCustomAmount,
  frequency,
  setFrequency,
  showFrequency,
  setShowFrequency,
  impact,
  onNext,
}: {
  amount: number;
  setAmount: (v: number) => void;
  customAmount: string;
  setCustomAmount: (v: string) => void;
  frequency: string;
  setFrequency: (v: string) => void;
  showFrequency: boolean;
  setShowFrequency: (v: boolean) => void;
  impact: { amount: number; impact: string };
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Impact preview */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#1A2332]">Your Impact</p>
            <p className="mt-0.5 text-sm text-[#1A2332]/60">{impact.impact}</p>
          </div>
        </div>
      </div>

      {/* Amount selection */}
      <div>
        <label className="block text-sm font-medium text-[#1A2332]">
          Donation Amount <span className="text-red-500">*</span>
        </label>
        <p className="mt-1 text-xs text-[#1A2332]/50">
          All donations directly impact our organisation and help us further our mission.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {presetAmounts.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAmount(a);
                setCustomAmount('');
              }}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                amount === a && !customAmount
                  ? 'border-primary bg-primary text-[#1A2332] shadow-lg shadow-primary/20'
                  : 'border-[#1A2332]/10 bg-white text-[#1A2332] hover:border-primary/30'
              }`}
            >
              ₦{a.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="relative mt-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#1A2332]/40">₦</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(0);
            }}
            className="w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] py-3 pl-8 pr-4 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-[#1A2332]">Giving Frequency</label>
        <div className="relative mt-2">
          <button
            onClick={() => setShowFrequency(!showFrequency)}
            className="flex w-full items-center justify-between rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] transition-all duration-200 hover:border-primary/30"
          >
            {frequency}
            <ChevronDown className={`h-4 w-4 text-[#1A2332]/40 transition-transform ${showFrequency ? 'rotate-180' : ''}`} />
          </button>
          {showFrequency && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-[#1A2332]/10 bg-white shadow-lg">
              {frequencyOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFrequency(f);
                    setShowFrequency(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary/5 ${
                    frequency === f ? 'text-primary font-medium' : 'text-[#1A2332]'
                  }`}
                >
                  {f}
                  {frequency === f && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!customAmount && amount === 0}
        className="btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A2332] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function InfoStep({
  formData,
  setFormData,
  amount,
  frequency,
  context,
  onBack,
  onNext,
}: {
  formData: { firstName: string; lastName: string; email: string };
  setFormData: (v: { firstName: string; lastName: string; email: string }) => void;
  amount: number;
  frequency: string;
  context: DonationContext;
  onBack: () => void;
  onNext: () => void;
}) {
  const isValid = formData.firstName && formData.lastName && formData.email;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-xl bg-[#F8F9FA] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1A2332]/50">Donation Amount</span>
          <span className="font-heading text-lg text-[#1A2332]">₦{amount.toLocaleString()}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-[#1A2332]/50">Frequency</span>
          <span className="text-sm font-medium text-[#1A2332]">{frequency}</span>
        </div>
        {context.type === 'project' && context.projectName && (
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-[#1A2332]/50">Project</span>
            <span className="text-sm font-medium text-primary max-w-[200px] text-right truncate">{context.projectName}</span>
          </div>
        )}
      </div>

      {/* Donor info */}
      <div>
        <h3 className="font-heading text-base text-[#1A2332]">Who&apos;s Giving Today?</h3>
        <p className="mt-1 text-xs text-[#1A2332]/50">
          We&apos;ll never share this information with anyone.
        </p>
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#1A2332]/70">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1A2332]/70">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1A2332]/70">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-[#1A2332]/10 px-6 py-3.5 text-sm font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="btn-ripple flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A2332] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PaymentStep({
  amount,
  frequency,
  context,
  isProcessing,
  error,
  onBack,
  onDonate,
}: {
  amount: number;
  frequency: string;
  context: DonationContext;
  isProcessing: boolean;
  error: string | null;
  onBack: () => void;
  onDonate: () => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'card' | 'paypal'>('bank');
  const [copied, setCopied] = useState(false);
  const { get } = useSettingsMap();

  const bankDetails = {
    bank: get('donation_bank_name', 'Guaranty Trust Bank (GTBank)'),
    accountName: get('donation_account_name', 'SHEDAM Mental Health Initiative'),
    accountNumber: get('donation_account_number', '0123456789'),
    sortCode: get('donation_sort_code', '058'),
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-xl border border-[#1A2332]/5 bg-[#F8F9FA] p-5">
        <h3 className="font-heading text-base text-[#1A2332]">Donation Summary</h3>
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#1A2332]/50">Payment Amount</span>
            <span className="font-heading text-lg text-[#1A2332]">₦{amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#1A2332]/50">Giving Frequency</span>
            <span className="text-sm font-medium text-[#1A2332]">{frequency}</span>
          </div>
          {context.type === 'project' && context.projectName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#1A2332]/50">Project</span>
              <span className="text-sm font-medium text-primary">{context.projectName}</span>
            </div>
          )}
          <div className="border-t border-[#1A2332]/5 pt-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A2332]">Donation Total</span>
              <span className="font-heading text-xl text-primary">₦{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <h3 className="font-heading text-base text-[#1A2332]">Payment Method</h3>
        <p className="mt-1 text-xs text-[#1A2332]/50">How would you like to pay for your donation?</p>

        <div className="mt-3 space-y-2">
          {/* Bank Transfer - Primary */}
          <button
            onClick={() => setSelectedMethod('bank')}
            className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all ${
              selectedMethod === 'bank'
                ? 'border-primary bg-primary/5'
                : 'border-[#1A2332]/10 hover:border-primary/30'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A2332]">
              <span className="text-xs font-bold text-white">GT</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#1A2332]">Bank Transfer</p>
              <p className="text-[10px] text-[#1A2332]/40">Transfer directly to our bank account</p>
            </div>
            {selectedMethod === 'bank' && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
          </button>

          {/* Card Payment */}
          <button
            onClick={() => setSelectedMethod('card')}
            className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all ${
              selectedMethod === 'card'
                ? 'border-primary bg-primary/5'
                : 'border-[#1A2332]/10 hover:border-primary/30'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A2E]">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#1A2332]">Card Payment</p>
              <p className="text-[10px] text-[#1A2332]/40">Visa, Mastercard, Verve</p>
            </div>
            {selectedMethod === 'card' && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
          </button>
        </div>
      </div>

      {/* Bank Details - shown when bank transfer selected */}
      {selectedMethod === 'bank' && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A2332]">
              <span className="text-[10px] font-bold text-white">GT</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A2332]">{bankDetails.bank}</p>
              <p className="text-[10px] text-[#1A2332]/40">Account Details</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white p-3">
              <div>
                <p className="text-[10px] text-[#1A2332]/40">Account Name</p>
                <p className="text-sm font-medium text-[#1A2332]">{bankDetails.accountName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white p-3">
              <div>
                <p className="text-[10px] text-[#1A2332]/40">Account Number</p>
                <p className="font-heading text-lg tracking-wider text-[#1A2332]">{bankDetails.accountNumber}</p>
              </div>
              <button
                onClick={copyAccount}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-700">
              <strong>Important:</strong> After transferring, please send your proof of payment to{' '}
              <a href="https://wa.me/2348051772262" target="_blank" rel="noopener noreferrer" className="font-medium underline">
                WhatsApp
              </a>{' '}
              or email <a href="mailto:support@shedam.org" className="font-medium underline">support@shedam.org</a> with your name and amount.
            </p>
          </div>
        </div>
      )}

      {/* Card Payment info */}
      {selectedMethod === 'card' && (
        <div className="rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] p-5 text-center">
          <CreditCard className="mx-auto h-8 w-8 text-[#1A2332]/30" />
          <p className="mt-2 text-sm text-[#1A2332]/60">
            Card payment integration coming soon. For now, please use bank transfer.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 rounded-xl border border-[#1A2332]/10 px-6 py-3.5 text-sm font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onDonate}
          disabled={isProcessing || selectedMethod !== 'bank'}
          className="btn-ripple flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A2332] border-t-transparent" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              I&apos;ve Made the Transfer
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-600">Unable to record your donation pledge. Please try again or contact <a href="mailto:support@shedam.org" className="font-medium underline">support@shedam.org</a>.</p>
        </div>
      )}

      <p className="text-center text-[10px] text-[#1A2332]/30">
        <Shield className="inline h-3 w-3" /> Your donation is secure. We will confirm your transfer within 24 hours.
      </p>
    </div>
  );
}

function SuccessStep({
  context,
  amount,
  onClose,
}: {
  context: DonationContext;
  amount: number;
  onClose: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 font-heading text-2xl text-[#1A2332]">Thank You!</h2>
      <p className="mt-3 text-sm text-[#1A2332]/60">
        Your donation of <span className="font-semibold text-primary">₦{amount.toLocaleString()}</span> has been received.
        {context.type === 'project' && context.projectName && (
          <> You are supporting <span className="font-semibold text-primary">{context.projectName}</span>.</>
        )}
      </p>
      <p className="mt-2 text-xs text-[#1A2332]/40">
        A receipt will be sent to your email address.
      </p>

      <div className="mt-8 rounded-xl bg-primary/5 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-[#1A2332]">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">Your Impact</span>
        </div>
        <p className="mt-1 text-xs text-[#1A2332]/60">
          {amount >= 100000
            ? 'You are funding a full programme that will transform lives.'
            : amount >= 25000
            ? 'You are supporting ongoing care for multiple individuals.'
            : 'Every contribution makes a real difference in someone\'s life.'}
        </p>
      </div>

      <button
        onClick={onClose}
        className="mt-8 rounded-xl bg-[#1A2332] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332]"
      >
        Done
      </button>
    </div>
  );
}
