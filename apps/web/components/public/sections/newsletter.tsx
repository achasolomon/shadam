'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { useSubscribe, useSettingsMap } from '@/hooks/use-api';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const { subscribe, loading, error } = useSubscribe();
  const { get } = useSettingsMap();

  const title = get('newsletter_title', 'Stay Updated');
  const text = get('newsletter_text', 'Get the latest news, mental health resources and upcoming events.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await subscribe(email);
    if (ok) {
      setMessage('Thank you for subscribing!');
      setMessageType('success');
      setEmail('');
    } else {
      setMessage(error || 'Something went wrong. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <section className="bg-dark py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {text}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full gap-3 md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-lg border border-dark-secondary bg-dark-secondary px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:w-72"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-ripple inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" /> {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </ScrollReveal>
        {message && (
          <p className={`mt-4 text-center text-sm md:text-right animate-on-scroll is-visible ${messageType === 'error' ? 'text-red-400' : 'text-success'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
