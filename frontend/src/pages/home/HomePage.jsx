import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routePaths';
import {
  BrainCircuit, Video, TrendingUp, Target, ArrowRight, CheckCircle2,
  BookOpen, Building2, Map, MessageSquare, BarChart3, FileText
} from 'lucide-react';

const FEATURES = [
  {
    icon: Video, color: 'bg-blue-100 text-blue-600',
    title: 'AI Mock Interviews',
    desc: 'Conduct realistic mock interviews powered by IBM Watsonx. Get instant feedback on technical accuracy, confidence, and communication.',
  },
  {
    icon: Target, color: 'bg-purple-100 text-purple-600',
    title: 'Personalized Roadmaps',
    desc: 'AI analyzes your resume and target role to generate a dynamic, step-by-step learning roadmap tailored just for you.',
  },
  {
    icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600',
    title: 'Skill Gap Analytics',
    desc: 'Track your progress with detailed analytics. Highlights your strengths and pinpoints areas that need more practice.',
  },
  {
    icon: BookOpen, color: 'bg-amber-100 text-amber-600',
    title: 'Study Plans',
    desc: 'Generate 7, 14, or 30-day personalized study plans with daily goals, coding practice, and mock interview sessions.',
  },
  {
    icon: Building2, color: 'bg-rose-100 text-rose-600',
    title: 'Company Prep',
    desc: 'Targeted preparation for IBM, Google, Amazon, Microsoft, Infosys, TCS and more — with company-specific questions.',
  },
  {
    icon: FileText, color: 'bg-cyan-100 text-cyan-600',
    title: 'Resume Analysis',
    desc: 'Upload your resume and get instant skill gap analysis, improvement suggestions, and personalized interview questions.',
  },
];

const STATS = [
  { value: '50K+', label: 'Students Trained' },
  { value: '200+', label: 'Companies Covered' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '10K+', label: 'Mock Interviews Done' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-white/20 z-50 flex items-center justify-between px-6 lg:px-12 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Interviora
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block text-sm">Features</a>
          <a href="#stats" className="font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block text-sm">About</a>
          <Link to={ROUTES.LOGIN} className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
            Log In
          </Link>
          <Link to={ROUTES.REGISTER} className="btn-primary group flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-36 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50" />

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm mb-8 animate-fade-in-up shadow-sm"
          style={{ animationDelay: '100ms' }}
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          Powered by IBM Watsonx Orchestrate (RAG)
        </div>

        <h1
          className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-5xl mb-6 animate-fade-in-up leading-tight"
          style={{ animationDelay: '200ms' }}
        >
          Your AI-Powered{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Interview Mentor
          </span>
        </h1>

        <p
          className="text-lg lg:text-xl text-slate-600 max-w-2xl mb-10 animate-fade-in-up leading-relaxed"
          style={{ animationDelay: '300ms' }}
        >
          Practice mock interviews, analyze your resume, follow personalized roadmaps, and get company-specific preparation — all powered by IBM Watsonx AI with RAG.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link
            to={ROUTES.REGISTER}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-lg border border-slate-200 shadow-sm hover:shadow transition-all duration-300 text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free resume analysis</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> IBM Watsonx RAG</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 9 major companies</div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-6 lg:px-12 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{s.value}</p>
              <p className="text-slate-500 mt-1 font-medium text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs mb-4">
              <BarChart3 className="w-3.5 h-3.5" /> Everything you need
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Complete Interview Preparation Platform
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From resume analysis to mock interviews, study plans to company-specific prep — Interviora covers every aspect of your interview journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card p-8 group hover:-translate-y-2 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-600" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm mb-6">
            <MessageSquare className="w-4 h-4" /> IBM Watsonx RAG Powered
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to ace your next interview?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already using Interviora to land offers at IBM, Google, Amazon, and more.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold text-lg shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-14 px-6 lg:px-12 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-2 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">Interviora</span>
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Login</Link>
              <Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} Interviora – Interviora. All rights reserved.</p>
            <p className="flex items-center gap-1.5">Powered by <span className="text-indigo-400 font-semibold">IBM Watsonx Orchestrate</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
