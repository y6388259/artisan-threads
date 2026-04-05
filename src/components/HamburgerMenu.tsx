import { X, Home, ShoppingBag, Palette, UserPlus, Info, Phone, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: ShoppingBag, label: "👩 Women's Wear", to: "/category/womens" },
  { icon: ShoppingBag, label: "👨 Men's Wear", to: "/category/mens" },
  { icon: ShoppingBag, label: "👧 Kids Wear", to: "/category/kids" },
  { icon: ShoppingBag, label: "🪔 Festival Wear", to: "/category/festival" },
  { icon: ShoppingBag, label: "🧵 Embroidery & Artistry", to: "/category/embroidery" },
];

const secondaryItems = [
  { icon: Palette, label: "🎨 Find Artisans", to: "/artisans" },
  { icon: UserPlus, label: "📝 Register as Artisan", to: "/register-artisan" },
];

const bottomItems = [
  { icon: Info, label: "ℹ️ About Us", to: "/about" },
  { icon: Phone, label: "📞 Contact", to: "/contact" },
  { icon: LogIn, label: "🔐 Login / Register", to: "/login" },
];

const HamburgerMenu = ({ open, onClose }: HamburgerMenuProps) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-card z-50 animate-slide-in-left shadow-xl overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="font-heading font-bold text-foreground">Welcome! 🙏</p>
            <p className="text-sm text-muted-foreground">Explore handmade fashion</p>
          </div>
          <button onClick={onClose} className="touch-target flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors touch-target">
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="my-2 border-t border-border" />

          {secondaryItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors touch-target">
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="my-2 border-t border-border" />

          {bottomItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors touch-target">
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
