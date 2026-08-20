"use client";

import React, { useState, useEffect } from 'react';
import Can from '@/components/Can';
import { getCurrentUser } from '@/lib/auth';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Key, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  UserCheck, 
  AlertTriangle,
  RefreshCw,
  Sliders,
  Check,
  Plus,
  Save,
  Lock
} from 'lucide-react';

import { getApiUrl } from '@/lib/apiConfig';

const API = getApiUrl();

interface UserAccount {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
  isActive: bool;
  createdAt?: string;
}

interface RolePermission {
  id?: number;
  roleName: string;
  screenKey: string;
  canView: boolean;
  canEntry: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const SCREENS = [
  { key: 'Project', label: 'Project', description: 'Core project records & details' },
  { key: 'Tour', label: 'Tour', description: 'Tour operations, rooming & itinerary' },
  { key: 'Project Overview', label: 'Project Overview', description: 'Executive summary & status' },
  { key: 'Project Dashboard', label: 'Project Dashboard', description: 'Analytical charts & KPIs' },
  { key: 'Project Finance', label: 'Project Finance', description: 'Revenue, costs, margin & invoices' },
  { key: 'Master Data', label: 'Master Data', description: 'Hotels, Guides, Drivers, Transport' },
  { key: 'AI Knowledge Base', label: 'AI Knowledge Base', description: 'Documentation repository indexer, SOPs & AI training data' },
  { key: 'Audit Logs', label: 'Audit Logs', description: 'System history & change tracking' },
  { key: 'User Accounts', label: 'User Accounts', description: 'Account management & security' },
];

const DEFAULT_ROLES = ['Administrator', 'TourAdmin', 'Manager'];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');

  // User Management States
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Manager',
    isActive: true
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Role Permissions States
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('TourAdmin');
  const [permLoading, setPermLoading] = useState(false);
  const [permSaving, setPermSaving] = useState(false);
  const [permSuccessMessage, setPermSuccessMessage] = useState<string | null>(null);

  // Custom role creation state
  const [rolesList, setRolesList] = useState<string[]>(DEFAULT_ROLES);
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const currentUser = getCurrentUser();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/users`);
      if (!res.ok) throw new Error('Failed to load user accounts from server');
      const data = await res.json();
      setUsers(data);

      // Collect any custom roles from existing users
      const customRoles = Array.from(new Set(data.map((u: UserAccount) => u.role).filter(Boolean)));
      setRolesList(prev => Array.from(new Set([...prev, ...customRoles])));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error connecting to User Management API');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setPermLoading(true);
    try {
      const res = await fetch(`${API}/rolepermissions`);
      if (res.ok) {
        const data = await res.json();
        setPermissions(data);
      }
    } catch (err) {
      console.error('Failed to fetch role permissions:', err);
    } finally {
      setPermLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Manager',
      isActive: true
    });
    setFormError(null);
    setShowFormPassword(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      isActive: user.isActive
    });
    setFormError(null);
    setShowFormPassword(false);
  };

  const logAudit = async (action: string, entityId: string, summary: string) => {
    try {
      await fetch(`${API}/auditlogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          userName: currentUser?.name || 'Administrator',
          userEmail: currentUser?.email || 'admin@uno-dmc.cz',
          userRole: currentUser?.role || 'Administrator',
          action: action,
          entityName: 'UserAccount',
          entityId: entityId,
          summary: summary,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Audit logging failed:', err);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError('Email and Password are required fields.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const res = await fetch(`${API}/auth/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: formData.role,
            isActive: formData.isActive
          })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update user account');
        }

        await logAudit('UPDATE', editingUser.id.toString(), `Updated user account ${formData.email} (Role: ${formData.role})`);
        setEditingUser(null);
      } else {
        const res = await fetch(`${API}/auth/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: formData.role,
            isActive: formData.isActive
          })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create new user account');
        }

        const newUser = await res.json();
        await logAudit('CREATE', newUser.id?.toString() || '0', `Created new user account ${formData.email} with role ${formData.role}`);
        setIsAddModalOpen(false);
      }

      await fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving the user account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/auth/users/${deletingUser.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete user account');

      await logAudit('DELETE', deletingUser.id.toString(), `Deleted user account ${deletingUser.email}`);
      setDeletingUser(null);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper for matrix permission toggling
  const getRolePermissionForScreen = (role: string, screenKey: string): RolePermission => {
    const found = permissions.find(p => p.roleName.toLowerCase() === role.toLowerCase() && p.screenKey.toLowerCase() === screenKey.toLowerCase());
    if (found) return found;

    // Default fallback
    const isMasterAdmin = role === 'Administrator';
    return {
      roleName: role,
      screenKey: screenKey,
      canView: isMasterAdmin || true,
      canEntry: isMasterAdmin,
      canUpdate: isMasterAdmin,
      canDelete: isMasterAdmin
    };
  };

  const handlePermissionToggle = (screenKey: string, field: 'canView' | 'canEntry' | 'canUpdate' | 'canDelete') => {
    setPermissions(prev => {
      const existingIndex = prev.findIndex(p => p.roleName.toLowerCase() === selectedRole.toLowerCase() && p.screenKey.toLowerCase() === screenKey.toLowerCase());
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        updated[existingIndex] = {
          ...currentItem,
          [field]: !currentItem[field]
        };
        return updated;
      } else {
        const newItem: RolePermission = {
          roleName: selectedRole,
          screenKey: screenKey,
          canView: field === 'canView' ? true : false,
          canEntry: field === 'canEntry' ? true : false,
          canUpdate: field === 'canUpdate' ? true : false,
          canDelete: field === 'canDelete' ? true : false,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleSaveRolePermissions = async () => {
    setPermSaving(true);
    setPermSuccessMessage(null);
    try {
      const currentRolePerms = SCREENS.map(s => getRolePermissionForScreen(selectedRole, s.key));
      const res = await fetch(`${API}/rolepermissions/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentRolePerms)
      });

      if (!res.ok) throw new Error('Failed to save role permissions');

      await logAudit('UPDATE', selectedRole, `Updated screen access rights matrix for role '${selectedRole}'`);
      setPermSuccessMessage(`Access rights matrix for role '${selectedRole}' updated successfully!`);
      setTimeout(() => setPermSuccessMessage(null), 4000);
      await fetchPermissions();
    } catch (err: any) {
      alert(err.message || 'Error saving role permissions');
    } finally {
      setPermSaving(false);
    }
  };

  const handleCreateNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const cleanRole = newRoleName.trim();
    if (!rolesList.includes(cleanRole)) {
      setRolesList(prev => [...prev, cleanRole]);
      setSelectedRole(cleanRole);
    }
    setNewRoleName('');
    setIsNewRoleModalOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Administrator':
        return (
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold inline-flex items-center gap-1">
            <Shield className="w-3 h-3 text-purple-600" /> Administrator
          </span>
        );
      case 'TourAdmin':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold inline-flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-600" /> TourAdmin
          </span>
        );
      case 'Manager':
        return (
          <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold inline-flex items-center gap-1">
            <Users className="w-3 h-3 text-sky-600" /> Manager
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">
            {role}
          </span>
        );
    }
  };

  return (
    <Can 
      perform="manage-users"
      fallback={
        <div className="p-12 text-center max-w-lg mx-auto mt-12 bg-white rounded-2xl border border-rose-100 shadow-sm">
          <Shield className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-slate-500 text-sm mb-6">
            Only system Administrators have permission to view and manage user accounts and screen access rights.
          </p>
        </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Main Header & Navigation Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-6 h-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-slate-800">User & Role Access Management</h1>
              </div>
              <p className="text-slate-500 text-sm">
                Create user credentials, assign roles, and configure dynamic screen access rights (View, Entry, Update, Delete).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { fetchUsers(); fetchPermissions(); }}
                className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                title="Refresh system data"
              >
                <RefreshCw className={`w-4 h-4 ${loading || permLoading ? 'animate-spin' : ''}`} />
              </button>
              {activeTab === 'users' ? (
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" /> Add New User
                </button>
              ) : (
                <button
                  onClick={() => setIsNewRoleModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" /> Create Custom Role
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-100 gap-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> User Accounts ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'permissions'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" /> Screen Access Rights Matrix
            </button>
          </div>
        </div>

        {/* ──── TAB 1: USER ACCOUNTS ──── */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                  {users.filter(u => u.role === 'Administrator').length}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Administrators</h3>
                  <p className="text-xs text-slate-400">Full system & user access</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                  {users.filter(u => u.role === 'TourAdmin').length}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">TourAdmins</h3>
                  <p className="text-xs text-slate-400">Tour operations & allocations</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg">
                  {users.filter(u => u.role === 'Manager').length}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Managers</h3>
                  <p className="text-xs text-slate-400">Project oversight & finance</p>
                </div>
              </div>
            </div>

            {/* User List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-800 text-base">Active User Accounts</h2>
                <span className="text-xs font-semibold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Total Users: {users.length}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" /> Loading user accounts...
                </div>
              ) : error ? (
                <div className="p-8 text-center text-rose-600">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-bold">{error}</p>
                  <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100">
                    Try Again
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No user accounts found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3.5">User</th>
                        <th className="px-6 py-3.5">Email Address</th>
                        <th className="px-6 py-3.5">Role & Access</th>
                        <th className="px-6 py-3.5">Password</th>
                        <th className="px-6 py-3.5 text-center">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200">
                              {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{u.name || 'Unnamed User'}</div>
                              {u.createdAt && (
                                <div className="text-[10px] text-slate-400 font-normal">
                                  Added {new Date(u.createdAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{u.email}</td>
                          <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <span>
                                {currentUser?.role === 'Administrator' && showPasswords[u.id] 
                                  ? (u.password || '••••••••') 
                                  : '••••••••'}
                              </span>
                              {currentUser?.role === 'Administrator' && (
                                <button 
                                  onClick={() => togglePasswordVisibility(u.id)}
                                  className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                                  title={showPasswords[u.id] ? "Hide Plaintext Password" : "View Plaintext Password (Admin Only)"}
                                >
                                  {showPasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {u.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                                <XCircle className="w-3 h-3 text-slate-400" /> Disabled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openEditModal(u)}
                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setDeletingUser(u)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──── TAB 2: ROLE & SCREEN ACCESS RIGHTS MATRIX ──── */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            {/* Role Selector & Save Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select User Role to Configure</label>
                <div className="flex flex-wrap gap-2">
                  {rolesList.map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedRole === r
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveRolePermissions}
                  disabled={permSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {permSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Permissions Matrix
                </button>
              </div>
            </div>

            {/* Success Message Banner */}
            {permSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {permSuccessMessage}
              </div>
            )}

            {/* Screen Permissions Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="font-bold text-slate-800 text-base">
                    Access Rights Matrix for Role: <span className="text-purple-600">{selectedRole}</span>
                  </h2>
                  <p className="text-xs text-slate-400">Configure screen visibility and action rights (View, Entry, Update, Delete)</p>
                </div>
                {selectedRole === 'Administrator' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    <Lock className="w-3 h-3 text-purple-600" /> Admin Default Full Access
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 w-72">Screen / Module</th>
                      <th className="px-6 py-4 text-center w-36">View</th>
                      <th className="px-6 py-4 text-center w-36">Entry (Create)</th>
                      <th className="px-6 py-4 text-center w-36">Update (Edit)</th>
                      <th className="px-6 py-4 text-center w-36">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SCREENS.map(screen => {
                      const perm = getRolePermissionForScreen(selectedRole, screen.key);
                      return (
                        <tr key={screen.key} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{screen.label}</div>
                            <div className="text-xs text-slate-400 font-normal">{screen.description}</div>
                          </td>

                          {/* View Checkbox */}
                          <td className="px-6 py-4 text-center">
                            <label className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-purple-50/50 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={perm.canView}
                                onChange={() => handlePermissionToggle(screen.key, 'canView')}
                                className="w-5 h-5 text-purple-600 rounded-lg border-slate-300 focus:ring-purple-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Entry Checkbox */}
                          <td className="px-6 py-4 text-center">
                            <label className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-purple-50/50 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={perm.canEntry}
                                onChange={() => handlePermissionToggle(screen.key, 'canEntry')}
                                className="w-5 h-5 text-purple-600 rounded-lg border-slate-300 focus:ring-purple-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Update Checkbox */}
                          <td className="px-6 py-4 text-center">
                            <label className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-purple-50/50 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={perm.canUpdate}
                                onChange={() => handlePermissionToggle(screen.key, 'canUpdate')}
                                className="w-5 h-5 text-purple-600 rounded-lg border-slate-300 focus:ring-purple-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Delete Checkbox */}
                          <td className="px-6 py-4 text-center">
                            <label className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-purple-50/50 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={perm.canDelete}
                                onChange={() => handlePermissionToggle(screen.key, 'canDelete')}
                                className="w-5 h-5 text-purple-600 rounded-lg border-slate-300 focus:ring-purple-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Custom Role */}
        {isNewRoleModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-slate-100 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" /> Create Custom Role
                </h3>
                <button onClick={() => setIsNewRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
              </div>

              <form onSubmit={handleCreateNewRole} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Name</label>
                  <input 
                    type="text"
                    required
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    placeholder="e.g. FinanceAuditor or TourCoordinator"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewRoleModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200"
                  >
                    Create Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add / Edit User Modal */}
        {(isAddModalOpen || editingUser) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-800 text-lg">
                    {editingUser ? 'Edit User Account' : 'Add New User Account'}
                  </h3>
                </div>
                <button 
                  onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tuana Yilmaz"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@uno-dmc.cz"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={currentUser?.role === 'Administrator' && showFormPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Set account password"
                      className="w-full px-3.5 py-2 pr-10 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {currentUser?.role === 'Administrator' && (
                      <button
                        type="button"
                        onClick={() => setShowFormPassword(!showFormPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors p-1"
                        title={showFormPassword ? "Hide Password" : "View Plaintext Password (Admin Only)"}
                      >
                        {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Assignment</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {rolesList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {editingUser && (
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                      Account Active Status
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-colors flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingUser ? 'Update Account' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete User Confirmation Modal */}
        {deletingUser && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Delete User Account</h3>
                  <p className="text-xs text-slate-500">{deletingUser.email}</p>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                Are you sure you want to permanently delete user account <strong className="text-slate-800">{deletingUser.name}</strong> ({deletingUser.email})? 
                This user will no longer be able to log in to the ERP.
              </p>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={submitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-colors flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Can>
  );
}
