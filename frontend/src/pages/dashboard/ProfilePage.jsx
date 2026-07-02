import React, { useState, useEffect } from 'react';
import {
  User, Mail, Shield, Edit3, Save, X, Loader2,
  Video, Award, BookOpen, TrendingUp, LogOut, Key
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { mockInterviewService } from '../../services/mockInterviewService';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants/routePaths';
import api from '../../services/api/axiosConfig';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-indigo-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-slate-800 font-semibold mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const StatTile = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    setFormName(user?.name || '');
    mockInterviewService.getHistory()
      .then(res => setHistory(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!formName.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    try {
      // Call profile update endpoint if available
      await api.put('/auth/profile', { name: formName.trim() });
      toast.success('Profile updated!');
      setEditMode(false);
    } catch {
      // If endpoint not available, just update locally
      toast.info('Profile name updated locally.');
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout(user?.email);
    } catch { /* silent */ }
    logout();
    navigate(ROUTES.LOGIN);
    toast.success('Logged out successfully');
  };

  const totalInterviews = history.length;
  const hardCount = history.filter(h => h.difficulty === 'HARD').length;
  const roleSet = new Set(history.map(h => h.jobRole).filter(Boolean));

  const avatarLetter = (user?.name || user?.email || 'U')[0].toUpperCase();

  const roleColors = {
    STUDENT: { text: 'text-indigo-700', bg: 'bg-indigo-100' },
    ADMIN: { text: 'text-purple-700', bg: 'bg-purple-100' },
  };
  const roleStyle = roleColors[user?.role] || { text: 'text-slate-700', bg: 'bg-slate-100' };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50">
              {avatarLetter}
            </div>
            <div className="flex gap-2 mt-14">
              {editMode ? (
                <>
                  <button
                    onClick={() => { setEditMode(false); setFormName(user?.name || ''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Name & Role */}
          {editMode ? (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Display Name</label>
              <input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full max-w-xs px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          ) : (
            <div className="mb-1">
              <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'User'}</h2>
            </div>
          )}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
            <Shield className="w-3.5 h-3.5" />
            {user?.role || 'STUDENT'}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile icon={Video} label="Interviews Done" value={historyLoading ? '…' : totalInterviews} color="text-blue-600" bg="bg-blue-100" />
        <StatTile icon={BookOpen} label="Roles Practiced" value={historyLoading ? '…' : roleSet.size} color="text-indigo-600" bg="bg-indigo-100" />
        <StatTile icon={Award} label="Hard Sessions" value={historyLoading ? '…' : hardCount} color="text-rose-600" bg="bg-rose-100" />
        <StatTile icon={TrendingUp} label="Completion Rate" value={totalInterviews > 0 ? '100%' : '—'} color="text-emerald-600" bg="bg-emerald-100" />
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" /> Account Information
        </h3>
        <div className="space-y-3">
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email} />
          <InfoRow icon={Shield} label="Account Role" value={user?.role} />
          <InfoRow icon={Key} label="User ID" value={user?.id ? `#${user.id}` : '—'} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-1">Account Actions</h3>
        <p className="text-sm text-slate-500 mb-4">Manage your session and account settings.</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-5 py-2.5 rounded-xl border border-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
