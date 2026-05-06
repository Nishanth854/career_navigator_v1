import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Bell, UserPlus } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // For prototype: any entry works. 
    // In a real app, you'd call your backend /register or /login endpoint here.
    onLoginSuccess(formData.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 text-slate-200">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div 
            key={isRegistering ? 'reg' : 'log'}
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20"
          >
            {isRegistering ? <UserPlus className="text-white w-8 h-8" /> : <Lock className="text-white w-8 h-8" />}
          </motion.div>
          <h2 className="text-2xl font-bold">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-400 text-sm mt-2">
            {isRegistering ? 'Join the Student Valuation Network' : 'Access your career dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode='wait'>
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden"
              >
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Username</label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="student_warrior"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                required
                placeholder="name@college.edu"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {isRegistering ? 'Register Now' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              {isRegistering ? 'Log In' : 'Register Here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;