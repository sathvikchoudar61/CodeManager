export function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <div className="min-w-0">
        {label && <span className="text-sm font-medium text-foreground block">{label}</span>}
        {description && <span className="text-xs text-muted block mt-0.5">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`
          relative w-11 h-6 rounded-full border transition-all duration-200 shrink-0
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked
            ? "bg-accent-dim border-[#2ea043]"
            : "bg-elevated border-border group-hover:border-muted"
          }
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground
            transition-transform duration-200 shadow-none
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </label>
  );
}

export default Toggle;
