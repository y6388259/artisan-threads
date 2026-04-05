import { MessageCircle, Mail, MapPin, Instagram } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <Layout>
      <div className="px-4 py-6 max-w-lg mx-auto">
        <h1 className="font-heading text-2xl font-bold text-foreground text-center mb-2">Contact Us 📞</h1>
        <div className="section-gold-divider mb-6" />

        <div className="space-y-4">
          <a href="https://wa.me/919817103875" target="_blank" rel="noopener noreferrer" className="card-warm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-whatsapp text-whatsapp-foreground flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">WhatsApp</p>
              <p className="text-sm text-muted-foreground">+91 98171 03875</p>
            </div>
          </a>

          <a href="mailto:hello@embroideryverse.com" className="card-warm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">hello@embroideryverse.com</p>
            </div>
          </a>

          <a href="https://instagram.com/embroideryverse" target="_blank" rel="noopener noreferrer" className="card-warm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Instagram</p>
              <p className="text-sm text-muted-foreground">@EmbroideryVerse</p>
            </div>
          </a>

          <div className="card-warm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Location</p>
              <p className="text-sm text-muted-foreground">Made with ❤️ across India</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Contact;
