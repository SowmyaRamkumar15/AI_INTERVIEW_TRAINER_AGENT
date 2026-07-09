import React, { useEffect, useState } from 'react';
import {
  Video, FileText, TrendingUp, Award, ArrowRight, MessageSquare,
  BookOpen, Building2, Map, Clock, Target, CheckCircle2, Sparkles, Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routePaths';

const RECOMMENDED = [
  { topic: 'Data Structures & Algorithms', tag: 'Core', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { topic: 'System Design Basics', tag: 'Trending', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  { topic: 'STAR Method for Behavioral Qs', tag: 'HR', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { topic: 'SQL & Database Design', tag: 'Technical', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { topic: 'Spring Boot & REST APIs', tag: 'Java', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { topic: 'React Hooks Deep Dive', tag: 'Frontend', color: 'bg-pink-50 text-pink-700 border-pink-100' },
];

const DAILY_TASKS = [
  { text: 'Complete 2 LeetCode medium problems', done: false },
  { text: 'Review System Design concepts (30 min)', done: false },
  { text: 'Practice STAR behavioral answer', done: false },
  { text: 'Take a mock interview session', done: false },
];

const QUICK_ACTIONS = [
  { label: 'Start Mock Interview', path: ROUTES.MOCK_INTERVIEW, icon: Video, gradient: 'from-indigo-600 to-purple-600', shadow: 'shadow-indigo-200' },
  { label: 'Interviora Chat', path: ROUTES.Interviora, icon: MessageSquare, gradient: 'from-purple-600 to-pink-600', shadow: 'shadow-purple-200' },
  { label: 'Study Plan', path: ROUTES.STUDY_PLAN, icon: BookOpen, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200' },
  { label: 'Company Prep', path: ROUTES.COMPANY_PREP, icon: Building2, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200' },
];

const ReadinessRing = ({ score }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="rotate-[-90deg] w-28 h-28" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{score}%</span>
        <span className="text-xs text-slate-400 font-medium">Ready</span>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(DAILY_TASKS.map(t => ({ ...t })));

  useEffect(() => {
    dashboardService.getData()
      .then(data => setStatsData(data))
      .catch(() => setStatsData(null))
      .finally(() => setLoading(false));
  }, []);

  const toggleTask = (i) => {
    setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  };

  const stats = [
    {
      title: 'Mock Interviews',
      value: loading ? '…' : (statsData?.totalInterviews ?? 0),
      icon: Video, color: 'text-blue-600', bg: 'bg-blue-100',
    },
    {
      title: 'Avg Score',
      value: loading ? '…' : (statsData?.averageInterviewScore != null
        ? `${Math.round(statsData.averageInterviewScore)}%` : 'N/A'),
      icon: Award, color: 'text-purple-600', bg: 'bg-purple-100',
    },
    {
      title: 'Skills Added',
      value: loading ? '…' : (statsData?.totalSkills ?? 0),
      icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100',
    },
    {
      title: 'Resumes',
      value: loading ? '…' : (statsData?.totalResumes ?? 0),
      icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100',
    },
  ];

  const readinessScore = statsData ? Math.min(100, Math.round(
    (((statsData.totalInterviews ?? 0) * 15) +
    ((statsData.totalSkills ?? 0) * 5) +
    ((statsData.totalResumes ?? 0) * 10) +
    ((statsData.averageInterviewScore ?? 0) * 0.5))
  )) : 0;

  const roadmapProgress = statsData && statsData.totalRoadmapItems > 0
    ? Math.round((statsData.completedRoadmapItems / statsData.totalRoadmapItems) * 100)
    : 0;

  const doneTasks = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '25px 25px' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-indigo-200 text-sm font-medium">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="text-indigo-200 mt-1 text-sm">Here's what's happening with your interview prep today.</p>
        </div>
        <div className="flex gap-3 relative shrink-0">
          <button
            className="flex items-center gap-2 bg-white text-indigo-700 font-semibold py-2.5 px-5 rounded-xl hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
            onClick={() => navigate(ROUTES.MOCK_INTERVIEW)}
          >
            <Video className="w-4 h-4" /> Start Mock Interview
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card p-5 flex items-center gap-4 group cursor-pointer"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">{stat.title}</p>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Readiness + Daily Tasks + Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Readiness Score */}
        <div className="card p-6 text-center">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Interview Readiness</h2>
          </div>
          <ReadinessRing score={loading ? 0 : readinessScore} />
          <p className="text-xs text-slate-400 mt-3">Based on your activity & scores</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2">
            {[
              { label: 'Interviews done', val: statsData?.totalInterviews ?? 0, max: 10 },
              { label: 'Skills profiled', val: statsData?.totalSkills ?? 0, max: 20 },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-slate-500 mb-0.5">
                  <span>{r.label}</span><span>{r.val}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (r.val / r.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Study Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Today's Tasks</h2>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {doneTasks}/{tasks.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {tasks.map((task, i) => (
              <button
                key={i}
                onClick={() => toggleTask(i)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left border ${
                  task.done
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50 hover:border-indigo-200'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${task.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={`text-sm ${task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(doneTasks / tasks.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Roadmap Progress</h2>
            </div>
            <button
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              onClick={() => navigate(ROUTES.ROADMAP)}
            >
              View All →
            </button>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm text-center py-6">Loading…</p>
          ) : statsData?.totalRoadmapItems > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-extrabold text-indigo-600">{roadmapProgress}%</span>
                <p className="text-sm text-slate-400 mt-1">
                  {statsData.completedRoadmapItems} of {statsData.totalRoadmapItems} topics
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${roadmapProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-3 text-slate-400">
              <Map className="w-10 h-10 opacity-30" />
              <p className="text-sm text-center">No roadmap yet. Start your learning journey!</p>
              <button className="btn-primary text-sm" onClick={() => navigate(ROUTES.ROADMAP)}>
                Go to Roadmap
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((qa, i) => (
            <button
              key={i}
              onClick={() => navigate(qa.path)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${qa.gradient} text-white shadow-md ${qa.shadow} hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95`}
            >
              <qa.icon className="w-6 h-6" />
              <span className="text-sm font-semibold text-center">{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Topics */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" /> Recommended Topics
          </h2>
          <button
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
            onClick={() => navigate(ROUTES.Interviora)}
          >
            Ask AI →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED.map((r, i) => (
            <button
              key={i}
              onClick={() => navigate(ROUTES.QUESTIONS)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${r.color} hover:scale-105 transition-transform`}
            >
              <span>{r.topic}</span>
              <span className="opacity-60">· {r.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
