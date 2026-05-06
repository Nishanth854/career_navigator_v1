import React, { useState } from 'react';
import { Trophy, Briefcase, GraduationCap, Target, BookOpen, Code, Users, X, CheckCircle2, Loader2, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

const API_BASE = "http://127.0.0.1:8001/api/v1";

const CategorySection = ({ title, items, icon, colorClass, isOnline, onOnlineClick }) => (
  <div className="space-y-4">
    <h3 className={`text-lg font-bold flex items-center gap-2 px-2 ${colorClass}`}>
      {icon} {title}
    </h3>
    <div className="grid grid-cols-1 gap-3">
      {items && items.length > 0 ? items.map((item, i) => {
        if (isOnline) {
          return (
            <button key={i} type="button" onClick={() => onOnlineClick(item, title)} className="text-left w-full block bg-slate-900/40 border border-slate-800 p-5 rounded-2xl group transition-all hover:border-indigo-500/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1 pr-2">
                  <h4 className="font-bold text-white group-hover:text-indigo-400 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </div>
                <span className="text-[9px] font-black uppercase text-pink-400 bg-pink-500/10 px-2 py-1 rounded flex-shrink-0 flex items-center gap-1">
                  <Target size={10}/> Analyze
                </span>
              </div>
            </button>
          );
        }
        return (
          <div key={i} className="block bg-slate-900/40 border border-slate-800 p-5 rounded-2xl group transition-all hover:border-indigo-500/50">
            <div className="flex justify-between items-start">
              <div className="space-y-1 pr-2">
                <h4 className="font-bold text-white group-hover:text-indigo-400 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{item.company} • {item.location}</p>
              </div>
              <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded flex-shrink-0">
                {item.type}
              </span>
            </div>
          </div>
        );
      }) : <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-600 text-xs">No matches found.</div>}
    </div>
  </div>
);

const Evaluate = ({ user, profile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('academics');
  const [manualData, setManualData] = useState({ 
    gpa: '', 
    year: '1',
    semester: '1',
    arrears: '0',
    skills: '',
    certifications: '',
    community: 'OC',
    familyIncome: 'Below 2 Lakhs'
  });

  // Modal State
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState(null);
  const [analyzingScheme, setAnalyzingScheme] = useState(false);

  const handleOnlineClick = async (item, type) => {
    setSelectedScheme({ ...item, type });
    setSchemeModalOpen(true);
    setAnalyzingScheme(true);
    setSchemeDetails(null);
    try {
      const res = await fetch(`${API_BASE}/analyze-scheme`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, url: item.url, type }),
      });
      const data = await res.json();
      setSchemeDetails(data);
    } catch (err) {
      console.error("Failed to analyze scheme:", err);
    } finally {
      setAnalyzingScheme(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: profile?.full_name || 'Student',
        department: profile?.department || 'General',
        college: profile?.college || 'University',
        gpa: manualData.gpa,
        year: manualData.year,
        semester: manualData.semester,
        arrears: manualData.arrears,
        skills: manualData.skills,
        certifications: manualData.certifications,
        community: manualData.community,
        familyIncome: manualData.familyIncome
      };

      const res = await fetch(`${API_BASE}/manual-valuation`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();

      if (user && profile) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: profile.full_name,
          department: profile.department,
          college: profile.college,
          valuation_score: resData.valuation_score
        });
      }

      setResult(resData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-indigo-400 font-bold text-xs uppercase mb-4 tracking-wider">Run Valuation Engine</h3>
            
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Evaluating Profile For:</p>
              <p className="font-bold text-white">{profile?.full_name}</p>
              <p className="text-xs text-slate-300">{profile?.department} • {profile?.college}</p>
            </div>

            {/* TABS */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6">
              <button onClick={() => setActiveTab('academics')} type="button" className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'academics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><BookOpen size={14}/> Academics</button>
              <button onClick={() => setActiveTab('skills')} type="button" className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'skills' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Code size={14}/> Skills</button>
              <button onClick={() => setActiveTab('demo')} type="button" className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'demo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Users size={14}/> Profile</button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              
              {/* ACADEMICS TAB */}
              {activeTab === 'academics' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current GPA</label>
                    <input type="number" step="0.1" max="10" required placeholder="e.g. 8.5" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white" value={manualData.gpa} onChange={(e) => setManualData({...manualData, gpa: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Year</label>
                      <select className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white" value={manualData.year} onChange={(e) => setManualData({...manualData, year: e.target.value})}>
                        {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Semester</label>
                      <select className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white" value={manualData.semester} onChange={(e) => setManualData({...manualData, semester: e.target.value})}>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">History of Arrears</label>
                    <input type="number" min="0" required placeholder="0" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white" value={manualData.arrears} onChange={(e) => setManualData({...manualData, arrears: e.target.value})} />
                  </div>
                  <button type="button" onClick={() => setActiveTab('skills')} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl font-bold text-sm transition-colors text-indigo-400 mt-2">Next: Skills & Certs →</button>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Technical Skills</label>
                    <textarea required placeholder="React, Python, AWS..." rows="3" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white resize-none" value={manualData.skills} onChange={(e) => setManualData({...manualData, skills: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Certifications (Optional)</label>
                    <textarea placeholder="AWS Cloud Practitioner, Coursera Machine Learning..." rows="3" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white resize-none" value={manualData.certifications} onChange={(e) => setManualData({...manualData, certifications: e.target.value})}></textarea>
                  </div>
                  <button type="button" onClick={() => setActiveTab('demo')} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl font-bold text-sm transition-colors text-indigo-400 mt-2">Next: Profile →</button>
                </div>
              )}

              {/* DEMO TAB */}
              {activeTab === 'demo' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Community</label>
                    <select className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white" value={manualData.community} onChange={(e) => setManualData({...manualData, community: e.target.value})}>
                      <option value="OC">OC</option>
                      <option value="BC">BC</option>
                      <option value="MBC">MBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Annual Family Income</label>
                    <select className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-white" value={manualData.familyIncome} onChange={(e) => setManualData({...manualData, familyIncome: e.target.value})}>
                      <option value="Below 2 Lakhs">Below 2 Lakhs (₹)</option>
                      <option value="2 Lakhs - 5 Lakhs">2 Lakhs - 5 Lakhs (₹)</option>
                      <option value="5 Lakhs - 8 Lakhs">5 Lakhs - 8 Lakhs (₹)</option>
                      <option value="Above 8 Lakhs">Above 8 Lakhs (₹)</option>
                    </select>
                  </div>
                  
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20 mt-6">{loading ? 'Calculating...' : 'Valuate Profile'}</button>
                </div>
              )}

            </form>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-12 rounded-[3rem] flex justify-between items-center relative overflow-hidden shadow-[0_20px_60px_rgba(79,70,229,0.3)] border border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-sm uppercase font-black text-indigo-200 tracking-[0.3em] mb-3">Market Score</p>
                  <h1 className="text-[8rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-300 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">{result.valuation_score}</h1>
                </div>
                <div className="relative z-10">
                  <Trophy size={140} className="text-white opacity-5 absolute right-0 top-0 blur-sm -translate-y-4" />
                  <Trophy size={140} className="text-indigo-200 opacity-20 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
                </div>
              </div>
              {/* AI Strategy Panel */}
              {result.ai_strategy && (
                <div className="bg-slate-900/60 border border-indigo-500/30 p-6 rounded-3xl relative overflow-hidden shadow-xl shadow-indigo-500/5">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2"><Target size={16}/> AI Career Strategy</h3>
                  <p className="text-slate-200 text-sm leading-relaxed">{result.ai_strategy}</p>
                </div>
              )}

              {/* AI Online Recommendations */}
              <h3 className="text-xl font-black text-white pt-4 border-b border-slate-800 pb-2">AI Online Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CategorySection isOnline={true} onOnlineClick={handleOnlineClick} title="Internships" items={result.ai_recommendations?.internships} icon={<Briefcase size={20}/>} colorClass="text-blue-400" />
                <CategorySection isOnline={true} onOnlineClick={handleOnlineClick} title="Scholarships" items={result.ai_recommendations?.scholarships} icon={<GraduationCap size={20}/>} colorClass="text-green-400" />
                <CategorySection isOnline={true} onOnlineClick={handleOnlineClick} title="Hackathons & Events" items={result.ai_recommendations?.events} icon={<Target size={20}/>} colorClass="text-purple-400" />
              </div>

              {/* Local Database Matches */}
              <h3 className="text-xl font-black text-white pt-4 border-b border-slate-800 pb-2">Local Database Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CategorySection title="Internships" items={result.matches?.internships} icon={<Briefcase size={20}/>} colorClass="text-blue-400" />
                <CategorySection title="Scholarships" items={result.matches?.scholarships} icon={<GraduationCap size={20}/>} colorClass="text-green-400" />
                <CategorySection title="Hackathons & Events" items={result.matches?.events} icon={<Target size={20}/>} colorClass="text-purple-400" />
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500">
              <Target size={48} className="mb-4 opacity-20"/>
              <span className="text-xs uppercase tracking-widest font-bold">Awaiting Profile Entry</span>
              <p className="text-[10px] mt-2 max-w-xs text-center opacity-70">Fill out the valuation form on the left to see your market score and matched opportunities.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Scheme Analysis Modal */}
      {schemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSchemeModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-2xl rounded-3xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Target size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-tight">AI Application Assistant</h3>
                  <p className="text-xs text-slate-400">{selectedScheme?.title}</p>
                </div>
              </div>
              <button onClick={() => setSchemeModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              {analyzingScheme ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <Loader2 size={64} className="text-indigo-400 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">Analyzing Scheme...</h3>
                  <p className="text-sm text-slate-400 max-w-sm">Gemini is gathering the required documents and building a step-by-step application procedure.</p>
                </div>
              ) : schemeDetails ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Documents */}
                  <div>
                    <h4 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <FileText size={16} /> Required Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {schemeDetails.documents?.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                          <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-200">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Procedure */}
                  <div>
                    <h4 className="text-sm font-bold text-pink-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <Target size={16} /> Application Procedure
                    </h4>
                    <div className="space-y-4">
                      {schemeDetails.procedure?.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-black text-xs flex-shrink-0">
                              {idx + 1}
                            </div>
                            {idx !== schemeDetails.procedure.length - 1 && (
                              <div className="w-px h-full bg-slate-800 my-1"></div>
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-sm text-slate-300 leading-relaxed mt-1">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-12">Failed to load details.</div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-4">
              <button onClick={() => setSchemeModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition-colors">
                Cancel
              </button>
              <a 
                href={selectedScheme?.url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${analyzingScheme ? 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'}`}
              >
                Apply Now <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluate;
