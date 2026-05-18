import { useState, useEffect } from 'react';
import { Flame, Code2, ArrowRight, Activity, ExternalLink } from 'lucide-react';
import api from '../services/api';

const POTD = () => {
  const [potdData, setPotdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPOTD = async () => {
      try {
        const res = await api.get('/problem-of-the-day');
        if (res.data.success) {
          setPotdData(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch Problem of the Day');
        }
      } catch (err) {
        setError('Error fetching Problem of the Day');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPOTD();
  }, []);

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl pb-10">
      <header className="mb-8 border-b border-[#30363d] pb-6">
        <h2 className="text-2xl font-bold text-[#e6edf3] mb-2 flex items-center gap-2">
          Problem of the Day <Flame className="text-[#da3633]" size={24} />
        </h2>
        <p className="text-[#8b949e] text-sm">Sharpen your skills by solving the daily challenges across your favorite platforms.</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4 text-[#8b949e]">
          <Activity size={24} className="animate-spin text-[#e6edf3]" />
          <p className="text-sm font-medium">Loading today's challenges...</p>
        </div>
      ) : error ? (
        <div className="bg-[#da3633]/10 text-[#da3633] p-4 rounded-md border border-[#da3633]/20 text-sm font-medium">
          {error}
        </div>
      ) : potdData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LeetCode POTD */}
          {potdData.leetcodeUrl && (
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl relative group hover:border-[#8b949e] transition-colors flex flex-col h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center shrink-0">
                  <Code2 size={24} className="text-[#d29922]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#d29922] uppercase tracking-wider bg-[#d29922]/10 px-2 py-0.5 rounded border border-[#d29922]/20">LeetCode</span>
                  <h3 className="text-[#e6edf3] font-bold text-lg mt-2 leading-snug">{potdData.leetcodeTitle || 'LeetCode Challenge'}</h3>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <a 
                  href={potdData.leetcodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#e6edf3] px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Solve on LeetCode <ExternalLink size={16} className="text-[#8b949e]" />
                </a>
              </div>
            </div>
          )}

          {/* GFG POTD */}
          {potdData.geeksForGeeksUrl && (
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl relative group hover:border-[#8b949e] transition-colors flex flex-col h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center shrink-0">
                  <Code2 size={24} className="text-[#238636]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#238636] uppercase tracking-wider bg-[#238636]/10 px-2 py-0.5 rounded border border-[#238636]/20">GeeksforGeeks</span>
                  <h3 className="text-[#e6edf3] font-bold text-lg mt-2 leading-snug">{potdData.geeksForGeeksTitle || 'GFG Challenge'}</h3>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <a 
                  href={potdData.geeksForGeeksUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#e6edf3] px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Solve on GeeksforGeeks <ExternalLink size={16} className="text-[#8b949e]" />
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-10 text-center text-[#8b949e]">
          <Code2 size={36} className="mx-auto mb-3 text-[#30363d]" />
          <p className="text-sm font-medium">No Problem of the Day available right now.</p>
        </div>
      )}
    </div>
  );
};

export default POTD;
