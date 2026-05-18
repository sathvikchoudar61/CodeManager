import { useState, useEffect, useRef } from "react";
import { Search, Command, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const routes = [
  { label: "Dashboard", path: "/dashboard", hint: "Overview" },
  { label: "Problem of the Day", path: "/potd", hint: "Daily challenge" },
  { label: "Compiler", path: "/compiler", hint: "Run code" },
  { label: "Contests", path: "/contests", hint: "Upcoming events" },
  { label: "Profile", path: "/profile", hint: "Your account" },
  { label: "Settings", path: "/settings", hint: "Preferences" },
];

export function CommandSearch({ className = "" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = routes.filter(
    (r) =>
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.hint.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path) => {
    navigate(path);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!open || !filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(filtered[activeIndex].path);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search or jump to..."
          className="w-full pl-9 pr-20 py-2 text-sm bg-canvas border border-border rounded-lg text-foreground placeholder:text-muted/70 hover:border-muted/60 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all duration-200"
          aria-label="Command search"
          aria-expanded={open}
          role="combobox"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5">
          <kbd className="kbd"><Command size={10} /></kbd>
          <kbd className="kbd">K</kbd>
        </div>
      </div>

      {open && query && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 py-1 bg-elevated border border-border rounded-xl z-50 animate-scale-in overflow-hidden"
        >
          {filtered.map((item, i) => (
            <li key={item.path} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseDown={() => go(item.path)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors
                  ${i === activeIndex ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground"}
                `}
              >
                <span>
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted ml-2 text-xs">{item.hint}</span>
                </span>
                <ArrowRight size={14} className="text-muted shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommandSearch;
