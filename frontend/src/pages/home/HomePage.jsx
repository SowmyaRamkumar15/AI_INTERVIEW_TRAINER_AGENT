import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routePaths';
import { BrainCircuit, Video, TrendingUp, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-white/20 z-50 flex items-center justify-between px-6 lg:px-12 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Copilot
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to={ROUTES.LOGIN} className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
            Log In
          </Link>
          <Link to={ROUTES.REGISTER} className="btn-primary group flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-medium text-sm mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
          AI-Powered Placement Prep
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Master your interviews with an <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Intelligent Copilot</span>
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '300ms' }}>
          Practice mock interviews, get instant feedback on your resume, and follow personalized learning roadmaps to land your dream job faster.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link to={ROUTES.REGISTER} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
            Start Practicing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-lg border border-slate-200 shadow-sm hover:shadow transition-all duration-300">
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Our AI agent provides comprehensive tools to identify your skill gaps and prepare you for any technical or behavioral interview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI Mock Interviews</h3>
              <p className="text-slate-500 leading-relaxed">
                Conduct realistic voice and text-based mock interviews. Get instant feedback on your tone, confidence, and technical accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Personalized Roadmaps</h3>
              <p className="text-slate-500 leading-relaxed">
                Our AI analyzes your resume and target role to generate a dynamic, step-by-step learning roadmap tailored just for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Skill Gap Analytics</h3>
              <p className="text-slate-500 leading-relaxed">
                Track your progress with detailed analytics. We highlight your strengths and pinpoint areas that need more practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800 to-purple-600 opacity-90"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to ace your next interview?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already using AI Copilot to land offers at top tech companies.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ROUTES.REGISTER} className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              Create Free Account
            </Link>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-indigo-200 text-sm font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> No credit card required</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Free resume analysis</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Unlimited roadmaps</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 lg:px-12 text-slate-400 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <BrainCircuit className="w-6 h-6 text-indigo-500" />
          <span className="text-xl font-bold text-white">AI Copilot</span>
        </div>
        <p className="mb-6 max-w-md mx-auto">Empowering students to achieve their career goals through intelligent interview preparation.</p>
        <div className="pt-8 border-t border-slate-800 text-sm">
          &copy; {new Date().getFullYear()} AI Interview Trainer Agent. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
