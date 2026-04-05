import { Home, Search, Scissors, Palette, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Search, label: "Search", to: "/search" },
  { icon: Scissors, label: "Browse", to: "/browse" },
  { icon: Palette, label: "Artisans", to: "/artisans" },
  { icon: User, label: "Profile", to: "/profile" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around h-16 safe-area-bottom">
      {tabs.map((tab) => {
        const active = pathname === tab.to || (tab.to !== "/" && pathname.startsWith(tab.to));
        return (
          <Link key={tab.label} to={tab.to}
            className={`flex flex-col items-center justify-center gap-0.5 touch-target ${active ? "text-primary" : "text-muted-foreground"}`}>
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
