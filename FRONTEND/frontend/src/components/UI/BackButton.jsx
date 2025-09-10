import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ className = "absolute top-4 left-4" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`${className} inline-flex items-center justify-center h-9 w-9 rounded-md border border-border bg-card text-foreground hover:bg-accent/20 transition-colors shadow-soft`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}


