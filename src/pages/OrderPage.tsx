import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Send } from "lucide-react";
import { categoryLabels } from "@/data/services";
import { toast } from "sonner";

const OrderPage = () => {
  const { items, totalPrice, discount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brandName: "",
    brief: "",
    style: "",
    deadline: "",
    reference: "",
    paymentOption: "full",
  });

  const discountAmount = Math.round(totalPrice * (discount / 100));
  const finalPrice = totalPrice - discountAmount;

  const hasStandarOrPro = items.some((i) => i.category === "standar" || i.category === "profesional");

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brandName || !form.brief || !form.deadline) {
      toast.error("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    const orderId = `KV-${Date.now().toString(36).toUpperCase()}`;

    // Store order in localStorage for demo
    const order = {
      id: orderId,
      items,
      form,
      totalPrice: finalPrice,
      paymentOption: form.paymentOption,
      status: "Menunggu Pembayaran",
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("kv-orders") || "[]");
    orders.push(order);
    localStorage.setItem("kv-orders", JSON.stringify(orders));

    clearCart();
    toast.success(`Pesanan ${orderId} berhasil dibuat!`);
    navigate("/status-pesanan");
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-6">Tambahkan layanan terlebih dahulu.</p>
          <Button onClick={() => navigate("/layanan")}>Lihat Layanan</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Form Pemesanan</h1>
        <p className="text-muted-foreground mb-8">Lengkapi detail project Anda sebelum melanjutkan pembayaran.</p>

        {/* Consultation reminder */}
        <div className="rounded-lg bg-accent border border-primary/20 p-4 mb-8 flex gap-3 items-center">
          <AlertCircle className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-accent-foreground">
            Pastikan Anda sudah konsultasi dengan admin sebelum submit pesanan.{" "}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary font-medium"
            >
              Chat Admin
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Detail Desain</h3>

            <div>
              <Label htmlFor="brandName">Nama Brand / Bisnis *</Label>
              <Input
                id="brandName"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                placeholder="Contoh: Kopi Nusantara"
              />
            </div>

            <div>
              <Label htmlFor="brief">Design Brief *</Label>
              <Textarea
                id="brief"
                value={form.brief}
                onChange={(e) => setForm({ ...form, brief: e.target.value })}
                placeholder="Jelaskan kebutuhan desain Anda secara detail..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="style">Gaya Desain yang Diinginkan</Label>
              <Input
                id="style"
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
                placeholder="Contoh: minimalis, playful, premium"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="reference">Link Referensi (opsional)</Label>
              <Input
                id="reference"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Payment option */}
          {hasStandarOrPro && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold mb-3">Opsi Pembayaran</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Paket Standar & Profesional dapat memilih DP 50% atau bayar penuh.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paymentOption: "full" })}
                  className={`flex-1 p-4 rounded-lg border text-sm font-medium transition-colors ${
                    form.paymentOption === "full"
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-bold">Bayar Penuh</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatPrice(finalPrice)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paymentOption: "dp50" })}
                  className={`flex-1 p-4 rounded-lg border text-sm font-medium transition-colors ${
                    form.paymentOption === "dp50"
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-bold">DP 50%</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatPrice(Math.round(finalPrice / 2))} sekarang</div>
                </button>
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
            <div className="space-y-2 text-sm">
              {items.map((item, i) => (
                <div key={`${item.id}-${i}`} className="flex justify-between">
                  <span>
                    {item.name}{" "}
                    <span className="text-muted-foreground">({categoryLabels[item.category]})</span>
                  </span>
                  <span>{formatPrice(item.price)}</span>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Diskon ({discount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>
                  {form.paymentOption === "dp50" && hasStandarOrPro ? "DP 50%" : "Total"}
                </span>
                <span className="text-primary">
                  {formatPrice(form.paymentOption === "dp50" && hasStandarOrPro ? Math.round(finalPrice / 2) : finalPrice)}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2">
            <Send className="h-4 w-4" /> Kirim Pesanan
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default OrderPage;
