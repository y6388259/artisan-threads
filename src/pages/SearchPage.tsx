import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import ArtisanCard from "@/components/ArtisanCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Artisan } from "@/data/mockData";

const FILTER_CHIPS = ["All", "Embroidery", "Tailoring", "Phulkari", "Kantha", "Zardozi", "Chikankari"];

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [results, setResults] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const isSearching = search.trim() !== "" || activeChip !== "All";
    setHasSearched(isSearching);
    if (!isSearching) {
      setResults([]);
      return;
    }

    const fetchArtisans = async () => {
      setLoading(true);
      let query = supabase.from("artisans").select("*").eq("status", "approved");

      if (search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(
          `name.ilike.${term},city.ilike.${term},state.ilike.${term},skill_type.ilike.${term}`
        );
      }

      if (activeChip !== "All") {
        query = query.ilike("skill_type", `%${activeChip}%`);
      }

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
            rating: a.rating || 0,
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

    const debounce = setTimeout(fetchArtisans, 300);
    return () => clearTimeout(debounce);
  }, [search, activeChip]);

  return (
    <Layout>
      <div className="px-4 py-4">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Search Artisans 🔍</h1>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, city, skill or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-warm pl-10"
            autoFocus
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeChip === chip
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Initial state */}
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Discover skilled artisans across India</p>
            <p className="text-sm text-muted-foreground mt-1">Search by name, city, skill or state</p>
          </div>
        )}

        {loading && (
          <p className="text-center text-muted-foreground py-8">Searching...</p>
        )}

        {!loading && hasSearched && results.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              {results.length} Artisan{results.length !== 1 ? "s" : ""} Found
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          </>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😔</div>
            <p className="text-lg font-medium text-foreground mb-2">No artisans found</p>
            <p className="text-sm text-muted-foreground">Try different keywords or browse categories instead.</p>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default SearchPage;
