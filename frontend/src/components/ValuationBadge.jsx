import React from 'react';
import { Award, Star, BookOpen, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ValuationBadge = ({ profile }) => {
  if (!profile) return null;

  // Destructure with fallbacks to avoid errors if OCR missed something
  const { gpa = "N/A", degree = "Undergrad", skills = [], score = 50, level = "Standard" } = profile;

  // Determine color based on score
  const getScoreColor = (s) => {
    if (s >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const colorClass = getScoreColor(score);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Main Score Badge */}
      <div className={`md:col-span-1 p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${colorClass}`}>
        <div className="relative mb-3">
          <Award className="w-16 h-16 opacity-20" />
          <span className="absolute inset-0 flex items-center justify-center text-4xl font-black">
            {score}
          </span>
        </div>
        <h3 className="text-xl font-bold uppercase tracking-widest">{level}</h3>
        <p className="text-sm opacity-80 mt-1 font-medium">Market Readiness Score</p>
      </div>

      {/* Academic & Skill Summary */}
      <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Education</p>
            <p className="text-sm font-bold text-gray-800">{degree}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <Target className="w-6 h-6 text-rose-500" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">GPA</p>
            <p className="text-sm font-bold text-gray-800">{gpa || "4.0"}</p>
          </div>
        </div>

        <div className="col-span-2">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Identified Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md flex items-center gap-1"
                >
                  <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No technical skills detected yet</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ValuationBadge;