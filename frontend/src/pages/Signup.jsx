import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Lock, Mail, User, Code, Calendar, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 'Male',
    leetcodeUsername: '',
    codeforcesUsername: '',
    codechefUsername: '',
    geeksforgeeksUsername: '',
    interviewbitUsername: '',
    spojUsername: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signup(formData);
      navigate('/verify-email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas py-12 px-4 sm:px-6 lg:px-8">
      <div className="panel w-full max-w-4xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center mb-4">
            <Terminal size={24} className="text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-wider">Create Account</h2>
          <p className="text-muted mt-2">Join CodeManager today to track all your stats</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Basics */}
          <div>
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <User size={18} className="text-accent" /> Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Username *</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full bg-canvas border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" placeholder="johndoe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-canvas border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-canvas border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-canvas border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required min="10" max="100" className="w-full bg-canvas border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" placeholder="21" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none">
                  <option value="Male" className="bg-canvas text-foreground">Male</option>
                  <option value="Female" className="bg-canvas text-foreground">Female</option>
                  <option value="Other" className="bg-canvas text-foreground">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Platform Details */}
          <div>
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
              <Code size={18} className="text-accent" /> Platform Usernames <span className="text-sm font-normal text-muted/60">(Optional)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'leetcodeUsername', label: 'LeetCode' },
                { name: 'codeforcesUsername', label: 'Codeforces' },
                { name: 'codechefUsername', label: 'CodeChef' },
                { name: 'geeksforgeeksUsername', label: 'GeeksforGeeks' },
                { name: 'interviewbitUsername', label: 'InterviewBit' },
                { name: 'spojUsername', label: 'SPOJ' },
              ].map((platform) => (
                <div key={platform.name}>
                  <label className="block text-sm font-medium text-muted mb-1.5">{platform.label} Username</label>
                  <input type="text" name={platform.name} value={formData[platform.name]} onChange={handleChange} className="w-full bg-canvas border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" placeholder={`Enter ${platform.label} username`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto md:px-12 bg-accent-dim hover:bg-accent-hover border border-[#2ea043] text-foreground py-3 rounded-lg font-semibold transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mx-auto"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
