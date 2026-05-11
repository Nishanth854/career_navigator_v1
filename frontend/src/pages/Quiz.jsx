import React, { useState, useEffect, useRef } from 'react';
import { Brain, Trophy, Timer, ArrowRight, CheckCircle2, XCircle, Award, Zap, TrendingUp, Star } from 'lucide-react';
import { supabase } from '../supabaseClient';

const TIERS = [
  { name: 'Bronze', min: 0, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { name: 'Silver', min: 501, color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/30' },
  { name: 'Gold', min: 1501, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { name: 'Platinum', min: 3001, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  { name: 'Diamond', min: 6001, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
];

const Quiz = ({ user, profile }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check if daily quiz already taken
    const lastTaken = profile?.last_quiz_date;
    const today = new Date().toISOString().split('T')[0];
    if (lastTaken === today) {
      setAlreadyTaken(true);
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0 && selectedAns === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedAns === null) {
      handleAnswer(-1); // Timeout
    }

    return () => clearInterval(timerRef.current);
  }, [quizStarted, showResult, timeLeft, selectedAns]);

  const fetchQuestions = async () => {
    try {
      const resp = await fetch(`/api/v1/quiz/questions?dept=${profile?.department || 'Computer Science'}`);
      const data = await resp.json();
      console.log("Quiz Data Received:", data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setQuestions(data);
      } else if (data && data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        console.error("Malformed quiz data received:", data);
        setQuestions([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setLoading(false);
      setQuestions([]);
    }
  };

  const handleAnswer = (idx) => {
    clearInterval(timerRef.current);
    setSelectedAns(idx);
    const correctIdx = questions[currentIdx].correct;
    const correct = idx === correctIdx;
    setIsCorrect(correct);
    
    if (correct) {
      // Points based on time remaining
      setScore(prev => prev + 100 + (timeLeft * 2));
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedAns(null);
        setIsCorrect(null);
        setTimeLeft(30);
      } else {
        handleFinish();
      }
    }, 1500);
  };

  const handleFinish = async () => {
    setShowResult(true);
    const newTotalScore = (profile?.quiz_score || 0) + score;
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate new tier
    const resp = await fetch('/api/v1/quiz/calculate-tier', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_score: newTotalScore })
    });
    const { tier } = await resp.json();

    // Update Supabase
    await supabase.from('profiles').update({
      quiz_score: newTotalScore,
      quiz_tier: tier,
      last_quiz_date: today
    }).eq('id', user.id);
  };

  const getCurrentTier = (score) => {
    return [...TIERS].reverse().find(t => score >= t.min) || TIERS[0];
  };

  const currentTier = getCurrentTier(profile?.quiz_score || 0);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-indigo-400 font-bold animate-pulse">GENERATING TECHNICAL CHALLENGE...</div>;

  if (alreadyTaken && !showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
          <Timer size={40} className="text-indigo-400" />
        </div>
        <h2 className="text-4xl font-black text-white">Daily Limit Reached</h2>
        <p className="text-slate-400 text-lg">You've already completed your technical assessment for today. Come back tomorrow to boost your rank!</p>
        <div className={`inline-flex flex-col items-center p-6 rounded-3xl border ${currentTier.border} ${currentTier.bg}`}>
            <Award size={32} className={currentTier.color} />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-2">Current Standing</p>
            <p className={`text-2xl font-black ${currentTier.color}`}>{currentTier.name} Tier</p>
            <p className="text-sm font-bold text-white mt-1">{profile?.quiz_score || 0} XP</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter border border-indigo-500/20">
            <Brain size={14} /> Daily Knowledge Assessment
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">Prove Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Technical Prowess.</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">Complete daily challenges to earn XP, climb the leaderboard, and unlock premium ranking tiers. Top performers get priority matching with elite startups.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <Zap className="text-yellow-400 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-2">Speed Bonus</h3>
            <p className="text-slate-400 text-sm">Faster answers earn more points. You have 30 seconds per question.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <TrendingUp className="text-indigo-400 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-2">Daily Streak</h3>
            <p className="text-slate-400 text-sm">Maintain a 5-day streak to unlock a 1.5x score multiplier.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <Award className="text-purple-400 mb-4" size={28} />
            <h3 className="text-xl font-bold text-white mb-2">Global Rank</h3>
            <p className="text-slate-400 text-sm">Your ranking tier is visible to recruiters on your profile.</p>
          </div>
        </div>

        <div className="flex justify-center">
            <button 
                onClick={() => setQuizStarted(true)}
                className="group relative px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-3 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                START ASSESSMENT <ArrowRight size={24} />
            </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const finalTier = getCurrentTier((profile?.quiz_score || 0) + score);
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
            <Trophy size={48} className="text-yellow-500" />
          </div>
          <h2 className="text-5xl font-black text-white">Assessment Complete!</h2>
          <p className="text-slate-400 text-xl">Brilliant performance, {profile?.full_name?.split(' ')[0]}!</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Score Earned</p>
            <p className="text-4xl font-black text-indigo-400">+{score}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">New XP Total</p>
            <p className="text-4xl font-black text-white">{(profile?.quiz_score || 0) + score}</p>
          </div>
        </div>

        <div className={`p-10 rounded-[2.5rem] border-2 ${finalTier.border} ${finalTier.bg} relative overflow-hidden group`}>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
            <Award size={64} className={`${finalTier.color} mx-auto mb-4 animate-bounce`} />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Updated Ranking Status</p>
            <h3 className={`text-5xl font-black ${finalTier.color} mb-4`}>{finalTier.name} Tier</h3>
            <div className="flex items-center justify-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= TIERS.findIndex(t => t.name === finalTier.name) + 1 ? "currentColor" : "none"} className={finalTier.color} />)}
            </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="text-slate-400 font-bold hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  if (quizStarted && (!questions || questions.length === 0)) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
          <XCircle size={40} className="text-rose-400" />
        </div>
        <h2 className="text-3xl font-black text-white">Connection Error</h2>
        <p className="text-slate-400">Unable to reach the technical engine. Please ensure the backend server is running on port 8001 and try again.</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</p>
          <div className="h-2 w-48 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${timeLeft < 10 ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-white/5 border-white/10 text-white'}`}>
            <Timer size={20} />
            <span className="text-2xl font-black tabular-nums">{timeLeft}s</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-3xl font-black text-white leading-tight mb-10 relative z-10">{currentQuestion.question}</h2>

            <div className="grid gap-4 relative z-10">
            {currentQuestion.options.map((opt, i) => {
                let style = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
                if (selectedAns !== null) {
                if (i === currentQuestion.correct) style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                else if (i === selectedAns) style = "bg-rose-500/20 border-rose-500/50 text-rose-400";
                else style = "bg-white/2 border-white/5 text-slate-600 opacity-50";
                }

                return (
                <button 
                    key={i}
                    disabled={selectedAns !== null}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-6 rounded-2xl border text-lg font-bold transition-all flex items-center justify-between group ${style}`}
                >
                    <span>{opt}</span>
                    {selectedAns !== null && i === currentQuestion.correct && <CheckCircle2 size={24} />}
                    {selectedAns !== null && i === selectedAns && i !== currentQuestion.correct && <XCircle size={24} />}
                </button>
                );
            })}
            </div>
        </div>
      )}

      <div className="flex justify-center text-slate-500 text-xs font-bold uppercase tracking-widest italic">
        Select the most accurate technical solution
      </div>
    </div>
  );
};

export default Quiz;
