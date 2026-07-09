import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Bell, LogOut, User as UserIcon, Sun, Moon, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../constants/routePaths';
import { authService } from '../../services/authService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout(user?.email);
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  const avatarLetter = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 z-50 flex items-center justify-between px-4 lg:px-6 shadow-sm transition-colors duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-1.5 rounded-xl transition-transform group-hover:scale-105 shadow-md shadow-indigo-200/50">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block tracking-tight">
            Interviora
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark
            ? <Sun className="w-4.5 h-4.5 text-amber-400" />
            : <Moon className="w-4.5 h-4.5" />
          }
        </button>

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all duration-300 relative hover:scale-110 active:scale-95">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* User info + dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="flex items-center gap-2.5 group"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{user?.role === 'ADMIN' ? 'Administrator' : 'Student'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-300">
              {avatarLetter}
            </div>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div
              className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 py-2 z-50 animate-fade-in-up"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <UserIcon className="w-4 h-4" /> My Profile
              </Link>
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
