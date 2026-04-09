import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, CheckCircle2, Star, Gauge, ArrowLeft,
  MessageCircle, Upload, AlertTriangle, Edit2, Save, X, LogOut,
  Clock, Camera, Ban
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

/* ─── Countdown helper ─── */
const getHoursSince = (dateStr: string | null): number => {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
};

const DECLINE_REASONS = [
  "Too busy currently",
  "Skill mismatch",
  "Outside my price range",
  "Other",
];

/* ─── Main Dashboard ─── */
const ArtisanDashboard = () => {
  const [artisan, setArtisan] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [tab, setTab] = useState<"orders" | "completed" | "profile">("orders");
  const [decliningOrderId, setDecliningOrderId] = useState<string | null>(null);
  const [milestoneOrderId, setMilestoneOrderId] = useState<string | null>(null);
  const [milestoneText, setMilestoneText] = useState("");
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

  const refreshArtisan = async () => {
    if (!artisan) return;
    const { data } = await supabase.from("artisans").select("*").eq("id", artisan.id).single();
    if (data) setArtisan(data);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, extra: Record<string, any> = {}) => {
    await supabase.from("orders").update({ status: newStatus, ...extra }).eq("id", orderId);
    if (artisan) {
      fetchOrders(artisan.id);
      refreshArtisan();
    }
    toast({ title: `Order ${newStatus.replace(/_/g, " ")}` });
  };

  const sendWhatsApp = (customerPhone: string, message: string) => {
    const clean = customerPhone.replace(/\D/g, "").replace(/^91/, "");
    window.open(`https://wa.me/91${clean}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleAccept = async (order: any) => {
    // Update order status + accepted_at
    await supabase.from("orders").update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    }).eq("id", order.id);

    // Increment active_orders
    await supabase.from("artisans").update({
      active_orders: (artisan.active_orders || 0) + 1,
    }).eq("id", artisan.id);

    fetchOrders(artisan.id);
    refreshArtisan();
    toast({ title: "Order accepted ✅" });

    sendWhatsApp(
      order.customer_whatsapp,
      `Namaste ${order.customer_name}! 🙏 Your order has been accepted on EmbroideryVerse. I will share a work-start video within 24 hours. — ${artisan.name}`
    );
  };

  const handleDecline = async (orderId: string, reason: string) => {
    await supabase.from("orders").update({
      status: "declined",
      decline_reason: reason,
    }).eq("id", orderId);

    fetchOrders(artisan.id);
    setDecliningOrderId(null);
    toast({ title: "Order declined" });
  };

  const handleVideoUpload = async (orderId: string, file: File, field: "work_start_video_url" | "completion_video_url", nextStatus: string, order: any) => {
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

    if (field === "work_start_video_url") {
      await updateOrderStatus(orderId, nextStatus, { [field]: urlData.publicUrl });
      sendWhatsApp(
        order.customer_whatsapp,
        `Hi ${order.customer_name}! Work on your order has started. You can track progress at: haath-se-kraft.lovable.app/order-status/${orderId}`
      );
    } else {
      // Completion
      await supabase.from("orders").update({
        status: "completed",
        completion_video_url: urlData.publicUrl,
      }).eq("id", orderId);

      // Decrement active_orders, increment total_orders
      await supabase.from("artisans").update({
        active_orders: Math.max((artisan.active_orders || 1) - 1, 0),
        total_orders: (artisan.total_orders || 0) + 1,
      }).eq("id", artisan.id);

      fetchOrders(artisan.id);
      refreshArtisan();
      toast({ title: "Order completed! 🎉" });

      sendWhatsApp(
        order.customer_whatsapp,
        `Your order is complete! 🎉 Here's your completion video. We'll arrange delivery soon.\nOrder status: haath-se-kraft.lovable.app/order-status/${orderId}`
      );
    }

    setLoading(false);
  };

  const handleMilestone = async (orderId: string) => {
    if (!milestoneText.trim()) return;
    await supabase.from("order_milestones").insert({
      order_id: orderId,
      artisan_id: artisan.id,
      message: milestoneText,
    });
    setMilestoneText("");
    setMilestoneOrderId(null);
    toast({ title: "Progress update shared! 📸" });
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

  const activeCount = orders.filter(o => ["accepted", "work_started", "in_progress"].includes(o.status)).length;
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const atCapacity = activeCount >= orderCap;
  const almostAtCapacity = activeCount === orderCap - 1;

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

        {/* Capacity warnings */}
        {atCapacity && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl flex items-start gap-2 text-sm text-red-800">
            <Ban className="w-5 h-5 shrink-0 mt-0.5" />
            <p>🚫 <strong>Order Cap Reached</strong> — You cannot accept new orders. Complete existing orders to accept more.</p>
          </div>
        )}
        {!atCapacity && almostAtCapacity && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>⚠️ Almost at capacity. <strong>1 slot remaining.</strong></p>
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
            <p className="text-2xl font-bold text-foreground">{artisan.total_orders || 0}</p>
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
              {t === "orders" ? `Active (${orders.length})` : t === "completed" ? `Done (${completedOrders.length})` : "Profile"}
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
            {orders.map(order => {
              const hoursSinceAccepted = getHoursSince(order.accepted_at);
              const isOverdue = order.status === "accepted" && hoursSinceAccepted > 24;
              const isWarning = order.status === "accepted" && hoursSinceAccepted > 12 && hoursSinceAccepted <= 24;

              return (
                <div key={order.id} className={`bg-background border rounded-xl p-4 space-y-3 ${isOverdue ? "border-red-300" : "border-border"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{order.customer_name}</p>
                      <a href={`https://wa.me/91${order.customer_whatsapp?.replace(/\D/g, "").replace(/^91/, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {order.customer_whatsapp}
                      </a>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Structured job card details */}
                  <div className="text-sm space-y-1 bg-accent/20 rounded-lg p-3">
                    <p><span className="text-muted-foreground">Item:</span> <span className="text-foreground font-medium">{order.item_type}</span></p>
                    <p className="text-muted-foreground">{order.description}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                      {order.size && <p><span className="text-muted-foreground">Size:</span> <span className="text-foreground">{order.size}</span></p>}
                      {order.fit_preference && <p><span className="text-muted-foreground">Fit:</span> <span className="text-foreground">{order.fit_preference}</span></p>}
                      {order.embroidery_type && <p><span className="text-muted-foreground">Embroidery:</span> <span className="text-foreground">{order.embroidery_type}</span></p>}
                      {order.timeline && <p><span className="text-muted-foreground">Timeline:</span> <span className="text-foreground">{order.timeline}</span></p>}
                      {order.delivery_city && <p><span className="text-muted-foreground">City:</span> <span className="text-foreground">{order.delivery_city}</span></p>}
                    </div>
                    <p className="pt-1"><span className="text-muted-foreground">Value:</span> <span className="font-bold text-foreground">₹{order.order_value?.toLocaleString("en-IN")}</span></p>
                  </div>

                  {/* Accepted countdown */}
                  {order.status === "accepted" && (
                    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${isOverdue ? "bg-red-50 text-red-700" : isWarning ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {isOverdue
                        ? `⚠️ Overdue! ${hoursSinceAccepted}h since accepted — upload work-start video NOW`
                        : isWarning
                          ? `⚠️ ${24 - hoursSinceAccepted}h remaining to upload work-start video`
                          : `${24 - hoursSinceAccepted}h remaining to upload work-start video`
                      }
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-2 pt-1">
                    {order.status === "pending" && (
                      <>
                        {decliningOrderId === order.id ? (
                          <div className="space-y-2 bg-red-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-red-800">Select a reason:</p>
                            {DECLINE_REASONS.map(reason => (
                              <button key={reason} onClick={() => handleDecline(order.id, reason)}
                                className="block w-full text-left text-sm px-3 py-2 rounded-lg border border-red-200 bg-background text-foreground hover:bg-red-50 transition-colors">
                                {reason}
                              </button>
                            ))}
                            <Button variant="ghost" size="sm" onClick={() => setDecliningOrderId(null)} className="w-full">Cancel</Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAccept(order)} disabled={atCapacity}>
                              ✅ Accept Order
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50" onClick={() => setDecliningOrderId(order.id)}>
                              ❌ Decline
                            </Button>
                          </div>
                        )}
                        {atCapacity && (
                          <p className="text-xs text-red-600 text-center">Cannot accept — order cap reached</p>
                        )}
                      </>
                    )}

                    {order.status === "accepted" && (
                      <label className="block">
                        <input type="file" accept="video/*" className="hidden" disabled={loading}
                          onChange={e => e.target.files?.[0] && handleVideoUpload(order.id, e.target.files[0], "work_start_video_url", "work_started", order)} />
                        <div className="flex items-center justify-center gap-2 text-sm font-medium px-3 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" /> 📹 Upload Work-Start Video (Required)
                        </div>
                      </label>
                    )}

                    {order.status === "work_started" && (
                      <div className="space-y-2">
                        {/* Milestone update */}
                        {milestoneOrderId === order.id ? (
                          <div className="space-y-2 bg-accent/30 rounded-lg p-3">
                            <Textarea
                              value={milestoneText}
                              onChange={e => setMilestoneText(e.target.value)}
                              placeholder="Share a progress update..."
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleMilestone(order.id)} className="flex-1">Send Update</Button>
                              <Button size="sm" variant="ghost" onClick={() => { setMilestoneOrderId(null); setMilestoneText(""); }}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="w-full" onClick={() => setMilestoneOrderId(order.id)}>
                            <Camera className="w-4 h-4 mr-1" /> 📸 Share Progress Update
                          </Button>
                        )}

                        {/* Completion */}
                        <label className="block">
                          <input type="file" accept="video/*" className="hidden" disabled={loading}
                            onChange={e => e.target.files?.[0] && handleVideoUpload(order.id, e.target.files[0], "completion_video_url", "completed", order)} />
                          <div className="flex items-center justify-center gap-2 text-sm font-medium px-3 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-colors">
                            <CheckCircle2 className="w-4 h-4" /> ✅ Mark as Completed (Upload Video)
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                <div className="flex gap-2">
                  {order.work_start_video_url && (
                    <a href={order.work_start_video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Work-start video</a>
                  )}
                  {order.completion_video_url && (
                    <a href={order.completion_video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">Completion video</a>
                  )}
                </div>
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
