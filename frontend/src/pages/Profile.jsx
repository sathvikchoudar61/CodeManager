import { useState, useEffect } from 'react';
import { User, Mail, Shield, Target, Code, Trophy, Save, Key, Edit2, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  // States for different forms
  const [profileData, setProfileData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    leetcodeUsername: '',
    codeforcesUsername: '',
    codechefUsername: '',
    geeksforgeeksUsername: '',
    interviewbitUsername: '',
    spojUsername: ''
  });
  
  const [targetProblems, setTargetProblems] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  
  // Loading and messages
  const [loading, setLoading] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        gender: user.gender || 'Male',
        age: user.age || '',
        leetcodeUsername: user.leetcodeUsername || '',
        codeforcesUsername: user.codeforcesUsername || '',
        codechefUsername: user.codechefUsername || '',
        geeksforgeeksUsername: user.geeksforgeeksUsername || '',
        interviewbitUsername: user.interviewbitUsername || '',
        spojUsername: user.spojUsername || ''
      });
      setTargetProblems(user.targetProblems || '');
      setNewUsername(user.username || '');
    }
  }, [user]);

  const handleAction = async (actionId, apiCall, successMessage) => {
    setLoading(prev => ({ ...prev, [actionId]: true }));
    setMessages(prev => ({ ...prev, [actionId]: null }));
    try {
      const res = await apiCall();
      if (res.data.success) {
        setMessages(prev => ({ ...prev, [actionId]: { type: 'success', text: successMessage || res.data.message } }));
        // Refresh auth
        const authRes = await api.get('/api/check-auth');
        if (authRes.data.success) setUser(authRes.data.user);
      } else {
        setMessages(prev => ({ ...prev, [actionId]: { type: 'error', text: res.data.message } }));
      }
    } catch (err) {
      setMessages(prev => ({ ...prev, [actionId]: { type: 'error', text: err.response?.data?.message || 'An error occurred.' } }));
    } finally {
      setLoading(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    handleAction('profile', () => api.put('/profile/update-profile', profileData), 'Profile updated successfully');
  };

  const handleUpdateTarget = (e) => {
    e.preventDefault();
    handleAction('target', () => api.put('/profile/update-target', { targetProblems: parseInt(targetProblems) || 0 }), 'Target updated successfully');
  };

  const handleUpdateUsername = (e) => {
    e.preventDefault();
    handleAction('username', () => api.put('/profile/update-username', { username: newUsername }), 'Username updated successfully');
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, 'email': true }));
    setMessages(prev => ({ ...prev, 'email': null }));
    try {
      const res = await api.put('/profile/update-email', { email: newEmail });
      if (res.data.success) {
        setShowEmailVerify(true);
        setMessages(prev => ({ ...prev, 'email': { type: 'success', text: 'Verification code sent to new email.' } }));
      } else {
        setMessages(prev => ({ ...prev, 'email': { type: 'error', text: res.data.message } }));
      }
    } catch (err) {
      setMessages(prev => ({ ...prev, 'email': { type: 'error', text: err.response?.data?.message || 'Error occurred.' } }));
    } finally {
      setLoading(prev => ({ ...prev, 'email': false }));
    }
  };

  const handleVerifyEmailCode = (e) => {
    e.preventDefault();
    // This is public route technically according to prompt, but we can call it directly
    handleAction('emailVerify', () => api.post('/profile/verify-email-update', { code: emailCode }), 'Email changed successfully');
  };

  const Message = ({ id }) => {
    const msg = messages[id];
    if (!msg) return null;
    return (
      <div className={`p-3 rounded-lg text-sm mt-3 ${msg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
        {msg.text}
      </div>
    );
  };

  const SubmitBtn = ({ id, text }) => (
    <button type="submit" disabled={loading[id]} className="bg-accent hover:bg-accent/80 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 mt-4 disabled:opacity-70">
      {loading[id] ? <Loader size={16} className="animate-spin" /> : <Save size={16} />} {text}
    </button>
  );

  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-12">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">Account Settings</h2>
        <p className="text-textDark text-sm">Manage your personal information, security, and platform integrations.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Tabs & Quick Info */}
        <div className="w-full md:w-72 space-y-6 shrink-0">
          
          {/* User Mini Profile */}
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center border-2 border-[#1e1e2d] shadow-lg mb-4">
              <User size={36} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{user?.name || 'Developer'}</h3>
            <p className="text-accent font-mono text-xs mb-3">@{user?.username || 'username'}</p>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${user?.isVerified ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
              <Shield size={10} /> 
              {user?.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="glass-panel p-2 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'general' ? 'bg-accent text-white shadow-md' : 'text-textDark hover:bg-white/5 hover:text-white'}`}
            >
              <User size={18} /> General Details
            </button>
            <button 
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'integrations' ? 'bg-accent text-white shadow-md' : 'text-textDark hover:bg-white/5 hover:text-white'}`}
            >
              <Code size={18} /> Integrations
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-accent text-white shadow-md' : 'text-textDark hover:bg-white/5 hover:text-white'}`}
            >
              <Shield size={18} /> Security Settings
            </button>
            <button 
              onClick={() => setActiveTab('target')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'target' ? 'bg-accent text-white shadow-md' : 'text-textDark hover:bg-white/5 hover:text-white'}`}
            >
              <Target size={18} /> Daily Targets
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="glass-panel p-8 animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-textDark uppercase tracking-wider block mb-2">Full Name</label>
                    <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-accent outline-none transition-colors" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-textDark uppercase tracking-wider block mb-2">Age</label>
                      <input type="number" value={profileData.age} onChange={e => setProfileData({...profileData, age: parseInt(e.target.value)||''})} className="w-full bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-accent outline-none transition-colors" required min="10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-textDark uppercase tracking-wider block mb-2">Gender</label>
                      <select value={profileData.gender} onChange={e => setProfileData({...profileData, gender: e.target.value})} className="w-full bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-accent outline-none transition-colors">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex items-center justify-between">
                  <Message id="profile" />
                  <button type="submit" disabled={loading.profile} className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-70 ml-auto text-sm">
                    {loading.profile ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="glass-panel p-8 animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Connected Platforms</h3>
              <p className="text-sm text-textDark mb-6">Enter your exact usernames for each platform to sync your stats automatically.</p>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { key: 'leetcodeUsername', label: 'LeetCode', color: 'text-yellow-500' },
                    { key: 'codeforcesUsername', label: 'Codeforces', color: 'text-blue-500' },
                    { key: 'codechefUsername', label: 'CodeChef', color: 'text-orange-500' },
                    { key: 'geeksforgeeksUsername', label: 'GeeksforGeeks', color: 'text-green-500' },
                    { key: 'interviewbitUsername', label: 'InterviewBit', color: 'text-indigo-500' },
                    { key: 'spojUsername', label: 'SPOJ', color: 'text-pink-500' }
                  ].map(plat => (
                    <div key={plat.key}>
                      <label className={`text-xs font-bold uppercase tracking-wider block mb-2 ${plat.color}`}>{plat.label}</label>
                      <input type="text" value={profileData[plat.key]} onChange={e => setProfileData({...profileData, [plat.key]: e.target.value})} className="w-full bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-white/30 outline-none transition-colors text-sm" placeholder={`${plat.label} username`} />
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex items-center justify-between">
                  <Message id="profile" />
                  <button type="submit" disabled={loading.profile} className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-70 ml-auto text-sm">
                    {loading.profile ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save Usernames
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              
              <div className="glass-panel p-8">
                <h3 className="text-lg font-bold text-white mb-4">Change Username</h3>
                <form onSubmit={handleUpdateUsername} className="flex gap-3">
                  <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} required className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-accent outline-none text-sm" placeholder="New username" />
                  <button type="submit" disabled={loading.username} className="bg-white/10 hover:bg-white/20 text-white px-5 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm font-medium">
                    {loading.username ? <Loader size={16} className="animate-spin" /> : <Edit2 size={16} />} Update
                  </button>
                </form>
                <div className="mt-2"><Message id="username" /></div>
              </div>

              <div className="glass-panel p-8">
                <h3 className="text-lg font-bold text-white mb-4">Change Email Address</h3>
                <form onSubmit={handleUpdateEmail} className="flex gap-3">
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-accent outline-none text-sm" placeholder="New email address" />
                  <button type="submit" disabled={loading.email} className="bg-white/10 hover:bg-white/20 text-white px-5 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm font-medium">
                    {loading.email ? <Loader size={16} className="animate-spin" /> : <Mail size={16} />} Send OTP
                  </button>
                </form>
                <div className="mt-2"><Message id="email" /></div>
                
                {showEmailVerify && (
                  <form onSubmit={handleVerifyEmailCode} className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                    <input type="text" value={emailCode} onChange={e => setEmailCode(e.target.value)} required className="flex-1 bg-[#0d1117] border border-accent/50 rounded-lg py-2.5 px-4 text-white outline-none text-sm" placeholder="Enter verification code" />
                    <button type="submit" disabled={loading.emailVerify} className="bg-accent hover:bg-accent/80 text-white px-5 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm font-medium">
                      {loading.emailVerify ? <Loader size={16} className="animate-spin" /> : <Shield size={16} />} Verify
                    </button>
                  </form>
                )}
                <div className="mt-2"><Message id="emailVerify" /></div>
              </div>

              <div className="glass-panel p-8">
                <h3 className="text-lg font-bold text-white mb-2">Password Management</h3>
                <p className="text-sm text-textDark mb-4">Request a secure password reset link to your current registered email.</p>
                <button 
                  onClick={async () => {
                    setLoading(prev => ({ ...prev, 'password': true }));
                    setMessages(prev => ({ ...prev, 'password': null }));
                    try {
                      const res = await api.post('/api/forgot-password', { email: user?.email });
                      if (res.data.success) {
                        setMessages(prev => ({ ...prev, 'password': { type: 'success', text: 'Reset link sent!' } }));
                      } else {
                        setMessages(prev => ({ ...prev, 'password': { type: 'error', text: res.data.message } }));
                      }
                    } catch (err) {
                      setMessages(prev => ({ ...prev, 'password': { type: 'error', text: err.response?.data?.message || 'Error sending link.' } }));
                    } finally {
                      setLoading(prev => ({ ...prev, 'password': false }));
                    }
                  }}
                  disabled={loading.password}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm font-medium"
                >
                  {loading.password ? <Loader size={16} className="animate-spin" /> : <Key size={16} />} Send Reset Link
                </button>
                <div className="mt-2"><Message id="password" /></div>
              </div>
            </div>
          )}

          {/* Target Tab */}
          {activeTab === 'target' && (
            <div className="glass-panel p-8 animate-fade-in max-w-2xl">
              <h3 className="text-xl font-bold text-white mb-2 border-b border-white/10 pb-4">Daily & Weekly Targets</h3>
              <p className="text-sm text-textDark mb-6 mt-4">Set your goals to keep yourself accountable.</p>
              
              <form onSubmit={handleUpdateTarget} className="bg-[#0d1117] p-6 rounded-xl border border-white/5">
                <label className="text-xs font-bold text-textDark uppercase tracking-wider block mb-3">Number of Problems</label>
                <div className="flex gap-3">
                  <input type="number" value={targetProblems} onChange={e => setTargetProblems(e.target.value)} className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-accent outline-none font-medium" placeholder="Target e.g. 5" />
                  <button type="submit" disabled={loading.target} className="bg-accent hover:bg-accent/80 text-white px-6 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm font-medium">
                    {loading.target ? <Loader size={16} className="animate-spin" /> : <Target size={16} />} Update Target
                  </button>
                </div>
                <div className="mt-4"><Message id="target" /></div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
