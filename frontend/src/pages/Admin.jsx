import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldCheck, UserCheck, XCircle, Search, FileText, AlertTriangle, Eye, MessageSquare, Star, Users } from 'lucide-react';

// Hardcode your admin email here
export const ADMIN_EMAIL = 'nk316787956@gmail.com';

const Admin = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    if (activeTab === 'students') {
      fetchUsers();
    } else {
      fetchFeedbacks();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      // Removed .order('created_at') just in case the column doesn't exist!
    
    if (error) {
      console.error("Error fetching users:", error);
      setFetchError(error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching feedback:", error);
      setFetchError(error.message);
    } else {
      setFeedbacks(data || []);
    }
    setLoading(false);
  };

  const toggleVerification = async (userId, currentStatus) => {
    try {
      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !currentStatus } : u));
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', userId);
        
      if (error) throw error;
    } catch (err) {
      alert(`Failed to update. Supabase Error: ${err.message}. Please make sure 'is_verified' column exists in Supabase!`);
      console.error(err);
      // Revert on failure
      fetchUsers();
    }
  };

  // Security check
  if (user?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <XCircle className="w-24 h-24 text-rose-500 mb-4 opacity-50" />
        <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
        <p className="text-slate-400">You do not have permission to view this panel.</p>
        <p className="text-sm text-slate-500 mt-4">Current authorized admin: {ADMIN_EMAIL}</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.college?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="text-indigo-500 w-10 h-10" />
            Admin Command Center
          </h1>
          <p className="text-slate-400 mt-2">Verify student credentials and manage platform access.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6 w-fit border border-slate-800">
        <button onClick={() => setActiveTab('students')} className={`py-2 px-6 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          <Users size={16}/> Students
        </button>
        <button onClick={() => setActiveTab('feedback')} className={`py-2 px-6 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'feedback' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          <MessageSquare size={16}/> Feedback
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading user database...</div>
      ) : fetchError ? (
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Database Error</h2>
          <p className="text-rose-400 max-w-lg mx-auto">{fetchError}</p>
        </div>
      ) : activeTab === 'students' ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-sm font-bold text-slate-300">Student Name</th>
                  <th className="p-4 text-sm font-bold text-slate-300">College / Dept</th>
                  <th className="p-4 text-sm font-bold text-slate-300">Documents</th>
                  <th className="p-4 text-sm font-bold text-slate-300 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                          {u.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {u.full_name || 'Unknown'}
                            {u.is_verified && <UserCheck className="w-4 h-4 text-blue-400" />}
                          </p>
                          <p className="text-xs text-slate-500">Joined: {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-300">{u.college || '-'}</p>
                      <p className="text-xs text-slate-500">{u.department || '-'}</p>
                    </td>
                    <td className="p-4">
                      {u.aadhar_url ? (
                        <a href={u.aadhar_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg w-fit">
                          <FileText size={14} /> Aadhar
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">No Document</span>
                      )}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-2 rounded-xl text-sm font-bold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button 
                        onClick={() => toggleVerification(u.id, u.is_verified)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all w-28 text-center ${
                          u.is_verified 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40' 
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {u.is_verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map(f => (
            <div key={f.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-colors shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                    {f.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{f.name || 'Anonymous'}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{f.department || 'Unknown Dept'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700 fill-slate-800'} />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">"{f.feedback_text}"</p>
              <div className="text-[10px] text-slate-600 font-medium border-t border-slate-800/50 pt-4">
                {new Date(f.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium text-lg">No feedback received yet.</p>
              <p className="text-sm mt-2">When students submit feedback, it will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW FULL DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <UserCheck className="text-indigo-500" /> Student Profile Details
              </h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Email Address</p>
                    <p className="text-sm font-bold text-slate-200">{selectedUser.email || 'N/A (Not Synced)'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Mobile Number</p>
                    <p className="text-sm font-bold text-slate-200">{selectedUser.phone || 'N/A (Not Synced)'}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Full Name</p>
                  <p className="text-sm font-bold text-slate-200">{selectedUser.full_name || 'N/A'}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Date of Birth</p>
                  <p className="text-sm font-bold text-slate-200">{selectedUser.dob || 'N/A'}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 col-span-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">College & Department</p>
                  <p className="text-sm font-bold text-slate-200">{selectedUser.college || 'N/A'} - {selectedUser.department || 'N/A'}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">GPA</p>
                  <p className="text-sm font-bold text-slate-200">{selectedUser.gpa || 'N/A'}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Valuation Score</p>
                  <p className="text-sm font-bold text-slate-200">{selectedUser.valuation_score || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Uploaded Documents</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedUser.aadhar_url ? (
                    <a href={selectedUser.aadhar_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-2.5 rounded-xl hover:bg-indigo-500/20 transition-colors text-xs font-bold justify-center">
                      <FileText size={14} /> View Aadhar
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-500 px-3 py-2.5 rounded-xl text-xs font-bold justify-center">
                      <FileText size={14} /> No Aadhar
                    </div>
                  )}
                  {selectedUser.pan_url ? (
                    <a href={selectedUser.pan_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-2.5 rounded-xl hover:bg-blue-500/20 transition-colors text-xs font-bold justify-center">
                      <FileText size={14} /> View PAN
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-500 px-3 py-2.5 rounded-xl text-xs font-bold justify-center">
                      <FileText size={14} /> No PAN
                    </div>
                  )}
                  {selectedUser.community_url ? (
                    <a href={selectedUser.community_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-colors text-xs font-bold justify-center">
                      <FileText size={14} /> Community Cert
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-500 px-3 py-2.5 rounded-xl text-xs font-bold justify-center">
                      <FileText size={14} /> No Community Cert
                    </div>
                  )}
                  {selectedUser.income_url ? (
                    <a href={selectedUser.income_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-2.5 rounded-xl hover:bg-yellow-500/20 transition-colors text-xs font-bold justify-center">
                      <FileText size={14} /> Income Cert
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-500 px-3 py-2.5 rounded-xl text-xs font-bold justify-center">
                      <FileText size={14} /> No Income Cert
                    </div>
                  )}
                  {selectedUser.transcript_url ? (
                    <a href={selectedUser.transcript_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 px-3 py-2.5 rounded-xl hover:bg-pink-500/20 transition-colors text-xs font-bold justify-center col-span-2">
                      <FileText size={14} /> Academic Transcript
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 text-slate-500 px-3 py-2.5 rounded-xl text-xs font-bold justify-center col-span-2">
                      <FileText size={14} /> No Academic Transcript
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors text-sm"
              >
                Close Details
              </button>
              <button 
                onClick={() => {
                  toggleVerification(selectedUser.id, selectedUser.is_verified);
                  setSelectedUser({...selectedUser, is_verified: !selectedUser.is_verified});
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
                  selectedUser.is_verified 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'
                }`}
              >
                {selectedUser.is_verified ? 'Revoke Verification' : 'Verify Student Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
