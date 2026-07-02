import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockInterviewService } from '../../services/mockInterviewService';
import { ROUTES } from '../../constants/routePaths';
import { Trophy, CheckCircle2, XCircle, ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(location.state?.interview || null);
  const [loading, setLoading] = useState(!interview);

  useEffect(() => {
    const id = location.state?.interviewId;
    if (!interview && id) {
      mockInterviewService.getById(id)
        .then(setInterview)
        .catch(() => navigate(ROUTES.MOCK_INTERVIEW))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
        <p className="text-slate-600 font-medium">No result data available.</p>
        <button onClick={() => navigate(ROUTES.MOCK_INTERVIEW)} className="mt-4 text-indigo-600 hover:underline text-sm">
          Start a new interview
        </button>
      </div>
    );
  }

  const questions = interview.questions || interview.mockQuestions || [];
  const totalScore = questions.reduce((sum, q) => sum + (q.score ?? 0), 0);
  const maxScore = questions.length * 10;
  const pct = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Score Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center shadow-lg shadow-indigo-200">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
        <h1 className="text-3xl font-bold mb-1">{pct}%</h1>
        <p className="text-indigo-100 text-sm">Overall Score — {totalScore}/{maxScore}</p>
        <p className="text-indigo-200 text-xs mt-2">
          {interview.role || interview.jobRole} · {interview.difficulty}
        </p>
      </div>

      {/* Question Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-bold text-slate-800 text-lg mb-4">Question Breakdown</h2>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id || i} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-medium text-slate-800 text-sm">{q.questionText || q.question}</p>
                <span className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                  ${(q.score ?? 0) >= 7 ? 'bg-emerald-50 text-emerald-700' : (q.score ?? 0) >= 4 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                  {(q.score ?? 0) >= 7 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {q.score ?? '—'}/10
                </span>
              </div>
              {q.userAnswer && (
                <div className="bg-slate-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-slate-500 font-medium mb-1">Your answer:</p>
                  <p className="text-sm text-slate-700">{q.userAnswer}</p>
                </div>
              )}
              {q.feedback && (
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-indigo-600 font-medium mb-1">AI Feedback:</p>
                  <p className="text-sm text-indigo-800">{q.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(ROUTES.MOCK_INTERVIEW)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" /> New Interview
        </button>
        <button
          onClick={() => navigate(ROUTES.ANALYTICS)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
        >
          <TrendingUp className="w-4 h-4" /> View Analytics
        </button>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
