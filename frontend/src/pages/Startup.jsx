import React, { useState } from 'react';
import { Rocket, Target, Users, LayoutDashboard, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

const API_BASE = "/api/v1";

const Startup = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    startupTitle: '',
    startupIdea: ''
  });

  const handleStartupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/startup-valuation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Failed to analyze startup.");
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative animate-in fade-in zoom-in-95 duration-500">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-4 inline-flex items-center gap-4">
          <Rocket className="text-orange-500" size={40} />
          Startup Engine
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Validate your idea, discover your target audience, and instantly match with relevant government grants, seed funds, and incubators using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 border border-orange-500/20 p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.05)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h3 className="text-orange-400 font-bold text-xs uppercase mb-6 tracking-wider flex items-center gap-2">
              <Target size={14} /> Pitch Your Idea
            </h3>

            <form onSubmit={handleStartupSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Startup / Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Edutek Solutions" 
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 text-white transition-colors" 
                  value={formData.startupTitle} 
                  onChange={(e) => setFormData({...formData, startupTitle: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">The Pitch / Concept</label>
                <textarea 
                  required
                  placeholder="Describe your startup idea, the problem it solves, and the technology it uses..." 
                  rows="6" 
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 text-white resize-none transition-colors" 
                  value={formData.startupIdea} 
                  onChange={(e) => setFormData({...formData, startupIdea: e.target.value})}
                ></textarea>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-4 rounded-2xl">
                  {error}
                </div>
              )}
              
              <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 p-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Analyzing Market...</>
                ) : (
                  <>Run AI Validation <Rocket size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              {/* Validation & Strategy Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <LayoutDashboard size={16} className="text-orange-400" /> Executive Strategy
                </h3>
                <p className="text-white text-lg leading-relaxed font-medium mb-6">
                  {result.ai_strategy}
                </p>

                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 flex items-start gap-4">
                  <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Audience</h4>
                    <p className="text-slate-200 text-sm">{result.target_audience}</p>
                  </div>
                </div>
              </div>

              {/* Subsidies Grid */}
              {result.ai_recommendations?.subsidies?.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Briefcase className="text-orange-500" /> Relevant Grants & Subsidies
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.ai_recommendations.subsidies.map((sub, idx) => (
                      <a key={idx} href={sub.url} target="_blank" rel="noreferrer" className="block bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-orange-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                          <ChevronRight className="text-orange-400" size={20} />
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2 pr-6">{sub.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-3">{sub.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Incubators Grid */}
              {result.ai_recommendations?.incubators?.length > 0 && (
                <div className="space-y-4 pt-6">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Target className="text-rose-500" /> Recommended Incubators
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.ai_recommendations.incubators.map((inc, idx) => (
                      <a key={idx} href={inc.url} target="_blank" rel="noreferrer" className="block bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-rose-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                          <ChevronRight className="text-rose-400" size={20} />
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2 pr-6">{inc.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-3">{inc.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500">
              <Rocket size={64} className="mb-6 opacity-20"/>
              <span className="text-sm uppercase tracking-widest font-bold">Awaiting Startup Concept</span>
              <p className="text-xs mt-2 max-w-sm text-center opacity-70 leading-relaxed">Enter your project title and concept on the left to receive a comprehensive AI market analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Startup;
