import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Use getUser() instead of getClaims()
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = userData.user;

    const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
    const MIDTRANS_CLIENT_KEY = Deno.env.get("MIDTRANS_CLIENT_KEY");

    if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {
      return new Response(
        JSON.stringify({ error: "Midtrans belum dikonfigurasi." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { order_id, order_code, amount, brand_name, items, payment_type } =
      await req.json();

    if (!order_id || !order_code || !amount) {
      return new Response(
        JSON.stringify({ error: "Data pesanan tidak lengkap." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine Midtrans API URL (sandbox vs production based on key prefix)
    const serverKeyPrefix = MIDTRANS_SERVER_KEY.substring(0, 10);
    console.log("Server key prefix:", serverKeyPrefix);
    const isSandbox = MIDTRANS_SERVER_KEY.startsWith("SB-");
    const midtransUrl = isSandbox
      ? "https://app.sandbox.midtrans.com/snap/v1/transactions"
      : "https://app.midtrans.com/snap/v1/transactions";

    const midtransOrderId = `${order_code}-${Date.now()}`;

    const itemDetails: any[] = Array.isArray(items)
      ? items.map((item: any) => ({
          id: item.id || "item",
          price: item.price,
          quantity: 1,
          name: (item.name || "Layanan Desain").substring(0, 50),
        }))
      : [{ id: "order", price: amount, quantity: 1, name: "Layanan Desain" }];

    // Adjust for DP
    const totalFromItems = itemDetails.reduce(
      (sum: number, i: any) => sum + i.price,
      0
    );
    if (payment_type === "dp" && totalFromItems !== amount) {
      itemDetails.length = 0;
      itemDetails.push({
        id: "dp-payment",
        price: amount,
        quantity: 1,
        name: `DP 50% - ${brand_name}`.substring(0, 50),
      });
    }

    const payload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: amount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: brand_name || "Customer",
        email: user.email || "",
      },
    };

    console.log("Midtrans request payload:", JSON.stringify(payload));
    console.log("Using sandbox:", isSandbox);

    const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
    const response = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Midtrans returned non-JSON:", text.substring(0, 300));
      return new Response(
        JSON.stringify({ error: "Midtrans returned invalid response." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("Midtrans error:", JSON.stringify(result));
      return new Response(
        JSON.stringify({
          error: `Midtrans error: ${result.error_messages?.join(", ") || JSON.stringify(result)}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update order with Midtrans data
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        midtrans_order_id: midtransOrderId,
        midtrans_snap_token: result.token,
      })
      .eq("id", order_id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
    }

    return new Response(
      JSON.stringify({
        snap_token: result.token,
        redirect_url: result.redirect_url,
        client_key: MIDTRANS_CLIENT_KEY,
        is_sandbox: isSandbox,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
