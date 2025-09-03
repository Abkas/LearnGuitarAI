
import { Home, Music, Play, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analyzer", href: "/analyzer", icon: Music },
  { name: "Practice", href: "/practice", icon: Play },
  { name: "Progress", href: "/progress", icon: TrendingUp },
]

function Bottomnav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 z-50 shadow-soft">
      <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          const baseClass = "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 min-w-0 flex-1 relative";
          const activeClass = "text-primary bg-primary/10 scale-105 shadow-soft";
          const inactiveClass = "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105";
          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={baseClass + " " + (isActive ? activeClass : inactiveClass)}
            >
              {isActive && <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full"></div>}
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Bottomnav;
