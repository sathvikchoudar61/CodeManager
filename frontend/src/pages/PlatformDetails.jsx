import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Target, Trophy, Flame, Code, ArrowLeft, Activity, Star, Award, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PlatformDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const platformNames = {
    'leetcode': 'LeetCode',
    'codeforces': 'Codeforces',
    'codechef': 'CodeChef',
    'geeksforgeeks': 'GeeksforGeeks',
    'interviewbit': 'InterviewBit',
    'spoj': 'SPOJ'
  };

  const getPlatformColor = (s) => {
    switch (s) {
      case 'leetcode': return 'text-[#d29922]';
      case 'codeforces': return 'text-[#e6edf3]';
      case 'codechef': return 'text-[#da3633]';
      case 'geeksforgeeks': return 'text-[#238636]';
      default: return 'text-[#e6edf3]';
    }
  };

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const res = await api.get(`/platforms/${slug}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError('Failed to load platform data.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching platform details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlatformData();
  }, [slug]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.post(`/platforms/refresh/${slug}`);
      if (res.data.success) {
        const platformRes = await api.get(`/platforms/${slug}`);
        if (platformRes.data.success) {
          setData(platformRes.data.data);
        }
      }
    } catch (err) {
      console.error(`Error refreshing ${slug}:`, err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-[#8b949e]">
        <Activity className="animate-spin mr-3 text-[#e6edf3]" size={24} /> Loading {platformNames[slug]} Data...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-[#da3633] mb-4 text-sm font-medium">{error || 'No data found for this platform.'}</p>
        <Link to="/dashboard" className="text-[#e6edf3] hover:underline flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Helper to format chart data
  const formatHistory = (history, platform) => {
    if (!history) return [];
    return history.slice(-15).map((item, idx) => ({
      name: item.contestName?.substring(0, 10) || `C${idx + 1}`,
      rating: item.newRating || item.rating || 0
    }));
  };

  const chartData = formatHistory(data.ratingHistory, slug);
  const color = getPlatformColor(slug);

  const StatBox = ({ label, value, icon: Icon }) => (
    <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-xl flex items-center gap-4 hover:border-[#8b949e] transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center ${color}`}>
        {Icon && <Icon size={18} />}
      </div>
      <div>
        <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-[#e6edf3]">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-10 max-w-6xl">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-[#8b949e] hover:text-[#e6edf3] transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <header className="mb-8 flex items-center justify-between border-b border-[#30363d] pb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-[#21262d] flex items-center justify-center border border-[#30363d] ${color}`}>
            {slug === 'leetcode' || slug === 'geeksforgeeks' ? <Code size={24} /> : 
             slug === 'codechef' ? <Flame size={24} /> : 
             <Target size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#e6edf3] mb-1">{platformNames[slug] || slug} Overview</h2>
            <p className="text-[#8b949e] text-sm">Detailed statistics and history for your profile.</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 border border-[#30363d] disabled:opacity-70"
        >
          <Activity size={16} className={refreshing ? 'animate-spin text-[#e6edf3]' : 'text-[#8b949e]'} />
          {refreshing ? 'Refreshing...' : 'Sync Platform'}
        </button>
      </header>

      {/* Dynamic Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox label="Problems Solved" value={data.problemsSolved || 0} icon={Target} />
        
        {slug === 'leetcode' && (
          <>
            <StatBox label="Global Rank" value={data.globalRanking ? `#${data.globalRanking}` : 'N/A'} icon={Trophy} />
            <StatBox label="Contest Rating" value={Math.round(data.contestRating || 0)} icon={TrendingUp} />
            <StatBox label="Acceptance Rate" value={`${data.acceptanceRate || 0}%`} icon={Activity} />
          </>
        )}
        
        {slug === 'codeforces' && (
          <>
            <StatBox label="Current Rating" value={data.currentRating || 0} icon={TrendingUp} />
            <StatBox label="Max Rating" value={data.maxRating || 0} icon={Star} />
            <StatBox label="Rank" value={data.rank || 'N/A'} icon={Trophy} />
          </>
        )}
        
        {slug === 'codechef' && (
          <>
            <StatBox label="Current Rating" value={data.currentRating || 0} icon={TrendingUp} />
            <StatBox label="Global Rank" value={data.globalRank || 'N/A'} icon={Trophy} />
            <StatBox label="Stars" value={data.stars || 'N/A'} icon={Star} />
          </>
        )}
        
        {slug === 'geeksforgeeks' && (
          <>
            <StatBox label="Coding Score" value={data.codingScore || 0} icon={Award} />
            <StatBox label="POTD Streak" value={`${data.POTDStreak || 0} days`} icon={Flame} />
            <StatBox label="Inst. Rank" value={data.instituteRank || 'N/A'} icon={Trophy} />
          </>
        )}
        
        {slug === 'interviewbit' && (
          <>
            <StatBox label="Score" value={data.score || 0} icon={Award} />
            <StatBox label="Rank" value={data.rank || 'N/A'} icon={Trophy} />
            <StatBox label="Streak" value={`${data.streak || 0} days`} icon={Flame} />
          </>
        )}
        
        {slug === 'spoj' && (
          <>
            <StatBox label="Points" value={data.points || 0} icon={Award} />
            <StatBox label="Rank" value={data.rank || 'N/A'} icon={Trophy} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Difficulty Breakdown (if available) */}
        {(data.easy !== undefined || data.easySolved !== undefined) && (
          <div className="lg:col-span-1 bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#e6edf3] mb-6 border-b border-[#30363d] pb-3">Difficulty Breakdown</h3>
            <div className="space-y-5">
              {[
                { label: 'Basic/School', count: (data.school || 0) + (data.basic || 0), color: 'bg-[#8b949e]' },
                { label: 'Easy', count: data.easy || data.easySolved || 0, color: 'bg-[#238636]' },
                { label: 'Medium', count: data.medium || data.mediumSolved || 0, color: 'bg-[#d29922]' },
                { label: 'Hard', count: data.hard || data.hardSolved || 0, color: 'bg-[#da3633]' },
              ].filter(d => d.count > 0).map(diff => (
                <div key={diff.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#e6edf3] font-medium">{diff.label}</span>
                    <span className="text-[#8b949e] font-bold">{diff.count}</span>
                  </div>
                  <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
                    <div className={`h-full ${diff.color}`} style={{ width: `100%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            {data.badges && data.badges.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#30363d]">
                <h4 className="text-xs font-semibold text-[#8b949e] mb-3 uppercase tracking-wider">Badges Earned</h4>
                <div className="flex flex-wrap gap-2">
                  {data.badges.map((badge, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#21262d] border border-[#30363d] rounded-md text-xs text-[#e6edf3] font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rating History Chart (if available) */}
        <div className={(data.easy !== undefined || data.easySolved !== undefined) ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 h-full min-h-[400px]">
            <h3 className="text-lg font-semibold text-[#e6edf3] mb-6 flex items-center gap-2 border-b border-[#30363d] pb-3">
              <Activity className={color} size={18} />
              Contest Rating History
            </h3>
            
            {chartData.length > 0 ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={slug === 'codechef' ? '#da3633' : '#e6edf3'} stopOpacity={0.5}/>
                        <stop offset="95%" stopColor={slug === 'codechef' ? '#da3633' : '#e6edf3'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis stroke="#8b949e" axisLine={false} tickLine={false} domain={['auto', 'auto']} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#21262d', borderColor: '#30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '12px' }}
                      itemStyle={{ color: '#e6edf3' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rating" 
                      stroke={slug === 'codechef' ? '#da3633' : '#e6edf3'} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorRating)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-[#8b949e] border border-dashed border-[#30363d] rounded-xl bg-[#0d1117]">
                <Activity size={24} className="mb-2 text-[#30363d]" />
                <p className="text-sm">No contest rating history available for this platform.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDetails;
