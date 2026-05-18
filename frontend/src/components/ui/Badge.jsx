const variants = {
  default: "bg-elevated text-muted border-border",
  accent: "bg-accent-subtle text-accent border-accent/30",
  success: "bg-accent-subtle text-accent border-accent/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
};

export function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold
        uppercase tracking-wide border
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
