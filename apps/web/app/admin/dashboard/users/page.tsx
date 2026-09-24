'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Loader2, Edit3, Ban, X, UserCircle, Mail } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '@/lib/api';
import { useAuth } from '@/components/admin/auth-provider';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt?: string;
  invitedAt?: string;
  inviteExpiresAt?: string;
  role?: { id: string; name: string };
}

interface Role {
  id: string;
  name: string;
}

  const emptyForm = {
    name: '',
    email: '',
    password: '',
    roleId: '',
    status: 'INVITED',
  };

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [inviteActionId, setInviteActionId] = useState<string | null>(null);
  const [inviteNotice, setInviteNotice] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [uRes, rRes] = await Promise.all([
        adminApi.getUsers({ limit: '200' }),
        adminApi.getRoles(),
      ]);
      if (uRes.success) setUsers(uRes.data || []);
      if (rRes.success) setRoles(rRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, status: 'INVITED', password: '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = async (id: string) => {
    setFormError('');
    setModalOpen(true);
    setEditingId(id);
    setForm({ ...emptyForm });
    try {
      const res = await adminApi.getUser(id);
      const u = res.data;
      if (u) {
        setForm({
          name: u.name || '',
          email: u.email || '',
          password: '',
          roleId: u.role?.id || '',
          status: u.status || 'ACTIVE',
        });
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to load user');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        const payload: any = {
          name: form.name,
          email: form.email,
          roleId: form.roleId || undefined,
          status: form.status,
        };
        if (form.password) payload.password = form.password;
        await adminApi.updateUser(editingId, payload);
      } else {
        await adminApi.createUser({
          name: form.name,
          email: form.email,
          roleId: form.roleId || undefined,
        });
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      setFormError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResendInvite = async (u: User) => {
    setInviteActionId(u.id);
    setInviteNotice('');
    try {
      await adminApi.resendInvite(u.id);
      setInviteNotice(`Invite sent to ${u.email}`);
      await load();
    } catch (err: any) {
      alert(err.message || 'Failed to resend invite');
    } finally {
      setInviteActionId(null);
    }
  };

  const handleDeactivate = async (u: User) => {
    if (u.id === me?.id) {
      alert('You cannot deactivate your own account.');
      return;
    }
    if (!confirm(`Deactivate ${u.name}? They will no longer be able to sign in.`)) return;
    setActionId(u.id);
    try {
      await adminApi.deleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err: any) {
      alert(err.message || 'Deactivate failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === 'ACTIVE'
      ? 'bg-green-50 text-green-700'
      : s === 'INVITED'
        ? 'bg-blue-50 text-blue-700'
        : s === 'SUSPENDED'
          ? 'bg-amber-50 text-amber-700'
          : 'bg-gray-100 text-gray-500';

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            {users.length} user{users.length === 1 ? '' : 's'} — accounts and roles for the admin panel
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6BCF6B]"
          >
            <Plus className="h-4 w-4" /> Invite User
          </button>
        </div>
      </div>

      {inviteNotice && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">{inviteNotice}</div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <UserCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {u.avatarUrl ? (
                          <img
                            src={resolveMediaUrl(u.avatarUrl)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (u.name?.charAt(0) || '?').toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {u.name}
                          {u.id === me?.id && (
                            <span className="ml-1.5 text-xs font-normal text-gray-400">(you)</span>
                          )}
                        </p>
                        <p className="truncate text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{u.role?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {u.status === 'INVITED' && (
                        <button
                          onClick={() => handleResendInvite(u)}
                          disabled={inviteActionId === u.id}
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
                          title="Resend invite email"
                        >
                          {inviteActionId === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(u.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(u)}
                        disabled={actionId === u.id || u.id === me?.id}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        title={u.id === me?.id ? 'Cannot deactivate yourself' : 'Deactivate'}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit User' : 'Invite New User'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {!editingId && (
              <div className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                An invitation email with a password-setup link will be sent to this address.
              </div>
            )}
            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{formError}</div>
            )}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  minLength={2}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {editingId && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    New Password (leave blank to keep)
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    minLength={form.password ? 6 : undefined}
                    autoComplete="new-password"
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={form.roleId}
                    onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">No role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    disabled={!editingId}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    {!editingId && <option value="INVITED">INVITED (pending)</option>}
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#6BCF6B] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
