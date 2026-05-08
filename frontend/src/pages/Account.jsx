import React, { useState } from 'react';
import { User, FileText, Calendar, Building2, BookOpen, BellRing, Mail, Smartphone, DollarSign, Briefcase, MapPin, Heart, Activity, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Account = ({ profile, user }) => {
  const [activeTab, setActiveTab] = useState('personal'); // personal, academic, financial
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Personal Info State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [dob, setDob] = useState(profile?.dob || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [maritalStatus, setMaritalStatus] = useState(profile?.marital_status || '');
  const [address, setAddress] = useState(profile?.address || '');

  // Academic Info State
  const [college, setCollege] = useState(profile?.college || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.year_of_study || '');

  // Financial & Socio State
  const [annualIncome, setAnnualIncome] = useState(profile?.annual_income || '');
  const [parentalProfession, setParentalProfession] = useState(profile?.parental_profession || '');
  const [livingState, setLivingState] = useState(profile?.living_state || '');
  const [disabilityStatus, setDisabilityStatus] = useState(profile?.disability_status || '');

  // Alert/Phone States
  const [testAlertLoading, setTestAlertLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  const handleTestAlert = async () => {
    setTestAlertLoading(true);
    try {
      const res = await fetch('/api/v1/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email, 
          phone: user?.user_metadata?.phone || '+910000000000', 
          message: "This is a test alert from StudentMate AI!" 
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

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        dob,
        gender,
        marital_status: maritalStatus,
        address,
        college,
        department,
        year_of_study: yearOfStudy,
        annual_income: annualIncome,
        parental_profession: parentalProfession,
        living_state: livingState,
        disability_status: disabilityStatus
      }).eq('id', user.id);
      
      if (error) throw error;
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-8 rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-500/30 relative z-10">
          {profile?.full_name ? profile.full_name[0].toUpperCase() : '?'}
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white">{profile?.full_name || 'Student'}</h1>
          <p className="text-slate-400">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            Verified Student
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN TABS AREA (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB NAVIGATION */}
          <div className="flex flex-wrap gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('personal')} 
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <User size={16} /> Personal
            </button>
            <button 
              onClick={() => setActiveTab('academic')} 
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'academic' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <BookOpen size={16} /> Academic
            </button>
            <button 
              onClick={() => setActiveTab('financial')} 
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'financial' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <DollarSign size={16} /> Financial
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem]">
            {message && (
              <div className="mb-6 p-4 bg-indigo-500/20 border border-indigo-500/50 rounded-xl text-indigo-300 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={18} /> {message}
              </div>
            )}

            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4">
                  <User size={20} className="text-indigo-400" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Marital Status</label>
                    <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC RECORDS */}
            {activeTab === 'academic' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4">
                  <BookOpen size={20} className="text-blue-400" /> Academic Records
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">College/University</label>
                    <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department/Major</label>
                      <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year of Study</label>
                      <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FINANCIAL & SOCIO */}
            {activeTab === 'financial' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4">
                  <DollarSign size={20} className="text-emerald-400" /> Financial & Socio Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Family Income</label>
                    <select value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      <option value="">Select Income Bracket</option>
                      <option value="Below 1 Lakh">Below 1 Lakh</option>
                      <option value="1 Lakh - 3 Lakhs">1 Lakh - 3 Lakhs</option>
                      <option value="3 Lakhs - 5 Lakhs">3 Lakhs - 5 Lakhs</option>
                      <option value="5 Lakhs - 8 Lakhs">5 Lakhs - 8 Lakhs</option>
                      <option value="Above 8 Lakhs">Above 8 Lakhs</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parental Profession</label>
                    <input type="text" placeholder="e.g., Farmer, Business, Salaried..." value={parentalProfession} onChange={(e) => setParentalProfession(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Living State</label>
                    <input type="text" placeholder="e.g., Tamil Nadu" value={livingState} onChange={(e) => setLivingState(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disability Status</label>
                    <select value={disabilityStatus} onChange={(e) => setDisabilityStatus(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      <option value="">Select Status</option>
                      <option value="None">None</option>
                      <option value="Visually Impaired">Visually Impaired</option>
                      <option value="Hearing Impaired">Hearing Impaired</option>
                      <option value="Orthopedically Handicapped">Orthopedically Handicapped</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button 
                onClick={handleSaveProfile} 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Saving...' : 'Save Profile Updates'}
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR AREA (1/3 width on desktop) */}
        <div className="space-y-6">
          
          {/* UPLOADED DOCUMENTS SECTION */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem]">
            <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
              <FileText size={20} className="text-blue-400" /> Identity Proofs
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              These documents are used by the system to verify the accuracy of your profile information.
            </p>
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FileText size={16}/></div>
                  <div>
                    <p className="font-bold text-sm text-slate-200">Aadhar</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Verified</p>
                  </div>
                </div>
                {profile?.aadhar_url && (
                  <a href={profile.aadhar_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">View</a>
                )}
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FileText size={16}/></div>
                  <div>
                    <p className="font-bold text-sm text-slate-200">PAN</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Verified</p>
                  </div>
                </div>
                {profile?.pan_url && (
                  <a href={profile.pan_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">View</a>
                )}
              </div>
            </div>
          </div>

          {/* ALERT PREFERENCES */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem]">
            <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
              <BellRing size={20} className="text-pink-400" /> Notifications
            </h3>
            
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-200 text-sm font-bold">
                    <Mail size={14} className="text-pink-400"/> Email
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-200 text-sm font-bold">
                    <Smartphone size={14} className="text-pink-400"/> SMS
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">{user?.user_metadata?.phone || 'Not Configured'}</p>
                
                {isEditingPhone ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <input type="tel" placeholder="+91..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-pink-500" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={handleSavePhone} className="flex-1 bg-pink-600 hover:bg-pink-500 text-white py-1.5 rounded-lg text-xs font-bold transition-colors">{savingPhone ? '...' : 'Save'}</button>
                      <button onClick={() => setIsEditingPhone(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsEditingPhone(true)} className="text-left text-[10px] font-bold text-pink-400 hover:text-pink-300 transition-colors mt-1">
                    {user?.user_metadata?.phone ? 'Edit Mobile' : '+ Add Mobile'}
                  </button>
                )}
              </div>
            </div>

            <button onClick={handleTestAlert} className="w-full mt-4 bg-pink-600/20 text-pink-400 border border-pink-500/30 hover:bg-pink-600/30 py-3 rounded-xl text-sm font-bold transition-all shadow-lg">
              {testAlertLoading ? 'Dispatching...' : 'Send Test Alert'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Account;
