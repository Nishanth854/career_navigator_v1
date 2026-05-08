import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, Target, Bell, Info, User, MessageCircle, Menu, X, ShieldCheck, UserCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Chatbot from './Chatbot';
import { ADMIN_EMAIL } from '../pages/Admin';
import { logoBase64 } from '../logoData';

const Layout = ({ user, profile }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const displayName = profile?.full_name || user.email.split('@')[0];
  const chatRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setShowChat(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#05050C] text-slate-200 flex flex-col font-['Outfit'] relative overflow-hidden">
      
      {/* Global Ambient Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Floating Pill Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-full h-16 flex items-center justify-between px-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
              <img src={logoBase64} alt="StudentMate Logo" className="w-10 h-10 rounded-xl object-contain border border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all bg-white p-1" />
              <span className="text-xl font-black text-white hidden sm:block tracking-tight">StudentMate</span>
          </div>
          <div className="hidden md:flex items-center gap-2 ml-4">
            <NavLink to="/" className={({isActive}) => `px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><LayoutDashboard size={16}/> Home</NavLink>
            <NavLink to="/evaluate" className={({isActive}) => `px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Target size={16}/> Evaluate</NavLink>
            <NavLink to="/updates" className={({isActive}) => `px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Bell size={16}/> Updates</NavLink>
            <NavLink to="/about" className={({isActive}) => `px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Info size={16}/> About</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* AI CHATBOT TOGGLE */}
          <div className="relative" ref={chatRef}>
            <button onClick={() => setShowChat(!showChat)} className={`p-2 sm:p-2.5 rounded-full transition-all flex items-center justify-center border ${showChat ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-black/40 border-white/10 hover:bg-white/10 text-slate-300'}`}>
              <MessageCircle size={18} />
            </button>
            {showChat && <Chatbot profile={profile} onClose={() => setShowChat(false)} />}
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 bg-black/40 border border-white/10 p-1.5 rounded-full pr-2 sm:pr-4 hover:bg-white/10 transition-all">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">{displayName[0].toUpperCase()}</div>
              <span className="text-xs font-bold text-slate-200 hidden sm:flex items-center gap-1">
                {displayName}
                {profile?.is_verified && <UserCheck size={14} className="text-blue-400" />}
              </span>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-4 w-56 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-1 z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{user.email}</p>
                </div>
                <NavLink to="/account" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 text-slate-300 p-3 text-sm font-medium hover:bg-white/10 hover:text-white rounded-xl transition-colors"><User size={16}/> Account Settings</NavLink>
                {user.email === ADMIN_EMAIL && (
                  <NavLink to="/admin" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 text-indigo-300 p-3 text-sm font-bold hover:bg-indigo-500/10 hover:text-indigo-200 rounded-xl transition-colors"><ShieldCheck size={16}/> Admin Panel</NavLink>
                )}
                <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 text-rose-400 p-3 text-sm font-medium hover:bg-rose-500/10 rounded-xl transition-colors mt-1"><LogOut size={16}/> Disconnect Session</button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 rounded-full transition-all flex items-center justify-center border bg-black/40 border-white/10 text-slate-300 hover:bg-white/10">
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {showMobileMenu && (
        <div className="md:hidden fixed top-24 left-1/2 -translate-x-1/2 w-[95%] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-40 flex flex-col gap-2">
            <NavLink to="/" onClick={() => setShowMobileMenu(false)} className={({isActive}) => `p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><LayoutDashboard size={18}/> Home</NavLink>
            <NavLink to="/evaluate" onClick={() => setShowMobileMenu(false)} className={({isActive}) => `p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Target size={18}/> Evaluate</NavLink>
            <NavLink to="/updates" onClick={() => setShowMobileMenu(false)} className={({isActive}) => `p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Bell size={18}/> Updates</NavLink>
            <NavLink to="/about" onClick={() => setShowMobileMenu(false)} className={({isActive}) => `p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Info size={18}/> About</NavLink>
        </div>
      )}
      
      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 pt-32 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
