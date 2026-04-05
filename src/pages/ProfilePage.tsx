import { useState } from "react";
import { LogOut, Heart, ShoppingBag, Mail, Lock, User } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, loading, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to verify.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      }
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  // STATE 2 — Logged in
  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

    return (
      <Layout>
        <div className="px-4 py-6 max-w-lg mx-auto">
          {/* User info */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Saved Artisans */}
          <section className="card-warm p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-foreground">Saved Artisans</h2>
            </div>
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No saved artisans yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Browse artisans and save your favourites here ❤️</p>
            </div>
          </section>

          {/* My Orders */}
          <section className="card-warm p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-foreground">My Orders</h2>
            </div>
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No orders yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Your order history will appear here 🧵</p>
            </div>
          </section>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-outline-primary w-full flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <Footer />
      </Layout>
    );
  }

  // STATE 1 — Not logged in
  return (
    <Layout>
      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isSignUp ? "Create Account 🧵" : "Join EmbroideryVerse 🙏"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Sign up to save artisans & track orders" : "Login to your account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-warm pl-10"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-warm pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-warm pl-10"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full text-center disabled:opacity-50">
            {submitting ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
        </div>

        <button
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: window.location.origin + "/profile" },
            });
            if (error) toast.error(error.message);
          }}
          className="btn-outline-primary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium">
            {isSignUp ? "Login" : "Create Account"}
          </button>
        </p>
      </div>
      <Footer />
    </Layout>
  );
};

export default ProfilePage;
