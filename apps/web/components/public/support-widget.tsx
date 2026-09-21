'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, X, ExternalLink } from 'lucide-react';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 rounded-xl border border-border bg-white shadow-xl">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-dark">Need Support?</h3>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 text-text-secondary hover:bg-surface-alt">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-text-secondary">We are here to listen. Chat with us for mental health support.</p>
          </div>
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
              </span>
              <span className="text-sm text-success">Online</span>
            </div>
            <div className="space-y-2">
              <a href="https://wa.me/234XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-alt">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">Start Chat</p>
                  <p className="text-xs text-text-secondary">WhatsApp</p>
                </div>
                <ExternalLink className="ml-auto h-4 w-4 text-text-muted" />
              </a>
              <a href="tel:+234XXXXXXXXXX" className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-alt">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10 text-info">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">Call Us</p>
                  <p className="text-xs text-text-secondary">0805 177 2262</p>
                </div>
              </a>
              <a href="mailto:support@shedam.org" className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-alt">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">Email Us</p>
                  <p className="text-xs text-text-secondary">support@shedam.org</p>
                </div>
              </a>
            </div>
            <div className="mt-4 rounded-lg bg-error/5 p-3">
              <p className="text-xs text-error"><strong>In crisis?</strong> If you or someone you know is in immediate danger, please call emergency services.</p>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl"
        aria-label="Need Support?"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
