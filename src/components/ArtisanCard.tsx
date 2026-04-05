import { Star, MapPin, MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Artisan } from "@/data/mockData";

const ArtisanCard = ({ artisan }: { artisan: Artisan }) => {
  const cleanNumber = artisan.whatsapp?.replace(/\D/g, "").replace(/^91/, "") || "";
  const waUrl = `https://wa.me/91${cleanNumber}?text=${encodeURIComponent("Hi! I found your profile on EmbroideryVerse and I'm interested in your work.")}`;
  // UUID pattern = DB artisan → /artisan/:id, otherwise mock → /artisans/:slug
  const isDbArtisan = /^[0-9a-f]{8}-/.test(artisan.id);
  const profileLink = isDbArtisan ? `/artisan/${artisan.id}` : `/artisans/${artisan.slug}`;

  return (
    <div className="card-warm p-4 flex flex-col items-center text-center hover-lift">
      <img src={artisan.photo} alt={artisan.name}
        className="w-20 h-20 rounded-full object-cover border-2 border-gold mb-3" />
      <h3 className="font-heading font-bold text-foreground">{artisan.name}</h3>
      <p className="text-sm text-primary font-medium">{artisan.skill}</p>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
        <MapPin className="w-3 h-3" /> {artisan.location}
      </p>
      <p className="text-sm font-medium text-foreground mt-1">{artisan.priceRange}</p>
      <div className="flex items-center gap-1 mt-1">
        <Star className="w-4 h-4 text-gold fill-gold" />
        <span className="text-sm font-medium">{artisan.rating}</span>
        <span className="text-xs text-muted-foreground">({artisan.reviewCount})</span>
      </div>
      <div className="flex gap-2 mt-3 w-full">
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="btn-whatsapp flex-1 text-sm justify-center py-2 px-3">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <Link to={profileLink}
          className="btn-outline-primary flex-1 text-sm flex items-center justify-center gap-1 py-2 px-3">
          <Eye className="w-4 h-4" /> Profile
        </Link>
      </div>
    </div>
  );
};

export default ArtisanCard;
