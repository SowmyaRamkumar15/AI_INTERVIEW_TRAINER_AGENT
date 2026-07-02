import React, { useEffect, useState } from 'react';
import { skillGapService } from '../../services/skillGapService';
import { TrendingUp, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'];

const SkillGapPage = () => {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    skillGapService.get()
      .then(setGaps)
      .catch(() => {}) // may be empty on first load
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyze = async () => {
    if (!selectedRole) { toast.warn('Please select a target role.'); return; }
    setAnalyzing(true);
    try {
      const result = await skillGapService.analyze(selectedRole);
      setGaps(Array.isArray(result) ? result : [result]);
      toast.success('Skill gap analysis complete!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-rose-50">
            <TrendingUp className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Skill Gap Analysis</h1>
        </div>
        <p className="text-slate-500 text-sm ml-14">Identify skills you need to reach your target role</p>
      </div>

      {/* Analyze Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">Analyze for Target Role</h2>
        <div className="flex gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
          >
            <option value="">Select target role…</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            Analyze
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">Gap Results</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          </div>
        ) : gaps.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No analysis yet</p>
            <p className="text-sm text-slate-400 mt-1">Select a target role and click Analyze</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((gap, i) => (
              <div key={gap.id || i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                {gap.present ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-slate-800">{gap.skillName || gap.skill}</p>
                  {gap.recommendation && <p className="text-sm text-slate-500 mt-0.5">{gap.recommendation}</p>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${gap.present ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {gap.present ? 'Already have' : 'Needs improvement'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapPage;
