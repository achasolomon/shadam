'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { MediaField } from '@/components/admin/media-picker';

export type FieldDef =
  | { key: string; label: string; type: 'text' | 'textarea' | 'color' | 'media' | 'number' | 'toggle' }
  | { key: string; label: string; type: 'string[]'; itemLabel?: string }
  | { key: string; label: string; type: 'object[]'; fields: FieldDef[] };

function emptyFor(field: FieldDef): any {
  switch (field.type) {
    case 'string[]':
      return [];
    case 'object[]':
      return {};
    case 'number':
      return '';
    case 'color':
      return '#88E788';
    case 'media':
      return '';
    case 'toggle':
      return false;
    default:
      return '';
  }
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  if (field.type === 'textarea') {
    return (
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    );
  }
  if (field.type === 'media') {
    return <MediaField value={value || ''} accept="IMAGE" onChange={(url) => onChange(url)} />;
  }
  if (field.type === 'color') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#88E788'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-gray-200 bg-white p-1"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 flex-1 rounded-lg border border-gray-200 px-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    );
  }
  if (field.type === 'number') {
    return (
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    );
  }
  if (field.type === 'toggle') {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-200'}`}
        aria-pressed={!!value}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    );
  }
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function StringListEditor({
  label,
  items,
  onChange,
  itemLabel,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  itemLabel?: string;
}) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={itemLabel || 'Entry'}
              className="h-8 flex-1 rounded-lg border border-gray-200 px-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-lg px-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-primary/50 hover:text-primary"
        >
          <Plus className="h-3 w-3" /> Add {itemLabel || 'item'}
        </button>
      </div>
    </div>
  );
}

function itemSummary(item: any, fields: FieldDef[]): string {
  const textFields = fields.filter((f) => f.type === 'text' || f.type === 'textarea');
  const parts: string[] = [];
  for (const f of textFields) {
    const v = item?.[f.key];
    if (typeof v === 'string' && v.trim()) parts.push(v.trim());
    if (parts.length >= 2) break;
  }
  if (parts.length) return parts.join(' · ');
  const first = fields.find((f) => f.type === 'text');
  if (first && item?.[first.key]) return String(item[first.key]);
  return fields[0]?.label || 'Item';
}

function ObjectArrayEditor({
  label,
  items,
  fields,
  onChange,
  addLabel,
}: {
  label: string;
  items: any[];
  fields: FieldDef[];
  onChange: (next: any[]) => void;
  addLabel: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const open = openIdx === i;
          const summary = itemSummary(item, fields);
          return (
            <div key={i} className="rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 px-2.5 py-1.5">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  aria-expanded={open}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}
                  />
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    #{i + 1}
                  </span>
                  <span className="min-w-0 truncate text-xs text-gray-600" title={summary}>
                    {summary || <span className="italic text-gray-400">Empty</span>}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {open && (
                <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 p-3">
                  {fields.map((f) => (
                    <div key={f.key}>
                      <p className="mb-1 text-xs font-medium text-gray-500">{f.label}</p>
                      {f.type === 'string[]' ? (
                        <StringListEditor
                          label=""
                          items={Array.isArray(item[f.key]) ? item[f.key] : []}
                          itemLabel={f.itemLabel}
                          onChange={(next) => {
                            const arr = [...items];
                            arr[i] = { ...arr[i], [f.key]: next };
                            onChange(arr);
                          }}
                        />
                      ) : f.type === 'object[]' ? (
                        <ObjectArrayEditor
                          label={f.label}
                          items={Array.isArray(item[f.key]) ? item[f.key] : []}
                          fields={f.fields}
                          addLabel="Add"
                          onChange={(next) => {
                            const arr = [...items];
                            arr[i] = { ...arr[i], [f.key]: next };
                            onChange(arr);
                          }}
                        />
                      ) : (
                        <FieldInput
                          field={f}
                          value={item[f.key]}
                          onChange={(v) => {
                            const arr = [...items];
                            arr[i] = { ...arr[i], [f.key]: v };
                            onChange(arr);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const template: any = {};
            fields.forEach((f) => {
              template[f.key] = emptyFor(f);
            });
            onChange([...items, template]);
            setOpenIdx(items.length);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-primary/50 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>
    </div>
  );
}

function ObjectFieldsEditor({
  obj,
  fields,
  onChange,
}: {
  obj: any;
  fields: FieldDef[];
  onChange: (next: any) => void;
}) {
  const source = obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
  const [open, setOpen] = useState(false);
  const summary = itemSummary(source, fields);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-left"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="min-w-0 truncate text-xs text-gray-600" title={summary}>
          {summary || <span className="italic text-gray-400">Empty</span>}
        </span>
        <span className="ml-auto shrink-0 text-[10px] text-gray-400">{fields.length} fields</span>
      </button>
      {open && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3">
          {fields.map((f) => (
            <div key={f.key}>
              {f.type === 'string[]' ? (
                <StringListEditor
                  label={f.label}
                  items={Array.isArray(source[f.key]) ? source[f.key] : []}
                  itemLabel={f.itemLabel}
                  onChange={(next) => onChange({ ...source, [f.key]: next })}
                />
              ) : f.type === 'object[]' ? (
                <ObjectArrayEditor
                  label={f.label}
                  items={Array.isArray(source[f.key]) ? source[f.key] : []}
                  fields={f.fields}
                  addLabel={`Add ${f.label.replace(/s$/, '')}`}
                  onChange={(next) => onChange({ ...source, [f.key]: next })}
                />
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">{f.label}</label>
                  <FieldInput
                    field={f}
                    value={source[f.key]}
                    onChange={(v) => onChange({ ...source, [f.key]: v })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StructuredJsonEditor({
  value,
  onChange,
  mode,
  fields,
}: {
  value: string;
  onChange: (val: string) => void;
  mode: 'array' | 'object';
  fields: FieldDef[];
}) {
  const parsed = useMemo(() => {
    try {
      const raw = JSON.parse(value || (mode === 'array' ? '[]' : '{}'));
      return raw;
    } catch {
      return mode === 'array' ? [] : {};
    }
  }, [value, mode]);

  const emit = (next: any) => {
    onChange(JSON.stringify(next, null, 2));
  };

  if (mode === 'array') {
    const items = Array.isArray(parsed) ? parsed : [];
    return (
      <ObjectArrayEditor
        label=""
        items={items}
        fields={fields}
        addLabel="Add Item"
        onChange={(next) => emit(next)}
      />
    );
  }

  return <ObjectFieldsEditor obj={parsed} fields={fields} onChange={(next) => emit(next)} />;
}

// ── Schema registry ──
export interface StructuredSchema {
  mode: 'array' | 'object';
  fields: FieldDef[];
}

export const STRUCTURED_SCHEMAS: Record<string, StructuredSchema> = {
  services_list: {
    mode: 'array',
    fields: [
      { key: 'slug', label: 'Slug (URL segment)', type: 'text' },
      { key: 'number', label: 'Number Badge', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'short', label: 'Short Line', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'highlights', label: 'Highlights', type: 'string[]', itemLabel: 'Highlight' },
      { key: 'image', label: 'Card Image', type: 'media' },
      { key: 'color', label: 'Accent Color', type: 'color' },
    ],
  },
  features_list: {
    mode: 'array',
    fields: [
      { key: 'slug', label: 'Slug (links to service page)', type: 'text' },
      { key: 'number', label: 'Number', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'points', label: 'Tag Points', type: 'string[]', itemLabel: 'Tag' },
      { key: 'image', label: 'Image', type: 'media' },
      { key: 'ctaLabel', label: 'CTA Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA Link', type: 'text' },
    ],
  },
  wwd_steps: {
    mode: 'array',
    fields: [
      { key: 'step', label: 'Step Number', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  about_values: {
    mode: 'array',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  about_areas: {
    mode: 'array',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  about_milestones: {
    mode: 'array',
    fields: [
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  contact_office_hours: {
    mode: 'array',
    fields: [
      { key: 'day', label: 'Day(s)', type: 'text' },
      { key: 'time', label: 'Hours', type: 'text' },
    ],
  },
  contact_faqs: {
    mode: 'array',
    fields: [
      { key: 'q', label: 'Question', type: 'text' },
      { key: 'a', label: 'Answer', type: 'textarea' },
    ],
  },
  help_helplines: {
    mode: 'array',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'number', label: 'Number (raw)', type: 'text' },
      { key: 'display', label: 'Display Number', type: 'text' },
      { key: 'available', label: 'Availability', type: 'text' },
      { key: 'primary', label: 'Primary', type: 'toggle' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  help_channels: {
    mode: 'array',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'action', label: 'Action (URL / mailto / tel)', type: 'text' },
      { key: 'color', label: 'Colour', type: 'color' },
      { key: 'available', label: 'Availability', type: 'text' },
    ],
  },
  help_warning_signs: {
    mode: 'array',
    fields: [{ key: '_', label: 'Sign', type: 'text' }],
  },
  help_self_care_steps: {
    mode: 'array',
    fields: [
      { key: 'step', label: 'Step Number', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  involve_ways: {
    mode: 'array',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'color', label: 'Accent Color', type: 'color' },
      { key: 'items', label: 'Bullet Points', type: 'string[]', itemLabel: 'Point' },
      { key: 'cta', label: 'CTA Label', type: 'text' },
      { key: 'ctaLink', label: 'CTA Link', type: 'text' },
    ],
  },
  involve_steps: {
    mode: 'array',
    fields: [
      { key: 'step', label: 'Step Number', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  registration_interests: {
    mode: 'array',
    fields: [{ key: '_', label: 'Interest', type: 'text' }],
  },
  projects_categories: {
    mode: 'array',
    fields: [{ key: '_', label: 'Category', type: 'text' }],
  },
  gallery_categories: {
    mode: 'array',
    fields: [{ key: '_', label: 'Category', type: 'text' }],
  },
  insights_trending_tags: {
    mode: 'array',
    fields: [{ key: '_', label: 'Tag', type: 'text' }],
  },
  impact_stats: {
    mode: 'array',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
    ],
  },
  partners_list: {
    mode: 'array',
    fields: [
      { key: 'label', label: 'Category Label', type: 'text' },
      {
        key: 'partners',
        label: 'Partners',
        type: 'object[]',
        fields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'abbr', label: 'Abbreviation', type: 'text' },
        ],
      },
    ],
  },
};

// Special-case: string arrays need a flat editor (items are plain strings, not objects)
export const STRING_ARRAY_KEYS = new Set([
  'help_warning_signs',
  'registration_interests',
  'projects_categories',
  'gallery_categories',
  'insights_trending_tags',
]);

export function getStructuredSchema(key: string): StructuredSchema | null {
  if (key.startsWith('service_page_')) {
    return {
      mode: 'object',
      fields: [
        { key: 'badge', label: 'Badge', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'titleHighlight', label: 'Title Highlight', type: 'text' },
        { key: 'description', label: 'Hero Description', type: 'textarea' },
        { key: 'heroImage', label: 'Hero Image', type: 'media' },
        { key: 'whyTitle', label: 'Why It Matters — Title', type: 'text' },
        { key: 'whyDescription', label: 'Why It Matters — Description', type: 'textarea' },
        { key: 'whyImage', label: 'Why It Matters — Image', type: 'media' },
        {
          key: 'activities',
          label: 'Activities',
          type: 'object[]',
          fields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ],
        },
        { key: 'impact', label: 'Impact Points', type: 'string[]', itemLabel: 'Impact point' },
        { key: 'statNumber', label: 'Stat Number', type: 'text' },
        { key: 'statLabel', label: 'Stat Label', type: 'text' },
        { key: 'ctaTitle', label: 'CTA Title', type: 'text' },
        { key: 'ctaDescription', label: 'CTA Description', type: 'textarea' },
      ],
    };
  }
  return STRUCTURED_SCHEMAS[key] || null;
}

// Back-compat exports (older imports)
export const SERVICES_LIST_FIELDS = STRUCTURED_SCHEMAS.services_list!.fields;
export const FEATURES_LIST_FIELDS = STRUCTURED_SCHEMAS.features_list!.fields;
export const WWD_STEPS_FIELDS = STRUCTURED_SCHEMAS.wwd_steps!.fields;
export const SERVICE_PAGE_FIELDS = getStructuredSchema('service_page_x')!.fields;
