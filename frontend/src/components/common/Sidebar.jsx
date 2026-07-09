import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Code2, Map, HelpCircle, Video,
  TrendingUp, MessageSquare, User, BookOpen, Building2, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { ROUTES } from '../../constants/routePaths';

const menuItems = [
  { title: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, end: true },
  { title: 'Interviora Chat', path: ROUTES.Interviora, icon: MessageSquare },
  { title: 'Mock Interview', path: ROUTES.MOCK_INTERVIEW, icon: Video },
  { title: 'Questions', path: ROUTES.QUESTIONS, icon: HelpCircle },
  { title: 'Resume', path: ROUTES.RESUME_UPLOAD, icon: FileText },
  { title: 'Skills', path: ROUTES.SKILLS, icon: Code2 },
  { title: 'Study Plan', path: ROUTES.STUDY_PLAN, icon: BookOpen },
  { title: 'Roadmap', path: ROUTES.ROADMAP, icon: Map },
  { title: 'Company Prep', path: ROUTES.COMPANY_PREP, icon: Building2 },
  { title: 'Analytics', path: ROUTES.ANALYTICS, icon: TrendingUp },
  { title: 'Profile', path: ROUTES.PROFILE, icon: User },
  { title: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden lg:flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-indigo-300 transition-all z-50 text-slate-400 hover:text-indigo-600"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className={`p-3 space-y-1 flex-1 ${collapsed ? 'px-2' : ''}`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={collapsed ? item.title : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium group ${collapsed ? 'justify-center px-2' : ''} ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800/50'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && (
              <span className="text-sm truncate transition-all">{item.title}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer branding */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center font-medium">Interviora v1.0</p>
          <p className="text-xs text-slate-300 dark:text-slate-700 text-center mt-0.5">Powered by IBM Watsonx</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
