export function Card({ children, className = "", elevated = false, ...props }) {
  return (
    <div
      className={`${elevated ? "panel-elevated" : "panel"} p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
        {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default Card;
