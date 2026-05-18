import { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, ArrowRight, Activity } from 'lucide-react';
import api from '../services/api';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.get('/contest');
        if (res.data.success) {
          setContests(res.data.contests);
        } else {
          setError(res.data.message || 'Failed to fetch contests');
        }
      } catch (err) {
        setError('Error fetching contests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const getPlatformColors = (site) => {
    const s = site?.toLowerCase() || '';
    if (s.includes('leetcode')) return { color: 'text-[#d29922]', bg: 'bg-[#d29922]/10' };
    if (s.includes('codeforces')) return { color: 'text-[#e6edf3]', bg: 'bg-[#e6edf3]/10' };
    if (s.includes('codechef')) return { color: 'text-[#da3633]', bg: 'bg-[#da3633]/10' };
    if (s.includes('geeksforgeeks')) return { color: 'text-[#238636]', bg: 'bg-[#238636]/10' };
    return { color: 'text-[#e6edf3]', bg: 'bg-[#21262d]' };
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    let d;
    if (!isNaN(timeString) && !isNaN(parseFloat(timeString))) {
       let num = parseInt(timeString);
       if (timeString.toString().length === 10) num *= 1000;
       d = new Date(num);
    } else {
       d = new Date(timeString);
    }
    return isNaN(d.getTime()) ? timeString : d.toLocaleString(undefined, { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (durationMs) => {
    if (!durationMs) return 'N/A';
    if (!isNaN(durationMs) && !isNaN(parseFloat(durationMs))) {
       let ms = parseInt(durationMs);
       const days = Math.floor(ms / (1000 * 60 * 60 * 24));
       const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
       const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
       
       let parts = [];
       if (days > 0) parts.push(`${days}d`);
       if (hours > 0) parts.push(`${hours}h`);
       if (minutes > 0) parts.push(`${minutes}m`);
       
       return parts.length > 0 ? parts.join(' ') : `${ms}ms`;
    }
    return durationMs;
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-10">
      <header className="mb-8 border-b border-[#30363d] pb-6">
        <h2 className="text-2xl font-bold text-[#e6edf3] mb-1">Upcoming Contests</h2>
        <p className="text-[#8b949e] text-sm">Never miss an upcoming coding competition.</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-[#8b949e]">
          <Activity size={20} className="animate-spin text-[#e6edf3]" /> Loading contests...
        </div>
      ) : error ? (
        <div className="bg-[#da3633]/10 text-[#da3633] p-4 rounded-xl border border-[#da3633]/20 text-sm">
          {error}
        </div>
      ) : contests.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center text-[#8b949e]">
          No upcoming contests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.map(contest => {
            const { color, bg } = getPlatformColors(contest.site);
            return (
              <div key={contest.id || Math.random()} className="bg-[#161b22] border border-[#30363d] p-5 rounded-xl flex flex-col hover:border-[#8b949e] transition-colors group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-[#30363d] ${bg} ${color}`}>
                  <Trophy size={18} />
                </div>
                <h3 className="text-base font-semibold text-[#e6edf3] mb-1 line-clamp-2" title={contest.name}>{contest.name}</h3>
                <p className={`text-[10px] font-bold mb-4 uppercase tracking-wider ${color}`}>{contest.site}</p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-[#8b949e] text-xs">
                    <Calendar size={14} className="shrink-0" />
                    <span className="line-clamp-1 font-medium" title={formatTime(contest.startTime)}>{formatTime(contest.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8b949e] text-xs">
                    <Clock size={14} className="shrink-0" />
                    <span className="font-medium">Duration: {formatDuration(contest.duration)}</span>
                  </div>
                </div>
                
                <a 
                  href={contest.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-5 w-full py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-[#30363d]"
                >
                  View Contest <ArrowRight size={14} className="text-[#8b949e]" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Contests;
