import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, MessageCircle, ExternalLink, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { getProductById } from "@/data/productData";
import { useState } from "react";

const reviews = [
  {
    name: "Priya S.",
    city: "Delhi",
    rating: 5,
    text: "The embroidery is so detailed, exactly what I wanted for my sister's wedding. Quality is better than what you get in malls.",
  },
  {
    name: "Rahul M.",
    city: "Bangalore",
    rating: 5,
    text: "Got my kurta in 10 days. The artisan sent me progress photos on WhatsApp. Felt very personal and special.",
  },
  {
    name: "Sunita K.",
    city: "Chandigarh",
    rating: 4,
    text: "Beautiful Phulkari work. My mother loved it. Will order again!",
  },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id || "");
  const [mainImage, setMainImage] = useState(0);

  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <button onClick={() => navigate(-1)} className="text-primary font-medium flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi! I saw "${product.name}" (₹${product.priceMin}-₹${product.priceMax}) on EmbroideryVerse. I am interested in ordering this. Can you share more details?`
  );
  const whatsappUrl = `https://wa.me/${product.artisanWhatsapp}?text=${whatsappMsg}`;

  return (
    <Layout>
      <div className="pb-24">
        {/* Back button */}
        <div className="px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Main photo */}
        <div className="relative w-full h-[300px] bg-muted">
          <img
            src={product.gallery[mainImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {product.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 ${mainImage === i ? "border-primary" : "border-transparent"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>

        {/* Product info */}
        <div className="px-4 space-y-3">
          <h1 className="font-heading text-xl font-bold">{product.name}</h1>
          <p className="text-primary font-bold text-lg">
            ₹{product.priceMin.toLocaleString("en-IN")} - ₹{product.priceMax.toLocaleString("en-IN")}
          </p>

          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-1 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Handmade in {product.artisanCity}</span>
          </div>
        </div>

        {/* Artisan section */}
        <div className="px-4 mt-6">
          <h2 className="font-heading font-semibold text-base mb-3">Made by</h2>
          <div
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border cursor-pointer hover:bg-muted transition-colors"
            onClick={() => navigate(`/artisan/${product.artisanId}`)}
          >
            <img
              src={product.artisanPhoto}
              alt={product.artisanName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm">{product.artisanName}</p>
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground">{product.artisanSkill}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{product.artisanCity}, {product.artisanState}</span>
                <span className="text-xs text-muted-foreground">• {product.artisanExperience} yrs exp</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4 mt-6">
          <h2 className="font-heading font-semibold text-base mb-3">What customers say</h2>
          <div className="space-y-3">
            {reviews.map((review, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/50 border">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-1">"{review.text}"</p>
                <p className="text-xs text-muted-foreground">— {review.name}, {review.city}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t px-4 py-3 flex items-center justify-between z-50">
        <div>
          <p className="text-xs text-muted-foreground">Price Range</p>
          <p className="font-bold text-primary">
            ₹{product.priceMin.toLocaleString("en-IN")} - ₹{product.priceMax.toLocaleString("en-IN")}
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Order via WhatsApp 💬
        </a>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
