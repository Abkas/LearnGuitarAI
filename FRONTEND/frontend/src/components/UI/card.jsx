// Simple Card and CardContent demo components
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-lg shadow-md bg-white p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
