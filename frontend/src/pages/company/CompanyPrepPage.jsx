import React, { useState, useRef } from 'react';
import {
  Building2, ChevronRight, Sparkles, Loader2, ArrowLeft,
  Clock, Users, BarChart3, Target, Lightbulb, CheckCircle2, Code2, Star
} from 'lucide-react';
import ChatInterface from '../../components/chat/ChatInterface';

const COMPANIES = [
  {
    name: 'IBM',
    logo: '🔵',
    tagline: 'Watsonx & Cloud',
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    difficulty: 'Medium',
    rounds: ['Aptitude Test', 'Technical Round', 'Group Discussion', 'HR Interview'],
    topics: ['OOP & Java', 'Databases & SQL', 'Cloud Computing', 'Watsonx AI', 'SDLC', 'Linux Basics'],
    tips: [
      'IBM emphasizes cultural fit — align your values with IBM\'s pillars',
      'Know IBM products: Watson, Cloud Pak, Watsonx Orchestrate',
      'Practice STAR method for behavioral questions',
      'Strong aptitude in quant + verbal is essential',
    ],
    duration: '4-6 weeks',
    openings: 'Large',
  },
  {
    name: 'Google',
    logo: '🎯',
    tagline: 'Search & Cloud',
    color: 'from-red-500 to-yellow-500',
    badge: 'bg-red-50 text-red-700 border-red-100',
    difficulty: 'Very Hard',
    rounds: ['Phone Screen', 'Technical (x4)', 'System Design', 'Behavioral'],
    topics: ['LeetCode Hard DSA', 'System Design', 'Distributed Systems', 'OOP', 'SQL', 'Computer Science Fundamentals'],
    tips: [
      'Master 150+ LeetCode problems (Hard level)',
      'System Design is critical — practice designing Google-scale systems',
      'Googliness matters — show curiosity and collaborative mindset',
      'Mock interviews are a must — use Google\'s official guides',
    ],
    duration: '3-6 months',
    openings: 'Competitive',
  },
  {
    name: 'Amazon',
    logo: '📦',
    tagline: 'E-commerce & AWS',
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    difficulty: 'Hard',
    rounds: ['OA Coding', 'Phone Screen', 'Loop Interviews (x5)', 'Bar Raiser'],
    topics: ['DSA & LeetCode', 'OOP Design', 'AWS Services', 'Leadership Principles', 'System Design'],
    tips: [
      'Amazon Leadership Principles are everything — prepare 14 STAR stories',
      'The Bar Raiser is looking for culture fit, not just skills',
      'OA typically has 2 coding questions in 90 minutes',
      'Know AWS core services: EC2, S3, Lambda, DynamoDB',
    ],
    duration: '2-3 months',
    openings: 'High',
  },
  {
    name: 'Microsoft',
    logo: '🪟',
    tagline: 'Azure & Office',
    color: 'from-blue-500 to-cyan-600',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    difficulty: 'Hard',
    rounds: ['Recruiter Screen', 'Technical (x3)', 'As-Appropriate'],
    topics: ['DSA', 'OOP & Design Patterns', 'Azure Cloud', '.NET/C# or Java', 'System Design'],
    tips: [
      'Microsoft values problem-solving clarity — think aloud',
      'Growth mindset is a key hiring criterion',
      'Know .NET ecosystem if applying for software roles',
      'Code quality and edge cases matter more than speed',
    ],
    duration: '6-8 weeks',
    openings: 'Medium-High',
  },
  {
    name: 'Zoho',
    logo: '🟠',
    tagline: 'Business SaaS',
    color: 'from-orange-500 to-red-500',
    badge: 'bg-orange-50 text-orange-700 border-orange-100',
    difficulty: 'Medium',
    rounds: ['Written Test', 'Advanced Programming', 'Technical Interview', 'HR'],
    topics: ['Programming Fundamentals', 'Data Structures', 'DBMS', 'OOP Concepts', 'Aptitude'],
    tips: [
      'Zoho hires freshers heavily — focus on fundamentals',
      'Coding test requires logical thinking and clean code',
      'DBMS and SQL questions are common in the written test',
      'Communication and attitude weigh heavily in HR round',
    ],
    duration: '4-6 weeks',
    openings: 'High (Freshers)',
  },
  {
    name: 'Infosys',
    logo: '💼',
    tagline: 'IT Services',
    color: 'from-teal-600 to-emerald-700',
    badge: 'bg-teal-50 text-teal-700 border-teal-100',
    difficulty: 'Easy-Medium',
    rounds: ['InfyTQ / HackWithInfy', 'Technical Interview', 'HR Interview'],
    topics: ['OOP', 'DSA Basics', 'SQL', 'Computer Networks', 'OS Concepts', 'Java/Python Basics'],
    tips: [
      'InfyTQ certification greatly boosts your application',
      'Core CS subjects (OS, CN, DBMS) are heavily tested',
      'Communication skills are crucial for the HR round',
      'Agile and SDLC knowledge is a plus',
    ],
    duration: '3-4 weeks',
    openings: 'Very High',
  },
  {
    name: 'TCS',
    logo: '🏢',
    tagline: 'IT Consulting',
    color: 'from-blue-700 to-indigo-800',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    difficulty: 'Easy',
    rounds: ['TCS NQT', 'Technical Interview', 'MR Interview', 'HR Interview'],
    topics: ['Aptitude & Reasoning', 'Verbal English', 'Coding (C/Java/Python)', 'CS Fundamentals'],
    tips: [
      'TCS NQT is the gateway — practice aptitude rigorously',
      'Verbal ability and communication are equally important',
      'Basic coding in any language is sufficient for entry level',
      'Be confident and clear in MR (Managerial Round)',
    ],
    duration: '2-3 weeks',
    openings: 'Mass Hiring',
  },
  {
    name: 'Cognizant',
    logo: '🔷',
    tagline: 'Digital Engineering',
    color: 'from-sky-600 to-blue-700',
    badge: 'bg-sky-50 text-sky-700 border-sky-100',
    difficulty: 'Easy-Medium',
    rounds: ['Aptitude Test', 'Technical Interview', 'HR Interview'],
    topics: ['Core Java', 'SQL', 'OOP', 'Data Structures', 'Agile', 'Testing Basics'],
    tips: [
      'Focus on Java and OOP — most projects are Java-based',
      'SQL and database questions are standard',
      'Show enthusiasm for learning new technologies',
      'Dress code and professionalism matter in Cognizant culture',
    ],
    duration: '2-3 weeks',
    openings: 'High',
  },
  {
    name: 'Capgemini',
    logo: '⚙️',
    tagline: 'Technology & Consulting',
    color: 'from-blue-600 to-violet-700',
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
    difficulty: 'Easy-Medium',
    rounds: ['Pseudocode Test', 'Technical Proctored Test', 'Technical Interview', 'HR Interview'],
    topics: ['Pseudocode & Logic', 'C/Java Basics', 'DBMS', 'Aptitude', 'English'],
    tips: [
      'Pseudocode section is unique to Capgemini — practice logic first',
      'Technical test covers MCQs on C, OOP, DBMS',
      'Capgemini values presentation skills in interviews',
      'Knowledge of Agile/Scrum methodology is beneficial',
    ],
    duration: '2-3 weeks',
    openings: 'High',
  },
];

const CompanyPrepPage = () => {
  const [selected, setSelected] = useState(null);
  const chatRef = useRef(null);

  const generateQuestions = () => {
    if (!selected) return;
    const prompt = `Generate 8 most important interview questions for ${selected.name} with detailed model answers.

Include a mix of:
- 3 Technical questions specific to ${selected.name}'s tech stack: ${selected.topics.slice(0, 3).join(', ')}
- 2 System Design questions (if applicable)
- 2 Behavioral questions aligned with ${selected.name}'s culture
- 1 HR / situational question

For each question, provide:
Q: [Question]
Model Answer: [Detailed answer with key points]

Make answers practical and interview-ready.`;

    chatRef.current?.sendMessage(prompt);
  };

  if (selected) {
    return (
      <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto pb-10">
        {/* Header */}
        <div className={`bg-gradient-to-r ${selected.color} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setSelected(null)}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-4xl">{selected.logo}</div>
            <div>
              <h1 className="text-2xl font-bold">{selected.name} Interview Prep</h1>
              <p className="text-white/80 text-sm mt-0.5">{selected.tagline} · {selected.difficulty} difficulty</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interview Process */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Interview Process
            </h2>
            <div className="space-y-3">
              {selected.rounds.map((round, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300">
                    {round}
                  </div>
                  {i < selected.rounds.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Topics & Tips */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-500" /> Key Topics to Cover
              </h2>
              <div className="flex flex-wrap gap-2">
                {selected.topics.map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800 text-xs font-semibold">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">Difficulty</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selected.difficulty}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">Prep Duration</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selected.duration}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Insider Preparation Tips
              </h2>
              <div className="space-y-3">
                {selected.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl">
                    <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Questions Chat Interface */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Interactive Prep Coach
              </h2>
              <p className="text-sm text-slate-400 mt-1">Get AI-generated interview questions and ask follow-ups.</p>
            </div>
            <button
              onClick={generateQuestions}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Generate Questions
            </button>
          </div>

          <div className="mt-4">
            <ChatInterface 
              ref={chatRef} 
              height="600px" 
              saveHistory={false} 
              placeholder={`Ask the coach about ${selected.name}...`}
              welcomeText={`Hi! Click "Generate Questions" to get started, or ask me any question about interviewing at ${selected.name}!`}
              initialMessages={[{
                id: 0,
                role: 'assistant',
                text: `Hi! Click "Generate Questions" to get started, or ask me any question about interviewing at ${selected.name}!`
              }]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="flex items-center gap-3 relative">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Company Preparation</h1>
            <p className="text-blue-200 text-sm mt-0.5">Targeted interview prep for top companies</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPANIES.map((company) => (
          <button
            key={company.name}
            onClick={() => setSelected(company)}
            className="card p-6 text-left group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {company.logo}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${company.badge}`}>
                {company.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{company.name}</h3>
            <p className="text-sm text-slate-400 mt-0.5 mb-4">{company.tagline}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {company.duration}
              </span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-2 transition-all">
                Prepare <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
              {company.topics.slice(0, 3).map(t => (
                <span key={t} className="text-xs px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg border border-slate-100 dark:border-slate-700">
                  {t}
                </span>
              ))}
              {company.topics.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-slate-400">+{company.topics.length - 3} more</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanyPrepPage;
