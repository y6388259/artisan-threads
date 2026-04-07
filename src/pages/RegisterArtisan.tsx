import { useState } from "react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RegisterArtisan = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [portfolioPhotos, setPortfolioPhotos] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    whatsapp_number: "",
    city: "",
    state: "",
    skill_type: "",
    years_experience: "",
    price_min: "",
    price_max: "",
    instagram_link: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const uploadToSupabase = async (file: File, path: string): Promise<string> => {
  const { error } = await supabase.storage
    .from('artisan-photos')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from('artisan-photos')
    .getPublicUrl(path);
  return publicUrl;
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
if (!profilePhoto) {
  toast.error("Please upload your profile photo");
  return;
}

setUploading(true);
let profilePhotoUrl = '';
let portfolioUrls: string[] = [];

try {
  const timestamp = Date.now();
  profilePhotoUrl = await uploadToSupabase(
    profilePhoto, 
    `profiles/${timestamp}_${profilePhoto.name}`
  );
  setUploadProgress(50);
  
  for (let i = 0; i < portfolioPhotos.length; i++) {
    const url = await uploadToSupabase(
      portfolioPhotos[i],
      `portfolio/${timestamp}_${i}_${portfolioPhotos[i].name}`
    );
    portfolioUrls.push(url);
    setUploadProgress(50 + ((i + 1) / portfolioPhotos.length) * 50);
  }
} catch (err) {
  toast.error("Photo upload failed. Please try again.");
  setUploading(false);
  return;
}
setUploading(false);
    setLoading(true);

    const { error } = await supabase.from("artisans").insert({
      name: form.name,
      whatsapp_number: `+91${form.whatsapp_number}`,
      city: form.city.split(",")[0]?.trim() || form.city,
      state: form.city.split(",")[1]?.trim() || "",
      skill_type: form.skill_type,
      years_experience: parseInt(form.years_experience),
      price_min: parseInt(form.price_min),
      price_max: parseInt(form.price_max),
      instagram_link: form.instagram_link || null,
      bio: form.bio,
      profile_photo_url: profilePhotoUrl,
      portfolio_urls: portfolioUrls,
    });

    setLoading(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Supabase insert error:", error);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Namaste!</h1>
          <p className="text-muted-foreground">Profile received! We'll WhatsApp you within 24 hours.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent to-primary/20 py-8 px-6 text-center">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Join EmbroideryVerse Family 🧵</h1>
        <p className="text-sm text-muted-foreground mb-4">Free to join. Share your craft with India.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">✓ Free Profile</span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">✓ WhatsApp Orders</span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">✓ Instagram Promo</span>
        </div>
      </section>

      <div className="px-4 py-6 max-w-lg mx-auto">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-warm" placeholder="Your full name" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">WhatsApp Number</label>
            <div className="flex gap-2">
              <span className="input-warm w-16 flex items-center justify-center text-sm text-muted-foreground">+91</span>
              <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} className="input-warm flex-1" placeholder="98765 43210" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Location (City, State)</label>
            <input name="city" value={form.city} onChange={handleChange} className="input-warm" placeholder="e.g., Lucknow, UP" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Primary Skill</label>
            <select name="skill_type" value={form.skill_type} onChange={handleChange} className="input-warm" required>
              <option value="">Select your skill</option>
              <option>Stitching</option>
              <option>Embroidery</option>
              <option>Weaving</option>
              <option>Tailoring</option>
              <option>Bridal</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Years of Experience</label>
            <input name="years_experience" type="number" value={form.years_experience} onChange={handleChange} className="input-warm" placeholder="e.g., 10" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Price From (₹)</label>
              <input name="price_min" type="number" value={form.price_min} onChange={handleChange} className="input-warm" placeholder="500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Price To (₹)</label>
              <input name="price_max" type="number" value={form.price_max} onChange={handleChange} className="input-warm" placeholder="5000" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Instagram Profile (optional)</label>
            <input name="instagram_link" value={form.instagram_link} onChange={handleChange} className="input-warm" placeholder="@your_handle" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Short Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="input-warm min-h-[100px]" placeholder="Tell us about your craft..." required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
            {loading ? "Submitting..." : "Register as Artisan"}
          </button>
        </form>
      </div>
      <Footer />
    </Layout>
  );
};

export default RegisterArtisan;
