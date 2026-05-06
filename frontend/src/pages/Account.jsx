import React, { useState } from 'react';
import { User, FileText, Calendar, Building2, BookOpen, BellRing, Mail, Smartphone } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Account = ({ profile, user }) => {
  const [testAlertLoading, setTestAlertLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  const handleTestAlert = async () => {
    setTestAlertLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8001/api/v1/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email, 
          phone: user?.user_metadata?.phone || '+910000000000', 
          message: "This is a test alert from CareerNav AI!" 
        })
      });
      const data = await res.json();
      alert(data.logs.join('\n'));
    } catch (e) {
      alert("Failed to send alert.");
    } finally {
      setTestAlertLoading(false);
    }
  };

  const handleSavePhone = async () => {
    if (!newPhone) return;
    setSavingPhone(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { phone: newPhone }
      });
      if (error) throw error;
      alert("Mobile number updated successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error saving phone number: " + err.message);
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-8 rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-indigo-500/10">
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-500/30">
          {profile?.full_name ? profile.full_name[0].toUpperCase() : '?'}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">{profile?.full_name || 'Student'}</h1>
          <p className="text-slate-400">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            Verified Student
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] space-y-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4">
          <User size={20} className="text-indigo-400" /> Profile Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Building2 size={14}/> College</p>
            <p className="text-slate-200 text-lg">{profile?.college || 'Not Specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><BookOpen size={14}/> Department</p>
            <p className="text-slate-200 text-lg">{profile?.department || 'Not Specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14}/> Date of Birth</p>
            <p className="text-slate-200 text-lg">{profile?.dob || 'Not Specified'}</p>
          </div>
        </div>
      </div>

      {/* NEW ALERT PREFERENCES SECTION */}
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] space-y-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4">
          <BellRing size={20} className="text-pink-400" /> Alert Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg"><Mail size={20}/></div>
              <div>
                <p className="font-bold text-sm text-slate-200">Email Alerts</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg"><Smartphone size={20}/></div>
                <div>
                  <p className="font-bold text-sm text-slate-200">SMS Alerts</p>
                  <p className="text-xs text-slate-500">{user?.user_metadata?.phone || 'Not Configured'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
            
            {/* ADD/EDIT MOBILE NUMBER TAB */}
            {isEditingPhone ? (
              <div className="flex items-center gap-2 mt-2 animate-in fade-in">
                <input type="tel" placeholder="+91..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-pink-500" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                <button onClick={handleSavePhone} className="bg-pink-600 hover:bg-pink-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">{savingPhone ? '...' : 'Save'}</button>
                <button onClick={() => setIsEditingPhone(false)} className="text-slate-400 hover:text-white px-2 py-2 text-sm transition-colors">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditingPhone(true)} className="text-left text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors w-fit mt-1">
                {user?.user_metadata?.phone ? 'Edit Mobile Number' : '+ Add Mobile Number'}
              </button>
            )}
          </div>
        </div>
        <button onClick={handleTestAlert} className="w-full bg-pink-600/20 text-pink-400 border border-pink-500/30 hover:bg-pink-600/30 py-4 rounded-2xl font-bold transition-all shadow-lg mt-2">
          {testAlertLoading ? 'Dispatching Signals...' : 'Send Test Alert Now'}
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] space-y-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4">
          <FileText size={20} className="text-blue-400" /> Uploaded Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FileText size={20}/></div>
              <div>
                <p className="font-bold text-sm text-slate-200">Aadhar Card</p>
                <p className="text-xs text-slate-500">Verified</p>
              </div>
            </div>
            {profile?.aadhar_url && (
              <a href={profile.aadhar_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg">View</a>
            )}
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FileText size={20}/></div>
              <div>
                <p className="font-bold text-sm text-slate-200">PAN Card</p>
                <p className="text-xs text-slate-500">Verified</p>
              </div>
            </div>
            {profile?.pan_url && (
              <a href={profile.pan_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg">View</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
