import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColors } from "@/lib/orderStatuses";
import { categoryLabels } from "@/data/services";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  order_code: string;
  items: any[];
  brand_name: string;
  payment_option: string;
  total_price: number;
  dp_amount: number | null;
  status: string;
  midtrans_snap_token: string | null;
}

const PaymentPage = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  const loadOrder = useCallback(async () => {
    if (!user || !orderCode) return;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_code", orderCode)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) {
      toast.error("Pesanan tidak ditemukan.");
      navigate("/status-pesanan");
      return;
    }
    setOrder(data as Order);
    setLoading(false);
  }, [user, orderCode, navigate]);

  useEffect(() => {
    if (!authLoading && user) loadOrder();
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, loadOrder, navigate]);

  const handlePayment = async () => {
    if (!order) return;
    setPaying(true);

    try {
      // Call edge function to create Midtrans transaction
      const { data, error } = await supabase.functions.invoke("create-midtrans-transaction", {
        body: {
          order_id: order.id,
          order_code: order.order_code,
          amount: order.payment_option === "dp50" ? (order.dp_amount || Math.round(order.total_price / 2)) : order.total_price,
          brand_name: order.brand_name,
          items: order.items,
          payment_type: order.payment_option === "dp50" ? "dp" : "full",
        },
      });

      if (error) throw error;

      const { snap_token, client_key } = data;

      if (!snap_token) {
        throw new Error("Gagal mendapatkan token pembayaran.");
      }

      // Load Midtrans Snap
      const snapUrl = client_key?.startsWith("SB-")
        ? "https://app.sandbox.midtrans.com/snap/snap.js"
        : "https://app.midtrans.com/snap/snap.js";

      await loadSnapScript(snapUrl, client_key);

      // Open Snap popup
      (window as any).snap.pay(snap_token, {
        onSuccess: async () => {
          await supabase
            .from("orders")
            .update({ status: "Sedang Diverifikasi", midtrans_snap_token: snap_token })
            .eq("id", order.id);
          toast.success("Pembayaran berhasil! Sedang diverifikasi.");
          navigate("/status-pesanan");
        },
        onPending: async () => {
          toast.info("Pembayaran pending. Silakan selesaikan pembayaran.");
          navigate("/status-pesanan");
        },
        onError: () => {
          toast.error("Pembayaran gagal. Silakan coba lagi.");
          setPaying(false);
        },
        onClose: () => {
          setPaying(false);
        },
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Gagal memproses pembayaran.");
      setPaying(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Memuat pesanan...</p>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const payAmount =
    order.payment_option === "dp50"
      ? order.dp_amount || Math.round(order.total_price / 2)
      : order.total_price;

  return (
    <Layout>
      <div className="container py-12 max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Pembayaran</h1>
        <p className="text-muted-foreground mb-8">Selesaikan pembayaran untuk pesanan Anda.</p>

        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">ID Pesanan</p>
              <p className="font-bold">{order.order_code}</p>
            </div>
            <Badge variant="outline" className={statusColors[order.status] || ""}>
              {order.status}
            </Badge>
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Brand</span>
              <span className="text-foreground font-medium">{order.brand_name}</span>
            </div>
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

            <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
              <span>{order.payment_option === "dp50" ? "DP 50%" : "Total"}</span>
              <span className="text-primary">{formatPrice(payAmount)}</span>
            </div>
          </div>

          {order.status === "Menunggu Pembayaran" || order.status === "Menunggu Pembayaran DP" ? (
            <Button
              onClick={handlePayment}
              disabled={paying}
              className="w-full gap-2"
              size="lg"
            >
              {paying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {paying ? "Memproses..." : `Bayar ${formatPrice(payAmount)}`}
            </Button>
          ) : (
            <div className="rounded-lg bg-accent p-4 flex gap-3 items-center">
              <AlertCircle className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm">
                Pembayaran sudah diproses atau pesanan tidak memerlukan pembayaran saat ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

function loadSnapScript(url: string, clientKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).snap) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap."));
    document.head.appendChild(script);
  });
}

export default PaymentPage;
