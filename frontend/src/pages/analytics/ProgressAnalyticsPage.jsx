import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Award, Video, Target, Calendar,
  BarChart3, CheckCircle, Loader2, Flame, LineChart, Brain
} from 'lucide-react';
import { mockInterviewService } from '../../services/mockInterviewService';
import { analyticsService } from '../../services/analyticsService';

const StatCard = ({ title, value, sub, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 group cursor-default hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-2xl ${bg} ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const DifficultyBadge = ({ d }) => {
  const map = {
    EASY: 'bg-emerald-100 text-emerald-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    HARD: 'bg-rose-100 text-rose-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[d] || 'bg-slate-100 text-slate-600'}`}>
      {d}
    </span>
  );
};

const ProgressAnalyticsPage = () => {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mockInterviewService.getHistory(),
      analyticsService.get()
    ])
    .then(([histRes, data]) => {
      setHistory(Array.isArray(histRes) ? histRes : (histRes.data || []));
      setAnalytics(data);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const total = history.length;
  const diffCount = { EASY: 0, MEDIUM: 0, HARD: 0 };
  history.forEach(h => { if (h.difficulty) diffCount[h.difficulty] = (diffCount[h.difficulty] || 0) + 1; });
  const roleMap = {};
  history.forEach(h => { if (h.jobRole) roleMap[h.jobRole] = (roleMap[h.jobRole] || 0) + 1; });
  const topRole = Object.entries(roleMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  // Streak calculation
  const streak = (() => {
    if (!history.length) return 0;
    const days = [...new Set(history.map(h => {
      const d = new Date(h.createdAt || h.interviewDate || Date.now());
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))].sort().reverse();
    let count = 1;
    for (let i = 1; i < days.length; i++) {
      const [y1, m1, d1] = days[i - 1].split('-').map(Number);
      const [y2, m2, d2] = days[i].split('-').map(Number);
      const diff = (new Date(y1, m1, d1) - new Date(y2, m2, d2)) / 86400000;
      if (diff === 1) count++; else break;
    }
    return count;
  })();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-purple-100 p-2 rounded-xl">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        </div>
        <p className="text-slate-500 mt-1 ml-11">Track your interview performance and growth over time.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Total Interviews" value={total} sub="All time" icon={Video} color="text-blue-600" bg="bg-blue-100" />
            <StatCard title="Top Role" value={topRole} sub="Most practiced" icon={Target} color="text-indigo-600" bg="bg-indigo-100" />
            <StatCard title="Strongest Topic" value={analytics?.strongestTopic || '—'} sub="Based on avg score" icon={Brain} color="text-emerald-600" bg="bg-emerald-100" />
            <StatCard title="Weakest Topic" value={analytics?.weakestTopic || '—'} sub="Needs improvement" icon={LineChart} color="text-rose-600" bg="bg-rose-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Practice Bar Chart (CSS based) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> Weekly Practice
              </h2>
              {(!analytics?.weeklyPractice || analytics.weeklyPractice.length === 0) ? (
                <p className="text-slate-400 text-sm text-center py-8">No practice data yet.</p>
              ) : (
                <div className="flex items-end justify-around h-48 mt-4 gap-2">
                  {analytics.weeklyPractice.map((wp, idx) => {
                    const maxCount = Math.max(...analytics.weeklyPractice.map(w => w.count), 1);
                    const heightPct = (wp.count / maxCount) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="text-xs font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {wp.count} sessions
                        </div>
                        <div className="w-full max-w-[40px] bg-indigo-100 rounded-t-lg relative flex-1 flex items-end">
                          <div 
                            className="w-full bg-indigo-500 rounded-t-lg transition-all duration-1000 ease-out" 
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{wp.week}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Role Performance Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" /> Role Performance
              </h2>
              {(!analytics?.rolePerformance || analytics.rolePerformance.length === 0) ? (
                <p className="text-slate-400 text-sm text-center py-8">No data yet.</p>
              ) : (
                <div className="space-y-4">
                  {analytics.rolePerformance.map((rp, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-700">{rp.role}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">{rp.count} sessions</span>
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                            {(rp.avgScore || 0).toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-1000"
                          style={{ width: `${(rp.avgScore / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" /> Session History
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No interview sessions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Date</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Role</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Score</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-2 text-slate-500 font-medium">
                          {h.interviewDate ? new Date(h.interviewDate).toLocaleDateString() : (h.createdAt ? new Date(h.createdAt).toLocaleDateString() : '—')}
                        </td>
                        <td className="py-3 px-2 font-medium text-slate-700">{h.role || h.jobRole || '—'}</td>
                        <td className="py-3 px-2">
                           <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                            {h.score ? `${h.score.toFixed(1)}/10` : '—'}
                           </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle className="w-4 h-4" /> Done
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressAnalyticsPage;
