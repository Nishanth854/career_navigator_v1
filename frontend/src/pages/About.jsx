import React, { useState } from 'react';
import { Info, Zap, Target, Search, BrainCircuit, Star, Quote, MessageSquare, HelpCircle, ChevronDown, Send, CheckCircle2 } from 'lucide-react';

const advantages = [
  {
    title: "AI-Powered Valuation",
    description: "Leverages cutting-edge Google Gemini models to provide deeply personalized career strategies based on your exact profile.",
    icon: <BrainCircuit size={24} className="text-indigo-400" />,
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  },
  {
    title: "Semantic Opportunity Search",
    description: "Uses LanceDB vector search to match your unique skills with real-world internships, scholarships, and hackathons.",
    icon: <Search size={24} className="text-blue-400" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Dynamic Roadmap",
    description: "Provides an actionable, step-by-step 4-year navigation timeline to guide you from freshman year to final placements.",
    icon: <Target size={24} className="text-purple-400" />,
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    title: "Real-Time Online Fetching",
    description: "Bypasses stale local databases by fetching live, relevant web URLs and live RSS news feeds automatically.",
    icon: <Zap size={24} className="text-amber-400" />,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  }
];

const testimonials = [
  {
    name: "Alex M.", role: "Computer Science",
    quote: "The AI Career Strategy completely changed how I view my resume. I landed my first internship using the exact live links it provided!",
    rating: 5
  },
  {
    name: "Sarah K.", role: "Information Tech",
    quote: "Finally, a platform that doesn't just give generic advice. The market score valuation engine is incredibly accurate and motivating.",
    rating: 5
  },
  {
    name: "Rahul T.", role: "Software Engineering",
    quote: "The real-time updates for education schemes and hackathons saved me hours of manual searching. Best capstone project ever.",
    rating: 5
  }
];

const faqs = [
  { q: "How is my Market Score calculated?", a: "Your score is a weighted average of your GPA, technical skills, and certifications, minus a penalty for any history of arrears." },
  { q: "Where does the Live News Feed come from?", a: "We pull completely free, real-time RSS feeds directly from top education publishers online." },
  { q: "Can I use the AI without an API key?", a: "The AI Career Strategy and dynamic online recommendations require a valid Google Gemini API key configured in the backend." },
  { q: "How do I update my profile?", a: "Click on your Account dropdown in the top right navigation bar to edit your personal details and upload documents." }
];

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setRating(5);
      e.target.reset();
    }, 4000);
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-4 mt-8">
        <div className="inline-flex bg-indigo-500/10 p-4 rounded-full border border-indigo-500/20 mb-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Info size={40} className="text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white">About StudentMate</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          An advanced, AI-driven platform engineered to bridge the gap between academic learning and industry readiness.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center bg-slate-900/50 p-2 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
        <button onClick={() => setActiveTab('overview')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <Info size={16}/> Overview
        </button>
        <button onClick={() => setActiveTab('feedback')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'feedback' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <MessageSquare size={16}/> Submit Feedback
        </button>
        <button onClick={() => setActiveTab('help')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'help' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <HelpCircle size={16}/> Help Center
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-16 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            {advantages.map((adv, idx) => (
              <div key={idx} className={`bg-slate-900/60 backdrop-blur-md border ${adv.border} p-8 rounded-[2rem] hover:-translate-y-1 transition-transform group shadow-xl shadow-slate-950/50 relative z-10`}>
                <div className={`inline-flex p-4 rounded-2xl ${adv.bg} mb-5 border ${adv.border}`}>
                  {adv.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{adv.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{adv.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/40 border-y border-slate-800/50 py-16 -mx-8 px-8">
            <h2 className="text-2xl font-black text-center text-white mb-8">Beta Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item, idx) => (
                <div key={idx} className="bg-slate-950/50 border border-slate-800/80 p-8 rounded-[2rem] relative">
                  <Quote size={40} className="absolute top-4 right-4 text-slate-800/50 -rotate-12" />
                  <div className="flex gap-1 mb-4 relative z-10">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-slate-300 italic mb-6 text-sm leading-relaxed relative z-10">"{item.quote}"</p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30 font-black text-indigo-400 text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/60 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-2">We value your input!</h2>
            <p className="text-slate-400 text-sm mb-8">Help us improve the StudentMate platform by sharing your experience, bugs you found, or feature requests.</p>
            
            {feedbackSubmitted ? (
              <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-3xl text-center space-y-4 animate-in zoom-in-95">
                <div className="inline-flex bg-green-500/20 p-4 rounded-full">
                  <CheckCircle2 size={40} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Feedback Received!</h3>
                <p className="text-slate-400 text-sm">Thank you for helping us build a better platform.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">How would you rate your experience?</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star size={32} className={`${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700 fill-slate-800'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Your Name</label>
                    <input type="text" required placeholder="John Doe" className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl outline-none focus:border-indigo-500 text-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Department</label>
                    <input type="text" placeholder="Computer Science" className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl outline-none focus:border-indigo-500 text-white transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Your Feedback</label>
                  <textarea required rows="4" placeholder="Tell us what you love, what's broken, or what we should add next..." className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl outline-none focus:border-indigo-500 text-white transition-colors resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                  <Send size={18} /> Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: HELP CENTER */}
      {activeTab === 'help' && (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-8 rounded-[2rem] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Need Assistance?</h2>
              <p className="text-slate-300 text-sm max-w-md">Browse our most frequently asked questions below or reach out to your university's placement cell for direct support.</p>
            </div>
            <div className="hidden md:flex w-24 h-24 bg-blue-500/20 rounded-full items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <HelpCircle size={40} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-slate-800/50 last:border-0">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)} 
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                >
                  <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{faq.q}</span>
                  <ChevronDown size={20} className={`text-slate-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-6 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/30 mt-2">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default About;
