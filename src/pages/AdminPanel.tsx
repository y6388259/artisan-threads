import { useState, useEffect } from "react";
import { Check, X, ShieldCheck, LogOut, Users, Clock, UserCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASSWORD = "embroidery2026";

const AdminPanel = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [pendingRes, approvedRes] = await Promise.all([
      supabase.from("artisans").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("artisans").select("*").eq("status", "approved").order("created_at", { ascending: false }),
    ]);

    if (pendingRes.data) setPending(pendingRes.data);
    if (approvedRes.data) setApproved(approvedRes.data);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("artisans").update({ status: "approved" }).eq("id", id);
    if (error) toast.error("Failed to approve");
    else { toast.success("Artisan approved ✅"); fetchData(); }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("artisans").delete().eq("id", id);
    if (error) toast.error("Failed to reject");
    else { toast.success("Artisan removed"); fetchData(); }
  };

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("artisans").update({ status: "pending" }).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success("Moved back to pending"); fetchData(); }
  };

  if (!authenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
              <h1 className="font-heading text-xl font-bold text-foreground">EmbroideryVerse Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
              className="input-warm"
              placeholder="Enter admin password"
              required
            />
            {passwordError && <p className="text-sm text-red-500 text-center">Incorrect password</p>}
            <button type="submit" className="btn-primary w-full text-center">Enter Admin Panel</button>
          </form>
        </div>
      </Layout>
    );
  }

  const totalCount = pending.length + approved.length;

  return (
    <Layout>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">Admin Panel 🛡️</h1>
          <button onClick={() => setAuthenticated(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card-warm p-4 text-center">
            <Clock className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="card-warm p-4 text-center">
            <UserCheck className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{approved.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="card-warm p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {loading && <p className="text-muted-foreground py-8 text-center">Loading...</p>}

        {!loading && (
          <>
            {/* Pending section */}
            <section className="mb-8">
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">Pending Approval</h2>
              {pending.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending artisans 🎉</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-3 font-medium text-foreground">Name</th>
                        <th className="py-2 pr-3 font-medium text-foreground">City</th>
                        <th className="py-2 pr-3 font-medium text-foreground">State</th>
                        <th className="py-2 pr-3 font-medium text-foreground">Skill</th>
                        <th className="py-2 pr-3 font-medium text-foreground">WhatsApp</th>
                        <th className="py-2 pr-3 font-medium text-foreground">Exp</th>
                        <th className="py-2 pr-3 font-medium text-foreground">Price</th>
                        <th className="py-2 pr-3 font-medium text-foreground">Registered</th>
                        <th className="py-2 font-medium text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((a) => (
                        <tr key={a.id} className="border-b border-border/50">
                          <td className="py-3 pr-3 text-foreground font-medium">{a.name}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{a.city}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{a.state}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{a.skill_type}</td>
                          <td className="py-3 pr-3">
                            <a href={`https://wa.me/91${a.whatsapp_number?.replace(/\D/g, "").replace(/^91/, "")}`}
                              target="_blank" rel="noopener noreferrer" className="text-primary underline">
                              {a.whatsapp_number}
                            </a>
                          </td>
                          <td className="py-3 pr-3 text-muted-foreground">{a.years_experience || "—"} yrs</td>
                          <td className="py-3 pr-3 text-muted-foreground">₹{a.price_min}-₹{a.price_max}</td>
                          <td className="py-3 pr-3 text-muted-foreground text-xs">
                            {a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN") : "—"}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(a.id)}
                                className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium flex items-center gap-1 hover:bg-green-700 transition-colors">
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button onClick={() => handleReject(a.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium flex items-center gap-1 hover:bg-red-700 transition-colors">
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Approved section */}
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">Approved Artisans</h2>
              {approved.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No approved artisans yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-3 font-medium text-foreground">Photo</th>
                        <th className="py-2 pr-3 font-medium text-foreground">Name</th>
                        <th className="py-2 pr-3 font-medium text-foreground">City</th>
                        <th className="py-2 pr-3 font-medium text-foreground">Skill</th>
                        <th className="py-2 pr-3 font-medium text-foreground">WhatsApp</th>
                        <th className="py-2 font-medium text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approved.map((a) => (
                        <tr key={a.id} className="border-b border-border/50">
                          <td className="py-3 pr-3">
                            <img src={a.profile_photo_url || "/placeholder.svg"} alt={a.name}
                              className="w-8 h-8 rounded-full object-cover" />
                          </td>
                          <td className="py-3 pr-3 text-foreground font-medium">{a.name}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{a.city}, {a.state}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{a.skill_type}</td>
                          <td className="py-3 pr-3">
                            <a href={`https://wa.me/91${a.whatsapp_number?.replace(/\D/g, "").replace(/^91/, "")}`}
                              target="_blank" rel="noopener noreferrer" className="text-primary underline">
                              {a.whatsapp_number}
                            </a>
                          </td>
                          <td className="py-3">
                            <button onClick={() => handleRemove(a.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium flex items-center gap-1 hover:bg-red-700 transition-colors">
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;
