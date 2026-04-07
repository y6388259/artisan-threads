import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import ArtisanCard from "@/components/ArtisanCard";
import Footer from "@/components/Footer";
import { artisans as mockArtisans } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

const filters = ["All", "Women's", "Men's", "Embroidery", "Stitching", "Bridal"];

const filterMap: Record<string, string> = {
  "All": "",
  "Women's": "womens",
  "Men's": "mens",
  "Embroidery": "embroidery",
  "Stitching": "kids",
  "Bridal": "festival",
};

const ArtisanListing = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [dbArtisans, setDbArtisans] = useState<any[]>([]);

  useEffect(() => {
    const fetchArtisans = async () => {
      const { data, error } = await supabase
        .from("artisans")
        .select("*")
        .eq("status", "approved");

      if (!error && data) {
        setDbArtisans(data);
      }
    };
    fetchArtisans();
  }, []);

  // Merge mock artisans with DB artisans for display
  const allArtisans = [
    ...mockArtisans,
    ...dbArtisans.map((a) => ({
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
    })),
  ];

  const filtered = allArtisans.filter((a) => {
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.skill.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || a.categories.includes(filterMap[activeFilter]);
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="px-4 py-4">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Find Artisans 🎨</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search by skill, location, name..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-warm pl-10" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors touch-target ${activeFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🧵</div>
            <p className="text-lg font-medium text-foreground mb-2">No artisans yet!</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first to join our community.</p>
            <Link to="/register-artisan" className="btn-primary inline-block text-sm px-6 py-2">
              Register Now
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default ArtisanListing;
