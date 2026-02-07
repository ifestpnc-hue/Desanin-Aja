import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";
import { categoryLabels } from "@/data/services";

interface Order {
  id: string;
  items: { name: string; category: string; price: number }[];
  form: { brandName: string; paymentOption: string };
  totalPrice: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  "Menunggu Pembayaran": "bg-warning/10 text-warning border-warning/20",
  "Dalam Proses": "bg-info/10 text-info border-info/20",
  "Selesai": "bg-success/10 text-success border-success/20",
  "Dibatalkan": "bg-destructive/10 text-destructive border-destructive/20",
};

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("kv-orders") || "[]");
    setOrders(stored);
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  const filtered = search
    ? orders.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.form.brandName.toLowerCase().includes(search.toLowerCase()))
    : orders;

  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Status Pesanan</h1>
        <p className="text-muted-foreground mb-8">Pantau progress pesanan desain Anda.</p>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Cari berdasarkan ID pesanan atau nama brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Belum Ada Pesanan</h3>
            <p className="text-sm text-muted-foreground">
              {search ? "Pesanan tidak ditemukan." : "Pesanan yang Anda buat akan muncul di sini."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div key={order.id} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground">ID Pesanan</span>
                    <h3 className="font-bold">{order.id}</h3>
                  </div>
                  <Badge variant="outline" className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mb-2">
                  Brand: <span className="font-medium text-foreground">{order.form.brandName}</span>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.name}{" "}
                        <span className="text-muted-foreground">
                          ({categoryLabels[item.category] || item.category})
                        </span>
                      </span>
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold text-primary">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderStatusPage;
