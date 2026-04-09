import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
  "Sherwani", "Kurta Pajama", "Kids Wear", "Other"
];
const FABRIC_OPTIONS = ["Cotton", "Silk", "Georgette", "Chiffon", "Linen", "I need suggestions", "Other"];
const STITCHING_TYPES = ["Regular", "Premium", "Handwork"];
const EMBROIDERY_TYPES = ["Phulkari", "Kantha", "Zardozi", "Chikankari", "Mirror Work", "No Embroidery", "Other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom Measurements"];
const FIT_TYPES = ["Regular Fit", "Slim Fit", "Loose/Comfort Fit"];
const TIMELINES = ["1 Week", "2 Weeks", "1 Month", "Flexible"];

const OrderPage = () => {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Step 1
  const [itemType, setItemType] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [customFabric, setCustomFabric] = useState("");
  const [stitchingType, setStitchingType] = useState("Regular");
  const [embroideryType, setEmbroideryType] = useState("No Embroidery");
  const [customEmbroidery, setCustomEmbroidery] = useState("");

  // Step 2
  const [size, setSize] = useState("M");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [length, setLength] = useState("");
  const [sleeveLength, setSleeveLength] = useState("");
  const [fitPreference, setFitPreference] = useState("Regular Fit");
  const [fitNotes, setFitNotes] = useState("");

  // Step 3
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [timeline, setTimeline] = useState("2 Weeks");
  const [orderValue, setOrderValue] = useState(1000);

  // Step 4
  const [specialNote, setSpecialNote] = useState("");

  const shippingFee = 100;

  const platformFee = useMemo(() => {
    const totalOrders = artisan?.total_orders ?? 0;
    if (totalOrders <= 2) return 0;
    if (totalOrders <= 5) return Math.round(orderValue * 0.05);
    return Math.round(orderValue * 0.10);
  }, [artisan?.total_orders, orderValue]);

  const total = orderValue + platformFee + shippingFee;

  const platformFeeLabel = useMemo(() => {
    const totalOrders = artisan?.total_orders ?? 0;
    if (totalOrders <= 2) return "₹0 🎉 (First 2 orders free)";
    if (totalOrders <= 5) return `5% = ₹${platformFee.toLocaleString("en-IN")}`;
    return `10% = ₹${platformFee.toLocaleString("en-IN")}`;
  }, [artisan?.total_orders, platformFee]);

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

  const resolvedItem = itemType === "Other" ? customItem : itemType;
  const resolvedFabric = fabric === "Other" ? customFabric : fabric;
  const resolvedEmbroidery = embroideryType === "Other" ? customEmbroidery : embroideryType;

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!itemType) { toast({ title: "Please select an item type", variant: "destructive" }); return false; }
      if (itemType === "Other" && !customItem.trim()) { toast({ title: "Please describe the item", variant: "destructive" }); return false; }
      if (!description.trim()) { toast({ title: "Please describe your requirement", variant: "destructive" }); return false; }
    }
    if (s === 2) {
      if (size === "Custom Measurements" && !chest && !waist) {
        toast({ title: "Please enter at least chest or waist measurement", variant: "destructive" }); return false;
      }
    }
    if (s === 3) {
      if (!fullName.trim()) { toast({ title: "Please enter your name", variant: "destructive" }); return false; }
      if (!/^\d{10}$/.test(whatsapp)) { toast({ title: "Enter a valid 10-digit WhatsApp number", variant: "destructive" }); return false; }
      if (!city.trim()) { toast({ title: "Please enter your city", variant: "destructive" }); return false; }
      if (!deliveryState.trim()) { toast({ title: "Please enter your state", variant: "destructive" }); return false; }
      if (orderValue < 1000) { toast({ title: "Minimum order value is ₹1,000", variant: "destructive" }); return false; }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const measurements = size === "Custom Measurements"
    ? `Chest: ${chest}, Waist: ${waist}, Hip: ${hip}, Length: ${length}, Sleeve: ${sleeveLength}`
    : size;

  const handleConfirm = async () => {
    const cleanNum = artisan?.whatsapp_number?.replace(/\D/g, "").replace(/^91/, "") || "";

    const { data, error } = await supabase.from("orders").insert({
      artisan_id: artisanId,
      customer_name: fullName,
      customer_whatsapp: whatsapp,
      customer_email: email || null,
      delivery_city: city,
      item_type: resolvedItem,
      description,
      fabric_preference: resolvedFabric || null,
      stitching_type: stitchingType,
      embroidery_type: resolvedEmbroidery,
      size,
      measurements: size === "Custom Measurements" ? measurements : null,
      fit_preference: fitPreference,
      fit_notes: fitNotes || null,
      timeline,
      order_value: orderValue,
      shipping_fee: shippingFee,
      platform_fee: platformFee,
      total,
      special_note: specialNote || null,
      status: "pending",
    }).select("id").single();

    if (error) {
      toast({ title: "Failed to place order. Please try again.", variant: "destructive" });
      return;
    }

    const msg = `🧵 *New Order — EmbroideryVerse*

*Customer:* ${fullName}
*Item:* ${resolvedItem}
*Description:* ${description}
*Size:* ${measurements}
*Fit:* ${fitPreference}
*Embroidery:* ${resolvedEmbroidery}
*Timeline:* ${timeline}
*City:* ${city}
*Order Value:* ₹${orderValue.toLocaleString("en-IN")}
*Platform Fee:* ₹${platformFee.toLocaleString("en-IN")}
*Shipping:* ₹100
*Total:* ₹${total.toLocaleString("en-IN")}
*Special Note:* ${specialNote || "—"}

Please confirm if you can accept this order.`;

    window.open(`https://wa.me/91${cleanNum}?text=${encodeURIComponent(msg)}`, "_blank");

    toast({ title: "🎉 Order sent!", description: "The artisan will confirm on WhatsApp." });
    if (data?.id) {
      navigate(`/order-status/${data.id}`);
    } else {
      navigate("/artisans");
    }
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
            <p className="text-xs text-muted-foreground mb-1">Step {step} of 4</p>
            <Progress value={step * 25} className="h-2" />
          </div>
        </div>

        {/* STEP 1 — What do you need? */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">What do you need?</h2>

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
              {itemType === "Other" && (
                <Input value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Describe the item" className="mt-2" required />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Describe your requirement *</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe exactly what you want made..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fabric preference (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {FABRIC_OPTIONS.map(f => (
                  <button key={f} onClick={() => setFabric(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${fabric === f ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {f}
                  </button>
                ))}
              </div>
              {fabric === "Other" && (
                <Input value={customFabric} onChange={e => setCustomFabric(e.target.value)} placeholder="Specify fabric" className="mt-2" />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Embroidery type</Label>
              <div className="flex flex-wrap gap-2">
                {EMBROIDERY_TYPES.map(t => (
                  <button key={t} onClick={() => setEmbroideryType(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${embroideryType === t ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
              {embroideryType === "Other" && (
                <Input value={customEmbroidery} onChange={e => setCustomEmbroidery(e.target.value)} placeholder="Specify embroidery type" className="mt-2" />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Stitching quality</Label>
              <RadioGroup value={stitchingType} onValueChange={setStitchingType} className="flex gap-3">
                {STITCHING_TYPES.map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <RadioGroupItem value={t} id={`stitch-${t}`} />
                    <Label htmlFor={`stitch-${t}`} className="text-sm">{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button onClick={nextStep} className="w-full" size="lg">
              Next — Size & Fit <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2 — Size & Fit */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">Size & Fit</h2>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Standard Size</Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`text-sm px-4 py-2 rounded-xl border transition-colors ${size === s ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-foreground hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {size === "Custom Measurements" && (
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
              <RadioGroup value={fitPreference} onValueChange={setFitPreference} className="flex flex-wrap gap-3">
                {FIT_TYPES.map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <RadioGroupItem value={f} id={`fit-${f}`} />
                    <Label htmlFor={`fit-${f}`} className="text-sm">{f}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Additional fit notes (optional)</Label>
              <Input value={fitNotes} onChange={e => setFitNotes(e.target.value)} placeholder="E.g., slightly loose around arms" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={nextStep} className="flex-1">Next — Your Details <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* STEP 3 — Your Details & Timeline */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">Your Details & Timeline</h2>

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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Delivery City *</Label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Delivery State *</Label>
                <Input value={deliveryState} onChange={e => setDeliveryState(e.target.value)} placeholder="Maharashtra" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Timeline needed</Label>
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
              <Label className="text-sm font-medium">Order Value *</Label>
              <Input type="number" min={1000} value={orderValue} onChange={e => setOrderValue(Number(e.target.value))} inputMode="numeric" />
              <p className="text-xs text-muted-foreground">Minimum order value is ₹1,000</p>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-accent/30 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground mb-2">Fee Breakdown</p>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order Value</span><span className="text-foreground">₹{orderValue.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee</span><span className={`text-foreground ${platformFee === 0 ? "text-green-600" : ""}`}>{platformFeeLabel}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping Fee</span><span className="text-foreground">₹{shippingFee}</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={nextStep} className="flex-1">Review Order <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* STEP 4 — Review & Special Note */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-foreground">Review & Special Note</h2>

            <div className="bg-accent/30 rounded-xl p-4 space-y-3 text-sm">
              <div><span className="text-muted-foreground">Item:</span> <span className="text-foreground font-medium">{resolvedItem}</span></div>
              <div><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{description}</span></div>
              {resolvedFabric && <div><span className="text-muted-foreground">Fabric:</span> <span className="text-foreground">{resolvedFabric}</span></div>}
              <div><span className="text-muted-foreground">Stitching:</span> <span className="text-foreground">{stitchingType}</span></div>
              <div><span className="text-muted-foreground">Embroidery:</span> <span className="text-foreground">{resolvedEmbroidery}</span></div>
              <div><span className="text-muted-foreground">Size:</span> <span className="text-foreground">{size}</span></div>
              {size === "Custom Measurements" && <div><span className="text-muted-foreground">Measurements:</span> <span className="text-foreground">{measurements}</span></div>}
              <div><span className="text-muted-foreground">Fit:</span> <span className="text-foreground">{fitPreference}</span></div>
              <hr className="border-border" />
              <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground font-medium">{fullName}</span></div>
              <div><span className="text-muted-foreground">WhatsApp:</span> <span className="text-foreground">{whatsapp}</span></div>
              {email && <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{email}</span></div>}
              <div><span className="text-muted-foreground">City:</span> <span className="text-foreground">{city}, {deliveryState}</span></div>
              <div><span className="text-muted-foreground">Timeline:</span> <span className="text-foreground">{timeline}</span></div>
              <hr className="border-border" />
              <div className="flex justify-between"><span className="text-muted-foreground">Order Value</span><span>₹{orderValue.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Platform Fee</span><span>{platformFeeLabel}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>₹100</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Any special instruction for the artisan?</Label>
              <Textarea
                value={specialNote}
                onChange={e => { if (e.target.value.length <= 300) setSpecialNote(e.target.value); }}
                placeholder="e.g. I prefer darker shade of blue, please add pocket on left side..."
                rows={3}
                maxLength={300}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{specialNote.length}/300</span>
                <span>This is your ONE chance to add special instructions. Choose your words carefully.</span>
              </div>
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
                Confirm Order & Proceed <ArrowRight className="w-4 h-4 ml-1" />
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
