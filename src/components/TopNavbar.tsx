import { Menu, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

interface TopNavbarProps {
  onMenuToggle: () => void;
}

const TopNavbar = ({ onMenuToggle }: TopNavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background gold-border-bottom h-14 flex items-center justify-between px-4">
      <button onClick={onMenuToggle} className="touch-target flex items-center justify-center">
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      <Link to="/" className="flex items-center gap-1.5">
        <span className="text-lg font-heading font-bold text-foreground">
          Embroidery<span className="text-primary">Verse</span>
        </span>
        <span className="text-gold text-sm">🧵</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/artisans" className="touch-target flex items-center justify-center">
          <Search className="w-5 h-5 text-foreground" />
        </Link>
        <Link to="/profile" className="touch-target flex items-center justify-center">
          <User className="w-5 h-5 text-foreground" />
        </Link>
      </div>
    </header>
  );
};

export default TopNavbar;
