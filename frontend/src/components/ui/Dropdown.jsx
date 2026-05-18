import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function Dropdown({ trigger, items, align = "right", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={`
            absolute top-full mt-2 min-w-[180px] py-1 z-50
            bg-elevated border border-border rounded-lg shadow-none
            animate-scale-in origin-top
            ${align === "right" ? "right-0" : "left-0"}
          `}
        >
          {items.map((item, i) =>
            item.divider ? (
              <hr key={i} className="my-1 border-border" />
            ) : (
              <button
                key={item.label}
                role="menuitem"
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left
                  transition-colors duration-200 disabled:opacity-50
                  ${item.danger
                    ? "text-danger hover:bg-danger/10"
                    : "text-foreground hover:bg-surface"
                  }
                `}
              >
                {item.icon && <item.icon size={16} className="text-muted shrink-0" />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function DropdownButton({ label, children, className = "" }) {
  return (
    <Dropdown
      className={className}
      trigger={
        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-elevated border border-border rounded-lg text-foreground hover:border-muted transition-colors">
          {label}
          <ChevronDown size={14} className="text-muted" />
        </span>
      }
      items={children}
    />
  );
}

export default Dropdown;
