'use client';

import React from 'react';

export interface TabDef {
  id: string;
  label: string;
}

export function FormTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`relative whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            active === t.id
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
