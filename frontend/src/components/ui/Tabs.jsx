import { useState } from "react";

export function Tabs({ tabs, defaultTab, onChange, className = "" }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  const handleSelect = (id) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex gap-1 p-1 bg-canvas border border-border rounded-lg w-fit flex-wrap"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${active === tab.id
                ? "bg-elevated text-foreground"
                : "text-muted hover:text-foreground hover:bg-elevated/50"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}

export default Tabs;
