import { useState, useEffect } from 'react';
import { Target, Flame, Code, Activity, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import ActivityTimeline from '../components/ActivityTimeline';
import { useToast } from '../contexts/ToastContext';

const StatCard = ({ title, value, icon: Icon, accent }) => (
  <Card className="panel-interactive">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-foreground tabular-nums">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg bg-elevated border border-border ${accent}`}>
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

const platformColors = {
  leetcode: 'bg-warning/20 text-warning border-warning/30',
  codeforces: 'bg-elevated text-foreground border-border',
  codechef: 'bg-danger/15 text-danger border-danger/30',
  geeksforgeeks: 'bg-accent-subtle text-accent border-accent/30',
  interviewbit: 'bg-muted/20 text-muted border-border',
  spoj: 'bg-warning/10 text-warning border-warning/20',
};

const PlatformCard = ({ slug, name, data, logo }) => {
  const solved = data?.problemsSolved || 0;
  const color = platformColors[slug] || platformColors.codeforces;

  const renderStatsGrid = () => {
    if (!data) return <div className="mt-4 pt-4 border-t border-border text-xs text-muted">No data available</div>;

    switch (slug) {
      case 'leetcode':
        return (
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4 pt-4 border-t border-border text-xs">
            <div><span className="text-muted block mb-0.5">Easy</span> <span className="text-accent font-semibold">{data.easySolved || 0}</span></div>
            <div><span className="text-muted block mb-0.5">Medium</span> <span className="text-warning font-semibold">{data.mediumSolved || 0}</span></div>
            <div><span className="text-muted block mb-0.5">Hard</span> <span className="text-danger font-semibold">{data.hardSolved || 0}</span></div>
            <div><span className="text-muted block mb-0.5">Rating</span> <span className="text-foreground font-semibold">{Math.round(data.contestRating || 0)}</span></div>
          </div>
        );
      case 'codeforces':
        return (
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border text-xs">
            <div><span className="text-muted block mb-0.5">Rating</span> <span className="text-foreground font-semibold">{data.currentRating || 0}</span></div>
            <div><span className="text-muted block mb-0.5">Max</span> <span className="text-foreground font-semibold">{data.maxRating || 0}</span></div>
          </div>
        );
      default:
        return (
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted">
            {data.currentRating != null && <span>Rating: {data.currentRating}</span>}
          </div>
        );
    }
  };

  return (
    <Link to={`/platform/${slug}`} className="block panel-interactive p-5 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${color}`}>
          {logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">{name}</h4>
            <ArrowRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          <p className="text-xl text-foreground font-bold mt-1 tabular-nums">
            {solved} <span className="text-muted font-normal text-xs ml-1">solved</span>
          </p>
        </div>
      </div>
      {renderStatsGrid()}
    </Link>
  );
};

const buildActivity = (platformData, user) => {
  const items = [];
  if (platformData?.leetcode?.problemsSolved) {
    items.push({
      id: 'lc',
      type: 'solve',
      title: 'LeetCode stats synced',
      description: `${platformData.leetcode.problemsSolved} problems tracked`,
      time: 'Recently',
    });
  }
  items.push({
    id: 'welcome',
    type: 'commit',
    title: `Welcome back${user?.name ? `, ${user.name}` : ''}`,
    description: 'Your dashboard is ready',
    time: 'Just now',
  });
  return items;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/platforms');
        if (res.data.success) setPlatformData(res.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.post('/platforms/refresh');
      if (res.data.success) {
        const platformRes = await api.get('/platforms');
        if (platformRes.data.success) setPlatformData(platformRes.data.data);
        toast('Platform data synced successfully', 'success');
      }
    } catch (err) {
      console.error('Error refreshing platforms:', err);
      toast('Failed to sync platform data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
        <SkeletonCard />
      </div>
    );
  }

  const totalSolved = platformData?.problemsSolved || 0;
  const activity = buildActivity(platformData, user);

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-muted text-sm mt-1">Your coding activity overview</p>
        </div>
        <Button variant="secondary" icon={refreshing ? Activity : RefreshCw} onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Syncing...' : 'Sync data'}
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total solved" value={totalSolved} icon={Target} accent="text-accent" />
        <StatCard title="Platforms" value={6} icon={Code} accent="text-muted" />
        <StatCard title="Streak" value={platformData?.geeksforgeeks?.POTDStreak || 0} icon={Flame} accent="text-warning" />
        <StatCard title="Rating" value={Math.round(platformData?.leetcode?.contestRating || 0)} icon={Activity} accent="text-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Platform statistics"
              description="Track progress across competitive programming sites"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlatformCard slug="leetcode" name="LeetCode" data={platformData?.leetcode} logo={<Code size={18} />} />
              <PlatformCard slug="codeforces" name="Codeforces" data={platformData?.codeforces} logo={<Target size={18} />} />
              <PlatformCard slug="codechef" name="CodeChef" data={platformData?.codechef} logo={<Flame size={18} />} />
              <PlatformCard slug="geeksforgeeks" name="GeeksforGeeks" data={platformData?.geeksforgeeks} logo={<Code size={18} />} />
              <PlatformCard slug="interviewbit" name="InterviewBit" data={platformData?.interviewbit} logo={<Code size={18} />} />
              <PlatformCard slug="spoj" name="SPOJ" data={platformData?.spoj} logo={<Code size={18} />} />
            </div>
          </Card>

          <Card elevated className="prose-dev">
            <CardHeader title="Quick start" description="Markdown-style documentation blocks" />
            <h3>Getting started</h3>
            <p>
              Connect your competitive programming handles in <Link to="/profile" className="text-accent hover:underline">Profile</Link> then sync data to populate statistics.
            </p>
            <blockquote>Consistency beats intensity — solve one problem a day.</blockquote>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Recent activity" description="Your latest workspace events" />
          <ActivityTimeline items={activity} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
