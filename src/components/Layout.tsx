import { useState } from "react";
import TopNavbar from "./TopNavbar";
import HamburgerMenu from "./HamburgerMenu";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar onMenuToggle={() => setMenuOpen(true)} />
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 pb-20 pt-14">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
