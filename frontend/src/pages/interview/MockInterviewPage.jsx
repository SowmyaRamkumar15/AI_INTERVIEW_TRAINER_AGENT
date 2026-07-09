import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Play, StopCircle, ChevronRight,
  Clock, Trophy, RotateCcw, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { mockInterviewService } from '../../services/mockInterviewService';
import { toast } from 'react-toastify';

const JOB_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'DevOps Engineer',
  'Product Manager', 'System Design', 'Machine Learning Engineer',
];

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { value: 'HARD', label: 'Hard', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
];

const MockInterviewPage = () => {
  const [phase, setPhase] = useState('setup'); // setup | active | result
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  const fetchHistory = async () => {
    try {
      const data = await mockInterviewService.getHistory();
      // getHistory now returns array directly (ApiResponse unwrapped)
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      // silently fail
    } finally {
      setHistoryLoading(false);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await mockInterviewService.startInterview({ role: jobRole, difficulty, numberOfQuestions: 3 });
      setInterview(res);
      setCurrentQ(0);
      setAnswers([]);
      setCurrentAnswer('');
      setTimeLeft(120);
      setTimerActive(true);
      setPhase('active');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const questions = interview?.questions || [];
    const newAnswers = [...answers, { question: questions[currentQ], answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1);
      setTimeLeft(120);
    } else {
      setTimerActive(false);
      setPhase('result');
      fetchHistory();
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const questions = interview?.questions || [];
  const progressPct = questions.length > 0 ? ((currentQ) / questions.length) * 100 : 0;

  // ── Setup Phase ──────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Video className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Mock Interview</h1>
          </div>
          <p className="text-slate-500 mt-1 ml-11">Practice with AI-generated interview questions tailored to your role.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Select Job Role</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {JOB_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setJobRole(role)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                      jobRole === role
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Difficulty Level</h2>
              <div className="flex gap-4">
                {DIFFICULTY_LEVELS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      difficulty === d.value
                        ? `${d.bg} ${d.color} shadow-sm`
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {loading ? 'Starting Interview...' : 'Start Mock Interview'}
            </button>
          </div>

          {/* History Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Past Sessions</h2>
            {historyLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Trophy className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No interviews yet. Start your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 6).map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-700 text-sm truncate">{h.role || h.jobRole || 'Interview'}</p>
                      <p className="text-xs text-slate-400">{h.difficulty || 'MEDIUM'} • {h.questions?.length || 0} questions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Active Phase ─────────────────────────────────────────────
  if (phase === 'active') {
    return (
      <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQ + 1} of {questions.length}
            </span>
            <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
              timeLeft <= 30 ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              Q{currentQ + 1}
            </div>
            <p className="text-slate-800 font-medium text-lg leading-relaxed pt-1">
              {typeof questions[currentQ] === 'object' ? questions[currentQ]?.question : questions[currentQ]}
            </p>
          </div>

          <textarea
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here… Be clear, concise, and use the STAR method where applicable."
            rows={7}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-colors"
          />

          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => { setPhase('setup'); setTimerActive(false); }}
              className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors text-sm font-medium"
            >
              <StopCircle className="w-4 h-4" />
              End Interview
            </button>
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              {currentQ + 1 < questions.length ? 'Next Question' : 'Finish'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Result Phase ─────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-7 text-white shadow-lg shadow-indigo-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Trophy className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Interview Complete! 🎉</h1>
            <p className="text-indigo-100 mt-1">You answered {answers.filter(a => a.answer.trim()).length} of {answers.length} questions</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {answers.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-start gap-3 mb-3">
              {a.answer.trim()
                ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                : <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
              <p className="font-semibold text-slate-800">Q{i + 1}: {typeof a.question === 'object' ? a.question?.question : a.question}</p>
            </div>
            <div className="ml-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-600 text-sm whitespace-pre-wrap">
                {a.answer.trim() || <span className="italic text-slate-400">No answer provided</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setPhase('setup')}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 text-lg"
      >
        <RotateCcw className="w-5 h-5" />
        Start New Interview
      </button>
    </div>
  );
};

export default MockInterviewPage;
