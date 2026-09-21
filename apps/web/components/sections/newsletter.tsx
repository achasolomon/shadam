'use client';

import React, { useState } from 'react';
import { Container } from '@smhi/ui';
import { Send } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // TODO: Implement actual subscription API call
    setTimeout(() => {
      setMessage('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="bg-dark py-12 lg:py-16">
      <Container>
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">Stay Updated</h2>
            <p className="mt-1 text-sm text-gray-400">
              Get the latest news, mental health resources and upcoming events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full gap-3 md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-lg border border-dark-secondary bg-dark-secondary px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:w-72"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-success md:text-right">{message}</p>
        )}
      </Container>
    </section>
  );
}
