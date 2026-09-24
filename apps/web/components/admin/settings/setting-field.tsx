'use client';

import React, { useState } from 'react';
import { AlertCircle, Code, Eye, EyeOff } from 'lucide-react';
import { MediaField } from '@/components/admin/media-picker';
import { StructuredJsonEditor, getStructuredSchema, STRING_ARRAY_KEYS } from '@/components/admin/structured-setting-editors';
import {
  labelFor,
  descriptionFor,
  hintFor,
  looksLikeJson,
  inputTypeFor,
} from './settings-config';
import { useSettingsStore } from './settings-provider';
import { resolveMediaUrl } from '@/lib/api';

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  groupName?: string;
}

type HeroSlide = { src: string; alt?: string };

function HeroSlidesEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  let slides: HeroSlide[] = [];
  try {
    const arr = JSON.parse(value || '[]');
    slides = Array.isArray(arr) ? arr : [];
  } catch {
    slides = [];
  }

  const update = (next: HeroSlide[]) => onChange(JSON.stringify(next, null, 2));

  return (
    <div className="space-y-3">
      {slides.map((slide, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-start gap-3">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
              {slide.src ? (
                <img src={resolveMediaUrl(slide.src)} alt={slide.alt || ''} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-gray-400">Empty</div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <MediaField
                value={slide.src}
                accept="IMAGE"
                onChange={(url) => {
                  const next = [...slides];
                  next[i] = { ...next[i], src: url };
                  update(next);
                }}
              />
              <input
                type="text"
                value={slide.alt || ''}
                onChange={(e) => {
                  const next = [...slides];
                  next[i] = { ...next[i], alt: e.target.value };
                  update(next);
                }}
                placeholder="Alt text"
                className="h-9 w-full rounded-lg border border-gray-200 px-2.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={() => update(slides.filter((_, j) => j !== i))}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              title="Remove slide"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => update([...slides, { src: '', alt: '' }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 hover:border-primary/50 hover:text-primary"
      >
        + Add Slide
      </button>
    </div>
  );
}

function StringArrayEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let items: string[] = [];
  try {
    const arr = JSON.parse(value || '[]');
    items = Array.isArray(arr) ? arr.map((x) => String(x)) : [];
  } catch {
    items = [];
  }
  const update = (next: string[]) => onChange(JSON.stringify(next, null, 2));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              update(next);
            }}
            className="h-9 flex-1 rounded-lg border border-gray-200 px-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => update(items.filter((_, j) => j !== i))}
            className="rounded-lg px-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => update([...items, ''])}
        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:border-primary/50 hover:text-primary"
      >
        + Add item
      </button>
    </div>
  );
}

export function SettingField({
  setting,
  value,
  dirty,
  jsonError,
  focused,
  onChange,
  onFormat,
}: {
  setting: Setting;
  value: string;
  dirty: boolean;
  jsonError?: string;
  focused?: boolean;
  onChange: (val: string) => void;
  onFormat: () => void;
}) {
  const { key, type } = setting;
  const label = labelFor(key);
  const description = descriptionFor(key);
  const hint = hintFor(key);
  const [showRaw, setShowRaw] = useState(false);

  const isHeroSlides = key === 'hero_slides';
  const isVideoUrl = key === 'video_url';
  const isImage = type === 'IMAGE';

  const schema = getStructuredSchema(key);
  const isStringArray = STRING_ARRAY_KEYS.has(key);
  const isStructured = !!schema && !showRaw;
  const structuredIsArray = schema?.mode === 'array';

  const isJsonish =
    !isHeroSlides &&
    !isVideoUrl &&
    !isImage &&
    (type === 'JSON' || looksLikeJson(value));
  const isJsonField = isJsonish && !isStructured && !isStringArray;

  const isMultiline =
    !isHeroSlides &&
    !isVideoUrl &&
    !isImage &&
    !isStructured &&
    !isStringArray &&
    (type === 'TEXTAREA' || isJsonish);

  const fullW =
    isStructured ||
    isStringArray ||
    isHeroSlides ||
    isImage ||
    isVideoUrl ||
    isJsonish ||
    type === 'TEXTAREA' ||
    (description && description.length > 80);

  const inputType = inputTypeFor(key, type);

  const [showMeta, setShowMeta] = useState(false);

  return (
    <div
      id={`setting-${key}`}
      className={`relative rounded-lg border bg-white px-3 py-2.5 transition-all ${
        fullW ? 'sm:col-span-2' : ''
      } ${
        dirty
          ? 'border-l-4 border-l-amber-400 border-y-gray-200 border-r-gray-200'
          : 'border-gray-200'
      } ${focused ? 'ring-2 ring-primary/30 border-primary/50' : ''}`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label
          htmlFor={`input-${key}`}
          className="min-w-0 truncate text-sm font-medium text-gray-800"
          title={description || label}
        >
          {label}
        </label>
        <div className="flex shrink-0 items-center gap-1.5">
          {dirty && (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
              Modified
            </span>
          )}
          {description && (
            <button
              type="button"
              onClick={() => setShowMeta((v) => !v)}
              className="rounded p-0.5 text-gray-300 hover:text-gray-500"
              title={description}
              aria-label="Show field details"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          {(isStructured || isStringArray) && (
            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className="flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-600 hover:bg-emerald-100"
              title={showRaw ? 'Switch to structured editor' : 'Edit raw JSON'}
            >
              {showRaw ? <Eye className="h-2.5 w-2.5" /> : <Code className="h-2.5 w-2.5" />}
              {showRaw ? 'Structured' : 'JSON'}
            </button>
          )}
          {isJsonField && (
            <span className="flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-500">
              <Code className="h-2.5 w-2.5" /> JSON
            </span>
          )}
        </div>
      </div>

      {showMeta && (description || hint) && (
        <div className="mb-2 rounded-md bg-gray-50 px-2 py-1.5 text-[11px] leading-snug text-gray-500">
          {description}
          {hint && <span className="mt-0.5 block text-gray-400">{hint}</span>}
          <p className="mt-1 font-mono text-[10px] text-gray-400">{key}</p>
        </div>
      )}

      {isStructured && schema ? (
        schema.mode === 'array' && isStringArray ? (
          <StringArrayEditor value={value} onChange={onChange} />
        ) : (
          <StructuredJsonEditor
            value={value}
            onChange={onChange}
            mode={schema.mode}
            fields={schema.fields}
          />
        )
      ) : isHeroSlides ? (
        <HeroSlidesEditor value={value} onChange={onChange} />
      ) : isVideoUrl ? (
        <MediaField value={value} accept="VIDEO" onChange={(url) => onChange(url)} hint={hint} />
      ) : isImage ? (
        <MediaField value={value} accept="IMAGE" onChange={(url) => onChange(url)} hint={hint} />
      ) : type === 'BOOLEAN' ? (
        <div className="flex gap-2">
          {['true', 'false'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                value === v
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      ) : isMultiline ? (
        <textarea
          id={`input-${key}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={isJsonish ? 5 : 2}
          spellCheck={!isJsonish}
          placeholder={hint}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            isJsonish ? 'font-mono text-xs' : ''
          } ${
            jsonError
              ? 'border-red-300 bg-red-50 focus:ring-red-200'
              : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/20'
          }`}
        />
      ) : (
        <input
          id={`input-${key}`}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className={`h-9 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 ${
            jsonError
              ? 'border-red-300 bg-red-50 focus:ring-red-200'
              : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/20'
          }`}
        />
      )}

      {jsonError && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" /> {jsonError}
        </p>
      )}

      {isJsonField && value.trim() && (
        <button type="button" onClick={onFormat} className="mt-1 text-xs text-gray-400 hover:text-gray-600">
          Format JSON
        </button>
      )}
    </div>
  );
}
