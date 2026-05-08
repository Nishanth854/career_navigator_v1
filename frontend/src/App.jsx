import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 
import ProfileCompletion from './components/ProfileCompletion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Evaluate from './pages/Evaluate';
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
  const [formData, setFormData] = useState({ email: '', password: '', username: '', mobile: '', otp: '' });
  const [expectedOtp, setExpectedOtp] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering && !showOtp) {
      if (!formData.mobile) return alert("Please enter a mobile number.");
      setLoading(true);
      
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedOtp(generatedOtp);
      
      try {
        await fetch('/api/v1/send-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: formData.mobile, 
            email: formData.email,
            message: `Your StudentMate registration OTP is: ${generatedOtp}. Do not share this code with anyone.` 
          })
        });
        setShowOtp(true);
      } catch (err) {
        alert("Failed to send OTP: " + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      if (isRegistering && showOtp) {
        if (formData.otp !== expectedOtp) throw new Error("Invalid OTP. Please check your SMS/Email and try again.");
        
        const { error } = await supabase.auth.signUp({
          email: formData.email, password: formData.password,
          options: { data: { username: formData.username, phone: formData.mobile } }
        });
        if (error) throw error;
        alert("Mobile verified and account created successfully!");
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
          {!showOtp ? (
            <>
              {isRegistering && <input type="text" required placeholder="Username" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, username: e.target.value})} />}
              {isRegistering && <input type="tel" required placeholder="Mobile Number (+91)" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />}
              <input type="email" required placeholder="Email" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" required placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-indigo-500/25 mt-2">{loading ? 'Processing...' : isRegistering ? 'Send OTP' : 'Access Engine'}</button>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Verification Required</p>
                <p className="text-xs text-slate-300">A secure 6-digit OTP has been sent to your mobile number and email. Please enter it below.</p>
              </div>
              <input type="text" required placeholder="Enter 6-digit OTP" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors text-center font-black tracking-[0.5em] text-2xl" onChange={(e) => setFormData({...formData, otp: e.target.value})} maxLength={6} />
              <button className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-green-500/25 mt-2">{loading ? 'Verifying...' : 'Verify & Register'}</button>
              
              <div className="mt-4 p-3 border border-dashed border-slate-700 rounded-xl text-center bg-black/20">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Testing Fallback</p>
                <p className="text-xs text-slate-400">If you didn't receive the OTP due to telecom blocklists, use code: <span className="font-bold text-white">{expectedOtp}</span></p>
              </div>

              <button type="button" onClick={() => setShowOtp(false)} className="w-full text-slate-500 text-sm mt-2 hover:text-white transition-colors">Cancel</button>
            </div>
          )}
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