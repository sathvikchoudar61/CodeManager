import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Key } from 'lucide-react';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState(urlToken ? 'verifying' : 'idle'); // idle, verifying, success, error
  const [message, setMessage] = useState('');
  const [inputToken, setInputToken] = useState('');

  const verifyToken = async (tokenToVerify) => {
    setStatus('verifying');
    try {
      const res = await api.post('/api/verify-email', { verificationToken: tokenToVerify });
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(res.data.message || 'Verification failed.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'An error occurred during verification.');
    }
  };

  useEffect(() => {
    if (urlToken) {
      verifyToken(urlToken);
    }
  }, [urlToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputToken.trim()) {
      verifyToken(inputToken.trim());
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center p-6 font-inter">
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16" />
        
        <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Email Verification</h2>
        
        {status === 'idle' && (
          <div className="relative z-10">
            <p className="text-textDark mb-6">Please check your email and enter the verification token below to verify your account.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textDark">
                  <Key size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-textDark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="Paste your token here..."
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/80 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20"
              >
                Verify Email
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-4 mb-8 mt-4 relative z-10">
          {status === 'verifying' && (
            <>
              <Loader className="animate-spin text-accent" size={48} />
              <p className="text-textDark">Verifying your email address...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="text-green-500" size={48} />
              <p className="text-white text-lg">{message}</p>
              <p className="text-textDark text-sm">Redirecting to login...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="text-red-500" size={48} />
              <p className="text-red-400 text-lg">{message}</p>
              {!urlToken && (
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-accent hover:underline text-sm mt-2"
                >
                  Try another token
                </button>
              )}
            </>
          )}
        </div>

        <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
          <Link to="/login" className="text-sm text-textDark hover:text-white transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
