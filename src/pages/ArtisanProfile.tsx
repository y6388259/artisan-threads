import { useParams } from "react-router-dom";
import { Star, MapPin, MessageCircle, Instagram, Clock, Globe, IndianRupee, Video } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { artisans, reviews } from "@/data/mockData";

const ArtisanProfile = () => {
  const { slug } = useParams();
  const artisan = artisans.find((a) => a.slug === slug);

  if (!artisan) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Artisan not found</p>
        </div>
      </Layout>
    );
  }

  const cleanNumber = artisan.whatsapp?.replace(/\D/g, "").replace(/^91/, "") || "";
  const waUrl = `https://wa.me/91${cleanNumber}?text=${encodeURIComponent("Hi! I found your profile on EmbroideryVerse and I'm interested in your work.")}`;

  return (
    <Layout>
      {/* Cover */}
      <div className="relative h-48">
        <img src={artisan.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="px-4 -mt-12 relative z-10 mb-4">
        <img src={artisan.photo} alt={artisan.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-card mx-auto" />
        <div className="text-center mt-3">
          <h1 className="font-heading text-2xl font-bold text-foreground">{artisan.name}</h1>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {artisan.skills.map((s) => (
              <span key={s} className="px-3 py-1 bg-muted text-xs font-medium rounded-full text-foreground">{s}</span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold fill-gold" />{artisan.rating} ({artisan.reviewCount})</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{artisan.location}</span>
          </div>
          <p className="text-sm text-foreground flex items-center justify-center gap-1 mt-1">
            <IndianRupee className="w-4 h-4" /> {artisan.priceRange}
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center">
            <MessageCircle className="w-5 h-5" /> WhatsApp Now 💬
          </a>
        </div>
        <a href={`https://instagram.com/${artisan.instagram}`} target="_blank" rel="noopener noreferrer"
          className="btn-outline-primary w-full mt-2 flex items-center justify-center gap-2">
          <Instagram className="w-5 h-5" /> @{artisan.instagram}
        </a>
      </div>

      {/* Portfolio */}
      <section className="px-4 py-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-3">My Work</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {artisan.portfolio.map((img, i) => (
            <img key={i} src={img} alt="Portfolio" className="w-full aspect-square object-cover rounded-xl hover-lift" loading="lazy" />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="px-4 py-6 bg-card">
        <h2 className="font-heading text-lg font-bold text-foreground mb-3">About {artisan.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{artisan.bio}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {artisan.experience} years exp.</div>
          <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> {artisan.languages.join(", ")}</div>
          <div className="flex items-center gap-2 col-span-2"><Star className="w-4 h-4 text-primary" /> Delivery: {artisan.deliveryTime}</div>
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-3">Customer Reviews</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="card-warm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">{review.name}</span>
                {review.hasVideo && (
                  <span className="flex items-center gap-1 text-xs text-primary bg-muted px-2 py-1 rounded-full">
                    <Video className="w-3 h-3" /> Video Review
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
              <p className="text-xs text-muted-foreground mt-2">{review.city} · {review.date}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </Layout>
  );
};

export default ArtisanProfile;
