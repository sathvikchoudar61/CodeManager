import { useState } from 'react';
import { Lock, Shield, Moon } from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { Toggle } from '../components/ui/Toggle';
import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/CodeBlock';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    contests: true,
    potd: true,
    updates: false,
  });

  const appearanceTab = (
    <div className="space-y-4">
      <div className="panel p-4 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium text-foreground">Theme</h4>
          <p className="text-xs text-muted mt-0.5">Dark mode is optimized for long coding sessions</p>
        </div>
        <div className="flex bg-canvas border border-border rounded-lg p-1">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-elevated text-foreground text-sm font-medium"
          >
            <Moon size={14} className="text-accent" /> Dark
          </button>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-md text-muted text-sm cursor-not-allowed opacity-50"
          >
            Light (soon)
          </button>
        </div>
      </div>
      <CodeBlock
        title="config.json"
        language="json"
        code={`{
  "theme": "dark",
  "accent": "green",
  "fontFamily": "Inter"
}`}
      />
    </div>
  );

  const notificationsTab = (
    <div className="space-y-3">
      <div className="panel p-4">
        <Toggle
          label="Contest reminders"
          description="Notify before upcoming contests start"
          checked={notifications.contests}
          onChange={(v) => setNotifications((n) => ({ ...n, contests: v }))}
        />
      </div>
      <div className="panel p-4">
        <Toggle
          label="Daily streak"
          description="Reminders for Problem of the Day"
          checked={notifications.potd}
          onChange={(v) => setNotifications((n) => ({ ...n, potd: v }))}
        />
      </div>
      <div className="panel p-4">
        <Toggle
          label="System updates"
          description="Platform updates and new features"
          checked={notifications.updates}
          onChange={(v) => setNotifications((n) => ({ ...n, updates: v }))}
        />
      </div>
    </div>
  );

  const securityTab = (
    <div className="space-y-4">
      <button
        type="button"
        className="w-full panel p-4 flex items-center gap-4 text-left hover:border-muted/60 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center">
          <Lock size={18} className="text-muted" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground">Change password</h4>
          <p className="text-xs text-muted">Update your account password</p>
        </div>
      </button>
      <div className="panel p-4 border-accent/20 bg-accent-subtle/30">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground">Two-factor authentication</h4>
            <p className="text-xs text-muted mt-1">Add an extra layer of security to your account.</p>
            <Button variant="secondary" size="sm" className="mt-3">
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your app preferences and configurations.</p>
      </header>

      <Tabs
        tabs={[
          { id: 'appearance', label: 'Appearance', content: appearanceTab },
          { id: 'notifications', label: 'Notifications', content: notificationsTab },
          { id: 'security', label: 'Security', content: securityTab },
        ]}
      />
    </div>
  );
};

export default Settings;
