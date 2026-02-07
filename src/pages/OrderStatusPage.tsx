import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, MessageSquare, CreditCard, LogIn } from "lucide-react";
import { categoryLabels } from "@/data/services";
import { statusColors, statusDescriptions } from "@/lib/orderStatuses";

interface Order {
  id: string;
  order_code: string;
  items: any[];
  brand_name: string;
  payment_option: string;
  total_price: number;
  dp_amount: number | null;
  status: string;
  created_at: string;
}

const OrderStatusPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    loadOrders();
  }, [user]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  const filtered = search
    ? orders.filter(
        (o) =>
          o.order_code.toLowerCase().includes(search.toLowerCase()) ||
          o.brand_name.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <LogIn className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Masuk Terlebih Dahulu</h1>
          <p className="text-muted-foreground mb-6">Masuk untuk melihat status pesanan Anda.</p>
          <Button onClick={() => navigate("/auth")}>Masuk / Daftar</Button>
        </div>
      </Layout>
    );
  }

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

        {loading ? (
          <p className="text-center text-muted-foreground py-8">Memuat pesanan...</p>
        ) : filtered.length === 0 ? (
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
                    <h3 className="font-bold">{order.order_code}</h3>
                  </div>
                  <Badge variant="outline" className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>

                {/* Status description */}
                {statusDescriptions[order.status] && (
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    {statusDescriptions[order.status]}
                  </p>
                )}

                <div className="text-sm text-muted-foreground mb-2">
                  Brand: <span className="font-medium text-foreground">{order.brand_name}</span>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  {Array.isArray(order.items) &&
                    order.items.map((item: any, i: number) => (
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
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold text-primary">{formatPrice(order.total_price)}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  {(order.status === "Menunggu Pembayaran" || order.status === "Menunggu Pembayaran DP" || order.status === "Menunggu Pembayaran Akhir") && (
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => navigate(`/pembayaran/${order.order_code}`)}
                    >
                      <CreditCard className="h-3.5 w-3.5" /> Bayar Sekarang
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => navigate(`/chat?order=${order.order_code}`)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Chat Admin
                  </Button>
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
