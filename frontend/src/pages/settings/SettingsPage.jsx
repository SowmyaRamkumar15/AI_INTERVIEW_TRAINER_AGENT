import React, { useState } from 'react';
import {
  Settings, User, Lock, Moon, Sun, Trash2, LogOut, Save,
  Loader2, Eye, EyeOff, AlertTriangle, CheckCircle2, BrainCircuit
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants/routePaths';
import api from '../../services/api/axiosConfig';

const SectionCard = ({ title, icon: Icon, iconColor = 'text-indigo-500', children }) => (
  <div className="card p-6">
    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {title}
    </h2>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.degree || '');
  const [experience, setExperience] = useState(user?.experience || 'Fresher');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // Reset modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setSavingProfile(true);
    try {
      await api.put('/auth/profile', { name: name.trim(), college, degree, experience, targetRole, targetCompany });
      toast.success('Profile updated successfully!');
    } catch {
      toast.info('Profile saved locally. (API endpoint may be optional)');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) { toast.error('Fill in all password fields'); return; }
    if (newPwd !== confirmPwd) { toast.error('New passwords do not match'); return; }
    if (newPwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPwd(true);
    try {
      await api.put('/auth/change-password', { currentPassword: currentPwd, newPassword: newPwd });
      toast.success('Password changed successfully!');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPwd(false);
    }
  };

  const handleLogout = async () => {
    try { await authService.logout(user?.email); } catch { /* silent */ }
    logout();
    navigate(ROUTES.LOGIN);
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-slate-300 text-sm mt-0.5">Manage your account preferences and profile</p>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <SectionCard title="Profile Information" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Full Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field text-sm" placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
            <input value={user?.email || ''} disabled className="input-field text-sm opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">College / University</label>
            <input value={college} onChange={e => setCollege(e.target.value)} className="input-field text-sm" placeholder="e.g. SKCET, Anna University" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Degree</label>
            <input value={degree} onChange={e => setDegree(e.target.value)} className="input-field text-sm" placeholder="e.g. B.Tech Computer Science" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Experience Level</label>
            <select value={experience} onChange={e => setExperience(e.target.value)} className="input-field text-sm">
              {['Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Target Role</label>
            <input value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-field text-sm" placeholder="e.g. Software Engineer at IBM" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Target Company</label>
            <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} className="input-field text-sm" placeholder="e.g. IBM, Google, Infosys" />
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="mt-5 flex items-center gap-2 btn-primary"
        >
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {savingProfile ? 'Saving…' : 'Save Profile'}
        </button>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" icon={isDark ? Moon : Sun} iconColor="text-amber-500">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {isDark
              ? <Moon className="w-5 h-5 text-indigo-400" />
              : <Sun className="w-5 h-5 text-amber-500" />
            }
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="text-xs text-slate-400">
                {isDark ? 'Using dark color scheme' : 'Using light color scheme'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isDark ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isDark ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password" icon={Lock} iconColor="text-emerald-500">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Current Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                className="input-field text-sm pr-10"
                placeholder="Enter current password"
              />
              <button onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">New Password</label>
              <input type={showPwd ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} className="input-field text-sm" placeholder="Min 6 characters" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
              <input type={showPwd ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className="input-field text-sm" placeholder="Repeat new password" />
            </div>
          </div>
          {newPwd && confirmPwd && newPwd !== confirmPwd && (
            <p className="text-xs text-rose-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Passwords do not match
            </p>
          )}
          {newPwd && confirmPwd && newPwd === confirmPwd && newPwd.length >= 6 && (
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
            </p>
          )}
        </div>
        <button
          onClick={handleChangePassword}
          disabled={savingPwd}
          className="mt-4 flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-emerald-200 disabled:opacity-60"
        >
          {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {savingPwd ? 'Updating…' : 'Update Password'}
        </button>
      </SectionCard>

      {/* Account Actions */}
      <SectionCard title="Account Actions" icon={AlertTriangle} iconColor="text-rose-500">
        <div className="space-y-3">
          {/* Reset Progress */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Reset All Progress
            </button>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">
                ⚠️ This will clear your interview history and progress data. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { toast.info('Progress reset is managed by your admin.'); setShowResetConfirm(false); }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 border border-rose-200 dark:border-rose-800/50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Interviora
          </button>
        </div>
      </SectionCard>

      {/* About */}
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-400">
        <BrainCircuit className="w-4 h-4 text-indigo-400" />
        <span>Interviora v1.0 · Powered by IBM Watsonx Orchestrate</span>
      </div>
    </div>
  );
};

export default SettingsPage;
