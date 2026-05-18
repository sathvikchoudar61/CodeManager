const variants = {
  primary:
    "bg-accent-dim border border-[#2ea043] text-foreground hover:bg-accent-hover active:scale-[0.98]",
  secondary:
    "bg-elevated border border-border text-foreground hover:border-muted hover:bg-surface active:scale-[0.98]",
  ghost:
    "bg-transparent border border-transparent text-muted hover:text-foreground hover:bg-elevated active:scale-[0.98]",
  danger:
    "bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  disabled = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} className="shrink-0" />}
      {children}
    </button>
  );
}

export default Button;
