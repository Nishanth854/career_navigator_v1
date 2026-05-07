import React, { useState, useEffect } from 'react';
import { Bell, ExternalLink, Calendar, RefreshCw } from 'lucide-react';

const API_BASE = "/api/v1";

const Updates = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('education');

  const fetchNews = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/news?category=${category}`);
      const data = await res.json();
      if (data.status === 'success') {
        setNews(data.articles);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNews(activeCategory);

    // Auto refresh every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      fetchNews(activeCategory);
    }, 300000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Bell size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Live Updates</h1>
            <p className="text-slate-400 mt-1">Latest education schemes, scholarships, and academic policies.</p>
          </div>
        </div>
        <div className="bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-700 flex flex-col items-end">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            Live Feed
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
            Updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <button 
          onClick={() => setActiveCategory('education')} 
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeCategory === 'education' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Education Schemes
        </button>
        <button 
          onClick={() => setActiveCategory('subsidies')} 
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeCategory === 'subsidies' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Subsidy Schemes
        </button>
        <button 
          onClick={() => setActiveCategory('scholarships')} 
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeCategory === 'scholarships' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Scholarships
        </button>
      </div>

      {/* News Grid */}
      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl h-48 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-6 bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article, idx) => (
            <a 
              key={idx} 
              href={article.link} 
              target="_blank" 
              rel="noreferrer"
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-lg">
                    {article.publisher}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(article.published_date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-3">
                  {article.title}
                </h3>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-indigo-400 transition-colors">
                Read Full Article <ExternalLink size={14} />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;
