import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, CheckCircle2, Star, Gauge, ArrowLeft,
  MessageCircle, Upload, AlertTriangle, Edit2, Save, X, LogOut
} from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ─── Login Screen ─── */
const ArtisanLogin = ({ onLogin }: { onLogin: (artisan: any) => void }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const clean = phone.replace(/\D/g, "").replace(/^91/, "");
    if (clean.length !== 10) { setError("Enter a valid 10-digit WhatsApp number"); return; }
    setLoading(true);
    setError("");

    const { data, error: err } = await supabase
      .from("artisans")
      .select("*")
      .or(`whatsapp_number.eq.${clean},whatsapp_number.eq.91${clean},whatsapp_number.eq.+91${clean}`)
      .eq("status", "approved")
      .maybeSingle();

    if (err || !data) {
      // Try broader match
      const { data: d2 } = await supabase
        .from("artisans")
        .select("*")
        .ilike("whatsapp_number", `%${clean}`)
        .eq("status", "approved")
        .maybeSingle();

      if (d2) { onLogin(d2); }
      else { setError("Not found or not approved yet. Register first!"); }
    } else {
      onLogin(data);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <p className="text-5xl">🧵</p>
            <h1 className="font-heading text-2xl font-bold text-foreground">Artisan Dashboard</h1>
            <p className="text-sm text-muted-foreground">Login with your registered WhatsApp number</p>
          </div>
          <div className="space-y-3">
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter 10-digit WhatsApp number"
              inputMode="numeric"
              className="text-center text-lg tracking-wider"
            />
            {error && (
              <div className="text-sm text-destructive text-center space-y-2">
                <p>{error}</p>
                {error.includes("Register") && (
                  <Button variant="outline" size="sm" onClick={() => navigate("/register-artisan")}>
                    Register Now →
                  </Button>
                )}
              </div>
            )}
            <Button onClick={handleLogin} disabled={loading || phone.length < 10} className="w-full" size="lg">
              {loading ? "Checking..." : "Login →"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

/* ─── Status badge ─── */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-blue-100 text-blue-800",
    work_started: "bg-purple-100 text-purple-800",
    in_progress: "bg-indigo-100 text-indigo-800",
    completed: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    delivered: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
    </span>
  );
};

/* ─── Main Dashboard ─── */
const ArtisanDashboard = () => {
  const [artisan, setArtisan] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [tab, setTab] = useState<"orders" | "completed" | "profile">("orders");
  const { toast } = useToast();
  const navigate = useNavigate();

  const orderCap = artisan?.order_cap || 5;
  const trustScore = artisan?.trust_score || 0;
  const activeStatuses = ["pending", "accepted", "work_started", "in_progress"];

  const fetchOrders = useCallback(async (artisanId: string) => {
    const { data: active } = await supabase
      .from("orders")
      .select("*")
      .eq("artisan_id", artisanId)
      .in("status", activeStatuses)
      .order("created_at", { ascending: false });

    const { data: done } = await supabase
      .from("orders")
      .select("*")
      .eq("artisan_id", artisanId)
      .in("status", ["completed", "delivered"])
      .order("created_at", { ascending: false });

    setOrders(active || []);
    setCompletedOrders(done || []);
  }, []);

  const handleLogin = (a: any) => {
    setArtisan(a);
    setEditData({ name: a.name, bio: a.bio || "", skill_type: a.skill_type || "", price_min: a.price_min || 0, price_max: a.price_max || 0 });
    fetchOrders(a.id);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, extra: Record<string, any> = {}) => {
    await supabase.from("orders").update({ status: newStatus, ...extra }).eq("id", orderId);
    if (artisan) fetchOrders(artisan.id);
    toast({ title: `Order ${newStatus.replace(/_/g, " ")}` });
  };

  const sendWhatsApp = (customerPhone: string, message: string) => {
    const clean = customerPhone.replace(/\D/g, "").replace(/^91/, "");
    window.open(`https://wa.me/91${clean}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleAccept = (order: any) => {
    updateOrderStatus(order.id, "accepted");
    sendWhatsApp(
      order.customer_whatsapp,
      `Hi ${order.customer_name}! Your order on EmbroideryVerse has been accepted. I will share work-start video within 24 hours. — ${artisan.name}`
    );
  };

  const handleVideoUpload = async (orderId: string, file: File, field: "work_start_video_url" | "completion_video_url", nextStatus: string) => {
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large. Max 50MB", variant: "destructive" });
      return;
    }
    setLoading(true);
    const path = `${artisan.id}/${orderId}/${field}_${Date.now()}.${file.name.split(".").pop()}`;
    const { error: upErr } = await supabase.storage.from("order-videos").upload(path, file);

    if (upErr) {
      toast({ title: "Upload failed: " + upErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("order-videos").getPublicUrl(path);
    await updateOrderStatus(orderId, nextStatus, { [field]: urlData.publicUrl });
    setLoading(false);
    toast({ title: "Video uploaded!" });
  };

  const handleSaveProfile = async () => {
    await supabase.from("artisans").update(editData).eq("id", artisan.id);
    setArtisan({ ...artisan, ...editData });
    setEditing(false);
    toast({ title: "Profile updated!" });
  };

  const logout = () => {
    setArtisan(null);
    setOrders([]);
    setCompletedOrders([]);
  };

  if (!artisan) return <ArtisanLogin onLogin={handleLogin} />;

  const activeCount = orders.filter(o => activeStatuses.includes(o.status)).length;
  const atCapacity = activeCount >= orderCap;

  return (
    <Layout>
      <div className="pb-24 max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={artisan.profile_photo_url || "/placeholder.svg"} alt={artisan.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
            <div>
              <p className="font-heading font-bold text-foreground">{artisan.name}</p>
              <p className="text-xs text-muted-foreground">{artisan.city}, {artisan.state}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}><LogOut className="w-5 h-5" /></Button>
        </div>

        {/* Capacity warning */}
        {atCapacity && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>⚠️ You have reached your order capacity. New orders cannot be accepted until you complete existing ones.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-accent/40 rounded-xl p-4 text-center">
            <ShoppingBag className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active Orders</p>
          </div>
          <div className="bg-accent/40 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-2xl font-bold text-foreground">{completedOrders.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-accent/40 rounded-xl p-4 text-center">
            <Star className="w-5 h-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold text-foreground">{trustScore}/5 ⭐</p>
            <p className="text-xs text-muted-foreground">Trust Score</p>
          </div>
          <div className="bg-accent/40 rounded-xl p-4 text-center">
            <Gauge className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">{activeCount}/{orderCap}</p>
            <p className="text-xs text-muted-foreground">Capacity</p>
            <Progress value={(activeCount / orderCap) * 100} className="h-1.5 mt-2" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
          {(["orders", "completed", "profile"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t === "orders" ? `Active (${activeCount})` : t === "completed" ? `Done (${completedOrders.length})` : "Profile"}
            </button>
          ))}
        </div>

        {/* Active Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <p className="text-4xl">📭</p>
                <p className="text-muted-foreground">No active orders right now</p>
              </div>
            )}
            {orders.map(order => (
              <div key={order.id} className="bg-background border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{order.customer_name}</p>
                    <a href={`https://wa.me/91${order.customer_whatsapp?.replace(/\D/g, "").replace(/^91/, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {order.customer_whatsapp}
                    </a>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Item:</span> <span className="text-foreground">{order.item_type}</span></p>
                  <p className="text-muted-foreground line-clamp-2">{order.description}</p>
                  <div className="flex gap-4">
                    <p><span className="text-muted-foreground">Value:</span> <span className="font-medium text-foreground">₹{order.order_value?.toLocaleString("en-IN")}</span></p>
                    <p><span className="text-muted-foreground">Timeline:</span> <span className="text-foreground">{order.timeline}</span></p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  {order.status === "pending" && (
                    <>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAccept(order)} disabled={atCapacity}>
                        Accept ✓
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => updateOrderStatus(order.id, "declined")}>
                        Decline
                      </Button>
                    </>
                  )}
                  {order.status === "accepted" && (
                    <label className="flex-1">
                      <input type="file" accept="video/*" className="hidden" disabled={loading}
                        onChange={e => e.target.files?.[0] && handleVideoUpload(order.id, e.target.files[0], "work_start_video_url", "work_started")} />
                      <div className="flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" /> Upload Work-Start Video 📹
                      </div>
                    </label>
                  )}
                  {order.status === "work_started" && (
                    <label className="flex-1">
                      <input type="file" accept="video/*" className="hidden" disabled={loading}
                        onChange={e => e.target.files?.[0] && handleVideoUpload(order.id, e.target.files[0], "completion_video_url", "completed")} />
                      <div className="flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> Mark Completed ✓
                      </div>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Orders Tab */}
        {tab === "completed" && (
          <div className="space-y-4">
            {completedOrders.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <p className="text-4xl">🏆</p>
                <p className="text-muted-foreground">No completed orders yet</p>
              </div>
            )}
            {completedOrders.map(order => (
              <div key={order.id} className="bg-background border border-border rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.item_type}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm font-medium text-foreground">₹{order.order_value?.toLocaleString("en-IN")}</p>
                {order.completion_video_url && (
                  <a href={order.completion_video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">View completion video</a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Your Profile</h2>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Edit2 className="w-4 h-4 mr-1" /> Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveProfile}><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setEditData({ name: artisan.name, bio: artisan.bio || "", skill_type: artisan.skill_type || "", price_min: artisan.price_min || 0, price_max: artisan.price_max || 0 }); }}><X className="w-4 h-4" /></Button>
                </div>
              )}
            </div>

            <div className="bg-background border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-4">
                <img src={artisan.profile_photo_url || "/placeholder.svg"} alt={artisan.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                <div className="flex-1">
                  {editing ? (
                    <Input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                  ) : (
                    <p className="font-bold text-foreground text-lg">{artisan.name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{artisan.city}, {artisan.state}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Skill Type</label>
                  {editing ? (
                    <Input value={editData.skill_type} onChange={e => setEditData({ ...editData, skill_type: e.target.value })} />
                  ) : (
                    <p className="text-sm text-foreground">{artisan.skill_type}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Bio</label>
                  {editing ? (
                    <Textarea value={editData.bio} onChange={e => setEditData({ ...editData, bio: e.target.value })} rows={3} />
                  ) : (
                    <p className="text-sm text-foreground">{artisan.bio || "No bio yet"}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Price Min (₹)</label>
                    {editing ? (
                      <Input type="number" value={editData.price_min} onChange={e => setEditData({ ...editData, price_min: Number(e.target.value) })} />
                    ) : (
                      <p className="text-sm text-foreground">₹{artisan.price_min}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Price Max (₹)</label>
                    {editing ? (
                      <Input type="number" value={editData.price_max} onChange={e => setEditData({ ...editData, price_max: Number(e.target.value) })} />
                    ) : (
                      <p className="text-sm text-foreground">₹{artisan.price_max}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default ArtisanDashboard;
