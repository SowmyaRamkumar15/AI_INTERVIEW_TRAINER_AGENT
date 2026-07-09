import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { chatService } from '../../services/chatService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = forwardRef(({
  initialMessages = [],
  placeholder = "Ask something...",
  height = "calc(100vh - 12rem)",
  showClear = true,
  onClear = null,
  welcomeText = "Chat cleared!",
  saveHistory = false // If true, can load/save to backend history
}, ref) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const historyLoadedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    sendMessage: (text) => send(text),
    clear: clearChat
  }));

  // Optionally load chat history
  useEffect(() => {
    if (!saveHistory) return;
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
          setMessages((prev) => {
            // Keep the initial welcome message, then append history
            const init = prev.length > 0 && prev[0].role === 'assistant' ? [prev[0]] : [];
            return [...init, ...restored];
          });
        }
      })
      .catch(() => {});
  }, [saveHistory]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (overrideText = null) => {
    const text = typeof overrideText === 'string' ? overrideText.trim() : input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (typeof overrideText !== 'string') setInput('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(text);
      const reply = res?.data?.response ?? res?.response ?? "I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: '⚠️ Could not reach the server. Make sure the backend is running.' },
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
    setMessages([{ id: Date.now(), role: 'assistant', text: welcomeText }]);
    if (onClear) onClear();
  };

  return (
    <div className="flex flex-col animate-fade-in-up w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4" style={{ height }}>
      {/* Header controls */}
      {showClear && (
        <div className="flex justify-end mb-2 shrink-0">
          <button onClick={clearChat} title="Clear chat" className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-br from-purple-600 to-indigo-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-x-auto ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm markdown-container'}`}>
              {msg.role === 'user' ? (
                <span className="whitespace-pre-wrap">{msg.text}</span>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
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
      <div className="shrink-0">
        <div className="flex gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="shrink-0 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors self-end"
          >
            {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          Press <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-500 font-mono text-xs">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-500 font-mono text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
});

export default ChatInterface;
