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

// --- AUTH PAGE COMPONENT ---
// ... (Auth logic unchanged, omitting to prevent accidental removal) ...
const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email: formData.email, password: formData.password,
          options: { data: { username: formData.username } }
        });
        if (error) throw error;
        alert("Account created successfully!");
        window.location.href = '/';
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
        if (error) throw error;
        window.location.href = '/';
      }
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050C] p-6 relative overflow-hidden font-['Outfit']">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.15)] relative z-10">
        <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tight">{isRegistering ? 'Join StudentMate' : 'Welcome Back'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && <input type="text" required placeholder="Username" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, username: e.target.value})} />}
          <input type="email" required placeholder="Email" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" required placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-indigo-500/25 mt-2">{loading ? 'Processing...' : isRegistering ? 'Register' : 'Access Engine'}</button>
        </form>
        <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-6 text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">
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
          <Route path="updates" element={<Updates />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;