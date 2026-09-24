'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Shield,
  Sparkles,
  ArrowRight,
  ChevronRight,
  User,
  Mail,
  Phone,
  BookOpen,
} from 'lucide-react';
import { useRegisterForEvent, useSettingsMap } from '@/hooks/use-api';

interface RegistrationContext {
  type: 'event' | 'workshop' | 'programme' | 'general';
  eventTitle?: string;
  eventSlug?: string;
  eventId?: string;
  eventImage?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  category?: string;
}

interface RegistrationModalContextType {
  isOpen: boolean;
  context: RegistrationContext;
  openModal: (ctx?: RegistrationContext) => void;
  closeModal: () => void;
}

const RegistrationModalContext = createContext<RegistrationModalContextType>({
  isOpen: false,
  context: { type: 'general' },
  openModal: () => {},
  closeModal: () => {},
});

export function useRegistrationModal() {
  return useContext(RegistrationModalContext);
}

const interestsFallback = [
  'Mental Health Awareness',
  'Community Support',
  'Professional Referral',
  'School Programme',
  'Workplace Wellness',
  'Volunteering',
  'Partnership',
  'Other',
];

export function RegistrationModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<RegistrationContext>({ type: 'general' });

  const openModal = useCallback((ctx?: RegistrationContext) => {
    if (ctx) setContext(ctx);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <RegistrationModalContext.Provider value={{ isOpen, context, openModal, closeModal }}>
      {children}
      {isOpen && <RegistrationModal />}
    </RegistrationModalContext.Provider>
  );
}

function RegistrationModal() {
  const { get, getJSON } = useSettingsMap();
  const interests = getJSON<string[]>('registration_interests', interestsFallback);
  const { context, closeModal } = useRegistrationModal();
  const { submit: submitRegistration, error: registrationError } = useRegisterForEvent();
  const [step, setStep] = useState<'info' | 'preferences' | 'success'>('info');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisation: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [hearAbout, setHearAbout] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const handleRegister = async () => {
    if (context.type === 'event' && !context.eventId) {
      setStep('success');
      return;
    }
    setIsProcessing(true);
    const ok = await submitRegistration({
      eventId: context.eventId || '',
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone || undefined,
      ticketType: context.type,
      notes: `Interests: ${selectedInterests.join(', ') || 'None'}. Heard via: ${hearAbout || 'Not specified'}${formData.organisation ? `. Organisation: ${formData.organisation}` : ''}`,
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
          <SuccessStep context={context} formData={formData} onClose={closeModal} />
        ) : (
          <>
            {/* Header with context */}
            <div className="relative overflow-hidden bg-[#1A2332] p-6 pb-8">
              {context.type === 'event' && context.eventImage && (
                <div className="absolute inset-0 opacity-20">
                  <Image src={context.eventImage} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-semibold text-primary">
                  <Shield className="h-3 w-3" />
                  Free Registration
                </div>
                <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl">
                  {context.type === 'event' && context.eventTitle
                    ? `Register: ${context.eventTitle}`
                    : 'Register for Event'}
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                  {context.type === 'event'
                    ? 'Secure your spot at this event. All events are free and open to the public.'
                    : 'Register your interest and we will keep you updated on upcoming events and programmes.'}
                </p>

                {/* Event details for event registrations */}
                {context.type === 'event' && (
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
                    {context.eventDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {context.eventDate}
                      </span>
                    )}
                    {context.eventTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {context.eventTime}
                      </span>
                    )}
                    {context.eventLocation && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {context.eventLocation}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {step === 'info' && (
                <InfoStep
                  formData={formData}
                  setFormData={setFormData}
                  context={context}
                  onNext={() => setStep('preferences')}
                />
              )}
              {step === 'preferences' && (
                <PreferencesStep
                  selectedInterests={selectedInterests}
                  toggleInterest={toggleInterest}
                  hearAbout={hearAbout}
                  setHearAbout={setHearAbout}
                  formData={formData}
                  context={context}
                  isProcessing={isProcessing}
                  error={registrationError}
                  onBack={() => setStep('info')}
                  onRegister={handleRegister}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoStep({
  formData,
  setFormData,
  context,
  onNext,
}: {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organisation: string;
  };
  setFormData: (v: typeof formData) => void;
  context: RegistrationContext;
  onNext: () => void;
}) {
  const isValid = formData.firstName && formData.lastName && formData.email;

  return (
    <div className="space-y-5">
      {/* Event summary for event registrations */}
      {context.type === 'event' && (
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-heading text-sm text-[#1A2332]">{context.eventTitle}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-[#1A2332]/50">
                {context.eventDate && <span>{context.eventDate}</span>}
                {context.eventTime && (
                  <>
                    <span>·</span>
                    <span>{context.eventTime}</span>
                  </>
                )}
              </div>
              {context.eventLocation && (
                <p className="mt-1 flex items-center gap-1 text-[10px] text-[#1A2332]/50">
                  <MapPin className="h-2.5 w-2.5" />
                  {context.eventLocation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personal Info */}
      <div>
        <h3 className="font-heading text-base text-[#1A2332]">Your Information</h3>
        <p className="mt-1 text-xs text-[#1A2332]/50">
          We&apos;ll use this to confirm your registration and send you updates.
        </p>
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#1A2332]/70">First Name *</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A2332]/30" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] py-3 pl-10 pr-4 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="First name"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1A2332]/70">Last Name *</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A2332]/30" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] py-3 pl-10 pr-4 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1A2332]/70">Email Address *</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A2332]/30" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] py-3 pl-10 pr-4 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1A2332]/70">Phone Number (Optional)</label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A2332]/30" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] py-3 pl-10 pr-4 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+234..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1A2332]/70">Organisation (Optional)</label>
            <div className="relative mt-1">
              <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A2332]/30" />
              <input
                type="text"
                value={formData.organisation}
                onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                className="w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] py-3 pl-10 pr-4 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Company or school name"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A2332] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function PreferencesStep({
  selectedInterests,
  toggleInterest,
  hearAbout,
  setHearAbout,
  formData,
  context,
  isProcessing,
  error,
  onBack,
  onRegister,
}: {
  selectedInterests: string[];
  toggleInterest: (interest: string) => void;
  hearAbout: string;
  setHearAbout: (v: string) => void;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organisation: string;
  };
  context: RegistrationContext;
  isProcessing: boolean;
  error: string | null;
  onBack: () => void;
  onRegister: () => void;
}) {
  const { getJSON } = useSettingsMap();
  const interests = getJSON<string[]>('registration_interests', interestsFallback);
  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-xl bg-[#F8F9FA] p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-[#1A2332]">
            Registering as {formData.firstName} {formData.lastName}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#1A2332]/50">{formData.email}</p>
      </div>

      {/* Interests */}
      <div>
        <h3 className="font-heading text-base text-[#1A2332]">What Interests You?</h3>
        <p className="mt-1 text-xs text-[#1A2332]/50">
          Select all that apply so we can personalise your experience.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedInterests.includes(interest)
                  ? 'border-primary bg-primary text-[#1A2332]'
                  : 'border-[#1A2332]/10 bg-white text-[#1A2332]/60 hover:border-primary/30'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* How did you hear about us */}
      <div>
        <label className="block text-sm font-medium text-[#1A2332]">How did you hear about us?</label>
        <select
          value={hearAbout}
          onChange={(e) => setHearAbout(e.target.value)}
          className="mt-2 w-full appearance-none rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select an option</option>
          <option value="social-media">Social Media</option>
          <option value="friend">Friend or Family</option>
          <option value="community">Community Forum</option>
          <option value="school">School/University</option>
          <option value="workplace">Workplace</option>
          <option value="media">News/Media</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Terms */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <p className="text-xs text-[#1A2332]/60">
          By registering, you agree to receive event updates via email and SMS. You can
          unsubscribe at any time. We respect your privacy and will never share your information.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-600">{error}</p>
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
          onClick={onRegister}
          disabled={isProcessing}
          className="btn-ripple flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A2332] border-t-transparent" />
              Registering...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Complete Registration
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessStep({
  context,
  formData,
  onClose,
}: {
  context: RegistrationContext;
  formData: { firstName: string; lastName: string; email: string };
  onClose: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 font-heading text-2xl text-[#1A2332]">You&apos;re Registered!</h2>
      <p className="mt-3 text-sm text-[#1A2332]/60">
        Thank you, <span className="font-semibold text-primary">{formData.firstName}</span>.
        {context.type === 'event' && context.eventTitle ? (
          <>
            {' '}You are registered for{' '}
            <span className="font-semibold text-primary">{context.eventTitle}</span>.
          </>
        ) : (
          <> We&apos;ll keep you updated on upcoming events and programmes.</>
        )}
      </p>

      {context.type === 'event' && (
        <div className="mt-6 rounded-xl bg-[#F8F9FA] p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A2332]/40">
            Event Details
          </p>
          <div className="mt-3 space-y-2">
            {context.eventDate && (
              <div className="flex items-center gap-2 text-sm text-[#1A2332]/70">
                <Calendar className="h-4 w-4 text-primary" />
                {context.eventDate}
              </div>
            )}
            {context.eventTime && (
              <div className="flex items-center gap-2 text-sm text-[#1A2332]/70">
                <Clock className="h-4 w-4 text-primary" />
                {context.eventTime}
              </div>
            )}
            {context.eventLocation && (
              <div className="flex items-center gap-2 text-sm text-[#1A2332]/70">
                <MapPin className="h-4 w-4 text-primary" />
                {context.eventLocation}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-primary/5 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-[#1A2332]">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">What&apos;s Next?</span>
        </div>
        <p className="mt-1 text-xs text-[#1A2332]/60">
          A confirmation email has been sent to{' '}
          <span className="font-medium">{formData.email}</span>. Please check your inbox for event
          details and any preparation needed.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-[#1A2332] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332]"
        >
          Done
        </button>
        {context.type === 'event' && context.eventSlug && (
          <Link
            href={`/events/${context.eventSlug}`}
            className="flex-1 rounded-xl border border-[#1A2332]/10 px-6 py-3 text-center text-sm font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
          >
            View Event Details
          </Link>
        )}
      </div>
    </div>
  );
}
