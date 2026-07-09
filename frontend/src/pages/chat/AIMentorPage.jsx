import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ChatInterface from '../../components/chat/ChatInterface';

const AIMentorPage = () => {
  const { user } = useAuth();
  const chatRef = useRef(null);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in-up">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-3 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Interviora</h1>
            <p className="text-sm text-slate-500">Your personal interview coach</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Interactive Coach */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatInterface
          ref={chatRef}
          saveHistory={true}
          height="100%"
          placeholder="Ask about interview prep, salary negotiation, coding tips…"
          welcomeText={`Chat cleared! Ask me anything about interview prep, ${user?.name?.split(' ')[0] || 'there'}. 😊`}
          initialMessages={[
            {
              id: 0,
              role: 'assistant',
              text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Interview Coach.\n\nAsk me anything about interview prep! Try:\n- **"How to answer system design questions"**\n- **"Explain the STAR method"**\n- **"Common React interview questions"**\n- **"How to negotiate salary"**\n- **"Coding interview tips"**`,
            }
          ]}
        />
      </div>
    </div>
  );
};

export default AIMentorPage;
