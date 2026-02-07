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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
    const isSandbox = MIDTRANS_SERVER_KEY.startsWith("SB-");
    const midtransUrl = isSandbox
      ? "https://app.sandbox.midtrans.com/snap/v1/transactions"
      : "https://app.midtrans.com/snap/v1/transactions";

    const midtransOrderId = `${order_code}-${Date.now()}`;

    const itemDetails = Array.isArray(items)
      ? items.map((item: any) => ({
          id: item.id || "item",
          price: item.price,
          quantity: 1,
          name: item.name?.substring(0, 50) || "Layanan Desain",
        }))
      : [{ id: "order", price: amount, quantity: 1, name: "Layanan Desain" }];

    // Adjust for DP
    const totalFromItems = itemDetails.reduce(
      (sum: number, i: any) => sum + i.price,
      0
    );
    if (payment_type === "dp" && totalFromItems !== amount) {
      // Replace with single DP line item
      itemDetails.length = 0;
      itemDetails.push({
        id: "dp-payment",
        price: amount,
        quantity: 1,
        name: `DP 50% - ${brand_name}`,
      });
    }

    const payload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: amount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: brand_name,
        email: claimsData.claims.email || "",
      },
    };

    const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
    const response = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Midtrans error:", result);
      return new Response(
        JSON.stringify({
          error: `Midtrans error: ${JSON.stringify(result)}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update order with Midtrans data
    await supabase
      .from("orders")
      .update({
        midtrans_order_id: midtransOrderId,
        midtrans_snap_token: result.token,
      })
      .eq("id", order_id);

    return new Response(
      JSON.stringify({
        snap_token: result.token,
        redirect_url: result.redirect_url,
        client_key: MIDTRANS_CLIENT_KEY,
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
