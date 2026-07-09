import React, { useState, useRef } from 'react';
import {
  BookOpen, Calendar, Target, Code2, Video, Loader2,
  CheckCircle2, Clock, Star, ArrowRight, Sparkles, Download
} from 'lucide-react';
import ChatInterface from '../../components/chat/ChatInterface';

const DURATIONS = [
  { days: 7, label: '7 Days', desc: 'Quick sprint', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', accent: 'from-emerald-500 to-teal-600' },
  { days: 14, label: '14 Days', desc: 'Focused prep', color: 'border-indigo-300 bg-indigo-50 text-indigo-700', accent: 'from-indigo-600 to-purple-600' },
  { days: 30, label: '30 Days', desc: 'Deep mastery', color: 'border-purple-300 bg-purple-50 text-purple-700', accent: 'from-purple-600 to-pink-600' },
];

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Machine Learning Engineer', 'Product Manager'];
const FOCUSES = ['DSA & Algorithms', 'System Design', 'Behavioral / HR', 'Full Stack Web', 'Cloud & DevOps', 'Machine Learning', 'Database & SQL'];

const StudyPlanPage = () => {
  const [selectedDuration, setSelectedDuration] = useState(14);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedFocus, setSelectedFocus] = useState('DSA & Algorithms');
  const chatRef = useRef(null);

  const generate = () => {
    const prompt = `Generate a detailed ${selectedDuration}-day interview study plan for a ${selectedRole} role focusing on ${selectedFocus}.

Structure the plan day-by-day with:
- Daily Goals (2-3 specific tasks)
- Topics to study
- Coding practice (number of problems, type)
- Revision tasks
- Mock interview days

Format clearly with Day 1:, Day 2: etc. Include weekly milestones at Day 7, Day 14, Day 30. Make it practical and actionable.`;

    chatRef.current?.sendMessage(prompt);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="flex items-center gap-3 relative">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Study Plan Generator</h1>
            <p className="text-emerald-100 text-sm mt-0.5">AI-powered personalized interview preparation schedule</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Duration */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Plan Duration</h2>
            </div>
            <div className="space-y-2">
              {DURATIONS.map(d => (
                <button
                  key={d.days}
                  onClick={() => setSelectedDuration(d.days)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                    selectedDuration === d.days
                      ? d.color + ' shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {d.label}
                  </span>
                  <span className="text-xs opacity-70">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Target Role</h2>
            </div>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="input-field text-sm"
            >
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Focus Area */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Focus Area</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {FOCUSES.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFocus(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedFocus === f
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-base active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            Generate {selectedDuration}-Day Plan
          </button>
        </div>

        {/* Plan Output Chat Interface */}
        <div className="lg:col-span-2">
          <ChatInterface 
            ref={chatRef} 
            height="700px" 
            saveHistory={false} 
            placeholder="Ask questions about your study plan or request changes..."
            welcomeText="Select your plan criteria on the left and click 'Generate' to get started!"
            initialMessages={[{
              id: 0,
              role: 'assistant',
              text: "Select your plan criteria on the left and click 'Generate' to get started!"
            }]}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;
