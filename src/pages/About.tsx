import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <Layout>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-foreground text-center mb-2">About EmbroideryVerse 🧵</h1>
        <div className="section-gold-divider mb-6" />

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            EmbroideryVerse is a platform that connects customers with India's talented local artisans — the tailors, 
            embroiderers, and textile artists who create magic with their hands.
          </p>
          <p>
            We believe every handmade piece tells a story. Unlike factory-made clothing, each creation from our artisans 
            carries the warmth of human touch, the pride of traditional craftsmanship, and the beauty of India's diverse 
            textile heritage.
          </p>
          <h2 className="font-heading text-lg font-bold text-foreground pt-2">Our Mission</h2>
          <p>
            To give India's hidden artisans a digital stage. To help customers discover real craftspeople in their city 
            or across the country. To keep traditional skills alive by making them accessible and valued.
          </p>
          <h2 className="font-heading text-lg font-bold text-foreground pt-2">How We're Different</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>No middlemen — you talk directly to the artisan on WhatsApp</li>
            <li>Real profiles with verified work photos and video reviews</li>
            <li>Every piece is custom-made just for you</li>
            <li>Supporting local livelihoods, not fast fashion factories</li>
          </ul>
          <p className="text-center pt-4 text-foreground font-medium">
            Haath se bana, dil se diya ❤️
          </p>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default About;
