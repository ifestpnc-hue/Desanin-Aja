import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Palette } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Berhasil masuk!");
        navigate("/");
      } else {
        if (!fullName.trim()) {
          toast.error("Mohon isi nama lengkap.");
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-16 max-w-md">
        <div className="text-center mb-8">
          <Palette className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Masuk untuk mengelola pesanan desain Anda."
              : "Daftar untuk mulai memesan desain."}
          </p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "signup" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? "Memproses..."
                : mode === "login"
                ? "Masuk"
                : "Daftar"}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
