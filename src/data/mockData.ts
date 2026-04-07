export interface Artisan {
  id: string;
  slug: string;
  name: string;
  photo: string;
  coverPhoto: string;
  skill: string;
  skills: string[];
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  whatsapp: string;
  instagram: string;
  bio: string;
  experience: number;
  languages: string[];
  deliveryTime: string;
  categories: string[];
  portfolio: string[];
}

export interface CompletedOrder {
  id: string;
  image: string;
  artisanName: string;
  artisanLocation: string;
  deliveredIn: number;
  customerName: string;
  customerCity: string;
  rating: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  city: string;
  date: string;
  hasVideo: boolean;
}

export const artisans: Artisan[] = [
  {
    id: "1", slug: "meera-devi", name: "Meera Devi",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=300&fit=crop",
    skill: "Chikankari Specialist", skills: ["Chikankari", "Bridal Wear", "Custom Stitching"],
    location: "Lucknow, UP", priceRange: "₹500 - ₹3,000", rating: 4.8, reviewCount: 24,
    whatsapp: "919876543210", instagram: "meera_chikan",
    bio: "I've been doing Chikankari embroidery since I was 12 years old, taught by my grandmother. Every stitch carries the tradition of Lucknow.",
    experience: 18, languages: ["Hindi", "Urdu", "English"], deliveryTime: "7-14 days",
    categories: ["womens", "embroidery", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "2", slug: "rajesh-kumar", name: "Rajesh Kumar",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=300&fit=crop",
    skill: "Master Tailor", skills: ["Sherwani", "Kurta Pajama", "Nehru Jacket"],
    location: "Jaipur, Rajasthan", priceRange: "₹800 - ₹5,000", rating: 4.9, reviewCount: 31,
    whatsapp: "919876543211", instagram: "rajesh_tailoring",
    bio: "Third-generation tailor from Jaipur. Specializing in men's traditional wear with modern fits.",
    experience: 22, languages: ["Hindi", "Rajasthani", "English"], deliveryTime: "10-15 days",
    categories: ["mens", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "3", slug: "fatima-begum", name: "Fatima Begum",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=800&h=300&fit=crop",
    skill: "Zardozi Artist", skills: ["Zardozi", "Bridal Lehenga", "Heavy Embroidery"],
    location: "Hyderabad, Telangana", priceRange: "₹2,000 - ₹15,000", rating: 4.7, reviewCount: 18,
    whatsapp: "919876543212", instagram: "fatima_zardozi",
    bio: "Zardozi is my art, my life. I create bridal pieces that become family heirlooms.",
    experience: 15, languages: ["Hindi", "Telugu", "Urdu"], deliveryTime: "15-25 days",
    categories: ["womens", "embroidery", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "4", slug: "anil-sharma", name: "Anil Sharma",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=300&fit=crop",
    skill: "Phulkari Expert", skills: ["Phulkari", "Dupatta", "Punjabi Suits"],
    location: "Amritsar, Punjab", priceRange: "₹600 - ₹4,000", rating: 4.6, reviewCount: 15,
    whatsapp: "919876543213", instagram: "anil_phulkari",
    bio: "Keeping the Phulkari tradition alive. Each piece takes days of patient needlework.",
    experience: 12, languages: ["Hindi", "Punjabi"], deliveryTime: "10-18 days",
    categories: ["womens", "embroidery"],
    portfolio: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "5", slug: "priya-nair", name: "Priya Nair",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&h=300&fit=crop",
    skill: "Kasavumundu Weaver", skills: ["Kerala Kasavu", "Saree Weaving", "Mundu"],
    location: "Thrissur, Kerala", priceRange: "₹1,500 - ₹8,000", rating: 4.9, reviewCount: 27,
    whatsapp: "919876543214", instagram: "priya_weaves",
    bio: "Traditional Kerala handloom weaving passed down through four generations.",
    experience: 20, languages: ["Hindi", "Malayalam", "English"], deliveryTime: "12-20 days",
    categories: ["womens", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "6", slug: "mohammad-ismail", name: "Mohammad Ismail",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=300&fit=crop",
    skill: "Kashmiri Embroidery", skills: ["Kashmiri Aari", "Pashmina Work", "Shawls"],
    location: "Srinagar, J&K", priceRange: "₹3,000 - ₹20,000", rating: 4.8, reviewCount: 12,
    whatsapp: "919876543215", instagram: "ismail_kashmir",
    bio: "Creating exquisite Kashmiri embroidery on pashmina shawls and kurtas since childhood.",
    experience: 25, languages: ["Hindi", "Kashmiri", "Urdu", "English"], deliveryTime: "20-30 days",
    categories: ["womens", "mens", "embroidery"],
    portfolio: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "7", slug: "sunita-ben", name: "Sunita Ben",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=300&fit=crop",
    skill: "Kutch Mirror Work", skills: ["Mirror Work", "Kutch Embroidery", "Patch Work"],
    location: "Bhuj, Gujarat", priceRange: "₹400 - ₹2,500", rating: 4.5, reviewCount: 20,
    whatsapp: "919876543216", instagram: "sunita_kutch",
    bio: "Mirror work from the heart of Kutch. Vibrant, colorful, and uniquely Gujarati.",
    experience: 16, languages: ["Hindi", "Gujarati"], deliveryTime: "8-12 days",
    categories: ["womens", "embroidery", "kids"],
    portfolio: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "8", slug: "vikram-singh", name: "Vikram Singh",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=300&fit=crop",
    skill: "Bandhani Artist", skills: ["Bandhani", "Tie & Dye", "Sarees"],
    location: "Jamnagar, Gujarat", priceRange: "₹700 - ₹5,000", rating: 4.7, reviewCount: 22,
    whatsapp: "919876543217", instagram: "vikram_bandhani",
    bio: "Each dot in my Bandhani is hand-tied. This art has been in my family for 5 generations.",
    experience: 19, languages: ["Hindi", "Gujarati", "English"], deliveryTime: "10-16 days",
    categories: ["womens", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "9", slug: "lakshmi-iyer", name: "Lakshmi Iyer",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=300&fit=crop",
    skill: "Kanjivaram Specialist", skills: ["Kanjivaram Saree", "Silk Weaving", "Temple Jewelry Embroidery"],
    location: "Kanchipuram, TN", priceRange: "₹5,000 - ₹25,000", rating: 5.0, reviewCount: 9,
    whatsapp: "919876543218", instagram: "lakshmi_silk",
    bio: "Weaving Kanjivaram silk sarees with traditional temple borders and rich zari work.",
    experience: 30, languages: ["Hindi", "Tamil", "English"], deliveryTime: "25-40 days",
    categories: ["womens", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "10", slug: "ravi-verma", name: "Ravi Verma",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=300&fit=crop",
    skill: "Kids Wear Tailor", skills: ["Kids Traditional", "Festival Wear", "Custom Fits"],
    location: "Varanasi, UP", priceRange: "₹300 - ₹2,000", rating: 4.6, reviewCount: 14,
    whatsapp: "919876543219", instagram: "ravi_kidswear",
    bio: "Making adorable traditional outfits for little ones. From naming ceremonies to festivals.",
    experience: 10, languages: ["Hindi", "Bhojpuri"], deliveryTime: "5-10 days",
    categories: ["kids", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "11", slug: "deepa-kumari", name: "Deepa Kumari",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=300&fit=crop",
    skill: "Kantha Stitch Artist", skills: ["Kantha", "Quilting", "Saree Revamp"],
    location: "Shantiniketan, WB", priceRange: "₹400 - ₹3,500", rating: 4.8, reviewCount: 19,
    whatsapp: "919876543220", instagram: "deepa_kantha",
    bio: "Kantha stitching from Bengal – turning old sarees into beautiful art pieces.",
    experience: 14, languages: ["Hindi", "Bengali", "English"], deliveryTime: "8-15 days",
    categories: ["womens", "embroidery"],
    portfolio: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
  {
    id: "12", slug: "arjun-patel", name: "Arjun Patel",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=300&fit=crop",
    skill: "Wedding Specialist", skills: ["Bridal Lehenga", "Sherwani", "Wedding Complete Set"],
    location: "Surat, Gujarat", priceRange: "₹5,000 - ₹30,000", rating: 4.9, reviewCount: 35,
    whatsapp: "919876543221", instagram: "arjun_bridal",
    bio: "Complete wedding outfits for bride and groom. Your dream outfit, handcrafted with love.",
    experience: 20, languages: ["Hindi", "Gujarati", "English"], deliveryTime: "20-35 days",
    categories: ["womens", "mens", "festival"],
    portfolio: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
    ]
  },
];

export const completedOrders: CompletedOrder[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop", artisanName: "Meera Devi", artisanLocation: "Lucknow", deliveredIn: 10, customerName: "Anjali", customerCity: "Mumbai", rating: 5 },
  { id: "2", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=400&fit=crop", artisanName: "Rajesh Kumar", artisanLocation: "Jaipur", deliveredIn: 12, customerName: "Prateek", customerCity: "Delhi", rating: 5 },
  { id: "3", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=400&fit=crop", artisanName: "Fatima Begum", artisanLocation: "Hyderabad", deliveredIn: 18, customerName: "Sana", customerCity: "Bangalore", rating: 4 },
  { id: "4", image: "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=300&h=400&fit=crop", artisanName: "Sunita Ben", artisanLocation: "Bhuj", deliveredIn: 9, customerName: "Rekha", customerCity: "Ahmedabad", rating: 5 },
  { id: "5", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop", artisanName: "Vikram Singh", artisanLocation: "Jamnagar", deliveredIn: 14, customerName: "Kavita", customerCity: "Pune", rating: 5 },
  { id: "6", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=400&fit=crop", artisanName: "Deepa Kumari", artisanLocation: "Shantiniketan", deliveredIn: 11, customerName: "Neha", customerCity: "Kolkata", rating: 4 },
];

export const reviews: Review[] = [
  { id: "1", name: "Anjali Mehta", rating: 5, text: "Meera ji made the most beautiful Chikankari kurta for my mother's birthday. The detailing was incredible!", city: "Mumbai", date: "2 weeks ago", hasVideo: true },
  { id: "2", name: "Prateek Sharma", rating: 5, text: "Got my wedding sherwani stitched by Rajesh bhai. Perfect fit, amazing fabric quality. Highly recommend!", city: "Delhi", date: "1 month ago", hasVideo: false },
  { id: "3", name: "Sana Fatima", rating: 4, text: "Beautiful Zardozi work on my lehenga. Took a bit longer than expected but the quality was worth the wait.", city: "Bangalore", date: "3 weeks ago", hasVideo: true },
];

export const categoryData: Record<string, { title: string; subtitle: string; subcategories: string[]; heroImage: string }> = {
  womens: {
    title: "Women's Wear",
    subtitle: "Handcrafted elegance for every occasion",
    subcategories: ["Saree", "Lehenga", "Salwar Kameez", "Kurti", "Dupatta", "Blouse"],
    heroImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=400&fit=crop",
  },
  mens: {
    title: "Men's Wear",
    subtitle: "Traditional meets modern craftsmanship",
    subcategories: ["Kurta", "Sherwani", "Nehru Jacket", "Dhoti", "Casual Shirt"],
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop",
  },
  kids: {
    title: "Kids Wear",
    subtitle: "Adorable handmade outfits for little ones",
    subcategories: ["Girls Lehenga", "Boys Kurta", "Festival", "School Wear", "Baby"],
    heroImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=400&fit=crop",
  },
  festival: {
    title: "Festival Wear",
    subtitle: "Celebrate in style with handcrafted pieces",
    subcategories: ["Diwali", "Eid", "Wedding", "Navratri", "Puja"],
    heroImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=400&fit=crop",
  },
  embroidery: {
    title: "Embroidery & Artistry",
    subtitle: "India's finest needlework traditions",
    subcategories: ["Zardozi", "Chikankari", "Phulkari", "Kantha", "Kashmiri", "Kutch"],
    heroImage: "https://images.unsplash.com/photo-1583391733981-8b530c80b5b0?w=800&h=400&fit=crop",
  },
};
