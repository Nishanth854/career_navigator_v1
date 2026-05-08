import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User as UserIcon } from 'lucide-react';

const API_BASE = "/api/v1";

const Chatbot = ({ profile, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hi ${profile?.full_name?.split(' ')[0] || 'there'}! I'm StudentMate AI. Ask me anything about your roadmap, valuation score, or general career advice!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat-support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: userText,
          context: {
            name: profile?.full_name,
            department: profile?.department,
            college: profile?.college,
            score: profile?.valuation_score
          }
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting to my neural network right now. Try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-0 top-14 mt-4 w-[350px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-indigo-500/20 overflow-hidden flex flex-col z-50 animate-in slide-in-from-top-4 fade-in duration-200" style={{ height: '500px' }}>
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-indigo-200" />
          <h3 className="font-bold text-white text-sm">StudentMate Assistant</h3>
        </div>
        <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-indigo-500/20 text-indigo-400'}`}>
              {msg.sender === 'user' ? <UserIcon size={14} className="text-slate-300" /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm max-w-[75%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
          type="text" 
          placeholder="Ask me anything..." 
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-xl transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
