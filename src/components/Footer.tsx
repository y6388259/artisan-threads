import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="font-heading text-xl font-bold mb-2">
          Embroidery<span className="text-gold">Verse</span> 🧵
        </h3>
        <p className="text-sm opacity-80 mb-6">Connecting India's artisans to the world</p>

        <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
          {[
            { label: "Home", to: "/" },
            { label: "Browse", to: "/category/womens" },
            { label: "Artisans", to: "/artisans" },
            { label: "Register", to: "/register-artisan" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="opacity-80 hover:opacity-100 transition-opacity">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <a href="https://instagram.com/embroideryverse" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://wa.me/98171038750" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href="https://youtube.com/@embroideryverse" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors">
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        <p className="text-xs opacity-60">Made with ❤️ in India</p>
      </div>
    </footer>
  );
};

export default Footer;
