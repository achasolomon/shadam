'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save, ShieldCheck } from 'lucide-react';
import { authApi, resolveMediaUrl } from '@/lib/api';
import { useAuth } from '@/components/admin/auth-provider';
import { MediaField } from '@/components/admin/media-picker';

export default function AdminProfilePage() {
  const { user, refresh, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', avatarUrl: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await authApi.updateMe(profile);
      await refresh();
      setProfileMsg({ type: 'ok', text: 'Profile updated.' });
    } catch (err: any) {
      setProfileMsg({ type: 'err', text: err.message || 'Update failed' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.newPassword !== pw.confirm) {
      setPwMsg({ type: 'err', text: 'New passwords do not match.' });
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword(pw.currentPassword, pw.newPassword);
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      setPwMsg({ type: 'ok', text: 'Password changed.' });
    } catch (err: any) {
      setPwMsg({ type: 'err', text: err.message || 'Password change failed' });
    } finally {
      setPwSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Update your account details and password.</p>
      </div>

      <form onSubmit={handleProfileSave} className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Account Details</h2>
        {profileMsg && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              profileMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {profileMsg.text}
          </div>
        )}
        <div className="mb-4">
          <MediaField
            value={profile.avatarUrl}
            onChange={(url) => setProfile((p) => ({ ...p, avatarUrl: url }))}
            label="Avatar"
            accept="IMAGE"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            required
            minLength={2}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            required
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="mb-5 flex items-center gap-3 text-sm text-gray-500">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {profile.avatarUrl ? (
              <img
                src={resolveMediaUrl(profile.avatarUrl)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (profile.name?.charAt(0) || 'A').toUpperCase()
            )}
          </div>
          <div>
            <p className="font-medium text-gray-700">{profile.name || '—'}</p>
            <p className="text-xs">{user?.role?.name || '—'}</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={profileSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
        >
          {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </button>
      </form>

      <form onSubmit={handlePasswordSave} className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
        </div>
        {pwMsg && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              pwMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {pwMsg.text}
          </div>
        )}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={pw.currentPassword}
            onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
            required
            autoComplete="current-password"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={pw.newPassword}
            onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
            required
            minLength={6}
            autoComplete="new-password"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={pw.confirm}
            onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
            required
            minLength={6}
            autoComplete="new-password"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          disabled={pwSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
        >
          {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Change Password
        </button>
      </form>
    </div>
  );
}
