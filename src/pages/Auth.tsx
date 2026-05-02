import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Printer, Mail, Lock, User as UserIcon, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const signUpSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(100),
  studentId: z.string().trim().max(50).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const roleParam = (searchParams.get("role") === "staff" ? "staff" : "student") as "staff" | "student";
  const isStaffFlow = roleParam === "staff";
  const { user, isStaff, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Staff path is sign-in only — force signin mode if user toggles via URL
  useEffect(() => {
    if (isStaffFlow && mode === "signup") setMode("signin");
  }, [isStaffFlow, mode]);
  const [displayName, setDisplayName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already-authenticated users
  useEffect(() => {
    if (authLoading || !user) return;
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
    if (from) navigate(from, { replace: true });
    else navigate(isStaff ? "/staff" : "/student", { replace: true });
  }, [user, isStaff, authLoading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ displayName, studentId, email, password });
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: parsed.data.displayName,
              student_id: parsed.data.studentId || null,
            },
          },
        });
        if (signUpError) {
          if (signUpError.message.toLowerCase().includes("already")) {
            setError("This email is already registered. Please sign in.");
          } else {
            setError(signUpError.message);
          }
          return;
        }
        toast.success("Account created! You're signed in.");
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (signInError) {
          setError(signInError.message.includes("Invalid") ? "Invalid email or password" : signInError.message);
          return;
        }
        toast.success("Welcome back!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
    // If redirected, browser navigates away
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              {isStaffFlow ? (
                <ShieldCheck className="h-10 w-10 text-primary" />
              ) : (
                <Printer className="h-10 w-10 text-primary" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isStaffFlow
                ? "Staff sign in"
                : mode === "signin"
                ? "Welcome back"
                : "Create your student account"}
            </h1>
            <p className="text-muted-foreground">
              {isStaffFlow
                ? "Restricted area. Use your authorised staff credentials."
                : mode === "signin"
                ? "Sign in to submit and track print orders"
                : "Sign up to submit print orders"}
            </p>
          </div>

          <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!isStaffFlow && mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium">Full name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-background border border-input rounded-md pl-10 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="studentId" className="text-sm font-medium">Student ID</label>
                    <input
                      id="studentId"
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full bg-background border border-input rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="e.g. 2024-CSE-101"
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-input rounded-md pl-10 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-input rounded-md pl-10 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
                    required
                    minLength={mode === "signup" ? 8 : undefined}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <span className="text-destructive">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium transition-all hover:bg-primary/90 disabled:opacity-60"
              >
                {loading
                  ? "Please wait…"
                  : isStaffFlow
                  ? "Sign in as staff"
                  : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full border border-input bg-background hover:bg-secondary py-2.5 rounded-md font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          </div>

          <div className="mt-6 text-center space-y-2">
            {isStaffFlow ? (
              <p className="text-sm text-muted-foreground">
                Staff accounts are provisioned by the administrator.{" "}
                <Link to="/auth?role=student" className="text-primary hover:underline">
                  Student sign in
                </Link>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
                className="text-sm text-primary hover:underline"
              >
                {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
            <div>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Return to Home</Link>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;