export function Input({
  label,
  hint,
  error,
  icon: Icon,
  className = "",
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-canvas border border-border rounded-lg text-sm text-foreground
            placeholder:text-muted/70 transition-all duration-200
            hover:border-muted/60 focus:border-accent/50 focus:ring-1 focus:ring-accent/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? "pl-10 pr-3 py-2.5" : "px-3 py-2.5"}
            ${error ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20" : ""}
          `}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export default Input;
