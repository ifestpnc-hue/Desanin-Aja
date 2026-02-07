import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pesan berhasil dikirim! Kami akan segera merespons.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Hubungi Kami</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Punya pertanyaan atau ingin konsultasi? Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Info Kontak</h3>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary" />
                <span>halo@kreasivisual.id</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-primary" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890?text=Halo%20KreasiVisual!"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" /> Chat via WhatsApp
              </Button>
            </a>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Kirim Pesan</h3>
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama Anda"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Pesan</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tulis pesan Anda..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Send className="h-4 w-4" /> Kirim Pesan
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
