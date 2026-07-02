import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Award, Video, Target, Calendar,
  BarChart3, CheckCircle, Loader2, Flame
} from 'lucide-react';
import { mockInterviewService } from '../../services/mockInterviewService';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockInterviewService.getHistory()
      .then(res => setHistory(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = history.length;
  const diffCount = { EASY: 0, MEDIUM: 0, HARD: 0 };
  history.forEach(h => { if (h.difficulty) diffCount[h.difficulty] = (diffCount[h.difficulty] || 0) + 1; });
  const roleMap = {};
  history.forEach(h => { if (h.jobRole) roleMap[h.jobRole] = (roleMap[h.jobRole] || 0) + 1; });
  const topRole = Object.entries(roleMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  // Streak: consecutive days with an interview
  const streak = (() => {
    if (!history.length) return 0;
    const days = [...new Set(history.map(h => {
      const d = new Date(h.createdAt || Date.now());
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
            <StatCard title="Day Streak" value={`${streak}🔥`} sub="Keep it up!" icon={Flame} color="text-orange-600" bg="bg-orange-100" />
            <StatCard title="Hard Sessions" value={diffCount.HARD} sub="Challenging rounds" icon={Award} color="text-rose-600" bg="bg-rose-100" />
          </div>

          {/* Difficulty Breakdown + Bar Chart side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Difficulty breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> Difficulty Breakdown
              </h2>
              {total === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No data yet. Start your first interview!</p>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Easy', key: 'EASY', color: 'bg-emerald-500', track: 'bg-emerald-100' },
                    { label: 'Medium', key: 'MEDIUM', color: 'bg-amber-500', track: 'bg-amber-100' },
                    { label: 'Hard', key: 'HARD', color: 'bg-rose-500', track: 'bg-rose-100' },
                  ].map(({ label, key, color, track }) => {
                    const pct = total ? Math.round((diffCount[key] / total) * 100) : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700">{label}</span>
                          <span className="text-slate-500">{diffCount[key]} ({pct}%)</span>
                        </div>
                        <div className={`w-full h-3 rounded-full ${track}`}>
                          <div
                            className={`h-3 rounded-full ${color} transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Role breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" /> Roles Practiced
              </h2>
              {Object.keys(roleMap).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No data yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(roleMap).sort((a, b) => b[1] - a[1]).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{role}</span>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {count} session{count > 1 ? 's' : ''}
                      </span>
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
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">#</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Role</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Difficulty</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Questions</th>
                      <th className="text-left py-3 px-2 text-slate-500 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-2 text-slate-400">{i + 1}</td>
                        <td className="py-3 px-2 font-medium text-slate-700">{h.jobRole || '—'}</td>
                        <td className="py-3 px-2"><DifficultyBadge d={h.difficulty} /></td>
                        <td className="py-3 px-2 text-slate-600">{h.questionsCount || '—'}</td>
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
