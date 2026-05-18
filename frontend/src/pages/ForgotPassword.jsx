import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/api/forgot-password', { email });
      if (res.data.success) {
        setMessage(res.data.message || 'Password reset link sent to your email.');
      } else {
        setError(res.data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center p-6 font-inter">
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <Link to="/login" className="inline-flex items-center text-textDark hover:text-white mb-6 transition-colors text-sm font-medium">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
        
        <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Forgot Password</h2>
        <p className="text-textDark mb-8 relative z-10">Enter your email and we'll send you a link to reset your password.</p>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-textDark mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textDark">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-textDark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
