import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';

// Render markdown-style bold (**text**) and bullet points simply
function renderMessage(text) {
  return text.split('\n').map((line, i) => {
    // Replace **bold** with <strong>
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    return (
      <span key={i} className="block">
        {parts}
      </span>
    );
  });
}

const AIMentorPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Interview Coach.\n\nAsk me anything about interview prep! Try:\n- **"How to answer system design questions"**\n- **"Explain the STAR method"**\n- **"Common React interview questions"**\n- **"How to negotiate salary"**\n- **"Coding interview tips"**`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const historyLoadedRef = useRef(false);

  // Load chat history on mount — ref guard prevents double-load in React StrictMode
  useEffect(() => {
    if (historyLoadedRef.current) return;
    historyLoadedRef.current = true;

    chatService.getHistory()
      .then((res) => {
        const history = res?.data ?? [];
        if (history.length > 0) {
          const restored = history.flatMap((h) => [
            { id: `h-u-${h.id ?? Math.random()}`, role: 'user', text: h.question },
            { id: `h-a-${h.id ?? Math.random()}`, role: 'assistant', text: h.response },
          ]);
          setMessages((prev) => [...prev, ...restored]);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(text);
      const reply = res?.data?.response ?? res?.response ?? "I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: '⚠️ Could not reach the server. Make sure the backend is running on port 8080.' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        text: `Chat cleared! Ask me anything about interview prep, ${user?.name?.split(' ')[0] || 'there'}. 😊`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in-up">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Mentor</h1>
            <p className="text-sm text-slate-500">Your personal interview coach</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
              msg.role === 'user'
                ? 'bg-indigo-600'
                : 'bg-gradient-to-br from-purple-600 to-indigo-600'
            }`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4" />
                : <Bot className="w-4 h-4" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm'
            }`}>
              {renderMessage(msg.text)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 flex-row">
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 shrink-0">
        <div className="flex gap-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about interview prep, salary negotiation, coding tips…"
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="shrink-0 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors self-end"
          >
            {loading
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-xs">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default AIMentorPage;
