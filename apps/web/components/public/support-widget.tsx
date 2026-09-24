'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, X, ExternalLink } from 'lucide-react';
import { useSettingsMap } from '@/hooks/use-api';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { get } = useSettingsMap();

  const heading = get('support_heading', 'Need Support?');
  const description = get(
    'support_description',
    'We are here to listen. Chat with us for mental health support.'
  );
  const statusLabel = get('support_status_label', 'Online');
  const chatLabel = get('support_chat_label', 'Start Chat');
  const chatChannel = get('support_chat_channel', 'WhatsApp');
  const callLabel = get('support_call_label', 'Call Us');
  const emailLabel = get('support_email_label', 'Email Us');
  const crisisText = get(
    'support_crisis_text',
    'If you or someone you know is in immediate danger, please call emergency services.'
  );

  const phoneDisplay = get('contact_phone', '0805 177 2262');
  const phoneRaw = get('contact_phone_raw', '+2348051772262');
  const whatsappRaw = get('support_whatsapp', '+2348051772262').replace(/[^0-9]/g, '');
  const email = get('support_email', 'support@shedam.org');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 rounded-xl border border-border bg-white shadow-xl animate-on-scroll is-visible">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-dark">{heading}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-text-secondary transition-colors duration-200 hover:bg-surface-alt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          </div>
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
              </span>
              <span className="text-sm text-success">{statusLabel}</span>
            </div>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-all duration-300 hover:bg-surface-alt hover:border-success/30 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success transition-all duration-300 group-hover:bg-success group-hover:text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{chatLabel}</p>
                  <p className="text-xs text-text-secondary">{chatChannel}</p>
                </div>
                <ExternalLink className="ml-auto h-4 w-4 text-text-muted" />
              </a>
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-all duration-300 hover:bg-surface-alt hover:border-info/30 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10 text-info transition-all duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{callLabel}</p>
                  <p className="text-xs text-text-secondary">{phoneDisplay}</p>
                </div>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-all duration-300 hover:bg-surface-alt hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{emailLabel}</p>
                  <p className="text-xs text-text-secondary">{email}</p>
                </div>
              </a>
            </div>
            <div className="mt-4 rounded-lg bg-error/5 p-3">
              <p className="text-xs text-error"><strong>In crisis?</strong> {crisisText}</p>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary-hover hover:shadow-xl hover:scale-110 widget-bounce"
        aria-label={heading}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
