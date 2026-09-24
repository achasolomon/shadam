'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Search, Upload, X, Image as ImageIcon, Film, Loader2, Check } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';

export interface PickedMedia {
  id: string;
  url: string;
  fileName?: string;
}

interface MediaItem extends PickedMedia {
  type: string;
  mimeType: string;
  fileSize: number;
  altText?: string;
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: PickedMedia) => void;
  accept?: 'IMAGE' | 'VIDEO' | 'ALL';
  title?: string;
}

export function MediaPicker({ open, onClose, onSelect, accept = 'IMAGE', title }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getMedia();
      if (res.success) setMedia(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSearch('');
      load();
    }
  }, [open, load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await adminApi.uploadMedia(file);
      }
      await load();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const filtered = media.filter((m) => {
    if (accept !== 'ALL' && m.type !== accept) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.fileName?.toLowerCase().includes(q) || m.altText?.toLowerCase().includes(q);
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-heading text-lg text-gray-900">
              {title || (accept === 'VIDEO' ? 'Select Video' : accept === 'IMAGE' ? 'Select Image' : 'Select Media')}
            </h2>
            <p className="text-xs text-gray-500">Choose from Media Library or upload</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={accept === 'IMAGE' ? 'image/*' : accept === 'VIDEO' ? 'video/*' : 'image/*,video/*'}
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          {loading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">No media files found</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Upload one
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect({ id: item.id, url: item.url, fileName: item.fileName });
                    onClose();
                  }}
                  className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gray-50 transition-all hover:border-primary focus:border-primary focus:outline-none"
                >
                  <div className="aspect-square">
                    {item.type === 'IMAGE' ? (
                      <img src={resolveMediaUrl(item.url)} alt={item.altText || item.fileName || ''} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Film className="h-8 w-8 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                    <p className="truncate text-[10px] text-white">{item.fileName}</p>
                  </div>
                  <div className="absolute right-1.5 top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-primary text-white group-hover:flex group-focus:flex">
                    <Check className="h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MediaFieldProps {
  value?: string;
  valueId?: string;
  onChange: (url: string, id?: string) => void;
  accept?: 'IMAGE' | 'VIDEO' | 'ALL';
  label?: string;
  hint?: string;
}

export function MediaField({ value, valueId, onChange, accept = 'IMAGE', label, hint }: MediaFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-start gap-3">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {value ? (
            accept === 'VIDEO' ? (
              <video src={resolveMediaUrl(value)} className="h-full w-full object-cover" muted />
            ) : (
              <img src={resolveMediaUrl(value)} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:border-primary/40 hover:bg-primary/5"
          >
            {accept === 'VIDEO' ? <Film className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
            Choose from Library
          </button>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value, valueId)}
            placeholder={accept === 'VIDEO' ? '/video/file.mp4 or https://…' : '/images/… or https://…'}
            className="h-9 w-full min-w-[200px] rounded-lg border border-gray-200 px-2.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('', undefined)}
              className="self-start text-[11px] text-red-400 hover:text-red-600"
            >
              Clear
            </button>
          )}
          {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
        </div>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={(m) => onChange(m.url, m.id)} accept={accept} />
    </div>
  );
}
