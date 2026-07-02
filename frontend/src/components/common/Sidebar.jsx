import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Code2, Map, HelpCircle, Video, TrendingUp, MessageSquare, User } from 'lucide-react';
import { ROUTES } from '../../constants/routePaths';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { title: 'Resume', path: ROUTES.RESUME_UPLOAD, icon: FileText },
    { title: 'Skills', path: ROUTES.SKILLS, icon: Code2 },
    { title: 'Roadmap', path: ROUTES.ROADMAP, icon: Map },
    { title: 'Questions', path: ROUTES.QUESTIONS, icon: HelpCircle },
    { title: 'Mock Interview', path: ROUTES.MOCK_INTERVIEW, icon: Video },
    { title: 'Analytics', path: ROUTES.ANALYTICS, icon: TrendingUp },
    { title: 'AI Mentor', path: ROUTES.AI_MENTOR, icon: MessageSquare },
    { title: 'Profile', path: ROUTES.PROFILE, icon: User },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200 overflow-y-auto hidden lg:block z-40">
      <div className="p-4 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-medium group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50 translate-x-1 border border-indigo-100/50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1 hover:shadow-sm border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="transition-colors">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
