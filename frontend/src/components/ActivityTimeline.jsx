import { GitCommit, Trophy, Code2, RefreshCw, Zap } from "lucide-react";
import Badge from "./ui/Badge";

const iconMap = {
  solve: Code2,
  contest: Trophy,
  sync: RefreshCw,
  streak: Zap,
  commit: GitCommit,
};

const typeBadge = {
  solve: "accent",
  contest: "warning",
  sync: "default",
  streak: "accent",
  commit: "default",
};

export function ActivityTimeline({ items = [], className = "" }) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted py-4 text-center">No recent activity</p>
    );
  }

  return (
    <ul className={`space-y-0 ${className}`}>
      {items.map((item, i) => {
        const Icon = iconMap[item.type] || GitCommit;
        const isLast = i === items.length - 1;
        return (
          <li key={item.id ?? i} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                aria-hidden
              />
            )}
            <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0 z-10">
              <Icon size={14} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-sm text-foreground font-medium">{item.title}</p>
                {item.type && (
                  <Badge variant={typeBadge[item.type] || "default"}>
                    {item.type}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-muted line-clamp-2">{item.description}</p>
              )}
              <time className="text-[11px] text-muted mt-1 block">{item.time}</time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ActivityTimeline;
