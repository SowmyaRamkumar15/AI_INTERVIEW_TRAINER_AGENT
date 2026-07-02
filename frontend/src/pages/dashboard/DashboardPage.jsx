import React, { useEffect, useState } from 'react';
import { Video, FileText, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routePaths';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getData()
      .then(data => setStatsData(data))
      .catch(() => setStatsData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: 'Mock Interviews',
      value: loading ? '…' : (statsData?.totalInterviews ?? 0),
      icon: Video,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Avg Interview Score',
      value: loading ? '…' : (statsData?.averageInterviewScore != null
        ? `${Math.round(statsData.averageInterviewScore)}%`
        : 'N/A'),
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Skills Added',
      value: loading ? '…' : (statsData?.totalSkills ?? 0),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Resumes Uploaded',
      value: loading ? '…' : (statsData?.totalResumes ?? 0),
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
  ];

  const roadmapProgress = statsData && statsData.totalRoadmapItems > 0
    ? Math.round((statsData.completedRoadmapItems / statsData.totalRoadmapItems) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your interview prep today.</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 w-fit"
          onClick={() => navigate(ROUTES.MOCK_INTERVIEW)}
        >
          <Video className="w-4 h-4" />
          Start Mock Interview
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card p-6 flex items-center gap-4 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap Progress & Upgrade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Roadmap Progress</h2>
            <button
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              onClick={() => navigate(ROUTES.ROADMAP)}
            >
              View Roadmap
            </button>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading…</p>
          ) : statsData?.totalRoadmapItems > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{statsData.completedRoadmapItems} of {statsData.totalRoadmapItems} topics completed</span>
                <span className="font-semibold">{roadmapProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${roadmapProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-400">
              <TrendingUp className="w-10 h-10 opacity-30" />
              <p className="text-sm">No roadmap items yet. Start your learning journey!</p>
              <button
                className="btn-primary text-sm mt-1"
                onClick={() => navigate(ROUTES.ROADMAP)}
              >
                Go to Roadmap
              </button>
            </div>
          )}
        </div>

        <div className="card p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg shadow-indigo-200">
          <h2 className="text-lg font-bold mb-2">Upgrade to Pro</h2>
          <p className="text-indigo-100 text-sm mb-6 opacity-90">Get unlimited mock interviews, personalized roadmaps, and detailed AI feedback.</p>
          <button className="w-full bg-white text-indigo-600 font-semibold py-3 px-4 rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all active:scale-95">
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
