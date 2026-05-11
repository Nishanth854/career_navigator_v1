import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 
import ProfileCompletion from './components/ProfileCompletion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Evaluate from './pages/Evaluate';
import Startup from './pages/Startup';
import Updates from './pages/Updates';
import About from './pages/About';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';


// --- AUTH PAGE COMPONENT ---
// ... (Auth logic unchanged, omitting to prevent accidental removal) ...
const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email, 
          password: formData.password,
          options: { data: { username: formData.username } }
        });
        
        if (error) {
          if (error.message.toLowerCase().includes('rate limit')) {
            throw new Error("Email rate limit exceeded. Please wait a while or go to Supabase Dashboard > Authentication > Provider Settings and increase the 'Max Emails per Hour'.");
          }
          throw error;
        }
        
        // If email confirmation is required, data.session will be null
        if (data.user && !data.session) {
          setVerificationSent(true);
        } else {
          window.location.href = '/';
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: formData.email, 
          password: formData.password 
        });
        if (error) throw error;
        window.location.href = '/';
      }
    } catch (err) { 
      setAuthError(err.message);
      if (err.message.toLowerCase().includes('confirm your email') || err.message.toLowerCase().includes('email not confirmed')) {
        setVerificationSent(true);
      }
    } finally { 
      setLoading(false); 
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) setAuthError(error.message);
  };

  const resendVerification = async () => {
    setLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setAuthError("Resend limit reached. Please wait or check your Supabase Auth settings.");
      } else {
        setAuthError(error.message);
      }
    }
    else alert("Verification email resent!");
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05050C] p-6 relative overflow-y-auto font-['Outfit']">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.15)] relative z-10 text-center">
          <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Verify Your Email</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            We've sent a verification link to <span className="text-indigo-400 font-bold">{formData.email}</span>. 
            Please check your inbox (and spam folder) to activate your account.
          </p>
          <button 
            onClick={resendVerification} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-indigo-500/25 mb-4"
          >
            {loading ? 'Resending...' : 'Resend Verification Email'}
          </button>
          <button 
            onClick={() => { setVerificationSent(false); setIsRegistering(false); setAuthError(null); }} 
            className="text-indigo-400 text-sm font-medium hover:text-indigo-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050C] p-6 relative overflow-y-auto font-['Outfit']">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.15)] relative z-10 my-8">
        <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tight">{isRegistering ? 'Join StudentMate' : 'Welcome Back'}</h2>
        
        {authError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="flex-1">{authError}</span>
          </div>
        )}

        <button 
          onClick={signInWithGoogle}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google Account
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#05050C] px-4 text-slate-500 font-bold tracking-widest">Or use email</span></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && <input type="text" required placeholder="Username" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, username: e.target.value})} />}
          <input type="email" required placeholder="Email" value={formData.email} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" required placeholder="Password" value={formData.password} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-indigo-500/25 mt-2">{loading ? 'Processing...' : isRegistering ? 'Register' : 'Access Engine'}</button>
        </form>
        <button onClick={() => { setIsRegistering(!isRegistering); setAuthError(null); }} className="w-full mt-6 text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">
          {isRegistering ? 'Already have an account? Login' : "New student? Register"}
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async (userId) => {
    setLoadingProfile(true);
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoadingProfile(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoadingProfile(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoadingProfile(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) return <AuthPage />;
  if (loadingProfile) return <div className="min-h-screen bg-[#05050C] flex items-center justify-center text-indigo-400 font-bold tracking-widest text-sm uppercase animate-pulse">Initializing Engine...</div>;
  if (!profile || !profile.full_name || !profile.college || !profile.aadhar_url) {
    return <ProfileCompletion user={user} onComplete={() => fetchProfile(user.id)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} profile={profile} />}>
          <Route index element={<Home />} />
          <Route path="evaluate" element={<Evaluate user={user} profile={profile} />} />
          <Route path="startup" element={<Startup />} />
          <Route path="account" element={<Account user={user} profile={profile} />} />
          <Route path="admin" element={<Admin user={user} />} />
          <Route path="quiz" element={<Quiz user={user} profile={profile} />} />

          <Route path="updates" element={<Updates />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;