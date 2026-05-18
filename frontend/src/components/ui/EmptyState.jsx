import { Inbox } from "lucide-react";
import Button from "./Button";

export function EmptyState({
  icon: Icon = Inbox,
  title = "No data yet",
  description = "When content appears, it will show up here.",
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center mb-4">
        <Icon size={22} className="text-muted" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">{description}</p>
      {action && actionLabel && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
