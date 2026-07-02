import React, { useEffect, useState } from 'react';
import { questionService } from '../../services/questionService';
import { answerService } from '../../services/answerService';
import { BookOpen, ChevronDown, CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const DIFFICULTIES = ['', 'EASY', 'MEDIUM', 'HARD'];
const ROLES = ['', 'Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer'];

const QuestionPracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await questionService.getAll({ role: role || undefined, difficulty: difficulty || undefined });
      setQuestions(data);
    } catch {
      toast.error('Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [role, difficulty]); // eslint-disable-line

  const handleSubmit = async (q) => {
    if (!answers[q.id]?.trim()) { toast.warn('Please write an answer first.'); return; }
    setSubmitting(q.id);
    try {
      const result = await answerService.submit(q.id, answers[q.id]);
      setSubmitted((prev) => ({ ...prev, [q.id]: result }));
      toast.success('Answer submitted!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-indigo-50">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Question Practice</h1>
        </div>
        <p className="text-slate-500 text-sm ml-14">Practice interview questions by role and difficulty</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-3">
        <div className="relative flex-1">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none text-sm bg-white"
          >
            <option value="">All Roles</option>
            {ROLES.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative flex-1">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none text-sm bg-white"
          >
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d || 'All Difficulties'}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Questions */}
      {loading ? (
        <div className="flex justify-center py-16 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-600">No questions found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting the filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <p className="font-semibold text-slate-800">{q.questionText || q.question}</p>
                <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium
                  ${q.difficulty === 'HARD' ? 'bg-rose-50 text-rose-700' :
                    q.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'}`}>
                  {q.difficulty}
                </span>
              </div>

              {submitted[q.id] ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">
                      Score: {submitted[q.id].score ?? '—'}/10
                    </span>
                  </div>
                  {submitted[q.id].feedback && (
                    <p className="text-sm text-emerald-700">{submitted[q.id].feedback}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    placeholder="Type your answer here…"
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm resize-none"
                  />
                  <button
                    onClick={() => handleSubmit(q)}
                    disabled={submitting === q.id}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
                  >
                    {submitting === q.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionPracticePage;
