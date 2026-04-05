import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, MapPin, MessageCircle, Instagram, Clock, IndianRupee, ShieldCheck, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const ArtisanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisan = async () => {
      const { data, error } = await supabase
        .from("artisans")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (!error && data) setArtisan(data);
      setLoading(false);
    };
    fetchArtisan();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!artisan) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground text-lg">Artisan not found</p>
          <button onClick={() => navigate("/artisans")} className="btn-primary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Artisans
          </button>
        </div>
      </Layout>
    );
  }

  const cleanNumber = artisan.whatsapp_number?.replace(/\D/g, "").replace(/^91/, "") || "";
  const waUrl = `https://wa.me/91${cleanNumber}?text=${encodeURIComponent("Hi! I found your profile on EmbroideryVerse and I'm interested in your work.")}`;
  const rating = artisan.rating || 0;

  return (
    <Layout>
      <div className="pb-20">
        {/* Hero photo with back button and gradient */}
        <div className="relative w-full h-[250px]">
          <img
            src={artisan.profile_photo_url || "/placeholder.svg"}
            alt={artisan.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <button
            onClick={() => navigate("/artisans")}
            className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="font-heading text-2xl font-bold text-white">{artisan.name}</h1>
          </div>
        </div>

        {/* Info section */}
        <div className="px-4 py-4 space-y-3">
          {/* Verified badge */}
          {artisan.status === "approved" && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Artisan
            </div>
          )}

          {/* Location */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {artisan.city}, {artisan.state}
          </p>

          {/* Skill badge */}
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {artisan.skill_type}
          </span>

          {/* Experience */}
          {artisan.years_experience && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> {artisan.years_experience} Years Experience
            </p>
          )}

          {/* Price range */}
          <p className="text-sm text-foreground font-medium flex items-center gap-1">
            <IndianRupee className="w-4 h-4" /> ₹{artisan.price_min} - ₹{artisan.price_max} per piece
          </p>

          {/* Star rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
          </div>
        </div>

        {/* Bio */}
        {artisan.bio && (
          <section className="px-4 py-4 border-t border-border">
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{artisan.bio}</p>
          </section>
        )}

        {/* Instagram */}
        {artisan.instagram_link && (
          <div className="px-4 py-2">
            <a
              href={artisan.instagram_link.startsWith("http") ? artisan.instagram_link : `https://instagram.com/${artisan.instagram_link.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-primary w-full flex items-center justify-center gap-2"
            >
              <Instagram className="w-5 h-5" /> View Instagram Portfolio
            </a>
          </div>
        )}

        {/* Portfolio */}
        {artisan.portfolio_urls && artisan.portfolio_urls.length > 0 && (
          <section className="px-4 py-4">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">Portfolio</h2>
            <div className="grid grid-cols-2 gap-2">
              {artisan.portfolio_urls.map((url: string, i: number) => (
                <img
                  key={i}
                  src={url}
                  alt={`Work ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-xl"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky WhatsApp CTA */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-3 pt-2 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full justify-center text-base py-3"
        >
          <MessageCircle className="w-5 h-5" /> Connect on WhatsApp 💬
        </a>
      </div>

      <Footer />
    </Layout>
  );
};

export default ArtisanDetailPage;
