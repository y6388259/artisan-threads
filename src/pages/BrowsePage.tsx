import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ArtisanCard from "@/components/ArtisanCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Artisan } from "@/data/mockData";

const categories = [
  { emoji: "👩", label: "Women's", key: "womens" },
  { emoji: "👨", label: "Men's", key: "mens" },
  { emoji: "👧", label: "Kids", key: "kids" },
  { emoji: "🪔", label: "Festival", key: "festival" },
  { emoji: "🧵", label: "Embroidery", key: "embroidery" },
];

// Filter logic per category
const buildQuery = (key: string, base: any) => {
  switch (key) {
    case "womens":
      return base.or("skill_type.ilike.%embroidery%,skill_type.ilike.%tailoring%");
    case "mens":
    case "kids":
      return base.ilike("skill_type", "%tailoring%");
    case "festival":
      return base.ilike("skill_type", "%embroidery%");
    case "embroidery":
    default:
      return base; // all approved artisans
  }
};

const BrowsePage = () => {
  const [activeCategory, setActiveCategory] = useState("embroidery");
  const [results, setResults] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      const base = supabase.from("artisans").select("*").eq("status", "approved");
      const query = buildQuery(activeCategory, base);
      const { data, error } = await query;

      if (!error && data) {
        setResults(
          data.map((a: any) => ({
            id: a.id,
            slug: a.id,
            name: a.name,
            photo: a.profile_photo_url || "/placeholder.svg",
            coverPhoto: "/placeholder.svg",
            skill: a.skill_type,
            skills: [a.skill_type],
            location: `${a.city}, ${a.state}`,
            priceRange: `₹${a.price_min} - ₹${a.price_max}`,
            rating: 0,
            reviewCount: 0,
            whatsapp: a.whatsapp_number,
            instagram: a.instagram_link || "",
            bio: a.bio,
            experience: a.years_experience || 0,
            languages: [],
            deliveryTime: "",
            categories: [],
            portfolio: a.portfolio_urls || [],
          }))
        );
      } else {
        setResults([]);
      }
      setLoading(false);
    };

    fetchArtisans();
  }, [activeCategory]);

  return (
    <Layout>
      <div className="px-4 py-4">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Browse Categories ✂️</h1>

        {/* Category icons */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex flex-col items-center gap-2 min-w-[70px] transition-transform ${activeCategory === cat.key ? "scale-110" : ""}`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-colors ${
                  activeCategory === cat.key
                    ? "border-primary bg-primary/10"
                    : "border-gold bg-muted"
                }`}
              >
                {cat.emoji}
              </div>
              <span className={`text-xs font-medium ${activeCategory === cat.key ? "text-primary" : "text-foreground"}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm font-medium text-foreground mb-3">
            {results.length} Artisan{results.length !== 1 ? "s" : ""} Found
          </p>
        )}

        {loading && (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        )}

        {/* Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🪡</div>
            <p className="text-lg font-medium text-foreground mb-2">No artisans here yet</p>
            <p className="text-sm text-muted-foreground mb-4">This category is waiting for talented artisans.</p>
            <Link to="/register-artisan" className="btn-primary inline-block text-sm px-6 py-2">
              Register an Artisan
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default BrowsePage;
