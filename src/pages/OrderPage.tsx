import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ITEM_TYPES = [
  "Kurta", "Salwar Kameez", "Lehenga", "Saree Blouse",
  "Sherwani", "Kurta Pajama", "Custom (describe below)"
];
const STITCHING_TYPES = ["Regular", "Premium", "Handwork"];
const EMBROIDERY_TYPES = ["Phulkari", "Kantha", "Zardozi", "Chikankari", "None", "Other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom measurements"];
const FIT_TYPES = ["Regular", "Slim", "Loose/Comfort"];
const TIMELINES = ["1 week", "2 weeks", "1 month", "Flexible"];

const OrderPage = () => {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Step 2 fields
  const [itemType, setItemType] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [stitchingType, setStitchingType] = useState("Regular");
  const [embroideryType, setEmbroideryType] = useState("None");

  // Step 3 fields
  const [size, setSize] = useState("M");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [length, setLength] = useState("");
  const [sleeveLength, setSleeveLength] = useState("");
  const [fitPreference, setFitPreference] = useState("Regular");
  const [fitNotes, setFitNotes] = useState("");

  // Step 4 fields
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [timeline, setTimeline] = useState("2 weeks");
  const [orderValue, setOrderValue] = useState(1000);
  const [specialNote, setSpecialNote] = useState("");

  const shippingFee = 100;
  const platformFee = 0;
  const total = orderValue + shippingFee + platformFee;

  useEffect(() => {
    const fetchArtisan = async () => {
      const { data } = await supabase
        .from("artisans")
        .select("*")
        .eq("id", artisanId)
        .single();
      if (data) setArtisan(data);
      setLoading(false);
    };
    fetchArtisan();
  }, [artisanId]);

  const validateStep = (s: number): boolean => {
    if (s === 2) {
      if (!itemType) { toast({ title: "Please select an item type", variant: "destructive" }); return false; }
      if (!description.trim()) { toast({ title: "Please describe your requirement", variant: "destructive" }); return false; }
    }
    if (s === 3) {
      if (size === "Custom measurements" && !chest && !waist) {
        toast({ title: "Please enter at least chest or waist measurement", variant: "destructive" }); return false;
      }
    }
    if (s === 4) {
      if (!fullName.trim()) { toast({ title: "Please enter your name", variant: "destructive" }); return false; }
      if (!/^\d{10}$/.test(whatsapp)) { toast({ title: "Enter a valid 10-digit WhatsApp number", variant: "destructive" }); return false; }
      if (!city.trim()) { toast({ title: "Please enter your city", variant: "destructive" }); return false; }
      if (orderValue < 1000) { toast({ title: "Minimum order value is ₹1,000", variant: "destructive" }); return false; }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    const cleanNum = artisan?.whatsapp_number?.replace(/\D/g, "").replace(/^91/, "") || "";
    const measurements = size === "Custom measurements"
      ? `Chest: ${chest}, Waist: ${waist}, Hip: ${hip}, Length: ${length}, Sleeve: ${sleeveLength}`
      : size;

    // Save to Supabase
    await supabase.from("orders").insert({
      artisan_id: artisanId,
      customer_name: fullName,
      customer_whatsapp: whatsapp,
      customer_email: email || null,
      delivery_city: city,
      item_type: itemType,
      description,
      fabric_preference: fabric || null,
      stitching_type: stitchingType,
      embroidery_type: embroideryType,
      size,
      measurements: size === "Custom measurements" ? measurements : null,
      fit_preference: fitPreference,
      fit_notes: fitNotes || null,
      timeline,
      order_value: orderValue,
      shipping_fee: shippingFee,
      platform_fee: platformFee,
      total,
      special_note: specialNote || null,
      status: "pending",
    });

    // Open WhatsApp
    const msg = `🧵 New Order from EmbroideryVerse

Customer: ${fullName}
Item: ${itemType}
Description: ${description}
Size: ${measurements}
Timeline: ${timeline}
Order Value: ₹${orderValue}
City: ${city}
Note: ${specialNote || "—"}

Please confirm if you can take this order.`;

    window.open(`https://wa.me/91${cleanNum}?text=${encodeURIComponent(msg)}`, "_blank");

    toast({ title: "🎉 Order sent!", description: "The artisan will confirm on WhatsApp." });
    navigate("/artisans");
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div></Layout>;
  }

  if (!artisan) {
    return <Layout><div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><p className="text-muted-foreground text-lg">Artisan not found</p><Button onClick={() => navigate("/artisans")}><ArrowLeft className="w-4 h-4 mr-2" />Back to Artisans</Button></div></Layout>;
  }

  return (
    <Layout>
      <div className="pb-24 px-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="py-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Place Your Order 🧵</h1>
          <div className="flex items-center gap-3 mt-4 justify-center">
            <img src={artisan.profile_photo_url || "/placeholder.svg"} alt={artisan.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
            <div className="text-left">
              <p className="font-semibold text-foreground">{artisan.name}</p>
              <p className="text-xs text-muted-foreground">{artisan.city}, {artisan.state}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Step {step} of 5</p>
            <Progress value={step * 20} className="h-2" />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-accent/50 rounded-2xl p-6 text-center space-y-3">
              <p className="text-4xl">🧵</p>
              <h2 className="font-heading text-lg font-bold text-foreground">Ready to order from {artisan.name}?</h2>
              <p className="text-sm text-muted-foreground">Tell us what you want made, your size, and we'll connect you directly with the artisan on WhatsApp.</p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{artisan.skill_type}</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">₹{artisan.price_min}–₹{artisan.price_max}</span>
              </div>
            </div>
            <Button onClick={nextStep} className="w-full" size="lg">
              Start Order <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: What do you want? */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">What do you want made?</h2>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Item Type *</Label>
              <div className="grid grid-cols-2 gap-2">
                {ITEM_TYPES.map(t => (
                  <button key={t} onClick={() => setItemType(t)}
                    className={`text-left text-sm px-3 py-2.5 rounded-xl border transition-colors ${itemType === t ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-background text-foreground hover:border-primary/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Describe your requirement *</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="E.g., I want a pink georgette kurta with golden embroidery on the neckline..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fabric preference (optional)</Label>
              <Input value={fabric} onChange={e => setFabric(e.target.value)} placeholder="Cotton, Silk, Georgette, Chiffon..." />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Stitching type</Label>
              <RadioGroup value={stitchingType} onValueChange={setStitchingType} className="flex gap-3">
                {STITCHING_TYPES.map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <RadioGroupItem value={t} id={`stitch-${t}`} />
                    <Label htmlFor={`stitch-${t}`} className="text-sm">{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Special embroidery</Label>
              <div className="flex flex-wrap gap-2">
                {EMBROIDERY_TYPES.map(t => (
                  <button key={t} onClick={() => setEmbroideryType(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${embroideryType === t ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={nextStep} className="flex-1">Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* Step 3: Size & Fit */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">Size & Fit</h2>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Size</Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`text-sm px-4 py-2 rounded-xl border transition-colors ${size === s ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-foreground hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {size === "Custom measurements" && (
              <div className="space-y-3 bg-accent/30 rounded-xl p-4">
                <p className="text-sm font-medium text-foreground">Enter measurements (in inches)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Chest</Label><Input value={chest} onChange={e => setChest(e.target.value)} placeholder="38" /></div>
                  <div><Label className="text-xs">Waist</Label><Input value={waist} onChange={e => setWaist(e.target.value)} placeholder="32" /></div>
                  <div><Label className="text-xs">Hip</Label><Input value={hip} onChange={e => setHip(e.target.value)} placeholder="40" /></div>
                  <div><Label className="text-xs">Length</Label><Input value={length} onChange={e => setLength(e.target.value)} placeholder="42" /></div>
                  <div className="col-span-2"><Label className="text-xs">Sleeve Length</Label><Input value={sleeveLength} onChange={e => setSleeveLength(e.target.value)} placeholder="24" /></div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fit preference</Label>
              <RadioGroup value={fitPreference} onValueChange={setFitPreference} className="flex gap-3">
                {FIT_TYPES.map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <RadioGroupItem value={f} id={`fit-${f}`} />
                    <Label htmlFor={`fit-${f}`} className="text-sm">{f}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Specific fit notes (optional)</Label>
              <Input value={fitNotes} onChange={e => setFitNotes(e.target.value)} placeholder="E.g., slightly loose around arms" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={nextStep} className="flex-1">Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* Step 4: Your Details */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">Your Details</h2>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">WhatsApp Number * (10 digits)</Label>
              <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" inputMode="numeric" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Email (optional)</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Delivery City *</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai, Delhi, Jaipur..." />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Estimated timeline</Label>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map(t => (
                  <button key={t} onClick={() => setTimeline(t)}
                    className={`text-sm px-4 py-2 rounded-xl border transition-colors ${timeline === t ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-foreground hover:border-primary/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Order Value (min ₹1,000) *</Label>
              <Input type="number" min={1000} value={orderValue} onChange={e => setOrderValue(Number(e.target.value))} inputMode="numeric" />
            </div>

            <div className="bg-accent/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order Value</span><span className="text-foreground">₹{orderValue.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping Fee</span><span className="text-foreground">₹{shippingFee}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee</span><span className="text-foreground text-green-600">₹0 (Free!)</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Anything else you want the artisan to know?</Label>
              <Textarea value={specialNote} onChange={e => setSpecialNote(e.target.value)} placeholder="Reference images, colour codes, special instructions..." rows={3} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={nextStep} className="flex-1">Review Order <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Confirm */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">Review & Confirm</h2>

            <div className="bg-accent/30 rounded-xl p-4 space-y-3 text-sm">
              <div><span className="text-muted-foreground">Item:</span> <span className="text-foreground font-medium">{itemType}</span></div>
              <div><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{description}</span></div>
              {fabric && <div><span className="text-muted-foreground">Fabric:</span> <span className="text-foreground">{fabric}</span></div>}
              <div><span className="text-muted-foreground">Stitching:</span> <span className="text-foreground">{stitchingType}</span></div>
              <div><span className="text-muted-foreground">Embroidery:</span> <span className="text-foreground">{embroideryType}</span></div>
              <div><span className="text-muted-foreground">Size:</span> <span className="text-foreground">{size}</span></div>
              {size === "Custom measurements" && <div><span className="text-muted-foreground">Measurements:</span> <span className="text-foreground">Chest: {chest}, Waist: {waist}, Hip: {hip}, Length: {length}, Sleeve: {sleeveLength}</span></div>}
              <div><span className="text-muted-foreground">Fit:</span> <span className="text-foreground">{fitPreference}</span></div>
              <hr className="border-border" />
              <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground font-medium">{fullName}</span></div>
              <div><span className="text-muted-foreground">WhatsApp:</span> <span className="text-foreground">{whatsapp}</span></div>
              {email && <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{email}</span></div>}
              <div><span className="text-muted-foreground">City:</span> <span className="text-foreground">{city}</span></div>
              <div><span className="text-muted-foreground">Timeline:</span> <span className="text-foreground">{timeline}</span></div>
              <hr className="border-border" />
              <div className="flex justify-between font-bold"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              {specialNote && <div><span className="text-muted-foreground">Note:</span> <span className="text-foreground">{specialNote}</span></div>}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm space-y-2 text-amber-900">
              <p className="font-semibold">By placing this order you agree that:</p>
              <p className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" /> Payment is prepaid</p>
              <p className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" /> Order is non-cancellable after artisan accepts</p>
              <p className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" /> Artisan will share work-start video within 24 hours</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1"><ArrowLeft className="w-4 h-4 mr-1" /> Edit Order</Button>
              <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-4 h-4 mr-1" /> Confirm & Send
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default OrderPage;
