import { Link } from "react-router-dom";
import { Trash2, ArrowRight, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { categoryLabels, categoryColors } from "@/data/services";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useState } from "react";
import { toast } from "sonner";

const CartPage = () => {
  const { items, removeItem, totalPrice, couponCode, setCouponCode, discount, applyCoupon, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState(couponCode);

  const discountAmount = Math.round(totalPrice * (discount / 100));
  const finalPrice = totalPrice - discountAmount;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  const handleApplyCoupon = () => {
    setCouponCode(couponInput);
    setTimeout(() => {
      const success = applyCoupon();
      if (success) toast.success("Kupon berhasil diterapkan!");
      else toast.error("Kupon tidak valid.");
    }, 0);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-6">Belum ada layanan yang ditambahkan.</p>
          <Link to="/layanan">
            <Button>Jelajahi Layanan</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Keranjang</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => (
              <div key={`${item.id}-${i}`} className="glass-card rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant="outline" className={categoryColors[item.category]}>
                      {categoryLabels[item.category]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6 h-fit space-y-4">
            <h3 className="font-semibold text-lg">Ringkasan</h3>

            {/* Coupon */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Kupon Diskon</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Masukkan kode"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {discount > 0 && (
                <p className="text-xs text-success mt-1">Diskon {discount}% diterapkan!</p>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Diskon ({discount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>Total</span>
                <span className="text-primary">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            <div className="rounded-lg bg-accent p-3 flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-accent-foreground">
                Wajib konsultasi sebelum melanjutkan ke pembayaran.
              </p>
            </div>

            <Link to="/pesan" className="block">
              <Button className="w-full gap-2">
                Lanjut ke Pemesanan <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
