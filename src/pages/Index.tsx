import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Search, MessageCircle, Handshake, Smartphone, Video, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import ArtisanCard from "@/components/ArtisanCard";
import Footer from "@/components/Footer";
import { artisans, completedOrders } from "@/data/mockData";
import hero1 from "@/assets/hero-1.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";

const heroSlides = [
  { image: hero1, title: "Haath Se Banaya ❤️", subtitle: "Custom clothing by real artisans across India", cta: "Explore Artisans", link: "/artisans" },
  { image: hero3, title: "Meet India's Hidden Talent", subtitle: "Tailors, embroiderers, textile artists near you", cta: "Find Artisans", link: "/artisans" },
  { image: hero4, title: "This Season's Favourites", subtitle: "Handcrafted for every occasion", cta: "Shop Now", link: "/category/festival" },
  { image: hero1, title: "Real Orders. Real People.", subtitle: "Every piece tells a story", cta: "See More Stories", link: "/artisans" },
];

const categories = [
  { emoji: "👩", label: "Women's", to: "/category/womens" },
  { emoji: "👨", label: "Men's", to: "/category/mens" },
  { emoji: "👧", label: "Kids", to: "/category/kids" },
  { emoji: "🪔", label: "Festival", to: "/category/festival" },
  { emoji: "🧵", label: "Embroidery", to: "/category/embroidery" },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=300&fit=crop",
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <Layout>
      {/* HERO CAROUSEL */}
      <section className="relative h-[60vh] min-h-[320px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" width={1200} height={600} />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{slide.title}</h1>
              <p className="text-sm md:text-base opacity-90 mb-4">{slide.subtitle}</p>
              <Link to={slide.link} className="btn-primary inline-block text-sm">{slide.cta}</Link>
            </div>
          </div>
        ))}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-card w-6" : "bg-card/50"}`} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-6 px-4">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">What are you looking for?</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link key={cat.to} to={cat.to} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-gold hover-lift">
                {cat.emoji}
              </div>
              <span className="text-xs font-medium text-foreground">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* COMPLETED ORDERS TIMELINE */}
      <section className="py-6 px-4 bg-card">
        <h2 className="font-heading text-lg font-bold text-foreground">Haath Se — Real Orders, Real Stories 🧵</h2>
        <p className="text-sm text-muted-foreground mb-4">Scroll through what our artisans have created</p>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {completedOrders.map((order) => (
            <div key={order.id} className="card-warm min-w-[220px] max-w-[220px] flex-shrink-0">
              <img src={order.image} alt="Completed order" className="w-full h-48 object-cover" loading="lazy" />
              <div className="p-3">
                <p className="font-semibold text-sm text-foreground">{order.artisanName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {order.artisanLocation}
                </p>
                <p className="text-xs text-primary mt-1">Delivered in {order.deliveredIn} days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  To: {order.customerName}, {order.customerCity}
                </p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: order.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED ARTISANS */}
      <section className="py-6 px-4 paisley-bg">
        <h2 className="font-heading text-lg font-bold text-foreground">Meet Our Artisans</h2>
        <p className="text-sm text-muted-foreground mb-4">Real people. Real skills. Ready to create for you.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artisans.slice(0, 4).map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/artisans" className="btn-outline-primary inline-flex items-center gap-1 text-sm">
            View All Artisans <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-8 px-4 bg-card">
        <h2 className="font-heading text-lg font-bold text-foreground text-center mb-6">How EmbroideryVerse Works</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { icon: "🔍", step: 1, title: "Browse & Discover", desc: "Explore artisans by category, skill, or location" },
            { icon: "💬", step: 2, title: "Connect on WhatsApp", desc: "Chat directly with the artisan. Describe your vision." },
            { icon: "🧵", step: 3, title: "Receive Your Creation", desc: "Get your custom handmade piece delivered with love" },
          ].map((s) => (
            <div key={s.step} className="card-warm min-w-[200px] flex-1 p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold mb-3">
                {s.step}
              </div>
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-heading font-bold text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="py-8 px-4 bg-primary text-primary-foreground">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Handshake className="w-6 h-6 mx-auto" />, title: "Real Artisans", sub: "Verified profiles" },
            { icon: <Smartphone className="w-6 h-6 mx-auto" />, title: "WhatsApp Direct", sub: "Talk before you order" },
            { icon: <Video className="w-6 h-6 mx-auto" />, title: "Video Proof", sub: "See it being made" },
            { icon: <Star className="w-6 h-6 mx-auto" />, title: "Reviewed Orders", sub: "Community verified" },
          ].map((t) => (
            <div key={t.title} className="py-2">
              {t.icon}
              <p className="font-bold text-sm mt-2">{t.title}</p>
              <p className="text-xs opacity-80">{t.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="py-6 px-4 paisley-bg">
        <h2 className="font-heading text-lg font-bold text-foreground text-center">As Seen on Instagram 📸</h2>
        <p className="text-sm text-muted-foreground text-center mb-4">Follow us @EmbroideryVerse</p>
        <div className="grid grid-cols-3 gap-2">
          {instagramImages.map((img, i) => (
            <img key={i} src={img} alt="Instagram post" className="w-full aspect-square object-cover rounded-lg hover-lift" loading="lazy" />
          ))}
        </div>
        <div className="text-center mt-4">
          <a href="https://instagram.com/embroideryverse" target="_blank" rel="noopener noreferrer"
            className="btn-outline-primary inline-block text-sm">
            Follow on Instagram
          </a>
        </div>
      </section>

      <Footer />
    </Layout>
  );
};

export default Index;
