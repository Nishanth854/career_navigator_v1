import React from 'react';
import { Compass, Code2, Rocket, Award, CheckCircle2 } from 'lucide-react';

const phases = [
  {
    id: 1,
    title: "Exploration & Foundation",
    year: "Year 1",
    icon: <Compass size={24} className="text-blue-400" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    color: "text-blue-400",
    description: "Discover your interests and build a strong academic core.",
    tasks: ["Maintain a GPA above 8.0", "Explore 3 different tech domains", "Join 1 technical college club"]
  },
  {
    id: 2,
    title: "Skill Acquisition",
    year: "Year 2",
    icon: <Code2 size={24} className="text-purple-400" />,
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    color: "text-purple-400",
    description: "Deep dive into your chosen tech stack and start building.",
    tasks: ["Complete 2 online certifications", "Build 3 beginner projects", "Create your GitHub & LinkedIn profiles"]
  },
  {
    id: 3,
    title: "Real-world Application",
    year: "Year 3",
    icon: <Rocket size={24} className="text-pink-400" />,
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    color: "text-pink-400",
    description: "Test your skills in the wild and gain industry exposure.",
    tasks: ["Participate in 2 Hackathons", "Secure a summer internship", "Publish an advanced portfolio project"]
  },
  {
    id: 4,
    title: "Market Readiness",
    year: "Year 4",
    icon: <Award size={24} className="text-amber-400" />,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    color: "text-amber-400",
    description: "Finalize your profile and secure your dream role.",
    tasks: ["Run the AI Valuation Engine", "Apply to 20+ targeted companies", "Prepare for technical interviews"]
  }
];

const Home = () => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-indigo-500/10">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg mb-4 inline-block">Career Navigation Hub</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Master Your <br/>Career Trajectory.</h1>
          <p className="text-slate-300 max-w-xl text-lg">Follow the ultimate 4-phase navigation roadmap below to build an unbeatable profile before graduation.</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative max-w-5xl mx-auto pt-8">
        {/* Central Glowing Line (Desktop Only) */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-900 -translate-x-1/2 rounded-full hidden md:block"></div>
        
        <div className="space-y-12">
          {phases.map((phase, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={phase.id} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Center Node (Desktop Only) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-900 border-4 border-slate-800 rounded-full items-center justify-center z-10 shadow-xl overflow-hidden group">
                  <div className={`absolute inset-0 opacity-50 ${phase.bg}`}></div>
                  <span className={`font-black text-sm relative z-10 ${phase.color}`}>{phase.id}</span>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'}`}>
                  <div className={`bg-slate-900/60 border ${phase.border} p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-slate-900/50 backdrop-blur-sm relative overflow-hidden group`}>
                    <div className={`absolute top-0 right-0 w-48 h-48 ${phase.bg} blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className={`p-4 rounded-2xl ${phase.bg} border ${phase.border}`}>
                        {phase.icon}
                      </div>
                      <span className={`text-xs font-black uppercase tracking-widest ${phase.color} bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur-md`}>
                        {phase.year}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-3 relative z-10">{phase.title}</h3>
                    <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed">{phase.description}</p>
                    
                    <div className="space-y-4 relative z-10 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Key Objectives</p>
                      {phase.tasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className={`${phase.color} mt-0.5 flex-shrink-0 opacity-80`} />
                          <span className="text-sm text-slate-300 font-medium">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
