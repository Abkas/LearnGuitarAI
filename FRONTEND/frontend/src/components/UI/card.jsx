// Simple Card and CardContent demo components
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-lg shadow-soft bg-card border border-border ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`p-4 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-foreground ${className}`} {...props}>
      {children}
    </h3>
  );
}
