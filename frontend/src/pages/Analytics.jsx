import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [platformData, setPlatformData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platRes, profRes] = await Promise.all([
          api.get('/platforms'),
          api.get('/profile')
        ]);
        
        if (platRes.data.success) {
          setPlatformData(platRes.data.data);
        }
        if (profRes.data.success) {
          setProfileData(profRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-accent">
        <Activity className="animate-spin mr-3" size={24} /> Loading Analytics...
      </div>
    );
  }

  // Prepare Rating History for Codeforces and Codechef
  const cfHistory = platformData?.codeforces?.ratingHistory || [];
  const ccHistory = platformData?.codechef?.ratingHistory || [];
  
  // Format history for charts (taking last 10-15 contests to not overcrowd)
  const formatHistory = (history) => {
    return history.slice(-15).map((item, idx) => ({
      name: `C${idx + 1}`,
      rating: item.newRating || item.rating || 0
    }));
  };

  const cfChartData = formatHistory(cfHistory);
  const ccChartData = formatHistory(ccHistory);

  // Difficulty Distribution (aggregate across platforms that provide it, e.g., LeetCode, GFG, InterviewBit)
  const leetcode = platformData?.leetcode || {};
  const gfg = platformData?.geeksforgeeks || {};
  const ib = platformData?.interviewbit || {};

  const easySolved = (leetcode.easySolved || 0) + (gfg.easy || 0) + (ib.easy || 0);
  const mediumSolved = (leetcode.mediumSolved || 0) + (gfg.medium || 0) + (ib.medium || 0);
  const hardSolved = (leetcode.hardSolved || 0) + (gfg.hard || 0) + (ib.hard || 0);
  
  const totalEasy = 800; // Mock totals or derived if API provided
  const totalMedium = 1600;
  const totalHard = 700;

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
        <p className="text-textDark">Detailed breakdown of your problem-solving journey and ratings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rating History Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Codeforces Rating History
            </h3>
            {cfChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cfChartData}>
                    <defs>
                      <linearGradient id="colorCf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-textDark h-[300px] flex items-center justify-center">No rating history available for Codeforces.</p>
            )}
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              CodeChef Rating History
            </h3>
            {ccChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ccChartData}>
                    <defs>
                      <linearGradient id="colorCc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="rating" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-textDark h-[300px] flex items-center justify-center">No rating history available for CodeChef.</p>
            )}
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-white mb-6">Aggregate Problem Stats</h3>
            
            <div className="mb-8">
              <p className="text-sm text-textDark mb-1">Total Problems Solved (All Platforms)</p>
              <p className="text-4xl font-bold text-white">{platformData?.problemsSolved || 0}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-textDark mb-1">Your Target</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-accent">{profileData?.targetProblems || 0}</p>
                <p className="text-sm text-textDark mb-1">problems / timeframe</p>
              </div>
            </div>
            
            <div className="w-full bg-white/5 h-2 rounded-full mb-6">
              <div 
                className="bg-accent h-full rounded-full" 
                style={{ width: `${Math.min(((platformData?.problemsSolved || 0) / (profileData?.targetProblems || 1)) * 100, 100)}%` }} 
              />
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-white mb-6">Difficulty Distribution</h3>
            <div className="space-y-6">
              {[
                { label: 'Easy', count: easySolved, total: totalEasy, color: 'bg-green-500' },
                { label: 'Medium', count: mediumSolved, total: totalMedium, color: 'bg-yellow-500' },
                { label: 'Hard', count: hardSolved, total: totalHard, color: 'bg-red-500' },
              ].map(diff => (
                <div key={diff.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-medium">{diff.label}</span>
                    <span className="text-textDark">{diff.count}</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${diff.color}`} style={{ width: `${Math.min((diff.count / Math.max(1, diff.total)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-textDark mt-4 text-center">Aggregated from LeetCode, GFG, and InterviewBit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
