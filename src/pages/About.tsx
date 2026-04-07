import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-accent to-primary/80 py-12 px-6 text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Our Story 🧵</h1>
        <p className="text-primary-foreground/90 text-lg font-medium">Born in India 🇮🇳</p>
      </section>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Why */}
        <div className="card-warm p-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-3">Why EmbroideryVerse?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thousands of incredibly talented artisans live in small towns across India — master embroiderers, 
            skilled tailors, and textile artists who create magic with their hands. But most of them have no way 
            to reach customers beyond their local area. Their craft stays hidden, their talent goes unnoticed, 
            and their livelihood remains uncertain.
          </p>
        </div>

        {/* Solution */}
        <div className="card-warm p-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-3">Our Solution</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            EmbroideryVerse is the bridge between India's hidden artisans and customers who value handmade quality. 
            We connect you directly with craftspeople via WhatsApp — no middlemen, no factories, no markups. 
            Just real people making real clothes with real skill.
          </p>
        </div>

        {/* Value Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card-warm p-4 text-center">
            <div className="text-3xl mb-2">🧑</div>
            <p className="font-heading font-bold text-sm text-foreground">Real People</p>
            <p className="text-xs text-muted-foreground mt-1">Verified artisans, not factories</p>
          </div>
          <div className="card-warm p-4 text-center">
            <div className="text-3xl mb-2">💬</div>
            <p className="font-heading font-bold text-sm text-foreground">Direct Connection</p>
            <p className="text-xs text-muted-foreground mt-1">Chat on WhatsApp directly</p>
          </div>
          <div className="card-warm p-4 text-center">
            <div className="text-3xl mb-2">🇮🇳</div>
            <p className="font-heading font-bold text-sm text-foreground">Made in India</p>
            <p className="text-xs text-muted-foreground mt-1">Supporting local craft</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/register-artisan" className="btn-primary text-center text-sm px-6 py-3">
            Register Free 🧵
          </Link>
          <Link to="/artisans" className="btn-outline-primary text-center text-sm px-6 py-3">
            Find Artisans 🔍
          </Link>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default About;
