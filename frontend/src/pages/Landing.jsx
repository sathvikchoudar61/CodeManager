import { Link } from 'react-router-dom';
import { Code, Zap, Trophy, Shield, Terminal, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <article className="panel p-6 flex flex-col transition-all duration-200 hover:border-muted/60 hover:-translate-y-0.5">
    <div className="w-11 h-11 bg-accent-subtle border border-accent/25 rounded-lg flex items-center justify-center text-accent mb-4">
      <Icon size={22} />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted leading-relaxed">{description}</p>
  </article>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <nav className="sticky top-0 z-20 border-b border-border bg-canvas/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center">
              <Terminal size={18} className="text-accent" />
            </div>
            <span className="text-base font-bold text-foreground">
              Code<span className="text-accent">Manager</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 md:py-24">
        <section className="text-center max-w-3xl mx-auto animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-accent text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Developer-first dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-5 leading-tight">
            One workspace for all your{' '}
            <span className="text-accent">coding profiles</span>
          </h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            Track LeetCode, Codeforces, CodeChef, and more in a clean, GitHub-inspired interface built for productivity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Start for free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                View demo
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          <FeatureCard
            icon={Trophy}
            title="Unified stats"
            description="Aggregate problems solved, ratings, and streaks from six platforms automatically."
          />
          <FeatureCard
            icon={Code}
            title="Integrated compiler"
            description="Practice in Monaco with Java, Python, C++, and JavaScript — no context switching."
          />
          <FeatureCard
            icon={Shield}
            title="Secure by default"
            description="JWT authentication and clean session handling for your competitive programming identity."
          />
        </section>

        <section className="mt-20 panel p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-accent/20">
          <div className="w-12 h-12 rounded-lg bg-accent-subtle border border-accent/30 flex items-center justify-center shrink-0">
            <Zap size={22} className="text-accent" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold text-foreground mb-1">Built for focus</h2>
            <p className="text-sm text-muted">
              No neon gradients or glass effects — just a calm dark UI that stays out of your way.
            </p>
          </div>
          <Link to="/signup" className="shrink-0">
            <Button variant="secondary">Create account</Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} CodeManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
