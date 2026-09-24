'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useSettingsMap } from '@/hooks/use-api';

const contactChannels = [
  {
    icon: Phone,
    title: 'Phone',
    value: '0805 177 2262',
    href: 'tel:+2348051772262',
    description: 'Call us during office hours',
    color: '#88E788',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@shedam.org',
    href: 'mailto:info@shedam.org',
    description: 'We reply within 24 hours',
    color: '#3B82F6',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://wa.me/2348051772262',
    description: 'Instant support on WhatsApp',
    color: '#25D366',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'Kubwa, Bwari Area Council',
    href: 'https://maps.google.com/?q=Kubwa+Bwari+Area+Council+Abuja+Nigeria',
    description: 'FCT Abuja, Nigeria',
    color: '#F59E0B',
  },
];

const officeHoursFallback = [
  { day: 'Monday – Friday', time: '9:00 AM – 5:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 2:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

const faqsFallback = [
  {
    q: 'How can I get mental health support?',
    a: 'You can reach out via phone, WhatsApp or email. Our team will listen, understand your needs and connect you with the right professional or resource.',
  },
  {
    q: 'Do you offer free counselling?',
    a: 'Yes, we provide complimentary counselling sessions for individuals who cannot afford professional mental health services. Contact us to learn more.',
  },
  {
    q: 'How can I volunteer or partner with SHEDAM?',
    a: 'We welcome volunteers and partners! Use the contact form or email us at info@shedam.org with your interest and we will get back to you.',
  },
  {
    q: 'Where are you located?',
    a: 'Our office is in Kubwa, Bwari Area Council, FCT Abuja, Nigeria. We also serve communities virtually across Nigeria.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We focus on FCT Abuja and surrounding states, with virtual services available nationwide. Our community programmes reach underserved areas across Nigeria.',
  },
];

const socialDefaults = [
  { icon: Facebook, key: 'social_facebook', label: 'Facebook', href: 'https://facebook.com' },
  { icon: Instagram, key: 'social_instagram', label: 'Instagram', href: 'https://instagram.com' },
  { icon: Twitter, key: 'social_twitter', label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, key: 'social_linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
];

const subjects = [
  'General Enquiry',
  'Support Request',
  'Partnership',
  'Volunteering',
  'Media Enquiry',
  'Donation',
  'Other',
];

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return { ref: setRef, visible };
}

function Animate({
  children,
  className = '',
  animation = 'animate-fade-up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ContactContent() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const { get, getJSON } = useSettingsMap();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroEyebrow = get('contact_hero_eyebrow', 'Get in Touch');
  const heroTitle = get('contact_hero_title', 'We Are Here to');
  const heroTitleHighlight = get('contact_hero_title_highlight', 'Help');
  const heroDescription = get('contact_hero_description', 'Whether you have a question, need support, or want to partner with us, we would love to hear from you.');
  const infoTitle = get('contact_info_title', 'Let\u2019s Start a Conversation');
  const infoDescription = get('contact_info_description', 'Reach out through any of the channels below or fill in the form and we will get back to you as soon as possible.');
  const ctaTitle = get('contact_cta_title', 'Need Immediate Support?');
  const ctaDescription = get('contact_cta_description', 'If you are in crisis or need urgent help, please reach out directly through our helpline or WhatsApp.');
  const officeHours = getJSON<{ day: string; time: string }[]>('contact_office_hours', officeHoursFallback);
  const faqs = getJSON<{ q: string; a: string }[]>('contact_faqs', faqsFallback);
  const socialLinks = socialDefaults.map((s) => ({ ...s, href: get(s.key, s.href) })).filter((s) => s.href);
  const followUsTitle = get('contact_follow_title', 'Follow Us');
  const mapQuery = get('contact_map_query', 'Kubwa+Bwari+Area+Council+Abuja+Nigeria');
  const phoneDisplay = get('contact_phone', '0805 177 2262');
  const phoneRaw = get('contact_phone_raw', '+2348051772262');
  const email = get('contact_email', 'info@shedam.org');
  const address = get('contact_address', 'Kubwa, Bwari Area Council');
  const whatsapp = get('contact_whatsapp', '+2348051772262');
  const whatsappHref = 'https://wa.me/' + whatsapp.replace(/[^0-9]/g, '');

  const channels = [
    { ...contactChannels[0], value: phoneDisplay, href: `tel:${phoneRaw}` },
    { ...contactChannels[1], value: email, href: `mailto:${email}` },
    { ...contactChannels[2], href: whatsappHref },
    { ...contactChannels[3], value: address, href: `https://maps.google.com/?q=${mapQuery}` },
  ];

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await api.submitEnquiry(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] overflow-hidden bg-[#1A2332] lg:min-h-[60vh]">
        <div
          className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${
            heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        >
          <Image
            src="/images/banner/banner1.jpg"
            alt="Contact SHEDAM"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/95 via-[#1A2332]/80 to-[#1A2332]/60" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-20">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm transition-all duration-700 delay-300 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {heroEyebrow}
            </div>
            <h1
              className={`mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl transition-all duration-700 delay-500 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {heroTitle} <span className="text-primary">{heroTitleHighlight}</span>
            </h1>
            <p
              className={`mt-6 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg transition-all duration-700 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {heroDescription}
            </p>
          </div>
        </div>
        <div
          className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle"
          style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties}
        />
        <div
          className="absolute bottom-32 right-32 h-1.5 w-1.5 rounded-full bg-primary/30 float-particle"
          style={{ '--duration': '4s', '--delay': '1s' } as React.CSSProperties}
        />
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z"
            fill="#FAFAF8"
          />
        </svg>
      </div>

      {/* ── Contact Channels ── */}
      <section className="bg-warm-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <Animate key={ch.title} delay={i * 80}>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-start gap-4 rounded-2xl border border-[#1A2332]/5 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: `${ch.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: ch.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/40">
                        {ch.title}
                      </p>
                      <p className="mt-1 truncate font-heading text-sm text-[#1A2332] transition-colors duration-300 group-hover:text-primary">
                        {ch.value}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#1A2332]/40">{ch.description}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#1A2332]/20 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Animate>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="bg-warm-white pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            {/* Left: Info */}
            <div>
              <Animate>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Contact Information
                  </p>
                  <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                    {infoTitle}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#1A2332]/60">
                    {infoDescription}
                  </p>
                </div>
              </Animate>

              {/* Office Hours */}
              <Animate delay={100}>
                <div className="mt-8 rounded-2xl border border-[#1A2332]/5 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-sm text-[#1A2332]">Office Hours</h3>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {officeHours.map((oh) => (
                      <div key={oh.day} className="flex items-center justify-between text-sm">
                        <span className="text-[#1A2332]/60">{oh.day}</span>
                        <span className="font-medium text-[#1A2332]">{oh.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Social */}
              <Animate delay={200}>
                <div className="mt-6 rounded-2xl border border-[#1A2332]/5 bg-white p-5">
                  <h3 className="font-heading text-sm text-[#1A2332]">{followUsTitle}</h3>
                  <div className="mt-3 flex gap-3">
                    {socialLinks.map((s) => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A2332]/5 text-[#1A2332]/40 transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
                          aria-label={s.label}
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </Animate>

              {/* Map placeholder */}
              <Animate delay={300}>
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#1A2332]/5">
                  <div className="relative aspect-[16/9] bg-[#1A2332]/5">
                    <Image
                      src="/images/banner/banner2.jpg"
                      alt="SHEDAM Location"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1A2332]/40">
                      <a
                        href={`https://maps.google.com/?q=${mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-[#1A2332] transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </Animate>
            </div>

            {/* Right: Form */}
            <Animate delay={100}>
              <div className="rounded-2xl border border-[#1A2332]/5 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-sm text-[#1A2332]/50">
                  Fill out the form below and we will get back to you as soon as possible.
                </p>

                {status === 'success' ? (
                  <div className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="mt-4 font-heading text-lg text-[#1A2332]">Message Sent!</h3>
                    <p className="mt-2 text-sm text-[#1A2332]/60">
                      Thank you for reaching out. We will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-4 text-sm font-medium text-primary hover:text-[#6BCF6B]"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-xs font-medium text-[#1A2332]/70">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1.5 w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-medium text-[#1A2332]/70">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1.5 w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-[#1A2332]/70">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1.5 w-full rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                        placeholder="+234..."
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-xs font-medium text-[#1A2332]/70">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1.5 w-full appearance-none rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                      >
                        {subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-xs font-medium text-[#1A2332]/70">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1.5 w-full resize-none rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#1A2332] placeholder-[#1A2332]/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                        placeholder="How can we help?"
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-red-500">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A2332] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Frequently Asked Questions
              </p>
              <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                Common Questions
              </h2>
            </div>
          </Animate>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <Animate key={i} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    openFaq === i
                      ? 'border-primary/20 bg-primary/5 shadow-lg shadow-primary/5'
                      : 'border-[#1A2332]/5 bg-white hover:border-primary/10'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-heading text-sm text-[#1A2332] sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#1A2332]/40 transition-transform duration-300 ${
                        openFaq === i ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-[#1A2332]/60">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
          <div
            className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
              {ctaDescription}
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-[#1A2332] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#1A2332] hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
