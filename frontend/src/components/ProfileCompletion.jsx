import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { User, Calendar, Building2, BookOpen, Upload, FileText, ArrowRight } from 'lucide-react';

const ProfileCompletion = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.username || '',
    dob: '',
    college: '',
    department: ''
  });
  
  const [files, setFiles] = useState({ aadhar: null, pan: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file, path) => {
    if (!file) return null;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`${user.id}/${path}-${Date.now()}`, file);
      
    if (error) throw error;
    
    const { data: publicData } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);
      
    return publicData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Upload files
      const aadharUrl = await handleUpload(files.aadhar, 'aadhar');
      const panUrl = await handleUpload(files.pan, 'pan');

      // 2. Upsert profile
      const { error: dbError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: formData.full_name,
        dob: formData.dob,
        college: formData.college,
        department: formData.department,
        aadhar_url: aadharUrl,
        pan_url: panUrl,
        updated_at: new Date()
      });

      if (dbError) throw dbError;

      // 3. Trigger callback
      if (onComplete) onComplete();

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 text-slate-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Aesthetic background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2">Complete Your Profile</h2>
          <p className="text-slate-400 text-sm mb-8">We need a few details and documents to personalize your CareerNav experience.</p>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><User size={14}/> Full Name</label>
                  <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Calendar size={14}/> Date of Birth</label>
                  <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Building2 size={14}/> College Name</label>
                  <input required type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen size={14}/> Department</label>
                  <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText size={14}/> Aadhar Card</label>
                  <div className="relative">
                    <input required type="file" accept="image/*,.pdf" onChange={e => setFiles({...files, aadhar: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex items-center justify-center gap-2 bg-slate-800 border border-dashed border-slate-600 rounded-xl p-4 text-sm text-slate-300 group-hover:border-indigo-500 transition-colors">
                      <Upload size={18} className="text-indigo-400"/>
                      <span className="truncate max-w-[150px]">{files.aadhar ? files.aadhar.name : 'Upload File'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText size={14}/> PAN Card</label>
                  <div className="relative">
                    <input required type="file" accept="image/*,.pdf" onChange={e => setFiles({...files, pan: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex items-center justify-center gap-2 bg-slate-800 border border-dashed border-slate-600 rounded-xl p-4 text-sm text-slate-300 group-hover:border-indigo-500 transition-colors">
                      <Upload size={18} className="text-indigo-400"/>
                      <span className="truncate max-w-[150px]">{files.pan ? files.pan.name : 'Upload File'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button disabled={loading} className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50">
              {loading ? 'Saving Profile...' : 'Complete Profile'} <ArrowRight size={18}/>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCompletion;
