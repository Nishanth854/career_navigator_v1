import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldCheck, UserCheck, XCircle, Search, FileText, AlertTriangle } from 'lucide-react';

// Hardcode your admin email here
export const ADMIN_EMAIL = 'vnishanth854@gmail.com';

const Admin = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading user database...</div>
      ) : fetchError ? (
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Database Error</h2>
          <p className="text-rose-400 max-w-lg mx-auto">{fetchError}</p>
        </div>
      ) : (
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
                          <FileText size={14} /> View Aadhar
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">No Document</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleVerification(u.id, u.is_verified)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
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
      )}
    </div>
  );
};

export default Admin;
