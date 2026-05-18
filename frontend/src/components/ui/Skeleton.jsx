export function Skeleton({ className = "", variant = "rect" }) {
  const base = "skeleton-shimmer rounded-lg";
  const shapes = {
    rect: "",
    circle: "rounded-full",
    text: "h-4 rounded-md",
  };
  return <div className={`${base} ${shapes[variant]} ${className}`} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="panel p-5 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" variant="text" />
        <Skeleton className="h-8 w-8" variant="circle" />
      </div>
      <Skeleton className="h-8 w-16" variant="text" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="panel overflow-hidden">
      <div className="p-4 border-b border-border flex gap-4">
        <Skeleton className="h-4 flex-1" variant="text" />
        <Skeleton className="h-4 flex-1" variant="text" />
        <Skeleton className="h-4 w-20" variant="text" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-border last:border-0 flex gap-4 items-center">
          <Skeleton className="h-8 w-8" variant="circle" />
          <Skeleton className="h-4 flex-1" variant="text" />
          <Skeleton className="h-4 w-24" variant="text" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
