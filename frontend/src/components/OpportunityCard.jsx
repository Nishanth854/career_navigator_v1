import React from 'react';
import { Briefcase, GraduationCap, Trophy, Building2, ChevronRight, Zap } from 'lucide-react';

const OpportunityCard = ({ data }) => {
  // Helper to choose the right icon and color based on the opportunity type
  const getCategoryStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'internship':
        return { icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' };
      case 'scholarship':
        return { icon: <GraduationCap className="w-5 h-5" />, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200' };
      case 'hackathon':
        return { icon: <Trophy className="w-5 h-5" />, color: 'bg-orange-100 text-orange-700', border: 'border-orange-200' };
      default:
        return { icon: <Zap className="w-5 h-5" />, color: 'bg-green-100 text-green-700', border: 'border-green-200' };
    }
  };

  const styles = getCategoryStyles(data.type);

  return (
    <div className={`group relative p-5 bg-white rounded-xl border ${styles.border} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
        <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        {Math.round((1 - data.match_score) * 100)}% Match
      </div>

      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${styles.color}`}>
          {styles.icon}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${styles.color}`}>
              {data.type}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Building2 className="w-3 h-3" />
              {data.provider}
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {data.title}
          </h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            <span className="font-semibold text-gray-700">Required:</span> {data.skills}
          </p>

          <button className="mt-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 group/btn">
            View Details 
            <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;