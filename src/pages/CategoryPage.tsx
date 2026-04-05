import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, Star, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { categoryData } from "@/data/mockData";
import { getProductsByCategoryAndSub } from "@/data/productData";
import { useState } from "react";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const category = categoryData[slug || ""];
  const [activeSub, setActiveSub] = useState("All");

  if (!category) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Category not found</p>
        </div>
      </Layout>
    );
  }

  const filtered = getProductsByCategoryAndSub(slug || "", activeSub);

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-40">
        <img src={category.heroImage} alt={category.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-card">
          <h1 className="font-heading text-2xl font-bold">{category.title}</h1>
          <p className="text-sm opacity-90">{category.subtitle}</p>
        </div>
      </div>

      {/* Subcategory chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveSub("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-target ${activeSub === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          All
        </button>
        {category.subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSub(sub)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-target ${activeSub === sub ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div className="px-4 pb-2">
        <p className="text-sm text-muted-foreground font-medium">
          {filtered.length} {filtered.length === 1 ? "Product" : "Products"} Found
        </p>
      </div>

      {/* Product grid */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-heading font-semibold text-sm leading-tight line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-primary font-bold text-sm mb-1">
                  ₹{product.priceMin.toLocaleString("en-IN")} - ₹{product.priceMax.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground mb-0.5">
                  by {product.artisanName}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  {product.artisanCity}, {product.artisanState}
                </div>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="mt-auto w-full bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View & Order
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this subcategory yet.</p>
          </div>
        )}
      </div>

      {/* WhatsApp banner */}
      <div className="mx-4 my-6 p-4 rounded-2xl bg-primary text-primary-foreground text-center">
        <p className="font-heading font-bold mb-1">Can't find what you want?</p>
        <p className="text-sm opacity-90 mb-3">Tell us on WhatsApp and we'll connect you with the right artisan</p>
        <a
          href="https://wa.me/98171038750?text=Hi! I'm looking for a specific item on EmbroideryVerse."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp inline-flex text-sm"
        >
          <MessageCircle className="w-4 h-4" /> Chat with Us
        </a>
      </div>

      <Footer />
    </Layout>
  );
};

export default CategoryPage;
