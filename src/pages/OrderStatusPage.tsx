import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, Star, AlertCircle, Play } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "accepted", label: "Accepted by Artisan" },
  { key: "work_started", label: "Work Started" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "delivered", label: "Delivered" },
  { key: "reviewed", label: "Reviewed" },
];

const statusToStep: Record<string, number> = {
  pending: 0,
  accepted: 1,
  work_started: 2,
  in_progress: 3,
  completed: 4,
  delivered: 5,
  reviewed: 6,
};

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [artisan, setArtisan] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: o } = await supabase.from("orders").select("*").eq("id", orderId).single();
      if (o) {
        setOrder(o);
        const { data: a } = await supabase.from("artisans").select("*").eq("id", o.artisan_id).single();
        if (a) setArtisan(a);

        const { data: m } = await supabase
          .from("order_milestones")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: true });
        setMilestones(m || []);
      }
      setLoading(false);
    };
    fetch();
  }, [orderId]);

  if (loading) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div></Layout>;
  }

  if (!order) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <p className="text-4xl">🔍</p>
          <p className="text-muted-foreground text-lg">Order not found</p>
          <Button variant="outline" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4 mr-2" /> Go Home</Button>
        </div>
      </Layout>
    );
  }

  const currentStep = statusToStep[order.status] ?? 0;
  const showReviewBanner = order.status === "completed" || order.status === "delivered";
  const artisanCleanPhone = artisan?.whatsapp_number?.replace(/\D/g, "").replace(/^91/, "") || "";

  return (
    <Layout>
      <div className="pb-24 max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="py-6">
          <button onClick={() => navigate(-1)} className="text-sm text-primary flex items-center gap-1 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="font-heading text-2xl font-bold text-foreground">Order Status</h1>
          <p className="text-xs text-muted-foreground mt-1">Order #{orderId?.slice(0, 8)}</p>
        </div>

        {/* Review Banner */}
        {showReviewBanner && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-3">
            <p className="text-lg">⭐ How was your experience?</p>
            <Button
              onClick={() => navigate(`/review/${orderId}`)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8"
              size="lg"
            >
              Leave a Review
            </Button>
          </div>
        )}

        {/* Visual Timeline */}
        <div className="space-y-0 mb-8">
          {STEPS.map((step, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            const isFuture = i > currentStep;

            return (
              <div key={step.key} className="flex gap-4">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-amber-400 text-white animate-pulse" : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? "✅" : isCurrent ? "🟠" : "⭕"}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 ${isCompleted ? "bg-green-400" : "bg-muted"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isFuture ? "text-muted-foreground" : "text-foreground"}`}>
                    {step.label}
                  </p>

                  {/* Placed date */}
                  {step.key === "placed" && order.created_at && (
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  )}

                  {/* Accepted date */}
                  {step.key === "accepted" && order.accepted_at && (
                    <p className="text-xs text-muted-foreground">{new Date(order.accepted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  )}

                  {/* Work start video */}
                  {step.key === "work_started" && order.work_start_video_url && (isCompleted || isCurrent) && (
                    <a href={order.work_start_video_url} target="_blank" rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                      <Play className="w-3 h-3" /> ▶️ Watch work-start video
                    </a>
                  )}

                  {/* Milestones */}
                  {step.key === "in_progress" && milestones.length > 0 && (isCompleted || isCurrent) && (
                    <div className="mt-2 space-y-1">
                      {milestones.map(m => (
                        <div key={m.id} className="text-xs bg-accent/30 rounded-lg px-3 py-2">
                          <p className="text-foreground">{m.message}</p>
                          <p className="text-muted-foreground mt-0.5">{new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Completion video */}
                  {step.key === "completed" && order.completion_video_url && (isCompleted || isCurrent) && (
                    <a href={order.completion_video_url} target="_blank" rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                      <Play className="w-3 h-3" /> ▶️ Watch completion video
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-accent/30 rounded-xl p-4 space-y-2 text-sm mb-4">
          <h3 className="font-heading font-bold text-foreground">Order Summary</h3>
          <div><span className="text-muted-foreground">Item:</span> <span className="text-foreground">{order.item_type}</span></div>
          {order.size && <div><span className="text-muted-foreground">Size:</span> <span className="text-foreground">{order.size}</span></div>}
          {order.embroidery_type && <div><span className="text-muted-foreground">Embroidery:</span> <span className="text-foreground">{order.embroidery_type}</span></div>}
          <div className="border-t border-border pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{order.total?.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Artisan Card */}
        {artisan && (
          <div className="bg-background border border-border rounded-xl p-4 space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <img src={artisan.profile_photo_url || "/placeholder.svg"} alt={artisan.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
              <div>
                <p className="font-semibold text-foreground">{artisan.name}</p>
                <p className="text-xs text-muted-foreground">{artisan.city}, {artisan.state} • {artisan.skill_type}</p>
              </div>
            </div>
            <a href={`https://wa.me/91${artisanCleanPhone}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full">
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp Artisan
              </Button>
            </a>
          </div>
        )}

        {/* Communication Guardrails */}
        {order.status !== "pending" && order.status !== "completed" && order.status !== "delivered" && order.status !== "reviewed" && (
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>💬 Communication is managed to protect artisan focus and order quality.</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/91${artisanCleanPhone}?text=${encodeURIComponent(`Hi! I'd like an update on my order #${orderId?.slice(0, 8)}`)}`}
                target="_blank" rel="noopener noreferrer" className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full text-xs">Request Update</Button>
              </a>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/report-issue/${orderId}`)}>
                Report Issue
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/change-address/${orderId}`)}>
                Change Address
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default OrderStatusPage;
